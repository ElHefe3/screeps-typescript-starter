export const idle = {
    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        creep.say('🧶 idle');
        creep.travelTo(Game.flags['idle'], { range: 3 });
	}
};
