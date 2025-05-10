export default {
    enemies: [
        {
            config_id: 'enemy_goblin',
            sprite: 'goblin',
            spawnRate: 1.5,
            expReward: 10,
            speed: 80,
            hitPoints: 3,
            damage: 1,
            attackRate: 1.2,
            attackDistance: 'melee',
        },
        {
            config_id: 'enemy_orc',
            sprite: 'orc',
            spawnRate: 1.5,
            expReward: 15,
            speed: 60,
            hitPoints: 5,
            damage: 2,
            attackRate: 0.8,
            attackDistance: 'melee'
        },
        {
            config_id: 'enemy_archer',
            sprite: 'archer',
            spawnRate: 1.5,
            expReward: 20,
            speed: 60,
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