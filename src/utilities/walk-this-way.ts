export const walkThisWay = {
    transfer: function(creep: Creep, target: AnyCreep | Structure<StructureConstant>) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    withdraw: function(creep: Creep, target: Structure<StructureConstant> | Tombstone | Ruin) {
        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    harvest: function(creep: Creep, target: Source) {
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    pickup: function(creep: Creep, target: Resource) {
        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    build: function(creep: Creep, target: ConstructionSite) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    repair: function(creep: Creep, target: Structure<StructureConstant>) {
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    },

    upgrade: function(creep: Creep, target: StructureController) {
        if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
            creep.travelTo(target);
        }
    }
}
