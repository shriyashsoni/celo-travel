"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Shield, Download, Plane, CheckCircle2, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
  const { txHash } = useParams();
  const [policyData, setPolicyData] = useState<any>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (txHash) {
      const data = localStorage.getItem(`policy_${txHash}`);
      if (data) {
        setPolicyData(JSON.parse(data));
      }
    }
  }, [txHash]);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TravelShield_Policy_${txHash?.toString().substring(0, 8)}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!policyData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Shield className="w-12 h-12 mb-4 text-white/30" />
          <p>Loading Certificate Data...</p>
        </div>
      </div>
    );
  }

  const { flightNumber, date, tier, passengerName, passengerEmail, timestamp } = policyData;

  const tierMap: Record<number, { label: string, payout: string }> = {
    1: { label: "> 1 Minute Delay", payout: "5 cUSD" },
    2: { label: "> 5 Minutes Delay", payout: "15 cUSD" },
    3: { label: "Flight Cancelled", payout: "30 cUSD" },
  };
  const coverage = tierMap[Number(tier)] || { label: "Unknown Tier", payout: "Unknown" };

  return (
    <div className="min-h-screen bg-black text-white font-body py-32 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-heading italic mb-2">Policy Certificate</h1>
            <p className="text-white/60 text-sm">Official Parametric Insurance Document</p>
          </div>
          <div className="flex gap-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just secured my flight ${flightNumber} on-chain with TravelShield! 🛡️✈️\n\n🔗 Transaction: https://scan.botchain.ai/tx/${txHash}\n\nGet your own autonomous flight insurance at: https://celo-travel.vercel.app\n\n#TravelShield #BOTChain #Web3`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/50 text-[#1DA1F2] font-medium text-sm flex items-center gap-2 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Share on X
            </a>
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className="px-6 py-3 rounded-full bg-white hover:bg-white/90 text-black font-medium text-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Download size={16} />
              {isDownloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Certificate Rendering Area */}
        <div 
          ref={certificateRef}
          className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)] p-12"
          style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 50%)' }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Shield size={400} />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-16">
              <div className="flex items-center gap-3">
                <Shield className="w-10 h-10 text-white" />
                <div>
                  <h2 className="text-2xl font-heading italic tracking-wider">TravelShield</h2>
                  <p className="text-xs text-white/50 tracking-widest uppercase">Decentralized Insurance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold uppercase mb-2">
                   <CheckCircle2 size={14} /> Confirmed On-Chain
                </div>
                <p className="font-mono text-xs text-white/40">Network: BOT Chain</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-16">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-widest mb-2">Policyholder Details</p>
                <p className="text-2xl font-medium mb-1">{passengerName}</p>
                <p className="text-white/60">{passengerEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-2">Issue Date</p>
                <p className="text-xl font-medium">{new Date(timestamp).toLocaleDateString()}</p>
                <p className="text-white/60 text-sm">{new Date(timestamp).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-8 mb-16 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-widest mb-2">Covered Flight</p>
                <div className="flex items-center gap-4">
                  <Plane className="text-white" size={32} />
                  <p className="text-5xl font-heading italic">{flightNumber}</p>
                </div>
                <p className="text-white/60 mt-3 pl-12">Scheduled Departure: {date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-12">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-widest mb-4">Coverage Terms</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-white/70">Coverage Trigger</span>
                    <span className="font-medium text-white">{coverage.label}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                    <span className="text-white/70">Guaranteed Payout</span>
                    <span className="font-medium text-green-400">{coverage.payout}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-widest mb-4">Blockchain Record</p>
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 break-all h-[124px] flex flex-col justify-center">
                  <p className="text-xs text-white/50 mb-1">Transaction Hash:</p>
                  <p className="font-mono text-xs text-blue-400 mb-3">{txHash}</p>
                  <a 
                    href={`https://scan.botchain.ai/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-white/80 hover:text-white underline underline-offset-4 flex items-center gap-1"
                  >
                    <FileText size={12} />
                    View on BOTScan
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-dashed border-white/20 text-center">
              <p className="text-xs text-white/30 uppercase tracking-widest">
                This is an autonomously executing smart contract. No claims filing required. 
                <br />If the condition is met, payouts are executed automatically.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
