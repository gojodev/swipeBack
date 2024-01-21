// https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event#Example
// ! mousewheel is likely the correct event listener for X movement

var SCROLL_AMOUNT = 25;
function oldertry() {
    // mousewheel also works for trhe trackpad
    document.addEventListener("mousewheel", (e) => {
        let deltaX = e.deltaX;
        if (deltaX != 0 && Math.abs(deltaX) > SCROLL_AMOUNT) {

            if (deltaX < SCROLL_AMOUNT) {
                // ! sometimes goes to locahost (the vert start instead of of the previous tab)
                window.history.back();
                console.log("from the left")
            }

            else {
                window.history.forward();
                console.log("from the right");
            }
        }
    });
}

oldertry()