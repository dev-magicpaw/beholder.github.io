export default {
    enemies: [
        {
            config_id: 'zombie',
            sprite: 'zombie',
            sprite_scale: 0.3,
            sprite_tint: 0x000000,
            expReward: 1,
            speed: 80,
            hitPoints: 2,
            damage: 5,
            attackCooldown_ms: 1000,
            attackDistance: 'melee',
            attackRange: 40,
        },
        {
            config_id: 'skeleton',
            sprite: 'zombie_rope',
            sprite_scale: 0.25,
            sprite_tint: 0x000000,
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