export const levelConfig = {
    first: {
        waves: [
            {
                delay_seconds: 1,
                enemies: [ { enemy: "zombie", count: 2 } ]
            },
            {
                delay_seconds: 6,
                enemies: [ { enemy: "zombie", count: 4 } ]
            },
            {
                delay_seconds: 10,
                enemies: [ { enemy: "zombie", count: 4 },
                           { enemy: "big_zombie", count: 1 } ]
            }
        ]
    },
    second: {
        waves: [
            {
                delay_seconds: 1,
                enemies: [ { enemy: "zombie", count: 4 } ]
            },
            {
                delay_seconds: 6,
                enemies: [ { enemy: "zombie_archer", count: 2 } ]
            },
            {
                delay_seconds: 12,
                enemies: [ { enemy: "zombie_archer", count: 3 }, 
                           { enemy: "zombie", count: 4 } ]
            },
            {
                delay_seconds: 12,
                enemies: [ { enemy: "zombie_archer", count: 4 }, 
                           { enemy: "big_zombie", count: 2 } ]
            }
        ]
    },
    third: {
        waves: [
            {
                delay_seconds: 1,
                enemies: [ { enemy: "zombie", count: 2 }, 
                           { enemy: "big_zombie", count: 2 } ]
            },
            {
                delay_seconds: 6,
                enemies: [ { enemy: "zombie", count: 12 } ]
            },
            {
                delay_seconds: 12,
                enemies: [ { enemy: "big_zombie", count: 3 }, 
                           { enemy: "zombie_archer", count: 6 } ]
            },
            {
                delay_seconds: 12,
                enemies: [ { enemy: "zombie", count: 15 }, 
                           { enemy: "big_zombie", count: 2 },
                           { enemy: "zombie_archer", count: 8 } ]
            }
        ]
    }
}; 