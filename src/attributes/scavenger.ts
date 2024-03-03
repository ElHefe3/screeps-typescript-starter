import { idle } from "roles/idle";
import { walkThisWay } from "utilities";

const CONTROLLED_CONTAINER = '65d7b6e3ab0f7711d3a144a2';
const DEFAULT_CONTAINER = '65d79d88df997c11d97d9737';

export const scavengerAttribute = (creep: Creep) => {
    let droppedResource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
    });

    const targetContainer = creep.pos.findClosestByPath(containers) as StructureContainer | null;

    creep.memory.destination = targetContainer?.pos;
    if(droppedResource) {
        walkThisWay.pickup(creep, droppedResource);
    } else if (targetContainer && targetContainer.id !== CONTROLLED_CONTAINER) {
        walkThisWay.withdraw(creep, targetContainer);
    }
    else {
        if(droppedResource) {
            walkThisWay.pickup(creep, droppedResource);
        } else {
            idle.run(creep);
        }
    }
}
