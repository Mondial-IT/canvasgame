function startServer(renderer) {
    let level = generateLevel();
    let simulator = new Simulator(renderer, level.player, level.scenery, level.hitboxes);

    simulator.simulationLoop();
}

targetFrameRate = 60;
targetFrameTime = 1000 / targetFrameRate;
