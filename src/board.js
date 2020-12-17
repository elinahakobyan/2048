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
        this._endY;
        this._isMoving = false;
        this._build();
        window.addEventListener('keydown', this._onKeyDown.bind(this))
        this._generateNewItemsSet(INITIAL_ITEM_COUNT, 2);

        this.moved = false;
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
        this._addListeners();
    }

    _buildCells() {
        const { width, height } = BOARD_DIMENSION;
        const gap = 15;

        for (let i = 0; i < 4; i++) {
            const row = [];

            for (let j = 0; j < 4; j++) {
                const cell = new Cell(this.game, i, j);

                cell.position.set((j + 1) * (90 + gap), (i + 1) * (90 + gap));
                this.addChild(cell);
                row.push(cell);
            }

            this._cells.push(row);
        }
    }

    _generateNewItemsSet(count, type) {
        const items = this._makeNewItems(count, type)
        const emptyCells = sampleSize(this.getEmptyCells(), count);
        emptyCells.forEach((cell, i) => {
            cell.addItem(items[i])
            items[i].x = cell.x
            items[i].y = cell.y
            this.addChild(items[i]);
            this.game.add.tween(items[i].scale).from({ x: 0.1, y: 0.1 }, 200, Phaser.Easing.Sinusoidal.InOut, true)
        });
    }

    _makeNewItems(count, type) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const item = new Item(this.game, type)
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
        } else if (Math.abs(defX) > Math.abs(defY) && this._startX > this._endX) {
            this.moved = false
            this._moveLeft()

        } else if (Math.abs(defX) < Math.abs(defY) && this._startY > this._endY) {
            this.moved = false
            this._moveUp();

        } else if (Math.abs(defX) < Math.abs(defY) && this._startY < this._endY) {
            this.moved = false
            this._moveDown();

        }


    }

    _onKeyDown(event) {
        if (!this._isMoving) {
            switch (event.key) {
                case 'ArrowUp':
                    this.moved = false;
                    this._moveUp();
                    this._updateItemsPosition().onComplete.add(() => {
                        this._checkMatchUp().then(() => {
                            this._moveUp();
                            this._updateItemsPosition().onComplete.add(() => {
                                this._isMoving = false;
                                this._generateNewItemsSet(1, 2)
                            })
                        })
                    })

                    break;
                case 'ArrowDown':
                    this.moved = false
                    this._moveDown()
                    this._updateItemsPosition().onComplete.add(() => {
                        this._checkMatchDown();
                        this._moveDown()
                        this._updateItemsPosition().onComplete.add(() => {
                            this._isMoving = false;
                            this._generateNewItemsSet(1, 2)
                        })
                    })

                    break;
                case 'ArrowLeft':
                    this.moved = false
                    this._moveLeft()
                    this._updateItemsPosition().onComplete.add(() => {
                        this._checkMatchLeft();
                        this._moveLeft()
                        this._updateItemsPosition().onComplete.add(() => {
                            this._isMoving = false;
                            this._generateNewItemsSet(1, 2)
                        })
                    })

                    break;
                case 'ArrowRight':
                    this.moved = false
                    this._moveRigth()
                    this._updateItemsPosition().onComplete.add(() => {
                        this._checkMatchRigth();
                        this._moveRigth();
                        this._updateItemsPosition().onComplete.add(() => {
                            this._isMoving = false;
                            this._generateNewItemsSet(1, 2)
                        })
                    })

                    break;

                default:
                    break;
            }
        }
    }

    _checkMatchUp() {
        return new Promise(resolve => {
            const cells = this._cells
            for (let i = 0; i < this._cells.length; i++) {
                for (let j = 0; j < this._cells.length; j++) {
                    if (!cells[i][j].isEmpty) {
                        if (cells[i + 1] && cells[i + 1][j] && !cells[i + 1][j].isEmpty) {
                            if (cells[i][j].item.type === cells[i + 1][j].item.type) {
                                this.moved = true

                                this.game.add.tween(cells[i + 1][j].item).to({ x: cells[i][j].x, y: cells[i][j].y }, 300, null, true).onComplete.add(() => {
                                    const newType = cells[i + 1][j].item.type * 2
                                    cells[i][j].item.destroy();
                                    cells[i + 1][j].item.destroy();
                                    cells[i][j].removeItem();
                                    cells[i + 1][j].removeItem();
                                    this._updateItems(cells[i][j], newType)
                                    resolve();
                                })
                            }
                        }
                    }
                }
            }
        })
    }

    _checkMatchDown() {
        const cells = this._cells
        for (let i = this._cells.length - 1; i >= 0; i--) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!cells[i][j].isEmpty) {
                    if (cells[i - 1] && cells[i - 1][j] && !cells[i - 1][j].isEmpty) {
                        if (cells[i][j].item.type === cells[i - 1][j].item.type) {
                            this.moved = true
                            const newType = cells[i - 1][j].item.type * 2
                            cells[i][j].item.destroy();
                            cells[i - 1][j].item.destroy();
                            cells[i][j].removeItem();
                            cells[i - 1][j].removeItem();
                            this._updateItems(cells[i][j], newType)
                        }

                    }

                }
            }
        }

    }

    _checkMatchLeft() {
        const cells = this._cells
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty) {
                    if (cells[i][j + 1] && !cells[i][j + 1].isEmpty) {
                        if (cells[i][j].item.type === cells[i][j + 1].item.type) {
                            this.moved = true
                            const newType = cells[i][j + 1].item.type * 2
                            cells[i][j].item.destroy();
                            cells[i][j + 1].item.destroy();
                            cells[i][j].removeItem();
                            cells[i][j + 1].removeItem();
                            this._updateItems(cells[i][j], newType)
                        }

                    }
                }
            }
        }
    }

    _checkMatchRigth() {
        const cells = this._cells
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = this._cells[i].length - 1; j >= 0; j--) {
                if (!this._cells[i][j].isEmpty) {
                    if (cells[i][j - 1] && !cells[i][j - 1].isEmpty) {
                        if (cells[i][j].item.type === cells[i][j - 1].item.type) {
                            this.moved = true
                            const newType = cells[i][j - 1].item.type * 2
                            cells[i][j].item.destroy();
                            cells[i][j - 1].item.destroy();
                            cells[i][j].removeItem();
                            cells[i][j - 1].removeItem();
                            this._updateItems(cells[i][j], newType)
                        }
                    }
                }
            }

        }
    }


    _moveUp() {
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty) {
                    this._moveToTop(i, j)
                }

            }
        }
    }

    _moveDown() {
        for (let i = this._cells.length - 1; i >= 0; i--) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty) {
                    this._moveToDown(i, j)
                }

            }
        }
    }

    _moveRigth() {
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = this._cells[i].length - 1; j >= 0; j--) {
                if (!this._cells[i][j].isEmpty) {
                    this._moveToRigth(i, j)
                }
            }
        }
    }

    _moveLeft() {
        for (let i = 0; i < this._cells.length; i++) {
            for (let j = 0; j < this._cells.length; j++) {
                if (!this._cells[i][j].isEmpty) {
                    this._moveToLeft(i, j)
                }
            }
        }
    }

    _moveToRigth(i, j) {
        const cells = this._cells
        if (cells[i][j + 1] && cells[i][j + 1].isEmpty) {
            this.moved = true;
            const item = cells[i][j].removeItem()
            cells[i][j + 1].addItem(item)
            this._moveToRigth(i, j + 1)
        }
    }

    _moveToLeft(i, j) {
        const cells = this._cells
        if (cells[i][j - 1] && cells[i][j - 1].isEmpty) {
            this.moved = true;
            const item = cells[i][j].removeItem()
            cells[i][j - 1].addItem(item)
            this._moveToLeft(i, j - 1)
        }
    }

    _moveToTop(i, j) {
        const cells = this._cells;
        if (cells[i - 1] && cells[i - 1][j].isEmpty) {
            this.moved = true;
            const item = cells[i][j].removeItem();
            cells[i - 1][j].addItem(item);
            this._moveToTop(i - 1, j)
        }
    }

    _moveToDown(i, j) {
        const cells = this._cells
        if (cells[i + 1] && cells[i + 1][j].isEmpty) {
            this.moved = true
            const item = cells[i][j].removeItem()
            cells[i + 1][j].addItem(item)
            this._moveToDown(i + 1, j)
        }
    }

    _updateItemsPosition() {
        let lastTween;
        this._cells.forEach(row => {
            row.forEach(cell => {
                const { item, isEmpty, x, y } = cell;

                if (!isEmpty) {
                    this._isMoving = true;
                    lastTween = this.game.add.tween(item).to({ x, y }, 300, Phaser.Easing.Cubic.InOut, true)
                }
            });
        });

        return lastTween;
    }


    _updateItems(cell, type) {
        const newItem = new Item(this.game, type)
        cell.addItem(newItem)
        this.addChild(newItem);
        newItem.position.set(cell.x, cell.y)
    }

    // _updateItems(item, type) {
    //     const newItem = new Item(this.game, type)
    //     newItem.position.set(item.x, item.y)
    //     item.addItem(newItem)
    //     this.addChild(newItem)
    // }

    // _randomNumbers() {
    //     const index = Math.random()
    //     if (index < 0.8) {
    //         return 2;
    //     } else {
    //         return 4;
    //     }
    // }

    // _newItems(check) {
    //     if (check) {
    //         this._generateNewItemsSet(1, this._randomNumbers())
    //     }
    // }

    // _gameFinish() {
    //     let count = 0
    //     const cells = this._cells
    //     for (let i = 0; i < cells.length; i++) {
    //         for (let j = 0; j < cells.length; j++) {
    //             if (!this._cells[i][j].isEmpty) {
    //                 count++
    //                 if (count === (cells.length * cells.length) && !this.moved) {
    //                     console.warn('Game Over');
    //                 }

    //             }
    //         }
    //     }
    // }

    // _generateFixedItems() {
    //     const items = this._generateNewItems(1, 4)
    //     items.push(...this._generateNewItems(2, 2))
    //     const emptyCells = [
    //         this._cells[1][0],
    //         this._cells[2][0],
    //         this._cells[3][0],
    //     ]
    //     emptyCells.forEach((cell, i) => {
    //         cell.addItem(items[i])
    //         items[i].x = cell.x
    //         items[i].y = cell.y
    //         this.addChild(items[i])
    //     });
    // }
}





// else if (cells[i][j].item.type === cells[i - 1][j].item.type) {
            //     this.moved = true
            //     const newType = cells[i - 1][j].item.type * 2
            //     const item = cells[i][j].removeItem()
            //     this.removeChild(item)
            //     const item_2 = cells[i - 1][j].removeItem()
            //     const lastItem = cells[i - 1][j]
            //     this.removeChild(item_2)
            //     this._updateItems(lastItem, newType)
            // }