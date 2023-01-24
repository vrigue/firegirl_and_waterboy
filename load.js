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
    this.load.image('sides', 'pictures/platformVertical.png');

    // should be loading in sprite for one of the players (not working) - aj
    this.load.spritesheet('wg', '.sprites/watergirl/Sprites/Idle.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.2).setOrigin(.5, .5);

    // code to add platforms
    let platform = this.add.sprite(400, 540, 'ground').setScale(2);
    // platforms = this.physics.add.staticGroup();
    let bottom = this.add.sprite(400, 700, 'ground').setScale(4);
    let left = this.add.sprite(-40, 700, 'sides').setScale(4);
    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    let top = this.add.sprite(400, -37, 'ground').setScale(4);
    this.physics.add.existing(platform);
    platform.body.allowGravity = false;
    platform.body.immovable = true;
    this.physics.add.existing(left);
    left.body.allowGravity = false;
    left.body.immovable = true;
    this.physics.add.existing(right);
    right.body.allowGravity = false;
    right.body.immovable = true;
    this.physics.add.existing(top);
    top.body.allowGravity = false;
    top.body.immovable = true;
    this.physics.add.existing(bottom);
    bottom.body.allowGravity = false;
    bottom.body.immovable = true;

    

    // physics, fps, gravity
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // game.time.desiredFps = 30;
    // game.physics.arcade.gravity.y = 250;
    // should place sprites on screen (not working) also sould enable physics for player - aj
    watergirl = this.physics.add.sprite(400, 300, 'wg');
    
    game.physics.enable(watergirl, Phaser.Physics.Arcade);

    watergirl.setBounce(0.2);
    watergirl.setCollideWorldBounds(true);
    this.physics.add.Colider(bottom, watergirl);
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

    watergirl.body.setSize(20, 32, 5, 16);

    // potentially use to make camera follow player around - aj
    // game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.physics.add.collider(player, platforms);
}

function update() {
    // should be covering basic left right movement + jumping - aj
    game.physics.arcade.collide(player, platforms);
    this.physics.add.collider(player, platforms);
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