
export enum HolonType {
  PRODUCER = 'PRODUCER',
  CONSUMER = 'CONSUMER',
  STORAGE = 'STORAGE',
  PROSUMER = 'PROSUMER'
}

export enum WeatherType {
  CLEAR = 'CLEAR',
  CLOUDY = 'CLOUDY',
  STORMY = 'STORMY'
}

export enum HolonStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  OVERLOADED = 'OVERLOADED'
}

export interface EnergyReading {
  timestamp: number;
  production: number;
  consumption: number;
  storage: number;
  net: number;
}

export interface ChangeLogEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  impact: string;
  type: 'ENVIRONMENT' | 'STRUCTURE' | 'NODE_MGMT' | 'SYSTEM';
}

export interface Holon {
  id: string;
  name: string;
  type: HolonType;
  status: HolonStatus;
  parentId: string | null;
  baseCapacity: number; // Max production or storage
  baseDemand: number; // Base consumption
  currentEfficiency: number; // 0 to 1
  history: EnergyReading[];
}

export interface SimulationState {
  tick: number;
  isRunning: boolean;
  speed: number;
  weather: WeatherType;
  holons: Holon[];
}

export interface SimulationSnapshot {
  id: string;
  name: string;
  timestamp: number;
  state: SimulationState;
}
