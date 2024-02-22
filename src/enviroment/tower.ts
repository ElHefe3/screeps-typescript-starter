export const defenseTower = {
  run: function(buildingId: string) {
    var tower = Game.getObjectById(buildingId) as StructureTower;

  if(tower) {
      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
          tower.attack(closestHostile);
      }
  }
}};
