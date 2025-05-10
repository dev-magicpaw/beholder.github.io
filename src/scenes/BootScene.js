export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading progress events
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });

        // Load game assets
        this.load.image('beholder', 'assets/sprites/beholder.png');
        this.load.image('goblin', 'assets/sprites/goblin.png');
        this.load.image('orc', 'assets/sprites/orc.png');
        this.load.image('archer', 'assets/sprites/archer.png');
        this.load.image('projectile', 'assets/sprites/projectile.png');
        this.load.image('zombie', 'assets/sprites/toon-characters/Zombie/PNG/Poses HD/character_zombie_side.png');
        this.load.image('zombie_rope', 'assets/sprites/toon-characters/Zombie/PNG/Poses HD/character_zombie_rope.png');
        this.load.image('robot', 'assets/sprites/toon-characters/Robot/PNG/Poses HD/character_robot_side.png');
        this.load.image('main_character', 'assets/sprites/toon-characters/Male adventurer/PNG/Poses HD/character_maleAdventurer_side.png');
    }

    create() {
        this.scene.start('GameScene');
    }
} 