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

    this.load.spritesheet('water', 'sprites/watergirl/Idle.png', { frameWidth: 100, frameHeight: 100 });
    // spritesheet for when we get movement to work
    this.load.spritesheet('water_run', 'sprites/watergirl/Run.png', { frameWidth: 100, frameHeight: 100 });
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.2).setOrigin(.5, .5);

    // code to add platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 540, 'ground').setScale(2).refreshBody();
    platforms.create(400, 700, 'ground').setScale(4);

    let left = this.add.sprite(-40, 700, 'sides').setScale(4);
    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    let top = this.add.sprite(400, -37, 'ground').setScale(4);

    // here for now - i don't think we need all of this for now? - K
    // this.physics.add.existing(platform);
    // platform.body.allowGravity = false;
    // platform.body.immovable = true;
    // this.physics.add.existing(left);
    // left.body.allowGravity = false;
    // left.body.immovable = true;
    // this.physics.add.existing(right);
    // right.body.allowGravity = false;
    // right.body.immovable = true;
    // this.physics.add.existing(top);
    // top.body.allowGravity = false;
    // top.body.immovable = true;
    // this.physics.add.existing(bottom);
    // bottom.body.allowGravity = false;
    // bottom.body.immovable = true;

    // physics, fps, gravity
    
    // game.time.desiredFps = 30;
    // game.physics.arcade.gravity.y = 250;
    // should place sprites on screen (not working) also sould enable physics for player - aj

    watergirl = this.physics.add.sprite(400, 200, 'water');
    watergirl.body.setSize(20, 32, 5, 16);

    watergirl.setBounce(0.1);
    watergirl.body.setGravityY(300);

    watergirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(watergirl, platforms);
    // this.physics.add.collider(fireboy, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('water', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'water', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('water', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // potentially use to make camera follow player around - aj
    // game.camera.follow(player); // to respond to aj, prob not needed fora long time - k

    this.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = this.input.keyboard.createCursorKeys();
    // jumpButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    // should be covering basic left right movement + jumping - aj

    // not sure if this is doing anything (?) - vri
    // this.physics.arcade.collide(watergirl, platforms); 

    // watergirl.body.velocity.x = 0;

    if (cursors.left.isDown) {
        watergirl.setVelocityX(-160);
        // watergirl.body.velocity.x = -150;
        watergirl.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        // watergirl.body.velocity.x = 150;
        watergirl.setVelocityX(160);
        watergirl.anims.play('right', true);
    }
    else {
        watergirl.setVelocityX(0);
        watergirl.anims.play('turn');
    }

    if (cursors.up.isDown && watergirl.body.touching.down) {
        watergirl.setVelocityY(-330);
    }

    // if (jumpButton.isDown && watergirl.body.onFloor() && game.time.now > jumpTimer) {
    //     watergirl.body.velocity.y = -250;
    //     jumpTimer = game.time.now + 750;
    // }
}