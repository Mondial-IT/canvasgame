function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loops within itself to create frames.
 * Each frame has physics and rendering.
 * Keeps track of performance.
 */
class Simulator {
    constructor(player, scenery, hitboxes) {
        this.physicsFrameCount = 0;
        this.player = player;
        this.scenery = scenery;
        this.hitboxes = hitboxes;
        this.prevFrameDateTime = new Date().getTime();
        this.startTime = new Date().getTime();
        this.timeShortageSum = 0; // The sum of ms that was needed for physics and drawing but was not available. (frame skipping)
    }

    async simulationLoop() {
        while (true) {
            this.doPhysics(this.player);
            // Number of ms physics took
            let physicsTime = new Date().getTime() - this.prevFrameDateTime;

            localStorage.setItem("frame",
                JSON.stringify({
                    frameNr: this.physicsFrameCount,
                    player: this.player,
                    scenery: this.scenery,
                    hitboxes: this.hitboxes
                })
            );

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
                localStorage.setItem(
                    "stats",
                    JSON.stringify({
                        physicsTime: physicsTime,
                        renderingTime: renderingTime,
                        sleepTime: sleepTime,
                        totalTime: new Date().getTime() - this.prevFrameDateTime,
                        physicsFrameCount: this.physicsFrameCount,
                        timeShortageSum: this.timeShortageSum
                    })
                );
            }

            this.prevFrameDateTime = new Date().getTime();
            this.physicsFrameCount++;
        }
    }

    /**
     * Performs all physics of one simulation cycle.
     */
    doPhysics(player) {

        // cursor - middle of screen
        // let dx = x - (canvasWidth / 2);
        // let dy = y - (canvasHeight / 2);

        // Slower/normalize acceleration
        // this.player.velocity.x += dx / 5000;
        // this.player.velocity.y += dy / 5000;

        // Acceleration
        try {
            let acceleration = JSON.parse(localStorage.getItem("acceleration"));
            acceleration.x = Math.max(-1, Math.min(1, acceleration.x)); // Limit 0:1
            acceleration.y = Math.max(-1, Math.min(1, acceleration.y)); // Limit 0:1
            player.velocity.x += acceleration.x/7;
            player.velocity.y += acceleration.y/7;
        } catch (e){
            // Cannot be parsed: reset to continue
            localStorage.setItem("acceleration", "");
            console.error("Acceleration from localStorage cannot be parsed");
        }

        // Limit velocity
        player.velocity.x = Math.max(-player.velocityMax.x, Math.min(player.velocityMax.x, player.velocity.x));
        player.velocity.y = Math.max(-player.velocityMax.y, Math.min(player.velocityMax.y, player.velocity.y));

        // Displacement
        player.x += player.velocity.x;
        player.y += player.velocity.y;

        // Jump
        let jump = localStorage.getItem("jump");
        if(jump !== null){
            try {
                jump = JSON.parse(jump);
                // todo jump validity check
                player.x += jump.x;
                player.y += jump.y;
                player.velocity = {x:0,y:0};
            } catch (e) {
                console.error("Reading jump from local storage invalid parsing", e);
            }
            localStorage.removeItem("jump");
        }


        Simulator.checkCollision(player.x, player.y, player.r, this.hitboxes);
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

    resetGame(){
        this.player.x = 0;
        this.player.y = 0;
    }

}
