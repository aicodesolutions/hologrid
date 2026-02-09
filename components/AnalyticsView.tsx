
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';
import { Holon, ChangeLogEntry } from '../types';

interface Props {
  holons: Holon[];
  changeLogs: ChangeLogEntry[];
}

export const AnalyticsView: React.FC<Props> = ({ holons, changeLogs }) => {
  const master = holons.find(h => h.id === 'grid-master');
  const historyData = master?.history.map((h, i) => ({
    name: i,
    production: h.production,
    consumption: h.consumption,
    net: h.net
  })) || [];

  const typeData = [
    { name: 'Production', value: holons.reduce((acc, h) => acc + (h.history[h.history.length-1]?.production || 0), 0) },
    { name: 'Consumption', value: holons.reduce((acc, h) => acc + (h.history[h.history.length-1]?.consumption || 0), 0) },
    { name: 'Storage', value: holons.reduce((acc, h) => acc + (h.history[h.history.length-1]?.storage || 0), 0) },
  ];

  const getLogColor = (type: ChangeLogEntry['type']) => {
    switch (type) {
      case 'ENVIRONMENT': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'STRUCTURE': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'NODE_MGMT': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'SYSTEM': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Aggregated Grid Flow (kW)
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" hide />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="production" stroke="#10b981" fillOpacity={1} fill="url(#colorProd)" name="Production" />
                <Area type="monotone" dataKey="consumption" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCons)" name="Consumption" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            Current Distribution
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Bar dataKey="value" name="kW">
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#f43f5e', '#fbbf24'][index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          Holon Detailed Efficiency
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
              <tr>
                <th className="px-6 py-3">Holon Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Avg Net (last 50 ticks)</th>
                <th className="px-6 py-3">Capacity/Demand</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {holons.map(h => {
                const avgNet = h.history.length > 0 ? h.history.reduce((a, b) => a + b.net, 0) / h.history.length : 0;
                return (
                  <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100">{h.name}</td>
                    <td className="px-6 py-4 uppercase text-[10px] tracking-widest">{h.type}</td>
                    <td className={`px-6 py-4 font-mono ${avgNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {avgNet.toFixed(1)} kW
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {h.baseCapacity || h.baseDemand} kW
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${h.currentEfficiency > 0.9 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {(h.currentEfficiency * 100).toFixed(0)}% OPTIMAL
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-t-2 border-teal-500/30">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Activity & Impact Log</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Auditing user-initiated grid reconfiguration</p>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Env</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Logic</span>
            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Node</span>
          </div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {changeLogs.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-white/5">
              <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">No architectural shifts recorded in this session</span>
            </div>
          ) : (
            changeLogs.map((log) => (
              <div key={log.id} className="flex gap-4 p-5 bg-slate-950/60 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                <div className={`w-1 h-12 rounded-full shrink-0 ${getLogColor(log.type).split(' ')[0].replace('text-', 'bg-')}`}></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getLogColor(log.type)}`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono text-slate-700">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200">{log.details}</p>
                  <div className="flex items-start gap-2 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                    <svg className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
                      <strong className="text-teal-400 not-italic uppercase tracking-widest text-[9px] mr-1">Simulation Impact:</strong>
                      {log.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
