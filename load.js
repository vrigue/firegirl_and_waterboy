// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
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

// variables for players + platforms + game itself + controls
var player;
var fireboy;
var watergirl;
var platforms;
var cursors;
var jumpButton;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('back', 'pictures/apocalypse1.jpg');
    this.load.image('ground', 'pictures/platform.jpg');
    this.load.spritesheet('wg', '.sprites/watergirl/Idle.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.2).setOrigin(.5, .5);

    // code to add platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // physics, fps, gravity
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.time.desiredFps = 30;
    // game.physics.arcade.gravity.y = 250;
    // should place sprites on screen (not working) also sould enable physics for player - aj
    watergirl = this.physics.add.sprite(400, 568, 'wg');
    game.physics.enable(watergirl, Phaser.Physics.Arcade);
    watergirl.setBounce(0.2);

    this.physics.add.collider(player, 'ground');
    watergirl.setCollideWorldBounds(true);

    watergirl.body.setSize(20, 32, 5, 16);

    // should animate stuff
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('wg', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'wg', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('wg', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // potentially use to make camera follow player around - aj
    // game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    // should be covering basic left right movement + jumping - aj
    watergirl.body.velocity.x = 0;

    if (cursors.left.isDown) {
        watergirl.body.velocity.x = -150;
    }

    else if (cursors.right.isDown) {
        watergirl.body.velocity.x = 150;
    }

    if (jumpButton.isDown && watergirl.body.onFloor() && game.time.now > jumpTimer) {
        watergirl.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
}