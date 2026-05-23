"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plane, Shield, ShieldCheck, Activity, CheckCircle, AlertCircle } from "lucide-react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { parseAbi, parseUnits } from "viem";
import { toast } from "sonner";

const INSURANCE_POOL_ADDRESS = process.env.NEXT_PUBLIC_INSURANCE_POOL_ADDRESS as `0x${string}` || "0x78bf048E450Ec94cB055C8ab180CA27c912e975e";
const CUSD_ADDRESS = "0x954cBA141f21760751E3065ACC250c38fb9f5e61"; // Sepolia cUSD

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
  
  // Flight Search State
  const [isSearching, setIsSearching] = useState(false);
  const [flightData, setFlightData] = useState<any>(null);
  
  // Track transaction steps to separate Approval success from Purchase success
  const [txType, setTxType] = useState<'idle' | 'approving' | 'minting'>('idle');

  const tiers = [
    { id: 1, delay: "> 1 Minute Delay", premium: "0.50 cUSD", premiumValue: "0.5", payout: "$5 cUSD" },
    { id: 2, delay: "> 5 Minutes Delay", premium: "1.50 cUSD", premiumValue: "1.5", payout: "$15 cUSD" },
    { id: 3, delay: "Flight Cancelled", premium: "3.00 cUSD", premiumValue: "3.0", payout: "$30 cUSD" },
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

  const [isApprovedLocal, setIsApprovedLocal] = useState(false);

  const needsApproval = isCorrectChain && !isApprovedLocal && (allowance === undefined || (allowance as bigint) < premiumInWei);

  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { isLoading: isTxConfirming, isSuccess: isTxSuccess, isError: isTxError, error: txReceiptError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      toast.error("Transaction failed: " + (error as any).shortMessage || error.message);
      setTxType('idle');
    }
  }, [error]);

  useEffect(() => {
    if (isTxError) {
      console.error(txReceiptError);
      toast.error("Transaction reverted on chain! Ensure you have enough cUSD balance and gas.");
      setTxType('idle');
    }
  }, [isTxError, txReceiptError]);

  useEffect(() => {
    if (isTxSuccess) {
      if (txType === 'approving') {
        setIsApprovedLocal(true);
        toast.success("Token Approved! Now click Mint Policy.");
        setTxType('idle');
      } else if (txType === 'minting') {
        toast.success("Policy Minted successfully!");
      }
      refetchAllowance();
    }
  }, [isTxSuccess, txType, refetchAllowance]);

  const searchFlight = async () => {
    if (!flightNumber) return;
    setIsSearching(true);
    setFlightData(null);
    try {
      const res = await fetch(`/api/flight-search?flightId=${flightNumber}`);
      const data = await res.json();
      if (data.success) {
        setFlightData(data.flight);
        toast.success(`Tracking live telemetry for ${data.flight.airline}!`);
      } else {
        toast.error("Flight not found. Please check the flight number.");
      }
    } catch (e) {
      toast.error("Error searching for flight data.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleApprove = () => {
    if (!isConnected) return;
    if (!isCorrectChain) { switchChain({ chainId: 11142220 }); return; }
    if (!flightNumber || !date || !selectedTier) return;
    setTxType('approving');
    writeContract({
      address: CUSD_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [INSURANCE_POOL_ADDRESS, premiumInWei],
    });
  };

  const handleMint = () => {
    if (!isConnected) return;
    if (!isCorrectChain) { switchChain({ chainId: 11142220 }); return; }
    if (!flightNumber || !date || !selectedTier) return;
    setTxType('minting');
    
    // Set expiry to guaranteed future (48 hours) to prevent oracle/contract revert issues.
    const expiryTimestamp = Math.floor(Date.now() / 1000) + 86400 * 2; 
    
    writeContract({
      address: INSURANCE_POOL_ADDRESS,
      abi: poolAbi,
      functionName: 'buyPolicy',
      args: [flightNumber, selectedTier, BigInt(expiryTimestamp)],
    });
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
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white/70 mb-2">Flight Number</label>
                  <input 
                    type="text" 
                    className="w-full liquid-glass bg-transparent border-none rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all uppercase"
                    placeholder="e.g. AA123"
                    value={flightNumber}
                    onChange={(e) => { setFlightNumber(e.target.value.toUpperCase()); setFlightData(null); }}
                  />
                </div>
                <button 
                  onClick={searchFlight}
                  disabled={isSearching || !flightNumber}
                  className="bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 h-[48px] flex items-center justify-center min-w-[100px]"
                >
                  {isSearching ? <Activity size={18} className="animate-spin" /> : "Search"}
                </button>
              </div>

              {flightData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass-strong border border-white/10 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 relative z-10">
                    <div>
                      <span className="text-white/60 text-[10px] uppercase tracking-widest block mb-0.5">Live Callsign</span>
                      <span className="font-heading italic text-xl text-white">{flightData.airline}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-white/60 text-[10px] uppercase tracking-widest block mb-0.5">Network Status</span>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-md text-green-400 text-xs font-semibold">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        {flightData.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">Current Altitude</span>
                      <span className="font-mono text-sm text-white">{flightData.altitude}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">Ground Speed</span>
                      <span className="font-mono text-sm text-white">{flightData.velocity}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">Origin Country</span>
                      <span className="font-mono text-sm text-white">{flightData.country || 'Unknown'}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-1">Transponder ICAO24</span>
                      <span className="font-mono text-sm text-white">{flightData.icao24}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 text-[10px] text-white/30 text-center font-mono flex items-center justify-center gap-1">
                    <Activity size={10} /> Live Telemetry from OpenSky Network
                  </div>
                </motion.div>
              )}

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
              
              <div className="flex flex-col gap-3">
                {!isConnected ? (
                  <button onClick={() => {}} className="w-full py-4 rounded-full font-medium text-black transition-all flex items-center justify-center gap-2 bg-white hover:bg-white/90">
                    Connect Wallet to Buy
                  </button>
                ) : !isCorrectChain ? (
                  <button onClick={() => switchChain({ chainId: 11142220 })} className="w-full py-4 rounded-full font-medium text-white transition-all flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    Switch to Sepolia Testnet
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleApprove}
                      disabled={!flightNumber || !date || !selectedTier || !needsApproval || (isPending && txType === 'approving') || (isTxConfirming && txType === 'approving')}
                      className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                        !needsApproval ? "bg-green-500/20 text-green-400 border border-green-500/50" : 
                        "bg-yellow-400 hover:bg-yellow-300 text-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isPending && txType === 'approving' || isTxConfirming && txType === 'approving' ? (
                        <><Activity className="animate-spin" size={18} /> Approving cUSD...</>
                      ) : !needsApproval ? (
                        <><CheckCircle size={18} /> cUSD Approved</>
                      ) : (
                        "Step 1: Approve cUSD"
                      )}
                    </button>
                    
                    <button 
                      onClick={handleMint}
                      disabled={!flightNumber || !date || !selectedTier || needsApproval || (isPending && txType === 'minting') || (isTxConfirming && txType === 'minting') || (isTxSuccess && txType === 'minting')}
                      className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                        (isTxSuccess && txType === 'minting') ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" :
                        "bg-white hover:bg-white/90 text-black"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isPending && txType === 'minting' || isTxConfirming && txType === 'minting' ? (
                        <><Activity className="animate-spin" size={18} /> Minting Policy...</>
                      ) : (isTxSuccess && txType === 'minting') ? (
                        <><CheckCircle size={18} /> Policy Minted Successfully! 🎉</>
                      ) : (
                        "Step 2: Pay & Mint Policy NFT"
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm">
                {(isTxSuccess && txType === 'minting' && txHash) && (
                  <a href={`https://celoscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 flex items-center gap-1">
                    View Transaction on CeloScan
                  </a>
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
