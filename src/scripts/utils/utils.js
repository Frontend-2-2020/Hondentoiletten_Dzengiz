// Exports
//////////

// Functionality to make a div draggable
export const makeItemDraggable = (item) => {

    // Initialize the item positions
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // When present, the header is where you move the DIV from:
    // otherwise, move the DIV from anywhere inside the DIV:
    if (document.getElementById(item.id + "header")) {
        document.getElementById(item.id + "header").onmousedown = dragMouseDown;
    } else {
        item.onmousedown = dragMouseDown;
    }

    // Functionality when dragging the mouse
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;

        // When the mouse button is released stop the drag
        document.onmouseup = closeDragElement;

        // Call the elementDrag function whenever the cursor moves
        document.onmousemove = elementDrag;
    }

    // Function to actually drag the element
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // Calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Set the element's new position:
        item.style.top = (item.offsetTop - pos2) + "px";
        item.style.left = (item.offsetLeft - pos1) + "px";
    }

    // Functionality to stop the drag when the mouse button is released
    function closeDragElement() {
        // Release the event handlers
        document.onmouseup = null;
        document.onmousemove = null;
    }
};