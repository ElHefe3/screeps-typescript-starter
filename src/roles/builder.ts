import { scavengerAttribute } from "attributes";

export const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 haul');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(targets[0]);
                }
            }
	    } else {
            scavengerAttribute(creep);
	    }
	}
};
