
import React, { useMemo } from 'react';
import { Holon, HolonType, HolonStatus } from '../types';

interface Props {
  holons: Holon[];
}

const HolonIcon: React.FC<{ type: HolonType; name: string; className?: string }> = ({ type, name, className = "w-5 h-5" }) => {
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

const HolonTreeNode: React.FC<{ holon: Holon; allHolons: Holon[]; level: number; isLastChild?: boolean }> = ({ holon, allHolons, level, isLastChild }) => {
  const children = useMemo(() => allHolons.filter(h => h.parentId === holon.id), [allHolons, holon.id]);
  const isMaintenance = holon.status === HolonStatus.MAINTENANCE;

  const getTypeColor = (type: HolonType) => {
    if (isMaintenance) return 'text-slate-600 border-slate-800 bg-slate-900/40';
    switch (type) {
      case HolonType.PRODUCER: return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10';
      case HolonType.CONSUMER: return 'text-rose-400 border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10';
      case HolonType.STORAGE: return 'text-amber-400 border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10';
      case HolonType.PROSUMER: return 'text-teal-400 border-teal-500/40 bg-teal-500/5 hover:bg-teal-500/10';
    }
  };

  return (
    <div className="flex flex-col items-start relative w-full">
      {/* Node Container */}
      <div className={`group flex items-center gap-4 glass px-5 py-3 rounded-2xl border-l-4 shadow-xl transition-all hover:translate-x-1 min-w-[240px] z-20 ${getTypeColor(holon.type)}`}>
        <div className={`p-2.5 rounded-xl bg-slate-900/90 border border-white/5 shadow-lg group-hover:scale-110 transition-transform ${isMaintenance ? 'opacity-40 grayscale' : 'text-current'}`}>
          <HolonIcon type={holon.type} name={holon.name} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-[11px] font-black uppercase tracking-tight ${isMaintenance ? 'text-slate-600' : 'text-slate-100'}`}>
              {holon.name}
            </h4>
            {level > 0 && (
              <span className="text-[8px] font-black text-slate-700 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">L{level}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 opacity-60">{holon.type}</span>
            {isMaintenance && (
              <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Offline</span>
            )}
          </div>
        </div>
      </div>

      {/* Recursive Children Container */}
      {children.length > 0 && (
        <div className="ml-[26px] mt-6 space-y-6 relative border-l-2 border-slate-800/50 pl-10 pb-2">
          {children.map((child, idx) => (
            <div key={child.id} className="relative">
              {/* Circuit Connector Line (L-Shape) */}
              <div className="absolute -left-10 top-6 w-10 h-0.5 bg-slate-800/50 group-hover:bg-teal-500/30 transition-colors"></div>
              {/* Corner Tracer */}
              <div className="absolute -left-[42px] top-[-24px] w-0.5 h-[32px] bg-slate-800/50"></div>
              
              <HolonTreeNode 
                holon={child} 
                allHolons={allHolons} 
                level={level + 1} 
                isLastChild={idx === children.length - 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const HierarchyView: React.FC<Props> = ({ holons }) => {
  // A node is a root if it has no parent or its parent doesn't exist in the current holon list
  const rootNodes = useMemo(() => {
    const ids = new Set(holons.map(h => h.id));
    return holons.filter(h => h.parentId === null || !ids.has(h.parentId));
  }, [holons]);

  const masterGrid = useMemo(() => rootNodes.find(n => n.id === 'grid-master'), [rootNodes]);
  const otherRoots = useMemo(() => rootNodes.filter(n => n.id !== 'grid-master'), [rootNodes]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center justify-center gap-4">
          <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
          Grid Holarchy Map
          <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
        </h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Recursive Distribution Topology & Logical Flow</p>
      </div>

      <div className="glass p-10 lg:p-20 rounded-[4rem] border border-white/5 overflow-x-auto min-h-[700px] shadow-2xl bg-slate-950/40 relative">
        {/* Decorative Grid Overlay for Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="flex flex-col gap-20 relative z-10">
          {/* Main Grid Hierarchy */}
          {masterGrid && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Primary Distribution Authority</span>
              </div>
              <HolonTreeNode holon={masterGrid} allHolons={holons} level={0} />
            </div>
          )}

          {/* Islanded / Autonomous Clusters */}
          {otherRoots.length > 0 && (
            <div className="pt-12 border-t border-white/5 space-y-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <span className="text-[11px] font-black text-rose-400 uppercase tracking-[0.2em]">Autonomous Islanded Clusters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {otherRoots.map(root => (
                  <div key={root.id} className="space-y-4">
                    <HolonTreeNode holon={root} allHolons={holons} level={0} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Legend Overlay */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60]">
        <div className="glass px-8 py-4 rounded-3xl border border-white/10 flex items-center gap-10 shadow-2xl backdrop-blur-2xl">
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Generator</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"></div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Load</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]"></div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Storage</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.5)]"></div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Prosumer</span>
           </div>
           <div className="w-px h-6 bg-white/10"></div>
           <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-slate-700"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Disabled</span>
           </div>
        </div>
      </div>
    </div>
  );
};
