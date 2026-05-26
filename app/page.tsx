"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ShieldCheck, Zap, Coins, Globe, Lock, Bot, Target, Globe2, Calendar } from "lucide-react"
import { BlurText } from "@/components/BlurText"
import { HLSVideo } from "@/components/HLSVideo"
import Link from "next/link"

export default function Home() {
  return (
    <div className="bg-black text-foreground overflow-x-hidden w-full font-body">
      {/* SECTION 2 — HERO (1000px height) */}
      <section className="relative overflow-hidden min-h-[1000px] w-full flex flex-col justify-start pt-[150px] items-center px-6" id="home">
        {/* Background video */}
        <video 
          src="/video/main%20video%201.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Overlays */}
        {/* Top gradient to blend the video border into the black background */}
        <div className="absolute top-0 left-0 right-0 z-[1] h-[300px] bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none"></div>
        {/* Bottom gradient to blend into the next section */}
        <div className="absolute bottom-0 left-0 right-0 z-[1] h-[300px] bg-gradient-to-b from-transparent to-black pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto text-center mt-12 py-16 px-4" style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)' }}>
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2 mb-8">
            <span className="bg-white text-black text-xs font-semibold px-2 py-0.5 rounded-full">Web3</span>
            <span className="text-sm font-light text-white/80">Introducing automated flight delay insurance.</span>
          </div>

          <BlurText 
            text="The Coverage Your Journey Deserves" 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.9] tracking-[-4px] mb-6 drop-shadow-xl" 
          />

          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-body font-medium text-white/90 text-lg md:text-xl max-w-2xl mb-10 drop-shadow-md"
          >
            Parametric coverage. Instant payouts in cUSD. Built on Celo, refined by smart contracts. This is travel insurance, wildly reimagined.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/buy-policy" className="liquid-glass-strong rounded-full px-8 py-4 text-white flex items-center gap-2 transition-all duration-200 hover:border-yellow-400 hover:text-yellow-400 active:scale-95 active:bg-yellow-400 active:text-black border border-transparent">
              Get Protected <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link href="/whitepaper" className="rounded-full px-8 py-4 text-white flex items-center gap-2 transition-all duration-200 border border-white/20 hover:border-yellow-400 hover:text-yellow-400 active:scale-95 active:bg-yellow-400 active:text-black">
              Read Whitepaper
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — PARTNERS BAR */}
      <section className="relative z-20 py-24 flex flex-col items-center border-y border-white/5 bg-white/[0.02] mt-12">
        <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white mb-12 inline-block">
          Trusted by global insurance & blockchain leaders
        </div>
        
        <div className="w-full max-w-[100vw] overflow-hidden flex relative">
          {/* Fading edges to blend with the background */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          
          <motion.div
            className="flex gap-16 md:gap-32 w-max items-center pr-16 md:pr-32"
            animate={{ x: ["0%", "calc(-50% - 0.5rem)"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {[
              "Celo Foundation", 
              "AXA Partners", 
              "Chainlink Oracles", 
              "Allianz Travel", 
              "Mento Labs (cUSD)", 
              "Zurich Insurance", 
              "AviationStack API",
              "AIG Travel Guard",
              "Celo Foundation", 
              "AXA Partners", 
              "Chainlink Oracles", 
              "Allianz Travel", 
              "Mento Labs (cUSD)", 
              "Zurich Insurance", 
              "AviationStack API",
              "AIG Travel Guard"
            ].map((partner, index) => (
              <div key={index} className="flex items-center gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                <span className="text-3xl md:text-5xl font-heading italic text-white/50 hover:text-white transition-colors whitespace-nowrap tracking-wide">{partner}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — START SECTION ("How It Works") */}
      <section className="relative w-full min-h-[700px] py-32 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden" id="process">
        {/* Background HLS video */}
        <div className="absolute inset-0 z-0">
          <HLSVideo 
            src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl min-h-[500px] justify-center">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-6">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            You fly. We monitor.
          </h2>
          <p className="font-body font-light text-white/60 text-lg mb-10 max-w-xl">
            Purchase your policy. Our smart contracts track your flight. If it's delayed, you get paid directly to your wallet. No forms. No waiting.
          </p>
          <Link href="/buy-policy" className="liquid-glass-strong rounded-full px-8 py-4 text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
            Get Protected <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* SECTION 5 — FEATURES CHESS */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto" id="services">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Pro protection. Zero hassle.
          </h2>
        </div>

        {/* Row 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-heading italic text-white leading-tight">Designed for travelers. Built on blockchain.</h3>
            <p className="font-body font-light text-white/60 text-lg">
              Every policy is an NFT. Our smart contracts act as the impartial judge, checking flight data through Chainlink oracles and releasing funds instantly.
            </p>
            <Link href="/whitepaper" className="liquid-glass-strong rounded-full px-6 py-3 text-white inline-flex hover:bg-white/5 transition-colors">
              Read the Whitepaper
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="liquid-glass rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <video src="/video/video%202.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-heading italic text-white leading-tight">It gets paid out. Automatically.</h3>
            <p className="font-body font-light text-white/60 text-lg">
              Your claim processes on its own. The blockchain monitors real-time flight data—then deposits cUSD into your wallet. No manual claims. Ever.
            </p>
            <Link href="/policies" className="rounded-full px-6 py-3 text-white border border-white/20 inline-flex hover:bg-white/10 transition-colors">
              View Your Policies
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="liquid-glass rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <video src="/video/video%203.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — FEATURES GRID */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto" id="work">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            Why TravelShield
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            The difference is everything.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading italic text-white">Seconds, Not Months</h3>
            <p className="text-white/60 font-body font-light text-sm">Payouts arrive the moment your flight is officially delayed.</p>
          </div>
          
          <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center text-white">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading italic text-white">Globally Accessible</h3>
            <p className="text-white/60 font-body font-light text-sm">Covering thousands of airlines worldwide on the Celo network.</p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center text-white">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading italic text-white">Stablecoin Payouts</h3>
            <p className="text-white/60 font-body font-light text-sm">Receive compensation in cUSD, pegged to the US Dollar.</p>
          </div>

          <div className="liquid-glass rounded-2xl p-6 flex flex-col gap-4">
            <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading italic text-white">Guaranteed by Code</h3>
            <p className="text-white/60 font-body font-light text-sm">Smart contracts hold the funds. Trust math, not middlemen.</p>
          </div>
        </div>
      </section>

      {/* SECTION 6.5 — AGENTS & DEFAI */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto" id="agents">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-purple-400 border border-purple-500/30 inline-flex items-center gap-2 mb-4">
            <Bot size={14} /> DeFAI Super App
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            More than just insurance.
          </h2>
          <p className="font-body font-light text-white/60 text-lg mt-6 max-w-2xl">
            TravelShield now includes autonomous agents to manage your entire travel finance lifecycle on Celo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/agent" className="liquid-glass rounded-3xl p-8 group hover:bg-white/5 transition-all border border-white/5 hover:border-purple-500/30 flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Bot size={24} />
            </div>
            <h3 className="text-2xl font-heading italic text-white mb-2">Conversational DeFi Agent</h3>
            <p className="text-white/60 font-light text-sm mb-6 flex-1">Chat naturally to buy policies, swap cUSD, or check yields. Powered by Groq LLM.</p>
            <span className="text-purple-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Try Agent <ArrowUpRight size={16} /></span>
          </Link>

          <Link href="/savings" className="liquid-glass rounded-3xl p-8 group hover:bg-white/5 transition-all border border-white/5 hover:border-green-500/30 flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-heading italic text-white mb-2">AI Savings Coach</h3>
            <p className="text-white/60 font-light text-sm mb-6 flex-1">Set travel goals, auto-deposit cUSD, and earn yield. The agent nudges you to stay on track.</p>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Start Saving <ArrowUpRight size={16} /></span>
          </Link>

          <Link href="/fx-shield" className="liquid-glass rounded-3xl p-8 group hover:bg-white/5 transition-all border border-white/5 hover:border-blue-500/30 flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe2 size={24} />
            </div>
            <h3 className="text-2xl font-heading italic text-white mb-2">FX Hedging Agent</h3>
            <p className="text-white/60 font-light text-sm mb-6 flex-1">Protect your local currency from devaluation. Auto-convert to cUSD when volatility spikes.</p>
            <span className="text-blue-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">View Dashboard <ArrowUpRight size={16} /></span>
          </Link>

          <Link href="/autopay" className="liquid-glass rounded-3xl p-8 group hover:bg-white/5 transition-all border border-white/5 hover:border-orange-500/30 flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <h3 className="text-2xl font-heading italic text-white mb-2">Bill Pay & Autopay Agent</h3>
            <p className="text-white/60 font-light text-sm mb-6 flex-1">Never miss a premium. The agent auto-pays your recurring stablecoin bills and subscriptions.</p>
            <span className="text-orange-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Manage Bills <ArrowUpRight size={16} /></span>
          </Link>
        </div>
      </section>

      {/* SECTION 7 — STATS */}
      <section className="relative w-full py-24 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden">
        {/* Background HLS video */}
        <div className="absolute inset-0 z-0">
          <HLSVideo 
            src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
            autoPlay loop muted playsInline
            style={{ filter: 'saturate(0)' }}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl liquid-glass rounded-3xl p-12 md:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">1,245</span>
              <span className="text-white/60 font-body font-light text-sm">Active Policies</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">$540k</span>
              <span className="text-white/60 font-body font-light text-sm">Total Coverage</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">324</span>
              <span className="text-white/60 font-body font-light text-sm">Claims Paid</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">100%</span>
              <span className="text-white/60 font-body font-light text-sm">Automation Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — TESTIMONIALS */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4">
            What They Say
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Don't take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass rounded-2xl p-8 flex flex-col justify-between gap-8">
            <p className="text-white/80 font-body font-light text-sm italic">"My flight from JFK was delayed by 4 hours. By the time I reached the lounge, $500 cUSD was already sitting in my Celo wallet. Absolutely game-changing."</p>
            <div>
              <div className="text-white font-body font-medium text-sm">Sarah Chen</div>
              <div className="text-white/50 font-body font-light text-xs">Frequent Flyer</div>
            </div>
          </div>
          
          <div className="liquid-glass rounded-2xl p-8 flex flex-col justify-between gap-8">
            <p className="text-white/80 font-body font-light text-sm italic">"The process is incredibly seamless. No paperwork, no back-and-forth emails. Just pure smart contract automation."</p>
            <div>
              <div className="text-white font-body font-medium text-sm">Marcus Webb</div>
              <div className="text-white/50 font-body font-light text-xs">Digital Nomad</div>
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-8 flex flex-col justify-between gap-8">
            <p className="text-white/80 font-body font-light text-sm italic">"TravelShield didn't just sell me insurance, they sold me peace of mind. Knowing the payout is guaranteed by code changes how I travel."</p>
            <div>
              <div className="text-white font-body font-medium text-sm">Elena Voss</div>
              <div className="text-white/50 font-body font-light text-xs">Business Consultant</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — CTA FOOTER */}
      <section className="relative w-full pt-32 pb-16 px-6 md:px-16 lg:px-24 overflow-hidden" id="pricing">
        {/* Background HLS video */}
        <div className="absolute inset-0 z-0">
          <HLSVideo 
            src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            Your next journey starts here.
          </h2>
          <p className="font-body font-light text-white/60 text-lg mb-10">
            Mint your policy NFT. See what automated insurance can do.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/buy-policy" className="liquid-glass-strong rounded-full px-8 py-4 text-white font-body transition-colors hover:bg-white/5">
              Buy Policy Now
            </Link>
            <Link href="/admin" className="bg-white text-black rounded-full px-8 py-4 font-body font-medium hover:bg-white/90 transition-colors">
              Agent Dashboard
            </Link>
          </div>

          <footer className="w-full mt-32 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-white/40 text-xs font-body">© 2026 TravelShield Platform</div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-white/40 text-xs font-body hover:text-white/80 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-white/40 text-xs font-body hover:text-white/80 transition-colors">Terms</Link>
              <Link href="#" className="text-white/40 text-xs font-body hover:text-white/80 transition-colors">Contact</Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
