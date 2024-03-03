import { scavengerAttribute } from "attributes";
import { idle } from "./idle";

export const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡');
	    }

	    if(creep.memory.upgrading) {
            if(creep.room.controller) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller);
                }
            }
        }
        else {
            const controllerStorage = Game.getObjectById('65e2e7dcdf997c11d9834f4f') as StructureStorage;
            if(creep.withdraw(controllerStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(controllerStorage);
            }

            if(!controllerStorage) scavengerAttribute(creep);
        }

        const controllerStorage = Game.getObjectById('65e2e7dcdf997c11d9834f4f') as StructureStorage;

        if(controllerStorage?.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            idle.run(creep);
        }
	}
};
