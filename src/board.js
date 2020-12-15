import { Cell } from "./cell";
import { BOARD_DIMENSION, INITIAL_ITEM_COUNT } from "./constants";
import { Item } from "./item";
import { sampleSize } from "./utils";

export class Board extends Phaser.Sprite {
    constructor(game) {
        super(game);
        this._cells = []
        this._startX
        this._startY
        this._endX
        this._endY

        this._build();
        this._generateNewItemsSet(INITIAL_ITEM_COUNT);
        this._addListeners();
    }

    getEmptyCells() {
        const cells = this.getCellsArray();
        return cells.filter((cell) => cell.isEmpty);
    }

    getCellsArray() {
        return this._cells.reduce((arr, row) => {
            arr.push(...row);
            return arr;
        }, []);
    }

    _build() {
        this._buildCells();
    }

    _buildCells() {
        const { width, height } = BOARD_DIMENSION;
        const gap = 5;

        for (let i = 0; i < 4; i++) {
            const row = [];

            for (let j = 0; j < 4; j++) {
                const cell = new Cell(this.game, i, j);

                cell.position.set(j * (100 + gap) + 50, i * (100 + gap) + 50);
                this.addChild(cell);
                row.push(cell);
            }

            this._cells.push(row);
        }

    }

    _generateNewItemsSet(count) {
        const items = this._generateNewItems(count)
        const emptyCells = sampleSize(this.getEmptyCells(), count);
        emptyCells.forEach((cell, i) => {
            cell.addItem(items[i])
            items[i].x = cell.x
            items[i].y = cell.y
            this.addChild(items[i])
            console.warn(items[i].type);


        });


    }

    _generateNewItems(count) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const item = new Item(this.game)
            items.push(item)
        }
        return items;
    }

    _addListeners() {
        const state = this.game.state.getCurrentState();

        state.input.onDown.add(this._onPointerDown, this);

        state.input.onUp.add(this._onPointerUp, this);
    }

    _onPointerDown(pointer) {
        this._startX = pointer.x
        this._startY = pointer.y
    }

    _onPointerUp(pointer) {
        this._endX = pointer.x
        this._endY = pointer.y
        if (Math.abs(this._startX - this._endX) > Math.abs(this._startY - this._endY) && this._startX < this._endX) {
            this._moveToRigth()
        } else if (Math.abs(this._startX - this._endX) > Math.abs(this._startY - this._endY) && this._startX > this._endX) {
            this._moveToLeft()
        } else if (Math.abs(this._startX - this._endX) < Math.abs(this._startY - this._endY) && this._startY > this._endY) {
            this._moveToTop()
        } else if (Math.abs(this._startX - this._endX) < Math.abs(this._startY - this._endY) && this._startY < this._endY) {
            this._moveToDown()
        }
        this._generateNewItemsSet(1)

    }

    _moveToRigth() {
        console.warn("rigth");
    }

    _moveToLeft() {
        console.warn("left");

    }

    _moveToTop() {
        const { width, height } = BOARD_DIMENSION;
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells.length; j++) {
                const cells = this._cells[i][j]
                //TODO

            }
        }

    }

    _moveToDown() {
        console.warn("down");

    }



}
