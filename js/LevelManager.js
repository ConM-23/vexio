// LevelManager.js

const LevelManager = {
    getGoal(level) {
        if (level < 5) return 30;
        if (level < 10) return 60;
        if (level < 20) return 120;
        if (level < 30) return 200;
        if (level < 40) return 300;
        return 450;
    }
};