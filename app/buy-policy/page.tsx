"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Shield, ShieldCheck, Activity, CheckCircle } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { parseAbi, parseUnits } from "viem";

const INSURANCE_POOL_ADDRESS = process.env.NEXT_PUBLIC_INSURANCE_POOL_ADDRESS as `0x${string}` || "0x59575D99d6691d109651C5bF357d78851dF90edB";
const CUSD_ADDRESS = "0x4200000000000000000000000000000000000011"; // Sepolia cUSD

const erc20Abi = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
]);

const poolAbi = parseAbi([
  'function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external'
]);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BuyPolicyPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isCorrectChain = chainId === 11142220; // Celo Sepolia Testnet ID
  
  const [flightNumber, setFlightNumber] = useState("");
  const [date, setDate] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  
  // Track transaction steps to separate Approval success from Purchase success
  const [txType, setTxType] = useState<'idle' | 'approving' | 'minting'>('idle');

  const tiers = [
    { id: 1, delay: "> 2 Hours", premium: "0.50 cUSD", premiumValue: "0.5", payout: "$5 cUSD" },
    { id: 2, delay: "> 4 Hours", premium: "1.50 cUSD", premiumValue: "1.5", payout: "$15 cUSD" },
    { id: 3, delay: "Cancelled", premium: "3.00 cUSD", premiumValue: "3.0", payout: "$30 cUSD" },
  ];

  const selectedPremium = selectedTier ? tiers.find(t => t.id === selectedTier)?.premiumValue : "0";
  const premiumInWei = parseUnits(selectedPremium || "0", 18);

  // Read Allowance (only if correct chain is active)
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, INSURANCE_POOL_ADDRESS],
    query: { enabled: !!address && isCorrectChain },
  });

  const needsApproval = isCorrectChain && (allowance === undefined || (allowance as bigint) < premiumInWei);

  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (txHash) {
      if (txType === 'approving') {
        const timer = setTimeout(() => {
          setTxType('idle');
          refetchAllowance();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [txHash, txType, refetchAllowance]);

  useEffect(() => {
    if (isTxSuccess) {
      refetchAllowance();
    }
  }, [isTxSuccess, refetchAllowance]);

  const handleTransaction = () => {
    if (!isConnected) return;
    
    if (!isCorrectChain) {
      switchChain({ chainId: 11142220 });
      return;
    }

    if (!flightNumber || !date || !selectedTier) return;

    if (needsApproval) {
      setTxType('approving');
      writeContract({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [INSURANCE_POOL_ADDRESS, premiumInWei],
      });
    } else {
      setTxType('minting');
      const flightDate = new Date(date);
      // Expiry is set to 24 hours after flight date
      const expiryTimestamp = Math.floor(flightDate.getTime() / 1000) + 86400; 
      
      writeContract({
        address: INSURANCE_POOL_ADDRESS,
        abi: poolAbi,
        functionName: 'buyPolicy',
        args: [flightNumber, selectedTier, BigInt(expiryTimestamp)],
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading italic mb-6">
            Secure Your Flight On-Chain
          </h1>
          <p className="text-lg font-light text-white/60 max-w-2xl mx-auto">
            Select your coverage, approve cUSD directly from your wallet, and instantly mint your parametric insurance Policy NFT.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Form */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="liquid-glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
              <Plane className="text-white" size={24} />
              <h2 className="text-2xl font-heading italic">Flight Details</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Flight Number</label>
                <input 
                  type="text" 
                  className="w-full liquid-glass bg-transparent border-none rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all uppercase"
                  placeholder="e.g. AA123"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Departure Date</label>
                <input 
                  type="date" 
                  className="w-full liquid-glass bg-transparent border-none rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
                  value={date}
                  style={{ colorScheme: "dark" }}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 mt-10 border-b border-white/10 pb-4">
              <Shield className="text-white" size={24} />
              <h2 className="text-2xl font-heading italic">Coverage Tiers</h2>
            </div>

            <div className="space-y-4">
              {tiers.map((tier) => (
                <div 
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all ${
                    selectedTier === tier.id 
                      ? "liquid-glass-strong ring-1 ring-green-500/50" 
                      : "liquid-glass hover:bg-white/5"
                  }`}
                >
                  {selectedTier === tier.id && (
                    <div className="absolute top-4 right-4 text-green-400">
                      <ShieldCheck size={20} />
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-heading italic text-xl">{tier.delay}</h3>
                    <span className="font-bold">{tier.premium}</span>
                  </div>
                  <p className="text-sm text-white/60 font-light">Autonomous Payout: <span className="font-semibold text-white/90">{tier.payout}</span></p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Summary & Tx */}
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="liquid-glass rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            <h2 className="text-3xl font-heading italic mb-8 relative z-10">Checkout Summary</h2>
            
            <div className="flex-1 space-y-6 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60">Flight</span>
                <span className="font-medium font-mono">{flightNumber || "---"}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60">Date</span>
                <span className="font-medium">{date || "---"}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60">Selected Tier</span>
                <span className="font-medium">
                  {selectedTier ? tiers.find(t => t.id === selectedTier)?.delay : "None"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-white/60">Payout Amount</span>
                <span className="font-medium text-green-400">
                  {selectedTier ? tiers.find(t => t.id === selectedTier)?.payout : "$0"}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg text-white/80">Total Premium</span>
                <span className="text-3xl font-heading italic text-white">
                  {selectedTier ? tiers.find(t => t.id === selectedTier)?.premium : "0.00 cUSD"}
                </span>
              </div>
              
              <button 
                onClick={handleTransaction}
                disabled={(isConnected && isCorrectChain && (!flightNumber || !date || !selectedTier)) || isPending || isTxConfirming}
                className={`w-full py-4 rounded-full font-medium text-black transition-all flex items-center justify-center gap-2 ${
                  !isConnected ? "bg-white hover:bg-white/90" : 
                  !isCorrectChain ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]" :
                  needsApproval ? "bg-yellow-400 hover:bg-yellow-300" : "bg-white hover:bg-white/90"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {!isConnected ? (
                  "Connect Wallet to Buy"
                ) : !isCorrectChain ? (
                  "Switch to Sepolia Testnet"
                ) : isPending || isTxConfirming ? (
                  <>
                    <Activity className="animate-spin" size={18} />
                    {txType === 'approving' ? "Approving cUSD..." : "Minting Policy..."}
                  </>
                ) : isTxSuccess && txType === 'minting' ? (
                  <>
                    <CheckCircle size={18} />
                    Policy Minted! 🎉
                  </>
                ) : needsApproval ? (
                  "Approve cUSD"
                ) : (
                  "Pay & Mint Policy NFT"
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs">
                {!isConnected ? (
                  <span className="text-white/40">Connect your Web3 wallet to begin</span>
                ) : !isCorrectChain ? (
                  <span className="text-red-400 font-medium">Wrong Network: MetaMask must be on Celo Sepolia</span>
                ) : isTxSuccess && txType === 'minting' ? (
                  <span className="text-green-400 font-medium">Success! Policy registered on-chain.</span>
                ) : needsApproval ? (
                  <span className="text-yellow-400/80">Step 1: Approve Token Spend</span>
                ) : (
                  <span className="text-green-400/80">Step 2: Mint Policy NFT</span>
                )}
              </div>

              <p className="text-center text-xs text-white/30 mt-4 font-light">
                Securely processed via Celo Smart Contracts. No intermediary.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
