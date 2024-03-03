export const findStructuresToRepair = (room: Room) => {
    let containersToRepair = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax
    });

    let otherStructuresToRepair = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType !== STRUCTURE_WALL &&
                                structure.structureType !== STRUCTURE_CONTAINER &&
                                structure.structureType !== STRUCTURE_RAMPART &&
                                structure.hits < structure.hitsMax
    });

    let wallsToRepair = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax
    });

    // Sorting logic for each category
    containersToRepair.sort((a, b) => a.hits - b.hits);
    otherStructuresToRepair.sort((a, b) => a.hits - b.hits);
    wallsToRepair.sort((a, b) => a.hits - b.hits);

    // Combine the sorted arrays
    const structuresToRepair = [...containersToRepair, ...otherStructuresToRepair, ...wallsToRepair];

    // filter structures not in the same room
    return structuresToRepair.filter((structure) => structure.room.name === room.name);
}
