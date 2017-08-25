function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loops within itself to create frames.
 * Each frame has physics and rendering.
 * Keeps track of performance.
 */
class Simulator {
    constructor(client, player, scenery, hitboxes) {
        this.physicsFrameCount = 0;
        this.player = player;
        this.scenery = scenery;
        this.hitboxes = hitboxes;
        this.prevFrameDateTime = new Date().getTime();
        this.startTime = new Date().getTime();
        this.timeShortageSum = 0; // The sum of ms that was needed for physics and drawing but was not available. (frame skipping)
        this.clients = [client];
    }

    async simulationLoop() {
        while (true) {
            this.doPhysics(this.player);
            // Number of ms physics took
            let physicsTime = new Date().getTime() - this.prevFrameDateTime;

            // If physics didnt take up all the time
            if (physicsTime <= targetFrameTime) {
                // Send frame to clients
                for(let i=0; i<this.clients.length; i++){
                    this.clients[i].draw(this.player, this.scenery, this.hitboxes);
                }
            } else {
                console.log("No time to draw ", physicsTime, targetFrameTime);
            }

            // Number of ms physics and rendering took
            let totalUsedTime = new Date().getTime() - this.prevFrameDateTime;

            // Number of ms rendering took
            let renderingTime = totalUsedTime - physicsTime;

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
            for(let i=0; i<this.clients; i++) {
                this.clients[i].displayStats(
                    physicsTime,
                    renderingTime,
                    sleepTime,
                    new Date().getTime() - this.prevFrameDateTime,
                    this.physicsFrameCount,
                    this.timeShortageSum
                );
            }

            this.prevFrameDateTime = new Date().getTime();
            this.physicsFrameCount++;
        }
    }

    /**
     * Performs all physics of one simulation cycle.
     */
    doPhysics() {

        // cursor - middle of screen
        // let dx = x - (canvasWidth / 2);
        // let dy = y - (canvasHeight / 2);

        // Slower/normalize acceleration
        // this.player.velocity.x += dx / 5000;
        // this.player.velocity.y += dy / 5000;


        // Displacement
        this.player.x += this.player.velocity.x;
        this.player.y += this.player.velocity.y;

        // Acceleration
        this.player.velocity.x += this.player.acceleration.x;
        this.player.velocity.y += this.player.acceleration.y;

        Simulator.checkCollision(this.player.x, this.player.y, this.player.r, this.hitboxes);

        // Limit velocity
        this.player.velocity.x = Math.max(-this.player.velocity.xmax, Math.min(this.player.velocity.xmax, this.player.velocity.x));
        this.player.velocity.y = Math.max(-this.player.velocity.ymax, Math.min(this.player.velocity.ymax, this.player.velocity.y));


    }

    /**
     * Checks every point in given meshes array for a collision.
     * The euclidean distance between every mesh point and the center of the circle
     * is compared to the radius of the circle.
     * @param x
     * @param y
     * @param r
     * @param hitboxes
     * @returns {boolean}
     */
    static checkCollision(x, y, r, hitboxes) {
        for (let i = 0; i < hitboxes.length; i++) {
            if (
                Math.sqrt(
                    (hitboxes[i].x - x) * (hitboxes[i].x - x) +
                    (hitboxes[i].y - y) * (hitboxes[i].y - y)
                ) <= r
            ) {
                this.hasCollision = true;
                return true;
            }
        }
        this.hasCollision = false;
        return false;
    }


    registerClient(client){
        this.clients.push(client);
    }

    jump(x,y){
        // todo check validity of x,y
        // Add displacement vector to player location.
        // Displacement vector is distance between click location and middle of the screen.
        this.player.x += x - canvasWidth / 2;
        this.player.y += y - canvasHeight / 2;

        // Reset player velocity
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
    }

    setMousePosition(x,y){

    }

}
