import { walkThisWay } from "utilities";

const TARGET_ROOM_NAME = 'W8N6';
const HOME_ROOM_NAME = 'W8N7';

export const roleRemoteMiner = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        const inTargetRoom = creep.room.name === TARGET_ROOM_NAME;
        const inHomeRoom = creep.room.name === HOME_ROOM_NAME;

        if (!creep.memory.harvesting && creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
        } else if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            if (!inTargetRoom) {
                const targetPos = new RoomPosition(25, 25, TARGET_ROOM_NAME);
                creep.travelTo(targetPos);
            } else {
                const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source) {
                    walkThisWay.harvest(creep, source);
                }
            }
        } else {
            if (!inHomeRoom) {
                const homePos = new RoomPosition(25, 25, HOME_ROOM_NAME);
                creep.travelTo(homePos);
            } else {
                // Find all structures that can store energy, excluding containers
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_SPAWN ||
                                structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_TOWER) &&
                               structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                // If no suitable structures found, consider containers as a last resort
                if (targets.length === 0) {
                    const containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType === STRUCTURE_CONTAINER &&
                                   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    if (containers.length > 0) {
                        targets.push(...containers);
                    }
                }

                // Attempt to deposit energy in the found targets
                if (targets.length > 0) {
                    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0]);
                    }
                }
            }
        }
    }
};
