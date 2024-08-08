function hideArrows() {
    document.getElementById("leftArrow").style.opacity = 0;
    document.getElementById("rightArrow").style.opacity = 0;
    updateLeftPos = 0;
    updateRightPos = 0;
}

hideArrows();

var TRIGGER_AMOUNT = 150; // the actual trigger amount
var DISPLAY_AMOUNT = 125; // how far it goes on the screen
var updateLeftPos = 0;
var updateRightPos = 0;
var inactivityTimeout;
var moveID;
var navAPI = typeof navigation === 'undefined';

function showAnimation(amt, id) {
    let element = document.getElementById(id);
    element.style.transition = 'none';
    element.style.top = '50%';
    element.style.position = "absolute";
    amt = Math.abs(amt);

    element.style.opacity = 1;
    if (amt >= DISPLAY_AMOUNT) {
        if (id === "leftArrow") {
            history.back();
        } else {
            history.forward();
        }
    }
}

function translate(amt, id) {
    // ? compatibility concern for firefox - https://developer.mozilla.org/en-US/docs/Web/API/Navigation/canGoForward#browser_compatibility
    if (id == "leftArrow" && updateLeftPos < DISPLAY_AMOUNT && (navAPI || navigation.canGoBack)) {
        updateLeftPos += amt;
        let left = document.getElementById(id);
        left.style.transform = `translate(${updateLeftPos}px)`;
        left.style.left = '0px';

        showAnimation(updateLeftPos, id);
    }

    else if (id == "rightArrow" && updateRightPos < DISPLAY_AMOUNT && (navAPI || navigation.canGoForward)) {
        updateRightPos += amt;
        let right = document.getElementById(id);
        right.style.transform = `translate(-${updateRightPos}px)`;
        right.style.right = '0px';

        showAnimation(updateRightPos, id);
    }
}

function handleWheelEvent(e) {
    let deltaX = e.deltaX;
    if (deltaX !== 0) {
        if (deltaX < 0) {
            moveID = 'left';
            translate(Math.abs(deltaX), "leftArrow");

        } else {
            moveID = 'right';
            translate(Math.abs(deltaX), "rightArrow");
        }

        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(hideArrows, 100);
    }
}

window.addEventListener('beforeunload', () => {
    document.removeEventListener("mousewheel", handleWheelEvent);
});

document.addEventListener("wheel", handleWheelEvent);