import { walkThisWay } from "utilities";

export const roleColonizer = {
    // move to the room with a flag named "colonize"
    moveToColonize: function(creep: Creep) {
        const flag = Game.flags['colonize'];
        if (flag) {
            if (creep.room.name !== flag.pos.roomName) {
                creep.travelTo(flag);
            } else {
                creep.travelTo(flag);
            }
        }
    },

    // claim the controller in the room
    claimController: function(creep: Creep) {
        if (creep.room.controller) {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },

    // harvest, build, and upgrade the room to make it self-sufficient
    constructSpawn: function(creep: Creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
        }

        const spawnSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (site) => site.structureType === STRUCTURE_SPAWN
        });

        if (creep.memory.building) {
            const targets = [...spawnSites, ...creep.room.find(FIND_CONSTRUCTION_SITES)];
            if (targets.length) {
                walkThisWay.build(creep, targets[0]);
            }
        } else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source) {
                walkThisWay.harvest(creep, source);
            }
        }
    },

    // upgrade once spawn is built
    upgradeController: function(creep: Creep) {
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
}
