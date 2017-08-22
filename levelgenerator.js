idCounter = 0;

/**
 * Baseclass for all static objects on the canvas.
 * Gives every object an id.
 */
class CanvasObject {
    constructor() {
        this.id = idCounter;
        idCounter++;
        this.type = "uninitialized";
    }
}

class Polygon extends CanvasObject {

    constructor(points) {
        super();
        this.type = "polygon";
        this.points = points;
    }

}

/**
 * The player.
 * Can move around and do stuff.
 * Is the core place where physics originates from.
 */
class Circle extends CanvasObject {
    constructor() {
        super();
        this.type = "player";
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

/**
 * Returns an array with coordinates {x,y} of the outside edges of the polygon.
 * @param points Array of connected points {x:0, y:0} forming the polygon of which the hitbox mesh is returned.
 * @param sampleSpacing The number of coordinated between each hitbox point
 * @returns {Array} of points forming the hitbox mesh
 */
function samplePolygon(points, sampleSpacing) {
    if(points === null || points.length === 0) return [];

    let mesh = [];

    if (points.length === 1) {
        mesh.push({
            x: points[0].x,
            y: points[0].y
        });
    } else {
        // For each point draw dotted line from previous point to this point
        for (let i = 1; i < points.length; i++) {
            // Delta between this point and previous point
            let dx = points[i].x - points[i-1].x;
            let dy = points[i].y - points[i-1].y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Sample the line between this point and previous point
            for (let j = 0; j < dist / sampleSpacing; j++){
                // Add j times the sampleRate adjusted to the proportion each dimension takes of the total euclidean distance.
                mesh.push({
                    x: points[i-1].x + j * sampleSpacing * (dx / dist),
                    y: points[i-1].y + j * sampleSpacing * (dy / dist)
                })
            }
        }
    }
    return mesh;
}

/**
 * Instantiates all classes in this file.
 * Returns an object with:
 * scenery: an array of scenery objects,
 * player: the player
 * hitboxes: an array of scenery hitbox coordinates
 */
function generateLevel() {
    let scenery = [
        new Polygon([
            {x: 0, y: 0},
            {x: 200, y: 100},
        ]),
        new Polygon([
            {x: 100, y: 100},
            {x: 200, y: 100},
            {x: 200, y: 200},
            {x: 100, y: 200},
            {x: 100, y: 100}
        ])
    ];

    let hitboxes = [];
    for (let i = 0; i < scenery.length; i++) {
        hitboxes = hitboxes.concat(samplePolygon(scenery[i].points, 20));
    }

    return {
        scenery: scenery,
        player: new Circle(),
        hitboxes: hitboxes
    };
}

