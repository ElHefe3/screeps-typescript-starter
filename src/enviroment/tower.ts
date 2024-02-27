export const defenseTower = {
  run: function(buildingId: string) {
      const tower = Game.getObjectById(buildingId) as StructureTower;

      if(tower) {
          var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
          if(closestHostile) {
              tower.attack(closestHostile);
          } else {
              const ramparts = tower.room.find(FIND_STRUCTURES, {
                  filter: (structure) => structure.structureType === STRUCTURE_RAMPART
              });

              if(ramparts.length > 0) {
                  const targetRampart = ramparts.reduce((lowest, rampart) => {
                      return (lowest.hits < rampart.hits) ? lowest : rampart;
                  });

                  if(targetRampart.hits < 80000) {
                      tower.repair(targetRampart);
                  }
              }
          }
      }
  }
};
