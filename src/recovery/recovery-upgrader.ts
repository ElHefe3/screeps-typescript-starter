import { walkThisWay } from "utilities";

export const roleRecoveryUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        if (creep.store.getFreeCapacity() > 0 && !creep.memory.upgrading) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            if (source) {
                walkThisWay.harvest(creep, source);
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
