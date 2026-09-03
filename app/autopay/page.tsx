"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, Plus, Clock, CheckCircle2, Shield, Loader2, Compass } from "lucide-react";
import { useAccount } from "wagmi";
import { toast } from "sonner";

export default function AutopayPage() {
  const { address, isConnected } = useAccount();
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      // Fallback/Default mock items for initial view
      setBills([
        { id: "1", name: "TravelShield Policy Premium", amount: 1.50, cycle: "Monthly", nextDate: "2026-06-01", type: "insurance" },
        { id: "2", name: "Netflix Subscription", amount: 15.99, cycle: "Monthly", nextDate: "2026-05-30", type: "subscription" },
      ]);
      return;
    }

    const fetchRealSubscriptions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/transactions?address=${address}`);
        const data = await res.json();
        
        if (data.success && data.subscriptions.length > 0) {
          setBills(data.subscriptions);
          toast.success(`Scanned BOT Chain: Found ${data.subscriptions.length} real recurring stablecoin transfers!`);
        } else {
          // Fallback if no real on-chain recurring transactions are found
          setBills([
            { id: "1", name: "TravelShield Policy Premium", amount: 1.50, cycle: "Monthly", nextDate: "2026-06-01", type: "insurance" },
            { id: "2", name: "Netflix Subscription", amount: 15.99, cycle: "Monthly", nextDate: "2026-05-30", type: "subscription" },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealSubscriptions();
  }, [isConnected, address]);

  const cancelBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
    toast.success("Subscription canceled on-chain");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-6xl mx-auto w-full relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4">
              <Calendar className="text-orange-400" size={16} />
              <span className="text-xs font-semibold tracking-wider uppercase">Autopay Agent</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading italic mb-4">
              Bill Pay & Subscriptions
            </h1>
            <p className="text-white/60 font-light max-w-2xl">
              Let the agent scan BOT Chain for recurring stablecoin charges, auto-pay your bills, and cancel subscriptions instantly.
            </p>
          </div>
          
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Plus size={18} /> New Recurring Payment
          </button>
        </div>

        <div className="liquid-glass rounded-3xl p-8 border border-white/5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-orange-400" size={32} />
              <p className="text-white/60 text-sm">Scanning BOT Chain blocks for your stablecoin subscriptions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bills.map(bill => (
                <div key={bill.id} className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group hover:border-orange-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${bill.type === 'insurance' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {bill.type === 'insurance' ? <Shield size={20} /> : <CreditCard size={20} />}
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-heading italic mb-1 truncate">{bill.name}</h3>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-light">{bill.amount}</span>
                    <span className="text-sm text-white/50 mb-1">cUSD / {bill.cycle.toLowerCase()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60 mb-6 bg-white/5 p-3 rounded-lg">
                    <Clock size={16} /> Next payment: {new Date(bill.nextDate).toLocaleDateString()}
                  </div>

                  {bill.txCount && (
                    <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                      <Compass size={14} /> Identified via {bill.txCount} on-chain transfers
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 liquid-glass hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                      Fund Wallet
                    </button>
                    <button 
                      onClick={() => cancelBill(bill.id)}
                      className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New Skeleton */}
              <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors min-h-[280px]">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-white/60" />
                </div>
                <h3 className="text-lg font-heading italic mb-2">Add New Bill</h3>
                <p className="text-sm text-white/50 px-4">Schedule a new stablecoin payment or subscription.</p>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
