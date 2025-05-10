export default {
    tiers: 5,
    baseChoices: [
        { type: 'speed', baseValue: 20 },
        { type: 'health', baseValue: 10 },
        { type: 'regen', baseValue: 1 },
        { type: 'newAttack', options: ['melee', 'ranged'] },
        { type: 'expBoost', baseValue: 0.1 }
    ],
    choiceCount: 3,
    expFormula: (n) => n * 2,
    expToFirstLevelUp: 20
}; 