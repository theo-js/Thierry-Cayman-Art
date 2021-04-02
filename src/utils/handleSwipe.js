// Decide whether to check or uncheck depending on swipe direction
export const handleUnidirectionalSwipe = ({ currentTouch, lastTouch, swipeLeft, swipeRight, after }) => {
    if (lastTouch) {
        if (currentTouch < lastTouch) {
            // Swipe to the left
            swipeLeft();
        } else if (currentTouch > lastTouch) {
            // Swipe to the right
            swipeRight();
        }
    }
    after();
};