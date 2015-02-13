var Platform = Platform || {};

Platform.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Platform.Boot.prototype = {
  preload: function() {
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');

    this.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/images/tiles.png');
  },
  create: function() {
    //loading screen will have a white background
    this.game.stage.backgroundColor = '#fff';

    /*
     * Crappy scaling options
     */

    //scaling options
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    // this.scale.setScreenSize(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  
    this.state.start('Preload');
  }
};