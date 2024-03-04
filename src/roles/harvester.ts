import { walkThisWay } from "utilities";

const MAX_HARVESTERS_AT_SOURCE = 2;

export const roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        var source: Source | null = null;

        if (creep.memory.role === 'harvester') {
            source = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => s.pos.findInRange(FIND_MY_CREEPS, 1).length < MAX_HARVESTERS_AT_SOURCE
            }) as Source;
        }

        if (!source) {
            source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE) as Source;
        }

        walkThisWay.harvest(creep, source);
	}
};
