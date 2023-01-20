// when game initially loads, run the following?
var config = { // allows us to config the game
    type: Phaser.AUTO, // falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
    
};

var platforms;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('back', 'pictures/apocalypse2.jpg');
    this.load.image('ground', 'pictures/platform.jpg');
}

function create() {
    this.add.image(600, 330, 'back').setScale(3.6).setOrigin(.5,.5);

    // code to add platforming maybe? i need to do more research -K
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
}

function update() {
}