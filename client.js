
canvasWidth = 1500;
canvasHeight = 500;
document.getElementById("targetframetime").innerText = String(targetFrameTime);

// Prevent scrolling with space
window.addEventListener('keydown', function(e) {
    if(e.keyCode === 32) {
        e.preventDefault();
    }
});

let renderer = new Renderer();
startServer(renderer);
