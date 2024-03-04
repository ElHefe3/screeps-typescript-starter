import { walkThisWay } from "utilities";

export const roleRecoveryBuilder = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        const spawnRoom = Game.rooms[creep.memory.room]; // Assuming spawnRoom is the name of the room

        if (creep.store.getFreeCapacity() > 0 && !creep.memory.hauling) {
            // Harvest energy if the creep is not full and not currently hauling
            var source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: (s) => s.energy > 0 && s.room.name === spawnRoom.name
            });

            if (source) {
                walkThisWay.harvest(creep, source);
            }
        } else {
            creep.memory.hauling = true;
            // Find construction sites to work on within the spawn room
            const constructionSite = spawnRoom.find(FIND_CONSTRUCTION_SITES).sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))[0];

            if (constructionSite) {
                walkThisWay.build(creep, constructionSite);
            } else {
                // No construction sites, find structures to maintain in the spawn room
                const structureToMaintain = spawnRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
                }).sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))[0];

                if (structureToMaintain) {
                    // If a structure needs maintenance, repair it
                    walkThisWay.repair(creep, structureToMaintain);
                } else {
                    // No structures need maintenance, switch to upgrading the controller
                    const controller = spawnRoom.controller;
                    if (controller) {
                        walkThisWay.upgrade(creep, controller);
                    }
                }
            }

            // Reset hauling flag if empty
            if (creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.hauling = false;
            }
        }
    }
};
