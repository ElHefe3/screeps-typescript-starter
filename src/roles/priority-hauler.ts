// todo: use the creep's memory alongside their limb count to determine if they are overpopulated

import { scavengerAttribute } from "attributes";
import { reaction, walkThisWay } from "utilities";

export const rolePriorityHauler = (creep: Creep) => {
    const destination = new RoomPosition(
        creep?.memory?.destination?.x ?? 12,
        creep?.memory?.destination?.y ?? 26,
        creep?.memory?.destination?.roomName ?? 'W8N7'
    );

    const priorityBuildingsFlag = Game.flags["priority-buildings-border"];
    const isPriorityBuildingsOn = priorityBuildingsFlag?.color === COLOR_BLUE;

    const intentionTrackingFlag = Game.flags["intention-tracking"];
    const isIntentionTrackingOn = intentionTrackingFlag && intentionTrackingFlag?.color === COLOR_BLUE;

    if (isIntentionTrackingOn){
        // 💡 info: for drawing on screen
        new RoomVisual(creep.room.name).circle(destination, {fill: 'transparent', radius: 0.55, stroke: 'red'});
        // 💡 info: line between creep and destination
        new RoomVisual(creep.room.name).line(creep.pos, destination, {color: 'red'});
    }



    if (creep.memory?.hauling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
    }

    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
    }

    if (creep.memory.hauling) {
        const spawns = creep.room.find(FIND_MY_SPAWNS);
        const depletedSpawns = spawns.filter((spawn) => spawn.store?.getFreeCapacity(RESOURCE_ENERGY) > 0);

        const extensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure: StructureExtension) =>
                structure.structureType === STRUCTURE_EXTENSION &&
                structure.store?.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        const controllerStorage = Game.getObjectById('65d7b6e3ab0f7711d3a144a2') as StructureContainer;

        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure: StructureTower) =>
                structure.structureType === STRUCTURE_TOWER &&
                structure.store?.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        const storage: StructureStorage[] = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure: StructureStorage) =>
                structure.structureType === STRUCTURE_STORAGE &&
                structure.store?.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        const doesControllerNeedsResource =
            controllerStorage.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

        const overflow = doesControllerNeedsResource ? [controllerStorage] : towers;

        const prioritizedStructures = [
                ...depletedSpawns,
                ...extensions,
                ...overflow,
                ...towers,
                ...storage,
            ] as CapacityEnabledStructures[];

        reaction.run(creep, prioritizedStructures[0]);

        creep.memory.destination = prioritizedStructures[0].pos;

        if (isPriorityBuildingsOn) {
            // 💡 info: encircle all prioritized structures
            prioritizedStructures.forEach((structure) => {
                new RoomVisual(creep.room.name).circle(structure.pos, {fill: 'transparent', radius: 0.55, stroke: 'green'});
            });
        }

        const target: CapacityEnabledStructures = prioritizedStructures[0];

        walkThisWay.transfer(creep, target);

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.hauling = false;
        }
    } else {
        scavengerAttribute(creep);
    }
}
