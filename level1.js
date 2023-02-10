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

// variables for players + platforms + game itself + controls
var waterboy;
var waterboy_obstacles;
var m_waterboy_gems;
var s_waterboy_gems;

var firegirl;
var firegirl_obstacles;
var m_firegirl_gems;
var s_firegirl_gems;

var purple_portal;
var blue_portal;

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
    // menu images
    this.load.image('sound_on', 'pictures/menu/vol_on.png');
    this.load.image('sound_off', 'pictures/menu/mute.png');
    this.load.image('menu', 'pictures/menu/xmenu.png');
    this.load.image('reload', 'pictures/menu/reload.png');

    this.load.image('ground', 'pictures/blue-purple-flat.jpg');
    this.load.image('tile', 'pictures/new_tiles.png');
    this.load.image('block', 'pictures/block_go_brr.png');
    // this.load.image('sides', 'pictures/platformVertical.png');
    this.load.image('sides', 'pictures/blue-purple-tall.jpg');
    this.load.image('purple_crystal', 'pictures/purple_crystal.png');
    this.load.image('blue_crystal', 'pictures/blue_crystal.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_obstacle', 'sprites/purple_fire.png', { frameWidth: 55, frameHeight: 55 });
    this.load.spritesheet('blue_obstacle', 'sprites/blue_water.png', { frameWidth: 10, frameHeight: 35 });

    /* loaded spritesheets for this.firegirl */
    this.load.spritesheet('firegirl', 'sprites/pink.png', { frameWidth: 55, frameHeight: 55 });
    
    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/blue.png', { frameWidth: 55, frameHeight: 55 });

    this.load.audio('bg', 'audio/bg.mp3');
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);

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

    /* PLATFORMS */
    let platforms = this.physics.add.staticGroup();

    // giant chunk of platform
    for (let i = 0; i < 800; i+=90) {
        platforms.create(i, 500, 'tile').setScale(2.5).refreshBody();
    }
    for (let i = 0; i < 500; i+=90) {
        platforms.create(i, 460, 'block').setScale(2.5).refreshBody();
    }
    for (let i = 75; i < 350; i+=60) {
        platforms.create(i, 415, 'block').setScale(3).refreshBody();
    }

    

    // smol platform
    for (let i = 450; i < 750; i+=90) {
        platforms.create(i, 260, 'tile').setScale(2).refreshBody();
    }

    /* chunky platform */
    for (let i = 1021; i < 2000; i+=102) {
        platforms.create(i, 595, 'block').setScale(2.5).refreshBody();
    }

    /* leads to blue portal */
    for (let i = 0; i < 275; i+=89) {
        platforms.create(i, 200, 'tile').setScale(2).refreshBody();
    }

    /* leads to purple portal */
    for (let i = 900; i < 1200; i+=50) {
        platforms.create(i, 200, 'tile').setScale(2).refreshBody();
    }

    // let left = this.add.sprite(-40, 300, 'sides').setScale(4);
    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    // let top = this.add.sprite(400, -37, 'ground').setScale(4);

    platforms.create(600, -37, 'ground').setScale(4);
    platforms.create(-40, 100, 'sides').setScale(4);
    platforms.create(-40, 600, 'sides').setScale(4);
    platforms.create(1238, 200, 'sides').setScale(4);
    platforms.create(600, 700, 'ground').setScale(4).refreshBody();


    /* PORTALS */
    let purple_portal = this.add.sprite(1115, 110, 'purple_portal');
    purple_portal.setScale(0.29);

    let blue_portal = this.add.sprite(75, 110, 'blue_portal');
    blue_portal.setScale(0.22);

    
    // game.time.desiredFps = 30;
    

    /* ANIMATIONS */

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
    this.anims.create({
        key: 'f_portal',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 32, end:37 }),
        frameRate: 10,
        repeat: -1
    });

    /* create animations for this.waterboy */
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
    this.anims.create({
        key: 'w_portal',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 32, end:37 }),
        frameRate: 10,
        repeat: -1
    });

    /* create animations for obstacles */
    

    /* GEMS */

    /* create collectible gems for firegirl */
    let m_firegirl_gems = this.physics.add.group({
        key: 'purple_crystal',
        repeat: 2,
        setXY: { x: 400, y: 550, stepX: 85 }
    });

    m_firegirl_gems.children.iterate(function (child) {
        child.body.setSize(-15, 85);
        child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    });

    let s_firegirl_gems = this.physics.add.staticGroup();

    s_firegirl_gems.create(920, 85, 'purple_crystal').setSize(s_firegirl_gems.height, s_firegirl_gems.width, true);
    s_firegirl_gems.create(995, 85, 'purple_crystal').setSize(s_firegirl_gems.height, s_firegirl_gems.width, true);

    s_firegirl_gems.create(657, 330, 'purple_crystal').setSize(s_firegirl_gems.height, s_firegirl_gems.width, true);

    /* create collectible gems for waterboy */
    let m_waterboy_gems = this.physics.add.group({
        key: 'blue_crystal',
        repeat: 2,
        setXY: { x: 700, y: 550, stepX: 85 }
    });

    m_waterboy_gems.children.iterate(function (child) {
        child.body.setSize(-15, 85);
        child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    });


    /* obstacle animations here */
    let s_waterboy_gems = this.physics.add.staticGroup();

    s_waterboy_gems.create(220, 75, 'blue_crystal').setSize(s_waterboy_gems.height, s_waterboy_gems.width, true);

    s_waterboy_gems.create(595, 90, 'blue_crystal').setSize(s_waterboy_gems.height, s_waterboy_gems.width, true);

    /* FG and WB */

    this.firegirl = this.physics.add.sprite(100, 550, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height, this.firegirl.width, true);
    
    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);

    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    // game.camera.follow(player);

    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.waterboy = this.physics.add.sprite(150, 550, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);

    /* VARIOUS PHYSICS */

    this.physics.add.collider(m_firegirl_gems, platforms);
    this.physics.add.overlap(this.firegirl, m_firegirl_gems, collectGem, null, this);

    this.physics.add.overlap(this.firegirl, s_firegirl_gems, collectGem, null, this);

    this.physics.add.collider(m_waterboy_gems, platforms);
    this.physics.add.overlap(this.waterboy, m_waterboy_gems, collectGem, null, this);

    this.physics.add.overlap(this.waterboy, s_waterboy_gems, collectGem, null, this);

    this.physics.add.overlap(this.firegirl, purple_portal, null, this);
    this.physics.add.overlap(this.waterboy, blue_portal, null, this);

    
    cursors = this.input.keyboard.createCursorKeys();

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
        if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-375);
        if (this.firegirl.body.onFloor()) {
            this.firegirl.body.setVelocityY(-250);
            this.firegirl.body.setGravityY(275);
        }
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
        if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-375);
        if (this.waterboy.body.onFloor()) {
            this.waterboy.body.setVelocityY(-250);
            this.waterboy.body.setGravity(275);
        }
        this.waterboy.anims.play('w_jump', true);
    }
    if(!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }
}

function collectGem (player, gem) {
    gem.disableBody(true, true);
}