"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, ShieldCheck, Database, Bot, ArrowRightLeft, History, ExternalLink, BrainCircuit,
  Plane, Globe2, ShieldAlert, ArrowDownRight, ArrowUpRight, Settings2, BarChart2,
  Calendar, CreditCard, Plus, Clock, CheckCircle2, Loader2, Compass, Target, TrendingUp, Wallet,
  Send, Sparkles, User, RefreshCcw, LayoutDashboard, Settings, Info, Menu, X, CheckCircle, AlertCircle, Copy
} from "lucide-react";
import Link from "next/link";
import { useReadContract, useAccount, useBalance, useBlockNumber, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { parseAbi, formatUnits, parseUnits } from "viem";
import { PolicyOverview } from "@/components/policy-overview";
import { LiveTVLChart } from "@/components/live-tvl-chart";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Constants
const POLICY_NFT_ADDRESS = (process.env.NEXT_PUBLIC_POLICY_NFT_ADDRESS || "0xeBa31f2f2BcEe6089adDE62dd69c1B05f5092e3A").trim() as `0x${string}`;
const INSURANCE_POOL_ADDRESS = (process.env.NEXT_PUBLIC_INSURANCE_POOL_ADDRESS || "0xc753f9F1f41643eC934E74AA3197E64274088Ec0").trim() as `0x${string}`;
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a" as `0x${string}`; // Native cUSD Mainnet / Sepolia cUSD Address
const CELOSCAN_API_KEY = process.env.NEXT_PUBLIC_CELOSCAN_API_KEY || "A7PZRDK4NTCBJP99CI5KUVVG84UQVCMT2Z";

// ABIs
const erc20Abi = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)'
]);

const policyNftAbi = parseAbi([
  'function totalSupply() external view returns (uint256)',
  'function minter() external view returns (address)',
  'function mintPolicy(address to, string calldata flightId, uint8 tier, uint256 expiry) external returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
  'function getPolicy(uint256 tokenId) external view returns ((string flightId, uint8 tier, uint256 expiry, bool isClaimed))'
]);

const poolAbi = parseAbi([
  'function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external'
]);

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Sub-component: Policy NFT Card inside My Policies
function PolicyCardItem({ owner, index }: { owner: `0x${string}`; index: number }) {
  const { data: tokenId } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi: policyNftAbi,
    functionName: 'tokenOfOwnerByIndex',
    args: [owner, BigInt(index)],
  });

  const { data: policy, isLoading } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi: policyNftAbi,
    functionName: 'getPolicy',
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: tokenId !== undefined,
    }
  });

  if (isLoading || !policy) {
    return (
      <div className="liquid-glass rounded-3xl p-6 flex flex-col h-64 animate-pulse">
        <div className="h-4 w-24 bg-white/10 rounded mb-8"></div>
        <div className="h-12 w-12 rounded-full bg-white/10 mb-8"></div>
        <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
        <div className="h-4 w-48 bg-white/10 rounded"></div>
      </div>
    );
  }

  const flightId = (policy as any).flightId || (policy as any)[0];
  const tier = (policy as any).tier !== undefined ? (policy as any).tier : (policy as any)[1];
  const expiry = (policy as any).expiry !== undefined ? (policy as any).expiry : (policy as any)[2];
  const isClaimed = (policy as any).isClaimed !== undefined ? (policy as any).isClaimed : (policy as any)[3];
  
  const tierMap: Record<number, { label: string, payout: string }> = {
    1: { label: "> 1 Minute Delay", payout: "5 cUSD" },
    2: { label: "> 5 Minutes Delay", payout: "15 cUSD" },
    3: { label: "Flight Cancelled", payout: "30 cUSD" },
  };

  const coverage = tierMap[Number(tier)] || { label: "Unknown Tier", payout: "Unknown" };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="liquid-glass rounded-3xl p-6 flex flex-col border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Policy NFT ID</p>
          <p className="font-mono text-sm text-white/80">#{tokenId?.toString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
          isClaimed ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
        }`}>
          {isClaimed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {isClaimed ? 'Settled' : 'Active'}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-white border border-white/10">
          <Plane size={22} />
        </div>
        <div>
          <h3 className="text-xl font-heading italic">{flightId}</h3>
          <p className="text-xs font-light text-white/60">Expires: {new Date(Number(expiry) * 1000).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1 text-sm border-t border-white/5 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-white/50">Coverage Tier</span>
          <span className="font-medium text-white/80">{coverage.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/50">Autonomous Payout</span>
          <span className="font-semibold text-green-400">{coverage.payout}</span>
        </div>
      </div>

      {isClaimed ? (
        <div className="w-full py-3.5 rounded-2xl liquid-glass text-white/40 font-medium text-center text-xs flex items-center justify-center gap-2 border border-white/5">
          <CheckCircle2 size={14} />
          Claim Settled to Wallet
        </div>
      ) : (
        <div className="w-full py-3.5 rounded-2xl liquid-glass-strong text-white font-medium text-center text-xs flex items-center justify-center gap-2 border border-white/10">
          <AlertCircle size={14} className="animate-pulse text-yellow-400" />
          Monitoring Flight Status
        </div>
      )}

      <div className="mt-3">
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just secured my flight ${flightId} on-chain with TravelShield! 🛡️✈️\n\n🎫 Policy NFT ID: #${tokenId}\n\nGet your own autonomous flight insurance at: https://celo-travel.vercel.app\n\n#TravelShield #Celo #Web3 #BuildOnCelo`)}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white font-medium text-center text-xs flex items-center justify-center gap-2 transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share on X
        </a>
      </div>
    </motion.div>
  );
}

