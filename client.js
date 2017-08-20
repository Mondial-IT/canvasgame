function main() {
    let renderer = new Renderer();
    let simulator = new Simulator(renderer, levelgeneratorOutput.player, levelgeneratorOutput.scenery, levelgeneratorOutput.hitboxes);

    simulator.simulationLoop();
}


canvasWidth = 1500;
canvasHeight = 500;
main();