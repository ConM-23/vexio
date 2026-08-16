// HYBRID GAME.JS — FULL POLISH + DEBUG + ANDROID-SAFE PLAY

// GLOBAL STATE
let currentPlayerId = null;
let currentLevel = 1;
let totalScore = 0;

// COMBO / PRESTIGE STATE
let comboStreak = 0;
let isPrestige = false;

// SOUND BANK
let SFX = {};
let debugText;

// DEBUG LOGGER
function dbg(scene, msg) {
    console.log(msg);
    if (debugText) {
        debugText.setText(debugText.text + "\n" + msg);
    }
}

// LOAD SFX
function loadSFX(scene) {
    dbg(scene, "Loading SFX...");
    SFX.tap = scene.sound.add('tap', { volume: 0.4 });
    SFX.combo = scene.sound.add('combo', { volume: 0.5 });
    SFX.penalty = scene.sound.add('penalty', { volume: 0.5 });
    SFX.goal = scene.sound.add('goal', { volume: 0.6 });
    SFX.fail = scene.sound.add('fail', { volume: 0.6 });
    SFX.achievement = scene.sound.add('goal', { volume: 0.7 });
}

// ACHIEVEMENT POPUP
function showAchievementPopup(scene, text) {
    dbg(scene, "Achievement popup: " + text);

    const popup = scene.add.rectangle(180, -80, 300, 60, 0xFFB347)
        .setStrokeStyle(3, 0xFFFFFF)
        .setAlpha(0);

    const label = scene.add.text(60, -95, `Achievement Unlocked:\n${text}`, {
        fontSize: '18px',
        fill: '#181820'
    }).setAlpha(0);

    scene.tweens.add({
        targets: [popup, label],
        y: 100,
        alpha: 1,
        duration: 500,
        ease: 'Back.Out'
    });

    scene.time.delayedCall(1800, () => {
        scene.tweens.add({
            targets: [popup, label],
            y: -80,
            alpha: 0,
            duration: 500,
            ease: 'Back.In',
            onComplete: () => {
                popup.destroy();
                label.destroy();
            }
        });
    });

    if (SFX.achievement) SFX.achievement.play();
}

// LEVEL INTRO BANNER
function showLevelIntro(scene, level, goal, moves) {
    dbg(scene, `Level intro: L${level}, goal=${goal}, moves=${moves}`);

    const banner = scene.add.rectangle(180, 320, 320, 140, 0x181820)
        .setStrokeStyle(3, 0xFFB347)
        .setAlpha(0);

    const text = scene.add.text(70, 280,
        `Level ${level}\nGoal: ${goal}\nMoves: ${moves}`,
        { fontSize: '20px', fill: '#FFB347' }
    ).setAlpha(0);

    scene.tweens.add({
        targets: [banner, text],
        alpha: 1,
        duration: 400,
        ease: 'Quad.Out'
    });

    scene.time.delayedCall(1400, () => {
        scene.tweens.add({
            targets: [banner, text],
            alpha: 0,
            duration: 400,
            ease: 'Quad.In',
            onComplete: () => {
                banner.destroy();
                text.destroy();
            }
        });
    });
}

// BOOT SCENE
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        dbg(this, "BootScene: Preloading assets...");

        // SFX
        this.load.audio('tap', 'assets/sfx/tap.wav');
        this.load.audio('combo', 'assets/sfx/combo.wav');
        this.load.audio('penalty', 'assets/sfx/penalty.wav');
        this.load.audio('goal', 'assets/sfx/goal.wav');
        this.load.audio('fail', 'assets/sfx/fail.wav');

        // PARTICLES
        this.load.image('spark', 'assets/particles/spark.png');
        this.load.image('burst', 'assets/particles/burst.png');
        this.load.image('crack', 'assets/particles/crack.png');
        this.load.image('comboTrail', 'assets/particles/comboTrail.png');
    }

    create() {
        dbg(this, "BootScene: Assets loaded.");
        this.scene.start('MenuScene');
    }
}

