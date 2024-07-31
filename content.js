document.getElementById("leftArrow").style.opacity = 0;
document.getElementById("rightArrow").style.opacity = 0;

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

var SCROLL_AMOUNT = 200;

var updateLeftPos = 0;
var updateRightPos = 0;

function translate(amt, id) {
    if (id == "leftArrow") {
        updateLeftPos += amt;
        let left = document.getElementById(id);
        left.style.transform = `translate(${updateLeftPos}px)`;
        left.style.left = '0px';

        // console.log("left: ", updateLeftPos);
        showAnimation(Math.abs(updateLeftPos), id);
    }

    else {
        updateRightPos += amt;
        let right = document.getElementById(id);
        right.style.transform = `translate(-${updateRightPos}px)`;
        right.style.right = '0px';
        // console.log("right: ", updateRightPos);

        showAnimation(Math.abs(updateRightPos), id);
    }
}

function handleWheelEvent(e) {
    let deltaX = e.deltaX;
    if (deltaX !== 0) {
        if (deltaX < 0) {
            translate(Math.abs(deltaX), "leftArrow");

        } else {
            translate(Math.abs(deltaX), "rightArrow");
        }

        // todo hide the arrows when the user isn't touching the mousepad
        // semi working solution in test.js
    }
}

window.addEventListener('beforeunload', () => {
    document.removeEventListener("mousewheel", handleWheelEvent);
});

document.addEventListener("wheel", handleWheelEvent);