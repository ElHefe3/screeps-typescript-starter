  //disable ts using comments
  // @ts-ignore
  export const completeAllTasksOfType = (roomName, creepType) => {
    // Ensure the room and task manager are correctly initialized
    if (!Game.rooms[roomName] || !Game.rooms[roomName].memory.taskManager || !Game.rooms[roomName].memory.taskManager.tasks) {
        console.log(`Task Manager not initialized for room ${roomName}, or room does not exist.`);
        return;
    }

    // Access the tasks for the specified creep type
    // @ts-ignore
    const tasks = Game.rooms[roomName].memory.taskManager.tasks[creepType];
    if (!tasks) {
        console.log(`No tasks found for creep type ${creepType} in room ${roomName}.`);
        return;
    }

    // Update each task's status to 'completed'
    // @ts-ignore
    tasks.forEach(task => {
        task.status = 'completed';
    });

    console.log(`All tasks for ${creepType} in room ${roomName} have been marked as completed.`);
  }
