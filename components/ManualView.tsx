
import React from 'react';

export const ManualView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <div className="inline-block p-4 bg-teal-500/10 rounded-3xl border border-teal-500/20 mb-4">
          <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Operator Handbook</h2>
        <p className="text-teal-400 font-mono text-sm tracking-[0.4em] uppercase">Holonic Engine System Architecture</p>
      </section>

      {/* THE GRID CHALLENGE CONTEXT */}
      <section className="glass p-12 rounded-[3rem] border-l-8 border-teal-500 space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
          <svg className="w-64 h-64 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <div className="w-20 h-20 bg-teal-500/10 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
            <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">The Decentralized Power Era</h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Legacy grids were unidirectional hierarchies. Modern energy networks are <strong>Cyber-Physical Ecosystems</strong> where every building can be a power plant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="p-8 bg-slate-950/60 rounded-[2rem] border border-white/5 space-y-4">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest">The Volatility Gap</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Renewable assets are unpredictable. A cloud-front can wipe out gigawatts in seconds. Legacy systems can't react fast enough, leading to frequency instability.
                </p>
              </div>
              <div className="p-8 bg-teal-500/10 rounded-[2rem] border border-teal-500/20 space-y-4">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest">The Holonic Shield</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  HoloGrid utilizes <strong>Autonomic Holarchies</strong>—groups of nodes that can "Island" (break away from the grid) during failures to maintain local stability via internal storage and production.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATHEMATICS OF RESILIENCE */}
      <section className="glass p-12 rounded-[3rem] border border-white/5 space-y-12 shadow-2xl bg-slate-900/40">
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">The Mathematics of Resilience</h3>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Defining the Adequacy Index ($A_i$) logic</p>
        </div>

        <div className="flex flex-col items-center gap-12 py-10">
          {/* Visual Formula Representation */}
          <div className="flex flex-col items-center gap-2 font-mono group">
            <div className="flex items-center gap-8">
              <span className="text-5xl font-black text-teal-400">A</span>
              <span className="text-2xl font-black text-teal-500/50 -ml-6 mt-6">i</span>
              <span className="text-4xl font-light text-slate-600">=</span>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 text-2xl font-black text-white px-8 py-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-teal-500/30 transition-all">
                   <span>&Sigma; Production</span>
                   <span className="text-teal-500">+</span>
                   <span className="text-amber-500 text-xl font-bold">(&Sigma; Storage &times; 0.15)</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full"></div>
                <div className="text-2xl font-black text-rose-500 px-8 py-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 group-hover:border-rose-500/30 transition-all">
                  &Sigma; Total System Demand
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
             <div className="space-y-2">
                <h5 className="text-[10px] font-black text-teal-400 uppercase tracking-widest border-b border-teal-500/20 pb-2">Instantaneous Generation</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">The sum of all active wind, solar, and prosumer output across all connected holons, adjusted for current weather modifiers.</p>
             </div>
             <div className="space-y-2">
                <h5 className="text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-amber-500/20 pb-2">Autonomous Discharge</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">The 0.15 coefficient represents the 'Safe Sustained Discharge' weight—ensuring storage contributes to adequacy without instant depletion.</p>
             </div>
             <div className="space-y-2">
                <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-500/20 pb-2">System Load</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">The aggregate demand from industrial, residential, and internal operations. Spikes during stormy weather due to HVAC stress modeling.</p>
             </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 bg-indigo-500/5">
          <p className="text-xs text-slate-400 leading-relaxed text-center font-medium italic">
            "A resilience score of <strong>100%</strong> represents perfect equilibrium. Scores below <strong>75%</strong> trigger stability warnings, while scores below <strong>40%</strong> indicate imminent localized cascading failures."
          </p>
        </div>
      </section>

      {/* OPERATIONAL PROTOCOL SECTION */}
      <section className="glass p-12 rounded-[3rem] border border-white/10 space-y-12 shadow-2xl">
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">System Orchestration Protocol</h3>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Deployment sequence for high-fidelity grid modeling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { step: 1, title: 'Node Mapping', icon: 'M4 7v10l8 4 8-4V7l-8-4-8 4z', desc: 'Define your production, storage, and consumption nodes via the Grid Console.' },
            { step: 2, title: 'Network Weather', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', desc: 'Select environmental conditions to trigger asset yield variations.' },
            { step: 3, title: 'Velocity Calibration', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Choose a temporal scale (1x to 20x) to observe long-term trends.' },
            { step: 4, title: 'Engine Ignition', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', desc: 'Launch the simulation and monitor real-time AI stability assessment.' }
          ].map((item) => (
            <div key={item.step} className="space-y-6 group">
              <div className="w-14 h-14 bg-slate-900 border border-white/5 text-teal-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl group-hover:border-teal-500/50 group-hover:scale-110 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
              </div>
              <div className="space-y-2">
                <h4 className="text-slate-100 font-black text-sm uppercase tracking-widest">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-teal-500/5 rounded-3xl border border-teal-500/20 flex items-center gap-6 shadow-inner">
          <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-teal-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            <strong className="text-teal-400 uppercase tracking-widest">Critical Optimization:</strong> Always pair high-volatility wind assets with low-latency storage holons (Tesla Megapacks) to maintain an Adequacy Index above 90% during storms.
          </p>
        </div>
      </section>

      {/* User Personas & Value */}
      <section className="glass p-12 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
        <h3 className="text-2xl font-black text-white text-center uppercase tracking-tight">Strategic Stakeholder Value</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 text-xs font-black uppercase tracking-tighter shadow-lg">Grid-E</div>
              <h4 className="text-white font-black uppercase tracking-widest">Network Engineers</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Simulate <strong>"N-1" Failure Scenarios</strong> to validate if microgrid holons can sustain critical hospital loads using only local prosumer solar assets during regional outages.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 text-xs font-black uppercase tracking-tighter shadow-lg">Exec-S</div>
              <h4 className="text-white font-black uppercase tracking-widest">Portfolio Managers</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Analyze <strong>Return on Resilience (RoR)</strong> by visualizing how battery storage density reduces reliance on expensive, high-emission peaker plants during peak demand hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
