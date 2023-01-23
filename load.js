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
    this.load.image('back', 'pictures/apocalypse2.jpg');
    this.load.image('ground', 'pictures/platform.jpg');

    // should be loading in sprite for one of the players (not working) - aj
    this.load.image('player1', 'sprites/watergirl/Sprites/Idle.png')
}

function create() {
    this.add.image(600, 330, 'back').setScale(3.6).setOrigin(.5,.5);

    // code to add platforming maybe? i need to do more research -K
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // physics, fps, gravity
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = 30;
    game.physics.arcade.gravity.y = 250;
    // should place sprites on screen (not working) also sould enable physics for player - aj
    fireboy = game.add.sprite(32, 32, 'sprites/watergirl/Sprites/Idle.png');
    // game.physics.enable(fireboy, Phaser.Physics.Arcade);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    // potentially use to make camera follow player around - aj
    // game.camera.follow(player);



    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
}

function update() {
    // should be covering basic left right movement + jumping - aj
    player.body.velocity.x = 0;

   if (cursors.left.isDown) {
       player.body.velocity.x = -150;
   }

   else if (cursors.right.isDown) {
       player.body.velocity.x = 150;
   }

   if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
}