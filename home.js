var isDragging = false;
var startX = 0;
var startY = 0;

function detectTrackPad(e) {
    if (isDragging) {
        // Calculate the horizontal movement
        var deltaX = e.touches[0].clientX - startX;

        // Assuming a threshold of 50 pixels for horizontal movement
        if (Math.abs(deltaX) > 50) {
            console.log("forwards");
            // Perform your desired action here, e.g., navigate tabs
            window.history.forward();
        }

        if (Math.abs(deltaX) < 50) {
            console.log("backwards");
            window.history.back();
        }

        // Reset the values after processing the drag
        isDragging = false;
        startX = 0;
        startY = 0;
    }
}

function handleTouchStart(e) {
    if (e.touches.length === 2) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
}

function handleTouchEnd() {
    if (isDragging) {
        // Reset the values if the drag is interrupted or completed
        isDragging = false;
        startX = 0;
        startY = 0;
    }
}

document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", detectTrackPad);
document.addEventListener("touchend", handleTouchEnd);
