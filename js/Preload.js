var Plataform = Plataform || {};

//loading the game assets
Plataform.Preload = function(){};

Plataform.Preload.prototype = {
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
  },
  create: function() {
    this.state.start('Game');
  }
};