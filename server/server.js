/**
 * Initializes global variables, level, simulator, and starts simulation loop
 */
function startServer(level) {
    targetFrameRate = 60;
    targetFrameTime = 1000 / targetFrameRate;


    // Global so button events can get in
    simulator = new Simulator(level);

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
