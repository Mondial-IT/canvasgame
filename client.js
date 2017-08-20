function main() {
    let level = generateLevel();
    let renderer = new Renderer();
    let simulator = new Simulator(renderer, level.player, level.scenery, level.hitboxes);

    simulator.simulationLoop();
}


canvasWidth = 1500;
canvasHeight = 500;
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
