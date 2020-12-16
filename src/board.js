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
        this._generateNewItemsSet(INITIAL_ITEM_COUNT, 2);
        this.moved = false;
    }

    getEmptyCells() {
        const cells = this.getCellsArray();
        return cells.filter((cell) => cell.isEmpty());
    }

    getCellsArray() {
        return this._cells.reduce((arr, row) => {
            arr.push(...row);
            return arr;
        }, []);
    }

    _build() {
        this._buildCells();
        this._addListeners();
    }

    _buildCells() {
        const { width, height } = BOARD_DIMENSION;
        const gap = 15;

        for (let i = 0; i < 4; i++) {
            const row = [];

            for (let j = 0; j < 4; j++) {
                const cell = new Cell(this.game, i, j);

                cell.position.set((j + 1) * (100 + gap), (i + 1) * (100 + gap));
                this.addChild(cell);
                row.push(cell);
            }

            this._cells.push(row);
        }
    }

    _generateNewItemsSet(count, type) {
        const items = this._generateNewItems(count, type)
        const emptyCells = sampleSize(this.getEmptyCells(), count);
        emptyCells.forEach((cell, i) => {
            cell.addItem(items[i])
            items[i].x = cell.x
            items[i].y = cell.y
            items[i].setCord(cell.row, cell.col)
            this.addChild(items[i])


        });
    }

    _generateNewItems(count, type) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const item = new Item(this.game, null, null, type)
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
        const defX = this._startX - this._endX
        const defY = this._startY - this._endY
        if (Math.abs(defX) > Math.abs(defY) && this._startX < this._endX) {
            this.moved = false
            this._moveRigth()
            this._newItems(this.moved);
        } else if (Math.abs(defX) > Math.abs(defY) && this._startX > this._endX) {
            this.moved = false
            this._moveLeft()
            this._newItems(this.moved);

        } else if (Math.abs(defX) < Math.abs(defY) && this._startY > this._endY) {
            this.moved = false
            this._moveUp();
            this._newItems(this.moved);

        } else if (Math.abs(defX) < Math.abs(defY) && this._startY < this._endY) {
            this.moved = false
            this._moveDown();
            this._newItems(this.moved);

        }


    }

    _moveUp() {
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty()) {
                    this._moveToTop(i, j)
                }

            }
        }
    }

    _moveDown() {
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty()) {
                    this._moveToDown(i, j)
                }

            }
        }
    }

    _moveRigth() {
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 3; j >= 0; j--) {
                if (!this._cells[i][j].isEmpty()) {
                    this._moveToRigth(i, j)
                }
            }
        }
    }

    _moveLeft() {
        for (let i = 3; i >= 0; i--) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty()) {
                    this._moveToLeft(i, j)
                }
            }
        }
    }

    _moveToRigth(i, j) {
        const cells = this._cells
        if (cells[i][j + 1]) {
            if (cells[i][j + 1].isEmpty()) {
                this.moved = true;
                const item = cells[i][j].removeItem()
                this.removeChild(item)
                j++
                cells[i][j].addItem(item)
                this.addChild(item)
                item.setCord(cells[i][j].row, cells[i][j].col)
                item.position.set(cells[i][j].x, cells[i][j].y)
                this._moveToRigth(i, j)


            } else {
                if (cells[i][j].item.type === cells[i][j + 1].item.type) {

                    const newType = cells[i][j].item.type * 2
                    const item = cells[i][j].removeItem()
                    this.removeChild(item)
                    const item_2 = cells[i][j + 1].removeItem()
                    this.removeChild(item_2)
                    const lastItem = cells[i][j + 1]
                    this._updateItems(lastItem, newType)
                }

            }
        }
    }

    _moveToLeft(i, j) {
        const cells = this._cells
        if (cells[j - 1]) {
            if (cells[i][j - 1]) {
                if (cells[i][j - 1].isEmpty()) {
                    this.moved = true;
                    const item = cells[i][j].removeItem()
                    this.removeChild(item)
                    j--
                    cells[i][j].addItem(item)
                    this.addChild(item)
                    item.setCord(cells[i][j].row, cells[i][j].col)
                    item.position.set(cells[i][j].x, cells[i][j].y)
                    this._moveToLeft(i, j)
                }
                else {
                    if (cells[i][j].item.type === cells[i][j - 1].item.type) {
                        const newType = cells[i][j].item.type * 2
                        const item = cells[i][j].removeItem()
                        this.removeChild(item)
                        const item_2 = cells[i][j - 1].removeItem()
                        this.removeChild(item_2)
                        const lastItem = cells[i][j - 1]
                        this._updateItems(lastItem, newType)
                    }
                }
            }

        }

    }

    _moveToTop(i, j) {
        const cells = this._cells
        if (cells[i - 1]) {
            if (cells[i - 1][j]) {
                if (cells[i - 1][j].isEmpty()) {
                    this.moved = true
                    const item = cells[i][j].removeItem()
                    this.removeChild(item)
                    i--
                    cells[i][j].addItem(item)
                    this.addChild(item)
                    item.setCord(cells[i][j].row, cells[i][j].col)
                    item.position.set(cells[i][j].x, cells[i][j].y)
                    this._moveToTop(i, j)
                }
                else {
                    if (cells[i][j].item.type === cells[i - 1][j].item.type) {
                        const newType = cells[i - 1][j].item.type * 2
                        const item = cells[i][j].removeItem()
                        this.removeChild(item)
                        const item_2 = cells[i - 1][j].removeItem()
                        const lastItem = cells[i - 1][j]
                        this.removeChild(item_2)
                        this._updateItems(lastItem, newType)
                    }
                }
            }

        }

    }

    _moveToDown(i, j) {
        const cells = this._cells
        if (cells[i + 1]) {
            if (cells[i + 1][j]) {
                if (cells[i + 1][j].isEmpty()) {
                    this.moved = true
                    const item = cells[i][j].removeItem()
                    this.removeChild(item)
                    i++
                    cells[i][j].addItem(item)
                    this.addChild(item)
                    item.setCord(cells[i][j].row, cells[i][j].col)
                    item.position.set(cells[i][j].x, cells[i][j].y)
                    this._moveToDown(i, j)
                }
                else {
                    if (cells[i][j].item.type === cells[i + 1][j].item.type) {
                        const newType = cells[i][j].item.type * 2
                        const item = cells[i][j].removeItem()
                        this.removeChild(item)
                        const item_2 = cells[i + 1][j].removeItem()
                        this.removeChild(item_2)
                        const lastItem = cells[i + 1][j]
                        this._updateItems(lastItem, newType)
                    }
                }
            }

        }
    }

    _updateItems(item, type) {
        const newItem = new Item(this.game, item.row, item.col, type)
        newItem.position.set(item.x, item.y)
        item.addItem(newItem)
        this.addChild(newItem)
    }

    _newItems(check) {
        if (check) {
            this._generateNewItemsSet(1, 2)
        }
    }


}
