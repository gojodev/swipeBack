var SCROLL_AMOUNT = 25;

function logMessage(message) {
    chrome.runtime.sendMessage(message);
}

function handleWheelEvent(e) {
    let deltaX = e.deltaX;
    if (deltaX !== 0 && Math.abs(deltaX) > SCROLL_AMOUNT) {
        if (deltaX < 0) {
            window.history.back();
            console.log("from the left");
            logMessage('backwards');
        } else {
            window.history.forward();
            console.log("from the right");
            logMessage('forward');
        }
    }
}

function currentTry() {
    // mousewheel also works for the trackpad
    document.addEventListener("mousewheel", handleWheelEvent);

    // Cleanup event listener on page unload
    window.addEventListener('beforeunload', function () {
        document.removeEventListener("mousewheel", handleWheelEvent);
    });
}

currentTry();
logMessage('Content script loaded');
