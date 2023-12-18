class Player {
    static MAX_HP = 100; // 最大体力
    static MAX_EQUIP_ITEM = 3; // 最大所持アイテム数

    // privateなプロパティ
    #hp; // 体力
    #itemList; // 所持アイテムリスト

    constructor() {
        this.#hp = Player.MAX_HP;
        this.#itemList = [Item.BOMB, Item.FLARE, Item.NONE];
    }

    /**
     * プレイヤーの移動時にステータスを変更する。
     */
    move() {
        this.#hp--;
    }

    /**
     * ブラウザに必要なプレイヤー情報を表示する。
     * 
     * @returns プレイヤー情報
     */
    toDisplay() {
        return "<div class='boxName'>ステータス</div>" 
            + "<div class='item'>"
            + "<span>体力</span>"
            + "<span>" + String(this.#hp).padStart(String(Player.MAX_HP).length, '0') + "/" + String(Player.MAX_HP) + "</span>"
            + "</div>" 
            + "<div class='item'>"
            + "<span>所持アイテム</span>"
            + "<span><ol><li>" + this.#itemList.toString().replaceAll(",","</li><li>") + "</ol></span>"
            + "</div>"
    }

    /**
     * プレイヤーの死亡を判定する。
     * 
     * @returns 死亡しているか
     */
    isDead() {
        return this.#hp <= 0;
    }
    
    /**
     * 所持しているアイテムを使用する
     * 
     * @param {Number} index 使用するアイテム番号
     * @param {Labyrinth} lbr プレイヤーが存在する迷宮
     * @returns 使用アイテム名
     */
    useItem(index, lbr) {
        const result = Item.itemMap.filter(e => e === this.#itemList[index - 1]).toString();
        switch (result) {
            case Item.BOMB:
                if (lbr.breakWall()) {
                    this.#itemList[index - 1] = Item.NONE;
                    return Item.BOMB;
                }
                break;
            case Item.FLARE:
                lbr.effectFlare();
                this.#itemList[index - 1] = Item.NONE;
                return Item.FLARE;
            default:
                return "";
        }
        return "";
    }

    /**
     * アイテムを取得する。
     * 
     * @param {Labyrinth} lbr プレイヤーが存在する迷宮
     */
    getItem(lbr) {
        const noneIndex = this.#itemList.findIndex(e => e === Item.NONE);
        if (noneIndex >= 0) {
            const tmp = Item.itemMap.filter(e => e !== Item.NONE);
            this.#itemList[noneIndex] = tmp[Math.floor(Math.random() * tmp.length)];
        }
        else {
            lbr.itemRemainFlag = true;
        }
    }
}