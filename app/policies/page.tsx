"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { parseAbi } from "viem";
import Link from "next/link";

const POLICY_NFT_ADDRESS = process.env.NEXT_PUBLIC_POLICY_NFT_ADDRESS as `0x${string}` || "0x48Bd564c86e379D08D5b536c766b65b966548Ab1";

const abi = parseAbi([
  'function balanceOf(address owner) external view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
  'function getPolicy(uint256 tokenId) external view returns (string flightId, uint8 tier, uint256 expiry, bool isClaimed)'
]);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PolicyCard({ owner, index }: { owner: `0x${string}`; index: number }) {
  const { data: tokenId } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi,
    functionName: 'tokenOfOwnerByIndex',
    args: [owner, BigInt(index)],
  });

  const { data: policy, isLoading } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi,
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

  const [flightId, tier, expiry, isClaimed] = policy;
  
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
      className="liquid-glass rounded-3xl p-6 flex flex-col"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Policy NFT ID</p>
          <p className="font-mono text-sm text-white/80">#{tokenId?.toString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
          isClaimed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {isClaimed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {isClaimed ? 'Settled' : 'Active'}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-white">
          <Plane size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-heading italic">{flightId}</h3>
          <p className="text-sm font-light text-white/60">Expires: {new Date(Number(expiry) * 1000).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/60">Coverage Tier</span>
          <span className="font-medium">{coverage.label}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/60">Autonomous Payout</span>
          <span className="font-medium text-green-400">{coverage.payout}</span>
        </div>
      </div>

      {isClaimed ? (
        <div className="w-full py-4 rounded-full liquid-glass text-white/50 font-medium text-center text-sm flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          Claim Settled to Wallet
        </div>
      ) : (
        <div className="w-full py-4 rounded-full liquid-glass-strong text-white font-medium text-center text-sm flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          Monitoring Flight Status
        </div>
      )}
    </motion.div>
  );
}

export default function MyPoliciesPage() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const { data: balance } = useReadContract({
    address: POLICY_NFT_ADDRESS,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const numPolicies = balance ? Number(balance) : 0;

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto w-full relative z-10">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-16">
          <h1 className="text-5xl md:text-6xl font-heading italic mb-6">
            My Active Policies
          </h1>
          <p className="text-lg font-light text-white/60 max-w-2xl">
            View your minted TravelShield NFTs. Real-time flight tracking is active. Payouts are executed autonomously if conditions are met.
          </p>
        </motion.div>

        {!isConnected ? (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="liquid-glass rounded-3xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <ShieldAlert size={48} className="text-white/20 mb-6" />
            <h2 className="text-2xl font-heading italic mb-4">Wallet Not Connected</h2>
            <p className="text-white/60 mb-8">Please connect your wallet to view your minted policies.</p>
          </motion.div>
        ) : numPolicies === 0 ? (
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="liquid-glass rounded-3xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center">
            <Plane size={48} className="text-white/20 mb-6" />
            <h2 className="text-2xl font-heading italic mb-4">No Active Policies</h2>
            <p className="text-white/60 mb-8">You haven't minted any flight delay policies on this wallet yet.</p>
            <Link href="/buy-policy" className="liquid-glass-strong rounded-full px-8 py-4 text-white hover:text-yellow-400 hover:border-yellow-400 transition-all border border-transparent">
              Buy a Policy Now
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: numPolicies }).map((_, i) => (
              <PolicyCard key={i} owner={address!} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
