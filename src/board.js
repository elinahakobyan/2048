import { Cell } from './cell';
import { BOARD_DIMENSION, INITIAL_ITEM_COUNT } from './constants';
import { Item } from './item';
import { sampleSize } from './utils';

export class Board extends Phaser.Group {
  constructor(game) {
    super(game);
    this._cells = [];
    this._startX;
    this._startY;
    this._endX;
    this._endY;
    this._isMoving = false;
    this.moved = false;
    this._build();
    this.onRetryClick = new Phaser.Signal();
    this._generateNewItemsSet(INITIAL_ITEM_COUNT, 2);
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
    this.position.set((window.innerWidth - this.width) / 2, this.height / 2);
    this._addListeners();
  }

  _buildCells() {
    const { width, height } = BOARD_DIMENSION;
    const gap = 15;

    for (let i = 0; i < width; i++) {
      const row = [];

      for (let j = 0; j < height; j++) {
        const cell = new Cell(this.game, i, j);

        cell.position.set((j + 0.5) * (90 + gap), (i + 0.5) * (90 + gap));
        this.addChild(cell);
        row.push(cell);
      }

      this._cells.push(row);
    }
  }

  _generateNewItemsSet(count, type) {
    const items = this._makeNewItems(count, type);
    const emptyCells = sampleSize(this.getEmptyCells(), count);

    emptyCells.forEach((cell, i) => {
      cell.addItem(items[i]);
      items[i].x = cell.x;
      items[i].y = cell.y;
      this.addChild(items[i]);
      this.game.add.tween(items[i].scale).from({ x: 0.1, y: 0.1 }, 200, Phaser.Easing.Sinusoidal.InOut, true);
    });
    if (this.getEmptyCells().length === 0) {
      if (this._gameOver()) {
        this._gameOverMessage();
        this._tryAgain();
      }
    }
  }

  _tryAgain() {
    this._removeListeners();

    // const gr = this.game.add.graphics(255, 270);
    // gr.beginFill(0xeee4da, 0.73);
    // gr.drawRect(-75, -25, 160, 50);
    // gr.endFill();
    // this.addChild(gr);

    const style = {
      fontSize: 30,
      fill: '#00000',
      align: 'center',
    };

    const text = this.game.add.text(0, 0, 'Try again', style);
    text.position.set(140, 210);

    text.inputEnabled = true;
    text.events.onInputDown.add(this._onclick, this);
    this.addChild(text);
  }

  _onclick() {
    this.onRetryClick.dispatch(this);
  }

  _gameOverMessage() {
    const { x, y, width, height } = this;

    const gr = this.game.add.graphics(0, 0);
    gr.beginFill(0xf0eae4);
    gr.drawRect(0, 0, width + 73, height + 73);
    gr.alpha = 0.85;
    gr.endFill();
    this.addChild(gr);

    const style = {
      fontSize: 45,
      fill: '#464341',
      align: 'center',
    };

    const text = this.game.add.text(0, 0, 'Game Over !', style);
    text.position.set(gr.centerX - text.width / 2, gr.centerY - 70);
    this.addChild(text);
  }

  _makeNewItems(count, type) {
    const items = [];
    for (let i = 0; i < count; i++) {
      const item = new Item(this.game, type);
      items.push(item);
    }

    return items;
  }

  _addListeners() {
    this._bindedKeyDown = this._onKeyDown.bind(this);
    window.addEventListener('keydown', this._bindedKeyDown);

    const state = this.game.state.getCurrentState();

    state.input.onDown.add(this._onPointerDown, this);

    state.input.onUp.add(this._onPointerUp, this);
  }

  _removeListeners() {
    window.removeEventListener('keydown', this._bindedKeyDown);

    const state = this.game.state.getCurrentState();

    state.input.onDown.remove(this._onPointerDown, this);

    state.input.onUp.remove(this._onPointerUp, this);
  }

  _onPointerDown(pointer) {
    this._startX = pointer.x;
    this._startY = pointer.y;
  }

