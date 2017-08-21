function main() {
    let level = generateLevel();
    let renderer = new Renderer();
    let simulator = new Simulator(renderer, level.player, level.scenery, level.hitboxes);

    simulator.simulationLoop();
}


canvasWidth = 1500;
canvasHeight = 500;
targetFrameRate = 60;
targetFrameTime = 1000 / targetFrameRate;
document.getElementById("targetframetime").innerText = String(targetFrameTime);

// Prevent scrolling with space
window.addEventListener('keydown', function(e) {
    if(e.keyCode === 32) {
        e.preventDefault();
    }
});
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
