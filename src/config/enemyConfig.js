export default {
    enemies: [
        {
            config_id: 'enemy_goblin',
            sprite: 'zombie',
            sprite_scale: 0.3,
            sprite_tint: 0x000000,
            spawnRate: 0.5,
            expReward: 1,
            speed: 80,
            hitPoints: 2,
            damage: 5,
            attackCooldown_ms: 1000,
            attackDistance: 'melee',
            attackRange: 40,
        },
        {
            config_id: 'enemy_orc',
            sprite: 'zombie',
            sprite_scale: 0.4,
            sprite_tint: 0xffaaaa,
            spawnRate: 0.1,
            expReward: 5,
            speed: 60,
            hitPoints: 5,
            damage: 20,
            attackCooldown_ms: 4000,
            attackDistance: 'melee',
            attackRange: 40
        },
        {
            config_id: 'enemy_archer',
            sprite: 'zombie_rope',
            sprite_scale: 0.25,
            sprite_tint: 0x000000,
            spawnRate: 0.05,
            expReward: 2,
            speed: 80,
            hitPoints: 2,
            damage: 1,
            attackCooldown_ms: 1500,
            attackDistance: 'range',
            attackRange: 200,
            projectileSpeed: 200
        }
    ],
    expRewardMultiplier: 1.0
}; 