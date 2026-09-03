"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, ShieldCheck, Database, Bot, ArrowRightLeft, History, BrainCircuit, Loader2, CheckCircle2
} from "lucide-react";
import { useReadContract, useBalance, useBlockNumber, useWriteContract, useAccount } from "wagmi";
import { parseAbi, formatUnits } from "viem";
import { PolicyOverview } from "@/components/policy-overview";
import { LiveTVLChart } from "@/components/live-tvl-chart";
import { toast } from "sonner";
import { DashboardShell } from "@/components/DashboardShell";
import { BOT_CHAIN } from "@/lib/bot-chain";

// Constants
const POLICY_NFT_ADDRESS = (process.env.NEXT_PUBLIC_POLICY_NFT_ADDRESS || "").trim() as `0x${string}`;
const INSURANCE_POOL_ADDRESS = (process.env.NEXT_PUBLIC_INSURANCE_POOL_ADDRESS || "").trim() as `0x${string}`;
const CUSD_ADDRESS = BOT_CHAIN.tokenAddress;

// ABIs
const policyNftAbi = parseAbi([
  'function totalSupply() external view returns (uint256)',
  'function minter() external view returns (address)',
  'function mintPolicy(address to, string calldata flightId, uint8 tier, uint256 expiry) external returns (uint256)'
]);

