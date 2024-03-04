// iof the defon flag is yellow, the defcon level is 1
// if the defcon flag is red, the defcon level is 2
// if the defcon flag is white, the defcon level is 0
//
// when defon is yellow, spawn haulers creeps that specifically haul energy to the towers using storage

import { spawnCreepWithRole, walkThisWay } from "utilities";

const MAX_DEFENSE_HAULERS = 2;

export const defconProtocol = {
    yellow: function(roomName: string) {
        const room = Game.rooms[roomName];
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });

        const storage = room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_STORAGE
        }) as StructureStorage[];

        const haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'defenseHauler');

        if(haulers.length < MAX_DEFENSE_HAULERS) {
            spawnCreepWithRole('Spawn1', 'defenseHauler', [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]);
        }

        const closestStore = storage[0];
        const closestTower = towers[0];

        if(towers.length > 0 && storage.length > 0) {
            for (const hauler of haulers) {
                if(hauler.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    walkThisWay.withdraw(hauler, closestStore);
                } else {
                    walkThisWay.transfer(hauler, closestTower);
                }
            }
        }
    }
};
