// AdManager.js

const AdManager = {
    showBanner() {
        console.log("AdManager: showBanner (placeholder)");
    },

    hideBanner() {
        console.log("AdManager: hideBanner (placeholder)");
    },

    showRewarded(callback) {
        console.log("AdManager: showRewarded (placeholder)");
        // Simulate rewarded ad success after delay
        setTimeout(() => {
            const rewarded = true;
            callback(rewarded);
        }, 1000);
    }
};