  _onPointerUp(pointer) {
    this._endX = pointer.x;
    this._endY = pointer.y;
    const defX = this._startX - this._endX;
    const defY = this._startY - this._endY;
    if (Math.abs(defX) > Math.abs(defY) && this._startX < this._endX) {
      this.moved = false;
      this._moveRigth();
      this._updateItemsPosition().onComplete.add(() => {
        this._checkMatchRigth()
          .then(() => {
            this._moveRigth();
            this._updateItemsPosition().onComplete.add(() => {
              this._isMoving = false;
              if (this.moved) {
                this._generateNewItemsSet(1, 2);
              }
            });
          })
          .catch(() => {
            this._isMoving = false;
            if (this.moved) {
              this._generateNewItemsSet(1, 2);
            }
          });
      });
    } else if (Math.abs(defX) > Math.abs(defY) && this._startX > this._endX) {
      this.moved = false;
      this._moveLeft();
      this._updateItemsPosition().onComplete.add(() => {
        this._checkMatchLeft()
          .then(() => {
            this._moveLeft();
            this._updateItemsPosition().onComplete.add(() => {
              this._isMoving = false;
              if (this.moved) {
                this._generateNewItemsSet(1, 2);
              }
            });
          })
          .catch(() => {
            this._isMoving = false;
            if (this.moved) {
              this._generateNewItemsSet(1, 2);
            }
          });
      });
    } else if (Math.abs(defX) < Math.abs(defY) && this._startY > this._endY) {
      this.moved = false;
      this._moveUp();
      this._updateItemsPosition().onComplete.add(() => {
        this._checkMatchUp()
          .then(() => {
            this._moveUp();
            this._updateItemsPosition().onComplete.add(() => {
              this._isMoving = false;
              if (this.moved) {
                this._generateNewItemsSet(1, 2);
              }
            });
          })
          .catch(() => {
            this._isMoving = false;
            if (this.moved) {
              this._generateNewItemsSet(1, 2);
            }
          });
      });
    } else if (Math.abs(defX) < Math.abs(defY) && this._startY < this._endY) {
      this.moved = false;
      this._moveDown();
      this._updateItemsPosition().onComplete.add(() => {
        this._checkMatchDown()
          .then(() => {
            this._moveDown();
            this._updateItemsPosition().onComplete.add(() => {
              this._isMoving = false;
              if (this.moved) {
                this._generateNewItemsSet(1, 2);
              }
            });
          })
          .catch(() => {
            this._isMoving = false;
            if (this.moved) {
              this._generateNewItemsSet(1, 2);
            }
          });
      });
    }
  }

  _onKeyDown(event) {
    if (!this._isMoving) {
      switch (event.key) {
        case 'ArrowUp':
          this.moved = false;
          this._moveUp();
          this._updateItemsPosition().onComplete.add(() => {
            this._checkMatchUp()
              .then(() => {
                this._moveUp();
                this._updateItemsPosition().onComplete.add(() => {
                  this._isMoving = false;
                  if (this.moved) {
                    this._generateNewItemsSet(1, 2);
                  }
                });
              })
              .catch(() => {
                this._isMoving = false;
                if (this.moved) {
                  this._generateNewItemsSet(1, 2);
                }
              });
          });

          break;
        case 'ArrowDown':
          this.moved = false;
          this._moveDown();
          this._updateItemsPosition().onComplete.add(() => {
            this._checkMatchDown()
              .then(() => {
                this._moveDown();

                this._updateItemsPosition().onComplete.add(() => {
                  this._isMoving = false;
                  if (this.moved) {
                    this._generateNewItemsSet(1, 2);
                  }
                });
              })
              .catch(() => {
                this._isMoving = false;
                if (this.moved) {
                  this._generateNewItemsSet(1, 2);
                }
              });
          });

          break;
        case 'ArrowLeft':
          this.moved = false;
          this._moveLeft();
          this._updateItemsPosition().onComplete.add(() => {
            this._checkMatchLeft()
              .then(() => {
                this._moveLeft();
                this._updateItemsPosition().onComplete.add(() => {
                  this._isMoving = false;
                  if (this.moved) {
                    this._generateNewItemsSet(1, 2);
                  }
                });
              })
              .catch(() => {
                this._isMoving = false;
                if (this.moved) {
                  this._generateNewItemsSet(1, 2);
                }
              });
          });

          break;
        case 'ArrowRight':
          this.moved = false;
          this._moveRigth();
          this._updateItemsPosition().onComplete.add(() => {
            this._checkMatchRigth()
              .then(() => {
                this._moveRigth();
                this._updateItemsPosition().onComplete.add(() => {
                  this._isMoving = false;
                  if (this.moved) {
                    this._generateNewItemsSet(1, 2);
                  }
                });
              })
              .catch(() => {
                this._isMoving = false;
                if (this.moved) {
                  this._generateNewItemsSet(1, 2);
                }
              });
          });

          break;

        default:
          break;
      }
    }
  }

