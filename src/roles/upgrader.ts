import { scavengerAttribute } from "attributes";

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
            const controllerStorage = Game.getObjectById('65d7b6e3ab0f7711d3a144a2') as StructureStorage;
            if(creep.withdraw(controllerStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(controllerStorage);
            }

            if(!controllerStorage) scavengerAttribute(creep);
        }
	}
};
