import { buildingExpressionMapper } from "constant-values"
import { erroring } from "roles/error";

export const reaction = {
    run: function (creep: Creep, destinationBuilding: AnyStructure) {
        const {
                RESOURCE,
                EXTENSION,
                SPAWN,
                TOWER,
                ROAD,
                RAMPART,
                LINK,
              } = buildingExpressionMapper;

        const { destination } = creep.memory;
        const look = creep.room.lookAt(destination?.x ?? 0, destination?.y ?? 0);

        //erroring.run(creep);


        // look?.forEach(function(lookObject) {
        //     if(lookObject.type == 'structure') {
        //         const structure = lookObject.structure?.structureType;
                switch (look?.[0]?.structure?.structureType) {
                    case 'container':
                        creep.say(RESOURCE.emoticon);
                        break;
                    case 'extension':
                        creep.say(EXTENSION.emoticon);
                        break;
                    case 'spawn':
                        creep.say(SPAWN.emoticon);
                        break;
                    case 'tower':
                        creep.say(TOWER.emoticon);
                        break;
                    case 'road':
                        creep.say(ROAD.emoticon);
                        break;
                    case 'rampart':
                        creep.say(RAMPART.emoticon);
                        break;
                    case 'link':
                        creep.say(LINK.emoticon);
                        break;
                }
        //     }
        // });
    }
}
