import { Colors, ITEM_COLORS, ITEM_TYPES } from "./constants";
import { sample } from "./utils";
export class Item extends Phaser.Sprite {
    constructor(game, row, col, type) {
        super(game);
        this._row = row;
        this._col = col;
        this._type = type;

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
    setCord(row, col) {
        this._row = row;
        this._col = col;
    }

    _build() {
        this._buildBg();
        this._buildText()
    }

    _buildBg() {
        const gr = this.game.add.graphics(0, 0);
        gr.beginFill((Colors[this._type]));
        gr.drawRoundedRect(-45, -45, 90, 90);
        gr.endFill();
        this.addChild((this._bg = gr));
    }

    _buildText() {
        const style = {
            fontSize: 45,
            fill: '#FFFFFF',
            align: 'center',
        }
        const label = this.game.add.text(0, 0, this._type, style)
        label.anchor.set(0.5, 0.5)
        this.addChild((this._label = label));
    }
}