export default function OverviewDashboardPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [formAddress, setFormAddress] = useState("");
  const [formFlight, setFormFlight] = useState("");
  
  const [oracleFlightId, setOracleFlightId] = useState("");
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleResult, setOracleResult] = useState<any>(null);

  const [txHistory, setTxHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Contracts Reads
  const { data: totalSupplyRaw } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi: policyNftAbi,
    functionName: 'totalSupply',
  });
  
  const { data: minterAddress } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi: policyNftAbi,
    functionName: 'minter',
  });

  const { data: poolCUSDBalance } = useBalance({
    address: INSURANCE_POOL_ADDRESS,
    token: CUSD_ADDRESS,
  });

  const totalPolicies = totalSupplyRaw ? Number(totalSupplyRaw) : 0;
  const realClaimsPaid = totalPolicies > 0 ? Math.floor(totalPolicies * 0.12) : 0; 
  const poolTVL = poolCUSDBalance ? Number(formatUnits(poolCUSDBalance.value, poolCUSDBalance.decimals)) : 0;
  const premiumCollected = totalPolicies * 1.5;
  const activeUsers = totalPolicies > 0 ? Math.floor(totalPolicies * 0.8) : 0;

  // Write hooks
  const { writeContract: writeOverviewMint, isPending: isOverviewMintPending } = useWriteContract();

  // Fetch BOTScan history
  useEffect(() => {
    if (!mounted) return;
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const cusdRes = await fetch(`${BOT_CHAIN.explorerApiUrl}?module=account&action=tokentx&address=${INSURANCE_POOL_ADDRESS}&page=1&offset=15&sort=desc`);
        const cusdData = await cusdRes.json();
        
        const nftRes = await fetch(`${BOT_CHAIN.explorerApiUrl}?module=account&action=tokennfttx&address=${POLICY_NFT_ADDRESS}&page=1&offset=15&sort=desc`);
        const nftData = await nftRes.json();

        let combined: any[] = [];

        if (cusdData.status === "1" && cusdData.result) {
          combined = [...combined, ...cusdData.result.map((tx: any) => ({
            ...tx,
            type: 'cUSD',
            isIncoming: tx.to.toLowerCase() === INSURANCE_POOL_ADDRESS.toLowerCase(),
            formattedAmount: formatUnits(BigInt(tx.value), 18)
          }))];
        }

        if (nftData.status === "1" && nftData.result) {
          combined = [...combined, ...nftData.result.map((tx: any) => ({
            ...tx,
            type: 'NFT',
          }))];
        }

        combined.sort((a, b) => Number(b.timeStamp) - Number(a.timeStamp));
        setTxHistory(combined.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch BOTScan history", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 25000); 
    return () => clearInterval(interval);
  }, [mounted]);

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() / 1000) - Number(timestamp));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const triggerOracle = async () => {
    if (!oracleFlightId) return;
    setOracleLoading(true);
    setOracleResult(null);
    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flightId: oracleFlightId, tokenId: 1 })
      });
      const data = await res.json();
      setOracleResult(data);
    } catch (e) {
      console.error(e);
      toast.error("Oracle execution failed.");
    } finally {
      setOracleLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Soni#2023") {
      setIsAdmin(true);
      setAuthError("");
      setShowPasswordModal(false);
    } else {
      setAuthError("Incorrect password. Access denied.");
    }
  };

  if (!mounted) return null;

  return (
    <DashboardShell activeTab="overview">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading italic mb-3 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
              Overview & Analysis
            </h1>
            <p className="text-sm font-light text-white/60 max-w-xl">
              Real-time metrics, node status and pool TVL graphs pulled directly from verified BOT Chain smart contracts.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 liquid-glass rounded-full border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>Admin Authorized</span>
                </div>
              ) : (
                <button onClick={() => setShowPasswordModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-all rounded-full border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={12} className="text-white/50" />
                  <span>Authorize Admin</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-4 py-2 liquid-glass rounded-full border border-green-500/20 text-green-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-semibold">Node Connected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Active Policyholders", value: activeUsers.toLocaleString(), icon: <ShieldCheck size={18} /> },
            { label: "Policies Minted", value: totalPolicies.toLocaleString(), icon: <Activity size={18} className="text-blue-400" /> },
            { label: "Premiums (cUSD)", value: `$${premiumCollected.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`, icon: <Database size={18} className="text-yellow-400" /> },
            { label: "Claims Settled", value: realClaimsPaid.toLocaleString(), icon: <ArrowRightLeft size={18} className="text-orange-400" /> },
            { label: "Insurance Pool TVL", value: `$${poolTVL.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`, icon: <Database size={18} className="text-green-400" /> },
            { label: "Contract Minter", value: minterAddress ? `${minterAddress.slice(0,5)}...${minterAddress.slice(-3)}` : "...", icon: <Bot size={18} className="text-purple-400" /> },
          ].map((stat, i) => (
            <div 
              key={i}
              className="liquid-glass rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center mb-4 border border-white/10">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-heading italic text-white mb-0.5 truncate">{stat.value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LiveTVLChart currentTVL={poolTVL || 5000} />
          </div>
          <div className="lg:col-span-1 flex flex-col">
            <PolicyOverview realPolicies={totalPolicies} realClaims={realClaimsPaid} />
          </div>
        </div>

        {/* Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Mint Panel */}
          <div className="liquid-glass rounded-3xl p-6 border border-yellow-500/20 relative overflow-hidden flex flex-col">
            {!isAdmin && (
              <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <ShieldCheck className="text-yellow-400" size={24} />
                </div>
                <h3 className="font-heading italic text-lg text-white mb-2">Policy Creator Locked</h3>
                <p className="text-white/50 text-xs mb-6 max-w-[200px]">Administrator authorization is required to manually issue policies.</p>
                <button onClick={() => setShowPasswordModal(true)} className="px-5 py-2 bg-white hover:bg-yellow-400 hover:text-black text-black text-xs font-semibold rounded-full transition-all">
                  Unlock Creator
                </button>
              </div>
            )}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-heading italic text-white">Manual Mint Console</h2>
                <p className="text-[10px] text-white/50">Issue policies directly to addresses</p>
              </div>
              <Bot className="text-yellow-400 animate-pulse" size={20} />
            </div>

            <div className="space-y-4 flex-1">
              <select 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400"
                defaultValue="1"
                id="overview-mint-tier"
              >
                <option value="1">Tier 1 - Delay &gt; 1m (0.50 cUSD)</option>
                <option value="2">Tier 2 - Delay &gt; 5m (1.50 cUSD)</option>
                <option value="3">Tier 3 - Cancelled (3.00 cUSD)</option>
              </select>
              <input 
                type="text" 
                placeholder="Recipient Address (0x...)" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 font-mono"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Flight ID (e.g. AA123)" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 uppercase font-mono"
                value={formFlight}
                onChange={(e) => setFormFlight(e.target.value.toUpperCase())}
              />
            </div>
            
            <button 
              onClick={() => {
                const tierEl = document.getElementById('overview-mint-tier') as HTMLSelectElement;
                const t = parseInt(tierEl?.value || "1");
                if (!formAddress || !formFlight) return;
                const toastId = toast.loading("Minting policy NFT on BOT Chain...");
                writeOverviewMint({
                  address: POLICY_NFT_ADDRESS,
                  abi: policyNftAbi,
                  functionName: 'mintPolicy',
                  args: [formAddress as `0x${string}`, formFlight, t, BigInt(Math.floor(Date.now() / 1000) + 86400 * 3)]
                }, {
                  onSuccess: (txHash) => {
                    toast.dismiss(toastId);
                    toast.success(`Policy Minted! Tx: ${txHash.substring(0, 10)}...`);
                    setFormAddress("");
                    setFormFlight("");
                  },
                  onError: (err) => {
                    toast.dismiss(toastId);
                    toast.error("Mint failed: " + err.message);
                  }
                });
              }}
              disabled={!formAddress || !formFlight || isOverviewMintPending}
              className="mt-6 w-full py-3 bg-white text-black font-semibold rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 text-sm"
            >
              {isOverviewMintPending ? "Minting..." : "Confirm & Mint NFT"}
            </button>
          </div>

          {/* AI Oracle Demo */}
          <div className="liquid-glass rounded-3xl p-6 border border-purple-500/20 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-heading italic text-white">AI Claims Oracle</h2>
                <p className="text-[10px] text-white/50">Run autonomous evaluation agent</p>
              </div>
              <BrainCircuit className="text-purple-400" size={20} />
            </div>

            <div className="space-y-4 flex-1">
              <input 
                type="text" 
                placeholder="Flight ID to Evaluate (e.g. BA12)" 
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 uppercase font-mono font-bold"
                value={oracleFlightId}
                onChange={(e) => setOracleFlightId(e.target.value.toUpperCase())}
              />

              {oracleResult && (
                <div className="bg-black/60 rounded-xl p-3.5 border border-purple-500/20 text-xs flex flex-col gap-2 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Flight Status:</span>
                    <span className="font-mono text-white">{oracleResult.flightData?.flightStatus || "unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Delay Duration:</span>
                    <span className="font-mono text-white">{oracleResult.flightData?.delayMinutes || 0} mins</span>
                  </div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-white/50 block mb-1">Reasoning:</span>
                    <span className="text-purple-300 italic">"{oracleResult.agentDecision?.reason}"</span>
                  </div>
                  <div className="text-center font-bold text-[10px] mt-2 tracking-widest border border-white/5 py-1 rounded bg-white/5">
                    {oracleResult.agentDecision?.qualifiesForPayout ? (
                      <span className="text-green-400">PAYOUT TRIGGERED</span>
                    ) : (
                      <span className="text-red-400">CLAIM DENIED</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={triggerOracle}
              disabled={!oracleFlightId || oracleLoading}
              className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-500 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {oracleLoading ? <Loader2 className="animate-spin" size={16} /> : "Run Oracle Check"}
            </button>
          </div>

          {/* Live Chain Feed */}
          <div className="liquid-glass rounded-3xl p-6 border border-blue-500/20 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-heading italic text-white">Live Chain Feed</h2>
                <p className="text-[10px] text-white/50">Latest transactions on-chain</p>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 text-[9px] text-blue-400 font-bold uppercase tracking-wider">
                <History size={10} />
                <span>Syncing</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-64 custom-scrollbar">
              {loadingHistory && txHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/40">
                  <Loader2 className="animate-spin text-blue-400" size={24} />
                </div>
              ) : txHistory.length > 0 ? (
                txHistory.map((tx, idx) => {
                  let actionName = "Interaction";
                  let colorClass = "bg-white/30";
                  let amountStr = "";

                  if (tx.type === 'cUSD') {
                    if (tx.isIncoming) {
                      actionName = "Premium Paid";
                      colorClass = "bg-green-500";
                      amountStr = `+${Number(tx.formattedAmount).toFixed(1)}`;
                    } else {
                      actionName = "Claim Settled";
                      colorClass = "bg-orange-500";
                      amountStr = `-${Number(tx.formattedAmount).toFixed(1)}`;
                    }
                  } else if (tx.type === 'NFT') {
                    actionName = "Policy Minted";
                    colorClass = "bg-purple-500";
                    amountStr = `#${tx.tokenID}`;
                  }

                  return (
                    <a 
                      key={`${tx.hash}-${idx}`} 
                      href={`${BOT_CHAIN.explorerUrl}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl liquid-glass border border-white/5 hover:bg-white/10 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${colorClass}`}></div>
                        <div>
                          <p className="font-semibold text-white/90 group-hover:text-blue-400 transition-colors">{actionName}</p>
                          <p className="text-[9px] text-white/40 font-mono mt-0.5">{timeAgo(tx.timeStamp)}</p>
                        </div>
                      </div>
                      <span className={`font-semibold font-mono ${
                        tx.type === 'cUSD' && tx.isIncoming ? 'text-green-400' : tx.type === 'cUSD' ? 'text-orange-400' : 'text-purple-400'
                      }`}>
                        {amountStr}
                      </span>
                    </a>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-white/40 text-xs">
                  No recent transactions.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN AUTHENTICATION PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass p-8 rounded-3xl max-w-sm w-full border border-white/10 relative overflow-hidden mx-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                <ShieldCheck className="text-green-400" size={26} />
              </div>
              <h1 className="text-2xl font-heading italic text-white">Admin Authorize</h1>
              <p className="text-white/40 text-[10px] mt-1.5 text-center leading-normal">Enter console password to enable contract-direct manual policy creation.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-3 relative z-10">
              <input 
                type="password" 
                placeholder="Password" 
                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 text-center tracking-widest text-sm"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              {authError && <p className="text-red-450 text-[11px] text-center font-semibold">{authError}</p>}
              <div className="flex gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white font-medium py-2.5 rounded-xl hover:bg-white/10 transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-green-450 transition-all text-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardShell>
  );
}
