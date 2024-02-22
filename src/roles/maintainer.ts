/** @param {Creep} creep **/

import { scavengerAttribute } from "attributes";

export const roleMaintainer = {
    run(creep: Creep): void {
        const currentStructureTarget = Game.getObjectById(creep.memory.structureBeingRepaired ?? '') as Structure;
        const isWall = currentStructureTarget?.structureType === STRUCTURE_WALL;

        const currentStructureTargetIsDamaged = currentStructureTarget &&
            currentStructureTarget?.hits < (isWall
                ? ( currentStructureTarget.hitsMax * 0.8 )
                : ( currentStructureTarget.hitsMax * 0.01 ));

        if(creep.memory.maintaining && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.maintaining = false;
            creep.say('🔄 gaterin\'');
        }

        if(!creep.memory.maintaining && creep.store.getFreeCapacity() == 0) {
            creep.memory.maintaining = true;
            creep.say('🛠️ fixin\'');
        }

        var structuresToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        structuresToRepair.sort((a,b) => a.hits - b.hits);

        structuresToRepair = (currentStructureTargetIsDamaged ? [currentStructureTarget, ...structuresToRepair] : structuresToRepair) as AnyStructure[];

        creep.memory.structureBeingRepaired = structuresToRepair[0]?.id;

        if(creep.memory.maintaining) {
                creep.say('🛠️ fixin\'');
                if(structuresToRepair.length > 0) {
                    if(creep.repair(structuresToRepair[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(structuresToRepair[0]);
                    }
                }
        } else {
            creep.say('🔄 gaterin\'');
            scavengerAttribute(creep);
        }
    }
}

