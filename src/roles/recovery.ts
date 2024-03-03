// ts  disable
// @ts-ignore

export const roleRecoveryBot = (creep) => {
    // Define when to switch between harvesting and hauling
    if (creep.memory.hauling && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.hauling = false;
        creep.say('⛏️');
    }
    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
        creep.say('🚚');
    }

    // Harvest energy from the closest source when not hauling
    if (!creep.memory.hauling) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.travelTo(source);
        }
    } else {
        // Find closest spawn or extension that needs energy
        const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure: Structure) => {
                return (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION) &&
                    // @ts-ignore
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        // Deliver energy to the target
        if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    }
};
