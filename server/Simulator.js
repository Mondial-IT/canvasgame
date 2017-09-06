function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Loops within itself to create frames.
 * Each frame has physics and rendering.
 * Keeps track of performance.
 */
class Simulator {
    constructor(level) {
        this.physicsFrameCount = 0;
        this.newLevel(level);
        this.prevFrameDateTime = new Date().getTime();
        this.border = {left:-1000, right:1000, top: -1000, bottom: 1000};
    }

    newLevel(level){
        this.player = level.player;
        this.scenery = level.scenery;
        this.hitboxes = level.hitboxes;
    }

    async simulationLoop() {
        while (true) {
            this.doPhysics(this.player);

            localStorage.setItem("frame",
                JSON.stringify({
                    frameNr: this.physicsFrameCount,
                    player: this.player,
                    scenery: this.scenery,
                    hitboxes: this.hitboxes,
                    border: this.border
                })
            );

            // Number of ms physics and rendering took
            let totalUsedTime = new Date().getTime() - this.prevFrameDateTime;

            // If there is time left over: wait
            let sleepTime = 0;
            if (totalUsedTime < targetFrameTime) {
                sleepTime = targetFrameTime - totalUsedTime;
                await sleep(sleepTime);
            } else {
                console.error("Frame too longer than targetFrameTime");
            }

            this.prevFrameDateTime = new Date().getTime();
            this.physicsFrameCount++;
        }
    }

    /**
     * Performs all physics of one simulation cycle.
     */
    doPhysics(player) {

        // Shrinking
        if(localStorage.getItem("shrink") === "true"){
            player.r = player.rShrunk;
        } else {
            player.r = player.rDefault;
        }

        // Acceleration
        try {
            let acceleration = JSON.parse(localStorage.getItem("acceleration"));
            acceleration.x = Math.max(-1, Math.min(1, acceleration.x)); // Limit 0:1
            acceleration.y = Math.max(-1, Math.min(1, acceleration.y)); // Limit 0:1
            player.velocity.x += acceleration.x/7;
            player.velocity.y += acceleration.y/7;

            player.velocity.x *= player.drag;
            player.velocity.y *= player.drag;
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

        if(localStorage.getItem("resetplayer") === "true"){
            this.player.x = 0;
            this.player.y = 0;
            localStorage.setItem("resetplayer","false");
        }

        // Limit location within border.
        if(player.x < this.border.left){
            player.x = this.border.left;
            player.velocity.x = 0;
        }
        if(player.x > this.border.right){
            player.x = this.border.right;
            player.velocity.x = 0;
        }
        if(player.y < this.border.top){
            player.y = this.border.top;
            player.velocity.y = 0;
        }
        if(player.y > this.border.bottom){
            player.y = this.border.bottom;
            player.velocity.y = 0;
        }


        this.player.hasCollision = Simulator.checkCollision(player.x, player.y, player.r, this.hitboxes);
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
                return true;
            }
        }
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
