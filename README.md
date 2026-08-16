VEXIO — MOBILE BLOCK PUZZLE GAME

Vexio is a fast-paced, tap-driven block puzzle game built for mobile browsers. It blends quick decision-making, combo-building, and clean visual feedback into a lightweight Phaser-powered experience.

GAMEPLAY OVERVIEW
Vexio challenges players to:
- Tap and clear blocks before the grid fills
- Build combos to boost score
- Avoid penalties that increase difficulty
- Progress through levels with escalating speed and patterns

The game is designed for short, high-energy play sessions with instant restart flow.

CORE FEATURES
- Phaser-based game engine
- Supabase integration for player profiles, progress tracking, and achievements
- Lightweight particle effects
- Mobile-first UI and input handling
- Modular JavaScript architecture for easy expansion

PROJECT STRUCTURE
vexio/
index.html
css/
  styles.css
js/
  game.js
  TileManager.js
  LevelManager.js
  MoveManager.js
  AdManager.js
  supabaseClient.js
  PlayerService.js
  ProgressService.js
  AchievementService.js
assets/
  particles/
    spark.png
    burst.png
    crack.png
    comboTrail.png
  sfx/
    tap.wav
    combo.wav
    penalty.wav
    goal.wav
    fail.wav

TECH STACK
- Phaser 3
- Supabase
- JavaScript (modular)
- HTML/CSS
- GitHub Pages

RUNNING VEXIO LOCALLY
1. Clone the repository
2. Serve the project with any static server (live-server, http-server, etc.)
3. Open in a mobile browser for best experience

DEPLOYMENT
Vexio runs on GitHub Pages with no build step.
Enable Pages, point to the main branch, publish.

LICENSE
MIT License

ROADMAP
- Improved particle effects
- Daily challenges
- Leaderboards
- Social achievements
- Offline mode

AUTHOR
Built by Conor — blending brand experience, game design, and digital experimentation.
