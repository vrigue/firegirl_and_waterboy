// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    parent: 'canvas',
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
    this.load.image('back', 'pictures/backdrops/sky.webp');
    this.load.image('sides', 'pictures/platforms/blue-purple-tall.jpg');
    this.load.image('ground', 'pictures/platforms/blue-purple-flat.jpg');
    this.load.image('tile', 'pictures/platforms/tile_go_brr.png');
    this.load.image('block', 'pictures/platforms/block_go_brr.png');

    // menu images
    this.load.image('sound_on', 'pictures/menu/vol_on.png');
    this.load.image('menu', 'pictures/menu/xmenu.png');
    this.load.image('reload', 'pictures/menu/reload.png');

    this.load.image('purple_crystal', 'pictures/purple_crystal.png');
    this.load.image('blue_crystal', 'pictures/blue_crystal.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.image('wind_plat', 'pictures/windBox.png');
    this.load.spritesheet('wind_effect', 'sprites/wind.png', { frameWidth: 115, frameHeight: 55 });

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

    // code to add platforms
    let platforms = this.physics.add.staticGroup();

    platforms.create(400, 700, 'ground').setScale(4).refreshBody();

    platforms.create(999, 306, 'sides').setScale(1).refreshBody();
    platforms.create(999, 435, 'sides').setScale(1).refreshBody();
    platforms.create(999, 575, 'sides').setScale(1).refreshBody();

    platforms.create(140, 100, 'sides').setScale(1).refreshBody();

    // for (let i = 450; i < 750; i+=90) {
    //     platforms.create(i, 260, 'tile').setScale(2).refreshBody();
    // }

    // platforms.create(600, 400, 'tile').setScale(2).refreshBody();

        // platforms making up the actual level
    platforms.create(966, 250, 'tile').setScale(2).refreshBody();
    for (let i = 0; i < 3; i++) {
        platforms.create(65 + i * 90, 500, 'tile').setScale(2).refreshBody();
    }

    // PORTALS
    let purple_portal = this.physics.add.sprite(1125, 575, 'purple_portal');
    purple_portal.setScale(0.29);
    purple_portal.body.stop();
    purple_portal.body.allowGravity = false;
    this.physics.add.collider(purple_portal, platforms);
    purple_portal.getBounds();
    purple_portal.body.setSize(50, 450);

    let blue_portal = this.physics.add.sprite(75, 100, 'blue_portal');
    blue_portal.setScale(0.22);
    blue_portal.body.stop();
    blue_portal.body.allowGravity = false;
    this.physics.add.collider(blue_portal, platforms);
    blue_portal.getBounds();
    blue_portal.body.setSize(50, 600);

    // WIND PLATFORMS
    this.firegirl_wind = this.physics.add.sprite(75, 475, 'wind_plat');
    this.firegirl_wind.setScale(0.15);
    this.firegirl_wind.body.stop();
    this.firegirl_wind.body.allowGravity = false;
    // WIND EFFECTS
    let firegirl_wind_whoosh = this.physics.add.sprite(75, 440, 'wind_effect').setScale(0.75);
    firegirl_wind_whoosh.body.allowGravity = false;
    firegirl_wind_whoosh.getBounds();
    firegirl_wind_whoosh.setSize(firegirl_wind_whoosh.width, firegirl_wind_whoosh.height, true);

        // WIND PLATFORMS
        this.fg_wind = this.physics.add.sprite(200, 475, 'wind_plat');
        this.fg_wind.setScale(0.15);
        this.fg_wind.body.stop();
        this.fg_wind.body.allowGravity = false;
        // WIND EFFECTS
        let fg_wind_whoosh = this.physics.add.sprite(200, 440, 'wind_effect').setScale(0.75);
        fg_wind_whoosh.body.allowGravity = false;
        fg_wind_whoosh.getBounds();
        fg_wind_whoosh.setSize(fg_wind_whoosh.width, fg_wind_whoosh.height, true);


    let right = this.add.sprite(1238, 700, 'sides').setScale(4);

    platforms.create(600, -37, 'ground').setScale(4);
    platforms.create(-40, 100, 'sides').setScale(4);
    platforms.create(-40, 600, 'sides').setScale(4);
    platforms.create(1238, 200, 'sides').setScale(4);
    platforms.create(600, 700, 'ground').setScale(4).refreshBody();
    let top = this.add.sprite(400, -37, 'ground').setScale(4);

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
        if (music.isPlaying) {
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
    reload.on('pointerdown', () => location.assign('level2.html'));
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
        frames: this.anims.generateFrameNumbers('firegirl', { start: 20, end: 25 }),
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

    /* WIND ANIMATIONS */
    this.anims.create({
        key: 'whoosh',
        frames: this.anims.generateFrameNumbers('wind_effect', { start: 0, end: 6 }),
        frameRate: 8,
        repeat: -1
    });
    firegirl_wind_whoosh.play('whoosh', true);
    fg_wind_whoosh.play('whoosh', true);


    /* obstacle animations here */

    this.firegirl = this.physics.add.sprite(100, 550, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height - 19, this.firegirl.width, true);
    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);

    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    // game.camera.follow(player);

    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.waterboy = this.physics.add.sprite(950, 50, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height - 19, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);

    // for ending
    this.physics.add.overlap(this.firegirl, purple_portal, test, null, this);
    this.physics.add.overlap(this.waterboy, blue_portal, test, null, this);

    // let firegirl_obstacles = this.physics.add.staticGroup();
    // firegirl_obstacles.create(400, 580, 'blue_fire');
    // let waterboy_obstacle = this.physics.add.staticGroup();
    // waterboy_obstacles.create(4500, 580, 'purple_fire');

    cursors = this.input.keyboard.createCursorKeys();
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); // reload button if we got time
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    let music = this.sound.add('bg');
    music.setLoop(true);
    music.play();

    function collectGem(player, gem) {
        gem.destroy(true); // better to get rid of it for clutter sake? -K
        gems_collected++; // keep track of for ending screen - K
    }

    function test(player, portal) {
        if ((this.physics.overlap(this.firegirl, purple_portal)) && (this.physics.overlap(this.waterboy, blue_portal))) {
            // bottom code will make things run smoothly, i.e. this function will not be called over and over again.
            // you can set this into a timed function maybe to play an animation first then go to next level.
            this.firegirl.disableBody(true, false);
            this.waterboy.disableBody(true, false);
            location.assign('level3.html');
        }
    }
}

function update() {
    // wind platform works with this:
    operate_wind(this.firegirl, this.firegirl_wind, 100);
    operate_wind(this.waterboy, this.firegirl_wind, 100);
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
        if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-500);
        this.firegirl.anims.play('f_jump', true);
    }
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
        if (this.firegirl.body.velocityX < 0) this.firegirl.anims.play('f_idle', true);
        else this.firegirl.anims.play('f_idle', true);
        this.firegirl.body.setVelocityX(0);
    }

    if (keyA.isDown) {
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
        if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-500);
        this.waterboy.anims.play('w_jump', true);
    }
    if (!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }

    function operate_wind(player, plat, y_to_stop_at) {
        if ((plat.x-25 < player.x && player.x < plat.x+25) && player.y < plat.y) {
            player.body.allowGravity = false;
            player.setBounce(0);
            player.body.setGravityY(0);
            player.setVelocityY(0);
            if (!(player.y < y_to_stop_at)) {player.y -= 5;}
            else {player.body.stop();}
        } else {
            player.body.allowGravity = true;
            player.setBounce(0.1);
            player.body.setGravityY(300);
        }
    }
}