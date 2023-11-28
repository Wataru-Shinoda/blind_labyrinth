var lbr;
var ply;
var systemTalkFlag = false;

document.addEventListener("DOMContentLoaded", (event) => {
    initDisplay();
});

document.addEventListener("keydown", (e) => {
    if ((e.key === "w"  || e.key === "s" || e.key === "a" || e.key === "d") && !systemTalkFlag) {
        document.getElementById("effectLog").innerHTML = "";
        const toMoveMass = lbr.getPlayerDestination(e.key);
        if (toMoveMass !== labyrinth.WALL) {
            ply.move();
            lbr.movePlayerPosition(e.key);
            lbr.updatePlayerMaze();
            if (toMoveMass === labyrinth.GOAL) {
                alert("ゲームクリア!");
                initDisplay();
            }
            else if (ply.isDead()) {
                alert("ゲームオーバー");
                initDisplay();
            }
        }
    }
    else if (e.key === "e" && !systemTalkFlag) {
        document.getElementById("effectLog").innerHTML = "使用するアイテムを選択してください(1,2,3)";
        systemTalkFlag = true;
    }
    else if ((e.key === "1" || e.key === "2" || e.key === "3" || e.key === "e") && systemTalkFlag) {
        if (ply.useItem(Number(e.key), lbr) || e.key === "e") {
            document.getElementById("effectLog").innerHTML = "";
        }
        else {
            document.getElementById("effectLog").innerHTML = "選択したアイテムを使用できませんでした";
        }
        systemTalkFlag = false;
    }
    document.getElementById("maze").innerHTML = lbr.toDisplay();
    document.getElementById("status").innerHTML = ply.toDisplay();
});

function initDisplay() {
    lbr = new labyrinth();
    ply = new player();
    lbr.updatePlayerMaze();
    document.getElementById("maze").innerHTML = lbr.toDisplay();
    document.getElementById("status").innerHTML = ply.toDisplay();
}
