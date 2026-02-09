
import React, { useState } from 'react';
import { useHolonicSim } from './hooks/useHolonicSim';
import { SimulationView } from './components/SimulationView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportView } from './components/ReportView';
import { ValidationView } from './components/ValidationView';
import { ManualView } from './components/ManualView';
import { HierarchyView } from './components/HierarchyView';
import { WeatherType } from './types';

type Tab = 'simulate' | 'hierarchy' | 'analytics' | 'report' | 'validation' | 'manual';

interface NavItem {
  id: Tab;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('simulate');
  
  const { 
    state, 
    resilienceScore,
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
    resetSimulation
  } = useHolonicSim();

  const navItems: NavItem[] = [
    { 
      id: 'simulate', 
      label: 'Grid Console', 
      description: 'Monitor real-time energy flow and manage network nodes.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    { 
      id: 'hierarchy', 
      label: 'Network Map', 
      description: 'Visual recursive holarchy and logical grid architecture.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    },
    { 
      id: 'analytics', 
      label: 'Analytics Hub', 
      description: 'Historical telemetry and deep-dive performance metrics.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'report', 
      label: 'Strategic Report', 
      description: 'AI-powered optimization advice and executive summaries.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
    { 
      id: 'validation', 
      label: 'Stress Test Lab', 
      description: 'Automated failure protocols and resilience certification.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.162 1.162a2 2 0 00.586 3.414l7.14 1.02a2 2 0 001.022-.123l7.14-3.57a2 2 0 00.586-3.414l-1.162-1.162z" /></svg>
    },
    { 
      id: 'manual', 
      label: 'Operator Manual', 
      description: 'Technical documentation and energy sector primer.',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    }
  ];

  const formatSimTime = (tick: number) => {
    const totalMinutes = tick * 15;
    const days = Math.floor(totalMinutes / (24 * 60)) + 1;
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return {
      day: `Day ${days}`,
      time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    };
  };

  const { day, time } = formatSimTime(state.tick);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col selection:bg-teal-500/30 font-sans">
      {/* Background Decorative Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <header className="glass sticky top-0 z-50 px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-6 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              HOLOGRID <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-bold text-teal-400">CORE v4.0</span>
            </h1>
            <p className="text-[9px] uppercase text-slate-500 font-bold tracking-[0.3em]">Autonomous Energy Orchestration</p>
          </div>
        </div>

        <nav className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/5 shadow-inner">
          {navItems.map((item) => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === item.id 
                  ? 'bg-slate-800 text-teal-400 shadow-lg border border-white/10' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
              
              {/* Tooltip Overlay */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 glass rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] pointer-events-none border border-teal-500/20">
                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mb-1">Section Brief</p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-full border border-white/5">
            <span className="text-[8px] font-black text-slate-500 uppercase mr-1">Velocity</span>
            {[1, 5, 20].map(s => (
              <button
                key={s}
                onClick={() => updateSpeed(s)}
                className={`text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold transition-all ${
                  state.speed === s ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          
          <button
            onClick={toggleSimulation}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border shadow-xl ${
              state.isRunning 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20' 
                : 'bg-teal-500 text-white border-teal-400 hover:bg-teal-400 hover:shadow-teal-500/30'
            }`}
          >
            {state.isRunning ? (
              <>
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                PAUSE ENGINE
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                ENGAGE GRID
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full relative z-10">
        {activeTab === 'simulate' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <aside className="lg:col-span-3 space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col items-center shadow-2xl">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Adequacy Index</h3>
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-900" />
                    <circle 
                      cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="10" fill="transparent" 
                      strokeDasharray={326.7}
                      strokeDashoffset={326.7 - (326.7 * resilienceScore / 100)}
                      strokeLinecap="round"
                      className={`transition-all duration-1000 shadow-inner ${resilienceScore > 75 ? 'text-teal-400' : resilienceScore > 40 ? 'text-amber-400' : 'text-rose-500'}`} 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-4xl font-mono font-black text-white tabular-nums">{resilienceScore}%</span>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-2">Grid Stability</span>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-[1.5rem] border border-white/5 space-y-5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Environment Profile</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(WeatherType).map((w) => (
                    <button 
                      key={w} 
                      onClick={() => setWeather(w)} 
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-[11px] font-bold ${
                        state.weather === w ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {w === WeatherType.CLEAR ? '☀️' : w === WeatherType.CLOUDY ? '☁️' : '⛈️'}
                        {w}
                      </span>
                      {state.weather === w && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_teal]"></div>}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-9 space-y-8 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-10">
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black block">Grid Telemetry Time</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-mono font-black text-white tabular-nums tracking-tighter">{time}</span>
                      <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded-lg">{day}</span>
                    </div>
                  </div>
                  <div className="h-14 w-px bg-white/5"></div>
                  <div className="space-y-1">
                    <span className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black block">Weather Impact</span>
                    <span className={`text-2xl font-black ${state.weather === 'STORMY' ? 'text-amber-400' : 'text-teal-400'}`}>{state.weather}</span>
                  </div>
                </div>
                <button onClick={resetSimulation} className="px-4 py-2 text-[10px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-[0.2em] border border-white/5 rounded-xl transition-colors hover:bg-rose-500/5">System Purge</button>
              </div>

              <SimulationView 
                holons={state.holons} 
                weather={state.weather} 
                onToggleStatus={toggleHolonStatus}
                onReparent={reparentHolon}
                onAddHolon={addHolon}
                onRemoveHolon={removeHolon}
              />
            </section>
          </div>
        )}

        {activeTab === 'hierarchy' && <HierarchyView holons={state.holons} />}
        {activeTab === 'analytics' && <AnalyticsView holons={state.holons} changeLogs={changeLogs} />}
        {activeTab === 'report' && <ReportView holons={state.holons} />}
        {activeTab === 'validation' && (
          <ValidationView 
            holons={state.holons} 
            weather={state.weather} 
            setWeather={setWeather} 
            updateSpeed={updateSpeed}
            toggleStatus={toggleHolonStatus}
            reparent={reparentHolon}
            resilience={resilienceScore}
            startSimulation={startSimulation}
            stopSimulation={stopSimulation}
            resetSimulation={resetSimulation}
          />
        )}
        {activeTab === 'manual' && <ManualView />}
      </main>

      <footer className="px-8 py-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">
        <div className="flex items-center gap-10">
          <span className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] ${state.isRunning ? 'bg-teal-500 animate-pulse' : 'bg-slate-800'}`}></span>
            System sync: {state.isRunning ? 'Operational' : 'Idle'}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Security: Level 4 Encryption
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="text-slate-600">Localhost Environment Protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-medium">HOLO-SECURE © 2025</span>
          <div className="px-2 py-0.5 border border-white/5 rounded text-[8px] bg-white/5">AES-256</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
