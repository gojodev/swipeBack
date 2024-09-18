var bool = false;
let input = document.getElementById('animations');
if (input != null) {
    input.addEventListener('click', () => {
        bool = !bool;

        // so when the user clicks on the icon the input will reflect its value properly
        input.checked = bool;
    });
}

export { bool };

/**
 * you need to make the animations move by % and not by px (relative moving)
 * you need to make the context menu remeber the option the user chose for when it is opened again
 */