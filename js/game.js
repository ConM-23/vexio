/* game.js — Clean Production Version */

let currentPlayerId = null;
let currentLevel = 1;
let totalScore = 0;

class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.audio('tap', 'assets/sfx/tap.wav');
        this.load.audio('combo', 'assets/sfx/combo.wav');
        this.load.audio('penalty', 'assets/sfx/penalty.wav');
        this.load.audio('goal', 'assets/sfx/goal.wav');
        this.load.audio('fail', 'assets/sfx/fail.wav');

        this.load.image('spark', 'assets/particles/spark.png');
        this.load.image('burst', 'assets/particles/burst.png');
    }

    create() {
        this.scene.start('MenuScene');
    }
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#181820');

        this.add.text(100, 120, 'VEXIO', {
            fontSize: '48px',
            fill: '#FF5A5F'
        });

        const playBtn = this.add.rectangle(180, 300, 200, 60, 0xFF5A5F);
        playBtn.setInteractive({ useHandCursor: true });
        this.add.text(140, 285, 'Play', {
            fontSize: '24px',
            fill: '#181820'
        });

        playBtn.on('pointerdown', () => {
            this.scene.start('LevelScene');
        });

        if (typeof AdManager !== 'undefined') {
            AdManager.showBanner?.();
        }
    }
}

class LevelScene extends Phaser.Scene {
    constructor() {
        super('LevelScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#181820');

        if (typeof AdManager !== 'undefined') {
            AdManager.hideBanner?.();
        }

        this.goal = LevelManager.getGoal(currentLevel);
        this.movesLeft = MoveManager.getMoves(currentLevel);
        this.levelScore = 0;

        this.add.text(20, 20, `Level ${currentLevel}`, {
            fontSize: '20px',
            fill: '#FFB347'
        });

        this.scoreText = this.add.text(20, 50, `Score: 0`, {
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

        this.createGrid();
    }

    createGrid() {
        this.tiles = [];
        const TILE_SIZE = 70;
        const OFFSET_X = 50;
        const OFFSET_Y = 140;

        for (let row = 0; row < 4; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < 4; col++) {

                const type = TileManager.getTileType(currentLevel);
                const value = TileManager.getTileValue(type);
                const color = TileManager.getTileColor(type);

                const x = OFFSET_X + col * TILE_SIZE;
                const y = OFFSET_Y + row * TILE_SIZE;

                const tile = this.add.rectangle(
                    x, y,
                    TILE_SIZE - 5,
                    TILE_SIZE - 5,
                    color
                ).setInteractive({ useHandCursor: true });

                const text = this.add.text(x - 10, y - 12, value.toString(), {
                    fontSize: '24px',
                    fill: '#FFFFFF'
                });

                tile.value = value;
                tile.type = type;
                tile.valueText = text;

                tile.on('pointerdown', () => this.handleTileTap(tile));

                this.tiles[row][col] = tile;
            }
        }
    }

    handleTileTap(tile) {
        if (this.movesLeft <= 0) {
            this.outOfMoves();
            return;
        }

        this.movesLeft--;
        this.movesText.setText(`Moves: ${this.movesLeft}`);

        this.levelScore += tile.value;
        this.scoreText.setText(`Score: ${this.levelScore}`);

        tile.value = 0;
        tile.valueText.setText('0');
        tile.setAlpha(0.4);

        if (this.levelScore >= this.goal) {
            this.endLevel(true);
        }
    }

    outOfMoves() {
        if (typeof AdManager !== 'undefined') {
            AdManager.showRewarded?.((rewarded) => {
                if (rewarded) {
                    this.movesLeft += 3;
                    this.movesText.setText(`Moves: ${this.movesLeft}`);
                }
            });
        }
    }

    async endLevel(success) {
        totalScore += this.levelScore;

        if (success) {
            currentLevel++;
        }

        if (currentPlayerId && typeof updateProgress !== 'undefined') {
            await updateProgress(currentPlayerId, currentLevel, totalScore);
        }

        this.scene.start('MenuScene');
    }
}

class AchievementScene extends Phaser.Scene {
    constructor() {
        super('AchievementScene');
    }

    async create() {
        this.cameras.main.setBackgroundColor('#181820');

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
            this.scene.start('MenuScene');
        });

        if (!currentPlayerId || typeof getAchievements === 'undefined') {
            this.add.text(40, 120, 'Sign in to see achievements.', {
                fontSize: '16px',
                fill: '#E5E7EB'
            });
            return;
        }

        const achievements = await getAchievements(currentPlayerId);
        let y = 120;

        achievements.forEach(a => {
            this.add.text(40, y, `• ${a.badge}`, {
                fontSize: '18px',
                fill: '#FFB347'
            });
            y += 30;
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#181820',
    scene: [BootScene, MenuScene, LevelScene, AchievementScene]
};

new Phaser.Game(config);
