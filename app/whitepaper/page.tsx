"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto w-full relative z-10">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center text-white">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-heading italic text-white mb-1">
                  Whitepaper
                </h1>
                <p className="text-white/60 font-light text-lg">TravelShield Core Protocol v1.0</p>
              </div>
            </div>
            <button className="liquid-glass-strong rounded-full px-6 py-3 text-sm text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
              <Download size={16} />
              Download PDF
            </button>
          </div>
          
          <div className="liquid-glass rounded-3xl p-8 md:p-12 text-white">
            <p className="text-xl font-light text-white/80 leading-relaxed mb-12">
              TravelShield is a fully autonomous, parametric travel insurance protocol deployed on the Celo network. This document outlines our decentralized architecture, AI-driven payout mechanics, and ERC-8004 compliance framework.
            </p>

            <h2 className="text-2xl font-heading italic text-white mt-12 mb-6 border-b border-white/10 pb-4">1. The Problem</h2>
            <p className="mb-8 text-white/60 font-light leading-relaxed">
              Traditional flight insurance relies on legacy Web2 infrastructure characterized by high premiums, opaque claim validation, and days-long manual human approval processes. Passengers suffering from delayed or cancelled flights must file complex claims forms while already enduring the stress of a travel disruption.
            </p>

            <h2 className="text-2xl font-heading italic text-white mt-12 mb-6 border-b border-white/10 pb-4">2. The Parametric Solution</h2>
            <p className="mb-8 text-white/60 font-light leading-relaxed">
              TravelShield tokenizes insurance policies as ERC-721 NFTs on Celo. The protocol uses an autonomous Node.js chron-job (the "Agent") powered by Groq LLMs (llama3-70b) and the AviationStack API to monitor real-time flight statuses. When a predefined condition is met (e.g., flight delayed {">"} 2 hours), the Agent cryptographically signs and executes an instant cUSD payout directly to the policyholder's wallet.
            </p>

            <h2 className="text-2xl font-heading italic text-white mt-12 mb-6 border-b border-white/10 pb-4">3. Architecture Stack</h2>
            <ul className="list-disc pl-6 mb-8 text-white/60 font-light space-y-4">
              <li><strong className="text-white font-medium">Blockchain:</strong> Celo L2 (Ethereum compatible, ultra-fast block times, minimal gas).</li>
              <li><strong className="text-white font-medium">Currency:</strong> cUSD (Celo Dollar) ensuring stable premium and payout valuation.</li>
              <li><strong className="text-white font-medium">Smart Contracts:</strong> OpenZeppelin standard implementations (PolicyNFT, InsurancePool).</li>
              <li><strong className="text-white font-medium">Data Oracle:</strong> AviationStack API for deterministic off-chain flight data.</li>
              <li><strong className="text-white font-medium">Trigger Engine:</strong> Groq API for deterministic AI validation, complying with ERC-8004.</li>
            </ul>

            <h2 className="text-2xl font-heading italic text-white mt-12 mb-6 border-b border-white/10 pb-4">4. ERC-8004 Agent Registry Compliance</h2>
            <p className="mb-4 text-white/60 font-light leading-relaxed">
              The Agent wallet responsible for executing state changes (payouts) is publicly registered via our AgentRegistry contract. This creates a transparent onchain audit trail, allowing anyone to verify the volume of policies monitored and claims settled by the TravelShield autonomous agent without human intervention.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
