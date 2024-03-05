import { roleHarvester, roleUpgrader, roleBuilder, roleMaintainer, roleHauler, roleColonizer } from "roles";
import lifecycleManager from "environment/lifecycle";
import { ErrorMapper } from "utils/ErrorMapper";
import { defenseProtocol, spawnCreepWithRole } from "utilities";
import { defcon, tower } from "environment";
import "environment/utils";
import { roleDefender } from "roles/attack-creeps";
import { roleRemoteMiner } from "roles/remote-miner";
import { cleanupCompletedTasks, roomManager, taskManager, completeAllTasksOfType } from "core";
import { defconProtocol } from "defense-protocol/defense-protocol";
import { recoveryMain } from "recovery/recovery";
import { roleBlockade } from "roles/blockade";
import { rolePatroller } from "roles/patrol";
import { roleScavenger } from "roles/scavenger";
import { roleAttacker } from "roles/attacker";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/creeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding properties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

const CREEP_NAMES = ['harvester', 'upgrader', 'builder', 'hauler', 'maintainer', 'remoteMiner', 'recovery', 'colonizer'];

const MAX_CREEPS = {
  HARVESTER: 2,
  BUILDER: 3,
  UPGRADER: 3,
  HAULER: 4,
  MAINTAINER: 1,
  REMOTE_MINER: 3,
  COLONIZER: 1,
  RECOVERY: 0,
  BLOCKADE: 3,
  SCAVENGER: 2,
  ATTACKERS: 0,
};

var tickCount = 0;
var cpuOverTime = 0;

