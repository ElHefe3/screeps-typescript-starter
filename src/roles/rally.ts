export const rally = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        creep.say('🪖');
        creep.travelTo(Game.flags['rally'], { range: 3 });
	}
};
