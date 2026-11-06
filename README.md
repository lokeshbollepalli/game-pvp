# Gali Rivals

Gali Rivals is a browser-based rooftop fighting game with four selectable fighters, a CPU rival, and private room-code matches for two players. The original characters and city scenes are drawn in Canvas with shaded, 2.5D animation; no game engine or downloaded art is required.

## Play locally

For a quick CPU match, open `index.html` in a modern browser. Online rooms require the Node.js server:

```sh
npm install
npm start
```

Then open `http://localhost:3000` in two browser windows or devices. One player creates a room and shares the six-character code; the other enters that code and joins. The match starts when the second player joins. The room host controls the left-side fighter; the guest controls the right-side fighter. Leaving or disconnecting closes the room, after which the remaining player can continue against the CPU.

On phones, rotate to landscape and tap **Enter Arena** to begin; the game requests fullscreen and landscape lock where the browser supports them. Choose **Set Up Fighter / Room** first to customize a fighter or create/join a friend room before starting. Four attack buttons (Punch, Kick, Special, and Grab) sit at the lower left, with movement, jump, and crouch at the lower right. Fullscreen is subject to mobile-browser support and must be requested from the start-button tap.

## Play online

The static CPU game is published at [lokeshbollepalli.github.io/game-pvp](https://lokeshbollepalli.github.io/game-pvp/). Online room-code matches need the Node.js server deployed separately, as described below.

## Controls

| Action | Controls |
| --- | --- |
| Move toward / away | D / A |
| Jump / crouch | Space / hold Shift |
| Uppercut / jab | W + F / S + F |
| High kick / low kick | W + G / S + G |
| Cross / roundhouse | F / G |
| Special move | H |
| Sumo grab (close range; deals 20 HP) | E |

On mobile, Punch and Kick trigger the standard cross and roundhouse; W/S combinations still select uppercut, jab, high kick, and low kick when using a keyboard. Matches are best of three rounds (first to two). The CPU draws from 15 moves and does not repeat any of its previous ten choices. All combat audio, music, and the selectable victory jingle are synthesized in the browser.

## Customize and deploy

Choose a fighter, ring name, color, victory sound, and one of four original city rooftops: Mumbai local line, Old Delhi, Jaipur sunset, or monsoon. In a room, each player can customize their own fighter and the host selects the shared arena. Character and background art can be added later; use original or properly licensed images (transparent PNGs work well for fighters).

The included `render.yaml` configures a Node web service for Render. Push the repository to GitHub, create a Render web service from it, and deploy using the manifest. Room codes live in server memory: they are temporary, and active rooms end if the service restarts or sleeps. The server currently keeps match state on the host's browser and relays it to the guest; it is intended for casual private play rather than competitive anti-cheat.

## Limitations

This is a 2D side-view Canvas game with shaded, perspective-inspired characters—not a full 3D model/physics game. Multiplayer requires the deployed Node server; opening the HTML directly supports only local CPU play.
