import { taskManager } from "./task-manager";

interface RoomManager {
    listRoomTasks: (room: Room) => void;
    updateTaskStatuses: (room: Room) => void;
}

const roomManager: RoomManager = {
    listRoomTasks: function(room: Room) {
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        for (const site of constructionSites) {
            const buildTask = {
                id: site.id.toString(),
                type: 'build' as const ,
                status: 'pending' as const,
                priority: 1,
                maxCreeps: 2,
                assignedCreeps: [] satisfies string[],
            };

            taskManager.addTask(room, buildTask, 'builder');
        }
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
                        console.log(`Task ${task.id} completed and marked as such.`);
                    }
                }

                // Add similar checks for other task types here...
            });
        });
    }

        // Add more checks for different tasks (repair, upgrade, etc.) here
};

export { roomManager };
