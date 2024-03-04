export const findControllerStorage = (controller: StructureController) => {
    // Find all containers within a range of 5 from the controller
    const containersInRange = controller.pos.findInRange(FIND_STRUCTURES, 5, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
    });

    // From the filtered containers, find the one closest to the controller
    const closestContainer = controller.pos.findClosestByRange(containersInRange) as StructureContainer | null;

    return closestContainer;
};
