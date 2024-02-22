// Assuming the rest of your Traveler class implementation remains unchanged.

declare global {
  // Extend CreepMemory with properties used by your Traveler.
  interface CreepMemory {
    role: string;
    harvesting?: boolean; // Mark optional properties with ?
    building?: boolean;
    upgrading?: boolean;
    maintaining?: boolean;
    hauling?: boolean;
    structureBeingRepaired?: string;
    _trav?: TravelData; // Make sure this matches the structure used by Traveler
    _travel?: any; // If this is used, define a more specific type if possible
  }

  interface RoomMemory {
    avoid?: number;
  }

  // Ensure Memory interface correctly declares any custom properties you use.
  interface Memory {
    replacementsNeeded: string[];
    empire: any;
    // Add any other custom properties used by your scripts.
  }

  // Define or extend interfaces for your Traveler-specific types.
  interface PathfinderReturn {
    path: RoomPosition[];
    ops: number;
    cost: number;
    incomplete: boolean;
  }

  interface TravelToReturnData {
    nextPos?: RoomPosition;
    pathfinderReturn?: PathfinderReturn;
    state?: TravelState;
    path?: string;
  }

  interface TravelToOptions {
    ignoreRoads?: boolean;
    ignoreCreeps?: boolean;
    ignoreStructures?: boolean;
    preferHighway?: boolean;
    highwayBias?: number;
    allowHostile?: boolean;
    allowSK?: boolean;
    range?: number;
    obstacles?: {pos: RoomPosition}[];
    roomCallback?: (roomName: string, matrix: CostMatrix) => CostMatrix | boolean;
    routeCallback?: (roomName: string) => number;
    returnData?: TravelToReturnData;
    restrictDistance?: number;
    useFindRoute?: boolean;
    maxOps?: number;
    movingTarget?: boolean;
    freshMatrix?: boolean;
    offRoad?: boolean;
    stuckValue?: number;
    maxRooms?: number;
    repath?: number;
    route?: {[roomName: string]: boolean};
    ensurePath?: boolean;
  }

  interface TravelData {
    state?: any[]; // Consider defining a more specific type for the state.
    path?: string;
  }

  interface TravelState {
    stuckCount: number;
    lastCoord: Coord;
    destination: RoomPosition;
    cpu: number;
  }

  // This extends the Creep prototype with the travelTo method.
  // Make sure the method signature correctly reflects its implementation.
  interface Creep {
    travelTo(destination: RoomPosition | HasPos, options?: TravelToOptions): number;
  }

  // Additional types used by your declarations.
  type Coord = { x: number; y: number; };
  type HasPos = { pos: RoomPosition; };
}

export {};
