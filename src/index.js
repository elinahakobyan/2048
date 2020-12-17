import { Board } from "./board";

const state = {
    preload,
    create,
    update,
};


const game = new Phaser.Game(600, 600, Phaser.AUTO, "", state,);

function preload() { }

function create() {
    const board = new Board(game);
    game.stage.backgroundColor = 0xbdcfdd
    game.stage.add(board);

}

function update() { }