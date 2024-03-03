import { scavengerAttribute } from "attributes";
import { idle } from "./idle";
import { findControllerStorage, walkThisWay } from "utilities";

export const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {
        const controller = creep.room.controller;
        if(!controller) return;

        const controllerStorage = findControllerStorage(controller);
        if(!controllerStorage) return;

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }

	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

        if(!creep.memory.upgrading && controllerStorage.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return;

	    creep.memory.upgrading
            ? walkThisWay.upgrade(creep, controller as StructureController)
            : walkThisWay.withdraw(creep, controllerStorage);
	}
};
