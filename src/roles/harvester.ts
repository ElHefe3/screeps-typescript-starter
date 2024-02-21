import { shyAttribute } from "attributes";

export const roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        shyAttribute(creep);
	}
};
