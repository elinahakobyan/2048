import { ITEM_COLORS, ITEM_TYPES } from "./constants";
import { sample } from "./utils";
export class Item extends Phaser.Sprite {
    constructor(game, row, col, type) {
        super(game);
        this._row = row;
        this._col = col;
        this._type = type;
        this.colors = {
            2: "0xffdab9",
            4: "0xfff1bd",
            8: "0xbdcbff",
            16: "0xcbffbd",
            32: "0xdefff8",
            64: "0xffc4cd",
            128: "0xec6486",
            256: "0xb2344e",
            512: "0xba0c00",
            1024: "0x480113",
            2048: "0x000000",
        }
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
        gr.beginFill((this.colors[this._type]));
        gr.drawRect(-50, -50, 100, 100);
        gr.endFill();
        this.addChild((this._bg = gr));
    }

    setCord(row, col) {
        this._row = row;
        this._col = col;
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