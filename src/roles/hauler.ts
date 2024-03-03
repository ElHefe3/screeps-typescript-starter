import { scavengerAttribute } from "attributes";
import { buildingExpressionMapper } from "constant-values";
import { walkThisWay } from "utilities";

export const roleHauler = (creep: Creep) => {
    const { EXTENSION, RESOURCE } = buildingExpressionMapper;


    if (creep.memory.hauling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
        creep.say(RESOURCE.emoticon);
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
            const controllerStorage = Game.getObjectById('65e2e7dcdf997c11d9834f4f') as StructureStorage;
            target = controllerStorage.store.getFreeCapacity() > 1500
                ? controllerStorage
                : target;
        }

        if (creep.memory.hauling && target !== null) {
            if(target.id === '65e2e7dcdf997c11d9834f4f') {
                creep.say("anywhere but here")
            } else {
                creep.say('🚚 haulin\'');
            };

            walkThisWay.transfer(creep, target);
        } else {
            creep.say('🔄');
            scavengerAttribute(creep);
        }
    } else {
        scavengerAttribute(creep);
    }
}
