/* LevelManager.js
   Provides score goals for each level.
*/

const LevelManager = {

    getGoal(level = 1) {
        // Defensive: ensure level is a number
        level = Number(level) || 1;

        if (level < 5) return 30;
        if (level < 10) return 60;
        if (level < 20) return 120;
        if (level < 30) return 200;
        if (level < 40) return 300;

        return 450;
    }
};
