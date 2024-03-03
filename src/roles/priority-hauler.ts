// todo: use the creep's memory alongside their limb count to determine if they are overpopulated

import { AbundanceMentalityAttribute } from "attributes";
import { taskManager } from "core";
import { walkThisWay } from "utilities";

export const rolePriorityHauler = (creep: Creep) => {
    const currentTaskInMemory = creep.memory.currentTask ?
        taskManager.getTasks(creep.room, 'hauler', { id: creep.memory.currentTask })[0] as Task : null;

    if (creep.memory?.hauling && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
    }

    if (!creep.memory.hauling && creep.store.getFreeCapacity() === 0) {
        creep.memory.hauling = true;
    }

    if (creep.memory.hauling) {
        if(currentTaskInMemory?.status === 'completed') creep.memory.currentTask = undefined;

        let haulTask  = creep.memory.currentTask ? currentTaskInMemory : null;

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
                new RoomVisual(creep.room.name).line(creep.pos, target?.pos, { color: 'green' });
                walkThisWay.transfer(creep, target);
            } else {
                delete creep.memory.currentTask;
            }
        }

    } else {
        AbundanceMentalityAttribute(creep);
    }
}
