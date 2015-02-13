var Plataform = Plataform || {};

// Plataform.game = new Phaser.Game(746, 420, Phaser.AUTO, '');
Plataform.game = new Phaser.Game(240, 140, Phaser.CANVAS, '');

Plataform.game.state.add('Boot', Plataform.Boot);
Plataform.game.state.add('Preload', Plataform.Preload);
Plataform.game.state.add('Game', Plataform.Game);

Plataform.game.state.start('Boot');
