function startServer() {
    targetFrameRate = 60;
    targetFrameTime = 1000 / targetFrameRate;

    let level = generateLevel();

    // Global so button events can get in
    simulator = new Simulator(level.player, level.scenery, level.hitboxes);


    let htmlstr = "";
    htmlstr += '<div>';
    htmlstr += '<button onclick="resetGame()">Reset game</button>';
    htmlstr += '</div>';

    document.getElementById("tabtypespace").innerHTML = htmlstr;

    simulator.simulationLoop();
}

function resetGame(){
    console.log('hoi');
    simulator.resetGame();
}
