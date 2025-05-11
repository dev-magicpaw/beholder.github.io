import attacks from './attacksConfig';

export default {
    speed: 125,
    health: 100,
    regenRate: 0, // HP per second
    expBoost: 1.0,
    attacks: attacks.filter(attack => attack.name === 'single_melee').map(attack => ({
        ...attack,
        currentLevel: 0 // Start at first level
    }))
}; 