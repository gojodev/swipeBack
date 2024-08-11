// todo gotta create DOM elements for client ('leftArrow' and 'rightArrow')

function createDiv() {
    return document.createElement('div');
}

function create_arrowLeft() {
    const arrowLeft = createDiv();
    arrowLeft.classList.add('arrowLeft');
    return arrowLeft;
}

function create_arrowRight() {
    const arrowRight = createDiv();
    arrowRight.classList.add('arrowRight');
    return arrowRight;
}

function createArrows() {
    const leftArrow = createDiv();
    leftArrow.id = 'leftArrow';

    const leftContainer = createDiv();
    leftContainer.classList.add('arrowContainer', 'leftPos');
    leftArrow.appendChild(leftContainer);

    const arrowSlidingLeft = createDiv();
    arrowSlidingLeft.classList.add('arrowSlidingLeft');
    arrowSlidingLeft.appendChild(create_arrowLeft());
    leftContainer.appendChild(arrowSlidingLeft);

    const leftdelay1 = createDiv();
    leftdelay1.classList.add('arrowSlidingLeft', 'delay1');
    leftdelay1.appendChild(create_arrowLeft());
    leftContainer.appendChild(leftdelay1);

    const leftdelay2 = createDiv();
    leftdelay2.classList.add('arrowSlidingLeft', 'delay2');
    leftdelay2.appendChild(create_arrowLeft());
    leftContainer.appendChild(leftdelay2);

    const leftdelay3 = createDiv();
    leftdelay3.classList.add('arrowSlidingLeft', 'delay3');
    leftdelay3.appendChild(create_arrowLeft());
    leftContainer.appendChild(leftdelay3);
    document.body.append(leftArrow);

    // console.log(leftArrow);
    // ------------------------

    const rightArrow = createDiv();
    rightArrow.id = 'rightArrow';

    const rightContainer = createDiv();
    rightContainer.classList.add('arrowContainer', 'rightPos');
    rightArrow.appendChild(rightContainer);

    const arrowSlidingRight = createDiv();
    arrowSlidingRight.classList.add('arrowSlidingRight');
    arrowSlidingRight.append(create_arrowRight());
    rightContainer.appendChild(arrowSlidingRight);

    const rightdelay1 = createDiv();
    rightdelay1.classList.add('arrowSlidingRight', 'delay1');
    rightdelay1.appendChild(create_arrowRight());
    rightContainer.appendChild(rightdelay1);

    const rightdelay2 = createDiv();
    rightdelay2.classList.add('arrowSlidingRight', 'delay2');
    rightdelay2.appendChild(create_arrowRight());
    rightContainer.appendChild(rightdelay2);

    const rightdelay3 = createDiv();
    rightdelay3.classList.add('arrowSlidingRight', 'delay3');
    rightdelay3.appendChild(create_arrowRight());
    rightContainer.appendChild(rightdelay3);
    document.body.append(rightArrow);

    // console.log(rightArrow);
}

createArrows();

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

function hide(id) {
    document.getElementById(id).style.opacity = 0;
}

function show(id) {
    document.getElementById(id).style.opacity = 1;
}

function translate(amt, id) {
    // const progress = Math.min(amt / TRIGGER_AMOUNT, 1);
    const element = document.getElementById(id);

    // ? compatibility concern for firefox - https://developer.mozilla.org/en-US/docs/Web/API/Navigation/canGoForward#browser_compatibility
    if (id == "leftArrow" && updateLeftPos < DISPLAY_AMOUNT && (navAPI || navigation.canGoBack)) {
        show(id);
        hide('rightArrow');
        updateLeftPos += amt;
        element.style.transform = `translate(${updateLeftPos}px)`;
        element.style.left = '0px';

        showAnimation(updateLeftPos, id);
    }

    else if (id == "rightArrow" && updateRightPos < DISPLAY_AMOUNT && (navAPI || navigation.canGoForward)) {
        show(id);
        hide('leftArrow');
        updateRightPos += amt;
        element.style.transform = `translate(-${updateRightPos}px)`;
        element.style.right = '0px';

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