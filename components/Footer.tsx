import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111] py-12 px-5 sm:px-8 mt-auto" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4 text-white" style={{ fontFamily: "var(--font-heading)" }}>
            <ShieldCheck size={28} color="var(--color-accent)" strokeWidth={2.5} />
            TravelShield
          </Link>
          <p className="text-sm max-w-[300px] leading-relaxed">
            AI-powered, automated flight delay insurance paid out in cUSD on the Celo network. No human approval. Instant settlement.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/buy-policy" className="hover:text-white transition-colors">Buy Policy</Link></li>
            <li><Link href="/policies" className="hover:text-white transition-colors">My Policies</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors">Agent Dashboard</Link></li>
            <li><Link href="/whitepaper" className="hover:text-white transition-colors">Whitepaper</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/10 text-xs text-center">
        <p>© {new Date().getFullYear()} TravelShield. Built for the Celo Onchain Agents Hackathon.</p>
      </div>
    </footer>
  );
}
