import { scavengerAttribute } from "attributes";
import { walkThisWay } from "utilities";
import { taskManager } from "core";

if (!Memory.claimedStructures) {
    Memory.claimedStructures = [];
}

export const roleMaintainer = {
    run(creep: Creep): void {
        if (creep.memory.maintaining && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.maintaining = false;
        }

        if (!creep.memory.maintaining && creep.store.getFreeCapacity() === 0) {
            creep.memory.maintaining = true;
        }

        const currentTaskInMemory = creep.memory.currentTask ?
            taskManager.getTask(creep.room, 'maintainer', creep.memory.currentTask) as Task : null;

        if (creep.memory.maintaining) {
            if(currentTaskInMemory?.status === 'completed') creep.memory.currentTask = undefined;

            let maintenanceTask  = creep.memory.currentTask ? currentTaskInMemory : null;

            if (!maintenanceTask) {
                const maintenanceTasks = taskManager.getTasks(creep.room, 'maintainer', { status: 'pending' });
                if (maintenanceTasks.length > 0) {
                    maintenanceTask = maintenanceTasks[0];
                    creep.memory.currentTask = maintenanceTask.id;
                }
            }

            if (maintenanceTask) {
                const target = Game.getObjectById(maintenanceTask.id) as HitpointEnabledStructures | null;
                if (target) {
                    walkThisWay.repair(creep, target);
                } else {
                    delete creep.memory.currentTask;
                }
            }
        } else {
            scavengerAttribute(creep);
        }
    }
}
