// Assuming the rest of your Traveler class implementation remains unchanged.

declare global {
  interface Function {
    cleanupCompletedTasks: (room: Room) => void;
    setTaskStatusDirectly: (room: Room, creepType: CreepType) => void;
  }
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
    currentTask?: string;
  }

  type CreepType = 'harvester' | 'builder' | 'upgrader' | 'maintainer' | 'hauler' | 'remoteMiner';

  type TaskType = 'repair' | 'build' | 'upgrade' | 'haul' | 'scavenge';

  type TaskStatus = 'pending' | 'in-progress' | 'completed';

  type Task = {
    id: string;
    type: TaskType;
    status: TaskStatus;
    priority: number;
    maxCreeps: number;
    assignedCreeps: string[];
    completedAt?: number;
  };

  type TasksByCreepType = {
    [key in CreepType]?: Task[];
  };

  type TaskManager = {
    tasks: TasksByCreepType;
    addTask: (task: Task, creepType: CreepType) => void;
    removeTask: (taskId: string, creepType: CreepType) => void;
    getTasks: (creepType: CreepType, filter?: Partial<Task>) => Task[];
    assignTask: (creepName: string, taskId: string, creepType: CreepType) => boolean;
    completeTask: (taskId: string, creepType: CreepType) => void;
  };

  interface RoomMemory {
    avoid?: number;
    maintainedObjects?: string[];
    taskManager: TaskManager;
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
  type HitpointEnabledStructures = StructureRoad |
    StructureContainer |
    StructureRampart |
    StructureWall |
    StructureController |
    StructureStorage |
    StructureExtension |
    StructureSpawn |
    StructureTower |
    StructureLab |
    StructureLink |
    StructureNuker |
    StructurePowerSpawn |
    StructureTerminal |
    StructureFactory |
    StructureObserver |
    StructureExtractor |
    StructurePortal |
    StructureInvaderCore;
}

export {};
