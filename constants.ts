
import { HolonType, Holon, HolonStatus } from './types';

export const INITIAL_HOLONS: Holon[] = [
  {
    id: 'grid-master',
    name: 'Main District Grid',
    type: HolonType.PROSUMER,
    status: HolonStatus.OPERATIONAL,
    parentId: null,
    baseCapacity: 1200,
    baseDemand: 400,
    currentEfficiency: 0.95,
    history: []
  },
  {
    id: 'solar-farm-1',
    name: 'North Solar Array',
    type: HolonType.PRODUCER,
    status: HolonStatus.OPERATIONAL,
    parentId: 'grid-master',
    baseCapacity: 500,
    baseDemand: 10,
    currentEfficiency: 1.0,
    history: []
  },
  {
    id: 'wind-turbine-1',
    name: 'Hilltop Wind',
    type: HolonType.PRODUCER,
    status: HolonStatus.OPERATIONAL,
    parentId: 'grid-master',
    baseCapacity: 350,
    baseDemand: 15,
    currentEfficiency: 0.85,
    history: []
  },
  {
    id: 'factory-1',
    name: 'Industrial Zone A',
    type: HolonType.CONSUMER,
    status: HolonStatus.OPERATIONAL,
    parentId: 'grid-master',
    baseCapacity: 0,
    baseDemand: 700,
    currentEfficiency: 0.9,
    history: []
  },
  {
    id: 'battery-bank-1',
    name: 'Tesla Megapack',
    type: HolonType.STORAGE,
    status: HolonStatus.OPERATIONAL,
    parentId: 'grid-master',
    baseCapacity: 800,
    baseDemand: 25,
    currentEfficiency: 0.98,
    history: []
  },
  {
    id: 'residential-1',
    name: 'Subdivision Alpha',
    type: HolonType.PROSUMER,
    status: HolonStatus.OPERATIONAL,
    parentId: 'grid-master',
    baseCapacity: 180,
    baseDemand: 220,
    currentEfficiency: 0.92,
    history: []
  }
];

export const TICK_MS = 1000;
export const MAX_HISTORY = 60;
