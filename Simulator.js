function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Is the main object on screen: it handles the canvas object and handles click events on the canvas
 * Registers canvasObjects which are all drawn with drawAll()
 */
class Simulator {

    /**
     * Initializes:
     *        Canvas and canvas context
     *        canvasObjects array
     *        click eventListener and its callback
     */
    constructor(renderer, player, scenery, hitboxes) {
        this.frameCount = 0;
        this.renderer = renderer;
        this.renderer.simulator = this; // Give renderer this (Simulator instance)
        this.player = player;
        this.scenery = scenery;
        this.hitboxes = hitboxes;
    }

    async simulationLoop() {
        this.frameCount++;

        this.doPhysicsAll();

        this.player.checkCollision(this.hitboxes);

        this.renderer.draw();

        await sleep(1000 / 60);
        this.simulationLoop();
    }

    doPhysicsAll() {
        this.player.doPhysics();
        for (let i = 0; i < this.scenery.length; i++) {
            this.scenery[i].doPhysics({
                x: this.player.x,
                y: this.player.y
            });
        }
    }

}
