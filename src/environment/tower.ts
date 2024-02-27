interface MaintenanceSettings {
    maxWallHits: number;
    maxRampartHits: number;
}

const maintenanceSettings: MaintenanceSettings = {
    maxWallHits: 40000,
    maxRampartHits: 40000
};

export const tower = {
    runDefenseProtocol: function(buildingId: string) {
        const tower = Game.getObjectById(buildingId) as StructureTower;

        if(tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    },

    // protocol: if there are 4 hostiles with 2 healers, attack the healers first
    quadsDefenseProtocol: function(buildingId: string) {
        const tower = Game.getObjectById(buildingId) as StructureTower;

        if(tower) {
            const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
            const healers = hostiles.filter((hostile) => {
                return hostile.getActiveBodyparts(HEAL) > 0;
            });

            if (healers.length > 1) {
                tower.attack(healers[0]);
            } else {
                tower.attack(hostiles[0]);
            }
        }
    },


    maintenanceProtocol: function(buildingId: string) {
        const tower = Game.getObjectById(buildingId) as StructureTower;

        if (tower && tower.store.getUsedCapacity(RESOURCE_ENERGY) > 400){
            const structures = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType === STRUCTURE_WALL) {
                        return structure.hits < maintenanceSettings.maxWallHits;
                    } else if (structure.structureType === STRUCTURE_RAMPART) {
                        return structure.hits < maintenanceSettings.maxRampartHits;
                    } else if (structure.structureType === STRUCTURE_ROAD) {
                        return structure.hits < structure.hitsMax;
                    }
                    return false;
                }
            });

            if (structures.length > 0) {
                const targetStructure = structures.reduce((lowest, structure) => {
                    return (lowest.hits < structure.hits) ? lowest : structure;
                });

                tower.repair(targetStructure);
            }
        }
    }
};
