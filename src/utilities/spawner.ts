export const spawnCreepWithRole = (spawnName: string, role: string) => {
    const newName = role + Game.time;
    const body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    const memory: CreepMemory = {
        role: role,
        room: "",
        working: false,
        harvesting: false,
        building: false,
        upgrading: false
    };

    const spawnResult = Game.spawns[spawnName].spawnCreep(body, newName, { memory: memory });

    // if (spawnResult === OK) {
    //     console.log('Spawning new ' + role + ': ' + newName);
    // } else {
    //     console.log('Failed to spawn new ' + role + '. Error: ' + spawnResult);
    // }
    return spawnResult;
}
