var lbr = new labyrinth();
var ply = new player();

document.addEventListener("DOMContentLoaded", (event) => {
    lbr.updatePlayerMaze();
    document.getElementById('maze').innerHTML = lbr.toInitDisplay();
    // document.getElementById('maze').innerHTML = '1<br>2';
});

document.addEventListener("keyup", (e) => {
    if ((e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d") 
        && lbr.isMove(lbr.playerPositionY, lbr.playerPositionX - 1)) {
        lbr.movePlayerPosition(e.key);
        lbr.updatePlayerMaze();
        document.getElementById('maze').innerHTML = lbr.toInitDisplay();
        console.log("a");
    }
})
