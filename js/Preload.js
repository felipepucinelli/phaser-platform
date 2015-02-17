var Platform = Platform || {};

//loading the game assets
Platform.Preload = function(){};

Platform.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    // this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/images/tiles.png');
    this.load.spritesheet('player', 'assets/images/player.png', 16, 16);
    this.load.audio('jump', ['assets/audio/jump.wav']);
  },
  create: function() {
    this.state.start('Game');
  }
};