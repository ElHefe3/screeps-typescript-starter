export const scavengerAttribute = (creep: Creep) => {
    let targetResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    let targetContainer: StructureContainer | null = null;

    if (!targetResource) {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                   structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        });
        targetContainer = creep.pos.findClosestByPath(containers) as StructureContainer | null;
    }

    if (targetResource) {
        if(creep.pickup(targetResource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetResource, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else if (targetContainer) {
        if(creep.withdraw(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}
