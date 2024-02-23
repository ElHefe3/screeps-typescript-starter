export function insertError(creep: Creep, error: string): void {
    const creepMemory: CreepMemory = creep.memory;
    if (!creepMemory.errors) {
        creepMemory.errors = [];
    }
    creepMemory.errors.push(error);
}

