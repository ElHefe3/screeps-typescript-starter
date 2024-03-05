// @ts-nocheck

export const rolePatroller = {
    run: function(creep) {
        // Define patrol points as flags in the game
        const patrolPoint1 = Game.flags['PatrolPoint1'];
        const patrolPoint2 = Game.flags['PatrolPoint2'];

        // Check for hostile creeps in the current room
        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (hostile) {
            // If there's a hostile creep, pursue and attack
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.travelTo(hostile);
            }
            creep.memory.target = hostile.id; // Remember the target for potential cross-room pursuit
            creep.memory.chaseCounter = 0; // Reset chase counter when a new target is found
        } else if (creep.memory.target) {
            // Increment chase counter
            creep.memory.chaseCounter = (creep.memory.chaseCounter || 0) + 1;

            // Give up if chasing for more than 100 ticks
            if (creep.memory.chaseCounter > 100) {
                delete creep.memory.target;
                delete creep.memory.chaseCounter;
                console.log(`${creep.name} giving up chase after 100 ticks.`);
            } else {
                // If previously chasing a target, try to find it again (possibly in a new room)
                const previousTarget = Game.getObjectById(creep.memory.target);
                if (previousTarget) {
                    if (creep.attack(previousTarget) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(previousTarget);
                    }
                } else {
                    // If the target no longer exists, clear the memory and continue patrolling
                    delete creep.memory.target;
                    delete creep.memory.chaseCounter;
                }
            }
        } else {
            // Patrol logic
            if (!creep.memory.patrolPoint || creep.memory.patrolPoint === patrolPoint2.name) {
                if(creep.pos.isNearTo(patrolPoint1)) creep.memory.patrolPoint = patrolPoint1.name;
                creep.travelTo(patrolPoint1);
            } else {
                if(creep.pos.isNearTo(patrolPoint2)) creep.memory.patrolPoint = patrolPoint2.name;
                creep.travelTo(patrolPoint2);
            }
        }
    }
}
