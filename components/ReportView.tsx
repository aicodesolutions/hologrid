
import React, { useState } from 'react';
import { Holon } from '../types';
import { generateHolonicReport } from '../services/geminiService';

interface Props {
  holons: Holon[];
}

export const ReportView: React.FC<Props> = ({ holons }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateHolonicReport(holons);
    setReport(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="glass p-8 rounded-3xl text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-100">Holonic Intelligence Report</h2>
        <p className="text-slate-400">
          Utilize Gemini AI to analyze the current holarchy performance, identify prosumer trends, and generate strategic optimization recommendations.
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading || holons[0].history.length === 0}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-800 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Model...
            </span>
          ) : 'Generate Executive Summary'}
        </button>
        {holons[0].history.length === 0 && (
          <p className="text-rose-400 text-sm italic">Run the simulation first to gather data.</p>
        )}
      </div>

      {report && (
        <div className="glass p-10 rounded-3xl prose prose-invert max-w-none border-t-4 border-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full">AI Generated Insights</span>
            <button 
              onClick={() => window.print()} 
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Save PDF
            </button>
          </div>
          <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};
