export const roleBlockade = {
    run: function(creep: Creep) {
        // Define waypoint flag and blockade flag
        const waypointFlag = Game.flags['waypoint'];
        const blockadeFlag = Game.flags['blockade'];

        if (!blockadeFlag) {
            console.log('Blockade flag not found.');
            return;
        }

        // If the waypoint flag exists, use it as the first target
        // @ts-ignore
        if (waypointFlag && !creep.memory.reachedWaypoint) {
            if (creep.pos.isEqualTo(waypointFlag.pos)) {
                // Mark waypoint as reached
                // @ts-ignore
                creep.memory.reachedWaypoint = true;
            } else {
                // Move towards the waypoint
                creep.moveTo(waypointFlag);
                return; // Exit early to avoid proceeding to blockade logic
            }
        }

        // Once the waypoint is reached or if it doesn't exist, move towards the blockade flag
        if (creep.room.name !== blockadeFlag.pos.roomName) {
            creep.moveTo(blockadeFlag);
        } else {
            // Perform blockade duties in the target room
            this.performBlockadeDuties(creep, blockadeFlag);
        }
    },

    performBlockadeDuties: function(creep: Creep, blockadeFlag: Flag) {
        // Attempt to destroy non-wall and non-road buildings first
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType !== STRUCTURE_WALL &&
                       structure.structureType !== STRUCTURE_ROAD &&
                       structure.structureType !== STRUCTURE_CONTAINER && // Add or remove structure types as needed
                       structure.hits > 0;
            }
        });

        if (targets.length > 0) {
            if (creep.attack(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            return; // Exit to prioritize attacking structures
        }

        // If no structures to destroy, find and attack hostile creeps
        const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostileCreeps.length > 0) {
            if (creep.attack(hostileCreeps[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostileCreeps[0]);
            }
        } else {
            // If no hostile creeps, stay near the blockade flag or perform other duties
            if (!creep.pos.isNearTo(blockadeFlag)) {
                creep.moveTo(blockadeFlag);
            }
        }
    }
}
