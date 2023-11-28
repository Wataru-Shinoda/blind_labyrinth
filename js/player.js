class player {
    static MAX_HP = 100; // 最大体力
    static MAX_EQUIP_ITEM = 3; // 最大所持アイテム数

    // privateなプロパティ
    #hp; // 体力
    #itemList; // 所持アイテムリスト

    constructor() {
        this.#hp = player.MAX_HP;
        this.#itemList = [item.BOMB, item.FLARE, item.NONE];
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
        return "<div>" 
            + "<div>体力:" + String(this.#hp).padStart(String(player.MAX_HP).length, '0') + "</div>" 
            + "<div>アイテムリスト:<ol><li>" + this.#itemList.toString().replaceAll(",","</li><li>") + "</ol>"
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
     * @param {使用するアイテム番号} index
     * @param {プレイヤーが存在する迷宮} lbr
     */
    useItem(index, lbr) {
        const result = item.itemMap.filter(e => e === this.#itemList[index - 1]).toString();
        switch (result) {
            case item.BOMB:
                if (lbr.breakWall()) {
                    this.#itemList[index - 1] = item.NONE;
                    return true;
                }
                break;
            case item.FLARE:
                lbr.effectFlare();
                this.#itemList[index - 1] = item.NONE;
                return true;
            default:
                return false;
        }
        return false;
    }
}