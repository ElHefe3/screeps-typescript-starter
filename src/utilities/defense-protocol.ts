import { tower } from "environment";

export const defenseProtocol = (towerId: string) => {
    const spawn = Game.spawns['Spawn1'];
    if (!spawn) return;

    const hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);
    const numberOfHostiles = hostiles.length;

    if (numberOfHostiles === 4) {
        tower.quadsDefenseProtocol(towerId);

        spawnAttackCreeps(spawn);
    } else if (numberOfHostiles > 0) {
        tower.runDefenseProtocol(towerId);

        spawnAttackCreeps(spawn);
    } else {
        tower.maintenanceProtocol(towerId);
    }
};

const spawnAttackCreeps = (spawn: StructureSpawn) => {
    if (spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
        if (_.filter(Game.creeps, (creep) => creep.memory.role == 'melee').length < 1) {
            const newName = 'Melee' + Game.time;
            spawn.spawnCreep([MOVE, ATTACK], newName, { memory: { role: 'melee', working: false, room: 'W8N7', errors: [] } });
        }

        if (_.filter(Game.creeps, (creep) => creep.memory.role == 'ranged').length < 2) {
            for (let i = 0; i < 2; i++) {
                const newName = 'Ranged' + Game.time + "-" + i;
                spawn.spawnCreep([MOVE, RANGED_ATTACK], newName, { memory: { role: 'ranged', working: false, room: 'W8N7', errors: [] } });
            }
        }
    }
}
