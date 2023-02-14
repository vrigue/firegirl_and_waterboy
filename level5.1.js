var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
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
var m_waterboy_gems;
var s_waterboy_gems;

const num_gems = 11;
var gems_collected = 0;

var firegirl;
var firegirl_obstacles;
var m_firegirl_gems;
var s_firegirl_gems;

var purple_portal;
var firegirl_home = false;
var blue_portal;
var waterboy_home = false;

var platforms;
var obstacles;

var cursors;
var jumpButton;
let keyA;
let keyS;
let keyD;
let keyW;

var game = new Phaser.Game(config);
var m = 0;

function preload() {
    /* loaded images for the background, platforms, obstacles, and portals */
    this.load.image('back', 'pictures/sky.webp');
    // menu images
    this.load.image('sound_on', 'pictures/menu/vol_on.png');
    this.load.image('menu', 'pictures/menu/xmenu.png');
    this.load.image('reload', 'pictures/menu/reload.png');

    this.load.image('ground', 'pictures/blue-purple-flat.jpg');
    this.load.image('tile', 'pictures/new_tiles.png');
    this.load.image('block', 'pictures/block_go_brr.png');

    this.load.image('sides', 'pictures/blue-purple-tall.jpg');
    this.load.image('purple_crystal', 'pictures/purple_crystal.png');
    this.load.image('blue_crystal', 'pictures/blue_crystal.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_obstacle', 'sprites/purple_fire.png', { frameWidth: 54, frameHeight: 54 });
    this.load.spritesheet('blue_obstacle', 'sprites/blue_water.png', { frameWidth: 65, frameHeight: 73});
    this.load.spritesheet('green_obstacle', 'sprites/green_fire.png', { frameWidth: 52, frameHeight: 52 });

    /* loaded spritesheets for this.firegirl */
    this.load.spritesheet('firegirl', 'sprites/pink.png', { frameWidth: 55, frameHeight: 55 });
    
    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/blue.png', { frameWidth: 55, frameHeight: 55 });

    this.load.audio('bg', 'audio/bg.mp3');
}

