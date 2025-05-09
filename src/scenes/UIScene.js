export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    init(data) {
        this.level = data?.level;
        this.choices = data?.choices;
    }

    create() {
        // Create HUD
        this.createHUD();

        // If we have upgrade choices, show them
        if (this.choices) {
            this.showUpgradeChoices();
        }
    }

    createHUD() {
        // Health bar
        this.healthBar = this.add.graphics();
        this.healthText = this.add.text(10, 10, 'Health: 100/100', {
            font: '16px monospace',
            fill: '#ffffff'
        });

        // EXP bar
        this.expBar = this.add.graphics();
        this.expText = this.add.text(10, 40, 'EXP: 0/100', {
            font: '16px monospace',
            fill: '#ffffff'
        });

        // Level text
        this.levelText = this.add.text(10, 70, 'Level: 1', {
            font: '16px monospace',
            fill: '#ffffff'
        });

        // FPS meter
        this.fpsText = this.add.text(10, this.game.config.height - 30, 'FPS: 0', {
            font: '16px monospace',
            fill: '#ffffff'
        });
    }

    showUpgradeChoices() {
        // Create semi-transparent background
        const bg = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.8
        );

        // Create upgrade choice buttons
        const buttonWidth = 200;
        const buttonHeight = 100;
        const spacing = 20;
        const totalWidth = (buttonWidth + spacing) * this.choices.length - spacing;
        let startX = (this.game.config.width - totalWidth) / 2;

        this.choices.forEach((choice, index) => {
            const button = this.add.rectangle(
                startX + index * (buttonWidth + spacing) + buttonWidth / 2,
                this.game.config.height / 2,
                buttonWidth,
                buttonHeight,
                0x444444
            );

            const text = this.add.text(
                button.x,
                button.y,
                this.formatUpgradeText(choice),
                {
                    font: '16px monospace',
                    fill: '#ffffff',
                    align: 'center',
                    wordWrap: { width: buttonWidth - 20 }
                }
            );
            text.setOrigin(0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.scene.get('GameScene').applyUpgrade(choice);
                this.scene.stop();
            });
        });
    }

    formatUpgradeText(upgrade) {
        switch (upgrade.type) {
            case 'speed':
                return `Speed +${upgrade.baseValue}`;
            case 'health':
                return `Max Health +${upgrade.baseValue}`;
            case 'regen':
                return `Health Regen +${upgrade.baseValue}/s`;
            case 'newAttack':
                return `New Attack: ${upgrade.options.join(' or ')}`;
            case 'expBoost':
                return `EXP Gain +${upgrade.baseValue * 100}%`;
            default:
                return upgrade.type;
        }
    }

    update() {
        const gameScene = this.scene.get('GameScene');
        if (!gameScene) return;

        // Update health bar
        const healthPercent = gameScene.player.health / gameScene.player.maxHealth;
        this.healthBar.clear();
        this.healthBar.fillStyle(0x00ff00, 1);
        this.healthBar.fillRect(10, 30, 200 * healthPercent, 20);
        this.healthText.setText(`Health: ${Math.floor(gameScene.player.health)}/${gameScene.player.maxHealth}`);

        // Update EXP bar
        const expPercent = gameScene.exp / gameScene.expToNextLevel;
        this.expBar.clear();
        this.expBar.fillStyle(0x0000ff, 1);
        this.expBar.fillRect(10, 60, 200 * expPercent, 20);
        this.expText.setText(`EXP: ${Math.floor(gameScene.exp)}/${Math.floor(gameScene.expToNextLevel)}`);

        // Update level text
        this.levelText.setText(`Level: ${gameScene.level}`);

        // Update FPS
        this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    }
} 