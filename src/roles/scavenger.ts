// @ts-nocheck
export const roleScavenger = {
    run: function(creep) {
        const patrolPoint1 = Game.flags['PatrolPoint1'];
        const patrolPoint2 = Game.flags['PatrolPoint2'];

        // Switch state between gathering and depositing
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.gathering = false;
        } else if (creep.store.getUsedCapacity() === 0) {
            creep.memory.gathering = true;
        }

        if (creep.memory.gathering) {
            // Find closest dropped resource or container with energy
            const target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES) ||
                           creep.pos.findClosestByPath(FIND_STRUCTURES, {
                               filter: (s) => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                                              s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                           });

            if (target) {
                if (target instanceof Resource) {
                    if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            } else {
                // Move between patrol points if no resources or containers with energy
                this.patrol(creep, patrolPoint1, patrolPoint2);
            }
        } else {
            // Find a structure to deposit energy
            const depositTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (depositTarget) {
                if (creep.transfer(depositTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(depositTarget);
                }
            }
        }
    },

    patrol: function(creep, point1, point2) {
        if (!creep.memory.patrolPoint || creep.memory.patrolPoint === point2.name) {
            if (creep.pos.isNearTo(point1)) {
                creep.memory.patrolPoint = point1.name;
            }
            creep.moveTo(point1);
        } else {
            if (creep.pos.isNearTo(point2)) {
                creep.memory.patrolPoint = point2.name;
            }
            creep.moveTo(point2);
        }
    }
}
