"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, Plus, Clock, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AutopayPage() {
  const [bills, setBills] = useState([
    { id: 1, name: "TravelShield Policy Premium", amount: 1.50, cycle: "Monthly", nextDate: "2026-06-01", type: "insurance" },
    { id: 2, name: "Netflix", amount: 15.99, cycle: "Monthly", nextDate: "2026-05-30", type: "subscription" },
    { id: 3, name: "Spotify", amount: 10.99, cycle: "Monthly", nextDate: "2026-06-15", type: "subscription" },
  ]);

  const cancelBill = (id: number) => {
    setBills(bills.filter(b => b.id !== id));
    toast.success("Subscription cancelled on-chain");
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
              Let the agent track your recurring stablecoin charges, pay bills automatically, and cancel unused subscriptions with one tap.
            </p>
          </div>
          
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Plus size={18} /> New Recurring Payment
          </button>
        </div>

        <div className="liquid-glass rounded-3xl p-8 border border-white/5">
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
                
                <h3 className="text-xl font-heading italic mb-1">{bill.name}</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-3xl font-light">{bill.amount}</span>
                  <span className="text-sm text-white/50 mb-1">cUSD / {bill.cycle.toLowerCase()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/60 mb-6 bg-white/5 p-3 rounded-lg">
                  <Clock size={16} /> Next payment: {new Date(bill.nextDate).toLocaleDateString()}
                </div>

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
        </div>

      </main>
    </div>
  );
}
