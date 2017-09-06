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
        this.x = 0;
        this.y = 0;
        this.r = 50;
        this.rDefault = 50;
        this.rShrunk = 10;
        this.velocity = {x: 0, y: 0};
        this.velocityMax = {x:3, y:3};
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.drag = 0.98; // Permanent deceleration
        this.hasCollision = false;

        let _this = this; // Bring this into document.addEventListener() scope
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 81) _this.r = 10;
        });
        document.addEventListener("keyup", function (event) {
            if (event.keyCode === 81) _this.r = _this.rDefault;
        });
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
 * Converts from scenery to hitboxes by sampling along the lines, using samplePolygon().
 * @param scenery
 * @returns {Array}
 */
function convertHitboxes(scenery){
    let hitboxes = [];
    for (let i = 0; i < scenery.length; i++) {
        hitboxes = hitboxes.concat(samplePolygon(scenery[i].points, 20));
    }
    return hitboxes;
}

/**
 * Instantiates all classes in this file.
 * Returns an object with:
 * scenery: an array of scenery objects,
 * player: the player
 * hitboxes: an array of scenery hitbox coordinates
 */
function level1() {
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

    return {
        scenery: scenery,
        player: new Circle(),
        hitboxes: convertHitboxes(scenery)
    };
}

function level2() {
    let scenery = [
        // Left line
        new Polygon([
            {x: -50, y: 100},
            {x: -50, y: 400},
            {x: 650, y: 400},
            {x: 650, y: 100}
        ]),
        // Right line
        new Polygon([
            {x: 100, y: 100},
            {x: 100, y: 250},
            {x: 500, y: 250},
            {x: 500, y: 100}
        ])
    ];

    return {
        scenery: scenery,
        player: new Circle(),
        hitboxes: convertHitboxes(scenery)
    };
}


