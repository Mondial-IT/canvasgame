function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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


        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 87) _this.displayHitboxes = true;
        });
        document.addEventListener("keyup", function (event) {
            if (event.keyCode === 87) _this.displayHitboxes = false;
        });

        // Put canvas in html
        $('#canvas-container').append(this.canvas);
    }

    /**
     * Increment render frame counter.
     * Write render and physics frame on screen.
     * @param physicsFrameNr physics frame number
     */
    incrementFrameCount(physicsFrameNr) {
        document.getElementById("renderframe").innerText = String(this.frameCount);
        document.getElementById("physicsframe").innerText = String(physicsFrameNr);
        this.frameCount++;
    }


    async renderingLoop() {
        while (true) {
            let frame = JSON.parse(localStorage.getItem("frame"));
            this.incrementFrameCount(frame.frameNr);
            this.draw(frame.player, frame.scenery, frame.hitboxes, frame.border);
            await sleep(1000/60);
        }
    }

    /**
     * Call draw() on every canvasObject
     */
    draw(player, scenery, hitboxes, border) {
        //this.incrementFrameCount();
        // Wipe canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // offset = middle of screen - player pos
        let offset = {
            x: (canvasWidth / 2) - player.x,
            y: (canvasHeight / 2) - player.y
        };

        // Level
        if (!this.displayHitboxes) {
            // Draw normal
            for (let i = 0; i < scenery.length; i++) {
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

        // Border
        Renderer.renderPolygon(this.ctx, offset, [
            {x: border.left, y: border.top},
            {x: border.right, y: border.top},
            {x: border.right, y: border.bottom},
            {x: border.left, y: border.bottom},
            {x: border.left, y: border.top},
        ]);

        // Player
        Renderer.renderPlayer(this.ctx, player);

        // Stats
        Renderer.displayStats();
    }

    /**
     * General function for rendering (drawing) lines between given points (polygon).
     * @param ctx canvas context
     * @param offset relative to player; add offset to each coordinate.
     * @param points Array of points {x:0, y:0} to be drawn.
     */
    static renderPolygon(ctx, offset, points) {
        if (points !== null && points.length > 0) {
            ctx.beginPath();
            ctx.moveTo(offset.x + points[0].x, offset.y + points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(offset.x + points[i].x, offset.y + points[i].y);
            }
            ctx.stroke();
        }
    }

    static renderPlayer(ctx, player) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.arc(750, 250, player.r, 0, 2 * Math.PI);
        if (player.hasCollision) {
            ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        }
        ctx.stroke();
        ctx.fill();

        // Restore
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(255, 255, 255, 0)";

        // If mouse is on canvas (no init values)
        if (mouseHoverLocation.x !== 0 && mouseHoverLocation.y !== 0) {
            ctx.beginPath();
            ctx.moveTo(750, 250);
            ctx.lineTo(mouseHoverLocation.x, mouseHoverLocation.y);
            ctx.stroke();
        }
        document.getElementById("player").innerHTML = Math.round(player.x) + ',' + Math.round(player.y);
    }

    /**
     * Writes frame stats onto html.
     */
    static displayStats() {
        let stats = JSON.parse(localStorage.getItem("stats"));
        if (stats !== null) {
            document.getElementById("frametimephysics").innerText = String(stats.physicsTime);
            document.getElementById("frametimerendering").innerText = String(stats.renderingTime);
            document.getElementById("frametimewaited").innerText = String(stats.sleepTime);
            document.getElementById("frametime").innerText = String(stats.totalTime);
            document.getElementById("framecounter").innerText = String(stats.physicsFrameCount);
            document.getElementById("timeshortage").innerText = String(stats.timeShortageSum);
        }
    }
}