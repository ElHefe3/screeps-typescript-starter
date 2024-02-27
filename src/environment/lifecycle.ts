import { spawnCreepWithRole } from 'utilities/spawner';

interface LifecycleManager {
    checkEndOfLife(creep: Creep): void;
    handleReplacements(): void;
    cleanUpMemory(): void;
}

const containers = (creep: Creep): StructureContainer[]  => creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
        return structure.structureType === STRUCTURE_CONTAINER &&
               creep.room.controller &&
               creep.room.controller.my;
    }
})


const getTargetContainer = (creep: Creep) => {
    const containersWithFreeCapacity = containers(creep).filter(container =>
        container.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    );

    const sortedContainers = containersWithFreeCapacity.sort((a, b) =>
        b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY)
    );

    return sortedContainers.length > 0 ? sortedContainers[0] : undefined;
};


const lifecycleManager: LifecycleManager = {

    /**
     * Checks the lifespan of a creep and handles its end of life.
     * @param {Creep} creep - The creep to check and manage.
     */
    checkEndOfLife(creep: Creep): void {
        if (creep.ticksToLive && creep.ticksToLive <= 180 && creep.store.getUsedCapacity() === 0 && creep.memory.role !== 'harvester') {
            Memory.replacementsNeeded = Memory.replacementsNeeded || [];
            Memory.replacementsNeeded.push(creep.memory.role);
            console.log(`Creep ${creep.name} marked for replacement.`);
            creep.suicide();
        }
        else if (creep.ticksToLive && creep.ticksToLive <= 180 && creep.memory.role !== 'hauler') {
            const targetContainer = getTargetContainer(creep);
            if (targetContainer && creep.transfer(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(targetContainer);
            }
        }
    },

    /**
     * Attempts to spawn creeps based on the replacements needed.
     * This function should be called in the main loop to continuously check and spawn replacements.
     *
     * 🔸 Note: The replacement needed function does not actually clear, depleting the resource on unnecessary creeps with an off ratio
     */
    handleReplacements(): void {
        if (Memory.replacementsNeeded && Memory.replacementsNeeded.length > 0) {
            Memory.replacementsNeeded.forEach((role, index) => {
                const spawnResult = spawnCreepWithRole('Spawn1', role);
                if (spawnResult === OK) {
                    console.log(`Replacement for role ${role} initiated.`);
                    Memory.replacementsNeeded.splice(index, 1);
                } else if (spawnResult !== ERR_NOT_ENOUGH_ENERGY) {
                    // Handle other errors or conditions here
                }
            });
        }
    },

    /**
     * Cleans up memory entries for creeps that no longer exist.
     */
    cleanUpMemory(): void {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    }
};

export default lifecycleManager;
