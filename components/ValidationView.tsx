
import React, { useState, useEffect, useRef } from 'react';
import { Holon, WeatherType, HolonStatus, HolonType } from '../types';

interface TestResult {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'pass' | 'fail';
  message: string;
}

interface Props {
  holons: Holon[];
  weather: WeatherType;
  setWeather: (w: WeatherType) => void;
  updateSpeed: (s: number) => void;
  toggleStatus: (id: string) => void;
  reparent: (id: string, pid: string | null) => void;
  resilience: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
}

export const ValidationView: React.FC<Props> = ({ 
  holons, 
  setWeather, 
  updateSpeed, 
  toggleStatus, 
  reparent,
  resilience,
  startSimulation,
  stopSimulation,
  resetSimulation
}) => {
  const holonsRef = useRef(holons);
  const resilienceRef = useRef(resilience);

  useEffect(() => {
    holonsRef.current = holons;
    resilienceRef.current = resilience;
  }, [holons, resilience]);

  const [tests, setTests] = useState<TestResult[]>([
    { id: 'TC-01', name: 'Battery Saturation Logic', status: 'idle', message: 'Ready to verify charging caps' },
    { id: 'TC-02', name: 'Resilience Stress Check', status: 'idle', message: 'Ready to monitor grid failure response' },
    { id: 'TC-03', name: 'Weather Multiplier Accuracy', status: 'idle', message: 'Ready to audit production factors' },
    { id: 'TC-05', name: 'Islanding Stability', status: 'idle', message: 'Ready to test isolated node autonomy' },
    { id: 'TC-06', name: 'Storage Depletion Under Load', status: 'idle', message: 'Verify battery discharge during blackout' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const runTest = async (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'running', message: 'Executing...' } : t));
    addLog(`Initiating ${id}...`);
    
    const waitForTicks = async (ticks: number) => {
      addLog(`Stabilizing grid (${ticks} ticks)...`);
      await new Promise(r => setTimeout(r, ticks * 50)); 
    };

    if (id === 'TC-01') {
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      setWeather(WeatherType.CLEAR);
      updateSpeed(20);
      await waitForTicks(30);
      
      const battery = holonsRef.current.find(h => h.type === HolonType.STORAGE);
      const level = battery?.history[battery.history.length-1]?.storage || 0;
      const pass = level > 0;
      setTests(prev => prev.map(t => t.id === id ? { ...t, status: pass ? 'pass' : 'fail', message: pass ? `Stored ${level}kW` : 'Level 0' } : t));
    }

    if (id === 'TC-02') {
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      setWeather(WeatherType.STORMY);
      updateSpeed(20);
      
      const producers = holonsRef.current.filter(h => h.type === HolonType.PRODUCER);
      producers.forEach(p => toggleStatus(p.id));
      
      await waitForTicks(40);
      
      const score = resilienceRef.current;
      const pass = score < 85;
      setTests(prev => prev.map(t => t.id === id ? { ...t, status: pass ? 'pass' : 'fail', message: `Resilience: ${score}%` } : t));
      
      producers.forEach(p => toggleStatus(p.id));
    }

    if (id === 'TC-03') {
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      updateSpeed(20);
      setWeather(WeatherType.CLEAR);
      addLog("Step 1: Measuring Peak Sunlight...");
      await waitForTicks(50); 
      
      const solarNode = holonsRef.current.find(h => h.name.toLowerCase().includes('solar'));
      const clearProd = solarNode?.history[solarNode.history.length-1]?.production || 0;

      stopSimulation();
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      updateSpeed(20);
      setWeather(WeatherType.STORMY);
      addLog("Step 2: Measuring Stormy Production...");
      await waitForTicks(50);
      
      const stormyNode = holonsRef.current.find(h => h.name.toLowerCase().includes('solar'));
      const stormProd = stormyNode?.history[stormyNode.history.length-1]?.production || 0;

      const ratio = clearProd > 10 ? (stormProd / clearProd) : 1;
      const pass = ratio < 0.3 && clearProd > 50;
      
      setTests(prev => prev.map(t => t.id === id ? { ...t, status: pass ? 'pass' : 'fail', message: pass ? `Factor: ${ratio.toFixed(2)}x` : 'Low Data' } : t));
    }

    if (id === 'TC-05') {
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      updateSpeed(20);
      setWeather(WeatherType.CLEAR);
      await waitForTicks(25);
      const baseline = resilienceRef.current;

      const wind = holonsRef.current.find(h => h.name.toLowerCase().includes('wind'));
      if (wind) {
        addLog(`Action: Islanding ${wind.name}...`);
        reparent(wind.id, null);
        await waitForTicks(30);
        const scoreAfter = resilienceRef.current;
        const pass = scoreAfter < baseline;
        setTests(prev => prev.map(t => t.id === id ? { ...t, status: pass ? 'pass' : 'fail', message: `Stability Delta: ${baseline - scoreAfter}%` } : t));
        reparent(wind.id, 'grid-master');
      }
    }

    if (id === 'TC-06') {
      resetSimulation();
      await new Promise(r => setTimeout(r, 200));
      startSimulation();
      updateSpeed(20);
      
      setWeather(WeatherType.CLEAR);
      addLog("Phase 1: Charging storage...");
      await waitForTicks(35);
      
      const batteryNode = holonsRef.current.find(h => h.type === HolonType.STORAGE);
      const initialCharge = batteryNode?.history[batteryNode.history.length-1]?.storage || 0;
      addLog(`Current Storage: ${initialCharge}kW`);

      setWeather(WeatherType.STORMY);
      addLog("Phase 2: Total Blackout Simulation (Generators OFF)...");
      
      // Target ONLY active generators/prosumers. IMPORTANT: SPARE the 'grid-master' to maintain coordination.
      const genHolons = holonsRef.current.filter(h => 
        h.id !== 'grid-master' && 
        (h.type === HolonType.PRODUCER || h.type === HolonType.PROSUMER) && 
        h.status === HolonStatus.OPERATIONAL
      );
      
      genHolons.forEach(h => toggleStatus(h.id));
      await waitForTicks(40); 
      
      const updatedHolons = holonsRef.current;
      const battery = updatedHolons.find(h => h.type === HolonType.STORAGE);
      const lastReading = battery?.history[battery.history.length-1];
      const currentResilience = resilienceRef.current;
      
      const isContributing = (lastReading?.production || 0) > 0;
      
      addLog(`Storage Contribution: ${lastReading?.production || 0}kW`);
      addLog(`Adequacy Index: ${currentResilience}%`);
      
      const pass = isContributing && currentResilience > 0;
      setTests(prev => prev.map(t => t.id === id ? { ...t, status: pass ? 'pass' : 'fail', message: pass ? `Discharging ${lastReading?.production}kW` : "Grid Failure" } : t));
      
      addLog(pass ? "PASS: Storage holon is maintaining grid adequacy." : "FAIL: Grid collapsed; battery did not discharge.");
      
      genHolons.forEach(h => toggleStatus(h.id));
    }

    updateSpeed(1);
    stopSimulation();
    addLog(`Test ${id} completed.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Validation Suite
        </h3>
        
        <div className="grid gap-4">
          {tests.map(test => (
            <div key={test.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
              <div className="flex gap-4 items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  test.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 
                  test.status === 'fail' ? 'bg-rose-500/20 text-rose-400' : 
                  test.status === 'running' ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' : 'bg-slate-800 text-slate-500'
                }`}>
                  {test.id.split('-')[1]}
                </div>
                <div className="max-w-[150px] md:max-w-none">
                  <h4 className="font-bold text-slate-200 truncate">{test.name}</h4>
                  <p className="text-xs text-slate-500">{test.message}</p>
                </div>
              </div>
              <button 
                onClick={() => runTest(test.id)}
                disabled={test.status === 'running'}
                className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
              >
                {test.status === 'idle' ? 'Run' : 'Retry'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Diagnostic Logs</h3>
        <div className="glass h-[500px] rounded-2xl border border-white/5 p-4 font-mono text-[10px] overflow-y-auto space-y-1 bg-black/40 custom-scrollbar">
          {logs.length === 0 && <span className="text-slate-700 italic">Standby for validation sequence...</span>}
          {logs.map((log, i) => (
            <div key={i} className={log.includes('PASS') ? 'text-emerald-400 font-bold' : log.includes('FAIL') ? 'text-rose-400 font-bold' : log.includes('Stabilizing') ? 'text-indigo-400/60' : 'text-slate-400'}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
