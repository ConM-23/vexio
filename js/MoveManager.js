/* MoveManager.js
   Provides move counts per level with safe defaults.
*/

const MoveManager = {

    getMoves(level = 1) {
        // Defensive: ensure level is a number
        level = Number(level) || 1;

        if (level < 5) return 10;
        if (level < 10) return 12;
        if (level < 20) return 14;
        if (level < 30) return 16;
        if (level < 40) return 18;

        return 20;
    }
};
