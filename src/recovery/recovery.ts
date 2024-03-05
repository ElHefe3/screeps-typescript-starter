// @ts-ignore

import { spawnCreepWithRole } from "utilities";
import { roleRecoveryBuilder } from "./recovery-builder";
import { roleHarvester, roleHauler } from "roles";
import { roleRecoveryUpgrader } from "./recovery-upgrader";
import { getCreepsByRoleAndRoom } from "utilities/get-creep-by-rol-and-room";

const CREEP_NAMES = ['harvester', 'upgrader', 'builder'];

const MAX_CREEPS = {
    HARVESTER: 2,
    BUILDER: 3,
    UPGRADER: 1,
    HAULER: 2,
  };

const roleRecoveryBot = {
    harvest: function(creep: Creep) {
        // harvest and transfer to hauler
        roleHarvester.run(creep);
    },

    build: function(creep: Creep) {
        // harvest and build
        roleRecoveryBuilder.run(creep);
    },

    upgrade: function(creep: Creep) {
        // harvest and upgrade
        roleRecoveryUpgrader.run(creep);
    },

    haul: function(creep: Creep) {
        // haul from harvester to spawn
        roleHauler.run(creep);
    }
};

export const recoveryMain = () => {
    const colonizeFlag = Game.flags['colonize'];
    const colonizeRoom = colonizeFlag ? colonizeFlag.pos.roomName : null;

    // // Filter creeps based on their role and current room
    // const harvesters = _.filter(Game.creeps, (creep) =>
    //     creep.memory.role === 'harvester' && creep.room.name === colonizeRoom);
    // const builders = _.filter(Game.creeps, (creep) =>
    //     creep.memory.role === 'builder' && creep.room.name === colonizeRoom);
    // const upgraders = _.filter(Game.creeps, (creep) =>
    //     creep.memory.role === 'upgrader' && creep.room.name === colonizeRoom);
    // const haulers = _.filter(Game.creeps, (creep) =>
    //     creep.memory.role === 'hauler' && creep.room.name === colonizeRoom);

    const harvesters = getCreepsByRoleAndRoom('harvester', colonizeRoom ?? '');
    const builders = getCreepsByRoleAndRoom('builder', colonizeRoom ?? '');
    const upgraders = getCreepsByRoleAndRoom('upgrader', colonizeRoom ?? '');
    const haulers = getCreepsByRoleAndRoom('hauler', colonizeRoom ?? '');

    const constructionSites = Game.spawns['Spawn2'].room.find(FIND_CONSTRUCTION_SITES);

    const repairSites = Game.spawns['Spawn2'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL);
        }
    });

    const hasNeedForBuilders = constructionSites.length > 0 || repairSites.length > 0;

    if(harvesters.length < MAX_CREEPS.HARVESTER) {
        spawnCreepWithRole('Spawn2', 'harvester', [WORK, WORK, WORK, WORK, MOVE], colonizeRoom ?? undefined);
    }
    if(builders.length < MAX_CREEPS.BUILDER && hasNeedForBuilders) {
        spawnCreepWithRole('Spawn2', 'builder', [WORK, CARRY, MOVE], colonizeRoom ?? undefined);
    }
    if(upgraders.length < MAX_CREEPS.UPGRADER) {
        spawnCreepWithRole('Spawn2', 'upgrader', [WORK, WORK, WORK, CARRY, CARRY, MOVE], colonizeRoom ?? undefined);
    }
    if(haulers.length < MAX_CREEPS.HAULER) {
        spawnCreepWithRole('Spawn2', 'hauler', [CARRY, CARRY, CARRY, CARRY, MOVE], colonizeRoom ?? undefined);
    }

    for (var name in Game.creeps) {
        try {
            var creep = Game.creeps[name];
            if (creep.memory.role === 'harvester' && creep.memory.room === colonizeRoom) {
                roleRecoveryBot.harvest(creep);
            }
            if (creep.memory.role === 'builder' && creep.memory.room === colonizeRoom) {
                roleRecoveryBot.build(creep);
            }
            if (creep.memory.role === 'upgrader' && creep.memory.room === colonizeRoom) {
                roleRecoveryBot.upgrade(creep);
            }
            if (creep.memory.role === 'hauler' && creep.memory.room === colonizeRoom) {
                roleRecoveryBot.haul(creep);
            }
        } catch (e) {
            console.log(e);
        }
    }
}
