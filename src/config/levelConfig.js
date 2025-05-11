export const levelConfig = {
    first: {
        waves: [
            {
                delay_seconds: 1,
                enemies: [ { enemy: "zombie", count: 2 } ]
            },
            {
                delay_seconds: 8,
                enemies: [ { enemy: "zombie", count: 4 } ]
            },
            {
                delay_seconds: 15,
                enemies: [ { enemy: "zombie", count: 6 },
                           { enemy: "skeleton", count: 2 } ]
            }
        ]
    },
    second: {
        waves: [
            {
                delay_seconds: 1,
                enemies: [ { enemy: "skeleton", count: 3 } ]
            },
            {
                delay_seconds: 10,
                enemies: [ { enemy: "skeleton", count: 5 }, 
                           { enemy: "zombie", count: 2 } ]
            },
            {
                delay_seconds: 20,
                enemies: [ { enemy: "skeleton", count: 7 }, 
                           { enemy: "zombie", count: 4 } ]
            }
        ]
    }
}; 