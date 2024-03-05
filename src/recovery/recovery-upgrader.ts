import { walkThisWay } from "utilities";

export const roleRecoveryUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        if (creep.store.getFreeCapacity() > 0 && !creep.memory.upgrading) {
            // get energy from containers
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0
            });

            if (container) {
                walkThisWay.withdraw(creep, container);
            }
        } else {
            creep.memory.upgrading = true;
            const controller = creep.room.controller;

            if (controller) {
                walkThisWay.upgrade(creep, controller);
            } else {
                creep.memory.upgrading = false;
            }

            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.upgrading = false;
            }
        }
    }
};
