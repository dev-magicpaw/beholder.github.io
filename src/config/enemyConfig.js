export default {
    enemies: [
        {
            config_id: 'enemy_goblin',
            sprite: 'zombie',
            spawnRate: 0.5,
            expReward: 1,
            speed: 80,
            hitPoints: 2,
            damage: 1,
            attackRate: 1.2,
            attackDistance: 'melee',
        },
        {
            config_id: 'enemy_orc',
            sprite: 'robot',
            spawnRate: 0.1,
            expReward: 5,
            speed: 60,
            hitPoints: 5,
            damage: 2,
            attackRate: 0.8,
            attackDistance: 'melee'
        },
        {
            config_id: 'enemy_archer',
            sprite: 'zombie_rope',
            spawnRate: 0.05,
            expReward: 2,
            speed: 80,
            hitPoints: 2,
            damage: 1,
            attackRate: 1.5,
            attackDistance: 'range',
            attackRange: 200,
            projectileSpeed: 200
        }
    ],
    expRewardMultiplier: 1.0
}; 