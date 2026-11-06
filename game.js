(() => {
  "use strict";

  const FIGHTERS = [
    {
      id: "nova", name: "Nova", title: "The Comet", color: "#ff4e83", style: "striker",
      bio: "A fearless rushdown fighter who turns every opening into a flash of light.",
      stats: { power: 3, speed: 5, reach: 3 },
      moves: { punch: ["Comet Jab", 8], kick: ["Meteor Kick", 13], special: ["Starfall", 19] },
      palette: ["#ffe0d1", "#182038", "#ff4e83"]
    },
    {
      id: "rook", name: "Rook", title: "The Wall", color: "#37e6d0", style: "heavy",
      bio: "A granite guard with crushing counterstrikes. Slow steps. No small hits.",
      stats: { power: 5, speed: 2, reach: 4 },
      moves: { punch: ["Breaker", 12], kick: ["Fault Line", 16], special: ["Iron Comet", 23] },
      palette: ["#e8c5a6", "#26363c", "#37e6d0"]
    },
    {
      id: "vesper", name: "Vesper", title: "The Phantom", color: "#b58cff", style: "agile",
      bio: "A blink-and-you-miss-it trickster. Quick hands, longer combos, zero hesitation.",
      stats: { power: 2, speed: 5, reach: 4 },
      moves: { punch: ["Ghost Tap", 7], kick: ["Night Sweep", 11], special: ["Afterimage", 17] },
      palette: ["#e3d6ff", "#24243c", "#b58cff"]
    },
    {
      id: "ember", name: "Ember", title: "The Wildfire", color: "#ff9d45", style: "mystic",
      bio: "A street-born firestarter. Mid-range pressure keeps rivals guessing.",
      stats: { power: 4, speed: 3, reach: 5 },
      moves: { punch: ["Flare Fist", 10], kick: ["Cinder Arc", 14], special: ["Sunburst", 21] },
      palette: ["#ffd7af", "#39221f", "#ff9d45"]
    }
  ];
  const ATTACKS = {
    jab: { category: "punch", duration: .31, start: .07, end: .18, range: 76, cooldown: .2, knockback: 12, damage: .78 },
    cross: { category: "punch", duration: .4, start: .12, end: .25, range: 88, cooldown: .3, knockback: 19, damage: 1 },
    uppercut: { category: "punch", duration: .52, start: .16, end: .32, range: 83, cooldown: .48, knockback: 24, damage: 1.2 },
    elbow: { category: "punch", duration: .46, start: .13, end: .28, range: 70, cooldown: .38, knockback: 22, damage: 1.15 },
    lowKick: { category: "kick", duration: .48, start: .14, end: .29, range: 96, cooldown: .4, knockback: 18, damage: .93 },
    upperKick: { category: "kick", duration: .58, start: .18, end: .37, range: 112, cooldown: .52, knockback: 27, damage: 1.13 },
    roundhouse: { category: "kick", duration: .61, start: .2, end: .4, range: 108, cooldown: .55, knockback: 30, damage: 1.18 },
    frontKick: { category: "kick", duration: .44, start: .13, end: .28, range: 99, cooldown: .37, knockback: 20, damage: .94 },
    special: { category: "special", duration: .82, start: .3, end: .51, range: 145, cooldown: 1.1, knockback: 42, damage: 1 }
  };
  const BOT_MOVES = [
    { id: "jab", label: "JAB" }, { id: "cross", label: "CROSS" },
    { id: "uppercut", label: "UPPERCUT" }, { id: "elbow", label: "ELBOW" },
    { id: "upperKick", label: "HIGH KICK" }, { id: "lowKick", label: "LOW KICK" },
    { id: "roundhouse", label: "ROUNDHOUSE" }, { id: "frontKick", label: "FRONT KICK" },
    { id: "special", label: "SPECIAL" }, { id: "guard", label: "GUARD" },
    { id: "retreat", label: "RETREAT" }, { id: "dashIn", label: "DASH IN" },
    { id: "jumpIn", label: "JUMP IN" }, { id: "feint", label: "FEINT" }
  ];
  const ARENA_THEMES = {
    mumbai: { sky: ["#314b69", "#e7a56f"], glow: "#ffd27a", city: ["#4d5260", "#977261"], floor: "#77604f", label: "MUMBAI / LOCAL LINE" },
    delhi: { sky: ["#41485f", "#e5aa78"], glow: "#ffd59a", city: ["#554845", "#a57d5f"], floor: "#796553", label: "OLD DELHI / ROOFTOPS" },
    jaipur: { sky: ["#874e67", "#efa078"], glow: "#ffe1a3", city: ["#7d5963", "#c18175"], floor: "#936b62", label: "JAIPUR / PINK SUNSET" },
    monsoon: { sky: ["#29394c", "#586777"], glow: "#d0d5c6", city: ["#3c4651", "#73746f"], floor: "#4d555b", label: "MONSOON / BAARISH" }
  };
  const canvas = document.querySelector("#arena");
  const ctx = canvas.getContext("2d");
  const ui = {
    health: [document.querySelector("#health-1"), document.querySelector("#health-2")],
    healthText: [document.querySelector("#health-text-1"), document.querySelector("#health-text-2")],
    names: [document.querySelector("#hud-name-1"), document.querySelector("#hud-name-2")],
    titles: [document.querySelector("#hud-title-1"), document.querySelector("#hud-title-2")],
    wins: [document.querySelector("#wins-1"), document.querySelector("#wins-2")],
    selectors: [document.querySelector("#fighter-1"), document.querySelector("#fighter-2")],
    namesInput: [document.querySelector("#name-1"), document.querySelector("#name-2")],
    colors: [document.querySelector("#color-1"), document.querySelector("#color-2")],
    bios: [document.querySelector("#bio-1"), document.querySelector("#bio-2")],
    stats: [document.querySelector("#stats-1"), document.querySelector("#stats-2")],
    count: [document.querySelector("#fighter-count-1"), document.querySelector("#fighter-count-2")],
    moveLabels: [document.querySelector("#move-1-label"), document.querySelector("#move-2-label"), document.querySelector("#move-3-label")],
    botMemory: document.querySelector("#bot-memory"),
    timer: document.querySelector("#timer"),
    round: document.querySelector("#round-number"),
    status: document.querySelector("#round-status"),
    overlay: document.querySelector("#result-overlay"),
    resultKicker: document.querySelector("#result-kicker"),
    resultTitle: document.querySelector("#result-title"),
    resultCopy: document.querySelector("#result-copy"),
    toast: document.querySelector("#toast"),
    flash: document.querySelector("#hit-flash"),
    victorySound: document.querySelector("#victory-sound"),
    arenaTheme: document.querySelector("#arena-theme"),
    arenaLocation: document.querySelector("#arena-location"),
    musicToggle: document.querySelector("#music-toggle"),
    musicLabel: document.querySelector("#music-label"),
    opponent: document.querySelector("#arena-opponent")
  };

  const state = {
    fighters: [],
    wins: [0, 0],
    round: 1,
    time: 60,
    phase: "fight",
    phaseTime: 0,
    winner: -1,
    lastTime: 0,
    elapsed: 0,
    shake: 0,
    particles: [],
    projectiles: [],
    keys: new Set(),
    audio: null,
    musicOn: false,
    musicTimer: 0,
    musicStep: 0,
    toastTimer: 0,
    ai: { nextMove: 1.3, recent: [] },
    arenaTheme: "mumbai",
    network: null,
    remoteKeys: new Set(),
    syncTimer: 0,
    configTimer: 0
  };

  function handleKey(index, code, down) {
    const keys = index === 0 ? state.keys : state.remoteKeys;
    if (down) {
      if (keys.has(code)) return;
      keys.add(code);
      if (code === "KeyA" || code === "KeyD") {
        const direction = code === "KeyD" ? 1 : -1;
        setAction(index, direction === state.fighters[index].facing ? "forward" : "back");
      }
      if (code === "Space") setAction(index, "jump");
      if (code === "ShiftLeft" || code === "ShiftRight") setAction(index, "crouch");
      if (code === "KeyF") setAction(index, keys.has("KeyW") ? "uppercut" : keys.has("KeyS") ? "jab" : "cross");
      if (code === "KeyG") setAction(index, keys.has("KeyW") ? "upperKick" : keys.has("KeyS") ? "lowKick" : "roundhouse");
      if (code === "KeyH") setAction(index, "special");
      return;
    }
    keys.delete(code);
    if (code === "ShiftLeft" || code === "ShiftRight") state.fighters[index].crouch = false;
  }

  function submitKey(code, down) {
    if (state.network && state.network.role === 1) {
      state.network.socket.emit("input", { code, down });
      if (down) state.keys.add(code);
      else state.keys.delete(code);
      return;
    }
    handleKey(0, code, down);
  }

  function restartMatch() {
    state.wins = [0, 0];
    state.round = 1;
    state.ai.recent = [];
    state.ai.nextMove = 1.3;
    ui.botMemory.textContent = "CPU READ // READY";
    ui.botMemory.dataset.recentMoves = "";
    state.fighters.forEach((fighter, index) => {
      if (state.network && index !== state.network.role) return;
      fighter.data = FIGHTERS.find((item) => item.id === ui.selectors[index].value);
      fighter.name = ui.namesInput[index].value.trim() || fighter.data.name;
      fighter.color = ui.colors[index].value;
    });
    resetRound(true);
    ui.resultTitle.style.color = "";
    showToast("NEW ROUND. SAME RIVALS.");
  }

  function makeFighter(index, id, name, color) {
    const data = FIGHTERS.find((fighter) => fighter.id === id) || FIGHTERS[index];
    return {
      index, data, name, color, x: index === 0 ? 295 : 705, baseY: 402,
      y: 402, vy: 0, health: 100, facing: index === 0 ? 1 : -1,
      attack: null, cooldown: 0, stun: 0, guard: false, crouch: false, guardTimer: 0,
      dash: 0, dashDirection: 0, walk: 0, hitBlink: 0, specialLock: 0
    };
  }

  function populateSelects() {
    ui.selectors.forEach((select, index) => {
      FIGHTERS.forEach((fighter, fighterIndex) => {
        const option = document.createElement("option");
        option.value = fighter.id;
        option.textContent = `${String(fighterIndex + 1).padStart(2, "0")}  /  ${fighter.name} - ${fighter.title}`;
        select.append(option);
      });
      select.value = index === 0 ? "nova" : "rook";
    });
  }

  function updateFighterCard(index) {
    const fighter = state.fighters[index];
    const data = fighter.data;
    ui.bios[index].textContent = data.bio;
    ui.count[index].textContent = `${String(FIGHTERS.indexOf(data) + 1).padStart(2, "0")} / 04`;
    ui.stats[index].innerHTML = ["power", "speed", "reach"].map((stat) =>
      `<span class="stat">${stat.toUpperCase()}<span class="stat-track"><i style="width:${data.stats[stat] * 20}%"></i></span></span>`
    ).join("");
    if (index === 0) {
      ui.moveLabels[0].textContent = data.moves.punch[0].toUpperCase();
      ui.moveLabels[1].textContent = data.moves.kick[0].toUpperCase();
      ui.moveLabels[2].textContent = data.moves.special[0].toUpperCase();
    }
    ui.names[index].textContent = fighter.name.toUpperCase();
    ui.titles[index].textContent = data.title.toUpperCase();
    ui.colors[index].value = fighter.color;
  }

  function setFighter(index, id, shouldReset = true) {
    const previous = state.fighters[index];
    const defaultName = (FIGHTERS.find((fighter) => fighter.id === id) || FIGHTERS[index]).name;
    const name = previous ? previous.name : defaultName;
    const color = previous ? previous.color : defaultName === "Nova" ? "#ff4e83" : "#37e6d0";
    const fighter = makeFighter(index, id, name, color);
    state.fighters[index] = fighter;
    ui.namesInput[index].value = name;
    updateFighterCard(index);
    if (shouldReset) resetRound(false);
  }

  function resetRound(announce = true) {
    const startPositions = [300, 700];
    state.fighters.forEach((fighter, index) => {
      fighter.x = startPositions[index];
      fighter.y = fighter.baseY;
      fighter.vy = 0;
      fighter.health = 100;
      fighter.attack = null;
      fighter.cooldown = 0;
      fighter.stun = 0;
      fighter.guard = false;
      fighter.crouch = false;
      fighter.guardTimer = 0;
      fighter.dash = 0;
      fighter.walk = 0;
      fighter.hitBlink = 0;
      fighter.specialLock = 0;
      fighter.facing = index === 0 ? 1 : -1;
    });
    state.projectiles = [];
    state.ai.nextMove = 1.3;
    state.time = 60;
    state.phase = "fight";
    state.phaseTime = 0;
    state.winner = -1;
    ui.overlay.hidden = true;
    ui.status.textContent = "FIGHT!";
    ui.status.style.color = "#fff";
    updateHud();
    if (announce) showToast("ROUND " + String(state.round).padStart(2, "0") + " - FIGHT!");
  }

  function updateHud() {
    state.fighters.forEach((fighter, index) => {
      const percent = Math.max(0, fighter.health);
      ui.health[index].style.width = `${percent}%`;
      ui.healthText[index].textContent = String(Math.ceil(percent));
      ui.names[index].textContent = fighter.name.toUpperCase();
    });
    ui.round.textContent = String(state.round).padStart(2, "0");
    ui.timer.textContent = String(Math.ceil(state.time)).padStart(2, "0");
    ui.wins.forEach((container, index) => {
      container.innerHTML = [0, 1].map((win) => `<i class="${win < state.wins[index] ? "won" : ""}"></i>`).join("");
    });
  }

  function showToast(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 1200);
  }

  const roomUi = {
    status: document.querySelector("#room-status"),
    create: document.querySelector("#create-room"),
    joinForm: document.querySelector("#join-room-form"),
    codeInput: document.querySelector("#room-code-input"),
    codeDisplay: document.querySelector("#room-code-display"),
    code: document.querySelector("#room-code"),
    copy: document.querySelector("#copy-room-code"),
    leave: document.querySelector("#leave-room"),
    roleLabel: document.querySelector("#fighter-label-2"),
    playerLabel: document.querySelector("#fighter-label-1")
  };
  let roomSocket = null;
  let socketIoPromise = null;

  function setRoomStatus(message) {
    roomUi.status.textContent = message;
  }

  function setRoomRole(role, code) {
    state.network = { socket: roomSocket, role, code };
    state.remoteKeys.clear();
    state.fighters[1].guard = false;
    state.fighters[1].crouch = false;
    state.fighters[1].attack = null;
    ui.names[1].textContent = state.fighters[1].name.toUpperCase();
    document.body.classList.toggle("online-player", role === 1);
    document.body.classList.toggle("online-host", role === 0);
    ui.arenaTheme.disabled = role === 1;
    document.querySelector(".p1-panel").hidden = role === 1;
    document.querySelector(".player-hud-right .player-tag").textContent = role === 0 ? "P2" : "YOU";
    ui.selectors.forEach((select, index) => {
      const localFighter = index === role;
      select.disabled = !localFighter;
      ui.namesInput[index].disabled = !localFighter;
      ui.colors[index].disabled = !localFighter;
    });
    roomUi.playerLabel.textContent = role === 0 ? "YOUR FIGHTER" : "ONLINE CHALLENGER";
    roomUi.roleLabel.textContent = role === 0 ? "WAITING FOR FRIEND" : "YOUR FIGHTER";
    roomUi.roleLabel.previousElementSibling.textContent = role === 0 ? "P2" : "YOU";
    ui.opponent.textContent = role === 0 ? "P2 / CONNECTING" : "P1 / ONLINE RIVAL";
    roomUi.codeDisplay.hidden = role !== 0;
    roomUi.leave.hidden = false;
    roomUi.code.textContent = role === 0 ? code : "";
    roomUi.create.disabled = true;
    roomUi.joinForm.querySelector("button").disabled = true;
    roomUi.codeInput.disabled = true;
    setRoomStatus(role === 0 ? "Room created. Share this code; the CPU pauses until your friend joins." : "Connected! You control the right-side fighter.");
    if (role === 0) {
      state.phase = "lobby";
      state.phaseTime = 0;
      ui.status.textContent = "WAITING FOR FRIEND";
      ui.timer.textContent = "--";
    } else {
      syncOwnFighter();
    }
  }

  function releaseRoom() {
    if (state.network && state.network.socket) state.network.socket.emit("leave-room");
    if (roomSocket) roomSocket.disconnect();
    roomSocket = null;
    state.network = null;
    state.keys.clear();
    state.remoteKeys.clear();
    document.body.classList.remove("online-player", "online-host");
    ui.selectors.forEach((select) => { select.disabled = false; });
    ui.namesInput.forEach((input) => { input.disabled = false; });
    ui.colors.forEach((input) => { input.disabled = false; });
    ui.arenaTheme.disabled = false;
    roomUi.create.disabled = false;
    roomUi.joinForm.querySelector("button").disabled = false;
    roomUi.codeInput.disabled = false;
    roomUi.codeDisplay.hidden = true;
    roomUi.leave.hidden = true;
    roomUi.roleLabel.textContent = "COMPUTER RIVAL";
    roomUi.roleLabel.previousElementSibling.textContent = "CPU";
    ui.opponent.textContent = "CPU / ADAPTIVE FIGHTER";
    roomUi.playerLabel.textContent = "YOUR FIGHTER";
    document.querySelector(".p1-panel").hidden = false;
    document.querySelector(".player-hud-right .player-tag").textContent = "CPU";
    state.phase = "fight";
    state.wins = [0, 0];
    state.round = 1;
    resetRound(false);
    state.ai.recent = [];
    state.ai.nextMove = 1.3;
    ui.botMemory.textContent = "CPU READ // READY";
    ui.botMemory.dataset.recentMoves = "";
    setRoomStatus("Room ended. Keep playing the CPU or create another room.");
  }

  function getRoomSocket() {
    if (window.location.protocol === "file:") {
      return Promise.reject(new Error("Room codes need the online game server. Deploy the project to Render or run npm start to use multiplayer."));
    }
    const connect = () => new Promise((resolve, reject) => {
      const socket = window.io();
      const timer = window.setTimeout(() => fail(new Error("The room server took too long to respond.")), 8000);
      function cleanup() {
        window.clearTimeout(timer);
        socket.off("connect", connected);
        socket.off("connect_error", fail);
      }
      function connected() {
        cleanup();
        resolve(socket);
      }
      function fail(error) {
        cleanup();
        socket.disconnect();
        reject(new Error(error && error.message ? error.message : "Couldn't connect to the room server."));
      }
      socket.once("connect", connected);
      socket.once("connect_error", fail);
      if (socket.connected) connected();
    });
    if (window.io) return connect();
    if (!socketIoPromise) {
      socketIoPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/socket.io/socket.io.js";
        script.onload = () => window.io ? resolve() : reject(new Error("The room service could not load."));
        script.onerror = () => reject(new Error("The room server isn't available. Deploy it to Render or run npm start."));
        document.head.append(script);
      });
    }
    return socketIoPromise.then(connect).catch((error) => {
      socketIoPromise = null;
      throw error;
    });
  }

  function attachRoomSocket(socket) {
    if (socket.galiRivalsHandlersAttached) return;
    socket.galiRivalsHandlersAttached = true;
    roomSocket = socket;
    socket.on("connect_error", () => setRoomStatus("Couldn't reach the room server. Check your connection and try again."));
    socket.on("peer-joined", () => {
      if (!state.network || state.network.role !== 0) return;
      ui.opponent.textContent = "P2 / ONLINE RIVAL";
      state.wins = [0, 0];
      state.round = 1;
      state.ai.recent = [];
      state.ai.nextMove = 1.3;
      ui.botMemory.textContent = "FRIEND CONNECTED // FIGHT!";
      ui.botMemory.dataset.recentMoves = "";
      resetRound(false);
      setRoomStatus("Friend connected. You're player one; your friend is player two.");
      broadcastGameState();
    });
    socket.on("rematch-request", () => {
      if (!state.network || state.network.role !== 0) return;
      setRoomStatus("Your friend is ready for a rematch. Select RUN IT BACK to restart.");
      showToast("REMATCH REQUESTED");
    });
    socket.on("room-closed", (message) => {
      const reason = message && typeof message.message === "string" ? message.message : "The room ended.";
      releaseRoom();
      setRoomStatus(`${reason} The CPU has taken over.`);
    });
    socket.on("remote-input", (packet) => {
      if (!state.network || state.network.role !== 0 || !packet || typeof packet.code !== "string") return;
      handleKey(1, packet.code, packet.down);
    });
    socket.on("fighter-config", (config) => {
      if (!state.network || state.network.role !== 0 || !config) return;
      const fighter = state.fighters[1];
      const selected = FIGHTERS.find((item) => item.id === config.fighter);
      if (!selected || !/^#[\da-f]{6}$/i.test(config.color)) return;
      const fighterChanged = fighter.data.id !== selected.id;
      fighter.data = selected;
      fighter.name = typeof config.name === "string" && config.name.trim() ? config.name.slice(0, 12) : selected.name;
      fighter.color = config.color;
      ui.selectors[1].value = selected.id;
      ui.namesInput[1].value = fighter.name;
      ui.colors[1].value = fighter.color;
      updateFighterCard(1);
      if (fighterChanged) resetRound(false);
      broadcastGameState();
    });
    socket.on("game-state", (snapshot) => {
      if (!state.network || state.network.role !== 1) return;
      applyGameState(snapshot);
    });
  }

  function broadcastGameState() {
    if (!state.network || state.network.role !== 0 || !state.network.socket.connected) return;
    const snapshot = {
      time: state.time,
      round: state.round,
      wins: state.wins,
      phase: state.phase,
      status: ui.status.textContent,
      statusColor: ui.status.style.color,
      arenaTheme: state.arenaTheme,
      aiRecent: state.ai.recent,
      shake: state.shake,
      projectiles: state.projectiles.map(({ owner, x, y, vx, life, color, radius }) => ({ owner, x, y, vx, life, color, radius })),
      particles: state.particles.slice(-80).map(({ x, y, vx, vy, life, maxLife, size, color, kind }) => ({ x, y, vx, vy, life, maxLife, size, color, kind })),
      fighters: state.fighters.map((fighter) => ({
        data: fighter.data.id,
        name: fighter.name,
        color: fighter.color,
        x: fighter.x,
        y: fighter.y,
        health: fighter.health,
        facing: fighter.facing,
        vy: fighter.vy,
        attack: fighter.attack,
        cooldown: fighter.cooldown,
        stun: fighter.stun,
        guard: fighter.guard,
        crouch: fighter.crouch,
        dash: fighter.dash,
        dashDirection: fighter.dashDirection,
        walk: fighter.walk,
        hitBlink: fighter.hitBlink,
        specialLock: fighter.specialLock
      }))
    };
    state.network.socket.emit("game-state", snapshot);
  }

  function applyGameState(snapshot) {
    if (!snapshot || !Array.isArray(snapshot.fighters) || snapshot.fighters.length !== 2) return;
    const previousPhase = state.phase;
    snapshot.fighters.forEach((source, index) => {
      const fighter = state.fighters[index];
      const previousHealth = fighter.health;
      const previousAttack = fighter.attack;
      const data = FIGHTERS.find((item) => item.id === source.data);
      if (!data || !/^#[\da-f]{6}$/i.test(source.color)) return;
      fighter.data = data;
      fighter.name = typeof source.name === "string" ? source.name.slice(0, 12) : data.name;
      fighter.color = source.color;
      ["x", "y", "health", "facing", "vy", "cooldown", "stun", "dash", "dashDirection", "walk", "hitBlink", "specialLock"].forEach((key) => {
        if (Number.isFinite(source[key])) fighter[key] = source[key];
      });
      const attackMove = source.attack && typeof source.attack === "object" ? source.attack.move : null;
      fighter.attack = Object.prototype.hasOwnProperty.call(ATTACKS, attackMove) && Number.isFinite(source.attack.elapsed)
        ? { type: ATTACKS[attackMove].category, move: attackMove, elapsed: Math.max(0, Math.min(ATTACKS[attackMove].duration, source.attack.elapsed)), hit: Boolean(source.attack.hit) }
        : null;
      if (fighter.attack && (!previousAttack || previousAttack.move !== fighter.attack.move) && fighter.attack.elapsed < .16) {
        playSfx(fighter.attack.type, fighter);
      }
      if (fighter.health < previousHealth) {
        spawnBurst(fighter.x, fighter.y - 73, fighter.color, 7);
        playSfx(fighter.guard ? "guard" : "hit", fighter);
      }
      fighter.guard = Boolean(source.guard);
      fighter.crouch = Boolean(source.crouch);
      ui.selectors[index].value = data.id;
      ui.namesInput[index].value = fighter.name;
      ui.colors[index].value = fighter.color;
      updateFighterCard(index);
    });
    if (Number.isFinite(snapshot.shake)) state.shake = Math.max(0, Math.min(10, snapshot.shake));
    if (Array.isArray(snapshot.projectiles)) {
      state.projectiles = snapshot.projectiles.filter((item) =>
        item && (item.owner === 0 || item.owner === 1) &&
        [item.x, item.y, item.vx, item.life, item.radius].every(Number.isFinite) &&
        typeof item.color === "string" && /^#[\da-f]{6}$/i.test(item.color)
      ).slice(0, 8);
    }
    if (Array.isArray(snapshot.particles)) {
      state.particles = snapshot.particles.filter((item) =>
        item && [item.x, item.y, item.vx, item.vy, item.life, item.size].every(Number.isFinite) &&
        typeof item.color === "string" && /^#[\da-f]{6}$/i.test(item.color) &&
        (item.kind === "dust" || item.kind === "spark")
      ).slice(-80).map((item) => ({
        ...item,
        maxLife: Number.isFinite(item.maxLife) ? item.maxLife : .35
      }));
    }
    if (Number.isFinite(snapshot.time)) state.time = snapshot.time;
    if (Number.isInteger(snapshot.round)) state.round = snapshot.round;
    if (Array.isArray(snapshot.wins) && snapshot.wins.length === 2) state.wins = snapshot.wins;
    if (["fight", "intermission", "matchover", "lobby"].includes(snapshot.phase)) state.phase = snapshot.phase;
    if (typeof snapshot.status === "string") ui.status.textContent = snapshot.status.slice(0, 40);
    if (typeof snapshot.statusColor === "string") ui.status.style.color = snapshot.statusColor;
    if (ARENA_THEMES[snapshot.arenaTheme]) {
      state.arenaTheme = snapshot.arenaTheme;
      ui.arenaTheme.value = snapshot.arenaTheme;
      ui.arenaLocation.textContent = ARENA_THEMES[snapshot.arenaTheme].label;
    }
    if (Array.isArray(snapshot.aiRecent)) {
      state.ai.recent = snapshot.aiRecent.filter((id) => BOT_MOVES.some((move) => move.id === id)).slice(-10);
      ui.botMemory.dataset.recentMoves = state.ai.recent.join(",");
      ui.botMemory.textContent = `CPU READ // ${state.ai.recent.slice().reverse().map((id) => BOT_MOVES.find((item) => item.id === id).label).join("  /  ")}`;
    }
    if (state.phase === "matchover") {
      const winner = state.wins[0] >= 2 ? state.fighters[0] : state.fighters[1];
      ui.resultKicker.textContent = "MATCH COMPLETE";
      ui.resultTitle.textContent = `${winner.name.toUpperCase()} WINS`;
      ui.resultTitle.style.color = winner.color;
      ui.resultCopy.textContent = state.network.role === (state.wins[0] >= 2 ? 0 : 1)
        ? "You take the rooftop. Run it back."
        : "Your friend takes the rooftop. Run it back.";
      ui.overlay.hidden = false;
      if (previousPhase !== "matchover") playVictory();
    } else {
      ui.overlay.hidden = true;
      ui.resultTitle.style.color = "";
    }
    updateHud();
  }

  function syncOwnFighter() {
    if (!state.network || state.network.role !== 1) return;
    window.clearTimeout(state.configTimer);
    state.configTimer = window.setTimeout(() => {
      if (!state.network || state.network.role !== 1) return;
      const fighter = state.fighters[1];
      state.network.socket.emit("fighter-config", {
        fighter: fighter.data.id,
        name: fighter.name,
        color: fighter.color
      });
    }, 120);
  }

  async function createRoom() {
    roomUi.create.disabled = true;
    setRoomStatus("Connecting to the room service...");
    ensureAudio();
    try {
      const socket = await getRoomSocket();
      attachRoomSocket(socket);
      socket.emit("create-room", (reply) => {
        if (!reply || !reply.ok) {
          socket.disconnect();
          roomSocket = null;
          roomUi.create.disabled = false;
          setRoomStatus(reply && reply.error ? reply.error : "Couldn't create a room.");
          return;
        }
        state.wins = [0, 0];
        state.round = 1;
        resetRound(false);
        state.network = { socket, role: 0, code: reply.code };
        setRoomRole(0, reply.code);
      });
    } catch (error) {
      roomUi.create.disabled = false;
      setRoomStatus(error.message);
    }
  }

  async function joinRoom(code) {
    roomUi.joinForm.querySelector("button").disabled = true;
    setRoomStatus("Looking for that room...");
    ensureAudio();
    try {
      const socket = await getRoomSocket();
      attachRoomSocket(socket);
      socket.emit("join-room", code, (reply) => {
        if (!reply || !reply.ok) {
          socket.disconnect();
          roomSocket = null;
          roomUi.joinForm.querySelector("button").disabled = false;
          setRoomStatus(reply && reply.error ? reply.error : "Couldn't join that room.");
          return;
        }
        state.network = { socket, role: 1, code: reply.code };
        setRoomRole(1, reply.code);
        document.querySelector(".p1-panel").hidden = true;
        document.querySelector(".p2-panel").querySelector(".panel-top").scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    } catch (error) {
      roomUi.joinForm.querySelector("button").disabled = false;
      setRoomStatus(error.message);
    }
  }

  function ensureAudio() {
    if (!state.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      state.audio = new AudioContext();
    }
    if (state.audio.state === "suspended") state.audio.resume();
    return state.audio;
  }

  function tone(frequency, duration, type = "sine", volume = .08, delay = 0, endFrequency = null) {
    const audio = ensureAudio();
    if (!audio) return;
    const start = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
  }

  function playSfx(kind, fighter) {
    if (kind === "punch") tone(180 + fighter.data.stats.speed * 13, .12, "triangle", .045, 0, 82);
    if (kind === "kick") tone(125, .2, "sawtooth", .05, 0, 45);
    if (kind === "special") {
      tone(320, .22, "sawtooth", .045, 0, 90);
      tone(620, .28, "sine", .04, .08, 180);
    }
    if (kind === "hit") {
      tone(95, .15, "square", .05, 0, 38);
      tone(540, .09, "triangle", .025, 0, 180);
    }
    if (kind === "guard") tone(420, .09, "triangle", .03, 0, 260);
    if (kind === "jump") tone(240, .13, "sine", .025, 0, 500);
  }

  function playVictory() {
    const choice = ui.victorySound.value;
    if (choice === "silent") return;
    const patterns = {
      fanfare: [[523, 0], [659, .13], [784, .26], [1047, .42]],
      arcade: [[392, 0], [523, .1], [659, .2], [784, .3], [1047, .42]],
      bells: [[659, 0], [784, .16], [988, .32], [1319, .51]],
      bass: [[110, 0], [164, .12], [220, .24], [330, .4]]
    };
    (patterns[choice] || patterns.fanfare).forEach(([frequency, delay], index) => {
      tone(frequency, .36, choice === "bass" ? "sawtooth" : "sine", .085, delay, frequency * (index === 3 ? 1.12 : 1));
    });
  }

  function musicBeat() {
    if (!state.musicOn) return;
    const notes = [110, 130.81, 164.81, 146.83, 98, 130.81, 174.61, 146.83];
    const note = notes[state.musicStep % notes.length];
    tone(note, .3, "triangle", .022);
    if (state.musicStep % 4 === 0) tone(55, .18, "sine", .034, .04, 38);
    state.musicStep += 1;
    state.musicTimer = window.setTimeout(musicBeat, 360);
  }

  function setMusic(on) {
    state.musicOn = on;
    ui.musicToggle.setAttribute("aria-pressed", String(on));
    ui.musicLabel.textContent = on ? "MUSIC ON" : "MUSIC OFF";
    window.clearTimeout(state.musicTimer);
    if (on) {
      ensureAudio();
      musicBeat();
    }
  }

  function setAction(index, action) {
    if (state.phase !== "fight") return;
    const fighter = state.fighters[index];
    if (!fighter || fighter.stun > 0) return;
    if (action === "jump") {
      if (fighter.y >= fighter.baseY - 1) {
        fighter.vy = -480;
        fighter.guard = false;
        spawnDust(fighter.x - 12, fighter.baseY - 3, 5, "#d5b99a");
        playSfx("jump", fighter);
      }
      return;
    }
    if (action === "crouch") {
      fighter.crouch = true;
      return;
    }
    if (action === "guard") {
      fighter.guard = true;
      fighter.guardTimer = .35;
      return;
    }
    if (action === "forward" || action === "back") {
      const sign = action === "forward" ? fighter.facing : -fighter.facing;
      fighter.dash = action === "forward" ? .2 : .13;
      fighter.dashDirection = sign;
      fighter.guard = false;
      spawnDust(fighter.x - sign * 11, fighter.baseY - 3, action === "forward" ? 7 : 4, "#c6aa89");
      return;
    }
    if (!ATTACKS[action] || fighter.attack || fighter.cooldown > 0) return;
    if (ATTACKS[action].category === "kick" && fighter.y < fighter.baseY - 1) return;
    if (action === "special" && fighter.specialLock > 0) return;
    const spec = ATTACKS[action];
    fighter.attack = { type: spec.category, move: action, elapsed: 0, hit: false };
    fighter.cooldown = spec.cooldown;
    fighter.guard = false;
    if (action === "special") fighter.specialLock = 2.8;
    if (action === "special" && fighter.data.style === "mystic") {
      state.projectiles.push({
        owner: index, x: fighter.x + fighter.facing * 28, y: fighter.y - 76,
        vx: fighter.facing * 435, life: .65, color: fighter.color, radius: 16,
        damage: fighter.data.moves.special[1], damageScale: index === 1 && !state.network ? .45 : 1
      });
    }
    playSfx(spec.category, fighter);
    if (spec.category === "kick") {
      spawnDust(fighter.x - 12, fighter.baseY - 3, 6, "#d7b998");
      spawnDust(fighter.x + 12, fighter.baseY - 3, 4, "#d7b998");
    }
    spawnBurst(fighter.x + fighter.facing * 31, fighter.y - 64, fighter.color, action === "special" ? 14 : 5);
  }

  function moveInput(fighter, dt) {
    if (fighter.stun > 0) return;
    const i = fighter.index;
    const previousWalk = fighter.walk;
    const controls = i === 0 ? state.keys : state.remoteKeys;
    const left = controls.has("KeyA");
    const right = controls.has("KeyD");
    const direction = (right ? 1 : 0) - (left ? 1 : 0);
    fighter.guardTimer = Math.max(0, fighter.guardTimer - dt);
    fighter.guard = fighter.guardTimer > 0;
    fighter.crouch = controls.has("ShiftLeft") || controls.has("ShiftRight");
    if ((i === 0 || state.network) && direction && !fighter.attack) {
      const toward = direction === fighter.facing;
      const speedFactor = .85 + fighter.data.stats.speed * .06;
      const speed = fighter.dash > 0 ? 0 : fighter.guard ? 55 : toward ? 205 : 145;
      fighter.x += direction * speed * speedFactor * dt;
      fighter.walk += dt * (fighter.dash > 0 ? 17 : 9);
    } else if (i === 1 && !state.network && !fighter.attack && !fighter.guard) {
      const gap = Math.abs(state.fighters[0].x - fighter.x);
      if (gap > 175) {
        fighter.x += fighter.facing * 118 * (.85 + fighter.data.stats.speed * .06) * dt;
        fighter.walk += dt * 8;
      } else {
        fighter.walk += dt * .5;
      }
    }
    if (fighter.dash > 0) {
      fighter.x += fighter.dashDirection * 530 * (.85 + fighter.data.stats.speed * .06) * dt;
      fighter.dash = Math.max(0, fighter.dash - dt);
    }
    if (fighter.y >= fighter.baseY - 1 && Math.floor(previousWalk / Math.PI) !== Math.floor(fighter.walk / Math.PI)) {
      spawnDust(fighter.x - fighter.facing * 10, fighter.baseY - 3, 3, "#cfb08c");
    }
  }

  function chooseBotMove() {
    const cpu = state.fighters[1];
    let options = BOT_MOVES.filter((move) => !state.ai.recent.includes(move.id));
    if (cpu.specialLock > 0) options = options.filter((move) => move.id !== "special");
    if (cpu.attack || cpu.cooldown > .12) {
      options = options.filter((move) => !ATTACKS[move.id]);
    }
    if (options.length === 0) return;
    const move = options[Math.floor(Math.random() * options.length)];
    state.ai.recent.push(move.id);
    if (state.ai.recent.length > 10) state.ai.recent.shift();
    ui.botMemory.textContent = `CPU READ // ${state.ai.recent.slice().reverse().map((id) => BOT_MOVES.find((item) => item.id === id).label).join("  /  ")}`;
    ui.botMemory.dataset.recentMoves = state.ai.recent.join(",");

    if (ATTACKS[move.id] || move.id === "special") {
      setAction(1, move.id);
    } else if (move.id === "guard") {
      setAction(1, "guard");
    } else if (move.id === "retreat") {
      setAction(1, "back");
    } else if (move.id === "dashIn") {
      setAction(1, "forward");
    } else if (move.id === "jumpIn") {
      setAction(1, "jump");
      cpu.dash = .18;
      cpu.dashDirection = cpu.facing;
    } else if (move.id === "feint") {
      cpu.dash = .1;
      cpu.dashDirection = -cpu.facing;
    }
    state.ai.nextMove = 1.15 + Math.random() * 1.1;
  }

  function tickBot(dt) {
    if (state.phase !== "fight" || state.network) return;
    state.ai.nextMove -= dt;
    if (state.ai.nextMove <= 0) chooseBotMove();
  }

  function tickFighters(dt) {
    const [left, right] = state.fighters;
    left.facing = left.x <= right.x ? 1 : -1;
    right.facing = right.x >= left.x ? -1 : 1;
    state.fighters.forEach((fighter) => {
      fighter.cooldown = Math.max(0, fighter.cooldown - dt);
      fighter.specialLock = Math.max(0, fighter.specialLock - dt);
      fighter.stun = Math.max(0, fighter.stun - dt);
      fighter.hitBlink = Math.max(0, fighter.hitBlink - dt);
      moveInput(fighter, dt);
      const wasAirborne = fighter.y < fighter.baseY - 1;
      fighter.vy += 1200 * dt;
      fighter.y += fighter.vy * dt;
      if (fighter.y > fighter.baseY) {
        fighter.y = fighter.baseY;
        fighter.vy = 0;
        if (wasAirborne) spawnDust(fighter.x, fighter.baseY - 3, 7, "#d7b998");
      }
      fighter.x = Math.max(75, Math.min(925, fighter.x));
      if (fighter.attack) fighter.attack.elapsed += dt;
      if (fighter.attack && fighter.attack.elapsed >= ATTACKS[fighter.attack.move].duration) fighter.attack = null;
    });
    if (Math.abs(right.x - left.x) < 70) {
      const push = (70 - Math.abs(right.x - left.x)) / 2;
      left.x -= push;
      right.x += push;
    }
    resolveAttacks();
    tickProjectiles(dt);
    tickParticles(dt);
    tickBot(dt);
  }

  function resolveAttacks() {
    state.fighters.forEach((attacker, index) => {
      const attack = attacker.attack;
      if (!attack || attack.hit) return;
      const spec = ATTACKS[attack.move];
      if (attack.elapsed < spec.start || attack.elapsed > spec.end) return;
      if (attack.move === "special" && attacker.data.style === "mystic") {
        attack.hit = true;
        return;
      }
      const target = state.fighters[1 - index];
      if (Math.abs(target.x - attacker.x) > spec.range + (attacker.data.stats.reach - 3) * 7) return;
      if (target.y < target.baseY - 43 && attack.type !== "special") return;
      attack.hit = true;
      const botDamageScale = attacker.index === 1 && !state.network ? .45 : 1;
      const damage = Math.max(4, attacker.data.moves[spec.category][1] * spec.damage * botDamageScale * (target.guard ? .2 : 1));
      target.health = Math.max(0, target.health - damage);
      target.hitBlink = .15;
      target.stun = target.guard ? .12 : attack.move === "special" ? .42 : .22;
      target.x += attacker.facing * (target.guard ? spec.knockback * .22 : spec.knockback);
      if (target.y === target.baseY && !target.guard && (attack.move === "special" || attack.move === "uppercut" || attack.move === "upperKick")) target.vy = -130;
      attacker.cooldown = Math.max(attacker.cooldown, .14);
      state.shake = attack.move === "special" ? 9 : spec.category === "kick" ? 5 : 3;
      if (target.guard) {
        playSfx("guard", target);
        showToast("BLOCKED!");
        spawnBurst(target.x - attacker.facing * 15, target.y - 73, "#d5e5ff", 5);
      } else {
        playSfx("hit", attacker);
        spawnBurst(target.x - attacker.facing * 20, target.y - 73, attacker.color, attack.move === "special" ? 15 : 9);
        if (attack.move === "special") {
          ui.flash.classList.add("active");
          window.setTimeout(() => ui.flash.classList.remove("active"), 70);
        }
      }
    });
    updateHud();
  }

  function tickProjectiles(dt) {
    state.projectiles = state.projectiles.filter((projectile) => {
      projectile.x += projectile.vx * dt;
      projectile.life -= dt;
      const target = state.fighters[1 - projectile.owner];
      if (Math.abs(target.x - projectile.x) < 38 && Math.abs(target.y - projectile.y) < 65) {
        const damage = projectile.damage * projectile.damageScale;
        target.health = Math.max(0, target.health - (target.guard ? damage * .2 : damage));
        target.stun = target.guard ? .12 : .38;
        target.hitBlink = .15;
        target.x += Math.sign(projectile.vx) * (target.guard ? 8 : 38);
        state.shake = 8;
        playSfx(target.guard ? "guard" : "hit", state.fighters[projectile.owner]);
        spawnBurst(projectile.x, projectile.y, target.guard ? "#d5e5ff" : projectile.color, target.guard ? 5 : 16);
        if (target.guard) showToast("BLOCKED!");
        updateHud();
        return false;
      }
      return projectile.life > 0 && projectile.x > 0 && projectile.x < 1000;
    });
  }

  function spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 35 + Math.random() * (count > 10 ? 230 : 130);
      state.particles.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: .22 + Math.random() * .42, maxLife: .42, size: 1.5 + Math.random() * 3, color, kind: "spark"
      });
    }
  }

  function spawnDust(x, y, count, color) {
    for (let i = 0; i < count; i += 1) {
      const life = .22 + Math.random() * .2;
      state.particles.push({
        x: x + (Math.random() - .5) * 13,
        y: y - Math.random() * 3,
        vx: (Math.random() - .5) * 75,
        vy: -24 - Math.random() * 46,
        life,
        maxLife: life,
        size: 5 + Math.random() * 8,
        color,
        kind: "dust"
      });
    }
  }

  function tickParticles(dt) {
    state.particles = state.particles.filter((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 110 * dt;
      particle.life -= dt;
      return particle.life > 0;
    });
    state.shake = Math.max(0, state.shake - dt * 30);
  }

  function finishRound(winner) {
    state.phase = "intermission";
    state.phaseTime = 2;
    state.winner = winner;
    if (winner >= 0) state.wins[winner] += 1;
    updateHud();
    if (state.wins.some((wins) => wins >= 2)) {
      const matchWinner = state.wins[0] >= 2 ? 0 : 1;
      state.phase = "matchover";
      ui.resultKicker.textContent = "MATCH COMPLETE";
      ui.resultTitle.textContent = `${state.fighters[matchWinner].name.toUpperCase()} WINS`;
      ui.resultTitle.style.color = state.fighters[matchWinner].color;
      ui.resultCopy.textContent = state.network
        ? (state.network.role === matchWinner ? "You take the rooftop. Run it back." : "Your friend takes the rooftop. Run it back.")
        : (matchWinner === 0 ? "The rooftop is yours." : "The CPU keeps the rooftop. Run it back.");
      ui.overlay.hidden = false;
      ui.status.textContent = "CHAMPION";
      playVictory();
    } else {
      ui.status.textContent = winner >= 0 ? `${state.fighters[winner].name.toUpperCase()} TAKES ROUND` : "ROUND DRAW";
      ui.status.style.color = winner >= 0 ? state.fighters[winner].color : "#fff";
      showToast(winner >= 0 ? `${state.fighters[winner].name.toUpperCase()} TAKES ROUND ${state.round}` : "ROUND DRAW");
    }
  }

  function updatePhase(dt) {
    if (state.phase !== "fight") {
      state.phaseTime -= dt;
      if (state.phase === "intermission" && state.phaseTime <= 0) {
        state.round += 1;
        resetRound(true);
      }
      return;
    }
    state.time = Math.max(0, state.time - dt);
    const health = state.fighters.map((fighter) => fighter.health);
    if (health[0] <= 0 || health[1] <= 0 || state.time <= 0) {
      let winner = -1;
      if (health[0] > health[1]) winner = 0;
      else if (health[1] > health[0]) winner = 1;
      finishRound(winner);
    }
    updateHud();
  }

  function polygon(points, fill, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function drawBackground() {
    const theme = ARENA_THEMES[state.arenaTheme] || ARENA_THEMES.mumbai;
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, theme.sky[0]);
    gradient.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 500);
    const cityHaze = ctx.createRadialGradient(505, 142, 5, 505, 142, 245);
    cityHaze.addColorStop(0, `${theme.glow}66`);
    cityHaze.addColorStop(.35, `${theme.glow}24`);
    cityHaze.addColorStop(1, `${theme.glow}00`);
    ctx.fillStyle = cityHaze;
    ctx.fillRect(250, -20, 520, 360);

    for (let i = 0; i < 23; i += 1) {
      const x = i * 47 - 18;
      const width = 32 + (i * 17 % 20);
      const height = 57 + (i * 61 % 135);
      const roof = 253 - height;
      ctx.fillStyle = i % 2 ? theme.city[0] : theme.city[1];
      ctx.fillRect(x, roof, width, height + 44);
      polygon([[x + width, roof], [x + width + 8, roof - 7], [x + width + 8, 255], [x + width, 255]], shade(theme.city[0], -.2));
      polygon([[x - 3, roof], [x + width, roof], [x + width + 8, roof - 7], [x + 5, roof - 8]], shade(theme.city[1], .2));
      if (i % 3 === 0) {
        ctx.fillStyle = shade(theme.city[0], .18);
        ctx.fillRect(x + width * .27, roof - 13, width * .46, 13);
      }
      if (i % 7 === 1) {
        const tankX = x + width * .5 - 8;
        ctx.fillStyle = "#343433";
        ctx.fillRect(tankX, roof - 21, 17, 18);
        ctx.beginPath();
        ctx.ellipse(tankX + 8.5, roof - 21, 8.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#56514a";
        ctx.fill();
        ctx.strokeStyle = "#292827";
        ctx.stroke();
        ctx.fillStyle = "#514c45";
        ctx.fillRect(tankX + 2, roof - 3, 3, 4);
        ctx.fillRect(tankX + 12, roof - 3, 3, 4);
      }
      for (let row = 0; row < 7; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          const windowY = roof + 10 + row * 16;
          if (windowY > 249 || ((i * 7 + row * 3 + column) % 5 === 0)) continue;
          ctx.fillStyle = (i + row + column) % 4 === 0 ? `${theme.glow}99` : `${theme.glow}33`;
          ctx.fillRect(x + 5 + column * 11, windowY, 5, 9);
          ctx.fillStyle = "rgba(255,255,255,.12)";
          ctx.fillRect(x + 5 + column * 11, windowY, 1, 7);
        }
      }
      if (i % 5 === 2) {
        ctx.strokeStyle = `${theme.glow}88`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, roof - 8);
        ctx.lineTo(x + width / 2, roof - 31);
        ctx.stroke();
        ctx.fillStyle = theme.glow;
        ctx.fillRect(x + width / 2 - 2, roof - 34, 4, 4);
      }
    }

    const trainX = (state.elapsed * 85) % 1500 - 540;
    for (let car = 0; car < 4; car += 1) {
      const x = trainX + car * 132;
      ctx.fillStyle = "#393a39";
      ctx.fillRect(x + 2, 245, 128, 4);
      ctx.fillStyle = car % 2 ? "#c2b9a2" : "#b9ad91";
      ctx.fillRect(x, 215, 128, 30);
      ctx.fillStyle = "#e3d8bd";
      ctx.fillRect(x, 215, 128, 3);
      ctx.fillStyle = "#914b35";
      ctx.fillRect(x, 238, 128, 7);
      for (let window = 0; window < 5; window += 1) {
        const windowX = x + 7 + window * 24;
        ctx.fillStyle = "#39464a";
        ctx.fillRect(windowX, 220, 17, 11);
        ctx.fillStyle = `${theme.glow}77`;
        ctx.fillRect(windowX + 2, 222, 4, 7);
        ctx.fillStyle = "#887f6f";
        ctx.fillRect(windowX + 20, 219, 2, 17);
      }
      ctx.fillStyle = "#a29a85";
      ctx.fillRect(x + 8, 233, 112, 2);
    }
    ctx.strokeStyle = "rgba(45,43,41,.65)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 208);
    ctx.quadraticCurveTo(500, 198, 1000, 208);
    ctx.stroke();

    const distantGlow = ctx.createLinearGradient(0, 204, 0, 282);
    distantGlow.addColorStop(0, `${theme.glow}00`);
    distantGlow.addColorStop(1, `${theme.glow}22`);
    ctx.fillStyle = distantGlow;
    ctx.fillRect(0, 204, 1000, 78);

    ctx.fillStyle = shade(theme.city[0], -.24);
    ctx.beginPath();
    ctx.moveTo(0, 259);
    ctx.lineTo(1000, 259);
    ctx.lineTo(1000, 303);
    ctx.lineTo(0, 303);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `${theme.glow}55`;
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 79 + Math.sin(state.elapsed * .15 + i) * 9) % 1000;
      const y = 267 + (i * 19) % 26;
      ctx.globalAlpha = .26 + (Math.sin(state.elapsed * 2 + i) + 1) * .18;
      ctx.fillRect(x, y, 2 + i % 3, 2 + i % 2);
    }
    ctx.globalAlpha = 1;

    const roofGradient = ctx.createLinearGradient(0, 283, 0, 500);
    roofGradient.addColorStop(0, shade(theme.floor, .3));
    roofGradient.addColorStop(.13, theme.floor);
    roofGradient.addColorStop(1, shade(theme.floor, -.46));
    ctx.fillStyle = roofGradient;
    polygon([[0, 282], [1000, 282], [1000, 500], [0, 500]], roofGradient);
    polygon([[0, 276], [1000, 276], [1000, 286], [0, 286]], shade(theme.floor, .42));
    ctx.fillStyle = `${theme.glow}66`;
    ctx.fillRect(0, 281, 1000, 2);

    const floorGlow = ctx.createLinearGradient(0, 283, 0, 500);
    floorGlow.addColorStop(0, "rgba(255,244,222,.07)");
    floorGlow.addColorStop(.35, "rgba(62,46,35,.025)");
    floorGlow.addColorStop(1, "rgba(20,18,17,.4)");
    ctx.fillStyle = floorGlow;
    ctx.fillRect(0, 284, 1000, 216);

    ctx.save();
    ctx.strokeStyle = "rgba(45,35,28,.25)";
    ctx.lineWidth = 1.2;
    for (let i = -13; i <= 13; i += 1) {
      ctx.beginPath();
      ctx.moveTo(500 + i * 17, 284);
      ctx.lineTo(500 + i * 57, 500);
      ctx.stroke();
    }
    for (let row = 0; row < 8; row += 1) {
      const y = 284 + Math.pow((row + 1) / 8, 1.75) * 216;
      ctx.strokeStyle = `rgba(45,35,28,${.09 + row * .009})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(500, 351);
    ctx.strokeStyle = "rgba(239,219,182,.24)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 169, 42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 158, 36, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(239,219,182,.28)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(26, 0);
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = shade(theme.city[0], -.34);
    ctx.fillRect(0, 272, 1000, 9);
    ctx.fillStyle = shade(theme.city[1], .22);
    ctx.fillRect(0, 271, 1000, 2);
    for (let post = 0; post <= 20; post += 1) {
      const x = post * 50;
      ctx.fillStyle = shade(theme.city[0], -.25);
      ctx.fillRect(x, 242, 4, 36);
      ctx.fillStyle = `${theme.glow}66`;
      ctx.fillRect(x, 241, 4, 2);
    }
    ctx.fillStyle = shade(theme.city[1], .3);
    ctx.fillRect(0, 239, 1000, 4);
    ctx.fillStyle = `${theme.glow}99`;
    ctx.fillRect(0, 238, 1000, 1);

    if (state.arenaTheme === "monsoon") {
      ctx.strokeStyle = "rgba(191,218,255,.3)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 58; i += 1) {
        const x = (i * 83 + state.elapsed * (115 + i % 7 * 12)) % 1050 - 20;
        const y = 190 + (i * 47) % 310;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 13);
        ctx.stroke();
      }
    }
  }

  function shade(hex, amount) {
    let value;
    if (hex.startsWith("#")) {
      value = Number.parseInt(hex.slice(1, 7), 16);
    } else {
      const channels = hex.match(/\d+/g);
      if (!channels || channels.length < 3) return "#ffffff";
      value = (Number(channels[0]) << 16) | (Number(channels[1]) << 8) | Number(channels[2]);
    }
    const channel = (shift) => Math.max(0, Math.min(255, ((value >> shift) & 255) + Math.round(255 * amount)));
    return `#${[channel(16), channel(8), channel(0)].map((part) => part.toString(16).padStart(2, "0")).join("")}`;
  }

  function drawFighter(fighter) {
    const { x, y, facing, data, color } = fighter;
    const action = fighter.attack;
    const type = action && action.type;
    const move = action && action.move;
    const spec = action && ATTACKS[move];
    const progress = action ? action.elapsed / spec.duration : 0;
    const active = action && action.elapsed > spec.start && action.elapsed < spec.end;
    const airborne = fighter.baseY - y;
    const bob = fighter.stun > 0 ? Math.sin(state.elapsed * 48) * 1.8 : Math.sin(fighter.walk * 2) * (fighter.walk ? 2 : 0) + Math.sin(state.elapsed * 2.4 + fighter.index) * 1.3;
    const crouch = fighter.crouch && !type ? 13 : 0;
    const motionTilt = type === "punch"
      ? Math.sin(Math.min(1, progress * 2.5) * Math.PI) * (move === "uppercut" ? -.42 : .36)
      : type === "kick"
        ? -Math.sin(Math.min(1, progress * 1.65) * Math.PI) * .62
        : fighter.dash > 0 ? -.08 * fighter.dashDirection * facing : 0;
    const spinProgress = progress * progress * (3 - 2 * progress);
    const spinAngle = type === "kick"
      ? move === "roundhouse"
        ? Math.PI * 2 * spinProgress
        : move === "upperKick"
          ? Math.PI * .72 * Math.sin(progress * Math.PI)
          : Math.PI * .2 * Math.sin(progress * Math.PI)
      : type === "punch" ? Math.sin(progress * Math.PI) * .16 : 0;
    const spinScale = Math.cos(spinAngle);
    const ghost = data.style === "agile" && move === "special" && progress > .2 && progress < .7;

    ctx.save();
    ctx.translate(x, y - airborne * .82);
    const shadowScale = Math.max(.43, 1 - airborne * .0024);
    ctx.globalAlpha = .35 * shadowScale;
    const shadow = ctx.createRadialGradient(0, 0, 5, 0, 0, 45 * shadowScale);
    shadow.addColorStop(0, "#05060b");
    shadow.addColorStop(1, "#05060b00");
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(0, 2, 48 * shadowScale, 13 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.translate(0, bob + crouch);
    if (ghost) {
      ctx.globalAlpha = .25;
      ctx.save();
      ctx.translate(-facing * 36, 0);
      ctx.scale(facing * (spinScale < 0 ? -1 : 1) * Math.max(.18, Math.abs(spinScale)), 1);
      drawBody(fighter, move, type, progress, active, motionTilt);
      ctx.restore();
      ctx.save();
      ctx.translate(facing * 36, 0);
      ctx.scale(facing, 1);
      drawBody(fighter, move, type, progress, active, motionTilt);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (fighter.dash > 0) {
      ctx.globalAlpha = Math.min(.38, fighter.dash * 1.8);
      ctx.save();
      ctx.translate(-fighter.dashDirection * 15, 0);
      ctx.scale(facing, 1);
      drawBody(fighter, move, type, progress, active, motionTilt);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (fighter.hitBlink > 0) {
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 22;
    }
    ctx.scale(facing, 1);
    drawBody(fighter, move, type, progress, active, motionTilt);
    ctx.restore();
  }

  function drawSphere(x, y, rx, ry, color, highlight = .3) {
    const gradient = ctx.createRadialGradient(x - rx * .35, y - ry * .35, 1, x, y, Math.max(rx, ry) * 1.3);
    gradient.addColorStop(0, shade(color, highlight));
    gradient.addColorStop(.58, color);
    gradient.addColorStop(1, shade(color, -.48));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `${shade(color, -.38)}88`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawLimb(x1, y1, x2, y2, width, color, highlight = true) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = shade(color, -.43);
    ctx.lineWidth = width + 4;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const gradient = ctx.createLinearGradient(Math.min(x1, x2) - width, Math.min(y1, y2), Math.max(x1, x2) + width, Math.max(y1, y2));
    gradient.addColorStop(0, shade(color, .2));
    gradient.addColorStop(.42, color);
    gradient.addColorStop(1, shade(color, -.3));
    ctx.strokeStyle = gradient;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (highlight) {
      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = Math.max(1.3, width * .14);
      ctx.beginPath();
      ctx.moveTo(x1 - 1, y1 - 2);
      ctx.lineTo(x2 - 1, y2 - 2);
      ctx.stroke();
    }
    drawSphere(x2, y2, width * .56, width * .56, color, .22);
  }

  function drawBody(fighter, move, type, progress, active, motionTilt) {
    const { data, color, guard, stun } = fighter;
    const skin = data.palette[0];
    const outfit = shade(data.palette[1], data.style === "heavy" ? .1 : .24);
    let armX = 42, armY = guard ? -120 : -94;
    let legX = 16, legY = -13, kickRotation = 0, lean = stun > 0 ? -9 : 0;
    if (type === "punch") {
      const snap = Math.sin(Math.min(1, progress * 2.5) * Math.PI);
      armX = 42 + snap * (move === "cross" ? 37 : move === "uppercut" ? 20 : 29);
      armY = move === "uppercut" ? -126 - snap * 31 : -89 + (move === "jab" ? -4 : 0);
      if (move === "elbow") armX = 47 + snap * 12;
      lean += snap * 5;
    }
    if (type === "kick") {
      const extension = progress < .24
        ? 0
        : progress < .62
          ? Math.sin(((progress - .24) / .38) * Math.PI * .5)
          : progress < .82
            ? Math.cos(((progress - .62) / .2) * Math.PI * .5)
            : 0;
      const kickRange = move === "roundhouse" ? 57 : move === "lowKick" ? 45 : 51;
      const kickHeight = move === "lowKick" ? 9 : move === "upperKick" ? 98 : move === "roundhouse" ? 49 : 42;
      legX = 16 + extension * kickRange;
      legY = -13 - extension * kickHeight;
      kickRotation = extension * (move === "roundhouse" ? -.68 : move === "upperKick" ? -.82 : move === "lowKick" ? .08 : -.42);
      lean -= extension * 9;
    }
    if (type === "special") {
      const charge = Math.sin(Math.min(1, progress * 1.4) * Math.PI);
      armX = 42 + charge * 49;
      armY = -106 - charge * 14;
    }

    ctx.save();
    ctx.translate(lean, 0);

    const stride = fighter.attack ? 0 : Math.sin(fighter.walk * 2) * 5;
    drawLimb(-9, -42, -14 - stride, -13, data.style === "heavy" ? 17 : 12, shade(outfit, -.1));
    drawLimb(-14 - stride, -13, -20 - stride, -6, 11, data.style === "heavy" ? "#202631" : "#161a24");
    ctx.save();
    ctx.translate(8, -42);
    ctx.rotate(kickRotation);
    const kneeX = legX - 8;
    const kneeY = legY + 42;
    drawLimb(0, 0, kneeX, kneeY, data.style === "heavy" ? 18 : 13, outfit);
    drawLimb(kneeX, kneeY, kneeX + 5, kneeY + 8, 11, shade(outfit, -.08));
    polygon([[kneeX - 2, kneeY + 5], [kneeX + 13, kneeY + 6], [kneeX + 19, kneeY + 12], [kneeX - 1, kneeY + 12]], shade(data.palette[1], -.2), shade(data.palette[1], -.48), 1);
    ctx.restore();
    polygon([[-28 - stride, -3], [-9 - stride, -4], [-6 - stride, 2], [-31 - stride, 2]], shade(data.palette[1], -.2));

    ctx.translate(0, -76);
    ctx.rotate(motionTilt);
    ctx.translate(0, 76);

    drawLimb(-18, -107, -35, -91, 13, shade(outfit, -.15));
    drawLimb(-35, -91, -31, -76, 11, skin);
    drawLimb(-31, -76, -24, -79, 10, color);

    const torsoGradient = ctx.createLinearGradient(-28, -116, 28, -52);
    torsoGradient.addColorStop(0, shade(outfit, .32));
    torsoGradient.addColorStop(.34, outfit);
    torsoGradient.addColorStop(.77, shade(outfit, -.12));
    torsoGradient.addColorStop(1, shade(outfit, -.44));
    polygon([[-20, -116], [-12, -126], [13, -126], [25, -113], [20, -84], [16, -48], [0, -42], [-18, -49], [-24, -85]], torsoGradient, shade(outfit, -.52), 2);
    polygon([[-13, -119], [0, -110], [14, -119], [10, -102], [0, -96], [-9, -102]], color, shade(color, -.35), 1);
    polygon([[-13, -112], [-4, -105], [-2, -70], [-14, -66]], "rgba(255,255,255,.16)");
    polygon([[4, -105], [13, -112], [17, -66], [5, -70]], "rgba(0,0,0,.2)");
    ctx.strokeStyle = "rgba(255,255,255,.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, -91);
    ctx.lineTo(-6, -78);
    ctx.moveTo(9, -91);
    ctx.lineTo(6, -78);
    ctx.stroke();
    polygon([[-18, -52], [18, -52], [15, -41], [-16, -41]], shade(color, .06), shade(color, -.35), 1);
    ctx.fillStyle = "#e4d8c1";
    ctx.fillRect(-2, -50, 5, 5);

    if (data.style === "heavy") {
      drawSphere(-19, -109, 13, 14, shade(outfit, -.2));
      drawSphere(20, -109, 13, 14, shade(outfit, -.2));
      polygon([[-25, -112], [-18, -120], [-11, -111], [-13, -100], [-23, -101]], shade(outfit, -.22), color, 2);
      polygon([[12, -111], [19, -120], [26, -112], [24, -101], [14, -100]], shade(outfit, -.22), color, 2);
    } else {
      drawSphere(-18, -109, 10, 11, outfit);
      drawSphere(19, -109, 10, 11, outfit);
      ctx.strokeStyle = shade(outfit, -.28);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -92);
      ctx.quadraticCurveTo(-2, -84, 11, -91);
      ctx.stroke();
    }

    drawLimb(16, -111, 29, -106, data.style === "heavy" ? 16 : 12, outfit);
    drawLimb(29, -106, armX, armY, data.style === "heavy" ? 14 : 10, outfit);
    if (type === "punch" || type === "special") {
      drawSphere(armX + 2, armY, 9, 8, color);
      polygon([[armX - 5, armY - 3], [armX + 10, armY - 5], [armX + 15, armY], [armX + 2, armY + 5]], shade(color, -.16));
    } else {
      drawSphere(armX + 1, armY, 8, 8, skin);
    }

    const headY = -148;
    drawSphere(0, headY, data.style === "heavy" ? 17 : 15, 20, skin, .34);
    drawSphere(14, headY + 3, 3.8, 5.3, skin, .1);
    ctx.fillStyle = shade(skin, -.32);
    ctx.beginPath();
    ctx.ellipse(5, headY + 9, 8, 2.3, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = "#171b24";
    ctx.beginPath();
    ctx.ellipse(10, headY - 2, 3.2, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 7;
    ctx.fillRect(9, headY - 3, 4, 1.7);
    ctx.shadowBlur = 0;

    if (data.style === "agile" || data.style === "mystic") {
      const hood = ctx.createLinearGradient(-15, headY - 22, 16, headY + 5);
      hood.addColorStop(0, shade(outfit, .4));
      hood.addColorStop(.6, outfit);
      hood.addColorStop(1, shade(outfit, -.45));
      ctx.fillStyle = hood;
      ctx.beginPath();
      ctx.moveTo(-15, headY - 6);
      ctx.quadraticCurveTo(-15, headY - 26, 0, headY - 25);
      ctx.quadraticCurveTo(16, headY - 22, 16, headY - 5);
      ctx.lineTo(12, headY - 14);
      ctx.quadraticCurveTo(0, headY - 22, -12, headY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, headY - 13);
      ctx.lineTo(10, headY - 13);
      ctx.stroke();
    } else {
      const hair = ctx.createLinearGradient(0, headY - 23, 0, headY - 7);
      hair.addColorStop(0, shade(color, .44));
      hair.addColorStop(1, color);
      ctx.fillStyle = hair;
      ctx.beginPath();
      ctx.ellipse(-1, headY - 13, 16, 8, -.08, Math.PI, Math.PI * 2);
      ctx.lineTo(12, headY - 7);
      ctx.lineTo(3, headY - 12);
      ctx.lineTo(-9, headY - 7);
      ctx.closePath();
      ctx.fill();
    }

    if (guard) {
      ctx.strokeStyle = `${color}bb`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(4, -105, 48, -1.2, .75);
      ctx.stroke();
      ctx.globalAlpha = .15;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(4, -105, 48, -1.2, .75);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (type === "special" && active) {
      ctx.save();
      ctx.globalAlpha = .85;
      ctx.shadowBlur = 24;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(armX + 12, armY, 17 + Math.sin(state.elapsed * 22) * 4, 11, -.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else if (active) {
      ctx.save();
      ctx.globalAlpha = .58;
      ctx.shadowColor = color;
      ctx.shadowBlur = 17;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      if (type === "punch") {
        ctx.lineWidth = move === "uppercut" ? 7 : 5;
        ctx.beginPath();
        ctx.moveTo(25, armY + 7);
        ctx.quadraticCurveTo(armX + 10, armY - (move === "uppercut" ? 29 : 6), armX + 23, armY);
        ctx.stroke();
        ctx.globalAlpha = .3;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(31, armY + 13);
        ctx.quadraticCurveTo(armX + 19, armY - (move === "uppercut" ? 13 : 1), armX + 32, armY + 5);
        ctx.stroke();
      } else {
        if (move === "roundhouse") {
          ctx.globalAlpha = .3;
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.arc(2, -69, 51, Math.PI * 1.12, Math.PI * 1.82);
          ctx.stroke();
          ctx.globalAlpha = .78;
        }
        ctx.lineWidth = move === "roundhouse" ? 9 : 6;
        ctx.beginPath();
        ctx.moveTo(9, -53);
        ctx.quadraticCurveTo(legX + 21, legY - 30, legX + 30, legY + 4);
        ctx.stroke();
        ctx.globalAlpha = .32;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(2, -60);
        ctx.quadraticCurveTo(legX + 12, legY - 43, legX + 23, legY - 8);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (data.style === "mystic") {
      ctx.strokeStyle = `${color}bb`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-22, -70);
      ctx.quadraticCurveTo(-43, -50 + Math.sin(state.elapsed * 3) * 6, -34, -28);
      ctx.stroke();
    }
    if (stun > 0) {
      ctx.globalAlpha = .34;
      ctx.fillStyle = "#fff";
      ctx.fillRect(-22, -157, 44, 113);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawEffects() {
    state.projectiles.forEach((projectile) => {
      ctx.save();
      ctx.shadowColor = projectile.color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.ellipse(projectile.x, projectile.y, projectile.radius, projectile.radius * .7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    state.particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, particle.life / (particle.maxLife || .35)));
      ctx.fillStyle = particle.color;
      if (particle.kind === "dust") {
        ctx.globalAlpha *= .48;
        ctx.beginPath();
        ctx.ellipse(particle.x, particle.y, particle.size, particle.size * .48, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.translate(particle.x, particle.y);
        ctx.rotate(Math.atan2(particle.vy, particle.vx));
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(-particle.size, -particle.size * .35, particle.size * 2, particle.size * .7);
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (state.shake > 0) ctx.translate((Math.random() - .5) * state.shake, (Math.random() - .5) * state.shake);
    drawBackground();
    state.fighters.forEach(drawFighter);
    drawEffects();
    ctx.restore();
    const left = state.fighters[0];
    if (left) {
      const actor = left.attack && ATTACKS[left.attack.move].category;
      ui.moveLabels[0].style.color = actor === "punch" ? left.color : "";
      ui.moveLabels[1].style.color = actor === "kick" ? left.color : "";
      ui.moveLabels[2].style.color = actor === "special" ? left.color : "";
    }
  }

  function frame(timestamp) {
    const dt = Math.min(.033, (timestamp - (state.lastTime || timestamp)) / 1000);
    state.lastTime = timestamp;
    state.elapsed += dt;
    if (!state.network || state.network.role === 0) {
      if (state.phase === "fight") tickFighters(dt);
      updatePhase(dt);
      if (state.network && timestamp - state.syncTimer > 50) {
        state.syncTimer = timestamp;
        broadcastGameState();
      }
    }
    render();
    requestAnimationFrame(frame);
  }

  document.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLElement && event.target.closest("input, select, textarea, [contenteditable='true']")) return;
    if (event.code === "Space") event.preventDefault();
    if (event.repeat) return;
    submitKey(event.code, true);
    ensureAudio();
  });
  document.addEventListener("keyup", (event) => {
    submitKey(event.code, false);
  });
  window.addEventListener("blur", () => {
    state.keys.clear();
    if (state.network && state.network.role === 1) {
      ["KeyA", "KeyD", "KeyW", "KeyS", "KeyF", "KeyG", "KeyH", "ShiftLeft", "ShiftRight", "Space"].forEach((code) => state.network.socket.emit("input", { code, down: false }));
    }
    state.fighters.forEach((fighter) => { fighter.guard = false; fighter.crouch = false; fighter.guardTimer = 0; });
  });

  document.querySelectorAll(".touch-controls button").forEach((button) => {
    let activeKeys = [];
    const start = (event) => {
      event.preventDefault();
      button.classList.add("pressed");
      const action = button.dataset.action;
      const keySets = {
        jump: ["Space"], crouch: ["ShiftLeft"], left: ["KeyA"], right: ["KeyD"],
        jab: ["KeyS", "KeyF"], uppercut: ["KeyW", "KeyF"],
        lowKick: ["KeyS", "KeyG"], upperKick: ["KeyW", "KeyG"],
        cross: ["KeyF"], roundhouse: ["KeyG"], special: ["KeyH"]
      };
      activeKeys = keySets[action] || [];
      activeKeys.forEach((code) => submitKey(code, true));
      if (!["crouch", "left", "right"].includes(action)) {
        const keys = activeKeys.slice();
        window.setTimeout(() => keys.forEach((code) => submitKey(code, false)), 100);
      }
      ensureAudio();
    };
    const end = (event) => {
      event.preventDefault();
      button.classList.remove("pressed");
      if (["crouch", "left", "right"].includes(button.dataset.action)) {
        activeKeys.forEach((code) => submitKey(code, false));
      }
    };
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("pointerleave", end);
  });

  ui.selectors.forEach((select, index) => select.addEventListener("change", () => {
    const targetIndex = state.network ? state.network.role : index;
    if (state.network && index !== targetIndex) {
      select.value = state.fighters[index].data.id;
      return;
    }
    const fighter = state.fighters[targetIndex];
    const previousDefaultName = fighter.data.name;
    fighter.data = FIGHTERS.find((item) => item.id === select.value);
    if (fighter.name === previousDefaultName) {
      fighter.name = fighter.data.name;
      ui.namesInput[targetIndex].value = fighter.name;
    }
    updateFighterCard(targetIndex);
    if (state.network && targetIndex === 1) {
      syncOwnFighter();
      showToast(`${fighter.data.name.toUpperCase()} JOINS THE ROOM`);
    } else {
      state.wins = [0, 0];
      state.round = 1;
      state.ai.recent = [];
      state.ai.nextMove = 1.3;
      ui.botMemory.textContent = "CPU READ // READY";
      ui.botMemory.dataset.recentMoves = "";
      resetRound(false);
      if (state.network) broadcastGameState();
      showToast(`${fighter.data.name.toUpperCase()} ENTERS - NEW MATCH`);
    }
  }));
  ui.namesInput.forEach((input, index) => input.addEventListener("input", () => {
    const targetIndex = state.network ? state.network.role : index;
    if (state.network && index !== targetIndex) return;
    const cleaned = input.value.replace(/[<>]/g, "").trim().slice(0, 12) || state.fighters[targetIndex].data.name;
    state.fighters[targetIndex].name = cleaned;
    ui.names[targetIndex].textContent = cleaned.toUpperCase();
    if (state.network && targetIndex === 1) syncOwnFighter();
  }));
  ui.colors.forEach((input, index) => input.addEventListener("input", () => {
    const targetIndex = state.network ? state.network.role : index;
    if (state.network && index !== targetIndex) return;
    state.fighters[targetIndex].color = input.value;
    if (state.network && targetIndex === 1) syncOwnFighter();
  }));
  ui.musicToggle.addEventListener("click", () => setMusic(!state.musicOn));
  ui.arenaTheme.addEventListener("change", () => {
    state.arenaTheme = ui.arenaTheme.value;
    ui.arenaLocation.textContent = ARENA_THEMES[state.arenaTheme].label;
    showToast(`${ui.arenaTheme.options[ui.arenaTheme.selectedIndex].text.toUpperCase()} SELECTED`);
  });
  document.querySelector("#rematch-button").addEventListener("click", () => {
    if (state.network && state.network.role === 1) {
      state.network.socket.emit("rematch-request");
      setRoomStatus("Rematch request sent to your friend.");
      return;
    }
    restartMatch();
    if (state.network) broadcastGameState();
  });
  roomUi.create.addEventListener("click", createRoom);
  roomUi.joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    joinRoom(roomUi.codeInput.value);
  });
  roomUi.copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(roomUi.code.textContent);
      roomUi.copy.textContent = "COPIED";
    } catch (_error) {
      setRoomStatus(`Share code ${roomUi.code.textContent} with your friend.`);
    }
  });
  roomUi.leave.addEventListener("click", releaseRoom);

  populateSelects();
  setFighter(0, "nova", false);
  setFighter(1, "rook", false);
  ui.arenaLocation.textContent = ARENA_THEMES[state.arenaTheme].label;
  updateHud();
  requestAnimationFrame(frame);
})();
