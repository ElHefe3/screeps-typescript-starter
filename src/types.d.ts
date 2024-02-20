
declare global {
  interface CreepMemory {
    role: string;
    harvesting: boolean;
    building: boolean;
    upgrading: boolean;
  }

  interface Memory {
    replacementsNeeded: string[];
  }
}

export {};
