"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, ArrowRight, Wallet, CheckCircle2, Zap, Activity } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseAbi, formatUnits, parseUnits } from "viem";
import { toast } from "sonner";
import { BOT_CHAIN } from "@/lib/bot-chain";

const CUSD_MAINNET_ADDRESS = BOT_CHAIN.tokenAddress;
const VAULT_ADDRESS = (process.env.NEXT_PUBLIC_INSURANCE_POOL_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

const erc20Abi = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
]);

export default function SavingsCoachPage() {
  const { address, isConnected } = useAccount();
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  
  // Savings goals
  const [goals, setGoals] = useState<any[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem("travelshield_savings_goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    }
  }, []);

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CUSD_MAINNET_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const formattedBalance = balance ? formatUnits(balance, 18) : "0.00";

  const { writeContract, isPending } = useWriteContract();

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalAmount) return;
    
    const newGoals = [...goals, {
      id: Date.now(),
      name: goalName,
      target: parseFloat(goalAmount),
      current: 0,
      active: true
    }];
    
    setGoals(newGoals);
    localStorage.setItem("travelshield_savings_goals", JSON.stringify(newGoals));
    
    setGoalName("");
    setGoalAmount("");
    toast.success("Savings goal created!");
  };

  const handleQuickSaveOnChain = (goalId: number, amount: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first!");
      return;
    }

    const toastId = toast.loading("Initiating live BOT Chain USD deposit...");

    writeContract({
      address: CUSD_MAINNET_ADDRESS,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [VAULT_ADDRESS, parseUnits(amount.toString(), 18)],
    }, {
      onSuccess: (txHash) => {
        toast.dismiss(toastId);
        toast.success(`Transaction Sent! Hash: ${txHash.substring(0, 10)}...`);
        
        // Update local state dynamically to match on-chain success
        const updatedGoals = goals.map(g => {
          if (g.id === goalId) {
            return { ...g, current: Math.min(g.current + amount, g.target) };
          }
          return g;
        });
        setGoals(updatedGoals);
        localStorage.setItem("travelshield_savings_goals", JSON.stringify(updatedGoals));

        setTimeout(() => refetchBalance(), 4000);
      },
      onError: (err) => {
        toast.dismiss(toastId);
        toast.error(`Transaction Failed: ${err.message.substring(0, 50)}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4">
              <Target className="text-green-400" size={16} />
              <span className="text-xs font-semibold tracking-wider uppercase">AI Savings Coach</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading italic mb-4">
              cUSD Savings Goals
            </h1>
            <p className="text-white/60 font-light max-w-2xl">
              Set travel goals, automatically deposit into your on-chain Celo yield vault, and track your progress in real-time.
            </p>
          </div>
          
          <div className="liquid-glass rounded-2xl p-6 border border-white/10 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Wallet className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-1">Live cUSD Balance</p>
              <p className="text-3xl font-heading italic">{parseFloat(formattedBalance).toFixed(2)} <span className="text-lg text-white/50">cUSD</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Goal Form */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/5 lg:col-span-1 h-fit">
            <h2 className="text-2xl font-heading italic mb-6">Create New Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Goal Name</label>
                <input 
                  type="text" 
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="e.g. Paris Summer 2026"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Target Amount (cUSD)</label>
                <input 
                  type="number" 
                  value={goalAmount}
                  onChange={e => setGoalAmount(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition-colors"
                  placeholder="1000"
                  min="1"
                />
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl my-4">
                <div className="flex gap-3 mb-2">
                  <Zap className="text-green-400 shrink-0" size={18} />
                  <p className="text-sm font-medium text-green-400">AI Coach Suggestion</p>
                </div>
                <p className="text-xs text-green-400/80 leading-relaxed">
                  "I suggest connecting your wallet and saving 10 cUSD today to establish your on-chain yield multiplier before your Paris trip."
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-full bg-white text-black font-medium hover:bg-green-400 transition-colors"
              >
                Set Goal
              </button>
            </form>
          </div>

          {/* Active Goals */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-heading italic mb-2">Your On-Chain Vaults</h2>
            
            {goals.length === 0 ? (
              <div className="liquid-glass rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Target className="text-white/40 animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-heading italic mb-2">No Active Vaults</h3>
                <p className="text-sm text-white/50 max-w-sm">
                  Create a custom travel goal on the left to activate your secure on-chain cUSD yield vault!
                </p>
              </div>
            ) : (
              goals.map(goal => {
                const progress = Math.min((goal.current / goal.target) * 100, 100);
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={goal.id} 
                    className="liquid-glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-heading italic mb-1">{goal.name}</h3>
                        <p className="text-sm text-white/50">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} cUSD</p>
                      </div>
                      {progress === 100 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle2 size={14} /> Goal Reached
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/70 rounded-full text-xs font-medium">
                          <TrendingUp size={14} /> Earning Yield
                        </div>
                      )}
                    </div>

                    <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden mb-6 border border-white/10">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleQuickSaveOnChain(goal.id, 10)}
                        disabled={progress === 100 || isPending}
                        className="px-4 py-2 liquid-glass hover:bg-white/10 rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isPending ? <Activity size={14} className="animate-spin" /> : "+ 10 cUSD"}
                      </button>
                      <button 
                        onClick={() => handleQuickSaveOnChain(goal.id, 50)}
                        disabled={progress === 100 || isPending}
                        className="px-4 py-2 liquid-glass hover:bg-white/10 rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {isPending ? <Activity size={14} className="animate-spin" /> : "+ 50 cUSD"}
                      </button>
                      <button 
                        onClick={() => handleQuickSaveOnChain(goal.id, 100)}
                        disabled={progress === 100 || isPending}
                        className="px-4 py-2 bg-white text-black hover:bg-green-400 rounded-full text-sm font-medium transition-colors ml-auto flex items-center gap-2 disabled:opacity-50"
                      >
                        Deposit 100 cUSD <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
