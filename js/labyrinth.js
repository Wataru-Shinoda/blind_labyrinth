class labyrinth {
    static X_SIZE = 50 + 1; // 迷路の横幅
    static Y_SIZE = 26 + 1; // 迷路の縦幅
    static GOAL_DIST = labyrinth.Y_SIZE / 4; // プレイヤーの初期生成位置からゴールまでの最低距離
    static FLARE_DIST = 6; // 照明弾の照射範囲
    static NONE = "\u3000"; // 全角スペース
    static WALL = "\uff03"; // ＃
    static PLAYER_FORWARD = "\u25b2" // プレイヤー(上向き)
    static PLAYER_DOWNWARD = "\u25bc" // プレイヤー(下向き)
    static PLAYER_LEFT = "\u25c0" // プレイヤー(左向き)
    static PLAYER_RIGHT = "\u25b6" // プレイヤー(右向き)
    static GOAL = "\u25a1" // ゴール

    // privateなプロパティ
    #masterViewMaze;
    #playerViewMaze;
    #playerPositionX;
    #playerPositionY;

    constructor() {
        console.log("constructor");
        this.#masterViewMaze = []; 
        this.#playerViewMaze = []; 
        this.#playerPositionX = 0;
        this.#playerPositionY = 0;
        this.generateMaze();
    }

    get playerPositionX() {
        return this.#playerPositionX;
    }
    
    get playerPositionY() {
        return this.#playerPositionY;
    }
    
    /**
     * 迷路を作成する。
     */
    generateMaze() {
        // 外周と1マスごとに壁を配置する
        for (let y = 0; y < labyrinth.Y_SIZE; y++) {
            this.#masterViewMaze[y] = [];
            this.#playerViewMaze[y] = [];
            for (let x = 0; x < labyrinth.X_SIZE; x++) {
                if (y === 0 || y === labyrinth.Y_SIZE - 1 || x === 0 || x === labyrinth.X_SIZE - 1) {
                    this.#masterViewMaze[y][x] = labyrinth.WALL;
                    this.#playerViewMaze[y][x] = labyrinth.WALL;
                }
                else if (y % 2 === 0 && x % 2 === 0) {
                    this.#masterViewMaze[y][x] = labyrinth.WALL;
                    this.#playerViewMaze[y][x] = labyrinth.NONE;
                }
                else {
                    this.#masterViewMaze[y][x] = labyrinth.NONE;
                    this.#playerViewMaze[y][x] = labyrinth.NONE;
                }
            }
        }

        // プレイヤーを迷路に配置する
        this.#playerPositionX = Math.floor(Math.random() * ((labyrinth.X_SIZE - 1) / 2)) * 2 + 1;
        this.#playerPositionY = Math.floor(Math.random() * ((labyrinth.Y_SIZE - 1) / 2)) * 2 + 1;
        this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.PLAYER_DOWNWARD;
        this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.PLAYER_DOWNWARD;

        // ゴールを迷路に配置する
        const goalPositonXRange = [...Array(labyrinth.X_SIZE - 2)]
            .map((_, i) => i + 1)
            .filter((e) => e < this.#playerPositionX - labyrinth.GOAL_DIST 
            || this.#playerPositionX + labyrinth.GOAL_DIST < e );
        const goalPositonYRange = [...Array(labyrinth.Y_SIZE - 2)]
            .map((_, i) => i + 1)
            .filter((e) => e < this.#playerPositionY - labyrinth.GOAL_DIST 
            || this.#playerPositionY + labyrinth.GOAL_DIST < e );
        const goalPositonX = goalPositonXRange[Math.floor(Math.random() * goalPositonXRange.length)];
        const goalPositonY = goalPositonYRange[Math.floor(Math.random() * goalPositonYRange.length)];
        this.#masterViewMaze[goalPositonY][goalPositonX] = labyrinth.GOAL;
        this.#playerViewMaze[goalPositonY][goalPositonX] = labyrinth.GOAL;

        // 棒倒し法で迷路を作成する
        // 内壁を棒と見立てる
        var dir = 4;
        for (let y = 2; y < labyrinth.Y_SIZE - 2; y+=2) {
            for (let x = 2; x < labyrinth.X_SIZE - 2; x+=2) {
                switch (Math.floor(Math.random() * dir)) {
                    case 0:
                        if (this.#masterViewMaze[y][x+1] === labyrinth.NONE) {
                            this.#masterViewMaze[y][x+1] = labyrinth.WALL;
                            break;
                        }
                    case 1:
                        if (this.#masterViewMaze[y][x-1] === labyrinth.NONE) {
                            this.#masterViewMaze[y][x-1] = labyrinth.WALL;
                            break;
                        }
                    case 2:
                        this.#masterViewMaze[y+1][x] = labyrinth.WALL;
                        break;
                    case 3:
                        this.#masterViewMaze[y-1][x] = labyrinth.WALL;
                        break;
                    default:
                }
            }
            // 内壁の2行目以降は上に棒を倒してはいけないため、方向の種類を調整する
            dir = 3;
        }
    }
    
    /**
     * ブラウザに表示できる迷路を出力する。
     * 
     * @returns ブラウザ表示用迷路
     */
    toDisplay() {
        let tmp = [];
        let rtn;
        this.#playerViewMaze.forEach((e) => tmp.push("<li>" + e.toString().replaceAll(",","")));
        // this.#masterViewMaze.forEach((e) => tmp.push("<li>" + e.toString().replaceAll(",","")));
        rtn = tmp.toString().replaceAll(",","</li>")
        return "<ul>" + rtn + "</ul>";
    }

    /**
     * ブラウザで表示している迷路を、プレイヤーが視認した迷路に更新する
     */
    updatePlayerMaze() {
        // プレイヤーを中心として上下左右1マスを表示する
        // そのマスに何もなければ、そのマスの上下左右1マスを表示する
        this.watchAroundPosition(this.#playerPositionX, this.#playerPositionY, 2, false);
    }

    /**
     * 与えられた座標を中心として上下左右1マスを表示する
     * 
     * @param {中心となるX座標} x 
     * @param {中心となるY座標} y 
     * @param {確認範囲マス数} cycle 
     * @param {壁を透過するか} transparentFlag
     */
    watchAroundPosition(x, y, cycle, transparentFlag) {
        if (cycle > 0) {
            cycle -= 1;
            if (y < labyrinth.Y_SIZE) {
                this.#playerViewMaze[y + 1][x] = this.#masterViewMaze[y + 1][x];
                if (this.#masterViewMaze[y + 1][x] === labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x, y + 1, cycle, transparentFlag);
                }
            }
            if (y > 0) {
                this.#playerViewMaze[y - 1][x] = this.#masterViewMaze[y - 1][x];
                if (this.#masterViewMaze[y - 1][x] === labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x, y - 1, cycle, transparentFlag);
                }
            }
            if (x < labyrinth.X_SIZE) {
                this.#playerViewMaze[y][x + 1] = this.#masterViewMaze[y][x + 1];
                if (this.#masterViewMaze[y][x + 1] === labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x + 1, y, cycle, transparentFlag);
                }
            }
            if (x > 0) {
                this.#playerViewMaze[y][x - 1] = this.#masterViewMaze[y][x - 1];
                if (this.#masterViewMaze[y][x - 1] === labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x - 1, y, cycle, transparentFlag);
                }
            }
        }
    }

    /**
     * プレイヤーを移動する。
     * 
     * @param {押下したキー} key 
     */
    movePlayerPosition(key) {
        switch(key) {
            case "w":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[--this.#playerPositionY][this.#playerPositionX] = labyrinth.PLAYER_FORWARD;
                break;
            case "s":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[++this.#playerPositionY][this.#playerPositionX] = labyrinth.PLAYER_DOWNWARD;
                break;
            case "a":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[this.#playerPositionY][--this.#playerPositionX] = labyrinth.PLAYER_LEFT;
                break;
            case "d":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[this.#playerPositionY][++this.#playerPositionX] = labyrinth.PLAYER_RIGHT;
                break;
        }
    }

    /**
     * 向き先のマス情報を取得する。
     * 
     * @param {押下したキー} key
     * @return マス情報
     */
    getPlayerDestination(key) {
        switch(key) {
            case "w":
                return this.#masterViewMaze[this.#playerPositionY - 1][this.#playerPositionX];
            case "s":
                return this.#masterViewMaze[this.#playerPositionY + 1][this.#playerPositionX];
            case "a":
                return this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX - 1];
            case "d":
                return this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX + 1];
            default:
                return labyrinth.NONE;
        }
    }

    /**
     * 壁を壊す。
     * 
     * @returns 壁を壊したか
     */
    breakWall() {
        switch(this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX]) {
            case labyrinth.PLAYER_FORWARD:
                if (this.getPlayerDestination("w") === labyrinth.WALL && this.#playerPositionY - 1 > 0) {
                    this.#masterViewMaze[this.#playerPositionY - 1][this.#playerPositionX] = labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY - 1][this.#playerPositionX] = labyrinth.NONE;
                    return true;
                }
                break;
            case labyrinth.PLAYER_DOWNWARD:
                if (this.getPlayerDestination("s") === labyrinth.WALL && this.#playerPositionY + 1 < labyrinth.Y_SIZE) {
                    this.#masterViewMaze[this.#playerPositionY + 1][this.#playerPositionX] = labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY + 1][this.#playerPositionX] = labyrinth.NONE;
                    return true;
                }
                break;
            case labyrinth.PLAYER_LEFT:
                if (this.getPlayerDestination("a") === labyrinth.WALL && this.#playerPositionX - 1 > 0) {
                    this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX - 1] = labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX - 1] = labyrinth.NONE;
                    return true;
                }
                break;
            case labyrinth.PLAYER_RIGHT:
                if (this.getPlayerDestination("d") === labyrinth.WALL && this.#playerPositionX + 1 < labyrinth.X_SIZE) {
                    this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX + 1] = labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX + 1] = labyrinth.NONE;
                    return true;
                }
                break;
        }
        return false;
    }

    /**
     * 照明弾を反映する。
     */
    effectFlare() {
        var x = this.#playerPositionX;
        var y = this.#playerPositionY;
        switch(this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX]) {
            case labyrinth.PLAYER_FORWARD:
                while (this.#masterViewMaze[--y][x] !== labyrinth.WALL);
                this.watchAroundPosition(x, y, labyrinth.FLARE_DIST, true);
                break;
            case labyrinth.PLAYER_DOWNWARD:
                while (this.#masterViewMaze[++y][x] !== labyrinth.WALL);
                this.watchAroundPosition(x, y, labyrinth.FLARE_DIST, true);
                break;
            case labyrinth.PLAYER_LEFT:
                while (this.#masterViewMaze[y][--x] !== labyrinth.WALL);
                this.watchAroundPosition(x, y, labyrinth.FLARE_DIST, true);
                break;
            case labyrinth.PLAYER_RIGHT:
                while (this.#masterViewMaze[y][++x] !== labyrinth.WALL);
                this.watchAroundPosition(x, y, labyrinth.FLARE_DIST, true);
                break;
        }
    }
}