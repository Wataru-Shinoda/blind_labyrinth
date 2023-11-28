var lbr;
var ply;
var systemTalkFlag = false;

document.addEventListener("DOMContentLoaded", (event) => {
    initDisplay();
});

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((key === "w"  || key === "s" || key === "a" || key === "d") && !systemTalkFlag) {
        document.getElementById("effectLog").innerHTML = "";
        if (e.shiftKey) {
            lbr.changePlayerDirection(key);
        }
        else {
            const toMoveMass = lbr.getPlayerDestination(key);
            if (toMoveMass !== Labyrinth.WALL) {
                ply.move();
                lbr.movePlayerPosition(key);
                lbr.updatePlayerMaze();
                if (toMoveMass === Labyrinth.GOAL) {
                    alert("ゲームクリア!");
                    initDisplay();
                }
                else if (ply.isDead()) {
                    alert("ゲームオーバー");
                    initDisplay();
                }
            }
        }
    }
    else if (key === "e" && !systemTalkFlag) {
        document.getElementById("effectLog").innerHTML = "使用するアイテムを選択してください(1,2,3)";
        systemTalkFlag = true;
    }
    else if ((key === "1" || key === "2" || key === "3" || key === "e") && systemTalkFlag) {
        if (ply.useItem(Number(key), lbr) || key === "e") {
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
    lbr = new Labyrinth();
    ply = new Player();
    lbr.updatePlayerMaze();
    document.getElementById("maze").innerHTML = lbr.toDisplay();
    document.getElementById("status").innerHTML = ply.toDisplay();
}
