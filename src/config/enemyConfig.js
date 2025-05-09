export default {
    spawnRate: 1.5,
    types: {
        melee: {
            speedRange: [60, 100],
            hitPointsRange: [2, 5],
            damageRange: [1, 2],
            attackRateRange: [0.8, 1.5]
        },
        ranged: {
            speedRange: [40, 80],
            hitPointsRange: [1, 3],
            damageRange: [1, 2],
            attackRateRange: [1.0, 2.0],
            projectileSpeed: 200,
            optimalRange: 200
        }
    },
    expRewardMultiplier: 1.0
}; 