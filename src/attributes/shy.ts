var MAX_CREEPS_AT_SOURCE = 2;

export const shyAttribute = (creep: Creep) => {
    var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
        filter: (s) => s.pos.findInRange(FIND_MY_CREEPS, 1).length < MAX_CREEPS_AT_SOURCE
    });

    if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }

    if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}
