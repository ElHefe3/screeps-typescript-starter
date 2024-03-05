export const spawnManager = {
    spawnQueue: [],

    init: function() {
        if (!Memory.spawns) {
            Memory.spawns = {};
        }

        Object.keys(Game.spawns).forEach(spawnName => {
            if (!Memory.spawns[spawnName]) {
                Memory.spawns[spawnName] = { spawnQueue: [] };
            }
        });
    },

    addSpawnRequest: function(spawnName: string, request: SpawnQueueItem) {
        if (Memory.spawns[spawnName]) {
            Memory.spawns[spawnName].spawnQueue.push(request);
            this.sortQueue(spawnName);
        } else {
            console.log(`Spawn ${spawnName} not found in Memory.`);
        }
    },

    sortQueue: function(spawnName: string) {
        const priorityMap: { [key: string]: number } = { 'high': 1, 'medium': 2, 'low': 3 };
        Memory.spawns[spawnName].spawnQueue.sort((a, b) => priorityMap[a.priority!] - priorityMap[b.priority!]);
    },

    processQueue: function(spawnName: string) {
        const defaultBody = [WORK, CARRY, MOVE];

        if (Memory.spawns[spawnName] && Memory.spawns[spawnName].spawnQueue.length > 0) {
            const spawnRequest = Memory.spawns[spawnName].spawnQueue[0];
            const spawn = Game.spawns[spawnName];
            if (spawn && !spawn.spawning && spawn.room.energyAvailable >= this.calculateBodyCost(spawnRequest.body ?? defaultBody)) {
                const name = `${spawnRequest.memory?.role}_${Game.time}`;
                const result = spawn.spawnCreep(spawnRequest.body ?? defaultBody, name, { memory: spawnRequest.memory });
                if (result === OK) {
                    console.log(`Spawning ${name} at ${spawnName}`);
                    Memory.spawns[spawnName].spawnQueue.shift();
                }
            }
        }
    },

    calculateBodyCost: function(bodyParts: BodyPartConstant[]) {
        return bodyParts.reduce((cost, part) => cost + BODYPART_COST[part], 0);
    },
};
