// Purpose: Contains the defcon environment.
// when under attack the defcon flag will change color and defcon level will increase

export const defcon = {
    run: function() {
        const defconFlag = Game.flags['defcon'];

        const hostiles = defconFlag?.room?.find(FIND_HOSTILE_CREEPS);

        if(!hostiles) return;

        new RoomVisual(defconFlag?.pos.roomName).line(defconFlag?.pos, hostiles[0]?.pos, {color: 'red'});

        if (hostiles.length > 0 && hostiles?.length < 2) {
            defconFlag?.setColor(COLOR_YELLOW);
        } else if (hostiles?.length > 2) {
            defconFlag?.setColor(COLOR_RED);
        } else if (defconFlag?.color !== COLOR_WHITE) {
            if (Game.time % 100 === 0) {
                defconFlag?.setColor(COLOR_WHITE);
            }
        }
    },

    currentDefconLevel: function() {
        const defconFlag = Game.flags['defcon'];

        if (defconFlag?.color === COLOR_YELLOW) {
            return 1;
        } else if (defconFlag?.color === COLOR_RED) {
            return 2;
        } else {
            return 0;
        }
    }
}

