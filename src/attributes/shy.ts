import { walkThisWay } from "utilities";

var MAX_CREEPS_AT_SOURCE = 2;

export const shyAttribute = (creep: Creep) => {
    var source = creep.pos.findClosestByPath(FIND_SOURCES, {
        filter: (s) => s.pos.findInRange(FIND_MY_CREEPS, 1).length < MAX_CREEPS_AT_SOURCE
    }) as Source;

    if (!source) {
        source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) as Source;
    }

    walkThisWay.harvest(creep, source);
}
