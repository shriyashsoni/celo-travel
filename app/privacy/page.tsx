"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto w-full relative z-10">
      <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 inline-flex w-fit">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium">Privacy Policy</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-heading italic mb-12">
        Privacy Policy
      </h1>

      <div className="space-y-8 text-white/70 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">1. Information Collection</h2>
          <p>
            When you interact with the TravelShield smart contracts or web application, we only collect essential on-chain information required for parametric insurance operations. This includes your public wallet address, flight details associated with the policy, and the transaction hashes of your premium payments.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">2. On-Chain Data Transparency</h2>
          <p>
            Because TravelShield operates as a decentralized application (dApp) on the Celo blockchain, please be aware that all policies minted and claims settled are permanently recorded on public ledger. Your wallet address and its interactions with our contracts are public by nature.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">3. Oracle Interactions</h2>
          <p>
            We utilize decentralized oracles (e.g., Chainlink) to retrieve flight status data from global aviation APIs. We do not store personal identification associated with the flight passengers, only the flight identifier (e.g., "AA123") and departure date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">4. Cookies and Local Storage</h2>
          <p>
            Our web interface uses minimal local storage solely to improve your connection experience with Web3 wallets (via RainbowKit/WalletConnect) and manage session states. We do not use tracking cookies for advertising.
          </p>
        </section>

        <p className="pt-8 text-sm text-white/40">
          Last updated: May 2026
        </p>
      </div>
    </div>
  );
}
