import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111] py-12 px-5 sm:px-8 mt-auto border-t border-white/10" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-4 text-white" style={{ fontFamily: "var(--font-heading)" }}>
            <ShieldCheck size={28} color="var(--color-accent)" strokeWidth={2.5} />
            TravelShield
          </Link>
          <p className="text-sm max-w-[300px] leading-relaxed text-white/60">
            AI-powered, automated flight delay insurance settled on BOT Chain. No human approval. Instant settlement.
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
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Ecosystem Partner</h4>
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="/botchain-logo.jpeg" 
              alt="BOT Chain Logo" 
              className="w-8 h-8 rounded-lg object-contain border border-white/10 bg-black/60 p-0.5"
            />
            <div>
              <div className="text-white font-medium text-sm">BOT Chain</div>
              <div className="text-[11px] text-white/40">Official Ecosystem Partner</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <a 
                href="https://botchain.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-white/70"
              >
                <span>BOT Chain official website</span>
                <ArrowUpRight size={13} className="opacity-70" />
              </a>
            </li>
            <li>
              <a 
                href="https://scan.botchain.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors inline-flex items-center gap-1.5 text-white/70"
              >
                <span>BOT Chain Explorer</span>
                <ArrowUpRight size={13} className="opacity-70" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-white/10 text-xs flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40">
        <p>© {new Date().getFullYear()} TravelShield. Built for BOT Chain.</p>
        <p>Ecosystem Partner: BOT Chain (botchain.ai)</p>
      </div>
    </footer>
  );
}

