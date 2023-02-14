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
        mode: Phaser.Scale.RESIZE,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    audio: {
        disableWebAudio: true
    }
};

// game.scale.pageAlignHorizontally = true;

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
    /* loaded images for the background, platforms, portals, and obstacles */
    this.load.image('back', 'pictures/backdrops/sky.webp');
    this.load.image('ground', 'pictures/platforms/blue-purple-flat.jpg');
    this.load.image('sides', 'pictures/platforms/blue-purple-tall.jpg');
    this.load.image('title', 'pictures/menu/title.png');
    this.load.image('block', 'pictures/platforms/tile_go_brr.png');

    this.load.image('play_button', 'pictures/menu/play1.png');
    this.load.image('sound_on', 'pictures/menu/vol_on.png');
    this.load.image('sound_off', 'pictures/menu/mute.png');
    this.load.image('menu', 'pictures/menu/xmenu.png');
    this.load.image('reload', 'pictures/menu/reload.png');

    this.load.image('purple_portal', 'pictures/purple_portal.png');
    this.load.image('blue_portal', 'pictures/blue_portal.png');

    this.load.spritesheet('purple_fire', 'sprites/purple_fire.png', { frameWidth: 55, frameHeight: 55 });
    this.load.spritesheet('blue_fire', 'sprites/blue_fire.png', { frameWidth: 10, frameHeight: 35 });

    /* loaded spritesheets for this.firegirl */
    this.load.spritesheet('firegirl', 'sprites/pink.png', { frameWidth: 55, frameHeight: 55 });

    /* loaded spritesheets for waterboy */
    this.load.spritesheet('waterboy', 'sprites/blue.png', { frameWidth: 55, frameHeight: 55 });

    this.load.audio('bg', 'audio/bg.mp3');
}

function create() {
    let music = this.sound.add('bg');
    music.setLoop(true);
    music.play();
    
    this.add.image(600, 330, 'back').setScale(1.45).setOrigin(.5, .5);

    /* create platforms */
    let platforms = this.physics.add.staticGroup();
    // landing platforms for firegirl and waterboy
    platforms.create(300, 540, 'block').setScale(2.5).refreshBody();
    platforms.create(900, 540, 'block').setScale(2.5).refreshBody();
    platforms.create(400, 700, 'ground').setScale(4).refreshBody();
    platforms.create(800, 700, 'ground').setScale(4).refreshBody();

    let left = this.add.sprite(-40, 200, 'sides').setScale(4);
    let left2 = this.add.sprite(-40, 700, 'sides').setScale(4);
    let right = this.add.sprite(1238, 200, 'sides').setScale(4);
    let right2 = this.add.sprite(1238, 700, 'sides').setScale(4);
    let top = this.add.sprite(500, -37, 'ground').setScale(4);
    let top2 = this.add.sprite(900, -37, 'ground').setScale(4);

    /* PORTALS */
    let purple_portal = this.physics.add.sprite(200, 475, 'purple_portal');
    purple_portal.setScale(0.29);
    purple_portal.body.stop();
    purple_portal.body.allowGravity = false;
    this.physics.add.collider(purple_portal, platforms);
    purple_portal.getBounds();
    purple_portal.body.setSize(50, 450);

    let blue_portal = this.physics.add.sprite(1000, 475, 'blue_portal');
    blue_portal.body.stop();
    blue_portal.body.allowGravity = false;
    blue_portal.setScale(0.22);
    this.physics.add.collider(blue_portal, platforms);
    blue_portal.getBounds();
    blue_portal.body.setSize(50, 600);

    this.title = this.add.image(600, 200, 'title');
    this.title.setScale(0.5);

    this.add.text(270, 360, 'W: Jump', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);
    this.add.text(270, 380, 'A: Left', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);
    this.add.text(270, 400, 'D: Right', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);

    this.add.text(865, 360, '⬆: Jump', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);
    this.add.text(865, 380, '⬅: Left', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);
    this.add.text(865, 400, '➡: Right', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setScale(1.2);
    
    let play = this.add.image(600, 400, 'play_button');
    play.setInteractive();
    play.on('pointerdown', () => location.assign('level1.html'));
    play.on('pointerover', () => play.setTint(0xcccccc));
    play.on('pointerout', () => play.setTint(0xffffff));

    let menu_button = this.add.image(1125, 50, 'menu');
    this.add.text(1105, 70, 'levels', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    menu_button.setScale(2.5);
    menu_button.setInteractive();
    menu_button.on('pointerdown', () => location.assign('level_list.html'));
    menu_button.on('pointerover', () => menu_button.setTint(0xcccccc));
    menu_button.on('pointerout', () => menu_button.setTint(0xffffff));
    
    let vol = this.add.image(1050, 50, 'sound_on');
    this.add.text(1023, 70, 'volume', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
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

    this.add.text(490, 225, 'Make them go to their portals!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'}).setColor("#ffffff");

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

    this.firegirl = this.physics.add.sprite(900, 50, 'firegirl');
    this.firegirl.getBounds();
    this.firegirl.body.setSize(this.firegirl.height-19, this.firegirl.width, true);
    this.firegirl.setBounce(0.1);
    this.firegirl.body.setGravityY(300);
    this.firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(this.firegirl, platforms);

    this.waterboy = this.physics.add.sprite(300, 200, 'waterboy');
    this.waterboy.getBounds();
    this.waterboy.body.setSize(this.waterboy.height - 19, this.waterboy.width, true);
    this.waterboy.setBounce(0.1);
    this.waterboy.body.setGravityY(300);
    this.waterboy.setCollideWorldBounds(true);
    this.physics.add.collider(this.waterboy, platforms);
    this.waterboy.flipX = true;
    
    cursors = this.input.keyboard.createCursorKeys();

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // for moving to level 1
    this.physics.add.overlap(this.firegirl, purple_portal, test, null, this);
    this.physics.add.overlap(this.waterboy, blue_portal, test, null, this);

    function test(player, portal) {
        if ((this.physics.overlap(this.firegirl, purple_portal)) && (this.physics.overlap(this.waterboy, blue_portal))) {
            // bottom code will make things run smoothly, i.e. this function will not be called over and over again.
            // you can set this into a timed function maybe to play an animation first then go to next level.
            this.firegirl.disableBody(true, false);
            this.waterboy.disableBody(true, false);
            location.assign('level1.html');
        }
    }
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
        if (this.firegirl.body.onFloor()) this.firegirl.body.setVelocityY(-400);
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
        if (this.waterboy.body.onFloor()) this.waterboy.body.setVelocityY(-400);
        this.waterboy.anims.play('w_jump', true);
    }
    if(!keyA.isDown && !keyD.isDown && !keyW.isDown) {
        if (this.waterboy.body.velocityX < 0) this.waterboy.anims.play('w_idle', true);
        else this.waterboy.anims.play('w_idle', true);
        this.waterboy.body.setVelocityX(0);
    }

}