var lbr = new labyrinth();
var ply = new player();

document.addEventListener("DOMContentLoaded", (event) => {
    lbr.updatePlayerMaze();
    document.getElementById("maze").innerHTML = lbr.toInitDisplay();
    // document.getElementById("maze").innerHTML = '1<br>2';
});

document.addEventListener("keydown", (e) => {
    if ((e.key === "w" && lbr.isNotWall(lbr.playerPositionX, lbr.playerPositionY - 1))
        || (e.key === "s" && lbr.isNotWall(lbr.playerPositionX, lbr.playerPositionY + 1))
        || (e.key === "a" && lbr.isNotWall(lbr.playerPositionX - 1, lbr.playerPositionY))
        || (e.key === "d" && lbr.isNotWall(lbr.playerPositionX + 1, lbr.playerPositionY))) {
            lbr.movePlayerPosition(e.key);
            lbr.updatePlayerMaze();
            document.getElementById("maze").innerHTML = lbr.toInitDisplay();
            
            if (lbr.isGoal()) {
                alert("ゲームクリア!");
                lbr = new labyrinth();
                ply = new player();
            }
    }
})

