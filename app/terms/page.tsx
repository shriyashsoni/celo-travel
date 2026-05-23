"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto w-full relative z-10">
      <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 inline-flex w-fit">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-xs font-medium">Terms of Service</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-heading italic mb-12">
        Terms & Conditions
      </h1>

      <div className="space-y-8 text-white/70 font-light leading-relaxed">
        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By minting a TravelShield policy NFT, you agree to these Terms and Conditions. Our services involve interacting with smart contracts deployed on the Celo blockchain. You acknowledge that blockchain transactions are irreversible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">2. Parametric Insurance Mechanics</h2>
          <p>
            TravelShield operates strictly on a parametric model. Payouts are triggered automatically based on objective flight delay data provided by designated decentralized oracles. The smart contract's determination of a delay or cancellation is final.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">3. Premium Payments and cUSD</h2>
          <p>
            All premiums are paid in cUSD (Celo Dollar), and all claims are settled in cUSD. You are responsible for ensuring your wallet holds sufficient funds and gas (CELO) to execute the policy minting transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-heading italic text-white mb-4">4. Dispute Resolution</h2>
          <p>
            Because the process is fully automated via smart contracts, traditional manual claim disputes are not applicable. If an oracle reports incorrect data due to a systemic failure, TravelShield governance may step in, but standard delays strictly follow the contract logic.
          </p>
        </section>

        <p className="pt-8 text-sm text-white/40">
          Last updated: May 2026
        </p>
      </div>
    </div>
  );
}
