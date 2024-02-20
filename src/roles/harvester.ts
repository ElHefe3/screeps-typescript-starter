import { shyAttribute } from "attributes";
import { roleUpgrader } from "./upgrader";


export const roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            shyAttribute(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });

            targets.sort((a,b) => {
                if(a.structureType == STRUCTURE_CONTAINER && b.structureType != STRUCTURE_CONTAINER) return 1;
                if(a.structureType != STRUCTURE_CONTAINER && b.structureType == STRUCTURE_CONTAINER) return -1;
                return 0;
            });

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleUpgrader.run(creep)
            }
        }
	}
};
