// when game initially loads, run the following?
var config = { // allows us to config the game
    type: Phaser.AUTO, // falls back to canvas otherwise
    width: 800, // centering
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('back', 'pictures/apocalypse2.jpg');
}

function create() {
    this.add.image(400, 300, 'back');
}

function update() {
}