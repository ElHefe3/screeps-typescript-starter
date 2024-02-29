export const cleanupCompletedTasks = (room: Room) => {
    if (!room.memory.taskManager) return;

    const currentTasks = room.memory.taskManager.tasks;
    if (!currentTasks) return;

    const expirationTicks = 500;
    const currentTime = Game.time;

    Object.keys(currentTasks).forEach((key) => {
        const creepType = key as CreepType;

        const tasksForCreepType = currentTasks[creepType];
        if (tasksForCreepType) {
            const updatedTasks = tasksForCreepType.filter((task: Task) =>
                task.status !== 'completed' || (task.completedAt && currentTime - task.completedAt < expirationTicks)
            );

            room.memory.taskManager.tasks[creepType] = updatedTasks;
        }
    });
};
