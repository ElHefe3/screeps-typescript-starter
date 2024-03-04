import { findControllerStorage, walkThisWay } from "utilities";

export const AbundanceMentalityAttribute = (creep: Creep) => {
    const controllerContainer = findControllerStorage(creep.room.controller as StructureController);

    creep.memory.currentTask = undefined;

    const droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (resource) => creep.pos.getRangeTo(resource) <= 2 && resource.amount > 10
    });

    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0 &&
                                structure.id !== controllerContainer?.id
    });

    const restOfDroppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.amount > 10
    });

    const targetContainer = creep.pos.findClosestByPath(containers) as StructureContainer | null;

    if(droppedResource) {
        walkThisWay.pickup(creep, droppedResource);
    } else if (targetContainer) {
        walkThisWay.withdraw(creep, targetContainer);
    } else {
        if (restOfDroppedResources) {
            walkThisWay.pickup(creep, restOfDroppedResources);
        }
    }

};
