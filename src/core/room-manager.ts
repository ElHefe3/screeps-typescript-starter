import { findHaulingTasks } from "./task-collectors/hauling";
import { findStructuresToRepair } from "./task-collectors/maintenance";
import { taskManager } from "./task-manager";

interface RoomManager {
    listRoomTasks: (room: Room) => void;
    updateTaskStatuses: (room: Room) => void;
}

const STRUCTURE_PRIORITY = {
    spawn: 1,
    extension: 2,
    container: 3,
    tower: 4,
    storage: 5,
};

const roomManager: RoomManager = {
    listRoomTasks: function(room: Room) {
        // construction sites
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        for (const site of constructionSites) {
            const buildTask = {
                id: site.id.toString(),
                type: 'build' as const ,
                status: 'pending' as const,
                priority: 1,
                maxCreeps: 3,
                assignedCreeps: [] satisfies string[],
            };

            taskManager.addTask(room, buildTask, 'builder');
        }

        // maintenance tasks
        findStructuresToRepair(room).forEach(structure => {
            const repairTask = {
                id: structure.id.toString(),
                type: 'repair' as const,
                status: 'pending' as const,
                priority: 1,
                maxCreeps: 2,
                assignedCreeps: [] satisfies string[],
            };

            taskManager.addTask(room, repairTask, 'maintainer');
        });

        // hauling tasks
        findHaulingTasks(room).forEach(structure => {
            const haulTask = {
                id: structure.id.toString(),
                type: 'haul' as const,
                status: 'pending' as const,
                priority: STRUCTURE_PRIORITY[structure.structureType as keyof typeof STRUCTURE_PRIORITY],
                maxCreeps: 4,
                assignedCreeps: [] satisfies string[],
            };

            taskManager.addTask(room, haulTask, 'hauler');
        });

    },

    updateTaskStatuses: function(room: Room) {
        if (!room.memory.taskManager || !room.memory.taskManager.tasks) {
            console.log(`Task Manager not initialized for room: ${room.name}`);
            return;
        }

        const tasks = room.memory.taskManager.tasks;

        Object.keys(tasks).forEach(creepType => {
            // @ts-ignore
            tasks[creepType].forEach(task => {
                if (task.type === 'build' && task.status === 'pending') {
                    const target = Game.getObjectById(task.id);
                    if (!target) {
                        task.status = 'completed';

                    }
                }

                if (task.type === 'repair' && task.status === 'pending') {
                    const target = Game.getObjectById(task.id) as HitpointEnabledStructures;
                    if (!target || target.hits === target.hitsMax) {
                        task.status = 'completed';

                    }
                }

                if (task.type === 'haul' && task.status === 'pending') {
                    const target = Game.getObjectById(task.id) as CapacityEnabledStructures;
                    if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                        task.status = 'completed';

                    }
                }
            });
        });
    }

        // Add more checks for different tasks (repair, upgrade, etc.) here
};

export { roomManager };
