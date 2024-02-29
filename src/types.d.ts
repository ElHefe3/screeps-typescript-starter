// Assuming the rest of your Traveler class implementation remains unchanged.

declare global {
  // Extend CreepMemory with properties used by your Traveler.
  interface CreepMemory {
    role: string;
    errors: string[];
    harvesting?: boolean; // Mark optional properties with ?
    building?: boolean;
    upgrading?: boolean;
    maintaining?: boolean;
    hauling?: boolean;
    structureBeingRepaired?: string;
    _trav?: TravelData; // Make sure this matches the structure used by Traveler
    _travel?: any; // If this is used, define a more specific type if possible
    destination?: RoomPosition;
  }

  // type taskType = 'repair' | 'build' | 'upgrade' | 'haul' | 'scavenge';[]
  // type taskStatus = 'pending' | 'in-progress';

  // type Task = {
  //   id: string;
  //   type: taskType;
  //   status: taskStatus;
  // }

  interface TaskData {
    id: string;
    type: string;
    priority: number;
    maxCreeps: number;
    assignedCreeps: number;
  }

  // Define an interface for the TaskManager
  interface TaskManager {
    tasks: TaskData[];
    addTask: (task: TaskData) => void;
    removeTask: (taskId: string) => void;
    getTasks: () => TaskData[];
    // Any other methods you have in taskManager
  }

  // Extend the RoomMemory interface to include taskManager
  interface RoomMemory {
    avoid?: number;
    maintainedObjects?: string[];
    maintenanceTaskList?: TaskData[];
    taskManager?: TaskManager;
  }

  // Ensure Memory interface correctly declares any custom properties you use.
  interface Memory {
    replacementsNeeded: string[];
    empire: any;
    claimedStructures: any;
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

  type CapacityEnabledStructures = StructureSpawn | StructureExtension | StructureTower | StructureStorage | StructureContainer;
}

export {};
