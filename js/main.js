var Platform = Platform || {};

// Platform.game = new Phaser.Game(746, 420, Phaser.AUTO, '');
Platform.game = new Phaser.Game(240, 140, Phaser.CANVAS, '');

Platform.game.state.add('Boot', Platform.Boot);
Platform.game.state.add('Preload', Platform.Preload);
Platform.game.state.add('Game', Platform.Game);

Platform.game.state.start('Boot');
