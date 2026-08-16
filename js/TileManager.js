/* TileManager.js
   Handles tile type, value, and color generation.
*/

const TileManager = {

    getTileType(level = 1) {
        const roll = Math.random();

        // Glow tiles only appear from level 40+
        if (level >= 40 && roll < 0.15) return "glow";

        if (roll < 0.10) return "penalty";
        if (roll < 0.25) return "combo";

        return "normal";
    },

    getTileValue(type = "normal") {
        switch (type) {
            case "normal":
                return Phaser.Math.Between(1, 6);

            case "combo":
                return Phaser.Math.Between(4, 10);

            case "penalty":
                return Phaser.Math.Between(-6, -2);

            case "glow":
                return Phaser.Math.Between(8, 14);

            default:
                console.warn("Unknown tile type:", type);
                return 1;
        }
    },

    getTileColor(type = "normal") {
        switch (type) {
            case "normal":
                return 0x3B4252;   // grey-blue

            case "combo":
                return 0x2ED2C9;   // teal

            case "penalty":
                return 0xFF5A5F;   // red

            case "glow":
                return 0xFFB347;   // amber

            default:
                console.warn("Unknown tile type:", type);
                return 0x3B4252;
        }
    }
};
