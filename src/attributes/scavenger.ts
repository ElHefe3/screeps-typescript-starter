import { erroring } from "roles/error";

export const scavengerAttribute = (creep: Creep) => {
    let droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    let targetContainer: StructureContainer | null = null;

    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });
    targetContainer = creep.pos.findClosestByPath(containers) as StructureContainer | null;
    creep.memory.destination = targetContainer?.pos;

    if (targetContainer && targetContainer.id !== '65d7b6e3ab0f7711d3a144a2') {
        if(creep.withdraw(targetContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(targetContainer);
        }
    }
    else {
        if(droppedResource) {
            if(creep.pickup(droppedResource) === ERR_NOT_IN_RANGE) {
                creep.travelTo(droppedResource);
            }
        } else {
            const defaultContainer = Game.getObjectById('65d79d88df997c11d97d9737') as StructureContainer;
            if(creep.withdraw(defaultContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(defaultContainer);
            }
        }
    }
}
