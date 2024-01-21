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

function oldertry() {
  document.addEventListener("mousewheel", (e) => {
    // detect the track pad
    if (e.deltaX > 30) {
      // console.log("forwards");
      window.history.forward();
    }
    else {
      // console.log("backwards");
      window.history.back();
    }
  });
}

/// --------------------------------------------------------

let lastKnownScrollPosition = 0;
let ticking = false;

function doSomething(scrollPos) {
  // Do something with the scroll position
  console.log("scrollPos: ", scrollPos)
}

document.addEventListener("scroll", () => {
  lastKnownScrollPosition = window.scrollX;
  console.log("lastKnownScrollPosition: ", lastKnownScrollPosition)

  if (!ticking) {
    window.requestAnimationFrame(() => {
      doSomething(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});
