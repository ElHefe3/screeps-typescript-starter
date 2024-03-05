// @ts-nocheck

export const roleHarvester = {
    run: function(creep) {
        // If the creep is bringing energy to a structure but has no energy left, switch state
        if (creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
        }

        // If set to harvesting, find sources and start harvesting
        if (creep.memory.harvesting) {
            let sources = creep.room.find(FIND_SOURCES);
            let targetSource = null;

            for (let source of sources) {
                // Check if another harvester is already assigned to this source
                if (!_.some(Game.creeps, c => c.memory.role === 'harvester' && c.memory.sourceId === source.id && c.id !== creep.id)) {
                    targetSource = source;
                    break;
                }
            }

            // If all sources are occupied, default to the first source (fallback scenario)
            if (!targetSource) {
                targetSource = sources[0];
            }

            // Save sourceId in memory to stick to it
            if (!creep.memory.sourceId) {
                creep.memory.sourceId = targetSource.id;
            }

            // Start or continue harvesting
            if (creep.harvest(Game.getObjectById(creep.memory.sourceId)) === ERR_NOT_IN_RANGE) {
                creep.travelTo(Game.getObjectById(creep.memory.sourceId));
            }
        } else {
            // Code for dropping off energy goes here, but according to your requirement, it does not switch task
        }
    }
};
