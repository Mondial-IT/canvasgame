/**
 * Initializes global variables, level, simulator, and starts simulation loop
 */
function startServer() {
    targetFrameRate = 60;
    targetFrameTime = 1000 / targetFrameRate;

    let level = generateLevel();

    // Global so button events can get in
    simulator = new Simulator(level.player, level.scenery, level.hitboxes);

    // Endless loop
    simulator.simulationLoop();
}


/**
 * Callback for server reset button.
 */
function resetGame(){
    console.log('Reset game');
    simulator.resetGame();
}
