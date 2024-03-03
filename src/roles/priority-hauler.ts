// todo: use the creep's memory alongside their limb count to determine if they are overpopulated

import { scavengerAttribute } from "attributes";
import { taskManager } from "core";
import { walkThisWay } from "utilities";

export const rolePriorityHauler = (creep: Creep) => {
    if (creep.memory?.hauling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
    }

    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
    }

    if (creep.memory.hauling) {
        let haulTask  = creep.memory.currentTask ?
            taskManager.getTasks(creep.room, 'hauler', { id: creep.memory.currentTask })[0] as Task : null;

        if(!haulTask) {
            const haulTasks = taskManager.getTasks(creep.room, 'hauler', { status: 'pending' });
            if (haulTasks.length > 0) {
                haulTask = haulTasks[0];
                creep.memory.currentTask = haulTask.id;
            }
        }

        if (haulTask) {
            const target = Game.getObjectById(haulTask.id) as StructureStorage | null;
            if (target) {
                walkThisWay.transfer(creep, target);
            } else {
                delete creep.memory.currentTask;
            }
        }

    } else {
        scavengerAttribute(creep);
    }
}
