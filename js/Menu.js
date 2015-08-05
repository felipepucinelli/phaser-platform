var Platform = Platform || {};

// adding the menu
Platform.Menu = function (game) { };

Platform.Menu.prototype = {
    create: function() {
        this.menuBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menu-bg');
        this.menuBg.anchor.setTo(0.5);
    },

    init: function() {
      /*
       * Config for Pixel Perfect scaling 
       * http://www.photonstorm.com/phaser/pixel-perfect-scaling-a-phaser-game
       */

      //  Hide the un-scaled game canvas
      this.game.canvas.style['display'] = 'none';

      //  Create our scaled canvas. Fullscreen mode with aspect ratio
      pixel.canvas = Phaser.Canvas.create((window.innerHeight / (this.game.height / this.game.width)), window.innerHeight);
    
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
      //  Every loop we need to render the un-scaled game canvas to the displayed scaled canvas:
      pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, pixel.width, pixel.height);
    },

    update: function() {
        this.game.input.keyboard.onDownCallback = function() {
            if (this.game.input.keyboard.event.keyCode === 13) {
                    this.game.state.start('Game');
            };   
        };
    }
};
