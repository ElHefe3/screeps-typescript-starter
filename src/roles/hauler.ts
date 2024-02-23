import { scavengerAttribute } from "attributes";

export const roleHauler = (creep: Creep) => {
    //const { EXTENSION, RESOURCE } = buildingExpressionMapper;

    if (creep.memory.hauling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
        creep.say("yeehaw");
    }

    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
        creep.say('🚚');
    }

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if(!(target?.structureType === STRUCTURE_SPAWN)) {
            const controllerStorage = Game.getObjectById('65d7b6e3ab0f7711d3a144a2') as StructureStorage;
            target = controllerStorage.store.getFreeCapacity() > 1500
                ? controllerStorage
                : target;
        }

        if (creep.memory.hauling && target !== null) {
            if(target.id === '65d7b6e3ab0f7711d3a144a2') {
                creep.say("anywhere but here")
            } else {
                creep.say('🚚 haulin\'');
            };

            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
        } else {
            creep.say('🔄');
            scavengerAttribute(creep);
        }
    } else {
        scavengerAttribute(creep);
    }
}
