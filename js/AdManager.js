/* AdManager.js
   Placeholder ad manager for GitHub Pages / local testing.
   Prevents crashes if callbacks are missing or invalid.
*/

const AdManager = {

    showBanner() {
        console.log("AdManager: showBanner (placeholder)");
    },

    hideBanner() {
        console.log("AdManager: hideBanner (placeholder)");
    },

    showRewarded(callback) {
        console.log("AdManager: showRewarded (placeholder)");

        // Defensive: ensure callback is a function
        if (typeof callback !== "function") {
            console.warn("AdManager: showRewarded called without a valid callback.");
            return;
        }

        // Simulate rewarded ad success after delay
        setTimeout(() => {
            const rewarded = true;
            try {
                callback(rewarded);
            } catch (err) {
                console.error("AdManager callback error:", err);
            }
        }, 1000);
    }
};