function create() {
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);

    /* MENU */ 
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
    reload.on('pointerdown', () => location.assign('level5.html'));
    reload.on('pointerover', () => reload.setTint(0xcccccc));
    reload.on('pointerout', () => reload.setTint(0xffffff));

    /* PLATFORMS */
    let platforms = this.physics.add.staticGroup();
    platforms.create(800, 200, 'sides').setScale(1).refreshBody();

    // // smol platform
    for (let i = 570; i < 790; i+=50) {
        platforms.create(i, 265, 'tile').setScale(2).refreshBody();
    }

    for (let i = 570; i < 790; i+=50) {
        platforms.create(i, 143, 'tile').setScale(2).refreshBody();
    }

    platforms.create(840, 220, 'tile').setScale(2).refreshBody();


    /* chunky platform */
    platforms.create(220, 610, 'block').setScale(2.5).refreshBody();

    platforms.create(420, 525, 'block').setScale(2.5).refreshBody();

    platforms.create(620, 475, 'block').setScale(2.5).refreshBody();

    platforms.create(820, 425, 'block').setScale(2.5).refreshBody();

    platforms.create(1020, 350, 'block').setScale(2.5).refreshBody();



    /* leads to blue portal */
    for (let i = 0; i < 275; i += 89) {
        platforms.create(i, 300, 'tile').setScale(2).refreshBody();
    }


    // platforms.create(400, 700, 'block').setScale(4);

    let right = this.add.sprite(1238, 700, 'sides').setScale(4);
    platforms.create(600, -37, 'ground').setScale(4);
    platforms.create(-40, 100, 'sides').setScale(4);
    platforms.create(-40, 600, 'sides').setScale(4);
    platforms.create(1238, 200, 'sides').setScale(4);
    platforms.create(600, 700, 'ground').setScale(4).refreshBody();



    /* PORTALS */
    let purple_portal = this.physics.add.sprite(650, 150, 'purple_portal');
    purple_portal.setScale(0.21);
    this.physics.add.collider(purple_portal, platforms);
    purple_portal.getBounds();
    purple_portal.body.setSize(50, 450);

    let blue_portal = this.physics.add.sprite(725, 150, 'blue_portal');
    blue_portal.setScale(0.15);
    this.physics.add.collider(blue_portal, platforms);
    blue_portal.getBounds();
    blue_portal.body.setSize(50, 600);

    
    // game.time.desiredFps = 30;
    

    /* FG and WB ANIMATIONS */

    /* create animations for this.firegirl */
    this.anims.create({
        key: 'f_idle',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 0, end: 3 }),
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
        key: 'f_death',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 4, end: 11 }),
        frameRate: 10
    });
    this.anims.create({
        key: 'f_portal',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 32, end:33 }),
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
        frames: this.anims.generateFrameNumbers('waterboy', { start: 32, end:33 }),
        frameRate: 10,
        repeat: -1
    });


    /* GEMS */

    /* create collectible gems for firegirl */
    let m_firegirl_gems = this.physics.add.group({
        key: 'purple_crystal',
        repeat: 2,
        setXY: { x: 400, y: 550, stepX: 85 }
    });

    m_firegirl_gems.children.iterate(function (child) {
        child.body.setSize(-25, 50);
        child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    });

    let s_firegirl_gems = this.physics.add.staticGroup();

    s_firegirl_gems.create(220, 525, 'purple_crystal').setSize(-25, 51, true);
    s_firegirl_gems.create(995, 185, 'purple_crystal').setSize(-25, 51, true);
    s_firegirl_gems.create(700, 100, 'purple_crystal').setSize(-25, 51, true);

    s_firegirl_gems.create(100, 250, 'purple_crystal').setSize(-25, 51, true);

    /* create collectible gems for waterboy */
    let m_waterboy_gems = this.physics.add.group({
        key: 'blue_crystal',
        repeat: 2,
        setXY: { x: 700, y: 550, stepX: 85 }
    });

    m_waterboy_gems.children.iterate(function (child) {
        child.body.setSize(-25, 50);
        child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    });

    let s_waterboy_gems = this.physics.add.staticGroup();

    s_waterboy_gems.create(150, 250, 'blue_crystal').setSize(-25, 51, true);


    // s_waterboy_gems.create(587, 240, 'blue_crystal').setSize(-25, 51, true);


    /* OBSTACLES */

    this.anims.create({
        key: 'w_obstacle',
        frames: this.anims.generateFrameNumbers('purple_obstacle', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.waterboy_obstacles = this.physics.add.group({
        key: 'w_obstacle',
        repeat: 2,
        setXY: { x: 700, y: 150, stepX: 20 }
    });

    this.waterboy_obstacles.children.iterate(function (child) {
        child.setScale(1.2);
        child.width = 35;
        child.height = 55;
        child.setSize(child.width, child.height, true);
    });

    this.anims.create({
        key: 'f_obstacle',
        frames: this.anims.generateFrameNumbers('blue_obstacle', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.firegirl_obstacles = this.physics.add.group({
        key: 'f_obstacle',
        repeat: 1,
        setXY: { x: 637, y: 400, stepX: 45 }
    });

    this.firegirl_obstacles.children.iterate(function (child) {
        child.setScale(1);
        child.width = 55;
        child.height = 72;
        child.setSize(child.width, child.height, true);
    });

    this.anims.create({
        key: 'obstacle',
        frames: this.anims.generateFrameNumbers('green_obstacle', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.obstacles = this.physics.add.group({
        key: 'obstacle',
        repeat: 2,
        setXY: { x: 220, y: 150, stepX: 25 },
    });

    this.obstacles.children.iterate(function (child) {
        child.setScale(1.5);
        child.width = 37;
        child.height = 53;
        child.setSize(child.width, child.height, true);
    });

    /* FG and WB */

    this.firegirl = this.physics.add.sprite(100, 550, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height - 19, this.firegirl.width, true);
    
    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);

    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    // game.camera.follow(player);

    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.waterboy = this.physics.add.sprite(145, 550, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height - 19, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);

    /* VARIOUS PHYSICS */

    this.physics.add.collider(this.firegirl_obstacles, platforms);
    this.physics.add.collider(this.waterboy_obstacles, platforms);
    this.physics.add.collider(this.obstacles, platforms);

    /* checks for touching gems */
    this.physics.add.collider(m_firegirl_gems, platforms);
    this.physics.add.overlap(this.firegirl, m_firegirl_gems, collectGem, null, this);
    this.physics.add.overlap(this.firegirl, s_firegirl_gems, collectGem, null, this);

    this.physics.add.collider(m_waterboy_gems, platforms);
    this.physics.add.overlap(this.waterboy, m_waterboy_gems, collectGem, null, this);
    this.physics.add.overlap(this.waterboy, s_waterboy_gems, collectGem, null, this);

    /* checking for obstacle collision */
    this.physics.add.overlap(this.firegirl, this.firegirl_obstacles, touchWater, null, this);
    this.physics.add.overlap(this.waterboy, this.waterboy_obstacles, touchFire, null, this);

    this.physics.add.overlap(this.firegirl, this.obstacles, touchObstacle, null, this);
    this.physics.add.overlap(this.waterboy, this.obstacles, touchObstacle, null, this);

    /* checking for portal collision */
    this.physics.add.overlap(this.firegirl, purple_portal, enterPortal, null, this);
    this.physics.add.overlap(this.waterboy, blue_portal, enterPortal, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    refreshButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    let music = this.sound.add('bg');
    music.setLoop(true);
    music.play();

    function collectGem (player, gem) {
        gem.destroy(true); // better to get rid of it for clutter sake? -K
        gems_collected++; // keep track of for ending screen - K
    }

    function touchWater () {
        this.firegirl.anims.play('f_death', true);
        this.firegirl.physics.disableBody(true, false);
    }

    function touchFire () {
        this.waterboy.anims.play('w_death', true);
        this.waterboy.physics.disableBody(true, false);
    }

    function touchObstacle (player) {
        if (player === this.firegirl) {
            this.firegirl.anims.play('f_death', true);
        } else if (player === this.waterboy) {
            this.waterboy.anims.play('w_death', true);
        }
        player.disableBody(true, false);
    }

    function enterPortal() {
        if ((this.physics.overlap(this.firegirl, purple_portal)) && (this.physics.overlap(this.waterboy, blue_portal))) {
            // bottom code will make things run smoothly, i.e. this function will not be called over and over again.
            // you can set this into a timed function maybe to play an animation first then go to next level.
            this.firegirl.disableBody(true, false);
            this.waterboy.disableBody(true, false);
            location.assign('index.html');
        }
    }
}

function update() {
    this.firegirl_obstacles.children.iterate(function (child) {
        child.anims.play('f_obstacle', true);
    });

    this.waterboy_obstacles.children.iterate(function (child) {
        child.anims.play('w_obstacle', true);
    });

    this.obstacles.children.iterate(function (child) {
        child.anims.play('obstacle', true);
    });

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
        // if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-375);
        if (this.firegirl.body.onFloor()) {
            this.firegirl.body.setVelocityY(-400);
            this.firegirl.body.setGravityY(250);
        }
        this.firegirl.anims.play('f_jump', true);
    }
    if(!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
        if (this.firegirl.body.velocityX < 0) this.firegirl.anims.play('f_idle', true);
        else this.firegirl.anims.play('f_idle', true);
        this.firegirl.body.setVelocityX(0);
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
        // if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-375);
        if (this.waterboy.body.onFloor()) {
            this.waterboy.body.setVelocityY(-350);
            this.waterboy.body.setGravityY(275);
        }
        this.waterboy.anims.play('w_jump', true);
    }
    if(!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }  
}