export const spawnCreepWithRole = (spawnName: string, role: string, bodyParts?: BodyPartConstant[]) => {
    const newName = role + Game.time;
    const body = bodyParts ?? [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
    const memory: CreepMemory = {
        role: role,
        room: "",
        working: false,
        errors: []
    };

    const spawnResult = Game.spawns[spawnName].spawnCreep(body, newName, { memory: memory });

    // if (spawnResult === OK) {
    //     console.log('Spawning new ' + role + ': ' + newName);
    // } else {
    //     console.log('Failed to spawn new ' + role + '. Error: ' + spawnResult);
    // }
    return spawnResult;
}
