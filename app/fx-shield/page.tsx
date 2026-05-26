"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe2, ShieldAlert, ArrowDownRight, ArrowUpRight, History, Settings2, BarChart2 } from "lucide-react";

export default function FxShieldPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch('/api/fx-rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrencies(data.currencies);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4">
              <Globe2 className="text-blue-400" size={16} />
              <span className="text-xs font-semibold tracking-wider uppercase">FX Hedging Agent</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading italic mb-4">
              Protect Your Value
            </h1>
            <p className="text-white/60 font-light max-w-2xl">
              Earn in local currency, save in cUSD. Our AI agent monitors Emerging Market FX rates and automatically converts your deposits to protect against devaluation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Agent Configuration */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/5 lg:col-span-1 h-fit">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
              <Settings2 className="text-white" size={24} />
              <h2 className="text-2xl font-heading italic">Agent Rules</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Base Local Currency</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none">
                  <option value="NGN">🇳🇬 NGN - Nigerian Naira</option>
                  <option value="KES">🇰🇪 KES - Kenyan Shilling</option>
                  <option value="ARS">🇦🇷 ARS - Argentine Peso</option>
                  <option value="TRY">🇹🇷 TRY - Turkish Lira</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Auto-Convert Trigger</label>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-sm font-medium mb-3">Convert incoming deposits when:</p>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm text-white/80">Currency drops &gt; 2% week-over-week</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm text-white/80">Always (Dollar-cost average)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Conversion Ratio</label>
                <input type="range" className="w-full accent-blue-500" min="0" max="100" defaultValue="80" />
                <div className="flex justify-between text-xs text-white/50 mt-2">
                  <span>Keep Local (20%)</span>
                  <span>Convert to cUSD (80%)</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Activate Hedging Agent
              </button>
            </div>
          </div>

          {/* Market Overview */}
          <div className="lg:col-span-2">
            <div className="liquid-glass rounded-3xl p-8 border border-white/5 h-full">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <BarChart2 className="text-white" size={24} />
                <h2 className="text-2xl font-heading italic">Emerging Market FX Monitor</h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs text-white/40 uppercase tracking-widest border-b border-white/10">
                        <th className="pb-4 font-medium">Currency</th>
                        <th className="pb-4 font-medium text-right">Current Rate (USD)</th>
                        <th className="pb-4 font-medium text-right">7D Change</th>
                        <th className="pb-4 font-medium text-right">Agent Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currencies.map((currency) => (
                        <tr key={currency.code} className="group hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{currency.flag}</span>
                              <div>
                                <p className="font-medium">{currency.code}</p>
                                <p className="text-xs text-white/50">{currency.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-right font-mono">
                            {currency.symbol}{currency.currentRate.toFixed(2)}
                          </td>
                          <td className="py-4 text-right">
                            <div className={`inline-flex items-center gap-1 text-sm font-medium ${currency.weeklyChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {currency.weeklyChange > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                              {Math.abs(currency.weeklyChange).toFixed(2)}%
                            </div>
                            {currency.weeklyChange > 0 && <p className="text-[10px] text-red-400/70 mt-0.5">Value lost</p>}
                          </td>
                          <td className="py-4 text-right">
                            {currency.weeklyChange > 2 ? (
                              <span className="inline-flex px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Hedge Now
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 bg-white/10 text-white/50 rounded-full text-xs font-semibold uppercase tracking-wider">
                                Monitor
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
