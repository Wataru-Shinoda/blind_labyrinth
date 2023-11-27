class labyrinth {
    static X_SIZE = 101;
    static Y_SIZE = 51;
    static NONE = "\u3000"; // 全角スペース
    static WALL = "\uff03"; // ＃
    static PLAYER_FORWARD = "\u25b2" // プレイヤー(上向き)
    static PLAYER_DOWNWARD = "\u25bc" // プレイヤー(下向き)
    static PLAYER_LEFT = "\u25c0" // プレイヤー(左向き)
    static PLAYER_RIGHT = "\u25b6" // プレイヤー(右向き)

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
    
    set playerPositionX(value) {
        this.#playerPositionX = value;
    }
    
    get playerPositionY() {
        return this.#playerPositionY;
    }
    
    set playerPositionY(value) {
        this.#playerPositionY = value;
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
    toInitDisplay() {
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
        this.watchAroundPosition(this.#playerPositionX, this.#playerPositionY, 2);
    }

    /**
     * 与えられた座標を中心として上下左右1マスを表示する
     * 
     * @param {中心となるX座標} x 
     * @param {中心となるY座標} y 
     * @param {確認範囲マス数} cycle 
     */
    watchAroundPosition(x, y, cycle) {
        if (cycle > 0) {
            cycle -= 1;
            if (y < labyrinth.Y_SIZE) {
                this.#playerViewMaze[y + 1][x] = this.#masterViewMaze[y + 1][x];
                if (this.#masterViewMaze[y + 1][x] === labyrinth.NONE) {
                    this.watchAroundPosition(x, y + 1, cycle);
                }
            }
            if (y > 0) {
                this.#playerViewMaze[y - 1][x] = this.#masterViewMaze[y - 1][x];
                if (this.#masterViewMaze[y - 1][x] === labyrinth.NONE) {
                    this.watchAroundPosition(x, y - 1, cycle);
                }
            }
            if (x < labyrinth.X_SIZE) {
                this.#playerViewMaze[y][x + 1] = this.#masterViewMaze[y][x + 1];
                if (this.#masterViewMaze[y][x + 1] === labyrinth.NONE) {
                    this.watchAroundPosition(x + 1, y, cycle);
                }
            }
            if (x > 0) {
                this.#playerViewMaze[y][x - 1] = this.#masterViewMaze[y][x - 1];
                if (this.#masterViewMaze[y][x - 1] === labyrinth.NONE) {
                    this.watchAroundPosition(x - 1, y, cycle);
                }
            }
        }
    }

    /**
     * 引数のマスが何なのか調べる。
     * 
     * @param {調査したいX座標} x 
     * @param {調査したいY座標} y 
     */
    isMove(x, y) {
        return this.#masterViewMaze[y][x] === labyrinth.NONE;
    }

    /**
     * プレイヤーを移動する。
     * 
     * @param {押下したキー} key 
     */
    movePlayerPosition(key) {
        switch(key) {
            case "w":
                this.#masterViewMaze[this.playerPositionY][this.playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[--this.playerPositionY][this.playerPositionX] = labyrinth.PLAYER_FORWARD;
                break;
            case "s":
                this.#masterViewMaze[this.playerPositionY][this.playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[++this.playerPositionY][this.playerPositionX] = labyrinth.PLAYER_DOWNWARD;
                break;
            case "a":
                this.#masterViewMaze[this.playerPositionY][this.playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[this.playerPositionY][--this.playerPositionX] = labyrinth.PLAYER_LEFT;
                break;
            case "d":
                this.#masterViewMaze[this.playerPositionY][this.playerPositionX] = labyrinth.NONE;
                this.#masterViewMaze[this.playerPositionY][++this.playerPositionX] = labyrinth.PLAYER_RIGHT;
                break;
        }
    }
}