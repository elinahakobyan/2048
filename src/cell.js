import { Item } from "./item";


export class Cell extends Phaser.Sprite {
    constructor(game, row, col) {
        super(game);
        this._row = row;
        this._col = col;
        this._item = null;
        this._build();

    }

    get row() {
        return this._row;
    }

    get col() {
        return this._col;
    }
    get item() {
        return this._item
    }
    get isEmpty() {
        return !this._item;
    }

    addItem(item) {
        this._item = item
    }

    removeItem() {
        const item = this._item;
        this._item = null;

    }

    _build() {
        const gr = this.game.add.graphics(0, 0);
        gr.beginFill(0xf7d6c9);
        gr.drawRect(-25, -25, 100, 100);
        gr.endFill();
        this.addChild(gr);
    }
}