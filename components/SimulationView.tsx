
import React, { useState } from 'react';
import { Holon, HolonType, HolonStatus, WeatherType } from '../types';
import { predictStabilityChange } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  holons: Holon[];
  weather: WeatherType;
  onToggleStatus: (id: string) => void;
  onReparent: (holonId: string, newParentId: string | null) => void;
  onAddHolon: (h: Partial<Holon>) => void;
  onRemoveHolon: (id: string) => void;
}

const HolonIcon: React.FC<{ type: HolonType; name: string; className?: string }> = ({ type, name, className = "w-6 h-6" }) => {
  const n = name.toLowerCase();
  if (n.includes('solar')) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 110 8 4 4 0 010-8z" /></svg>;
  if (n.includes('wind')) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0L10 4m2 1v2.5M7 21l-2-1m2 1l-2 1m2-1V18.5M7 14l-2-1m2 1l-2 1m2-1V11.5M7 7l-2-1m2 1l-2 1m2-1V4.5" /></svg>;
  if (n.includes('battery') || n.includes('storage') || n.includes('megapack')) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  if (n.includes('factory') || n.includes('industrial')) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
  if (n.includes('residential') || n.includes('house')) return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  
  switch (type) {
    case HolonType.PRODUCER: return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    case HolonType.CONSUMER: return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    case HolonType.STORAGE: return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    default: return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10l8 4 8-4V7l-8-4-8 4z" /></svg>;
  }
};

