// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        // mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// game.scale.pageAlignHorizontally = true;

// variables for players + platforms + game itself + controls
var waterboy;
var waterboy_obstacles;
var firegirl;
var firegirl_obstacles;

var f_diamonds;
var w_diamonds;

var platforms;

var cursors;
var jumpButton;
let keyA;
let keyS;
let keyD;
let keyW;

var game = new Phaser.Game(config);

function preload() {
    /* loaded images for the background, platforms, portals, and obstacles */
    this.load.image('back', 'pictures/sky.webp');
    this.load.image('ground', 'pictures/platform.jpg');
    this.load.image('sides', 'pictures/platformVertical.png');
    this.load.image('title', 'pictures/menu/title.png');
    this.load.image('play_button', 'pictures/menu/play.svg');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_fire', 'sprites/purple_fire.png', { frameWidth: 55, frameHeight: 55 });
    this.load.spritesheet('blue_fire', 'sprites/blue_fire.png', { frameWidth: 10, frameHeight: 35 });

    /* loaded spritesheets for firegirl's collectibles */
    this.load.spritesheet('purple_crystal', 'sprites/purple_crystal.png', { frameWidth: 55, frameHeight: 55 });

    /* loaded spritesheets for waterboy's collectibles */
    this.load.spritesheet('blue_crystal', 'sprites/blue_crystal.png', { frameWidth: 10, frameHeight: 35 });

    /* loaded spritesheets for this.firegirl */
    this.load.spritesheet('firegirl', 'sprites/pink.png', { frameWidth: 55, frameHeight: 55 });

    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/blue.png', { frameWidth: 55, frameHeight: 55 });

    // this.load.audio('music', 'audio/music.mp3')
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);

    /* create platforms */
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 540, 'ground').setScale(1).refreshBody();
    platforms.create(400, 700, 'ground').setScale(4).refreshBody();

    let left = this.add.sprite(-40, 700, 'sides').setScale(4);
    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    let top = this.add.sprite(400, -37, 'ground').setScale(4);

    this.title = this.add.image(600, 200, 'title');
    this.title.setScale(0.5);

    let play = this.add.image(600, 400, 'play_button');
    play.setScale(8);
    play.setInteractive();
    play.on('pointerdown', () => this.scene.start('GameScene'));
    play.on('pointerover', () => play.setTint(0xcccccc));
    play.on('pointerout', () => play.setTint(0xffffff));
    
    /* create animation for firegirl's collectible */
    // this.anims.create({
    //     key: 'firegirl_crystal',
    //     frames: this.anims.generateFrameNumbers('purple_crystal', { start: 0, end: 3 }),
    //     frameRate: 10
    // });

    // /* create collectibles for firegirl */
    // f_diamonds = this.physics.add.group({
    //     key: 'purple_crystal',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // f_diamonds.children.iterate(function (child) {
    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //     child.anims.play('firegirl_crystal');
    // });

    // /* create animation for waterboy's collectible */
    // this.anims.create({
    //     key: 'waterboy_crystal',
    //     frames: this.anims.generateFrameNumbers('blue_crystal', { start: 0, end: 3 }),
    //     frameRate: 10
    // });

    /* create collectibles for waterboy */
    // w_diamonds = this.physics.add.group({
    //     key: 'blue_crystal',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // w_diamonds.children.iterate(function (child) {
    //     child.anims.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    //     child.anims.play('w_diamond');
    // });


    // game.time.desiredFps = 30;
    

    /* create animations for this.firegirl */
    this.anims.create({
        key: 'f_idle',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 0, end: 3 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'f_death',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 4, end: 11 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'f_jump',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 12, end: 19 }),
        frameRate: 5
    });
    this.anims.create({
        key: 'f_run',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 20, end:25 }),
        frameRate: 10,
        repeat: -1
    });

    /* create animations for waterboy */
    this.anims.create({
        key: 'w_idle',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'w_death',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 4, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'w_jump',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 12, end: 19 }),
        frameRate: 5
    });

    this.anims.create({
        key: 'w_run',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 20, end: 25 }),
        frameRate: 10,
        repeat: -1
    });

    /* obstacle animations here */

    this.firegirl = this.physics.add.sprite(400, 200, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height, this.firegirl.width, true);
    

    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);

    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    // game.camera.follow(player);

    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.waterboy = this.physics.add.sprite(150, 50, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);
    
    // this.physics.add.collider(f_diamonds, platforms);
    // this.physics.add.overlap(firegirl, f_diamonds, collectDiamond, null, this);

    // this.physics.add.collider(w_diamonds, platforms);
    // this.physics.add.overlap(waterboy, w_diamonds, collectDiamond, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    // let firegirl_obstacles = this.physics.add.staticGroup();
    // firegirl_obstacles.create(400, 580, 'blue_fire');
    // let waterboy_obstacle = this.physics.add.staticGroup();
    // waterboy_obstacles.create(4500, 580, 'purple_fire');

    // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // let music = this.sounds.add('music');
    // music.setLoop(true);
    // music.play();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
}

function update() {

    if (cursors.left.isDown) {
        this.firegirl.body.setVelocityX(-200);
        this.firegirl.flipX = true;
        if (!(this.firegirl.body.onFloor())) this.firegirl.anims.play('f_jump', true);
        else this.firegirl.anims.play('f_run', true);
    }
    else if (cursors.right.isDown) {
        this.firegirl.body.setVelocityX(200);
        this.firegirl.flipX = false;
        if (!(this.firegirl.body.onFloor())) this.firegirl.anims.play('f_jump', true);
        else this.firegirl.anims.play('f_run', true);
    }
    if (cursors.up.isDown) {
        if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-250);
        this.firegirl.anims.play('f_jump', true);
    }
    if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
        if (this.firegirl.body.velocityX < 0) this.firegirl.anims.play('f_idle', true);
        else this.firegirl.anims.play('f_idle', true);
        this.firegirl.body.setVelocityX(0);
        //this.firegirl.body.setVelocityY(0);
        // jumpTimer = game.time.now + 750; dk if we need this - took from some comment below
    }

    if(keyA.isDown) {
        this.waterboy.body.setVelocityX(-200);
        this.waterboy.flipX = true;
        if (!(this.waterboy.body.onFloor())) this.waterboy.anims.play('w_jump', true);
        else this.waterboy.anims.play('w_run', true);
    }
    else if (keyD.isDown) {
        this.waterboy.body.setVelocityX(200);
        this.waterboy.flipX = false;
        if (!(this.waterboy.body.onFloor())) this.waterboy.anims.play('w_jump', true);
        else this.waterboy.anims.play('w_run', true);
    }
    if (keyW.isDown) {
        if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-250);
        this.waterboy.anims.play('w_jump', true);
    }
    if(!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }

}