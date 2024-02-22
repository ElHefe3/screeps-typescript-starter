import { defenseTower } from "enviroment";
import lifecycleManager from "enviroment/lifecycle";
import { roleHarvester, roleUpgrader, roleBuilder, roleMaintainer, roleHauler } from "roles";
import { spawnCreepWithRole } from "utilities";
import { ErrorMapper } from "utils/ErrorMapper";
import "enviroment/utils";

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

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

const CREEP_NAMES = ['harvester', 'upgrader', 'builder', 'hauler', 'maintainer'];

const MAX_CREEPS = {
  HARVESTER: 2,
  BUILDER: 4,
  UPGRADER: 5,
  HAULER: 4,
  MAINTAINER: 2,
};

var tickCount = 0;
var cpuOverTime = 0;

export const loop = ErrorMapper.wrapLoop(() => {
  if (Game.time % 1000 === 0) {
      Memory.replacementsNeeded = [];
  }

  defenseTower.run('65d72dfdab0f7711d3a110f4');

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

  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
  const haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');
  const maintainers = _.filter(Game.creeps, (creep) => creep.memory.role === 'maintainer');

  if(harvesters.length < MAX_CREEPS.HARVESTER) {
      spawnCreepWithRole('Spawn1', 'harvester', [WORK, WORK, WORK, WORK, WORK, MOVE]);
  }

  else if(builders.length < MAX_CREEPS.BUILDER) {
      spawnCreepWithRole('Spawn1', 'builder');
  }

  else if(upgraders.length < MAX_CREEPS.UPGRADER) {
      spawnCreepWithRole('Spawn1', 'upgrader');
  }

  else if(haulers.length < MAX_CREEPS.HAULER) {
      spawnCreepWithRole('Spawn1', 'hauler', [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]);
  }

  else if(maintainers.length < MAX_CREEPS.MAINTAINER) {
      spawnCreepWithRole('Spawn1', 'maintainer');
  }

  new RoomVisual().text(
    `Creeps `,
    2,
    2,
    {align: 'left', opacity: 0.8, color: 'green', strokeWidth: 2}
  );

  for (let i = 0; i < CREEP_NAMES.length; i++) {
    const creepName = CREEP_NAMES[i];
    const numberOfCreep = _.filter(Game.creeps, (creep) => creep.memory.role === creepName).length;
    const maxCreepNumber = MAX_CREEPS[creepName.toUpperCase() as keyof typeof MAX_CREEPS];
    new RoomVisual().text(
      `${creepName}: ${numberOfCreep} / ${maxCreepNumber}`,
      2,
      3 + i,
      {align: 'left', opacity: 0.8}
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
      if(creep.memory.role == 'hauler') {
          roleHauler(creep);
      }
      if(creep.memory.role == 'maintainer') {
          roleMaintainer.run(creep);
      }
  }
});
