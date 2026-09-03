"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Bot, ArrowRightLeft, History, Plane, Globe2, Calendar, Target, Settings, LayoutDashboard, Copy, Menu, X
} from "lucide-react";
import Link from "next/link";
import { useAccount, useReadContract, useBlockNumber } from "wagmi";
import { formatUnits, parseAbi } from "viem";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BOT_CHAIN } from "@/lib/bot-chain";

const CUSD_ADDRESS = BOT_CHAIN.tokenAddress;

const erc20Abi = parseAbi([
  'function balanceOf(address account) view returns (uint256)'
]);

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: "overview" | "buy" | "policies" | "agent" | "savings" | "autopay" | "fx" | "settings";
}

export function DashboardShell({ children, activeTab }: DashboardShellProps) {
  const { address, isConnected } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: walletCusdBalance } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const formattedWalletBalance = walletCusdBalance ? formatUnits(walletCusdBalance, 18) : "0.00";

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied!");
  };

  if (!mounted) return null;

  // Wallet connection gatekeeper
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 font-body pt-[80px]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.03),transparent_70%)]"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="liquid-glass p-10 rounded-3xl max-w-md w-full border border-white/10 flex flex-col items-center text-center relative overflow-hidden z-10 animate-fade-in"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
            <ShieldCheck className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl font-heading italic text-white mb-3">Dashboard Locked</h1>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Please connect your wallet to access TravelShield's DeFAI Console and transaction analysis records.
          </p>
          <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
        </motion.div>
      </div>
    );
  }

  // Sidebar Menu Items with actual URLs
  const sidebarItems = [
    { id: "overview", label: "Overview & Analytics", icon: <LayoutDashboard size={18} />, href: "/admin" },
    { id: "buy", label: "Buy Policy", icon: <Plane size={18} />, href: "/buy-policy" },
    { id: "policies", label: "My Policies", icon: <History size={18} />, href: "/policies" },
    { id: "agent", label: "Conversational Agent", icon: <Bot size={18} />, href: "/agent" },
    { id: "savings", label: "Savings Coach", icon: <Target size={18} />, href: "/savings" },
    { id: "autopay", label: "Autopay Manager", icon: <Calendar size={18} />, href: "/autopay" },
    { id: "fx", label: "FX Hedging Shield", icon: <Globe2 size={18} />, href: "/fx-shield" },
    { id: "settings", label: "Console Settings", icon: <Settings size={18} />, href: "/settings" },
  ];

  return (
    <div className="min-h-screen flex bg-black text-white font-body overflow-x-hidden pt-[80px]">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(107,33,168,0.03),transparent_50%)]"></div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="flex flex-col h-[calc(100vh-80px)] sticky top-[80px] p-6 justify-between">
          <div className="space-y-8">
            {/* Wallet Info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl"></div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1.5">Connected Wallet</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/80 font-medium">
                  {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "..."}
                </span>
                <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors">
                  <Copy size={12} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[11px] text-white/50">Balance</span>
                <span className="font-heading italic text-sm text-yellow-400">{parseFloat(formattedWalletBalance).toFixed(2)} cUSD</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-3 mb-3">Workspace Console</p>
              {sidebarItems.map((item) => (
                <Link key={item.id} href={item.href} className="block">
                  <span
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      activeTab === item.id 
                        ? "bg-white text-black font-semibold shadow-[0_4px_15px_rgba(255,255,255,0.15)]" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={activeTab === item.id ? "text-black" : "text-white/70"}>{item.icon}</span>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Area */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="font-semibold uppercase tracking-wider text-[9px]">Agent Network Syncing</span>
            </div>
            {blockNumber && (
              <p className="text-[10px] text-white/30 font-mono text-center">Block Height: {blockNumber.toString()}</p>
            )}
          </div>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/10 p-6 flex flex-col justify-between z-50 md:hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
                    <span className="font-heading italic text-xl">Console Menu</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-white/5 border border-white/10">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mb-1">Active Account</p>
                  <p className="font-mono text-xs text-white/80">{address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "..."}</p>
                  <p className="mt-2 text-sm text-yellow-400 font-heading italic">{parseFloat(formattedWalletBalance).toFixed(2)} cUSD</p>
                </div>

                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <Link key={item.id} href={item.href} className="block" onClick={() => setIsMobileMenuOpen(false)}>
                      <span
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                          activeTab === item.id 
                            ? "bg-white text-black font-semibold" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="flex-1 min-h-[calc(100vh-80px)] flex flex-col relative z-10 w-full overflow-y-auto px-4 md:px-8 py-8">
        
        {/* Mobile Header Trigger */}
        <div className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-white/10">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
          >
            <Menu size={18} />
            <span>Console Menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-[10px] text-green-400 uppercase tracking-widest font-semibold">Synced</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
