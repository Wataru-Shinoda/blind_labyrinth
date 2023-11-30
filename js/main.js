let lbr;
let ply;
let systemTalkFlag = false;
let effectLogMessage = "";

document.addEventListener("DOMContentLoaded", (event) => {
    initDisplay();
});

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if ((key === "w"  || key === "s" || key === "a" || key === "d") && !systemTalkFlag) {
        effectLogMessage = "";
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
                else if (toMoveMass === Labyrinth.ITEM) {
                    ply.getItem(lbr);
                }
            }
        }
    }
    else if (key === "e") {
        if (!systemTalkFlag) {
            effectLogMessage = "使用するアイテムを選択してください(1,2,3)";
            systemTalkFlag = true;
        }
        else {
            effectLogMessage = "";
            systemTalkFlag = false;
        }

    }
    else if ((key === "1" || key === "2" || key === "3") && systemTalkFlag) {
        const usedItem = ply.useItem(Number(key), lbr);
        effectLogMessage = "選択したアイテムを使用できませんでした";
        if (usedItem) {
            effectLogMessage = usedItem + "を使用しました";
        }
        systemTalkFlag = false;
    }
    document.getElementById("maze").innerHTML = lbr.toDisplay();
    document.getElementById("status").innerHTML = ply.toDisplay();
    document.getElementById("effectLog").innerHTML = effectLogMessage;
});

function initDisplay() {
    lbr = new Labyrinth();
    ply = new Player();
    lbr.updatePlayerMaze();
    document.getElementById("maze").innerHTML = lbr.toDisplay();
    document.getElementById("status").innerHTML = ply.toDisplay();
}
