export const findControllerStorage = (controller: StructureController) => controller.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
    }) as StructureContainer | null;
