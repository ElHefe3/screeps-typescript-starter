import { AbundanceMentalityAttribute } from "attributes";
import { walkThisWay } from "utilities";
import { taskManager } from "core";

export const roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }

	    if (creep.memory.building) {
            let buildTask = creep.memory.currentTask && taskManager.getTasks(creep.room, 'builder', { id: creep.memory.currentTask }).pop();

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
            AbundanceMentalityAttribute(creep);
        }
	}
};
