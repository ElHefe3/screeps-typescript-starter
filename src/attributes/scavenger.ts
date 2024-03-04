import { findControllerStorage, walkThisWay } from "utilities";

export const scavengerAttribute = (creep: Creep) => {
    const controllerContainer = findControllerStorage(creep.room.controller as StructureController);

    const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });

    const targetContainer = creep.pos.findClosestByPath(containers) as StructureContainer | null;

    creep.memory.destination = targetContainer?.pos;

    if(droppedResource?.amount && droppedResource.amount > 10) {
        walkThisWay.pickup(creep, droppedResource);
    } else if (targetContainer && targetContainer.id !== controllerContainer?.id) {
        walkThisWay.withdraw(creep, targetContainer);
    }
}
