export const taskManager = {
    initRoomTasks: function(room: Room) {
        if (!room.memory.taskManager) {
            room.memory.taskManager = {
                tasks: {},
                addTask: (_task: Task, _creepType: CreepType) => {},
                removeTask: (_taskId: string, _creepType: CreepType) => {},
                getTasks: (_creepType: CreepType, _filter?: Partial<Task>) => { return []; },
                assignTask: (_creepName: string, _taskId: string, _creepType: CreepType) => { return false; },
                completeTask: (_taskId: string, _creepType: CreepType) => {}
            };
        }

        const creepTypes: CreepType[] = ['harvester', 'builder', 'upgrader', 'maintainer', 'hauler', 'remoteMiner'];
        creepTypes.forEach(creepType => {
            if (!room.memory.taskManager.tasks[creepType]) {
                room.memory.taskManager.tasks[creepType] = [];
            }
        });
    },

    addTask: function(room: Room, task: Task, creepType: CreepType) {
        if (!room.memory.taskManager.tasks[creepType]) {
            room.memory.taskManager.tasks[creepType] = [];
        }

        const existingTaskIndex = room.memory.taskManager.tasks[creepType]?.findIndex(t => t.id === task.id);

        if (existingTaskIndex === -1) {
            room.memory.taskManager.tasks[creepType]?.push(task);
        };
    },



    removeTask: function(room: Room, taskId: string, creepType: CreepType) {
        const tasks = room.memory.taskManager.tasks[creepType];
        const index: number = tasks?.findIndex(t => t.id === taskId) ?? 0;
        if (index > -1) {
            tasks?.splice(index, 1);
        }
    },

    getTasks: function(room: Room, creepType: CreepType, filter: Partial<Record<keyof Task, any>> = {}) {
        return room.memory.taskManager.tasks[creepType]!.filter(task => {
            return Object.keys(filter).every(key => {
                const taskKey = key as keyof Task;
                return task[taskKey] === filter[taskKey];
            });
        });
    },

    assignTask: function(room: Room, creepName: string, taskId: string, creepType: CreepType) {
        // @ts-expect-error
        const task = room.memory.taskManager.tasks[creepType].find(t => t.id === taskId && t.status === 'pending');
        if (task) {
            task.status = 'in-progress';
            task.assignedCreeps.push(creepName);
            return true;
        }
        return false;
    },

    completeTask: function(room: Room, taskId: string, creepType: CreepType) {
        // @ts-expect-error
        const task = room.memory.taskManager.tasks[creepType].find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            task.completedAt = Game.time;
        }
    },

    getPendingTasksSummary: function(room: Room) {
        if (!room.memory.taskManager || !room.memory.taskManager.tasks) {
            console.log('Task Manager is not initialized for room:', room.name);
            return;
        }

        const tasks = room.memory.taskManager.tasks;
        let yPos = 2; // Starting Y position for drawing task list

        Object.entries(tasks as Record<CreepType, Task[]>).forEach(([creepType, tasksForType]) => {
            const pendingTasks = tasksForType.filter(task => task.status === 'pending');

            // Check if there are any pending tasks to display
            if (pendingTasks.length > 0) {
                // Display each pending task
                if (pendingTasks.length > 0) {
                    // Start with the role/creepType, followed by a square for each pending task
                    let visualRepresentation = `${creepType}: `;

                    // Display the visual representation at the current yPos, then increment yPos for the next line
                    new RoomVisual(room.name).text(`🏗️ x ${pendingTasks.length}`, 1, yPos++, {align: 'left', color: 'yellow'});
                }
            }
        });
    },

};
