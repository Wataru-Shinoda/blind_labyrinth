class Labyrinth {
    static X_SIZE = 50 + 1; // 迷路の横幅
    static Y_SIZE = 26 + 1; // 迷路の縦幅
    static GOAL_DIST = Labyrinth.Y_SIZE / 4; // プレイヤーの初期生成位置からゴールまでの最低距離
    static FLARE_DIST = 6; // 照明弾の照射範囲
    static ITEM_NUM = 5; // アイテム配置数
    static NONE = "\u3000"; // 全角スペース
    static WALL = "\uff03"; // 壁
    static PLAYER_FORWARD = "\u25b2" // プレイヤー(上向き)
    static PLAYER_DOWNWARD = "\u25bc" // プレイヤー(下向き)
    static PLAYER_LEFT = "\u25c0" // プレイヤー(左向き)
    static PLAYER_RIGHT = "\u25b6" // プレイヤー(右向き)
    static GOAL = "\u25a1" // ゴール
    static ITEM = "\uff1f" // アイテム

    // privateなプロパティ
    #masterViewMaze;
    #playerViewMaze;
    #playerPositionX;
    #playerPositionY;
    #itemRemainFlag;

    constructor() {
        console.log("constructor");
        this.#masterViewMaze = []; 
        this.#playerViewMaze = []; 
        this.#playerPositionX = 0;
        this.#playerPositionY = 0;
        this.#itemRemainFlag = false;
        this.generateMaze();
    }

    get playerPositionX() {
        return this.#playerPositionX;
    }
    
    get playerPositionY() {
        return this.#playerPositionY;
    }
    
    set itemRemainFlag(value) {
        this.#itemRemainFlag = value;
    }

    /**
     * 迷路を作成する。
     */
    generateMaze() {
        // 外周と1マスごとに壁を配置する
        for (let y = 0; y < Labyrinth.Y_SIZE; y++) {
            this.#masterViewMaze[y] = [];
            this.#playerViewMaze[y] = [];
            for (let x = 0; x < Labyrinth.X_SIZE; x++) {
                if (y === 0 || y === Labyrinth.Y_SIZE - 1 || x === 0 || x === Labyrinth.X_SIZE - 1) {
                    this.#masterViewMaze[y][x] = Labyrinth.WALL;
                    this.#playerViewMaze[y][x] = Labyrinth.WALL;
                }
                else if (y % 2 === 0 && x % 2 === 0) {
                    this.#masterViewMaze[y][x] = Labyrinth.WALL;
                    this.#playerViewMaze[y][x] = Labyrinth.NONE;
                }
                else {
                    this.#masterViewMaze[y][x] = Labyrinth.NONE;
                    this.#playerViewMaze[y][x] = Labyrinth.NONE;
                }
            }
        }

        // プレイヤーを迷路に配置する
        this.#playerPositionX = Math.floor(Math.random() * ((Labyrinth.X_SIZE - 1) / 2)) * 2 + 1;
        this.#playerPositionY = Math.floor(Math.random() * ((Labyrinth.Y_SIZE - 1) / 2)) * 2 + 1;
        this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_DOWNWARD;
        this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_DOWNWARD;

        // ゴールを迷路に配置する
        const goalPositionXRange = [...Array(Labyrinth.X_SIZE - 2)]
            .map((_, i) => i + 1)
            .filter((e) => e < this.#playerPositionX - Labyrinth.GOAL_DIST 
            || this.#playerPositionX + Labyrinth.GOAL_DIST < e );
        const goalPositionYRange = [...Array(Labyrinth.Y_SIZE - 2)]
            .map((_, i) => i + 1)
            .filter((e) => e < this.#playerPositionY - Labyrinth.GOAL_DIST 
            || this.#playerPositionY + Labyrinth.GOAL_DIST < e );
        const goalPositionX = goalPositionXRange[Math.floor(Math.random() * goalPositionXRange.length)];
        let goalPositionY = goalPositionYRange[Math.floor(Math.random() * goalPositionYRange.length)];
        // 内壁に生成されるのを防ぐ
        if (goalPositionX % 2 === 0) {
            const tmpGoalPositionRange = goalPositionYRange.filter(e => e % 2 === 1);
            goalPositionY = tmpGoalPositionRange[Math.floor(Math.random() * tmpGoalPositionRange.length)];
        }
        this.#masterViewMaze[goalPositionY][goalPositionX] = Labyrinth.GOAL;
        this.#playerViewMaze[goalPositionY][goalPositionX] = Labyrinth.GOAL;

        // アイテムを迷路に配置する
        let itemPositionXRange = [...goalPositionXRange].filter(e => e != goalPositionX);
        let itemPositionYRange = [...goalPositionYRange].filter(e => e != goalPositionY);
        for (let i = 0; i < Labyrinth.ITEM_NUM; i++) {
            const itemPositionX = itemPositionXRange[Math.floor(Math.random() * itemPositionXRange.length)];
            let itemPositionY = itemPositionYRange[Math.floor(Math.random() * itemPositionYRange.length)];
            // 内壁に生成されるのを防ぐ
            if (itemPositionX % 2 === 0) {
                const tmpItemPositionRange = itemPositionYRange.filter(e => e % 2 === 1);
                itemPositionY = tmpItemPositionRange[Math.floor(Math.random() * tmpItemPositionRange.length)];
            }
            this.#masterViewMaze[itemPositionY][itemPositionX] = Labyrinth.ITEM;
            itemPositionXRange = [...itemPositionXRange].filter(e => e != itemPositionX);
            itemPositionYRange = [...itemPositionYRange].filter(e => e != itemPositionY);
        }

        // 棒倒し法で迷路を作成する
        // 内壁を棒と見立てる
        let dir = 4;
        for (let y = 2; y < Labyrinth.Y_SIZE - 2; y+=2) {
            for (let x = 2; x < Labyrinth.X_SIZE - 2; x+=2) {
                switch (Math.floor(Math.random() * dir)) {
                    case 0:
                        if (this.#masterViewMaze[y][x+1] === Labyrinth.NONE) {
                            this.#masterViewMaze[y][x+1] = Labyrinth.WALL;
                            break;
                        }
                    case 1:
                        if (this.#masterViewMaze[y][x-1] === Labyrinth.NONE) {
                            this.#masterViewMaze[y][x-1] = Labyrinth.WALL;
                            break;
                        }
                    case 2:
                        if (this.#masterViewMaze[y+1][x] !== Labyrinth.ITEM
                            && this.#masterViewMaze[y+1][x] !== Labyrinth.GOAL) {
                                this.#masterViewMaze[y+1][x] = Labyrinth.WALL;
                        }
                        break;
                    case 3:
                        this.#masterViewMaze[y-1][x] = Labyrinth.WALL;
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
            if (y < Labyrinth.Y_SIZE - 1) {
                this.#playerViewMaze[y + 1][x] = this.#masterViewMaze[y + 1][x];
                if (this.#masterViewMaze[y + 1][x] === Labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x, y + 1, cycle, transparentFlag);
                }
            }
            if (y > 1) {
                this.#playerViewMaze[y - 1][x] = this.#masterViewMaze[y - 1][x];
                if (this.#masterViewMaze[y - 1][x] === Labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x, y - 1, cycle, transparentFlag);
                }
            }
            if (x < Labyrinth.X_SIZE - 1) {
                this.#playerViewMaze[y][x + 1] = this.#masterViewMaze[y][x + 1];
                if (this.#masterViewMaze[y][x + 1] === Labyrinth.NONE || transparentFlag) {
                    this.watchAroundPosition(x + 1, y, cycle, transparentFlag);
                }
            }
            if (x > 1) {
                this.#playerViewMaze[y][x - 1] = this.#masterViewMaze[y][x - 1];
                if (this.#masterViewMaze[y][x - 1] === Labyrinth.NONE || transparentFlag) {
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
        this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.NONE;
        if (this.#itemRemainFlag) {
            this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.ITEM;
            this.#itemRemainFlag = false;
        }
        switch(key) {
            case "w":
                this.#masterViewMaze[--this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_FORWARD;
                break;
            case "s":
                this.#masterViewMaze[++this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_DOWNWARD;
                break;
            case "a":
                this.#masterViewMaze[this.#playerPositionY][--this.#playerPositionX] = Labyrinth.PLAYER_LEFT;
                break;
            case "d":
                this.#masterViewMaze[this.#playerPositionY][++this.#playerPositionX] = Labyrinth.PLAYER_RIGHT;
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
                return Labyrinth.NONE;
        }
    }

    /**
     * 壁を壊す。
     * 
     * @returns 壁を壊したか
     */
    breakWall() {
        switch(this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX]) {
            case Labyrinth.PLAYER_FORWARD:
                if (this.getPlayerDestination("w") === Labyrinth.WALL && this.#playerPositionY - 1 > 0) {
                    this.#masterViewMaze[this.#playerPositionY - 1][this.#playerPositionX] = Labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY - 1][this.#playerPositionX] = Labyrinth.NONE;
                    return true;
                }
                break;
            case Labyrinth.PLAYER_DOWNWARD:
                if (this.getPlayerDestination("s") === Labyrinth.WALL && this.#playerPositionY + 1 < Labyrinth.Y_SIZE) {
                    this.#masterViewMaze[this.#playerPositionY + 1][this.#playerPositionX] = Labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY + 1][this.#playerPositionX] = Labyrinth.NONE;
                    return true;
                }
                break;
            case Labyrinth.PLAYER_LEFT:
                if (this.getPlayerDestination("a") === Labyrinth.WALL && this.#playerPositionX - 1 > 0) {
                    this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX - 1] = Labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX - 1] = Labyrinth.NONE;
                    return true;
                }
                break;
            case Labyrinth.PLAYER_RIGHT:
                if (this.getPlayerDestination("d") === Labyrinth.WALL && this.#playerPositionX + 1 < Labyrinth.X_SIZE) {
                    this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX + 1] = Labyrinth.NONE;
                    this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX + 1] = Labyrinth.NONE;
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
        let x = this.#playerPositionX;
        let y = this.#playerPositionY;
        switch(this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX]) {
            case Labyrinth.PLAYER_FORWARD:
                while (this.#masterViewMaze[--y][x] !== Labyrinth.WALL);
                this.watchAroundPosition(x, y, Labyrinth.FLARE_DIST, true);
                break;
            case Labyrinth.PLAYER_DOWNWARD:
                while (this.#masterViewMaze[++y][x] !== Labyrinth.WALL);
                this.watchAroundPosition(x, y, Labyrinth.FLARE_DIST, true);
                break;
            case Labyrinth.PLAYER_LEFT:
                while (this.#masterViewMaze[y][--x] !== Labyrinth.WALL);
                this.watchAroundPosition(x, y, Labyrinth.FLARE_DIST, true);
                break;
            case Labyrinth.PLAYER_RIGHT:
                while (this.#masterViewMaze[y][++x] !== Labyrinth.WALL);
                this.watchAroundPosition(x, y, Labyrinth.FLARE_DIST, true);
                break;
        }
    }

    /**
     * プレイヤーを方向転換する。
     * 
     * @param {押下したキー} key 
     */
    changePlayerDirection(key) {
        switch(key) {
            case "w":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_FORWARD;
                this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_FORWARD;
                break;
            case "s":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_DOWNWARD;
                this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_DOWNWARD;
                break;
            case "a":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_LEFT;
                this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_LEFT;
                break;
            case "d":
                this.#masterViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_RIGHT;
                this.#playerViewMaze[this.#playerPositionY][this.#playerPositionX] = Labyrinth.PLAYER_RIGHT;
                break;
            default:
        }
    }
}