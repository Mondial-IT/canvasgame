function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Is the main object on screen: it handles the canvas object and handles click events on the canvas
 * Registers canvasObjects which are all drawn with drawAll()
 */
class Simulator {
    constructor(renderer, player, scenery, hitboxes) {
        this.physicsFrameCount = 0;
        this.renderer = renderer;
        this.renderer.simulator = this; // Give renderer this (Simulator instance)
        this.player = player;
        this.scenery = scenery;
        this.hitboxes = hitboxes;
        this.prevFrameDateTime = new Date().getTime();
        this.startTime = new Date().getTime();
    }

    async simulationLoop() {
        this.doPhysics();
        let physicsTime = new Date().getTime() - this.prevFrameDateTime;

        // If physics didnt take up all the time
        if(new Date().getTime() - this.prevFrameDateTime <= targetFrameTime){
            this.requestDraw();
        } else {
            console.log("No time to draw ", new Date().getTime() - this.prevFrameDateTime, targetFrameTime);
        }
        let renderingTime = new Date().getTime() - this.prevFrameDateTime - physicsTime;
        let totalUsedTime = new Date().getTime() - this.prevFrameDateTime;

        // If there is time left over: wait
        let sleepTime = 0;
        if(totalUsedTime < targetFrameTime){
            sleepTime = targetFrameTime - totalUsedTime;
            await sleep(sleepTime);
        } else {
            console.log("No time to wait");
            // Error: frameTime > targetFrameTime
        }

        let totalTime = new Date().getTime() - this.prevFrameDateTime;
        document.getElementById("framecounter").innerText = String(this.physicsFrameCount);
        document.getElementById("frametime").innerText = String(totalTime);
        document.getElementById("frametimephysics").innerText = String(physicsTime);
        document.getElementById("frametimerendering").innerText = String(renderingTime);
        document.getElementById("frametimewaited").innerText = String(sleepTime);
        this.prevFrameDateTime = new Date().getTime();
        this.physicsFrameCount++;
        this.simulationLoop();
    }

    requestDraw(){
        if (document.getElementById("displayType").checked) {
            this.renderer.drawHitboxes(this.player, this.hitboxes);
        } else {
            this.renderer.draw(this.player, this.scenery);
        }
    }

    doPhysics(){
        this.player.doPhysics();
        this.player.checkCollision(this.hitboxes);
    }

}
