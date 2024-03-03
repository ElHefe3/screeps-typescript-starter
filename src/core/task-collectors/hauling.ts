    export const findHaulingTasks = (room: Room) => {
        const spawns = room.find(FIND_MY_SPAWNS).filter((spawn) => spawn.room.name === room.name);
        if(spawns.length > 0) {
            new RoomVisual(room.name).circle(spawns[0].pos, { fill: 'transparent', radius: 0.55, stroke: 'green' });
        }

        if(spawns.length > 0) {
            new RoomVisual(room.name).circle(spawns[0].pos, { fill: 'transparent', radius: 0.55, stroke: 'green' });
        }

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

        const overflow = doesControllerNeedsResource && controllerStorage ? [controllerStorage] : [];

        const prioritizedStructures = [
            ...spawns,
            ...extensions,
            ...overflow,
            ...towers,
            ...storage,
        ].filter(Boolean);

        return prioritizedStructures;
    };
