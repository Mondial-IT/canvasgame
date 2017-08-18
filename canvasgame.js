function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let canvasWidth = 1500;
let canvasHeight = 500;

let mouseHoverLocation = {
    x: canvasWidth / 2,
    y: canvasHeight / 2
};


/**
 * Is the main object on screen: it handles the canvas object and handles click events on the canvas
 * Registers canvasObjects which are all drawn with drawAll()
 */
class Renderer {

    /**
     * Initializes:
     *        Canvas and canvas context
     *        canvasObjects array
     *        click eventListener and its callback
     */
    constructor() {
        this.frameCount = 0;

        this.player = null;


        // Arrays of objects
        this.canvasObjects = [];
        this.hitboxMeshes = [];

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.id = "canvas";
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

            // Get object at click location
            _this.clickAll(x, y);
            _this.drawAll();
        });

        // Hover event
        this.canvas.addEventListener("mousemove", function (event) {
            mouseHoverLocation = {
                x: event.pageX - _this.canvas.offsetLeft,
                y: event.pageY - _this.canvas.offsetTop
            }
        });

        // Arrowkeys event
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === "37") _this.keyPressAll('left');
            if (event.keyCode === "38") _this.keyPressAll('up');
            if (event.keyCode === "39") _this.keyPressAll('right');
            if (event.keyCode === "40") _this.keyPressAll('down');
            _this.drawAll();
        });

        // Voeg canvas aan html toe
        $('#canvas-container').append(this.canvas);

    }

    /**
     * Call draw() on every canvasObject
     */
    drawAll() {
        // Wipe canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Redraw canvas
        for (let i = 0; i < this.canvasObjects.length; i++) {
            this.canvasObjects[i].draw(this.ctx, {
                x: (canvasWidth / 2) - this.player.x, // offset = middle of screen - player pos
                y: (canvasHeight / 2) - this.player.y
            });
        }
        this.player.draw(this.ctx);
    }

    drawHitboxesAll() {
        // Wipe canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Redraw canvas
        for (let i = 0; i < this.hitboxMeshes.length; i++) {
            this.ctx.beginPath();
            this.ctx.strokestyle = "blue";
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(
                (canvasWidth / 2) - this.player.x + this.hitboxMeshes[i].x,
                (canvasHeight / 2) - this.player.y + this.hitboxMeshes[i].y,
                1, 1
            );
            this.ctx.stroke();
        }
        this.player.draw(this.ctx);
    }

    /**
     * For every canvasObjects: check if object is at location; if yes then click
     */
    clickAll(x, y) {
        for (let i = 0; i < this.canvasObjects.length; i++) {
            if (this.canvasObjects[i].isAtPos(x, y)) {
                this.canvasObjects[i].click(x, y);
            }
        }
    }

    /**
     * For every canvasObjects execute keyPress()
     */
    keyPressAll(key) {
        for (let i = 0; i < this.canvasObjects.length; i++) {
            this.canvasObjects[i].keyPress(key);
        }
    }

    async simulationLoop() {
        document.getElementById("framecounter").innerText = this.frameCount;
        this.frameCount++;

        this.doPhysicsAll();

        player.checkCollision(this.hitboxMeshes);

        if (document.getElementById("displayType").checked) {
            this.drawHitboxesAll();
        } else {
            this.drawAll();
        }

        await sleep(1000 / 60);
        this.simulationLoop();
    }

    doPhysicsAll() {
        this.player.doPhysics();
        for (let i = 0; i < this.canvasObjects.length; i++) {
            this.canvasObjects[i].doPhysics({
                x: this.player.x,
                y: this.player.y
            });
        }
    }

}


function main() {

    window.renderer = new Renderer();

    renderer.canvasObjects = levelGeneratorOutput;

    renderer.player = player;

    let meshes = [];
    for (let i = 0; i < levelGeneratorOutput.length; i++) {
        meshes = meshes.concat(levelGeneratorOutput[i].getMesh());
    }
    renderer.hitboxMeshes = meshes;

    renderer.simulationLoop();
}

main();


//var worker;
//function startWorker(){
//	if(typeof(Worker) !== "undefined") {
//		if(typeof(worker) == "undefined") {
//			worker = new Worker("worker.js");
//		}
//	} else {
//		console.log("Sorry! No Web Worker support.");
//	}
//}
//startWorker();


//var worker;
//function startWorker(){
//	if(typeof(Worker) !== "undefined") {
//		if(typeof(worker) == "undefined") {
//			worker = new Worker("worker.js");
//		}
//	} else {
//		console.log("Sorry! No Web Worker support.");
//	}
//}
//startWorker();
