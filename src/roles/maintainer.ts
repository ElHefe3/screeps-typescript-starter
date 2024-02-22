import { scavengerAttribute } from "attributes";

// Ensure Memory structure for claimed repairs
if (!Memory.claimedStructures) {
    Memory.claimedStructures = [];
}

export const roleMaintainer = {
    run(creep: Creep): void {
        if (!Memory.claimedStructures) {
            Memory.claimedStructures = {};
        }

        if(creep.memory.maintaining && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.maintaining = false;
            creep.say('🔄 gather');
            // Unclaim the structure when switching to gathering
            if (creep.memory.structureBeingRepaired) {
                delete Memory.claimedStructures[creep.memory.structureBeingRepaired];
                delete creep.memory.structureBeingRepaired;
            }
        }

        if(!creep.memory.maintaining && creep.store.getFreeCapacity() === 0) {
            creep.memory.maintaining = true;
            creep.say('🛠 repair');
        }

        // Find and prioritize containers, then other structures, excluding walls
        let containersToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax
        });

        let otherStructuresToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType !== STRUCTURE_WALL &&
                                    structure.structureType !== STRUCTURE_CONTAINER &&
                                    structure.hits < structure.hitsMax
        });

        let wallsToRepair = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax
        });

        // Sorting logic for each category
        containersToRepair.sort((a, b) => a.hits - b.hits);
        otherStructuresToRepair.sort((a, b) => a.hits - b.hits);
        wallsToRepair.sort((a, b) => a.hits - b.hits);

        // Combine the sorted arrays
        let structuresToRepair = [...containersToRepair, ...otherStructuresToRepair, ...wallsToRepair];

        if(creep.memory.maintaining) {
            let target = null;
            const structureBeingRepaired = Game.getObjectById(creep.memory.structureBeingRepaired ?? '') as AnyStructure;

            // Attempt to claim and assign a new target if not already assigned or target is fully repaired
            if (!creep.memory.structureBeingRepaired ||
                (creep.memory.structureBeingRepaired &&
                 (!Memory.claimedStructures[creep.memory.structureBeingRepaired] ||
                  structureBeingRepaired.hits === structureBeingRepaired.hitsMax))) {
                for (const structure of structuresToRepair) {
                    if (!Memory.claimedStructures[structure.id]) {
                        target = structure;
                        Memory.claimedStructures[structure.id] = true; // Mark as claimed
                        creep.memory.structureBeingRepaired = structure.id; // Remember the target
                        break;
                    }
                }
            } else {
                target = Game.getObjectById(creep.memory.structureBeingRepaired) as AnyStructure;
            }

            if (target) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if (target.hits === target.hitsMax) {
                    // Repair complete, unclaim structure
                    delete Memory.claimedStructures[target.id];
                    delete creep.memory.structureBeingRepaired;
                }
            }
        } else {
            scavengerAttribute(creep);
        }
    }
}
