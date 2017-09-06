
function htmlClient(){
    document.getElementById("content").innerHTML = `
        <div id="canvas-container" style="cursor: default"></div>
        <table style="width: 100%">
            <tr>
                <td style="width: 30%">
                    <h2>A fun canvas game</h2>
                    <p>Controls</p>
                    <table>
                        <tr>
                            <td style="font-weight: bold">Mouse</td>
                            <td style="width: 20px"></td>
                            <td>Accelerate in a direction</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold">Left click</td>
                            <td style="width: 20px"></td>
                            <td>Teleport</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold">Q</td>
                            <td style="width: 20px"></td>
                            <td>Shrink</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold">W</td>
                            <td style="width: 20px"></td>
                            <td>Display hitbox mesh</td>
                        </tr>
                    </table>
                </td>
                <td style="width: 40%">
                </td>
                <td style="width: 40%">
                    <table>
                        <tr>
                            <td>
                                <table>
                                    <tr>
                                        <td>Render frame:</td>
                                        <td>
                                            <div id="renderframe">0</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Physics frame:</td>
                                        <td>
                                            <div id="physicsframe">0</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="vertical-align: top">
                                            Frame time (ms):
                                        </td>
                                        <td>
                                            <table style="border: 1px solid black">
                                                <tr>
                                                    <td>Physics</td>
                                                    <td>
                                                        <div id="frametimephysics">0</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Rendering</td>
                                                    <td>
                                                        <div id="frametimerendering">0</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Waiting</td>
                                                    <td>
                                                        <div id="frametimewaited">0</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Total</td>
                                                    <td style="border-top: 1px solid black">
                                                        <div id="frametime">0</div>
                                                    </td>
                                                </tr>
                                                <tr style="color: gray">
                                                    <td>Target</td>
                                                    <td>
                                                        <div id="targetframetime">0</div>
                                                    </td>
                                                </tr>
                                                <tr style="color: gray">
                                                    <td title="Total ms that was needed but not available for physics and rendering.">Sum time shortage</td>
                                                    <td>
                                                        <div id="timeshortage">0</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Player coordinates:</td>
                                        <td><div id="player"></div></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;
}

function htmlServer(){
    document.getElementById("content").innerHTML = `
        <div>Server running!</div>
        <button onclick="resetGame()">Reset game</button>
        <select id="levelselect">
            <option value="level1">Level 1</option>
            <option value="level2">Level 2</option>
        </select>
    `;
}

function initClient(){
    document.title = "Client";
    htmlClient();
    startClient();
}

function initServer(){
    document.title = "Server";
    htmlServer();


    document.getElementById("levelselect").addEventListener("change", function(){
        console.log('change level');
        let select = document.getElementById("levelselect");
        switch(select.options[select.selectedIndex].value){
            case "level1":
                simulator.newLevel(level1());
                break;
            case "level2":
                simulator.newLevel(level2());
                break;
            default:
                console.error("levelselect dropdown not recognized");
                break;
        }
    });

    startServer(level1());
}
