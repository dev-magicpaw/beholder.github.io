export default {
    tiers: 10,
    baseChoices: [
        { type: 'speed', baseValue: 20 },
        { type: 'health', baseValue: 10 },
        { type: 'regen', baseValue: 1 },
        { type: 'expBoost', baseValue: 0.1 }
    ],
    choiceCount: 3,
    expFormula: (n) => 10 * n,//20 * Math.pow(2, n - 1),
    expToFirstLevelUp: 4
}; 

