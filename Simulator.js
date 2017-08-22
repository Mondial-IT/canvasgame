function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loops within itself to create frames.
 * Each frame has physics and rendering.
 * Keeps track of performance.
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
        this.timeShortageSum = 0; // The sum of ms that was needed for physics and drawing but was not available. (frame skipping)
    }

    async simulationLoop() {
        while (true) {
            this.doPhysics();
            // Number of ms physics took
            let physicsTime = new Date().getTime() - this.prevFrameDateTime;

            // If physics didnt take up all the time
            if (new Date().getTime() - this.prevFrameDateTime <= targetFrameTime) {
                this.renderer.draw(this.player, this.scenery, this.hitboxes);
            } else {
                console.log("No time to draw ", new Date().getTime() - this.prevFrameDateTime, targetFrameTime);
            }

            // Number of ms rendering took
            let renderingTime = new Date().getTime() - this.prevFrameDateTime - physicsTime;

            // Number of ms physics and rendering took
            let totalUsedTime = new Date().getTime() - this.prevFrameDateTime;

            // If there is time left over: wait
            let sleepTime = 0;
            if (totalUsedTime < targetFrameTime) {
                sleepTime = targetFrameTime - totalUsedTime;
                await sleep(sleepTime);
            } else {
                // Register the time shortage
                this.timeShortageSum += totalUsedTime - targetFrameTime;
                console.log("Frame too longer than targetFrameTime");
            }

            // Update frametime counters
            this.renderer.displayStats(
                physicsTime,
                renderingTime,
                sleepTime,
                new Date().getTime() - this.prevFrameDateTime,
                this.physicsFrameCount,
                this.timeShortageSum
            );

            this.prevFrameDateTime = new Date().getTime();
            this.physicsFrameCount++;
        }
    }

    /**
     * Performs all physics of one simulation cycle.
     */
    doPhysics() {
        this.player.doPhysics();
        this.player.checkCollision(this.hitboxes);
    }

}
