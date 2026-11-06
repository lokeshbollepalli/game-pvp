"use strict";

const crypto = require("node:crypto");
const http = require("node:http");
const path = require("node:path");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  maxHttpBufferSize: 64 * 1024,
  pingInterval: 10000,
  pingTimeout: 20000
});

const rooms = new Map();
const MAX_ROOMS = 2000;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INPUT_CODES = new Set([
  "KeyA", "KeyD", "KeyW", "KeyS", "KeyF", "KeyG", "KeyH",
  "ShiftLeft", "ShiftRight", "Space"
]);

app.get("/health", (_request, response) => response.json({ ok: true, activeRooms: rooms.size }));
app.get("/", (_request, response) => response.sendFile(path.join(__dirname, "index.html")));
app.get("/style.css", (_request, response) => response.sendFile(path.join(__dirname, "style.css")));
app.get("/game.js", (_request, response) => response.sendFile(path.join(__dirname, "game.js")));

function makeRoomCode() {
  let code;
  do {
    const bytes = crypto.randomBytes(6);
    code = Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
  } while (rooms.has(code));
  return code;
}

function roomFor(socket) {
  const code = socket.data.roomCode;
  return code && rooms.get(code);
}

function closeRoom(code, message) {
  const room = rooms.get(code);
  if (!room) return;
  io.to(code).emit("room-closed", { message });
  const sockets = io.sockets.adapter.rooms.get(code);
  if (sockets) {
    Array.from(sockets).forEach((id) => {
      const member = io.sockets.sockets.get(id);
      if (!member) return;
      member.leave(code);
      member.data.roomCode = null;
      member.data.role = null;
    });
  }
  rooms.delete(code);
}

io.on("connection", (socket) => {
  socket.on("create-room", (reply) => {
    const respond = typeof reply === "function" ? reply : () => {};
    if (roomFor(socket)) respond({ ok: false, error: "Leave your current room before creating another." });
    else if (rooms.size >= MAX_ROOMS) respond({ ok: false, error: "The room service is full. Please try again later." });
    else {
      const code = makeRoomCode();
      const room = { code, hostId: socket.id, guestId: null };
      rooms.set(code, room);
      socket.data.roomCode = code;
      socket.data.role = 0;
      socket.join(code);
      respond({ ok: true, code, role: 0 });
    }
  });

  socket.on("join-room", (input, reply = () => {}) => {
    const respond = typeof reply === "function" ? reply : () => {};
    if (roomFor(socket)) return respond({ ok: false, error: "Leave your current room before joining another." });
    const code = typeof input === "string" ? input.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
    const room = rooms.get(code);
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code) || !room) return respond({ ok: false, error: "That room code wasn't found. Check it and try again." });
    if (room.guestId) return respond({ ok: false, error: "That room is already full." });
    room.guestId = socket.id;
    socket.data.roomCode = code;
    socket.data.role = 1;
    socket.join(code);
    io.to(room.hostId).emit("peer-joined", { role: 1 });
    socket.emit("peer-joined", { role: 1 });
    respond({ ok: true, code, role: 1 });
  });

  socket.on("input", (packet) => {
    const room = roomFor(socket);
    if (!room || socket.data.role !== 1 || !room.guestId || room.hostId === socket.id) return;
    if (!packet || typeof packet.code !== "string" || !INPUT_CODES.has(packet.code) || typeof packet.down !== "boolean") return;
    const now = Date.now();
    if (!socket.data.inputWindowStart || now - socket.data.inputWindowStart >= 100) {
      socket.data.inputWindowStart = now;
      socket.data.inputCount = 0;
    }
    socket.data.inputCount += 1;
    if (socket.data.inputCount > 30) return;
    io.to(room.hostId).emit("remote-input", { code: packet.code, down: packet.down });
  });

  socket.on("rematch-request", () => {
    const room = roomFor(socket);
    if (!room || socket.data.role !== 1 || !room.hostId) return;
    io.to(room.hostId).emit("rematch-request");
  });

  socket.on("fighter-config", (config) => {
    const room = roomFor(socket);
    if (!room || socket.data.role !== 1 || !room.hostId) return;
    if (!config || typeof config !== "object") return;
    const fighter = typeof config.fighter === "string" && /^[a-z]+$/.test(config.fighter) ? config.fighter : "";
    const name = typeof config.name === "string" ? config.name.replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 12) : "";
    const color = typeof config.color === "string" && /^#[\da-f]{6}$/i.test(config.color) ? config.color : "";
    if (!fighter || !color) return;
    io.to(room.hostId).emit("fighter-config", { fighter, name, color });
  });

  socket.on("game-state", (snapshot) => {
    const room = roomFor(socket);
    if (!room || socket.data.role !== 0 || !room.guestId) return;
    if (!snapshot || typeof snapshot !== "object" || !Array.isArray(snapshot.fighters) || snapshot.fighters.length !== 2) return;
    socket.to(room.code).emit("game-state", snapshot);
  });

  socket.on("leave-room", () => {
    const room = roomFor(socket);
    if (room) closeRoom(room.code, "A player left the room.");
    socket.data.roomCode = null;
    socket.data.role = null;
  });

  socket.on("disconnect", () => {
    const room = roomFor(socket);
    if (room) closeRoom(room.code, "The other player disconnected.");
  });
});

const port = Number(process.env.PORT) || 3000;
httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Gali Rivals ready on port ${port}`);
});
