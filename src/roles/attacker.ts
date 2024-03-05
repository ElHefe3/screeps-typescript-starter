// @ts-nocheck

export const roleAttacker = {
    run: function(creep) {
        // Find all flags that contain 'attack' in their name
        const attackFlags = _.filter(Game.flags, (flag) => flag.name.toLowerCase().includes('attack'));
        if (attackFlags.length === 0) {
            console.log('No attack flags found');
            return;
        }

        // Optionally, select the closest flag or just the first one
        const targetFlag = attackFlags[0];

        // Move to the flag's room if not already there
        if (creep.room?.name !== targetFlag.room?.name) {
            creep.travelTo(targetFlag);
        } else {
            // Prioritize attacking walls first to gain entry if needed
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_WALL
            });

            // If no walls are left, target extensions
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType === STRUCTURE_EXTENSION
                });
            }

            // If an extension target is found, attack it
            if (target) {
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                }
            } else {
                // No walls or extensions left to attack; you can add further logic here
                console.log('No targets available');
            }
        }
    }
};
