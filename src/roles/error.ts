import { shyAttribute } from "attributes";

export const erroring = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        creep.say('🚫 error');
	}
};
