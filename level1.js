// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 15 },
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
var waterboy;
var firegirl;
var platforms;
var cursors;
var jumpButton;

var game = new Phaser.Game(config);

function preload() {
    /* loaded images for the background, platforms, obstacles, and portals */
    this.load.image('back', 'pictures/sky.webp');
    this.load.image('ground', 'pictures/platform.jpg');
    this.load.image('sides', 'pictures/platformVertical.png');

    this.load.image('purple_crystal', 'pictures/purple_crystal.png');
    this.load.image('blue_crystal', 'pictures/blue_crystal.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_fire', 'sprites/obstacles/purple_fire.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('blue_fire', 'sprites/obstacles/blue_fire.png', { frameWidth: 100, frameHeight: 100 });

    /* loaded spritesheets for firegirl */
    this.load.spritesheet('firegirl', 'sprites/firegirl/pink.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('firegirl_idle', 'sprites/firegirl/pink_idle.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('firegirl_right', 'sprites/firegirl/pink_right.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('firegirl_left', 'sprites/firegirl/pink_left.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('firegirl_jump', 'sprites/firegirl/pink_jump.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('firegirl_death', 'sprites/firegirl/pink_death.png', { frameWidth: 100, frameHeight: 100 });


    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/waterboy/blue.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('waterboy_idle', 'sprites/firegirl/blue_idle.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('waterboy_right', 'sprites/waterboy/blue_right.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('waterboy_left', 'sprites/waterboy/blue_left.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('waterboy_jump', 'sprites/waterboy/blue_jump.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('waterboy_death', 'sprites/waterboy/blue_death.png', { frameWidth: 100, frameHeight: 100 });
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);
    this.add.image(1100,100, 'blue_portal').setScale(.2).setOrigin(.5,.5);
    this.add.image(100, 100, 'blue_portal').setScale(.2).setOrigin(.5,.5);

    // code to add platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(600, 500, 'ground').setScale(1).refreshBody();
    platforms.create(400, 700, 'ground').setScale(4).refreshBody();
    platforms.create(550, 250, 'ground').setScale(.5).refreshBody();
    platforms.create(1600, 600, 'ground').setScale(3).refreshBody();
    platforms.create(200, 500, 'ground').setScale(1).refreshBody();
    platforms.create(0, 450, 'ground').setScale(2.5).refreshBody();
    platforms.create(-200, 380, 'ground').setScale(2.5).refreshBody();
    platforms.create(1000, 200, 'ground').setScale(1).refreshBody();
    platforms.create(950, 200, 'ground').setScale(1).refreshBody();
    platforms.create(100, 180, 'ground').setScale(1).refreshBody();



    let left = this.add.sprite(-40, 700, 'sides').setScale(4);
    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    let top = this.add.sprite(400, -37, 'ground').setScale(4);

    /* create animations for firegirl */

    this.anims.create({
        key: 'firegirl_left',
        frames: this.anims.generateFrameNumbers('firegirl_left', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'firegirl_right',
        frames: this.anims.generateFrameNumbers('firegirl_right', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'firegirl_idle',
        frames: this.anims.generateFrameNumbers('firegirl_idle', { start: 0, end: 3 }),
        frameRate: 20
    });

    this.anims.create({
        key: 'firegirl_jump',
        frames: this.anims.generateFrameNumbers('firegirl_jump', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });


    /* create animations for waterboy */
    this.anims.create({
        key: 'waterboy_left',
        frames: this.anims.generateFrameNumbers('waterboy_left', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'waterboy_right',
        frames: this.anims.generateFrameNumbers('waterboy_right', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'waterboy_idle',
        frames: this.anims.generateFrameNumbers('waterboy_idle', { start: 0, end: 3 }),
        frameRate: 20
    });

    this.anims.create({
        key: 'waterboy_jump',
        frames: this.anims.generateFrameNumbers('waterboy_jump', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    firegirl = this.physics.add.sprite(100, 500, 'firegirl');
    firegirl.body.setSize(firegirl.height, firegirl.width, true);

    firegirl.setBounce(0.1);
    firegirl.body.setGravityY(300);

    firegirl.setCollideWorldBounds(true);
    this.physics.add.collider(firegirl, platforms);

    waterboy = this.physics.add.sprite(150, 500, 'waterboy');
    waterboy.body.setSize(waterboy.height, waterboy.width, true);

    waterboy.setBounce(0.1);
    waterboy.body.setGravityY(300);

    waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(waterboy, platforms);
    
    cursors = this.input.keyboard.createCursorKeys();

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
}

function update() {

    if (cursors.left.isDown) {
        firegirl.body.setVelocityX(-200);
    }
    else if (cursors.right.isDown) {
        firegirl.body.setVelocityX(200);
    }
    if (cursors.up.isDown && firegirl.body.onFloor()) {
        firegirl.body.setVelocityY(-250);
    }
    if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
        firegirl.body.setVelocityX(0);
    }

    if(keyA.isDown) {
        waterboy.body.setVelocityX(-200);
    }
    else if (keyD.isDown) {
        waterboy.body.setVelocityX(200);
    }
    if (keyW.isDown && waterboy.body.onFloor()) {
        waterboy.body.setVelocityY(-250);
    }
    if(!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        waterboy.body.setVelocityX(0);
    }
}