const NewHolonCard: React.FC<{ onAdd: (h: Partial<Holon>) => void; parents: Holon[] }> = ({ onAdd, parents }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: HolonType.CONSUMER,
    parentId: 'grid-master',
    capacity: 200
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name || 'Unnamed Unit',
      type: formData.type,
      parentId: formData.parentId,
      baseCapacity: formData.type === HolonType.CONSUMER ? 0 : formData.capacity,
      baseDemand: formData.type === HolonType.PRODUCER ? 0 : formData.capacity * 0.8
    });
    setIsAdding(false);
    setFormData({ name: '', type: HolonType.CONSUMER, parentId: 'grid-master', capacity: 200 });
  };

  if (!isAdding) {
    return (
      <button 
        onClick={() => setIsAdding(true)}
        className="glass border-2 border-dashed border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-6 hover:bg-slate-900/40 hover:border-teal-500/50 transition-all group min-h-[350px] shadow-xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          <svg className="w-8 h-8 text-slate-600 group-hover:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div className="text-center">
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] group-hover:text-teal-400 block">Deploy Node</span>
          <span className="text-[9px] text-slate-700 font-bold uppercase block mt-1">Expansion Protocol</span>
        </div>
      </button>
    );
  }

  return (
    <div className="glass p-8 rounded-[2rem] border border-teal-500/30 animate-in zoom-in-95 duration-200 min-h-[350px] flex flex-col justify-center shadow-2xl">
      <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-6">Initialize Hardware Node</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Node Identifier</label>
          <input 
            autoFocus
            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-teal-500 transition-colors"
            placeholder="e.g. South Solar Bank"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Asset Class</label>
            <select 
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-teal-500 appearance-none transition-colors"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as HolonType})}
            >
              {Object.values(HolonType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Nominal kW</label>
            <input 
              type="number"
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-teal-500 transition-colors"
              placeholder="kW"
              value={formData.capacity}
              onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-600 uppercase ml-1">Grid Parent</label>
          <select 
            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-teal-500 transition-colors"
            value={formData.parentId}
            onChange={e => setFormData({...formData, parentId: e.target.value})}
          >
            {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg hover:shadow-teal-500/30">Connect</button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all">Abort</button>
        </div>
      </form>
    </div>
  );
};

const HolonCard: React.FC<{ 
  holon: Holon; 
  onToggle: () => void;
  onRemove: () => void;
  onReparent: (newPid: string | null) => void;
  allHolons: Holon[];
}> = ({ holon, onToggle, onRemove, onReparent, allHolons }) => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  
  const lastReading = holon.history[holon.history.length - 1];
  const net = lastReading?.net ?? 0;
  const isMaintenance = holon.status === HolonStatus.MAINTENANCE;
  const parentName = allHolons.find(h => h.id === holon.parentId)?.name || "Isolated Island";

  const handleReparent = async (newPid: string | null) => {
    const oldParentName = allHolons.find(h => h.id === holon.parentId)?.name || "Unassigned";
    const newParentName = allHolons.find(h => h.id === newPid)?.name || "Unassigned";
    
    setIsPredicting(true);
    const p = await predictStabilityChange(holon, oldParentName, newParentName, allHolons);
    setPrediction(p);
    setIsPredicting(false);
    onReparent(newPid);
  };

  const getTypeColor = (type: HolonType) => {
    if (isMaintenance) return 'border-slate-800 opacity-60 bg-slate-950/40 grayscale shadow-none';
    switch (type) {
      case HolonType.PRODUCER: return 'text-emerald-400 border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_4px_30px_rgba(16,185,129,0.05)]';
      case HolonType.CONSUMER: return 'text-rose-400 border-rose-500/20 hover:border-rose-500/50 shadow-[0_4px_30px_rgba(244,63,94,0.05)]';
      case HolonType.STORAGE: return 'text-amber-400 border-amber-500/20 hover:border-amber-500/50 shadow-[0_4px_30px_rgba(251,191,36,0.05)]';
      case HolonType.PROSUMER: return 'text-teal-400 border-teal-500/20 hover:border-teal-500/50 shadow-[0_4px_30px_rgba(20,184,166,0.05)]';
    }
  };

  return (
    <div className={`glass p-6 rounded-[2rem] border-l-4 transition-all relative group overflow-hidden ${getTypeColor(holon.type)}`}>
      {isMaintenance && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center z-10">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-700 shadow-2xl">Maintenance Offline</span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-20">
        <div className="flex gap-4 flex-1 min-w-0">
          <div className={`p-3 rounded-2xl bg-slate-900/80 border border-white/5 transition-all group-hover:scale-110 shrink-0 ${!isMaintenance ? 'text-current shadow-lg' : 'text-slate-600'}`}>
            <HolonIcon type={holon.type} name={holon.name} className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-slate-100 uppercase tracking-tight text-sm truncate">{holon.name}</h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span>
              <span className="truncate">Parent: {parentName}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-4 shrink-0">
           <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:border-teal-500/40 text-slate-600 hover:text-teal-400 transition-all shadow-md" title="Toggle Maintenance">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </button>
          {holon.id !== 'grid-master' && (
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2 rounded-xl bg-slate-900 border border-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-600 transition-all shadow-md" title="Decommission Node">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 relative z-20">
        <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1.5 block ml-1">Grid Architecture Position</label>
        <select 
          value={holon.parentId || ''}
          onChange={(e) => handleReparent(e.target.value || null)}
          className="w-full bg-slate-900/80 border border-white/5 rounded-xl text-[10px] font-bold px-4 py-2.5 text-slate-400 outline-none focus:border-teal-500 transition-all shadow-inner appearance-none"
          disabled={holon.id === 'grid-master'}
        >
          <option value="">[ISLANDING MODE]</option>
          <optgroup label="Available Distribution Hubs">
            {allHolons.filter(h => h.id !== holon.id && h.type !== HolonType.CONSUMER).map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </optgroup>
        </select>
      </div>
      
      <div className="h-24 w-full mb-6 bg-slate-950/60 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={holon.history.slice(-30)}>
            <Tooltip content={<div className="hidden" />} />
            <Area type="monotone" dataKey="production" stroke="#14b8a6" strokeWidth={2} fill="#14b8a6" fillOpacity={0.05} isAnimationActive={false} />
            <Area type="monotone" dataKey="consumption" stroke="#f43f5e" strokeWidth={2} fill="#f43f5e" fillOpacity={0.05} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm relative z-20 mb-6">
        <div className="flex flex-col p-3 bg-slate-950/40 rounded-2xl border border-white/5">
          <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Live Prod</span>
          <span className={`font-mono text-sm font-black tabular-nums ${isMaintenance ? 'text-slate-800' : 'text-emerald-400'}`}>{(lastReading?.production || 0).toLocaleString()} <span className="text-[10px] opacity-50">kW</span></span>
        </div>
        <div className="flex flex-col p-3 bg-slate-950/40 rounded-2xl border border-white/5">
          <span className="text-slate-600 text-[9px] font-black uppercase tracking-widest mb-1">Live Load</span>
          <span className={`font-mono text-sm font-black tabular-nums ${isMaintenance ? 'text-slate-800' : 'text-rose-400'}`}>{(lastReading?.consumption || 0).toLocaleString()} <span className="text-[10px] opacity-50">kW</span></span>
        </div>
      </div>

      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-2 shadow-inner border border-white/5">
        <div 
          className={`h-full transition-all duration-700 shadow-[0_0_10px_current] ${isMaintenance ? 'bg-slate-800' : (net >= 0 ? 'bg-emerald-500' : 'bg-rose-500')}`}
          style={{ width: `${Math.min(100, Math.abs(net) / (holon.baseCapacity || holon.baseDemand || 1) * 100)}%` }}
        />
      </div>

      {prediction && !isPredicting && (
        <div className="text-[10px] text-teal-400/80 italic border-t border-white/5 pt-4 mt-4 leading-relaxed bg-teal-500/5 -mx-6 px-6 pb-2">
          <span className="font-black text-[8px] uppercase tracking-widest block mb-1">AI Stability Assessment</span>
          {prediction}
        </div>
      )}
    </div>
  );
};

export const SimulationView: React.FC<Props> = ({ holons, weather, onToggleStatus, onReparent, onAddHolon, onRemoveHolon }) => {
  const master = holons.find(h => h.id === 'grid-master');
  const children = holons.filter(h => h.id !== 'grid-master');

  return (
    <div className="space-y-12 pb-10">
      <div className="flex justify-center">
        {master && (
          <div className="w-full max-w-lg animate-in zoom-in duration-500">
            <div className="text-center mb-4">
              <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em]">Primary Grid Controller</span>
            </div>
            <HolonCard holon={master} onToggle={() => onToggleStatus(master.id)} onRemove={() => onRemoveHolon(master.id)} onReparent={(p) => onReparent(master.id, p)} allHolons={holons} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children.map((holon, idx) => (
          <div key={holon.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
            <HolonCard holon={holon} onToggle={() => onToggleStatus(holon.id)} onRemove={() => onRemoveHolon(holon.id)} onReparent={(p) => onReparent(holon.id, p)} allHolons={holons} />
          </div>
        ))}
        <NewHolonCard onAdd={onAddHolon} parents={holons.filter(h => h.type !== HolonType.CONSUMER)} />
      </div>
    </div>
  );
};
