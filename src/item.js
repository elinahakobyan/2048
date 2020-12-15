import { ITEM_COLORS, ITEM_TYPES } from "./constants";
import { sample } from "./utils";
export class Item extends Phaser.Sprite {
    constructor(game, row, col) {
        super(game);
        this._type = 2;
        this._row = row;
        this._col = col;
        this._build();

    }
    get type() {
        return this._type;
    }
    get row() {
        return this._row
    }
    get col() {
        return this._col
    }
    _build() {
        this._buildBg();
        this._buildText()
    }

    _buildBg() {
        const gr = this.game.add.graphics(0, 0);
        gr.beginFill(0xe2c6c9);
        gr.drawRect(-25, -25, 100, 100);
        gr.endFill();
        this.addChild((this._bg = gr));
    }

    _buildText() {
        const style = {
            fontSize: 25,
            fill: '#FFFFFF',
            align: 'center',
        }
        const label = this.game.add.text(0, 0, this._type, style)

        label.anchor.set(0.5, 0.5)
        this.addChild((this._label = label));
    }
}