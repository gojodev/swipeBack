function detectTrackPad(e) {
    // detect the track pad
    if (e.deltaX > 0) {
        window.history.go(+1);
    }
    else {
        window.history.back();
    }
}

document.addEventListener("mousewheel", detectTrackPad);