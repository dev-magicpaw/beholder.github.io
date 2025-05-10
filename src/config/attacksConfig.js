export const attacks = [
    {
        name: 'single_melee',
        type: 'melee',
        damage: 10,
        range: 100,
        cooldown_ms: 1000,
        target_count: 1,
        projectile_sprite: 'star_45',
        projectile_duration_ms: 500,
        projectile_scale: 1,
        projectile_tint: 0xff0000,
        projectile_alpha: 1,
    },
    {
        name: 'single_ranged',
        type: 'ranged',
        damage: 10,
        range: 300,
        cooldown_ms: 1000,
        target_count: 1,
        projectile_sprite: 'spheare',
        projectile_speed: 300,
        projectile_scale: 0.1,
        projectile_tint: 0xff0000,
        projectile_alpha: 1,
    }
];

export default attacks; 