  _checkMatchUp() {
    return new Promise((resolve, reject) => {
      let tween = null;
      const cells = this._cells;
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
          if (!cells[i][j].isEmpty) {
            if (cells[i + 1] && cells[i + 1][j] && !cells[i + 1][j].isEmpty) {
              if (cells[i][j].item.type === cells[i + 1][j].item.type) {
                this.moved = true;
                tween = this._match(cells[i + 1][j], cells[i][j], resolve);
              }
            }
          }
        }
      }

      if (!tween) {
        reject();
      }
    });
  }

  _checkMatchDown() {
    return new Promise((resolve) => {
      let tween = null;
      const cells = this._cells;
      for (let i = cells.length - 1; i >= 0; i--) {
        for (let j = 0; j < cells.length; j++) {
          if (!cells[i][j].isEmpty) {
            if (cells[i - 1] && cells[i - 1][j] && !cells[i - 1][j].isEmpty) {
              if (cells[i][j].item.type === cells[i - 1][j].item.type) {
                this.moved = true;
                tween = this._match(cells[i - 1][j], cells[i][j], resolve);
              }
            }
          }
        }
      }

      if (!tween) {
        reject();
      }
    });
  }

  _checkMatchLeft() {
    return new Promise((resolve) => {
      let tween = null;
      const cells = this._cells;
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
          if (!cells[i][j].isEmpty) {
            if (cells[i][j + 1] && !cells[i][j + 1].isEmpty) {
              if (cells[i][j].item.type === cells[i][j + 1].item.type) {
                this.moved = true;
                tween = this._match(cells[i][j + 1], cells[i][j], resolve);
              }
            }
          }
        }
      }

      if (!tween) {
        reject();
      }
    });
  }

  _checkMatchRigth() {
    return new Promise((resolve) => {
      let tween = null;
      const cells = this._cells;
      for (let i = 0; i < cells.length; i++) {
        for (let j = cells[i].length - 1; j >= 0; j--) {
          if (!cells[i][j].isEmpty) {
            if (cells[i][j - 1] && !cells[i][j - 1].isEmpty) {
              if (cells[i][j].item.type === cells[i][j - 1].item.type) {
                this.moved = true;
                tween = this._match(cells[i][j - 1], cells[i][j], resolve);
              }
            }
          }
        }
      }

      if (!tween) {
        reject();
      }
    });
  }

  _match(from, to, resolve) {
    const toItem = to.removeItem();
    const fromItem = from.removeItem();

    const tween = this.game.add.tween(fromItem).to({ x: to.x, y: to.y }, 50, null, true);
    tween.onComplete.add(() => {
      const newType = fromItem.type * 2;
      toItem.destroy();
      fromItem.destroy();

      this._updateItems(to, newType);
      resolve();
    });

    return tween;
  }

  _generateFixedItems() {
    const items = this._makeNewItems(3, 2);
    // items.push(...this._makeNewItems(2, 2))
    const emptyCells = [this._cells[1][0], this._cells[2][0], this._cells[3][0]];
    emptyCells.forEach((cell, i) => {
      cell.addItem(items[i]);
      items[i].x = cell.x;
      items[i].y = cell.y;
      this.addChild(items[i]);
    });
  }

  _moveUp() {
    for (let i = 0; i < this._cells.length; i++) {
      for (let j = 0; j < this._cells.length; j++) {
        if (!this._cells[i][j].isEmpty) {
          this._moveToTop(i, j);
        }
      }
    }
  }

  _moveDown() {
    for (let i = this._cells.length - 1; i >= 0; i--) {
      for (let j = 0; j < this._cells.length; j++) {
        if (!this._cells[i][j].isEmpty) {
          this._moveToDown(i, j);
        }
      }
    }
  }

  _moveRigth() {
    for (let i = 0; i < this._cells.length; i++) {
      for (let j = this._cells[i].length - 1; j >= 0; j--) {
        if (!this._cells[i][j].isEmpty) {
          this._moveToRigth(i, j);
        }
      }
    }
  }

  _moveLeft() {
    for (let i = 0; i < this._cells.length; i++) {
      for (let j = 0; j < this._cells.length; j++) {
        if (!this._cells[i][j].isEmpty) {
          this._moveToLeft(i, j);
        }
      }
    }
  }

  _moveToRigth(i, j) {
    const cells = this._cells;
    if (cells[i][j + 1] && cells[i][j + 1].isEmpty) {
      this.moved = true;
      const item = cells[i][j].removeItem();
      cells[i][j + 1].addItem(item);
      this._moveToRigth(i, j + 1);
    }
  }

  _moveToLeft(i, j) {
    const cells = this._cells;
    if (cells[i][j - 1] && cells[i][j - 1].isEmpty) {
      this.moved = true;
      const item = cells[i][j].removeItem();
      cells[i][j - 1].addItem(item);
      this._moveToLeft(i, j - 1);
    }
  }

  _moveToTop(i, j) {
    const cells = this._cells;
    if (cells[i - 1] && cells[i - 1][j].isEmpty) {
      this.moved = true;
      const item = cells[i][j].removeItem();
      cells[i - 1][j].addItem(item);
      this._moveToTop(i - 1, j);
    }
  }

  _moveToDown(i, j) {
    const cells = this._cells;
    if (cells[i + 1] && cells[i + 1][j].isEmpty) {
      this.moved = true;
      const item = cells[i][j].removeItem();
      cells[i + 1][j].addItem(item);
      this._moveToDown(i + 1, j);
    }
  }

  _updateItemsPosition() {
    let lastTween;
    this._cells.forEach((row) => {
      row.forEach((cell) => {
        const { item, isEmpty, x, y } = cell;

        if (!isEmpty) {
          this._isMoving = true;
          lastTween = this.game.add.tween(item).to({ x, y }, 100, Phaser.Easing.Cubic.InOut, true);
        }
      });
    });

    return lastTween;
  }

  _updateItems(cell, type) {
    const newItem = new Item(this.game, type);
    cell.addItem(newItem);
    this.addChild(newItem);
    newItem.position.set(cell.x, cell.y);
  }

  _gameOver() {
    const cells = this._cells;
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells.length; j++) {
        if (cells[i][j + 1]) {
          if (cells[i][j].item.type === cells[i][j + 1].item.type) {
            return false;
          }
        }
        if (cells[i + 1]) {
          if (cells[i + 1][j]) {
            if (cells[i][j].item.type === cells[i + 1][j].item.type) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
