import { scavengerAttribute } from "attributes";
import { taskManager } from "core";
import { walkThisWay } from "utilities";

export const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🏗️');
	    }

	    if (creep.memory.building) {
            let buildTask = creep.memory.currentTask && taskManager.getTasks(creep.room, 'builder', { id: creep.memory.currentTask }).pop();
            new RoomVisual(creep.room.name).text('🏗️', creep.pos.x, creep.pos.y, { align: 'center', opacity: 0.8 });
            //circle builder creep
            new RoomVisual(creep.room.name).circle(creep.pos, { fill: 'transparent', radius: 0.55, stroke: '#ffcc00', strokeWidth: 0.15 });

            if (!buildTask) {
                const buildTasks = taskManager.getTasks(creep.room, 'builder', { status: 'pending' });
                if (buildTasks.length > 0) {
                    buildTask = buildTasks[0];
                    creep.memory.currentTask = buildTask.id;
                }
            }

            if (buildTask) {
                const target = Game.getObjectById(buildTask.id) as ConstructionSite | null;
                if (target) {
                    walkThisWay.build(creep, target);
                } else {
                    delete creep.memory.currentTask;
                }
            }
        } else {
            scavengerAttribute(creep);
        }
	}
};
