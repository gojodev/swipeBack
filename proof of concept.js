// proof that javascript can detect and measure touch interactions on the y axis so it likely can do the same for the x axis
function detectTrackPad(e) {
    var isTrackpad = false;
    if (e.wheelDeltaY) {
        if (e.wheelDeltaY === (e.deltaY * -3)) {
            isTrackpad = true;
        }
    }
    else if (e.deltaMode === 0) {
        isTrackpad = true;
    }
    console.log(isTrackpad ? "Trackpad detected" : "Mousewheel detected");
}

document.addEventListener("mousewheel", detectTrackPad);
document.addEventListener("DOMMouseScroll", detectTrackPad);