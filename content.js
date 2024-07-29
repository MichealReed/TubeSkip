// Ensure browser compatibility with both Firefox and Chrome
if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    var browser = chrome;
}

// Custom events for pushState and replaceState
(function(history){
    const pushState = history.pushState;
    history.pushState = function(state) {
        const ret = pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        return ret;
    };

    const replaceState = history.replaceState;
    history.replaceState = function(state) {
        const ret = replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        return ret;
    };
})(window.history);

const checkAndSkipVideo = (bannedArtists) => {
    const videoTitle = document.title;
    console.log('Checking video title:', videoTitle);
    for (const artist of bannedArtists) {
        if (videoTitle.includes(artist)) {
            console.log(`Skipping video with artist: ${artist}`);
            const nextButton = document.querySelector('.ytp-next-button');
            console.log('Next button:', nextButton);
            if (nextButton && !nextButton.disabled) {
                console.log('Clicking next button');
                nextButton.click();
            } else {
                console.log('Next button not found or disabled');
            }
            break;
        }
    }
};

// Periodically check and skip video, especially useful for ads or anti-ad content
const repeatCheckInterval = 5000; // Repeat every 5 seconds
let repeatCheckTimer;
const startPeriodicCheck = (bannedArtists) => {
    stopPeriodicCheck(); // Ensure any existing interval is cleared
    repeatCheckTimer = setInterval(() => {
        console.log('Periodic check and skip video');
        checkAndSkipVideo(bannedArtists);
    }, repeatCheckInterval);
};
const stopPeriodicCheck = () => {
    if (repeatCheckTimer) {
        clearInterval(repeatCheckTimer);
        repeatCheckTimer = null;
    }
};

const init = (bannedArtists) => {
    // Initial check
    checkAndSkipVideo(bannedArtists);
    startPeriodicCheck(bannedArtists);

    // Observe title changes to detect new video loads
    const titleObserver = new MutationObserver(() => {
        console.log('Title changed, checking video');
        checkAndSkipVideo(bannedArtists);
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, { childList: true, subtree: true });
    } else {
        console.log('Title element not found');
    }

    // Listen for URL changes to re-initialize observers if necessary
    let lastUrl = location.href;
    const urlChangeHandler = () => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log(`URL changed from ${lastUrl} to ${currentUrl}`);
            lastUrl = currentUrl;
            checkAndSkipVideo(bannedArtists);
        }
    };

    window.addEventListener('popstate', urlChangeHandler);
    window.addEventListener('pushstate', urlChangeHandler);
    window.addEventListener('replacestate', urlChangeHandler);

    // Cleanup when the script is re-initialized
    return () => {
        titleObserver.disconnect();
        stopPeriodicCheck();
        window.removeEventListener('popstate', urlChangeHandler);
        window.removeEventListener('pushstate', urlChangeHandler);
        window.removeEventListener('replacestate', urlChangeHandler);
    };
};

// Fetch the banned artists and initialize the observers
browser.runtime.sendMessage({ action: "getBannedArtists" }, (bannedArtists) => {
    console.log('Fetched banned artists:', bannedArtists);
    let cleanup = init(bannedArtists);

    browser.runtime.onMessage.addListener((message) => {
        if (message.action === "setBannedArtists") {
            console.log('Updated banned artists:', message.data);
            cleanup();
            cleanup = init(message.data);
        }
    });
});