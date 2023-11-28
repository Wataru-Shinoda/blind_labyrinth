var lbr;
var ply;

document.addEventListener("DOMContentLoaded", (event) => {
    initDisplay();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "w"  || e.key === "s" || e.key === "a" || e.key === "d" ) {
        const toMoveMass = lbr.getPlayerDestination(e.key);
        if (toMoveMass !== labyrinth.WALL) {
            lbr.movePlayerPosition(e.key);
            lbr.updatePlayerMaze();
            document.getElementById("maze").innerHTML = lbr.toDisplay();
            if (toMoveMass === labyrinth.GOAL) {
                alert("ゲームクリア!");
                initDisplay();
            }
        }
    }
});

function initDisplay() {
    lbr = new labyrinth();
    ply = new player();
    lbr.updatePlayerMaze();
    document.getElementById("maze").innerHTML = lbr.toDisplay();
}
