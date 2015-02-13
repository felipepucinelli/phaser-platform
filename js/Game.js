var Plataform = Plataform || {};
var pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };

Plataform.Game = function(){};

Plataform.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;  
  },

  create: function() {
    /*
     * Map
     */

    this.tilemap = this.game.add.tilemap('map');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('tiles', 'tiles');

    //create layers
    this.backgroundlayer = this.tilemap.createLayer('backgroundLayer');
    this.blockedLayer = this.tilemap.createLayer('blockedLayer');

    //collision on blockedLayer
    this.tilemap.setCollisionBetween(1, 100000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions.
    this.backgroundlayer.resizeWorld();


    /*
     * Player
     */

    //  Create player
    this.player = this.game.add.sprite(50, 50, 'player');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    //  The camera will follow the player in the world.
    this.game.camera.follow(this.player);

    //  Our two animations, walking left and right.
    this.player.animations.add('right', [0, 1, 2], 10, true);
    this.player.animations.add('left', [3, 4, 5], 10, true);

    //  Get keybord.s
    this.cursors = this.game.input.keyboard.createCursorKeys();
  },
  
  update: function() {

    /*
     * Player
     */

    //  Collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -100;
      this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 100;
      this.player.animations.play('right');
    }
    else {
      //  Stand still
      this.player.animations.stop();
      // TODO: Check side player was moving before stopped to add the proper frame.
      this.player.frame = 8;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.body.velocity.y = -160;
        
        //  Stand still
        this.player.animations.stop();
        this.player.frame = 7;
    }

  },

  playerHit: function(player, blockedLayer) {
    // TODO
  },

  render: function() {
    this.game.debug.text(this.game.time.fps || '--', 10, 40, "#00ff00", "24px Courier");
    // this.game.debug.bodyInfo(this.player, 0, 80, "#00ff00");

    //  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
    pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
  },

  init: function() {
    //  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
 
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    pixel.canvas = Phaser.Canvas.create(this.game.width * pixel.scale, this.game.height * pixel.scale);
 
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
 
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas);
 
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
 
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
  }
};