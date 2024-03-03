import { scavengerAttribute } from "attributes";
import { taskManager } from "core";
import { walkThisWay } from "utilities";

// Ensure Memory structure for claimed repairs
if (!Memory.claimedStructures) {
    Memory.claimedStructures = [];
}

export const roleMaintainer = {
    run(creep: Creep): void {
        if (creep.memory.maintaining && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.maintaining = false;
            creep.say('🔄');
        }

        if (!creep.memory.maintaining && creep.store.getFreeCapacity() === 0) {
            creep.memory.maintaining = true;
            creep.say('🔧');
        }

        if (creep.memory.maintaining) {
            let maintenanceTask  = creep.memory.currentTask && taskManager.getTasks(creep.room, 'maintainer', { id: creep.memory.currentTask }).pop();

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
