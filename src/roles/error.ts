import { insertError } from "utilities";

export const erroring = {
    /** @param {Creep} creep **/
    run: function(creep: Creep, customErrorMessage: string = '400: Bad Request') {
        creep.say('🚫 error');
        creep.travelTo(Game.flags['idle']);
        insertError(creep, customErrorMessage);
	}
};
