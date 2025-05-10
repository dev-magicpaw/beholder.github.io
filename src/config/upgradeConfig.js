export default {
    tiers: 5,
    baseChoices: [
        { type: 'speed', baseValue: 20 },
        { type: 'health', baseValue: 10 },
        { type: 'regen', baseValue: 1 },
        { type: 'single_ranged_attack', attackName: 'single_ranged' },
        { type: 'expBoost', baseValue: 0.1 }
    ],
    choiceCount: 3,
    expFormula: (n) => 20 * Math.pow(2, n - 1),
    expToFirstLevelUp: 10
}; 