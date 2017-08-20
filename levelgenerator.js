/**
 * Baseclass for all static objects on the canvas.
 */
class CanvasObject {
    // Draw on ctx (canvas context) by adding offset to your point: 0,0 = offset.x + 0, offset.y + 0
    draw(ctx, offset) {
    }

    keyPress(key) {
    }

    isAtPos() {
        return false
    }

    doPhysics() {
    }

    /**
     * Returns an array with coordinates {x,y} of the outside edges of the object.
     */
    getMesh() {
        return [];
    }
}

class Line extends CanvasObject {

    draw(ctx, offset) {
        ctx.beginPath();
        ctx.moveTo(offset.x + 0, offset.y + 0);
        ctx.lineTo(offset.x + 200, offset.y + 100);
        ctx.stroke();
    }
}

class Box extends CanvasObject {
    draw(ctx, offset) {
        ctx.beginPath();
        ctx.moveTo(offset.x + 100, offset.y + 100);
        ctx.lineTo(offset.x + 200, offset.y + 100);
        ctx.lineTo(offset.x + 200, offset.y + 200);
        ctx.lineTo(offset.x + 100, offset.y + 200);
        ctx.lineTo(offset.x + 100, offset.y + 100);
        ctx.stroke();
    }
}

class Button extends CanvasObject {

    constructor() {
        super();
        this.x = 300;
        this.y = 100;
        this.width = 400;
        this.height = 100;
    }

    draw(ctx, offset) {
        ctx.beginPath();
        ctx.rect(offset.x + this.x, offset.y + this.y, this.width, this.height);
        ctx.fillStyle = "green";
        ctx.fill();
    }

    isAtPos(x, y) {
        return this.x <= x &&
            this.x + this.width >= x &&
            this.y <= y &&
            this.y + this.height >= y;
    }

    /**
     * Returns an array with coordinates {x,y} of the outside edges of the object.
     * The four loops connect to form a circular drawing motion so all four corners always have a dot.
     */
    getMesh() {
        let mesh = [];

        // Upper horizontal
        for (let i = 0; i < this.width; i += 20) {
            mesh.push({
                x: this.x + i,
                y: this.y
            });
        }
        // Right vertical
        for (let j = 0; j < this.height; j += 20) {
            mesh.push({
                x: this.x + this.width,
                y: this.y + j
            });
        }

        // Lower horizontal
        for (let i = this.width; i > 0; i -= 20) {
            mesh.push({
                x: this.x + i,
                y: this.y + this.height
            });
        }

        // Left vertical
        for (let j = this.height; j > 0; j -= 20) {
            mesh.push({
                x: this.x,
                y: this.y + j
            });
        }
        return mesh;
    }
}


class Circle extends CanvasObject {
    constructor() {
        super();
        this.x = 300;
        this.y = 300;
        this.r = 50;
        this.rDefault = 50;
        this.velocity = {
            x: 0,
            y: 0,
            xmax: 3,
            ymax: 3
        };
        this.acceleration = 1;
        this.hasCollision = false;

        let _this = this; // Bring this into document.addEventListener() scope
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 81) _this.r = 10;
        });
        document.addEventListener("keyup", function (event) {
            if (event.keyCode === 81) _this.r = _this.rDefault;
        });
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.arc(750, 250, this.r, 0, 2 * Math.PI);
        if (this.hasCollision) {
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
    }

    doPhysics() {
        this.accelerateInDirection(mouseHoverLocation.x, mouseHoverLocation.y);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        document.getElementById("player").innerHTML = Math.round(this.x) + ',' + Math.round(this.y);
    }

    // Give circle velocity in the direction of the cursor
    accelerateInDirection(x, y) {
        // cursor - middle of screen
        let dx = x - (canvasWidth / 2);
        let dy = y - (canvasHeight / 2);

        // Slower/normalize acceleration
        this.velocity.x += dx / 5000;
        this.velocity.y += dy / 5000;
        this.limitVelocity();
    }

    limitVelocity() {
        this.velocity.x = Math.max(-this.velocity.xmax, Math.min(this.velocity.xmax, this.velocity.x));
        this.velocity.y = Math.max(-this.velocity.ymax, Math.min(this.velocity.ymax, this.velocity.y));
    }

    /**
     * Checks every point in given meshes array for a collision.
     * The euclidean distance between every mesh point and the center of the circle
     * is compared to the radius of the circle.
     * @param meshes
     * @returns {boolean}
     */
    checkCollision(meshes) {
        for (let i = 0; i < meshes.length; i++) {
            if (
                Math.sqrt(
                    (meshes[i].x - this.x) * (meshes[i].x - this.x) +
                    (meshes[i].y - this.y) * (meshes[i].y - this.y)
                ) <= this.r
            ) {
                this.hasCollision = true;
                return true;
            }
        }
        this.hasCollision = false;
        return false;
    }

}

// Put output in an object so that e.g. scenery does not exist globally (prevent accidents)
levelgeneratorOutput = {};
levelgeneratorOutput.scenery = [new Line(), new Box(), new Button()];
levelgeneratorOutput.player = new Circle();

levelgeneratorOutput.hitboxes = [];
for (let i = 0; i < levelgeneratorOutput.scenery.length; i++) {
    levelgeneratorOutput.hitboxes = levelgeneratorOutput.hitboxes.concat(levelgeneratorOutput.scenery[i].getMesh());
}
