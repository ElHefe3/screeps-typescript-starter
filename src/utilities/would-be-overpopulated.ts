import { Position } from "source-map";

/**
 * Checks if adding another creep to the specified location would cause overpopulation.
 * @param {RoomPosition} position - The location to check.
 * @param {number} maxCreeps - The maximum number of creeps allowed before considering the location overpopulated.
 * @return {boolean} True if the location would be overpopulated, false otherwise.
 */
export const wouldBeOverpopulated = (position: RoomPosition, maxCreeps: number) => {
    let count = 0;
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const dest = creep.memory.destination;
        if (dest && dest.x === position.x && dest.y === position.y && dest.roomName === position.roomName) {
            count++;
        }
    }
    return count >= maxCreeps;
}
