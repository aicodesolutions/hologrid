
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Holon, HolonType, EnergyReading, SimulationState, WeatherType, HolonStatus, SimulationSnapshot, ChangeLogEntry } from '../types';
import { INITIAL_HOLONS, TICK_MS, MAX_HISTORY } from '../constants';

const STORAGE_KEY = 'hologrid_simulations';

export function useHolonicSim() {
  const [state, setState] = useState<SimulationState>({
    tick: 0,
    isRunning: false,
    speed: 1,
    weather: WeatherType.CLEAR,
    holons: INITIAL_HOLONS
  });

  const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
  const [savedSimulations, setSavedSimulations] = useState<SimulationSnapshot[]>([]);
  const timerRef = useRef<number | null>(null);

  const addLog = useCallback((action: string, details: string, impact: string, type: ChangeLogEntry['type']) => {
    const newLog: ChangeLogEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      action,
      details,
      impact,
      type
    };
    setChangeLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedSimulations(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load saved simulations", e);
      }
    }
  }, []);

  const saveSimulation = useCallback((name: string) => {
    const snapshot: SimulationSnapshot = {
      id: `snap-${Date.now()}`,
      name: name || `Snapshot ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state))
    };
    const updated = [snapshot, ...savedSimulations];
    setSavedSimulations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    addLog('System Snapshot', `Saved state as "${snapshot.name}"`, 'Provides a restorable recovery point for grid architecture.', 'SYSTEM');
  }, [state, savedSimulations, addLog]);

  const applyResearchPreset = useCallback(() => {
    setState(prev => ({
      ...prev,
      holons: prev.holons.map(h => {
        if (h.id === 'solar-farm-1') return { ...h, parentId: 'residential-1' };
        if (h.id === 'factory-1') return { ...h, parentId: 'battery-bank-1' };
        if (h.id === 'wind-turbine-1') return { ...h, parentId: 'grid-master' };
        return h;
      })
    }));
    addLog('Research Preset', 'Applied standard holonic coupling architecture', 'Reduces transmission loss by coupling localized generation with immediate loads.', 'STRUCTURE');
  }, [addLog]);

  const setWeather = useCallback((weather: WeatherType) => {
    setState(prev => ({ ...prev, weather }));
    let impact = "Standard atmospheric coefficients applied.";
    if (weather === WeatherType.STORMY) impact = "Solar yield drops to 10%, Wind surges to 180%, and demand spikes by 20%.";
    if (weather === WeatherType.CLOUDY) impact = "Solar yield limited to 40%, Wind efficiency drops by 20%.";
    addLog('Weather Update', `Climate changed to ${weather}`, impact, 'ENVIRONMENT');
  }, [addLog]);

  const toggleHolonStatus = useCallback((id: string) => {
    setState(prev => {
      const holon = prev.holons.find(h => h.id === id);
      const newStatus = holon?.status === HolonStatus.OPERATIONAL ? HolonStatus.MAINTENANCE : HolonStatus.OPERATIONAL;
      addLog(
        'Node Status Toggle', 
        `${holon?.name} set to ${newStatus}`, 
        newStatus === HolonStatus.MAINTENANCE 
          ? "Node is isolated. It no longer contributes to grid production or load." 
          : "Node re-synchronized. Resuming telemetry and energy contributions.",
        'NODE_MGMT'
      );
      return {
        ...prev,
        holons: prev.holons.map(h => h.id === id ? { ...h, status: newStatus } : h)
      };
    });
  }, [addLog]);

  const reparentHolon = useCallback((holonId: string, newParentId: string | null) => {
    setState(prev => {
      const holon = prev.holons.find(h => h.id === holonId);
      const parent = prev.holons.find(h => h.id === newParentId);
      addLog(
        'Hierarchy Change', 
        `Moved ${holon?.name} under ${parent?.name || 'Isolated Island'}`, 
        "Alters the logic of recursive energy aggregation and affects localized micro-grid adequacy.",
        'STRUCTURE'
      );
      return {
        ...prev,
        holons: prev.holons.map(h => h.id === holonId ? { ...h, parentId: newParentId } : h)
      };
    });
  }, [addLog]);

  const addHolon = useCallback((newHolon: Partial<Holon>) => {
    const id = `node-${Date.now()}`;
    const fullHolon: Holon = {
      id,
      name: newHolon.name || 'New Holon',
      type: newHolon.type || HolonType.CONSUMER,
      status: HolonStatus.OPERATIONAL,
      parentId: newHolon.parentId || 'grid-master',
      baseCapacity: newHolon.baseCapacity || 0,
      baseDemand: newHolon.baseDemand || 0,
      currentEfficiency: 1.0,
      history: []
    };
    setState(prev => ({ ...prev, holons: [...prev.holons, fullHolon] }));
    addLog(
      'Provisioning Node', 
      `Added ${fullHolon.name} (${fullHolon.type})`, 
      `Expands grid potential by ${fullHolon.baseCapacity || fullHolon.baseDemand}kW nominal capacity.`,
      'NODE_MGMT'
    );
  }, [addLog]);

  const removeHolon = useCallback((id: string) => {
    if (id === 'grid-master') return;
    setState(prev => {
      const holon = prev.holons.find(h => h.id === id);
      addLog('Decommissioning', `Removed ${holon?.name}`, "Permanent removal of asset capacity. Sub-nodes are reparented to the master grid.", 'NODE_MGMT');
      return {
        ...prev,
        holons: prev.holons
          .filter(h => h.id !== id)
          .map(h => h.parentId === id ? { ...h, parentId: 'grid-master' } : h)
      };
    });
  }, [addLog]);

  const resetSimulation = useCallback(() => {
    setState({
      tick: 0,
      isRunning: false,
      speed: 1,
      weather: WeatherType.CLEAR,
      holons: INITIAL_HOLONS.map(h => ({ ...h, history: [], status: HolonStatus.OPERATIONAL }))
    });
    setChangeLogs([]);
    addLog('Global Reset', 'Wiped all telemetry and restored default holarchy', 'Simulation clock returned to tick 0.', 'SYSTEM');
  }, [addLog]);

  // Rest of the resilience and simulation loop logic remains same...
  const resilienceScore = useMemo(() => {
    const connectedIds = new Set(['grid-master']);
    let expanded = true;
    while (expanded) {
      expanded = false;
      state.holons.forEach(h => {
        if (h.parentId && connectedIds.has(h.parentId) && !connectedIds.has(h.id)) {
          connectedIds.add(h.id);
          expanded = true;
        }
      });
    }

    let totalProd = 0;
    let totalDemand = 0;
    let currentStorageLevel = 0;

    state.holons.forEach(h => {
      if (!connectedIds.has(h.id)) return;

      const last = h.history[h.history.length - 1];
      if (h.status === HolonStatus.OPERATIONAL) {
        if (h.type === HolonType.PRODUCER || h.type === HolonType.PROSUMER) {
          totalProd += last?.production || 0;
        }
        if (h.type === HolonType.STORAGE) {
          currentStorageLevel += (last?.storage || 0);
          totalProd += (last?.production || 0);
        }
      }
      totalDemand += (last?.consumption || 0);
    });

    if (totalDemand === 0) return 100;
    const ratio = (totalProd + (currentStorageLevel * 0.15)) / totalDemand; 
    return Math.min(100, Math.round(ratio * 100));
  }, [state.holons]);

  const toggleSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const startSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const stopSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const updateSpeed = useCallback((newSpeed: number) => {
    setState(prev => ({ ...prev, speed: newSpeed }));
  }, []);

  const deleteSimulation = useCallback((id: string) => {
    const updated = savedSimulations.filter(s => s.id !== id);
    setSavedSimulations(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [savedSimulations]);

  const loadSimulation = useCallback((id: string) => {
    const snapshot = savedSimulations.find(s => s.id === id);
    if (snapshot) {
      setState({ ...snapshot.state, isRunning: false });
      setChangeLogs([]);
      addLog('Load State', `Restored simulation "${snapshot.name}"`, 'All telemetry and holarchy states synced to snapshot point.', 'SYSTEM');
    }
  }, [savedSimulations, addLog]);

  useEffect(() => {
    if (state.isRunning) {
      timerRef.current = window.setInterval(() => {
        setState(prev => {
          const nextTick = prev.tick + 1;
          const dailyTick = nextTick % 96;

          let weatherMultiplier = 1.0;
          let windMultiplier = 1.0;
          if (prev.weather === WeatherType.CLOUDY) {
            weatherMultiplier = 0.4;
            windMultiplier = 0.8;
          } else if (prev.weather === WeatherType.STORMY) {
            weatherMultiplier = 0.1;
            windMultiplier = 1.8;
          }

          const solarFactor = Math.max(0, Math.sin((dailyTick - 24) * (Math.PI / 48))) * weatherMultiplier;
          const demandBase = prev.weather === WeatherType.STORMY ? 1.2 : 1.0;
          const demandFactor = (0.5 + 0.3 * Math.sin(dailyTick * (Math.PI / 24)) + 0.2 * Math.cos(dailyTick * (Math.PI / 48))) * demandBase;

          const potentials = prev.holons.map(h => {
            const noise = (Math.random() - 0.5) * 0.05;
            let p = 0;
            let c = 0;
            if (h.status === HolonStatus.OPERATIONAL) {
              if (h.type === HolonType.PRODUCER || h.type === HolonType.PROSUMER) {
                const multi = h.name.toLowerCase().includes('wind') ? windMultiplier : 1;
                const factor = h.name.toLowerCase().includes('solar') 
                  ? solarFactor 
                  : (0.8 * weatherMultiplier); 
                p = Math.max(0, h.baseCapacity * (factor + noise) * multi);
              }
              if (h.type === HolonType.CONSUMER || h.type === HolonType.PROSUMER) {
                c = Math.max(0, h.baseDemand * (demandFactor + noise));
              }
            }
            return { p, c };
          });

          const totalGen = potentials.reduce((acc, r) => acc + r.p, 0);
          const totalCons = potentials.reduce((acc, r) => acc + r.c, 0);
          let remainingNet = totalGen - totalCons;

          const storageUnits = prev.holons.filter(h => h.type === HolonType.STORAGE && h.status === HolonStatus.OPERATIONAL);
          const storageUpdates = new Map<string, { storage: number, addedP: number, addedC: number }>();

          if (remainingNet > 0) {
            storageUnits.forEach(h => {
              const currentStorage = h.history[h.history.length - 1]?.storage || 0;
              const chargePotential = h.baseCapacity - currentStorage;
              const chargeAmount = Math.min(remainingNet * 0.95, chargePotential, h.baseCapacity * 0.2);
              storageUpdates.set(h.id, { storage: currentStorage + chargeAmount, addedP: 0, addedC: chargeAmount });
              remainingNet -= chargeAmount;
            });
          } else if (remainingNet < 0) {
            let deficit = Math.abs(remainingNet);
            storageUnits.forEach(h => {
              const currentStorage = h.history[h.history.length - 1]?.storage || 0;
              const dischargeAmount = Math.min(deficit, currentStorage, h.baseCapacity * 0.5);
              storageUpdates.set(h.id, { storage: currentStorage - dischargeAmount, addedP: dischargeAmount, addedC: 0 });
              deficit -= dischargeAmount;
            });
          }

          const updatedHolons = prev.holons.map((holon, idx) => {
            const pot = potentials[idx];
            const sUpdate = storageUpdates.get(holon.id);
            const currentStorage = sUpdate ? sUpdate.storage : (holon.history[holon.history.length - 1]?.storage || 0);
            const finalP = pot.p + (sUpdate?.addedP || 0);
            const finalC = pot.c + (sUpdate?.addedC || 0);

            return {
              ...holon,
              history: [...holon.history, {
                timestamp: Date.now(),
                production: Math.round(finalP),
                consumption: Math.round(finalC),
                storage: Math.round(currentStorage),
                net: Math.round(finalP - finalC)
              }].slice(-MAX_HISTORY)
            };
          });

          return { ...prev, tick: nextTick, holons: updatedHolons };
        });
      }, TICK_MS / state.speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.isRunning, state.speed]);

  return { 
    state, 
    resilienceScore, 
    savedSimulations,
    changeLogs,
    toggleSimulation,
    startSimulation,
    stopSimulation,
    updateSpeed, 
    setWeather, 
    toggleHolonStatus, 
    reparentHolon,
    addHolon,
    removeHolon,
    resetSimulation,
    saveSimulation,
    loadSimulation,
    deleteSimulation,
    applyResearchPreset
  };
}
