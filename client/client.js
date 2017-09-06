/**
 * Add event listeners to keys and mouse movements.
 * @param canvas
 */
function addListeners(canvas) {
    // Prevent scrolling with space
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            e.preventDefault();
        }
    });

    function convertMouseCoordinates(pos) {
        // Coordinate relative to center 0:1500,0:500 -> -750:750,-250:250
        return {
            x: (pos.x - (canvasWidth / 2)),
            y: (pos.y - (canvasHeight / 2))
        };
    }

    function normalize(pos) {
        return {
            x: pos.x / (canvasWidth / 2),
            y: pos.y / (canvasHeight / 2)
        }
    }

    // Click event
    canvas.addEventListener("click", function (event) {
        // Get click location
        let x = event.pageX - canvas.offsetLeft;
        let y = event.pageY - canvas.offsetTop;
        let vector = convertMouseCoordinates({x: x, y: y});
        console.log('jump ' + vector);
        localStorage.setItem("jump", JSON.stringify(vector));
    });

    // Hover event
    canvas.addEventListener("mousemove", function (event) {
        // Mouse x,y coordinates
        let mouse = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop
        };

        // Coordinate relative to center 0:1500,0:500 -> -750:750,-250:250, then normalized -1:1,-1:1
        let acceleration = normalize(convertMouseCoordinates(mouse));

        // Draw line to cursor
        mouseHoverLocation = mouse;

        // Send acceleration to server
        localStorage.setItem(
            "acceleration",
            '{"x": ' + acceleration.x + ', "y": ' + acceleration.y + '}'
        );
    });

    // Hover event
    canvas.addEventListener("mouseleave", function (event) {
        mouseHoverLocation = {x:canvasWidth/2,y:canvasHeight/2};
        localStorage.setItem("acceleration",'{"x":0, "y":0}');
    });

    // Default
    localStorage.setItem("acceleration", '{"x":0,"y":0}');


    // Reset
    document.addEventListener("keydown", function (event) {
        switch(event.keyCode){
            case 90: // z reset
                console.log("reset player");
                localStorage.setItem("resetplayer","true");
                break;
            case 81: // q shrink
                console.log("shrink");
                localStorage.setItem("shrink", "true");
                break;
        }
    });

    document.addEventListener("keyup", function (event) {
        switch(event.keyCode){
            case 81: // q shrink
                localStorage.setItem("shrink", "false");
                break;
        }
    });
}

/**
 * Initializes global variables, renderer, adds mouse+keyboard listeners and starts rendering loop.
 */
function startClient() {
    canvasWidth = 1500;
    canvasHeight = 500;
    document.getElementById("targetframetime").innerText = "?";
    let renderer = new Renderer();
    addListeners(renderer.canvas);
    renderer.renderingLoop();
}
