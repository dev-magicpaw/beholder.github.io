export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        // Get game scene data
        const gameScene = this.scene.get('GameScene');
        
        // Create game over text
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - 50,
            'GAME OVER',
            {
                font: '64px monospace',
                fill: '#ff0000'
            }
        ).setOrigin(0.5);

        // Show stats
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 + 50,
            `Level Reached: ${gameScene.level}\nEnemies Defeated: ${gameScene.enemiesDefeated || 0}`,
            {
                font: '32px monospace',
                fill: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Create restart button
        const restartButton = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2 + 150,
            200,
            50,
            0x444444
        );

        const restartText = this.add.text(
            restartButton.x,
            restartButton.y,
            'Restart',
            {
                font: '24px monospace',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
} 