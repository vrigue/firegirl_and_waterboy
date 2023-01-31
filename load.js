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



    firegirl = this.physics.add.sprite(400, 200, 'firegirl');
    firegirl.body.setSize(firegirl.height, firegirl.width, true);

    firegirl.setBounce(0.1);
    firegirl.body.setGravityY(300);

    firegirl.setCollideWorldBounds(true); // reason why we don't need platforms lining the top and sides - K
    this.physics.add.collider(firegirl, platforms);
    // this.physics.add.collider(fireboy, platforms);

    // potentially use to make camera follow player around - aj
    // game.camera.follow(player); // to respond to aj, prob not needed fora long time - k

    // this.physics.startSystem(Phaser.Physics.ARCADE);
    
    cursors = this.input.keyboard.createCursorKeys();

    // cursors = game.input.keyboard.createCursorKeys();
    // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    // should be covering basic left right movement + jumping - aj

    // not sure if this is doing anything (?) - vri
    // this.physics.arcade.collide(watergirl, platforms); 

    // watergirl.body.velocity.x = 0;

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
        //firegirl.body.setVelocityY(0);
    }



    //if (cursors.left.isDown) {
        //firegirl.setVelocityX(-160);
        // firegirl.body.velocity.x = -150;
        //firegirl.anims.play('firegirl_left', true);
    //}
    //else if (cursors.right.isDown) {
        // firegirl.body.velocity.x = 150;
        //firegirl.setVelocityX(160);
        //firegirl.anims.play('firegirl_right', true);
    //}
    //else {
        //firegirl.setVelocityX(0);
        //firegirl.anims.play('firegirl_idle');
    //}

    //if (cursors.up.isDown && firegirl.body.touching.down) {
        //firegirl.setVelocityY(-330);
        //firegirl.anims.play('firegirl_jump', true)
    //}
    // if (jumpButton.isDown && watergirl.body.onFloor() && game.time.now > jumpTimer) {
    //     watergirl.body.velocity.y = -250;
    //     jumpTimer = game.time.now + 750;
    // }
}