// MENU SCENE (animated + debug + safe Play)
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        dbg(this, "MenuScene: Loaded.");

        this.cameras.main.setBackgroundColor('#181820');
        this.cameras.main.fadeIn(400);

        debugText = this.add.text(10, 10, "DEBUG LOG:\nMenuScene loaded", {
            fontSize: "12px",
            fill: "#FFFFFF"
        });

        const title = this.add.text(60, 80, 'VEXIO', {
            fontSize: '40px',
            fill: '#FF5A5F'
        }).setAlpha(0).setScale(0.8);

        this.tweens.add({
            targets: title,
            alpha: 1,
            scale: 1,
            duration: 500,
            ease: 'Back.Out'
        });

        const subtitle = this.add.text(60, 130, 'Tap tiles.\nHit the goal.\nManage your moves.', {
            fontSize: '16px',
            fill: '#E5E7EB'
        }).setAlpha(0);

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 500,
            delay: 200
        });

        // REAL BUTTON: text + transparent hitbox
        const playText = this.add.text(135, 248, 'Play', {
            fontSize: '24px',
            fill: '#181820'
        });

        const playBtn = this.add.rectangle(180, 270, 200, 60, 0xFF5A5F);
        playBtn.setInteractive({ useHandCursor: true });

        playBtn.on('pointerdown', () => {
            dbg(this, "MenuScene: Play pressed → LevelScene");
            this.cameras.main.fadeOut(300);
            this.time.delayedCall(300, () => this.scene.start('LevelScene'));
        });

        const achBtn = this.add.rectangle(180, 330, 200, 50, 0x2ED2C9)
            .setScale(0.9)
            .setAlpha(0);
        achBtn.setInteractive({ useHandCursor: true });
        const achText = this.add.text(120, 318, 'Achievements', {
            fontSize: '20px',
            fill: '#181820'
        }).setAlpha(0);

        this.tweens.add({
            targets: [achBtn, achText],
            alpha: 1,
            scale: 1,
            duration: 400,
            delay: 400,
            ease: 'Back.Out'
        });

        achBtn.on('pointerdown', () => {
            dbg(this, "MenuScene: Achievements pressed → AchievementScene");
            this.cameras.main.fadeOut(300);
            this.time.delayedCall(300, () => this.scene.start('AchievementScene'));
        });

        // Prestige visual hint
        if (currentLevel >= 40) {
            const prestigeGlow = this.add.rectangle(180, 320, 360, 640, 0xFF5A5F)
                .setAlpha(0.08);
            this.tweens.add({
                targets: prestigeGlow,
                alpha: { from: 0.05, to: 0.12 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut'
            });
        }

        if (typeof AdManager !== 'undefined' && AdManager.showBanner) {
            dbg(this, "MenuScene: Showing banner ad.");
            AdManager.showBanner();
        }
    }
}

