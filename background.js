// Ensure browser compatibility with both Firefox and Chrome
if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    var browser = chrome;
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getBannedArtists") {
        browser.storage.local.get('bannedArtists', (result) => {
            sendResponse(result.bannedArtists || []);
        });
        return true;
    } else if (message.action === "setBannedArtists") {
        browser.storage.local.set({ bannedArtists: message.data }, () => {
            sendResponse({ status: "success" });
        });
        return true;
    }
});