export default {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        'BootScene',
        'GameScene',
        'UIScene',
        'GameOverScene'
    ]
}; 