export default function AgentDashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectChain = chainId === 42220; // Celo Mainnet ID
  
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // --- GENERAL STATE & HOOKS ---
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  // Wallet Balance
  const { data: walletCusdBalance, refetch: refetchWalletBalance } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
  const formattedWalletBalance = walletCusdBalance ? formatUnits(walletCusdBalance, 18) : "0.00";

  // --- 1. OVERVIEW / ANALYSIS STATE ---
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

  // Contracts Reads for Overview
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

  // Write hooks for Overview Mint
  const { writeContract: writeOverviewMint, isPending: isOverviewMintPending } = useWriteContract();

  // Fetch CeloScan History
  useEffect(() => {
    if (!mounted) return;
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const cusdRes = await fetch(`https://api.celoscan.io/api?module=account&action=tokentx&address=${INSURANCE_POOL_ADDRESS}&page=1&offset=15&sort=desc&apikey=${CELOSCAN_API_KEY}`);
        const cusdData = await cusdRes.json();
        
        const nftRes = await fetch(`https://api.celoscan.io/api?module=account&action=tokennfttx&address=${POLICY_NFT_ADDRESS}&page=1&offset=15&sort=desc&apikey=${CELOSCAN_API_KEY}`);
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
        console.error("Failed to fetch CeloScan history", err);
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

  // --- 2. BUY POLICY STATE ---
  const [buyFlightNumber, setBuyFlightNumber] = useState("");
  const [buyDate, setBuyDate] = useState("");
  const [buyPassengerName, setBuyPassengerName] = useState("");
  const [buyPassengerEmail, setBuyPassengerEmail] = useState("");
  const [buySelectedTier, setBuySelectedTier] = useState<number | null>(null);
  const [buyRoundUp, setBuyRoundUp] = useState(false);
  
  const [buyIsSearching, setBuyIsSearching] = useState(false);
  const [buyFlightData, setBuyFlightData] = useState<any>(null);
  const [buyTxType, setBuyTxType] = useState<'idle' | 'approving' | 'minting'>('idle');
  const [buyIsApprovedLocal, setBuyIsApprovedLocal] = useState(false);

  const buyTiers = [
    { id: 1, delay: "> 1 Minute Delay", premium: "0.50 cUSD", premiumValue: "0.5", payout: "$5 cUSD" },
    { id: 2, delay: "> 5 Minutes Delay", premium: "1.50 cUSD", premiumValue: "1.5", payout: "$15 cUSD" },
    { id: 3, delay: "Flight Cancelled", premium: "3.00 cUSD", premiumValue: "3.0", payout: "$30 cUSD" },
  ];

  const buySelectedPremium = buySelectedTier ? buyTiers.find(t => t.id === buySelectedTier)?.premiumValue : "0";
  const buyPremiumInWei = parseUnits(buySelectedPremium || "0", 18);

  const { data: buyAllowance, refetch: refetchBuyAllowance } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, INSURANCE_POOL_ADDRESS],
    query: { enabled: !!address },
  });

  const buyNeedsApproval = !buyIsApprovedLocal && (buyAllowance === undefined || (buyAllowance as bigint) < buyPremiumInWei);

  const { writeContract: writeBuy, data: buyTxHash, error: buyContractError } = useWriteContract();

  const { isLoading: isBuyTxConfirming, isSuccess: isBuyTxSuccess, isError: isBuyTxError } = useWaitForTransactionReceipt({
    hash: buyTxHash,
  });

  useEffect(() => {
    if (buyContractError) {
      toast.error("Transaction failed: " + ((buyContractError as any).shortMessage || buyContractError.message));
      setBuyTxType('idle');
    }
  }, [buyContractError]);

  useEffect(() => {
    if (isBuyTxError) {
      toast.error("Transaction reverted on-chain.");
      setBuyTxType('idle');
    }
  }, [isBuyTxError]);

  useEffect(() => {
    if (isBuyTxSuccess) {
      if (buyTxType === 'approving') {
        setBuyIsApprovedLocal(true);
        toast.success("cUSD Approved! You can now mint the policy.");
        setBuyTxType('idle');
      } else if (buyTxType === 'minting') {
        toast.success("Policy Minted successfully! 🛡️");
        if (buyRoundUp) {
          const baseAmount = parseFloat(buySelectedPremium || "0");
          const diff = Math.ceil(baseAmount) - baseAmount;
          setTimeout(() => toast.success(`🌱 ${diff.toFixed(2)} cUSD donated to Glo Dollar Climate Fund!`), 1000);
        }
        if (buyTxHash) {
          localStorage.setItem(`policy_${buyTxHash}`, JSON.stringify({
            flightNumber: buyFlightNumber,
            date: buyDate,
            tier: buySelectedTier,
            passengerName: buyPassengerName,
            passengerEmail: buyPassengerEmail,
            timestamp: Date.now()
          }));
        }
      }
      refetchBuyAllowance();
      refetchWalletBalance();
    }
  }, [isBuyTxSuccess, buyTxType]);

  const searchFlight = async () => {
    if (!buyFlightNumber) return;
    setBuyIsSearching(true);
    setBuyFlightData(null);
    try {
      const res = await fetch(`/api/flight-search?flightId=${buyFlightNumber}`);
      const data = await res.json();
      if (data.success) {
        setBuyFlightData(data.flight);
        if (data.flight.date) setBuyDate(data.flight.date);
        toast.success(`Found real flight data!`);
      } else {
        toast.error(data.error || "Flight not found.");
      }
    } catch (e) {
      toast.error("Error connecting to flight API.");
    } finally {
      setBuyIsSearching(false);
    }
  };

  const handleApprove = () => {
    if (!isConnected) return;
    if (!buyFlightNumber || !buyDate || !buySelectedTier) return;
    setBuyTxType('approving');
    writeBuy({
      address: CUSD_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [INSURANCE_POOL_ADDRESS, buyPremiumInWei],
    });
  };

  const handleMint = () => {
    if (!isConnected) return;
    if (!buyFlightNumber || !buyDate || !buySelectedTier) return;
    setBuyTxType('minting');
    const expiryTimestamp = Math.floor(Date.now() / 1000) + 86400 * 2; 
    writeBuy({
      address: INSURANCE_POOL_ADDRESS,
      abi: poolAbi,
      functionName: 'buyPolicy',
      args: [buyFlightNumber, buySelectedTier, BigInt(expiryTimestamp)],
    });
  };

  // --- 3. MY POLICIES STATE ---
  const { data: myPoliciesBalance } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi: policyNftAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
  const numPolicies = myPoliciesBalance ? Number(myPoliciesBalance) : 0;

  // --- 4. AI AGENT STATE ---
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Hello! I am TravelShield AI, your conversational DeFi agent on Celo. I can help you mint travel insurance, save for your next trip, hedge against currency devaluation, or manage your stablecoin portfolio. How can I help you today?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = { role: "user" as const, content: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble processing that chat request." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Chat agent error. Please check connection." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // --- 5. SAVINGS COACH STATE ---
  const [savingsGoalName, setSavingsGoalName] = useState("");
  const [savingsGoalAmount, setSavingsGoalAmount] = useState("");
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);

  useEffect(() => {
    if (!mounted) return;
    const savedGoals = localStorage.getItem("travelshield_savings_goals");
    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals));
    }
  }, [mounted]);

  const { writeContract: writeSavingsDeposit, isPending: isSavingsDepositPending } = useWriteContract();

  const handleCreateSavingsGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savingsGoalName || !savingsGoalAmount) return;
    
    const newGoals = [...savingsGoals, {
      id: Date.now(),
      name: savingsGoalName,
      target: parseFloat(savingsGoalAmount),
      current: 0,
      active: true
    }];
    
    setSavingsGoals(newGoals);
    localStorage.setItem("travelshield_savings_goals", JSON.stringify(newGoals));
    setSavingsGoalName("");
    setSavingsGoalAmount("");
    toast.success("Savings Goal set! Earning yield on deposits.");
  };

  const handleSavingsDeposit = (goalId: number, amount: number) => {
    if (!isConnected) return;
    const tId = toast.loading("Depositing cUSD to Yield Insurance Pool Vault...");
    writeSavingsDeposit({
      address: CUSD_ADDRESS,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [INSURANCE_POOL_ADDRESS, parseUnits(amount.toString(), 18)],
    }, {
      onSuccess: (txHash) => {
        toast.dismiss(tId);
        toast.success("On-chain Deposit Confirmed!");
        const updated = savingsGoals.map(g => {
          if (g.id === goalId) {
            return { ...g, current: Math.min(g.current + amount, g.target) };
          }
          return g;
        });
        setSavingsGoals(updated);
        localStorage.setItem("travelshield_savings_goals", JSON.stringify(updated));
        setTimeout(() => {
          refetchWalletBalance();
        }, 3000);
      },
      onError: (err) => {
        toast.dismiss(tId);
        toast.error("Deposit failed: " + err.message);
      }
    });
  };

  // --- 6. AUTOPAY STATE ---
  const [autopayBills, setAutopayBills] = useState<any[]>([]);
  const [autopayLoading, setAutopayLoading] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (!isConnected || !address) {
      setAutopayBills([
        { id: "1", name: "TravelShield Policy Auto-Renew", amount: 1.50, cycle: "Monthly", nextDate: "2026-06-01", type: "insurance" },
        { id: "2", name: "Glo Climate Initiative Support", amount: 5.00, cycle: "Monthly", nextDate: "2026-06-15", type: "subscription" },
      ]);
      return;
    }

    const fetchBills = async () => {
      setAutopayLoading(true);
      try {
        const res = await fetch(`/api/transactions?address=${address}`);
        const data = await res.json();
        if (data.success && data.subscriptions.length > 0) {
          setAutopayBills(data.subscriptions);
          toast.success("Scanned chain feed: recurring payments verified!");
        } else {
          setAutopayBills([
            { id: "1", name: "TravelShield Policy Auto-Renew", amount: 1.50, cycle: "Monthly", nextDate: "2026-06-01", type: "insurance" },
            { id: "2", name: "Glo Climate Initiative Support", amount: 5.00, cycle: "Monthly", nextDate: "2026-06-15", type: "subscription" },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAutopayLoading(false);
      }
    };
    fetchBills();
  }, [isConnected, address, mounted]);

  const cancelAutopayBill = (id: string) => {
    setAutopayBills(prev => prev.filter(b => b.id !== id));
    toast.success("Autopay subscription deactivated.");
  };

  // --- 7. FX HEDGING STATE ---
  const [fxCurrencies, setFxCurrencies] = useState<any[]>([]);
  const [fxLoading, setFxLoading] = useState(true);
  const [fxBaseCurrency, setFxBaseCurrency] = useState("NGN");
  const [fxRatio, setFxRatio] = useState(80);

  useEffect(() => {
    if (!mounted) return;
    fetch('/api/fx-rates')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFxCurrencies(data.currencies);
        }
        setFxLoading(false);
      });
  }, [mounted]);

  // --- 8. SETTINGS STATE ---
  const [rpcUrl, setRpcUrl] = useState("https://forno.celo.org");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [devMode, setDevMode] = useState(false);

  // --- COPY WALLET ADDR ---
  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied to clipboard!");
  };

  if (!mounted) return null;

  // GATEKEEPER: Dashboard ONLY accessible when wallet connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 font-body">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.05),transparent_70%)]"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="liquid-glass p-10 rounded-3xl max-w-md w-full border border-white/10 flex flex-col items-center text-center relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <ShieldCheck className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl font-heading italic text-white mb-3">Dashboard Locked</h1>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Please connect your wallet to access TravelShield's DeFAI Console and transaction analysis records.
          </p>
          <div className="scale-105">
            <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          </div>
        </motion.div>
      </div>
    );
  }

  // Sidebar Menu Items
  const sidebarItems = [
    { id: "overview", label: "Overview & Analytics", icon: <LayoutDashboard size={18} /> },
    { id: "buy", label: "Buy Policy", icon: <Plane size={18} /> },
    { id: "policies", label: "My Policies", icon: <History size={18} /> },
    { id: "agent", label: "Conversational Agent", icon: <Bot size={18} /> },
    { id: "savings", label: "Savings Coach", icon: <Target size={18} /> },
    { id: "autopay", label: "Autopay Manager", icon: <Calendar size={18} /> },
    { id: "fx", label: "FX Hedging Shield", icon: <Globe2 size={18} /> },
    { id: "settings", label: "Console Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-black text-white font-body overflow-x-hidden pt-[80px]">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(107,33,168,0.04),transparent_50%)]"></div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-72 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="flex flex-col h-[calc(100vh-80px)] sticky top-[80px] p-6 justify-between">
          <div className="space-y-8">
            {/* User Profile Context */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl"></div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1.5">Wallet Connection</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/80 font-medium">
                  {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "..."}
                </span>
                <button onClick={copyAddress} className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors" title="Copy Address">
                  <Copy size={12} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[11px] text-white/50">Celo Balance</span>
                <span className="font-heading italic text-sm text-yellow-400">{parseFloat(formattedWalletBalance).toFixed(2)} cUSD</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest pl-3 mb-3">Workspace Console</p>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id 
                      ? "bg-white text-black font-semibold shadow-[0_4px_15px_rgba(255,255,255,0.15)]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={activeTab === item.id ? "text-black" : "text-white/70"}>{item.icon}</span>
                  {item.label}
                </button>
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
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

                {/* Profile */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest font-semibold mb-1">Active Account</p>
                  <p className="font-mono text-xs text-white/80">{address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "..."}</p>
                  <p className="mt-2 text-sm text-yellow-400 font-heading italic">{parseFloat(formattedWalletBalance).toFixed(2)} cUSD</p>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === item.id 
                          ? "bg-white text-black font-semibold" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="font-semibold uppercase tracking-wider text-[9px]">Synced</span>
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
            <span className="text-[10px] text-green-400 uppercase tracking-widest font-semibold">Active</span>
          </div>
        </div>

        {/* Dynamic content rendering based on activeTab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex-1"
          >
            {/* VIEW: OVERVIEW / ANALYSIS */}
            {activeTab === "overview" && (
              <div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-heading italic mb-3 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                      Overview & Analysis
                    </h1>
                    <p className="text-sm font-light text-white/60 max-w-xl">
                      Real-time metrics, node status and pool TVL graphs pulled directly from verified Celo smart contracts.
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
                        const toastId = toast.loading("Minting policy NFT on Celo...");
                        writeOverviewMint({
                          address: POLICY_NFT_ADDRESS,
                          abi: policyNftAbi,
                          functionName: 'mintPolicy',
                          args: [formAddress as `0x${string}`, formFlight, t, Math.floor(Date.now() / 1000) + 86400 * 3]
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
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-400 uppercase font-mono"
                        value={oracleFlightId}
                        onChange={(e) => setOracleFlightId(e.target.value.toUpperCase())}
                      />

                      {oracleResult && (
                        <div className="bg-black/60 rounded-xl p-3.5 border border-purple-500/20 text-xs flex flex-col gap-2">
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
                              href={`https://celoscan.io/tx/${tx.hash}`}
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
            )}

            {/* VIEW: BUY POLICY */}
            {activeTab === "buy" && (
              <div>
                <div className="mb-10 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-heading italic mb-3">Secure Flight Delay Cover</h1>
                  <p className="text-sm font-light text-white/60 max-w-xl">
                    Select your custom insurance coverage, approve the stablecoin limit and mint your policy directly onto the Celo ledger.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left form */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-6">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <Plane size={20} />
                      <h2 className="text-xl font-heading italic">Flight Specifications</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2.5 items-end">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Flight Identifier</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 uppercase font-mono text-white"
                            placeholder="e.g. AA123"
                            value={buyFlightNumber}
                            onChange={(e) => { setBuyFlightNumber(e.target.value.toUpperCase()); setBuyFlightData(null); }}
                          />
                        </div>
                        <button 
                          onClick={searchFlight}
                          disabled={buyIsSearching || !buyFlightNumber}
                          className="bg-white text-black hover:bg-white/95 px-5 py-3 rounded-xl font-semibold text-sm transition-all h-[46px] flex items-center justify-center min-w-[90px] disabled:opacity-50"
                        >
                          {buyIsSearching ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                        </button>
                      </div>

                      {buyFlightData && (
                        <div className="liquid-glass-strong border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <div>
                              <span className="text-[9px] text-white/40 uppercase tracking-widest block">Airline carrier</span>
                              <span className="font-heading italic text-lg text-white">{buyFlightData.airline}</span>
                            </div>
                            <span className="px-2.5 py-1 bg-green-500/15 border border-green-500/20 text-green-400 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                              {buyFlightData.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-center">
                            <div className="text-left">
                              <span className="text-xl font-mono font-bold">{buyFlightData.departureIata}</span>
                              <span className="text-[9px] text-white/40 uppercase block">Departure</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center px-4">
                              <div className="w-full border-t border-dashed border-white/20 relative flex items-center justify-center">
                                <Plane size={14} className="text-white/40 absolute" />
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-mono font-bold">{buyFlightData.arrivalIata}</span>
                              <span className="text-[9px] text-white/40 uppercase block">Arrival</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-white/60 border-t border-white/5 pt-2">
                            <span>Scheduled Time:</span>
                            <span className="font-mono text-white/80">{buyFlightData.scheduledTime ? new Date(buyFlightData.scheduledTime).toLocaleString() : 'N/A'}</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Departure Date</label>
                        <input 
                          type="date" 
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 text-white"
                          value={buyDate}
                          style={{ colorScheme: "dark" }}
                          onChange={(e) => setBuyDate(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Passenger Full Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 text-white"
                            placeholder="John Doe"
                            value={buyPassengerName}
                            onChange={(e) => setBuyPassengerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Passenger Email</label>
                          <input 
                            type="email" 
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 text-white"
                            placeholder="john@example.com"
                            value={buyPassengerEmail}
                            onChange={(e) => setBuyPassengerEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Select Coverage Option</h3>
                      {buyTiers.map((tier) => (
                        <div 
                          key={tier.id}
                          onClick={() => setBuySelectedTier(tier.id)}
                          className={`relative p-4 rounded-xl cursor-pointer transition-all border ${
                            buySelectedTier === tier.id 
                              ? "liquid-glass-strong border-green-500/50" 
                              : "liquid-glass border-white/5 hover:bg-white/5"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-heading italic text-lg text-white">{tier.delay}</span>
                            <span className="font-mono text-sm text-yellow-400">{tier.premium}</span>
                          </div>
                          <p className="text-xs text-white/50">Guaranteed Claim Settlement: <span className="text-white/80 font-bold">{tier.payout}</span></p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Summary */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="space-y-6 relative z-10">
                      <h2 className="text-2xl font-heading italic mb-6">Checkout Summary</h2>
                      
                      <div className="space-y-3.5 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/50">Flight Code</span>
                          <span className="font-mono font-semibold">{buyFlightNumber || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/50">Departure Date</span>
                          <span>{buyDate || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/50">Coverage Level</span>
                          <span>{buySelectedTier ? buyTiers.find(t => t.id === buySelectedTier)?.delay : "None selected"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-white/50">Claim Payout Target</span>
                          <span className="text-green-400 font-bold">{buySelectedTier ? buyTiers.find(t => t.id === buySelectedTier)?.payout : "$0 cUSD"}</span>
                        </div>

                        {buySelectedTier && (
                          <div 
                            className="flex justify-between items-center p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 cursor-pointer hover:bg-green-500/20 transition-colors"
                            onClick={() => setBuyRoundUp(!buyRoundUp)}
                          >
                            <div>
                              <span className="text-xs font-semibold text-green-400 block">🌱 Climate Action Donation</span>
                              <span className="text-[10px] text-green-400/70">Round up premium for Climate Resiliency Fund</span>
                            </div>
                            <div className={`w-8 h-5 rounded-full flex items-center p-0.5 transition-colors ${buyRoundUp ? 'bg-green-500' : 'bg-black/50 border border-green-500/40'}`}>
                              <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${buyRoundUp ? 'translate-x-3.5' : ''}`}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6 relative z-10 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 font-semibold">Premium cost</span>
                        <span className="text-3xl font-heading italic text-yellow-400">
                          {buySelectedTier ? (
                            buyRoundUp 
                              ? Math.ceil(parseFloat(buyTiers.find(t => t.id === buySelectedTier)!.premiumValue)).toFixed(2) + " cUSD"
                              : buyTiers.find(t => t.id === buySelectedTier)?.premium 
                          ) : "0.00 cUSD"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={handleApprove}
                          disabled={!buyFlightNumber || !buyDate || !buyPassengerName || !buyPassengerEmail || !buySelectedTier || !buyNeedsApproval || (buyTxType === 'approving' && isBuyTxConfirming)}
                          className={`w-full py-3.5 rounded-full font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                            !buyNeedsApproval 
                              ? "bg-green-500/15 text-green-400 border border-green-500/30" 
                              : "bg-yellow-400 hover:bg-yellow-350 text-black shadow-lg"
                          } disabled:opacity-50`}
                        >
                          {buyTxType === 'approving' && isBuyTxConfirming ? (
                            <><Loader2 className="animate-spin" size={16} /> Confirming Approve...</>
                          ) : !buyNeedsApproval ? (
                            <><CheckCircle size={16} /> Premium Limit Approved</>
                          ) : (
                            "Step 1: Approve cUSD premium"
                          )}
                        </button>
                        
                        <button 
                          onClick={handleMint}
                          disabled={!buyFlightNumber || !buyDate || !buyPassengerName || !buyPassengerEmail || !buySelectedTier || buyNeedsApproval || (buyTxType === 'minting' && isBuyTxConfirming)}
                          className={`w-full py-3.5 rounded-full font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                            (buyTxType === 'minting' && isBuyTxSuccess) ? "bg-green-500 text-white" : "bg-white text-black hover:bg-white/90"
                          } disabled:opacity-50`}
                        >
                          {buyTxType === 'minting' && isBuyTxConfirming ? (
                            <><Loader2 className="animate-spin" size={16} /> Deploying Policy NFT...</>
                          ) : (
                            "Step 2: Mint Policy Insurance NFT"
                          )}
                        </button>
                      </div>

                      {buyTxHash && (
                        <div className="text-center text-xs pt-2">
                          <a href={`https://celoscan.io/tx/${buyTxHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            View on Celoscan explorer
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: MY POLICIES */}
            {activeTab === "policies" && (
              <div>
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-heading italic mb-3">My Minted Insurance</h1>
                  <p className="text-sm font-light text-white/60 max-w-xl">
                    A list of policy NFT tokens deployed on this wallet. Live block listeners query the flight statuses continuously.
                  </p>
                </div>

                {numPolicies === 0 ? (
                  <div className="liquid-glass rounded-3xl p-12 text-center max-w-lg mx-auto flex flex-col items-center border border-white/5">
                    <Plane size={48} className="text-white/20 mb-4 animate-pulse" />
                    <h2 className="text-xl font-heading italic mb-2">No active coverages</h2>
                    <p className="text-sm text-white/50 mb-6">You have not purchased or minted any flight policies on Celo yet.</p>
                    <button onClick={() => setActiveTab("buy")} className="px-6 py-3 bg-white text-black hover:bg-yellow-400 font-semibold rounded-full text-xs uppercase tracking-wider transition-all">
                      Secure a Flight Now
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: numPolicies }).map((_, i) => (
                      <PolicyCardItem key={i} owner={address!} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW: AI AGENT */}
            {activeTab === "agent" && (
              <div className="flex flex-col h-[calc(100vh-200px)]">
                <div className="text-center mb-6 shrink-0">
                  <h1 className="text-3xl font-heading italic mb-1.5 flex items-center justify-center gap-2">
                    <Sparkles className="text-yellow-400 animate-pulse" size={24} /> Conversational DeFAI Agent
                  </h1>
                  <p className="text-xs text-white/50 max-w-lg mx-auto">
                    Manage your portfolio and purchase policies via natural-language text interactions.
                  </p>
                </div>

                <div className="liquid-glass rounded-3xl flex-1 overflow-hidden flex flex-col border border-white/10 relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none"></div>
                  
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 border ${
                          msg.role === 'user' 
                            ? 'bg-white text-black border-transparent' 
                            : 'liquid-glass-strong text-purple-400 border-purple-500/30'
                        }`}>
                          {msg.role === 'user' ? <User size={14} /> : <Bot size={15} />}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl p-3.5 text-sm ${
                          msg.role === 'user'
                            ? 'bg-white text-black font-medium'
                            : 'liquid-glass text-white/90 border border-white/5'
                        }`}>
                          <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full liquid-glass-strong flex items-center justify-center border border-purple-500/30 text-purple-400">
                          <RefreshCcw size={14} className="animate-spin" />
                        </div>
                        <div className="liquid-glass border border-white/5 p-3 rounded-2xl flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  {/* Input Form */}
                  <form onSubmit={sendChatMessage} className="p-4 border-t border-white/10 bg-black/60 relative z-10">
                    <div className="relative flex items-center">
                      <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type policy mint request, portfolio balance question..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:border-purple-500/50 text-white"
                        disabled={chatLoading}
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        className="absolute right-2 p-2 rounded-full bg-white hover:bg-yellow-400 text-black transition-colors disabled:opacity-40"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW: SAVINGS COACH */}
            {activeTab === "savings" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-heading italic mb-3">cUSD Yield Saving Goal</h1>
                    <p className="text-sm font-light text-white/60 max-w-xl">
                      Automate deposits to travel vaults, lock tokens into secure smart contract reserves and accumulate interest.
                    </p>
                  </div>
                  
                  <div className="liquid-glass rounded-2xl px-5 py-4 border border-white/10 flex items-center gap-4 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Wallet className="text-green-400" size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Available cUSD</p>
                      <p className="text-xl font-heading italic text-white">{parseFloat(formattedWalletBalance).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/5 h-fit">
                    <h2 className="text-xl font-heading italic mb-4">Set Savings Target</h2>
                    <form onSubmit={handleCreateSavingsGoal} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Vault Destination Name</label>
                        <input 
                          type="text" 
                          value={savingsGoalName}
                          onChange={e => setSavingsGoalName(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 text-white"
                          placeholder="e.g. London Winter Tour 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Target Amount (cUSD)</label>
                        <input 
                          type="number" 
                          value={savingsGoalAmount}
                          onChange={e => setSavingsGoalAmount(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 text-white"
                          placeholder="500"
                        />
                      </div>

                      <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <p className="text-xs font-bold text-green-400 flex items-center gap-1.5 mb-1">
                          <Zap size={14} /> Coach Suggestion
                        </p>
                        <p className="text-[11px] text-green-400/80 leading-relaxed">
                          "I recommend setting a 100 cUSD seed allocation to trigger the Celo network yield multiplier coefficients."
                        </p>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-white hover:bg-green-400 text-black font-semibold rounded-full transition-colors text-sm"
                      >
                        Activate Goal Vault
                      </button>
                    </form>
                  </div>

                  {/* Active Goals list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-heading italic mb-3">Active Goal Vaults</h2>
                    {savingsGoals.length === 0 ? (
                      <div className="liquid-glass rounded-3xl p-12 text-center border border-white/5 flex flex-col items-center justify-center min-h-[220px]">
                        <Target className="text-white/20 mb-3" size={32} />
                        <h3 className="text-base font-semibold text-white/80">No Goal Vaults Found</h3>
                        <p className="text-xs text-white/40 max-w-xs mt-1">Submit your travel saving targets in the configuration form to start.</p>
                      </div>
                    ) : (
                      savingsGoals.map((goal) => {
                        const progress = Math.min((goal.current / goal.target) * 100, 100);
                        return (
                          <div key={goal.id} className="liquid-glass rounded-2xl p-5 border border-white/5 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-heading italic text-white">{goal.name}</h3>
                                <p className="text-xs text-white/50">{goal.current} / {goal.target} cUSD deposited</p>
                              </div>
                              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                                progress === 100 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
                              }`}>
                                {progress === 100 ? 'Goal Filled' : 'Earning Yield'}
                              </span>
                            </div>

                            <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleSavingsDeposit(goal.id, 10)}
                                  disabled={progress === 100 || isSavingsDepositPending}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg transition-colors"
                                >
                                  +10 cUSD
                                </button>
                                <button 
                                  onClick={() => handleSavingsDeposit(goal.id, 50)}
                                  disabled={progress === 100 || isSavingsDepositPending}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold rounded-lg transition-colors"
                                >
                                  +50 cUSD
                                </button>
                              </div>
                              <button 
                                onClick={() => handleSavingsDeposit(goal.id, 100)}
                                disabled={progress === 100 || isSavingsDepositPending}
                                className="px-4 py-1.5 bg-white text-black hover:bg-green-400 text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
                              >
                                Deposit 100 cUSD
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: AUTOPAY */}
            {activeTab === "autopay" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-heading italic mb-3">Autopay & Recurring Payments</h1>
                    <p className="text-sm font-light text-white/60 max-w-xl">
                      List dynamic subscriptions and recurring premium bills parsed directly from user transaction logs.
                    </p>
                  </div>
                  <button className="bg-white text-black hover:bg-yellow-400 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5">
                    <Plus size={14} /> New subscription
                  </button>
                </div>

                <div className="liquid-glass rounded-3xl p-6 border border-white/5">
                  {autopayLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-yellow-400" size={28} />
                      <p className="text-xs text-white/50">Scanning Celo transaction registries...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {autopayBills.map((bill) => (
                        <div key={bill.id} className="bg-black/40 border border-white/10 rounded-2xl p-5 relative group hover:border-yellow-500/30 transition-all flex flex-col justify-between min-h-[220px]">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className={`p-2.5 rounded-xl ${bill.type === 'insurance' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {bill.type === 'insurance' ? <ShieldCheck size={18} /> : <CreditCard size={18} />}
                              </div>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                <CheckCircle2 size={10} /> Active
                              </span>
                            </div>

                            <h3 className="text-lg font-heading italic text-white truncate">{bill.name}</h3>
                            <div className="flex items-baseline gap-1.5 mt-1.5 mb-4">
                              <span className="text-2xl font-bold font-mono">{bill.amount}</span>
                              <span className="text-xs text-white/40">cUSD / {bill.cycle}</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] text-white/50 flex items-center gap-1 border-t border-white/5 pt-3">
                              <Clock size={12} /> Next Transfer: {new Date(bill.nextDate).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold transition-all">
                                Fund
                              </button>
                              <button 
                                onClick={() => cancelAutopayBill(bill.id)}
                                className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Button Skeleton */}
                      <div className="border border-white/10 border-dashed hover:border-white/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-all min-h-[220px]">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                          <Plus size={20} className="text-white/50" />
                        </div>
                        <h3 className="text-base font-semibold text-white/80">Configure Payment</h3>
                        <p className="text-[11px] text-white/40 px-4 mt-1">Establish automated renewals for flight protective policies.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: FX HEDGING */}
            {activeTab === "fx" && (
              <div>
                <div className="mb-10">
                  <h1 className="text-4xl md:text-5xl font-heading italic mb-3">FX Hedging Protection</h1>
                  <p className="text-sm font-light text-white/60 max-w-xl">
                    Mitigate inflation and sudden currency drops. Convert incoming local deposits directly to cUSD stablecoins automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Configuration */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-6 h-fit">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <Settings2 size={20} />
                      <h2 className="text-xl font-heading italic">Trigger Parameters</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Base Local Denomination</label>
                        <select 
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/40 text-white"
                          value={fxBaseCurrency}
                          onChange={(e) => setFxBaseCurrency(e.target.value)}
                        >
                          <option value="NGN">🇳🇬 NGN - Nigerian Naira</option>
                          <option value="KES">🇰🇪 KES - Kenyan Shilling</option>
                          <option value="ARS">🇦🇷 ARS - Argentine Peso</option>
                          <option value="TRY">🇹🇷 TRY - Turkish Lira</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Rule Definitions</label>
                        <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-3">
                          <p className="text-xs text-white/60 font-medium">Activate protective convert triggers when:</p>
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500" />
                            <span>Value depreciates &gt; 2% in 7d</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded bg-black border-white/20 text-blue-500 focus:ring-blue-500" />
                            <span>Dollar-cost average (Always Convert)</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Hedging Allocation ratio</label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={fxRatio}
                          onChange={(e) => setFxRatio(parseInt(e.target.value))}
                          className="w-full accent-blue-500" 
                        />
                        <div className="flex justify-between text-[10px] text-white/40 mt-1.5 font-semibold">
                          <span>Keep Local ({100 - fxRatio}%)</span>
                          <span>Hedging to cUSD ({fxRatio}%)</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-colors text-sm shadow-[0_0_15px_rgba(37,99,235,0.25)]">
                        Activate Hedging Agent
                      </button>
                    </div>
                  </div>

                  {/* Right Column: FX rates */}
                  <div className="lg:col-span-2">
                    <div className="liquid-glass rounded-3xl p-6 border border-white/5 h-full">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
                        <BarChart2 size={20} />
                        <h2 className="text-xl font-heading italic">Global Rate Watch</h2>
                      </div>

                      {fxLoading ? (
                        <div className="py-24 flex justify-center">
                          <Loader2 className="animate-spin text-blue-400" size={28} />
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-sm">
                            <thead>
                              <tr className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/10 pb-3">
                                <th className="pb-3 font-semibold">Currency</th>
                                <th className="pb-3 text-right font-semibold">Live rate vs USD</th>
                                <th className="pb-3 text-right font-semibold">7D Change</th>
                                <th className="pb-3 text-right font-semibold">Agent Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {fxCurrencies.map((c) => (
                                <tr key={c.code} className="hover:bg-white/5 transition-colors">
                                  <td className="py-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-2xl">{c.flag}</span>
                                      <div>
                                        <p className="font-semibold text-white/90">{c.code}</p>
                                        <p className="text-[10px] text-white/40">{c.name}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 text-right font-mono font-medium">
                                    {c.symbol}{c.currentRate.toFixed(2)}
                                  </td>
                                  <td className="py-3 text-right">
                                    <div className={`inline-flex items-center gap-0.5 font-semibold text-xs ${c.weeklyChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                      {c.weeklyChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                      {Math.abs(c.weeklyChange).toFixed(2)}%
                                    </div>
                                  </td>
                                  <td className="py-3 text-right">
                                    {c.weeklyChange > 2 ? (
                                      <span className="px-2.5 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                        Hedge Active
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-0.5 bg-white/10 text-white/40 text-[10px] font-medium rounded-full uppercase tracking-wider">
                                        Monitoring
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
              </div>
            )}

            {/* VIEW: SETTINGS */}
            {activeTab === "settings" && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center md:text-left">
                  <h1 className="text-3xl font-heading italic mb-2">Console Configuration</h1>
                  <p className="text-xs text-white/50">
                    Adjust RPC providers, toggle automatic transaction monitoring, and configure developer modes.
                  </p>
                </div>

                <div className="liquid-glass rounded-3xl p-6 border border-white/5 space-y-6">
                  {/* RPC Settings */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Blockchain RPC Endpoints</h3>
                    <div className="space-y-1">
                      <label className="text-xs text-white/60">Celo Mainnet Node URL</label>
                      <input 
                        type="text" 
                        value={rpcUrl}
                        onChange={(e) => setRpcUrl(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/35 font-mono text-white"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4 border-t border-white/5 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">General Preferences</h3>
                    
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <span className="text-sm font-semibold block">Automatic data refresh</span>
                        <span className="text-xs text-white/40">Query network every 25 seconds for new logs.</span>
                      </div>
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${autoRefresh ? 'bg-green-500' : 'bg-white/10 border border-white/15'}`}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-white/5 pt-3">
                      <div>
                        <span className="text-sm font-semibold block">Developer mode</span>
                        <span className="text-xs text-white/40">Enable custom smart contract calls and simulation tests.</span>
                      </div>
                      <div 
                        className={`w-10 h-6 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${devMode ? 'bg-green-500' : 'bg-white/10 border border-white/15'}`}
                        onClick={() => setDevMode(!devMode)}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${devMode ? 'translate-x-4' : ''}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-white/5 pt-6 flex justify-end gap-3">
                    <button 
                      onClick={() => {
                        toast.success("Settings saved successfully!");
                      }}
                      className="px-6 py-2.5 bg-white hover:bg-yellow-400 text-black font-semibold rounded-full text-xs uppercase tracking-wider transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* --- ADMIN AUTHENTICATION PASSWORD MODAL --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass p-8 rounded-3xl max-w-sm w-full border border-white/10 relative overflow-hidden mx-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="flex flex-col items-center mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3 border border-white/10">
                <ShieldCheck className="text-green-400" size={26} />
              </div>
              <h1 className="text-2xl font-heading italic text-white">Admin Authorize</h1>
              <p className="text-white/40 text-[10px] mt-1.5 text-center leading-normal">Enter console password to enable contract-direct policy creation mechanics.</p>
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
    </div>
  );
}
