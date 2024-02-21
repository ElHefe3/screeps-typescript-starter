/** @param {Creep} creep **/

export const roleMaintainer = {
    run(creep: Creep): void {
        const closestDamagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < ( structure.hitsMax * 0.8 )
        });

        if(closestDamagedStructure) {
            if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return;
        }

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }

        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 Repair');
        }

        var structuresToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        structuresToRepair.sort((a,b) => a.hits - b.hits);

        if(creep.memory.building) {
                if(structuresToRepair.length > 0) {
                    if(creep.repair(structuresToRepair[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structuresToRepair[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
        } else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE) &&
                            structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            if(containers.length > 0) {
                if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if(sources.length > 0 && creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
}