// LEVEL SCENE (full polish + debug)
class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
    }

    create() {
        dbg(this, "LevelScene: Started.");

        if (typeof AdManager !== 'undefined' && AdManager.hideBanner) {
            dbg(this, "LevelScene: Hiding banner ad.");
            AdManager.hideBanner();
        }

        this.cameras.main.setBackgroundColor('#181820');
        this.cameras.main.fadeIn(300);

        loadSFX(this);

        try {
            this.goal = LevelManager.getGoal(currentLevel);
            dbg(this, "LevelScene: Goal = " + this.goal);
        } catch (e) {
            dbg(this, "ERROR: LevelManager missing or broken.");
            dbg(this, e.message);
            this.goal = 20;
        }

        try {
            this.movesLeft = Math.floor(MoveManager.getMoves(currentLevel));
            dbg(this, "LevelScene: Moves = " + this.movesLeft);
        } catch (e) {
            dbg(this, "ERROR: MoveManager missing or broken.");
            dbg(this, e.message);
            this.movesLeft = 10;
        }

        this.levelScore = 0;
        this.comboActive = false;
        comboStreak = 0;
        isPrestige = currentLevel >= 40;

        this.add.text(20, 20, `Level ${currentLevel}`, {
            fontSize: '20px',
            fill: '#FFB347'
        });

        this.scoreText = this.add.text(20, 50, `Score: ${this.levelScore}`, {
            fontSize: '18px',
            fill: '#2ED2C9'
        });

        this.movesText = this.add.text(200, 20, `Moves: ${this.movesLeft}`, {
            fontSize: '18px',
            fill: '#E5E7EB'
        });

        this.goalText = this.add.text(20, 80, `Goal: ${this.goal}`, {
            fontSize: '18px',
            fill: '#FFB347'
        });

        if (isPrestige) {
            const overlay = this.add.rectangle(180, 320, 360, 640, 0x9B59B6)
                .setAlpha(0.08);
            this.tweens.add({
                targets: overlay,
                alpha: { from: 0.05, to: 0.12 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut'
            });
        }

        try {
            this.createGrid();
            dbg(this, "LevelScene: Grid created.");
        } catch (e) {
            dbg(this, "ERROR during grid creation:");
            dbg(this, e.message);
        }

        showLevelIntro(this, currentLevel, this.goal, this.movesLeft);

        const endBtn = this.add.rectangle(180, 600, 200, 40, 0xFF5A5F);
        endBtn.setInteractive({ useHandCursor: true });
        this.add.text(130, 590, 'End Level', {
            fontSize: '18px',
            fill: '#181820'
        });

        endBtn.on('pointerdown', () => {
            dbg(this, "LevelScene: End Level pressed (fail).");
            this.endLevel(false);
        });
    }

    createGrid() {
        this.tiles = [];
        const TILE_SIZE = 70;
        const OFFSET_X = 50;
        const OFFSET_Y = 140;

        for (let row = 0; row < 4; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < 4; col++) {

                dbg(this, `Creating tile ${row},${col}`);

                let type, value, color;

                try {
                    type = TileManager.getTileType(currentLevel);
                    value = TileManager.getTileValue(type);
                    color = TileManager.getTileColor(type);
                } catch (e) {
                    dbg(this, "ERROR: TileManager missing or broken.");
                    dbg(this, e.message);
                    type = "normal";
                    value = 1;
                    color = 0x3B4252;
                }

                const x = OFFSET_X + col * TILE_SIZE;
                const y = OFFSET_Y + row * TILE_SIZE;

                const tile = this.add.rectangle(
                    x,
                    y,
                    TILE_SIZE - 5,
                    TILE_SIZE - 5,
                    color
                );
                tile.setStrokeStyle(2, 0xE5E7EB);
                tile.setInteractive({ useHandCursor: true });

                const text = this.add.text(x - 10, y - 12, value.toString(), {
                    fontSize: '24px',
                    fill: '#FFFFFF'
                });

                tile.value = value;
                tile.type = type;
                tile.valueText = text;

                // Glow sparkle
                if (type === "glow") {
                    const sparkle = this.add.particles('spark');
                    sparkle.createEmitter({
                        x: x,
                        y: y,
                        speed: { min: -20, max: 20 },
                        scale: { start: 0.3, end: 0 },
                        alpha: { start: 0.8, end: 0 },
                        lifespan: 600,
                        frequency: 200,
                        blendMode: 'ADD'
                    });
                }

                // Idle float
                this.tweens.add({
                    targets: tile,
                    y: y + Phaser.Math.Between(-4, 4),
                    duration: Phaser.Math.Between(1800, 2600),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.InOut'
                });

                // Wobble
                this.tweens.add({
                    targets: tile,
                    angle: { from: -2, to: 2 },
                    duration: Phaser.Math.Between(1600, 2400),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.InOut'
                });

                tile.on('pointerdown', () => {
                    dbg(this, `Tile tapped → type=${tile.type}, value=${tile.value}`);
                    this.handleTileTap(tile);
                });

                this.tiles[row][col] = tile;
            }
        }
    }

    handleTileTap(tile) {
        if (this.movesLeft <= 0) {
            dbg(this, "LevelScene: Out of moves.");
            this.outOfMoves();
            return;
        }

        this.movesLeft--;

        let gained = tile.value;

        // Burst particles
        const burst = this.add.particles('burst');
        burst.createEmitter({
            x: tile.x,
            y: tile.y,
            speed: { min: -120, max: 120 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 300,
            blendMode: 'ADD',
            quantity: 12
        });

        // Sound
        if (tile.type === "penalty" && SFX.penalty) SFX.penalty.play();
        else if (tile.type === "combo" && SFX.combo) SFX.combo.play();
        else if (SFX.tap) SFX.tap.play();

        // Combo trail
        if (tile.type === "combo") {
            const trail = this.add.particles('comboTrail');
            trail.createEmitter({
                x: tile.x,
                y: tile.y,
                speed: { min: -40, max: 40 },
                scale: { start: 0.5, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 500,
                blendMode: 'ADD',
                quantity: 8
            });
            this.comboActive = true;
        }

        if (this.comboActive && tile.type !== "combo") {
            gained += 5;
            this.comboActive = false;
            comboStreak++;
            dbg(this, "Combo streak: " + comboStreak);
            this.showComboStreakEffect(tile.x, tile.y);
        } else {
            comboStreak = 0;
        }

        this.levelScore += gained;

        // Score pop
        this.tweens.add({
            targets: this.scoreText,
            scale: { from: 1, to: 1.2 },
            duration: 120,
            yoyo: true,
            ease: 'Quad.Out'
        });

        // Move shake
        if (this.movesLeft <= 3) {
            this.tweens.add({
                targets: this.movesText,
                x: '+=4',
                yoyo: true,
                repeat: 3,
                duration: 50
            });
        }

        this.movesText.setText(`Moves: ${this.movesLeft}`);
        this.scoreText.setText(`Score: ${this.levelScore}`);

        // Tile destruction animation
        this.tweens.add({
            targets: tile,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 80,
            yoyo: true,
            onComplete: () => {
                this.tweens.add({
                    targets: tile,
                    alpha: 0,
                    scaleX: 0.6,
                    scaleY: 0.6,
                    duration: 150,
                    onComplete: () => {
                        tile.destroy();
                        tile.valueText.destroy();
                    }
                });
            }
        });

        tile.value = 0;
        tile.valueText.setText('0');

        if (this.levelScore >= this.goal) {
            dbg(this, "LevelScene: Goal reached.");
            if (SFX.goal) SFX.goal.play();
            this.goalExplosion(tile.x, tile.y);
            this.time.delayedCall(300, () => this.endLevel(true));
        }
    }

    showComboStreakEffect(x, y) {
        if (comboStreak <= 1) return;

        const label = this.add.text(x - 30, y - 40, `Combo x${comboStreak}`, {
            fontSize: '16px',
            fill: '#FFB347'
        }).setAlpha(0);

        this.tweens.add({
            targets: label,
            alpha: 1,
            y: y - 60,
            duration: 300,
            ease: 'Quad.Out',
            yoyo: true,
            hold: 300,
            onComplete: () => label.destroy()
        });

        const spark = this.add.particles('spark');
        spark.createEmitter({
            x: x,
            y: y,
            speed: { min: -80, max: 80 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 400,
            blendMode: 'ADD',
            quantity: 16
        });
    }

    goalExplosion(x, y) {
        const explosion = this.add.particles('spark');
        explosion.createEmitter({
            x: x,
            y: y,
            speed: { min: -200, max: 200 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            blendMode: 'ADD',
            quantity: 30
        });

        if (isPrestige) {
            showAchievementPopup(this, 'Prestige Progress');
        }
    }

    outOfMoves() {
        dbg(this, "LevelScene: Out of moves → rewarded ad?");
        if (SFX.fail) SFX.fail.play();

        if (typeof AdManager !== 'undefined' && AdManager.showRewarded) {
            AdManager.showRewarded((rewarded) => {
                dbg(this, "Rewarded ad result: " + rewarded);
                if (rewarded) {
                    const bonus =
                        currentLevel < 10 ? 3 :
                        currentLevel < 20 ? 5 :
                        7;

                    this.movesLeft += bonus;
                    this.movesText.setText(`Moves: ${this.movesLeft}`);
                }
            });
        }
    }

    async endLevel(success) {
        dbg(this, "LevelScene: endLevel, success=" + success);

        totalScore += this.levelScore;

        if (success) {
            currentLevel++;
            showAchievementPopup(this, 'Level Clear');
        }

        if (currentPlayerId && typeof updateProgress !== 'undefined') {
            try {
                await updateProgress(currentPlayerId, currentLevel, totalScore);
                dbg(this, "Progress updated.");
            } catch (e) {
                dbg(this, "ERROR updating progress:");
                dbg(this, e.message);
            }

            if (success && typeof unlockAchievement !== 'undefined') {
                try {
                    await unlockAchievement(currentPlayerId, 'Level Clear');
                    dbg(this, "Achievement unlocked: Level Clear");
                } catch (e) {
                    dbg(this, "ERROR unlocking achievement:");
                    dbg(this, e.message);
                }
            }
        }

        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('MenuScene');
        });
    }
}

// ACHIEVEMENT SCENE (with debug)
class AchievementScene extends Phaser.Scene {
    constructor() {
        super('AchievementScene');
    }

    async create() {
        dbg(this, "AchievementScene: Loaded.");

        this.cameras.main.setBackgroundColor('#181820');
        this.cameras.main.fadeIn(300);

        this.add.text(80, 40, 'Achievements', {
            fontSize: '26px',
            fill: '#FF5A5F'
        });

        const backBtn = this.add.rectangle(180, 600, 200, 40, 0x2ED2C9);
        backBtn.setInteractive({ useHandCursor: true });
        this.add.text(150, 590, 'Back', {
            fontSize: '18px',
            fill: '#181820'
        });

        backBtn.on('pointerdown', () => {
            dbg(this, "AchievementScene: Back pressed → MenuScene");
            this.cameras.main.fadeOut(300);
            this.time.delayedCall(300, () => this.scene.start('MenuScene'));
        });

        if (!currentPlayerId || typeof getAchievements === 'undefined') {
            dbg(this, "AchievementScene: No player ID or getAchievements missing.");
            this.add.text(40, 120, 'Sign in to see achievements.', {
                fontSize: '16px',
                fill: '#E5E7EB'
            });
            return;
        }

        try {
            const achievements = (await getAchievements(currentPlayerId)) || [];
            dbg(this, "AchievementScene: Loaded " + achievements.length + " achievements.");
            let y = 120;
            achievements.forEach(a => {
                this.add.text(40, y, `• ${a.badge}`, {
                    fontSize: '18px',
                    fill: '#FFB347'
                });
                y += 30;
            });
        } catch (e) {
            dbg(this, "ERROR loading achievements:");
            dbg(this, e.message);
            this.add.text(40, 120, 'Error loading achievements.', {
                fontSize: '16px',
                fill: '#E5E7EB'
            });
        }
    }
}

// PHASER CONFIG
const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#181820',
    scene: [BootScene, MenuScene, LevelScene, AchievementScene]
};

const game = new Phaser.Game(config);
