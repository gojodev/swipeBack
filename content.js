var SCROLL_AMOUNT = 25;

function handleWheelEvent(e) {
    let deltaX = e.deltaX;
    console.log(Math.abs(deltaX));
    if (deltaX !== 0 && Math.abs(deltaX) > SCROLL_AMOUNT) {
        if (deltaX < 0) {
            try {
                window.history.back();
            }
            catch {
                console.log('previous page does not exist');
            }
        } else {
            try {
                window.history.forward();
            }
            catch {
                console.log('forward page does not exist');
            }
        }
    }
}

document.addEventListener("mousewheel", handleWheelEvent);

/**
 * allows the browser to properly execute the most recent gesture action
 * so this service doesn't go backwards or forwards to more pages than it should
 *  */
window.addEventListener('beforeunload', () => {
    document.removeEventListener("mousewheel", handleWheelEvent);
});