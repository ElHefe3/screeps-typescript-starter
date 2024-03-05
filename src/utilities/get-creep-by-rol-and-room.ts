export const getCreepsByRoleAndRoom = (role: string, roomName: string) => {
    return _.filter(Game.creeps, (creep) => creep.memory.role === role && creep.memory.room === roomName);
  }
