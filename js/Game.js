var Platform = Platform || {};
var pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };
var isMobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
var gameOver = false;
var getAllGems = false;

Platform.Game = function(){};

Platform.Game.prototype = {
  preload: function() {
    this.game.time.advancedTiming = true;  
  },

  create: function() {
    gameOver = false;
    getAllGems = false;
    
    /*
     * Background
     */

    this.bg = this.game.add.tileSprite(0, 0, 320, 160, 'bg');

    /*
     * Rain
     */

    // Add rain only in web browser, perf issues in old mobile devices
    if (!isMobile) {
      this.rain = this.game.add.emitter(this.game.world.centerX, 0, 400);

      this.rain.width = this.game.world.width;

      this.rain.makeParticles('rain');

      this.rain.minParticleScale = 0.1;
      this.rain.maxParticleScale = 0.5;

      this.rain.setYSpeed(300, 500);
      this.rain.setXSpeed(-5, 5);

      this.rain.minRotation = 0;
      this.rain.maxRotation = 0;

      this.rain.start(false, 1600, 5, 0);
    }

    /*
     * Score
     */
    
    this.score = 0;
    
    /*
     * Map
     */

    this.tilemap = this.game.add.tilemap('map');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset.
    this.tilemap.addTilesetImage('tiles', 'tiles');

    //create layers
    
    this.backgroundlayer = this.tilemap.createLayer('backgroundLayer');
    this.blockedLayer = this.tilemap.createLayer('blockedLayer');
    this.frontLayer = this.tilemap.createLayer('frontLayer');

    //collision on blockedLayer and frontLayer
    this.tilemap.setCollisionBetween(1, 100000, true, 'blockedLayer');
    this.tilemap.setCollisionBetween(1, 100000, true, 'frontLayer');

    //resizes the game world to match the layer dimensions.
    this.blockedLayer.resizeWorld();

    /*
     * Gems
     */

    this.gems = this.game.add.group();

    // Add gems in random position 
    for (var i = 0; i < 10; i++) {
      this.gems.create(this.game.world.randomX, this.game.world.randomY, 'gem', 0);
    }

    // Add gravity and kill the ones that are not in a visible area
    this.gems.forEach(function(gem) {
      this.game.physics.arcade.enable(gem);
      gem.anchor.setTo(0.5, 0.5);
      gem.body.gravity.y = 100;
      gem.animations.add('spin', [0, 1, 2, 3]);
      gem.play('spin', 10, true);
      gem.events.onOutOfBounds.add(this.gemOOB, this);
      gem.checkWorldBounds = true;
    }, this);

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

    //  Walk animation
    this.player.animations.add('walk', [0, 1, 2], 10, true);

    //  Center player sprite axis
    this.player.anchor.setTo(.5,.5);

    //  Get keybords
    this.cursors = this.game.input.keyboard.createCursorKeys();

    /*
     * Sounds
     */

    this.sounds = {
      jump: this.game.add.audio('jump'),
      gem: this.game.add.audio('gem'),
      bg: this.game.add.audio('bg'),
      death: this.game.add.audio('death')
    };

    this.sounds.bg.volume = 0.9;
    this.sounds.bg.loop = true;
    this.sounds.bg.play(); 

    /*
     * Mobile Game Controller
     */
    if (isMobile) {
      this.initGameController(); 
    };
  },
  
  update: function() {
    var _this = this;

    /*
     * Player
     */

    //  Collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, null, null, this);
    this.game.physics.arcade.collide(this.player, this.frontLayer, this.playerHitLava, null, this);
    this.game.physics.arcade.collide(this.player, this.gems, this.playerHitGem, null, this);
    this.game.physics.arcade.collide(this.gems, this.blockedLayer);

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    if (!isMobile) {
      if (this.cursors.left.isDown) {
        //  Move to the left and flip sprite
        this.player.scale.x = -1;
        this.player.body.velocity.x = -100;
        this.player.animations.play('walk');
      }
      else if (this.cursors.right.isDown) {
        //  Move to the right and flip sprite
        this.player.scale.x = 1;
        this.player.body.velocity.x = 100;
        this.player.animations.play('walk');
      }
      else {
        //  Stand still
        this.player.animations.stop();
        this.player.frame = 5;
      }
      
      //  Allow the player to jump if they are touching the ground.
      if (this.cursors.up.isDown && this.player.body.blocked.down) {
          this.player.body.velocity.y = -160;
          this.sounds.jump.play();
      }

      //  Show jumping frame when player is in the air
      if (this.cursors.up.isDown) {
        this.player.animations.stop();
        this.player.frame = 4;
      }
    }
  },

  playerHitLava: function(player, lava) {
    //if hits on the lava, die
    this.sounds.death.play();
    gameOver = true;
    this.sounds.bg.destroy();
    this.game.state.start('Game');
  },

  gemOOB: function(gem) {
    gem.kill();
  },

  playerHitGem: function(player, gem) {
    gem.kill();
    this.sounds.gem.play();
    this.score++;
    if (this.gems.countLiving() == 0) {
      getAllGems = true;
      // this.sounds.bg.destroy();
      // this.game.state.start('Game');
    }
  },

  init: function() {
    /*
     * Config for Pixel Perfect scaling 
     * http://www.photonstorm.com/phaser/pixel-perfect-scaling-a-phaser-game
     */

    //  Hide the un-scaled game canvas
    this.game.canvas.style['display'] = 'none';
  
    //  Create our scaled canvas. It will be the size of the game * whatever scale value you've set
    // pixel.canvas = Phaser.Canvas.create(this.game.width * pixel.scale, this.game.height * pixel.scale);

    //  Create our scaled canvas. Fullscreen mode without aspect ratio
    if (!isMobile) pixel.canvas = Phaser.Canvas.create(window.innerWidth, this.game.height * (window.innerHeight/this.game.height));

    //  Create our scaled canvas. Fullscreen mode with aspect ratio
    if (isMobile) pixel.canvas = Phaser.Canvas.create((window.innerHeight / (this.game.height / this.game.width)), window.innerHeight);
  
    //  Store a reference to the Canvas Context
    pixel.context = pixel.canvas.getContext('2d');
  
    //  Add the scaled canvas to the DOM
    Phaser.Canvas.addToDOM(pixel.canvas);
    pixel.canvas.setAttribute('id', 'scaled');
  
    //  Disable smoothing on the scaled canvas
    Phaser.Canvas.setSmoothingEnabled(pixel.context, false);
  
    //  Cache the width/height to avoid looking it up every render
    pixel.width = pixel.canvas.width;
    pixel.height = pixel.canvas.height;
  },

  render: function() {
    // this.game.debug.text(this.game.time.fps || '--', 5, 40, "#00ff00", "24px Courier");
    // this.game.debug.bodyInfo(this.player, 0, 80, "#00ff00");
    
    // This should not be here, I know.
    this.game.debug.text('Score:' + this.score, 172, 14, "#fff", "Courier");

    if (gameOver) this.game.debug.text('Don\'t hit the lava!', 50, 100, "#FFA000", "Courier");
    if (getAllGems) {
      this.game.debug.text('YOU GOT ALL GEMS!', 35, 50, "#0095CD", "16px Courier");
      this.game.debug.text('(EASIEST GAME EVER, I KNOW...)', 18, 60, "#0095CD", "11px Courier");
    }
    //  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
    pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
  },

  initGameController: function() {
    if(!GameController.hasInitiated) {
      var _this = this;     

      //  Stand still frame
      if (_this.player.body.velocity.x === 0) {
        this.player.frame = 5;
      };

      GameController.init({
        forcePerformanceFriendly: true,
        left: {
          type: 'dpad',
          position: { left: '30%', bottom: '20%' },
          dpad: {
            up: false,
            down: false,
            left: {
              width: '45%', height: '20%',
              touchMove: function() {
                _this.player.body.velocity.x = -100;
                _this.player.animations.play('walk');
              },
              touchStart: function() {
                _this.player.scale.x = -1;
                _this.player.animations.play('walk');
              },
              touchEnd: function() {
                _this.player.body.velocity.x = 0;
                _this.player.animations.stop('walk');
                _this.player.frame = 5;
              }
            },
            right: {
              width: '45%', height: '20%',
              touchMove: function() {
                _this.player.body.velocity.x = 100;
                _this.player.animations.play('walk');
              },
              touchStart: function() {
                _this.player.scale.x = 1;
                _this.player.animations.play('walk');
              },
              touchEnd: function() {
                _this.player.body.velocity.x = 0;
                _this.player.animations.stop('walk');
                _this.player.frame = 5;
              }
            }
          }
        },    
        right: {
            type: 'buttons',
            position: { right: '15%', bottom: '45%' },
            buttons: [
              {
                  label: 'jump',
                  fontSize: 15,
                  radius: 50,                  
                  touchStart: function() {
                    if (_this.player.body.blocked.down) {
                      _this.player.body.velocity.y = -160;
                      _this.player.animations.stop();
                      _this.player.frame = 4;
                      _this.sounds.jump.play();
                    };
                  },
                  touchEnd: function() {
                    _this.player.body.velocity.y = 0;
                    _this.player.frame = 5;
                  }
              },
              false, false, false
            ]
        }
      });
 
      GameController.hasInitiated = true;
    }
  },
};