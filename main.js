/**
 * Read dropdown option and then removes the html.
 * Starts client or server.
 */
function init(){
    let select = document.getElementById("selecttabtype");
    switch(select.options[select.selectedIndex].value){
        case "client":
            document.getElementById("tabtype").innerHTML = '<div>Client</div>';
            startClient();
            break;
        case "server":
            document.getElementById("tabtype").innerHTML = '<div>Server</div>';
            startServer();
            break;
        default:
            // do nothing
            break;
    }
}


document.getElementById("selecttabtype").addEventListener("change", function(){
    init();
});
