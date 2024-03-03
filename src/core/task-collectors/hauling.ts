export const findHaulingTasks = (room: Room) => {
    const spawns = room.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    const extensions = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    const controllerStorage = room.controller?.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
        }) as StructureContainer | null;

    const towers = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    const storage = room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_STORAGE && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

    const doesControllerNeedsResource = controllerStorage && controllerStorage.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

    const overflow = doesControllerNeedsResource && controllerStorage ? [controllerStorage] : towers;

    const prioritizedStructures = [
        ...spawns,
        ...extensions,
        ...overflow,
        ...storage,
    ].filter(Boolean);

    return prioritizedStructures;
};
