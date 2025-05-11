export default class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.isPaused = false;
    }

    init(data) {
        this.level = data?.level;
        this.choices = data?.choices;
    }

    create() {
        // Create HUD
        this.createHUD();

        // Create pause button
        this.createPauseButton();

        // If we have upgrade choices, show them
        if (this.choices) {
            this.showUpgradeChoices();
        }
    }

    createHUD() {
        // Health bar
        this.healthBar = this.add.graphics();
        this.healthText = this.add.text(20, 22, 'Health: 100/100', {
            font: '16px monospace',
            fill: '#ffffff'
        }).setOrigin(0);

        // EXP bar
        this.expBar = this.add.graphics();
        this.expText = this.add.text(10, 50, 'EXP: 0/100', {
            font: '16px monospace',
            fill: '#ffffff'
        });

        // Level text
        this.levelText = this.add.text(10, 80, 'Level: 1', {
            font: '16px monospace',
            fill: '#ffffff'
        });

        // FPS meter
        this.fpsText = this.add.text(10, this.game.config.height - 30, 'FPS: 0', {
            font: '16px monospace',
            fill: '#ffffff'
        });
    }

    createPauseButton() {
        // Create pause button in top-right corner
        const buttonSize = 40;
        const padding = 10;
        
        this.pauseButton = this.add.rectangle(
            this.game.config.width - buttonSize - padding,
            buttonSize + padding,
            buttonSize,
            buttonSize,
            0x444444
        );

        this.pauseIcon = this.add.text(
            this.pauseButton.x,
            this.pauseButton.y,
            '⏸',
            {
                font: '24px monospace',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => this.togglePause());
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.scene.pause('GameScene');
            this.showPauseMenu();
        } else {
            this.scene.resume('GameScene');
            this.hidePauseMenu();
        }
    }

    showPauseMenu() {
        // Create semi-transparent background
        this.pauseBg = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.8
        );

        // Create pause menu text
        this.pauseText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - 50,
            'PAUSED',
            {
                font: '48px monospace',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Create resume button
        this.resumeButton = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2 + 50,
            200,
            50,
            0x444444
        );

        this.resumeText = this.add.text(
            this.resumeButton.x,
            this.resumeButton.y,
            'Resume',
            {
                font: '24px monospace',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        this.resumeButton.setInteractive();
        this.resumeButton.on('pointerdown', () => this.togglePause());
    }

    hidePauseMenu() {
        if (this.pauseBg) this.pauseBg.destroy();
        if (this.pauseText) this.pauseText.destroy();
        if (this.resumeButton) this.resumeButton.destroy();
        if (this.resumeText) this.resumeText.destroy();
    }

    showUpgradeChoices(level, choices) {
        // Clear any existing upgrade UI
        this.clearUpgradeUI();

        // Store current choices
        this.level = level;
        this.choices = choices;

        // Create semi-transparent background
        this.upgradeBg = this.add.rectangle(
            this.game.config.width / 2,
            this.game.config.height / 2,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.8
        );

        // Create upgrade choice buttons
        const buttonWidth = this.game.config.width * 0.9; // TODO put 0.9 into a const
        const buttonHeight = 120;
        const spacing = 20;
        const totalHeight = (buttonHeight + spacing) * this.choices.length - spacing;
        let startY = (this.game.config.height - totalHeight) / 2;

        this.upgradeButtons = [];
        this.upgradeTexts = [];
        this.upgradeImages = [];

        this.choices.forEach((choice, index) => {
            const button = this.add.rectangle(
                this.game.config.width / 2,
                startY + index * (buttonHeight + spacing) + buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                0x444444
            );

            // Add upgrade image on the left
            const imageSize = buttonHeight * 0.8;
            const imageX = button.x - buttonWidth / 2 + imageSize / 2 + 20;
            const image = this.add.rectangle(
                imageX,
                button.y,
                imageSize,
                imageSize,
                this.getUpgradeColor(choice.type)
            );
            this.upgradeImages.push(image);

            // Add upgrade text on the right
            const textX = imageX + imageSize / 2 + 20;
            const text = this.add.text(
                textX,
                button.y,
                this.formatUpgradeText(choice),
                {
                    font: '24px monospace',
                    fill: '#ffffff',
                    align: 'left',
                    wordWrap: { width: buttonWidth - imageSize - 60 }
                }
            );
            text.setOrigin(0, 0.5);

            button.setInteractive();
            button.on('pointerdown', () => {
                this.scene.get('GameScene').applyUpgrade(choice);
                this.clearUpgradeUI();
            });

            this.upgradeButtons.push(button);
            this.upgradeTexts.push(text);
        });
    }

    getUpgradeColor(type) {
        switch (type) {
            case 'speed':
                return 0x00ff00; // Green
            case 'health':
                return 0xff0000; // Red
            case 'regen':
                return 0x0000ff; // Blue
            case 'single_ranged_attack':
                return 0xffff00; // Yellow
            case 'expBoost':
                return 0xff00ff; // Purple
            default:
                return 0xffffff; // White
        }
    }

    clearUpgradeUI() {
        if (this.upgradeBg) this.upgradeBg.destroy();
        if (this.upgradeButtons) {
            this.upgradeButtons.forEach(button => button.destroy());
            this.upgradeTexts.forEach(text => text.destroy());
            this.upgradeImages.forEach(image => image.destroy());
        }
        this.upgradeButtons = [];
        this.upgradeTexts = [];
        this.upgradeImages = [];
    }

    formatUpgradeText(upgrade) {
        switch (upgrade.type) {
            case 'speed':
                return `Speed +${upgrade.baseValue}`;
            case 'health':
                return `Max Health +${upgrade.baseValue}`;
            case 'regen':
                return `Health Regen +${upgrade.baseValue}/s`;
            case 'single_ranged_attack':
                return `New Attack: Ranged`;
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
        this.healthBar.fillRect(10, 20, 200 * healthPercent, 20);
        this.healthText.setText(`Health: ${Math.floor(gameScene.player.health)}/${gameScene.player.maxHealth}`);

        // Update EXP bar
        const expPercent = gameScene.exp / gameScene.expToNextLevel;
        this.expBar.clear();
        this.expBar.fillStyle(0x0000ff, 1);
        this.expBar.fillRect(10, 50, 200 * expPercent, 20);
        this.expText.setText(`EXP: ${Math.floor(gameScene.exp)}/${Math.floor(gameScene.expToNextLevel)}`);

        // Update level text
        this.levelText.setText(`Level: ${gameScene.level}`);

        // Update FPS
        this.fpsText.setText(`FPS: ${Math.floor(this.game.loop.actualFps)}`);
    }

    isPointerOverUI(pointer) {
        // Check if pointer is over pause button
        if (this.pauseButton && this.pauseButton.getBounds().contains(pointer.x, pointer.y)) {
            return true;
        }
        
        // Check if pointer is over pause menu elements
        if (this.isPaused) {
            if (this.pauseBg && this.pauseBg.getBounds().contains(pointer.x, pointer.y)) {
                return true;
            }
            if (this.resumeButton && this.resumeButton.getBounds().contains(pointer.x, pointer.y)) {
                return true;
            }
        }
        
        // Check if pointer is over upgrade choices
        if (this.upgradeButtons) {
            for (const button of this.upgradeButtons) {
                if (button.getBounds().contains(pointer.x, pointer.y)) {
                    return true;
                }
            }
        }
        
        return false;
    }
} 