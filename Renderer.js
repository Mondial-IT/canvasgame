let mouseHoverLocation = {
    x: 0,
    y: 0
};

/**
 * Handles rendering of objects into the canvas.
 * Gets information/data about what to draw from simulator.
 */
class Renderer {

    constructor() {
        this.frameCount = 0;
        this.simulator = null;

        // Display normal or hitboxes
        this.displayHitboxes = false;

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
            _this.simulator.player.x += x - canvasWidth / 2;
            _this.simulator.player.y += y - canvasHeight / 2;

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
        mouseHoverLocation = {x: canvasWidth / 2, y: canvasHeight / 2};


        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 87) _this.displayHitboxes = true;
        });
        document.addEventListener("keyup", function (event) {
            if (event.keyCode === 87) _this.displayHitboxes = false;
        });

        // Put canvas in html
        $('#canvas-container').append(this.canvas);
    }

    incrementFrameCount() {
        document.getElementById("framecounter").innerText = String(this.frameCount);
        this.frameCount++;
    }

    /**
     * Call draw() on every canvasObject
     */
    draw(player, scenery, hitboxes) {
        //this.incrementFrameCount();
        // Wipe canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if(!this.displayHitboxes){
            // Draw normal
            for (let i = 0; i < scenery.length; i++) {
                // offset = middle of screen - player pos
                let offset = {
                    x: (canvasWidth / 2) - player.x,
                    y: (canvasHeight / 2) - player.y
                };
                switch (scenery[i].type) {
                    case "polygon":
                        Renderer.renderPolygon(this.ctx, offset, scenery[i].points);
                        break;
                    case "uninitialized":
                        throw "Error in Rendering: unitialized";
                    default:
                        throw "Error in Rendering: undefined";
                        break;
                }
            }
        } else {
            // Draw hitboxes
            for (let i = 0; i < hitboxes.length; i++) {
                this.ctx.beginPath();
                this.ctx.strokestyle = "blue";
                this.ctx.fillStyle = "blue";
                this.ctx.fillRect(
                    (canvasWidth / 2) - player.x + hitboxes[i].x,
                    (canvasHeight / 2) - player.y + hitboxes[i].y,
                    1, 1
                );
                this.ctx.stroke();
            }
        }
        player.draw(this.ctx);
    }

    /**
     * General function for rendering (drawing) lines between given points (polygon).
     * @param ctx canvas context
     * @param offset relative to player; add offset to each coordinate.
     * @param points Array of points {x:0, y:0} to be drawn.
     */
    static renderPolygon(ctx, offset, points) {
        if (points !== null && points.length > 0){
            ctx.beginPath();
            ctx.moveTo(offset.x + points[0].x, offset.y + points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(offset.x + points[i].x, offset.y + points[i].y);
            }
            ctx.stroke();
        }
    }

    /**
     * Writes frame stats onto html.
     * @param physicsTime
     * @param renderingTime
     * @param sleepTime
     * @param totalTime
     * @param physicsFrameCount
     * @param timeShortageSum
     */
    displayStats(physicsTime, renderingTime, sleepTime, totalTime, physicsFrameCount, timeShortageSum) {
        document.getElementById("frametimephysics").innerText = String(physicsTime);
        document.getElementById("frametimerendering").innerText = String(renderingTime);
        document.getElementById("frametimewaited").innerText = String(sleepTime);
        document.getElementById("frametime").innerText = String(totalTime);
        document.getElementById("framecounter").innerText = String(physicsFrameCount);
        document.getElementById("timeshortage").innerText = String(timeShortageSum);
    }
}