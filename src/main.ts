import lifecycleManager from "enviroment/lifecycle";
import { roleHarvester, roleUpgrader, roleBuilder, roleMaintainer, roleHauler } from "roles";
import { spawnCreepWithRole } from "utilities";
import { ErrorMapper } from "utils/ErrorMapper";

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

const MAX_HARVESTERS = 2;
const MAX_BUILDERS = 2;
const MAX_UPGRADERS = 4;
const MAX_HAULERS = 2;

var tickCount = 0;
var cpuOverTime = 0;

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  if (Game.time % 1000 === 0) {
      Memory.replacementsNeeded = [];
  }

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

  if(harvesters.length < MAX_HARVESTERS) {
      spawnCreepWithRole('Spawn1', 'harvester', [WORK, WORK, WORK, WORK, WORK, MOVE]);
  }

  else if(builders.length < MAX_BUILDERS) {
      spawnCreepWithRole('Spawn1', 'builder');
  }

  else if(upgraders.length < MAX_UPGRADERS) {
      spawnCreepWithRole('Spawn1', 'upgrader');
  }

  else if(haulers.length < MAX_HAULERS) {
      spawnCreepWithRole('Spawn1', 'hauler', [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]);
  }

  new RoomVisual().text(
    `Creeps `,
    2,
    2,
    {align: 'left', opacity: 0.8, color: 'green', strokeWidth: 2}
  );

  new RoomVisual().text(
    `Harvesters: ${harvesters.length} / ${MAX_HARVESTERS}`,
    2,
    3,
    {align: 'left', opacity: 0.8}
  );

  new RoomVisual().text(
    `Builders: ${builders.length} / ${MAX_BUILDERS}`,
    2,
    4,
    {align: 'left', opacity: 0.8}
  );

  new RoomVisual().text(
    `Upgraders: ${upgraders.length} / ${MAX_UPGRADERS}`,
    2,
    5,
    {align: 'left', opacity: 0.8}
  );

  new RoomVisual().text(
    `Haulers: ${haulers.length} / ${MAX_HAULERS}`,
    2,
    6,
    {align: 'left', opacity: 0.8}
  );

  // var tower = Game.getObjectById('c75fbe01690966767058b908');
  // if(tower) {
  //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //         filter: (structure) => structure.hits < structure.hitsMax
  //     });
  //     if(closestDamagedStructure) {
  //         tower.repair(closestDamagedStructure);
  //     }

  //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //     if(closestHostile) {
  //         tower.attack(closestHostile);
  //     }
  // }

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
  }
});
