import { scavengerAttribute } from "attributes";

export const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {
		const priorityBuildingsFlag = Game.flags["priority-buildings-border"];
    	const isPriorityBuildingsOn = priorityBuildingsFlag?.color === COLOR_BLUE;

		const intentionTrackingFlag = Game.flags["intention-tracking"];
    	const isIntentionTrackingOn = intentionTrackingFlag && intentionTrackingFlag?.color === COLOR_BLUE;

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🏗️');
	    }

	    if(creep.memory.building) {
	        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

			if (isPriorityBuildingsOn) {
				// 💡 info: encircle all prioritized structures
				targets.forEach((structure) => {
					new RoomVisual(creep.room.name).circle(structure.pos, {fill: 'transparent', radius: 0.55, stroke: 'yellow'});
				});
			}

			if (isIntentionTrackingOn){
				// 💡 info: for drawing on screen
				new RoomVisual(creep.room.name).circle(targets?.[0].pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
				// 💡 info: line between creep and destination
				new RoomVisual(creep.room.name).line(creep.pos, targets?.[0].pos, {color: 'orange'});
			}

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
