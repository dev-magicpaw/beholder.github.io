import attacks from './attacksConfig';

export default {
    speed: 125,
    health: 100,
    regenRate: 0, // HP per second
    expBoost: 1.0,
    attacks: attacks.filter(attack => attack.name === 'single_melee'), // Only melee attack by default
}; 