import { idle } from "./idle";

export const roleDefender = {
    run(creep: Creep): void {
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            const target = creep.pos.findClosestByRange(hostiles);
            if (target) {
                if (creep.getActiveBodyparts(ATTACK) > 0) {
                    if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                }
                else if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                    }
                }
            }
        } else {
            idle.run(creep);
        }
    }
};
