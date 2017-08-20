let mouseHoverLocation = {
    x: 0,
    y: 0
};

/**
 * Handles purely rendering of objects into the canvas.
 * Gets information/data about what to draw from simulator.
 */
class Renderer {

    constructor() {
        this.frameCount = 0;
        this.simulator = null;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.id = "canvas";

        // Init with global variable
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.canvas.style.border = "1px solid black";


        // Take this scope into the addEventListener callback function scope
        let _this = this;

        // Click event
        this.canvas.addEventListener("click", function (event) {
            // Get click location
            let x = event.pageX - _this.canvas.offsetLeft;
            let y = event.pageY - _this.canvas.offsetTop;

            // Add displacement vector to player location.
            // Displacement vector is distance between click location and middle of the screen.
            _this.simulator.player.x += x - canvasWidth/2;
            _this.simulator.player.y += y - canvasHeight/2;

            // Reset player velocity
            _this.simulator.player.velocity.x = 0;
            _this.simulator.player.velocity.y = 0;
        });

        // Hover event
        this.canvas.addEventListener("mousemove", function (event) {
            mouseHoverLocation = {
                x: event.pageX - _this.canvas.offsetLeft,
                y: event.pageY - _this.canvas.offsetTop
            }
        });
        mouseHoverLocation = {x:canvasWidth/2, y:canvasHeight/2};

        // Put canvas in html
        $('#canvas-container').append(this.canvas);
    }

    /**
     * Call draw() on every canvasObject
     */
    draw() {
        // Increment frame count
        document.getElementById("framecounter").innerText = String(this.frameCount);
        this.frameCount++;

        // Wipe canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw normal or hitboxes
        if (document.getElementById("displayType").checked) {

            // Draw hitboxes
            for (let i = 0; i < this.simulator.hitboxes.length; i++) {
                this.ctx.beginPath();
                this.ctx.strokestyle = "blue";
                this.ctx.fillStyle = "blue";
                this.ctx.fillRect(
                    (canvasWidth / 2) - this.simulator.player.x + this.simulator.hitboxes[i].x,
                    (canvasHeight / 2) - this.simulator.player.y + this.simulator.hitboxes[i].y,
                    1, 1
                );
                this.ctx.stroke();
            }
            this.simulator.player.draw(this.ctx);

        } else {

            // Draw normal
            for (let i = 0; i < this.simulator.scenery.length; i++) {
                this.simulator.scenery[i].draw(this.ctx, {
                    x: (canvasWidth / 2) - this.simulator.player.x, // offset = middle of screen - player pos
                    y: (canvasHeight / 2) - this.simulator.player.y
                });
            }
            this.simulator.player.draw(this.ctx);
        }
    }
}