export const loop = ErrorMapper.wrapLoop(() => {
  global.Function = global.Function || {};
  global.Function.cleanupCompletedTasks = cleanupCompletedTasks;
  global.Function.setTaskStatusDirectly = completeAllTasksOfType;

  defcon.run();

  const colonizeFlag = Game.flags['colonize'];
  const spawnConstructionSite = colonizeFlag.room?.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: (site) => site.structureType === STRUCTURE_SPAWN
  });
  const hasSpawnConstructionSite = spawnConstructionSite && spawnConstructionSite.length > 0;
  const spawns = colonizeFlag.room?.find(FIND_MY_SPAWNS).length;
  const hasSpawn = spawns && spawns > 0;

  // if defocon flag use defcon-protocol yelllow
  if(Game.flags['defcon'].color === COLOR_YELLOW) {
    defconProtocol.yellow('W8N7');
  }

  if (Game.time % 1000 === 0) {
      Memory.replacementsNeeded = [];
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    taskManager.initRoomTasks(room);
  }

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if(room.controller && room.controller.my) {
        roomManager.listRoomTasks(room);
    }
  }

  for(const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if(room && room.controller && room.controller.my) {
        roomManager.updateTaskStatuses(room);
    }
  }

  // use RoomVisual to display task list
  taskManager.getPendingTasksSummary(Game.rooms['W8N7']);

  if (Game.time % 500 === 0) {
    Object.values(Game.rooms).forEach(room => {
        if (room.controller && room.controller.my) {
            cleanupCompletedTasks(room);
        }
    });
  }

  RoomVisual.prototype.circle(29, 11, {fill: '#2A2A2A', radius: 1.1, opacity: 1});
  const messageIndicationFlag = Game.flags['m'];
  const messageButtonFlag = Game.flags['R'];

  if(RawMemory.foreignSegment  && RawMemory.foreignSegment.username === 'Gambit' && RawMemory.foreignSegment.id === 1) {
    messageIndicationFlag.setColor(COLOR_GREEN);
    const messageData = JSON.parse(RawMemory.foreignSegment.data);

    messageButtonFlag?.color === COLOR_GREEN &&
      RoomVisual.prototype.text((messageData), 32, 10, {color: 'white', font: 0.2, align: 'right'});
  } else {
    messageIndicationFlag.setColor(COLOR_WHITE);
  }

  defenseProtocol('65d908ccab0f7711d3a1c72f');

  lifecycleManager.cleanUpMemory();

  //lifecycleManager.handleReplacements();

  const roomName = 'W8N7';
  const cpuUsed = Game.cpu.getUsed().toFixed(2);
  const cpuLimit = Game.cpu.limit;
  const cpuBucket = Game.cpu.bucket;


  tickCount++;
  cpuOverTime = Number(cpuOverTime)+ Number(cpuUsed);

  new RoomVisual(roomName).text(
      `Room: ${roomName}
      CPU: ${cpuUsed}/${cpuLimit}, Bucket: ${cpuBucket}
      AVG: ${(cpuOverTime/tickCount).toFixed(2)}`,
      1,
      1,
      {align: 'left', opacity: 0.8}
  );

  for (const id in Memory.claimedStructures) {
    const structure = Game.getObjectById(id) as AnyStructure;
    if (!structure || structure.hits === structure.hitsMax) {
      delete Memory.claimedStructures[id];
    }
  }

  const harvesters = getCreepsByRoleAndRoom('harvester', 'W8N7');
  const builders = getCreepsByRoleAndRoom('builder', 'W8N7');
  const upgraders = getCreepsByRoleAndRoom('upgrader', 'W8N7');
  const haulers = getCreepsByRoleAndRoom('hauler', 'W8N7');
  const maintainers = getCreepsByRoleAndRoom('maintainer', 'W8N7');
  const remoteMiners = _.filter(Game.creeps, (creep) => creep.memory.role === 'remoteMiner');
  const recovery = getCreepsByRoleAndRoom('recovery', 'W8N7');
  const colonizers = _.filter(Game.creeps, (creep) => creep.memory.role === 'colonizer');
  const blockade = _.filter(Game.creeps, (creep) => creep.memory.role === 'blockade');
  const scavengers = _.filter(Game.creeps, (creep) => creep.memory.role === 'scavenger');
  const attackers = _.filter(Game.creeps, (creep) => creep.memory.role === 'attacker');

  function getCreepsByRoleAndRoom(role: string, roomName: string) {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === roomName);
  }

  if(attackers.length < MAX_CREEPS.ATTACKERS) {
    spawnCreepWithRole('Spawn1', 'attacker', [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'W8N7');
  }

  if(scavengers.length < MAX_CREEPS.SCAVENGER) {
    spawnCreepWithRole('Spawn1', 'scavenger', [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'W8N7');
  }

  if(blockade.length < MAX_CREEPS.BLOCKADE) {
    spawnCreepWithRole('Spawn1', 'blockade', [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'W8N7');
  }

  if(harvesters.length < MAX_CREEPS.HARVESTER) {
      spawnCreepWithRole('Spawn1', 'harvester', [WORK, WORK, WORK, WORK, WORK, MOVE], 'W8N7');
  }

  else if(builders.length < MAX_CREEPS.BUILDER) {
      spawnCreepWithRole('Spawn1', 'builder', [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'W8N7');
  }

  else if(haulers.length < MAX_CREEPS.HAULER) {
    spawnCreepWithRole('Spawn1', 'hauler', [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'W8N7');
  }

  else if(upgraders.length < MAX_CREEPS.UPGRADER) {
      spawnCreepWithRole('Spawn1', 'upgrader', [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], 'W8N7');
  }

  else if(maintainers.length < MAX_CREEPS.MAINTAINER) {
      spawnCreepWithRole('Spawn1', 'maintainer', [WORK, WORK, CARRY, CARRY, MOVE, MOVE], 'W8N7');
  }

  else if(remoteMiners.length < MAX_CREEPS.REMOTE_MINER) {
      spawnCreepWithRole('Spawn1', 'remoteMiner', [WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY]);
  }

  else if(recovery.length < MAX_CREEPS.RECOVERY) {
      spawnCreepWithRole('Spawn1', 'recovery', [WORK, CARRY, MOVE], 'W8N7');
  }

  else if(colonizers.length < MAX_CREEPS.COLONIZER) {
      spawnCreepWithRole('Spawn1', 'colonizer', [CLAIM, MOVE, MOVE, WORK, WORK, CARRY, CARRY], 'W8N7');
  }

  // // set colonizing flag according to stage
  // // if room claimed, set to yellow
  // if(colonizeFlag.room?.controller?.my) colonizeFlag.setColor(COLOR_YELLOW);
  // // if room has spawn construction site, set to green
  // if(hasSpawnConstructionSite) colonizeFlag.setColor(COLOR_GREEN);
  // // if room has spawn, set to blue
  if(hasSpawn) colonizeFlag.setColor(COLOR_BLUE);

  if(colonizeFlag.color === COLOR_BLUE) recoveryMain();

  new RoomVisual().text(
    `Creeps `,
    39,
    1,
    {align: 'left', opacity: 0.8, color: 'green', strokeWidth: 2, font: 0.4}
  );

  for (let i = 0; i < CREEP_NAMES.length; i++) {
    const creepName = CREEP_NAMES[i];
    const numberOfCreep = _.filter(Game.creeps, (creep) => creep.memory.role === creepName).length;
    const maxCreepNumber = MAX_CREEPS[creepName.toUpperCase() as keyof typeof MAX_CREEPS];
    new RoomVisual().text(
      `${creepName}: ${numberOfCreep} / ${maxCreepNumber}`,
      39,
      2 + i,
      {align: 'left', opacity: 0.8, font: 0.3}
    );
  }

  for(var name in Game.creeps) {
      var creep = Game.creeps[name];

      lifecycleManager.checkEndOfLife(creep);

      var structuresToRepair = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax
      });
      if(creep.memory.role == 'harvester' ) {
          roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
          roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
          const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
          if(constructionSites.length > 0) {
              roleBuilder.run(creep);
          }
          else if(structuresToRepair.length > 0){
              roleMaintainer.run(creep)
          } else {
              roleUpgrader.run(creep);
          }
      }
      if(creep.memory.role == 'hauler' && creep.memory.room === 'W8N7') {
          roleHauler.run(creep);
      }
      if(creep.memory.role == 'maintainer' && creep.memory.room === 'W8N7') {
          roleMaintainer.run(creep);
      }
      if(creep.memory.role == 'melee' && creep.memory.room === 'W8N7') {
        roleDefender.run(creep);
      }
      if(creep.memory.role == 'ranged' && creep.memory.room === 'W8N7') {
        roleDefender.run(creep);
      }
      if(creep.memory.role == 'remoteMiner') {
        roleRemoteMiner.run(creep);
      }
      if(creep.memory.role == 'recovery' && creep.memory.room === 'W8N7') {
        roleHauler.run(creep);
      }
      if(defcon.currentDefconLevel() === 0 && creep.memory.role === 'defenseHauler' && creep.room.name === 'W8N7') {
        roleHauler.run(creep);
      }
      if(creep.memory.role === 'colonizer') {
        if(creep.room.name !== colonizeFlag.pos.roomName) {
          roleColonizer.moveToColonize(creep);
        } else if(creep.room.name === colonizeFlag.pos.roomName && !creep.room.controller?.my) {
          roleColonizer.claimController(creep);
        } else if(creep.room.name === colonizeFlag.pos.roomName && !hasSpawn) {
          roleColonizer.constructSpawn(creep);
        } else {
          roleColonizer.upgradeController(creep);
        }
      }
      if(creep.memory.role === 'blockade') {
        rolePatroller.run(creep);
      }
      if(creep.memory.role === 'scavenger') {
        roleScavenger.run(creep);
      }
      if(creep.memory.role === 'attacker') {
        roleAttacker.run(creep);
      }
  }
});
