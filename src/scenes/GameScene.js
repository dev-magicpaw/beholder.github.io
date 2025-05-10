import { attacks } from '../config/attacksConfig';
import enemyConfig from '../config/enemyConfig';
import playerConfig from '../config/playerConfig';
import upgradeConfig from '../config/upgradeConfig';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player = null;
        this.enemies = null;
        this.projectiles = null;
        this.enemyProjectiles = null;
        this.lastAttackTimes = {}; // Track last attack time for each attack
        this.exp = 0;
        this.expToNextLevel = upgradeConfig.expToFirstLevelUp;
        this.level = 1;
        this.isAttacking = false;
    }

    create() {
        // Create groups
        this.enemies = this.physics.add.group();
        this.projectiles = this.physics.add.group();
        this.enemyProjectiles = this.physics.add.group();

        // Create player
        this.player = this.physics.add.sprite(400, 300, 'main_character');
        this.player.setScale(0.4);
        this.player.setCollideWorldBounds(true);
        this.player.health = playerConfig.health;
        this.player.maxHealth = playerConfig.health;
        this.player.speed = playerConfig.speed;
        this.player.attacks = [...playerConfig.attacks];
        // Initialize last attack times for each attack
        this.player.attacks.forEach(attack => {
            this.lastAttackTimes[attack.name] = 0;
        });

        // Create melee hitbox with physics
        this.meleeHitbox = this.add.circle(0, 0, this.player.attacks[0].range, 0xff0000, 0.3);
        this.physics.add.existing(this.meleeHitbox, false); // Add physics body
        this.meleeHitbox.body.setCircle(this.player.attacks[0].range);
        this.meleeHitbox.setVisible(false);

        // Set up collisions
        this.physics.add.overlap(this.enemyProjectiles, this.player, this.onPlayerGotHit, null, this);

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create virtual joystick for mobile
        this.createVirtualJoystick();
        
        // Start enemy spawning for each enemy type
        enemyConfig.enemies.forEach(enemyType => {
            this.time.addEvent({
                delay: 1000 / enemyType.spawnRate,
                callback: () => this.spawnEnemy(enemyType),
                callbackScope: this,
                loop: true
            });
        });

        // Start UI scene
        this.scene.launch('UIScene');
    }

    update(time) {
        // Update player position
        this.updatePlayerMovement();
        
        // Update melee hitbox position
        this.meleeHitbox.x = this.player.x;
        this.meleeHitbox.y = this.player.y;

        // Handle attacks
        this.handleAttacks(time);

        // Update enemies
        this.enemies.getChildren().forEach(enemy => {
            this.updateEnemy(enemy);
        });

        // Regenerate health
        if (this.player.health < playerConfig.health) {
            this.player.health = Math.min(
                playerConfig.health,
                this.player.health + playerConfig.regenRate / 60
            );
        }
    }

    updatePlayerMovement() {
        const speed = this.player.speed;
        
        // Reset velocity
        this.player.setVelocity(0);
        
        // Handle keyboard input
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }
        
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
        
        // Handle joystick input
        if (this.joystick.isActive) {
            this.player.setVelocity(
                this.joystick.vector.x * speed,
                this.joystick.vector.y * speed
            );
        }
        
        // Normalize diagonal movement
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(speed);
        }
    }

    handleAttacks(time) {
        this.player.attacks.forEach(attack => {
            // Check if attack is off cooldown
            if (time > this.lastAttackTimes[attack.name] + attack.cooldown_ms) {
                if (attack.type === 'melee') {
                    // Get all enemies within range
                    const nearbyEnemies = this.enemies.getChildren().filter(enemy => {
                        const distance = Phaser.Math.Distance.Between(
                            this.player.x, this.player.y,
                            enemy.x, enemy.y
                        );
                        
                        return distance <= attack.range;
                    });

                    // Sort by distance and take only target_count enemies
                    nearbyEnemies.sort((a, b) => {
                        const distA = Phaser.Math.Distance.Between(this.player.x, this.player.y, a.x, a.y);
                        const distB = Phaser.Math.Distance.Between(this.player.x, this.player.y, b.x, b.y);
                        return distA - distB;
                    }).slice(0, attack.target_count).forEach(enemy => {
                        // Spawn attack sprite directly on enemy
                        const attackSprite = this.add.sprite(enemy.x, enemy.y, attack.projectile_sprite);
                        attackSprite.setScale(attack.projectile_scale);
                        attackSprite.setTint(attack.projectile_tint);
                        attackSprite.setAlpha(attack.projectile_alpha);
                        
                        // Add a fade out and destroy animation
                        this.tweens.add({
                            targets: attackSprite,
                            alpha: 0,
                            duration: attack.projectile_duration_ms,
                            onComplete: () => {
                                attackSprite.destroy();
                            }
                        });

                        // Apply damage directly
                        enemy.health -= attack.damage;
                        if (enemy.health <= 0) {
                            this.addExp(enemy.config.expReward);
                            enemy.destroy();
                        }
                    });
                }

                if (attack.type === 'ranged') {
                    const pointer = this.input.activePointer;
                    const baseAngle = Phaser.Math.Angle.Between(
                        this.player.x, this.player.y,
                        pointer.x, pointer.y
                    );

                    // Calculate angle spread for multiple projectiles
                    const angleSpread = Math.PI / 6; // 30 degrees spread
                    const startAngle = baseAngle - (angleSpread * (attack.target_count - 1) / 2);

                    // Create multiple projectiles
                    for (let i = 0; i < attack.target_count; i++) {
                        const angle = startAngle + (angleSpread * i);
                        const projectile = this.projectiles.create(
                            this.player.x,
                            this.player.y,
                            attack.projectile_sprite
                        );
                        projectile.setScale(attack.projectile_scale || 0.1);
                        projectile.setTint(attack.projectile_tint || 0xffffff);
                        projectile.setAlpha(attack.projectile_alpha || 1);
                        projectile.setVelocity(
                            Math.cos(angle) * attack.projectile_speed,
                            Math.sin(angle) * attack.projectile_speed
                        );
                        projectile.rotation = angle;
                        projectile.damage = attack.damage;

                        // Add collision check for this projectile
                        this.physics.add.overlap(projectile, this.enemies, (proj, enemy) => {
                            enemy.health -= proj.damage;
                            proj.destroy();
                            
                            if (enemy.health <= 0) {
                                this.addExp(enemy.config.expReward);
                                enemy.destroy();
                            }
                        }, null, this);
                    }
                }

                // Update last attack time for this specific attack
                this.lastAttackTimes[attack.name] = time;
            }
        });
    }

    spawnEnemy(enemyConfig) {
        // Spawn from random edge
        let x, y;
        if (Phaser.Math.RND.frac() < 0.5) {
            x = Phaser.Math.RND.frac() < 0.5 ? -50 : this.game.config.width + 50;
            y = Phaser.Math.Between(0, this.game.config.height);
        } else {
            x = Phaser.Math.Between(0, this.game.config.width);
            y = Phaser.Math.RND.frac() < 0.5 ? -50 : this.game.config.height + 50;
        }

        const enemy = this.enemies.create(x, y, enemyConfig.sprite);
        enemy.setScale(enemyConfig.sprite_scale || 0.3); // Use sprite_scale from config
        if (enemyConfig.sprite_tint) {
            enemy.setTint(enemyConfig.sprite_tint); // Apply tint if specified
        }
        enemy.config = enemyConfig;
        enemy.health = enemyConfig.hitPoints;
        enemy.damage = enemyConfig.damage;
        enemy.speed = enemyConfig.speed;
        enemy.attackRate = enemyConfig.attackRate;
        enemy.lastAttackTime = 0;
        enemy.attackDistance = enemyConfig.attackDistance;

        if (enemyConfig.attackDistance === 'range') {
            enemy.attackRange = enemyConfig.attackRange;
            enemy.projectileSpeed = enemyConfig.projectileSpeed;
        }
    }

    updateEnemy(enemy) {
        const distance = Phaser.Math.Distance.Between(
            enemy.x, enemy.y,
            this.player.x, this.player.y
        );

        if (enemy.attackDistance === 'range' && distance < enemy.attackRange) {
            // Move away from player
            const angle = Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                enemy.x, enemy.y
            );
            enemy.setVelocity(
                Math.cos(angle) * enemy.speed,
                Math.sin(angle) * enemy.speed
            );
        } else {
            // Move toward player
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                this.player.x, this.player.y
            );
            enemy.setVelocity(
                Math.cos(angle) * enemy.speed,
                Math.sin(angle) * enemy.speed
            );
        }

        // Handle ranged attacks
        if (enemy.attackDistance === 'range' && 
            distance <= enemy.attackRange * 1.2 && 
            this.time.now > enemy.lastAttackTime + (1000 / enemy.attackRate)) {
            
            const angle = Phaser.Math.Angle.Between(
                enemy.x, enemy.y,
                this.player.x, this.player.y
            );

            const projectile = this.enemyProjectiles.create(
                enemy.x,
                enemy.y,
                'spheare'
            );
            projectile.setScale(0.1); // Scale down enemy projectiles
            projectile.setVelocity(
                Math.cos(angle) * enemy.projectileSpeed,
                Math.sin(angle) * enemy.projectileSpeed
            );
            projectile.rotation = angle;
            projectile.damage = enemy.damage;

            enemy.lastAttackTime = this.time.now;
        }
    }

    onPlayerGotHit(player, projectile) {
        player.health -= projectile.damage;
        projectile.destroy();
        
        if (player.health <= 0) {
            this.scene.start('GameOverScene');
        }
    }

    addExp(amount) {
        this.exp += amount * playerConfig.expBoost;
        
        if (this.exp >= this.expToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = upgradeConfig.expFormula(this.level);
        console.log(`XP needed for level ${this.level + 1}: ${this.expToNextLevel}`);
        
        // Pause game and update existing UI scene
        this.scene.pause();
        const uiScene = this.scene.get('UIScene');
        uiScene.showUpgradeChoices(this.level, this.getUpgradeChoices());
    }

    getUpgradeChoices() {
        const choices = [];
        const availableUpgrades = [...upgradeConfig.baseChoices];
        
        for (let i = 0; i < upgradeConfig.choiceCount; i++) {
            const index = Phaser.Math.Between(0, availableUpgrades.length - 1);
            choices.push(availableUpgrades[index]);
            availableUpgrades.splice(index, 1);
        }
        
        return choices;
    }

    applyUpgrade(upgrade) {
        switch (upgrade.type) {
            case 'speed':
                this.player.speed += upgrade.baseValue;
                break;
            case 'health':
                playerConfig.health += upgrade.baseValue;
                this.player.health += upgrade.baseValue;
                this.player.maxHealth += upgrade.baseValue;
                break;
            case 'regen':
                playerConfig.regenRate += upgrade.baseValue;
                break;
            case 'single_ranged_attack':
                const rangedAttack = attacks.find(attack => attack.name === upgrade.attackName);
                if (rangedAttack && !this.player.attacks.some(attack => attack.name === rangedAttack.name)) {
                    this.player.attacks.push(rangedAttack);
                    this.lastAttackTimes[rangedAttack.name] = 0;
                }
                break;
            case 'expBoost':
                playerConfig.expBoost += upgrade.baseValue;
                break;
        }
        
        this.scene.resume();
    }

    createVirtualJoystick() {
        // Create joystick base
        this.joystickBase = this.add.circle(0, 0, 50, 0x000000, 0.5);
        this.joystickBase.setScrollFactor(0);
        this.joystickBase.setVisible(false);
        
        // Create joystick handle
        this.joystickHandle = this.add.circle(0, 0, 25, 0x000000, 0.8);
        this.joystickHandle.setScrollFactor(0);
        this.joystickHandle.setVisible(false);
        
        // Make joystick interactive
        this.joystickBase.setInteractive();
        this.joystickHandle.setInteractive();
        
        // Store joystick state
        this.joystick = {
            base: this.joystickBase,
            handle: this.joystickHandle,
            isActive: false,
            vector: new Phaser.Math.Vector2(0, 0)
        };
        
        // Set up joystick events
        this.input.on('pointerdown', (pointer) => {
            // Check if we clicked on a UI element
            // const uiScene = this.scene.get('UIScene');
            // if (uiScene && uiScene.isPointerOverUI(pointer)) {
            //     return;
            // }
            
            this.joystick.isActive = true;
            this.joystick.base.x = pointer.x;
            this.joystick.base.y = pointer.y;
            this.joystick.handle.x = pointer.x;
            this.joystick.handle.y = pointer.y;
            this.joystick.base.setVisible(true);
            this.joystick.handle.setVisible(true);
        });
        
        this.input.on('pointermove', (pointer) => {
            if (this.joystick.isActive) {
                const distance = Phaser.Math.Distance.Between(
                    this.joystick.base.x,
                    this.joystick.base.y,
                    pointer.x,
                    pointer.y
                );
                
                if (distance > 50) {
                    const angle = Phaser.Math.Angle.Between(
                        this.joystick.base.x,
                        this.joystick.base.y,
                        pointer.x,
                        pointer.y
                    );
                    
                    this.joystick.handle.x = this.joystick.base.x + Math.cos(angle) * 50;
                    this.joystick.handle.y = this.joystick.base.y + Math.sin(angle) * 50;
                } else {
                    this.joystick.handle.x = pointer.x;
                    this.joystick.handle.y = pointer.y;
                }
                
                // Calculate normalized vector
                this.joystick.vector.x = (this.joystick.handle.x - this.joystick.base.x) / 50;
                this.joystick.vector.y = (this.joystick.handle.y - this.joystick.base.y) / 50;
            }
        });
        
        this.input.on('pointerup', () => {
            this.joystick.isActive = false;
            this.joystick.handle.x = this.joystick.base.x;
            this.joystick.handle.y = this.joystick.base.y;
            this.joystick.vector.x = 0;
            this.joystick.vector.y = 0;
            this.joystick.base.setVisible(false);
            this.joystick.handle.setVisible(false);
        });
    }
} 