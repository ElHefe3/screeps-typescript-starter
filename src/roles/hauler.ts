import { scavengerAttribute } from "attributes";

import { roleUpgrader } from "./upgrader";


export const roleHauler = (creep: Creep) => {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
        } else {
            roleUpgrader.run(creep);
        }
    } else {
        scavengerAttribute(creep);
    }
}
