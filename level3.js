// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    parent: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 15 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// variables for players + platforms + game itself + controls
var waterboy;
var waterboy_obstacles;
var firegirl;
var firegirl_obstacles;
var platforms;
var cursors;
var jumpButton;
let keyA;
let keyS;
let keyD;
let keyW;

var game = new Phaser.Game(config);

function preload() {
    /* loaded images for the background, platforms, obstacles, and portals */
    this.load.image('back', 'pictures/sky.webp');
    this.load.image('sides', 'pictures/blue-purple-tall.png');
    this.load.image('ground', 'pictures/blue-purple-flat.jpg');
    this.load.image('tile', 'pictures/tile_go_brr.png');

    // menu images
    this.load.image('sound_on', 'pictures/menu/vol_on.png');
    this.load.image('menu', 'pictures/menu/xmenu.png');
    this.load.image('reload', 'pictures/menu/reload.png');

    this.load.image('purple_crystal', 'pictures/purple_crystal.png');
    this.load.image('blue_crystal', 'pictures/blue_crystal.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_fire', 'sprites/obstacles/purple_fire.png', { frameWidth: 55, frameHeight: 55 });
    this.load.spritesheet('blue_fire', 'sprites/obstacles/blue_fire.png', { frameWidth: 10, frameHeight: 35 });

    /* loaded spritesheets for this.firegirl */
    this.load.spritesheet('firegirl', 'sprites/pink.png', { frameWidth: 55, frameHeight: 55 });
    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/blue.png', { frameWidth: 55, frameHeight: 55 });

    this.load.audio('bg', 'audio/bg.mp3');
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);
    // this.add.image(1100,100, 'blue_portal').setScale(.2).setOrigin(.5,.5);
    // this.add.image(100, 100, 'blue_portal').setScale(.2).setOrigin(.5,.5);

    // code to add platforms
    let platforms = this.physics.add.staticGroup();
    // platforms.create(400, 700, 'ground').setScale(4).refreshBody();
    platforms.create(100, 100, 'tile').setScale(.25).refreshBody();

    // platform
    platforms.create(275, 150, 'tile').setScale(.25).refreshBody();
    platforms.create(339, 150, 'tile').setScale(.25).refreshBody();

    //middle platform
    for (let i = 475; i < 800; i+=60) {
        platforms.create(i, 250, 'tile').setScale(.25).refreshBody();
    }

    platforms.create(900, 150, 'tile').setScale(.25).refreshBody();
    platforms.create(964, 150, 'tile').setScale(.25).refreshBody();


    platforms.create(1050,450, 'sides').setScale(1).refreshBody();
    platforms.create(140,450, 'sides').setScale(1).refreshBody();

    platforms.create(400, 700, 'ground').setScale(4).refreshBody();


    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    // let top = this.add.sprite(400, -37, 'ground').setScale(4);    platforms.create(600, -37, 'ground').setScale(4);
    platforms.create(-40, 100, 'sides').setScale(4);
    platforms.create(-40, 600, 'sides').setScale(4);
    platforms.create(1238, 200, 'sides').setScale(4);
    platforms.create(600, 700, 'ground').setScale(4).refreshBody();
    
    let menu_button = this.add.image(650, 50, 'menu');
    menu_button.setScale(2.5);
    menu_button.setInteractive();
    menu_button.on('pointerdown', () => location.assign('level_list.html'));
    menu_button.on('pointerover', () => menu_button.setTint(0xcccccc));
    menu_button.on('pointerout', () => menu_button.setTint(0xffffff));
    
    let vol = this.add.image(550, 50, 'sound_on');
    vol.setScale(2.5);
    vol.setInteractive();
    vol.on('pointerdown', () => {
        if(music.isPlaying) {
            music.pause(); 
        } else {
            music.resume();
        }
    });
    vol.on('pointerover', () => vol.setTint(0xcccccc));
    vol.on('pointerout', () => vol.setTint(0xffffff));

    let reload = this.add.image(600, 52, 'reload');
    reload.setScale(2.75);
    reload.setInteractive();
    reload.on('pointerdown', () => location.assign('level3.html'));
    reload.on('pointerover', () => reload.setTint(0xcccccc));
    reload.on('pointerout', () => reload.setTint(0xffffff));

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

    this.firegirl = this.physics.add.sprite(75, 550, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height - 19, this.firegirl.width, true);
    

    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);

    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    // game.camera.follow(player);

    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.waterboy = this.physics.add.sprite(1125, 550, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height - 19, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);
    
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

    let music = this.sound.add('bg');
    music.setLoop(true);
    music.play();
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