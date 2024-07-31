// Initially set arrows to be invisible
document.getElementById("leftArrow").style.opacity = 0;
document.getElementById("rightArrow").style.opacity = 0;

var SCROLL_AMOUNT = 200;
var updateLeftPos = 0;
var updateRightPos = 0;
var inactivityTimeout;

// Function to show animation and navigate history
function showAnimation(amt, id) {
    let element = document.getElementById(id);
    element.style.transition = 'none';
    element.style.top = '50%';
    element.style.position = "absolute";
    element.style.opacity = 1;

    if (amt >= SCROLL_AMOUNT) {
        if (id === "leftArrow" && history.length > 1) {
            window.history.back();
        } else {
            window.history.forward();
        }
    }
}

// Function to translate the arrow elements
function translate(amt, id) {
    if (id === "leftArrow") {
        updateLeftPos += amt;
        let left = document.getElementById(id);
        left.style.transform = `translate(${updateLeftPos}px)`;
        left.style.left = '0px';
        showAnimation(Math.abs(updateLeftPos), id);
    } else {
        updateRightPos += amt;
        let right = document.getElementById(id);
        right.style.transform = `translate(-${updateRightPos}px)`;
        right.style.right = '0px';
        showAnimation(Math.abs(updateRightPos), id);
    }
}

// Function to handle wheel event
function handleWheelEvent(e) {
    let deltaX = e.deltaX;
    if (deltaX !== 0) {
        if (deltaX < 0) {
            translate(Math.abs(deltaX), "leftArrow");
        } else {
            translate(Math.abs(deltaX), "rightArrow");
        }

        // Reset the inactivity timer
        resetInactivityTimeout();
    }
}

// Function to hide arrows after inactivity
function hideArrows() {
    document.getElementById("leftArrow").style.opacity = 0;
    document.getElementById("rightArrow").style.opacity = 0;
    updateLeftPos = 0;
    updateRightPos = 0;
}

// Function to reset the inactivity timeout
function resetInactivityTimeout() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(hideArrows, 1000); // 1000ms = 1 second of inactivity
}

// Attach the event listeners
document.addEventListener("wheel", handleWheelEvent);
document.addEventListener("mousemove", resetInactivityTimeout);

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    document.removeEventListener("wheel", handleWheelEvent);
    document.removeEventListener("mousemove", resetInactivityTimeout);
});
