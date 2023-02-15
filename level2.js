// when game initially loads, run the following?
var config = { // defines the config for the game 
    type: Phaser.AUTO, // tries WebGL, falls back to canvas otherwise
    width: 1200, // centering
    height: 660,
    parent: 'canvas',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
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

const num_gems = 11;
var gems_collected = 0;

var firegirl;

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

    this.load.image('purple_block', 'pictures/push_block.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_obstacle', 'sprites/purple_fire2.png', { frameWidth: 43.3, frameHeight: 54 });
    this.load.spritesheet('blue_obstacle', 'sprites/blue_water.png', { frameWidth: 64.4, frameHeight: 73 });
    this.load.spritesheet('green_obstacle', 'sprites/green_fire.png', { frameWidth: 52, frameHeight: 52 });

    this.load.spritesheet('purple_gem', 'sprites/purple_crystal.png', { frameWidth: 60, frameHeight: 60 });
    this.load.spritesheet('blue_gem', 'sprites/blue_crystal.png', { frameWidth: 60, frameHeight: 60 });

    this.load.image('wind_plat', 'pictures/windBox.png');
    this.load.spritesheet('wind_effect', 'sprites/wind.png', { frameWidth: 115, frameHeight: 55 });

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

    platforms.create(600, 400, 'tile').setScale(2).refreshBody();

    // platforms making up the actual level
    platforms.create(966, 250, 'tile').setScale(2).refreshBody();
    for (let i = 0; i < 3; i++) {
        platforms.create(65 + i * 90, 500, 'tile').setScale(2).refreshBody();
    }

    // PORTALS
    this.purple_portal = this.physics.add.sprite(1125, 575, 'purple_portal');
    this.purple_portal.setScale(0.29);
    this.purple_portal.body.stop();
    this.purple_portal.body.allowGravity = false;
    this.physics.add.collider(this.purple_portal, platforms);
    this.purple_portal.getBounds();
    this.purple_portal.body.setSize(50, 450);

    this.blue_portal = this.physics.add.sprite(75, 100, 'blue_portal');
    this.blue_portal.setScale(0.22);
    this.blue_portal.body.stop();
    this.blue_portal.body.allowGravity = false;
    this.physics.add.collider(this.blue_portal, platforms);
    this.blue_portal.getBounds();
    this.blue_portal.body.setSize(50, 600);

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
    this.fg_wind = this.physics.add.sprite(825, 625, 'wind_plat');
    this.fg_wind.setScale(0.15);
    this.fg_wind.body.stop();
    this.fg_wind.body.allowGravity = false;

    // WIND EFFECTS
    let fg_wind_whoosh = this.physics.add.sprite(825, 590, 'wind_effect').setScale(0.75);
    fg_wind_whoosh.body.allowGravity = false;
    fg_wind_whoosh.getBounds();
    fg_wind_whoosh.setSize(fg_wind_whoosh.width, fg_wind_whoosh.height, true);

    this.anims.create({
        key: 'f_gem',
        frames: this.anims.generateFrameNumbers('purple_gem', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    /* create collectible gems for firegirl */
    this.firegirl_gems = this.physics.add.staticGroup({
        key: 'f_gem',
        repeat: 2,
        // setXY: { x: 400, y: 590, stepX: 85 }
    });

    this.firegirl_gems.children.iterate(function (child) {
        child.setSize(-25, 45, true);
    });

    this.firegirl_gems.create(175, 450, 'purple_crystal').setSize(-25, 45, true);
    this.firegirl_gems.create(825, 200, 'purple_crystal').setSize(-25, 45, true);


    this.anims.create({
        key: 'w_gem',
        frames: this.anims.generateFrameNumbers('blue_gem', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    /* create collectible gems for waterboy */
    this.waterboy_gems = this.physics.add.staticGroup({
        key: 'w_gem',
        repeat: 2,
        // setXY: { x: 675, y: 590, stepX: 85 }
    });

    this.waterboy_gems.create(220, 450, 'blue_crystal').setSize(-25, 45, true);
    this.waterboy_gems.create(600, 350, 'blue_crystal').setSize(-25, 45, true);
    this.waterboy_gems.create(1000, 200, 'blue_crystal').setSize(-25, 45, true);

    this.waterboy_gems.children.iterate(function (child) {
        child.setSize(-25, 45, true);
    });


    /* OBSTACLES */

    this.anims.create({
        key: 'w_obstacle',
        frames: this.anims.generateFrameNumbers('purple_obstacle', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.waterboy_obstacles = this.physics.add.staticGroup({
        key: 'w_obstacle',
        repeat: 2,
        // setXY: { x: 640, y: 450, stepX: 20 }
    });

    this.waterboy_obstacles.children.iterate(function (child) {
        child.setScale(1.3);
        child.width = 25;
        child.height = 10;
        child.setSize(child.width, child.height, true);
    });

    this.anims.create({
        key: 'f_obstacle',
        frames: this.anims.generateFrameNumbers('blue_obstacle', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.firegirl_obstacles = this.physics.add.staticGroup({
        key: 'f_obstacle',
        repeat: 1,
        // setXY: { x: 564, y: 212, stepX: 45 }
    });

    this.firegirl_obstacles.children.iterate(function (child) {
        child.setScale(1);
        child.width = 25;
        child.height = 10;
        child.setSize(child.width, child.height, true);
    });

    this.anims.create({
        key: 'obstacle',
        frames: this.anims.generateFrameNumbers('green_obstacle', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.obstacles = this.physics.add.staticGroup({
        key: 'obstacle',
        repeat: 2,
        // setXY: { x: 1050, y: 505, stepX: 25 }
    });

    this.obstacles.children.iterate(function (child) {
        child.setScale(1.3);
        child.width = 23;
        child.height = 10;
        child.setSize(child.width, child.height, true);
    });

    /* POP UP */

    this.game_over = this.physics.add.sprite(600, 330, 'game_over').setScale(0.5);
    this.physics.add.collider(this.game_over, platforms);
    this.game_over.setVisible(false);


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

    let score_text = this.add.text(685, 38, 'Score: 0', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.45);
   
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
    this.anims.create({
        key: 'f_portal',
        frames: this.anims.generateFrameNumbers('firegirl', { start: 36, end: 37 }),
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
    this.anims.create({
        key: 'w_portal',
        frames: this.anims.generateFrameNumbers('waterboy', { start: 36, end: 37 }),
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

    this.waterboy = this.physics.add.sprite(950, 50, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height - 19, this.waterboy.width, true);

    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);

    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);

    cursors = this.input.keyboard.createCursorKeys();
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R); // reload button if we got time
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    let music = this.sound.add('bg');
    music.setLoop(true);
    music.play();


    /* VARIOUS PHYSICS */

    /* checking for gem collision */
    this.physics.add.overlap(this.firegirl, this.firegirl_gems, collectGem, null, this);
    this.physics.add.overlap(this.waterboy, this.waterboy_gems, collectGem, null, this);

    /* checking for obstacle collision */
    this.physics.add.overlap(this.firegirl, this.firegirl_obstacles, touchObstacle, null, this);
    this.physics.add.overlap(this.waterboy, this.waterboy_obstacles, touchObstacle, null, this);
    this.physics.add.overlap(this.firegirl, this.obstacles, touchObstacle, null, this);
    this.physics.add.overlap(this.waterboy, this.obstacles, touchObstacle, null, this);

    /* checking for portal collision */
    this.physics.add.overlap(this.firegirl, this.purple_portal, enterPortal, null, this);
    this.physics.add.overlap(this.waterboy, this.blue_portal, enterPortal, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    refreshButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    function collectGem (player, gem) {
        gem.destroy(true); // better to get rid of it for clutter sake? -K
        gems_collected++; // keep track of for ending screen - K

        score_text.setText('Score: ' + gems_collected * 70);
    }
    function disableBodies () {
        this.firegirl.disableBody(true, false);
        this.waterboy.disableBody(true, false);
    }

    function nextLevel () {
        location.assign('level3.html');
    }

    function touchObstacle () {
        this.time.addEvent({
            delay : 800,
            callback : disableBodies
        });
    }

    function enterPortal() {
        if ( (this.physics.overlap(this.firegirl, this.purple_portal)) && (this.physics.overlap(this.waterboy, this.blue_portal))) {
            this.time.addEvent({
                delay : 2000,
                callback : nextLevel
            });
        }
    }
}

function update() {
    // wind platform works with this:
    operate_wind(this.firegirl, this.firegirl_wind, 100);
    operate_wind(this.waterboy, this.firegirl_wind, 100);
    operate_wind(this.firegirl, this.fg_wind, 100);
    operate_wind(this.waterboy, this.fg_wind, 100);
    
    if (cursors.left.isDown) {
        this.firegirl.body.setVelocityX(-200);
        this.firegirl.flipX = true;
        if (!(this.firegirl.body.onFloor())) this.firegirl.anims.play('f_jump', true);
        else if ( (this.physics.overlap(this.firegirl, this.purple_portal)) ) {
            this.firegirl.body.setVelocityX(0);
            this.firegirl.anims.play('f_portal', true);
        } 
        else this.firegirl.anims.play('f_run', true);
    }
    else if (cursors.right.isDown) {
        this.firegirl.body.setVelocityX(200);
        this.firegirl.flipX = false;
        if (!(this.firegirl.body.onFloor())) this.firegirl.anims.play('f_jump', true);
        else if ( (this.physics.overlap(this.firegirl, this.purple_portal)) ) {
            this.firegirl.body.setVelocityX(0);
            this.firegirl.anims.play('f_portal', true);
        } 
        else this.firegirl.anims.play('f_run', true);
    }
    if (cursors.up.isDown) {
        if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-500);
        else if ( (this.physics.overlap(this.firegirl, this.purple_portal)) ) {
            this.firegirl.body.setVelocityY(0);
            this.firegirl.anims.play('f_portal', true);
        } 
        this.firegirl.anims.play('f_jump', true);
    }
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown) {
        if (this.firegirl.body.velocityX < 0) this.firegirl.anims.play('f_idle', true);
        else if ( (this.physics.overlap(this.firegirl, this.purple_portal)) ) {
            this.firegirl.anims.play('f_portal', true);
        } 
        else this.firegirl.anims.play('f_idle', true);
        this.firegirl.body.setVelocityX(0);
    }

    if (keyA.isDown) {
        this.waterboy.body.setVelocityX(-200);
        this.waterboy.flipX = true;
        if (!(this.waterboy.body.onFloor())) this.waterboy.anims.play('w_jump', true);
        else if ( (this.physics.overlap(this.waterboy, this.blue_portal)) ) {
            this.waterboy.body.setVelocityX(0);
            this.waterboy.anims.play('w_portal', true);
        } 
        else this.waterboy.anims.play('w_run', true);
    }
    else if (keyD.isDown) {
        this.waterboy.body.setVelocityX(200);
        this.waterboy.flipX = false;
        if (!(this.waterboy.body.onFloor())) this.waterboy.anims.play('w_jump', true);
        else if ( (this.physics.overlap(this.waterboy, this.blue_portal)) )  {
            this.waterboy.body.setVelocityX(0);
            this.waterboy.anims.play('w_portal', true);
        } 
        else this.waterboy.anims.play('w_run', true);
    }
    if (keyW.isDown) {
        if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-500);
        else if ( (this.physics.overlap(this.waterboy, this.blue_portal)) )  {
            this.waterboy.body.setVelocityY(0);
            this.waterboy.anims.play('w_portal', true);
        } 
        this.waterboy.anims.play('w_jump', true);
    }
    if (!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else if ( (this.physics.overlap(this.waterboy, this.blue_portal)) )  {
            this.waterboy.anims.play('w_portal', true);
        } 
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }

    function operate_wind(player, plat, y_to_stop_at) {
        if ((plat.x - 25 < player.x && player.x < plat.x + 25) && player.y < plat.y) {
            player.body.allowGravity = false;
            player.setBounce(0);
            player.body.setGravityY(0);
            player.setVelocityY(0);
            if (!(player.y < y_to_stop_at)) { player.y -= 5; }
            else { player.body.stop(); }
        } else {
            player.body.allowGravity = true;
            player.setBounce(0.1);
            player.body.setGravityY(300);
        }
    }
}