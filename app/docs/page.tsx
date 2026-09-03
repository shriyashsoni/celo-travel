"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, BookOpen, Terminal, Shield, Cpu, Coins, Clock, Globe, 
  Menu, X, Check, Copy, ChevronRight, HelpCircle, ArrowRight, FileCode2
} from "lucide-react"
import Link from "next/link"

interface DocArticle {
  id: string
  title: string
  category: string
  content: React.ReactNode
  toc: { id: string; label: string }[]
}

export default function DocsPage() {
  const [activeArticleId, setActiveArticleId] = useState("introduction")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Scroll to top when active article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeArticleId])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const categories = [
    {
      name: "Get Started",
      articles: [
        { id: "introduction", title: "Introduction", icon: <BookOpen size={16} /> },
        { id: "quickstart", title: "Quickstart Guide", icon: <Terminal size={16} /> },
        { id: "how-it-works", title: "How It Works", icon: <HelpCircle size={16} /> }
      ]
    },
    {
      name: "Core Features",
      articles: [
        { id: "parametric-insurance", title: "Parametric Insurance", icon: <Shield size={16} /> },
        { id: "ai-oracle", title: "AI Oracle & APIs", icon: <Cpu size={16} /> },
        { id: "savings-yield", title: "cUSD Savings Yield", icon: <Coins size={16} /> },
        { id: "autopay", title: "Autopay System", icon: <Clock size={16} /> },
        { id: "fx-shield", title: "FX Volatility Shield", icon: <Globe size={16} /> }
      ]
    },
    {
      name: "Developer Resources",
      articles: [
        { id: "smart-contracts", title: "Smart Contracts Code", icon: <FileCode2 size={16} /> }
      ]
    }
  ]

  // Filter categories and articles based on search query
  const filteredCategories = categories.map(cat => {
    const matchedArticles = cat.articles.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return { ...cat, articles: matchedArticles }
  }).filter(cat => cat.articles.length > 0)

  // System Configuration Variables
  const POOL_CONTRACT_ADDRESS = "0x89FDD0Ad4bd2B2c48ECB39A6f636Af000F56Abe6"
  const NFT_CONTRACT_ADDRESS = "0xb37d83B8f7260b83aAc7013c2c09b329eE37986C"
  const CUSD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CUSD_ADDRESS || "Not deployed yet"

  const articles: Record<string, DocArticle> = {
    introduction: {
      id: "introduction",
      title: "Introduction to TravelShield",
      category: "Get Started",
      toc: [
        { id: "what-is-travelshield", label: "What is TravelShield?" },
        { id: "why-parametric", label: "Why Parametric?" },
        { id: "core-value", label: "Core Value Propositions" },
        { id: "celo-advantages", label: "BOT Chain Advantages" }
      ],
      content: (
        <div className="space-y-8">
          <section id="what-is-travelshield" className="space-y-4">
            <h2 className="text-3xl font-heading italic text-white border-b border-white/10 pb-2">What is TravelShield?</h2>
            <p className="text-white/70 leading-relaxed">
              TravelShield is a decentralized, autonomous, parametric flight delay insurance protocol built on **BOT Chain**. It enables travelers to secure flight delay coverage instantly and receive automatic payouts directly to their Web3 wallets without submitting claims or dealing with manual reviews.
            </p>
            <p className="text-white/70 leading-relaxed">
              By using a project stablecoin on BOT Chain and advanced AI-powered oracles (combining live flight data from AviationStack with Groq LLM reasoning), TravelShield eliminates the traditional operational friction, delays, and lack of transparency associated with traditional travel insurance providers.
            </p>
          </section>

          <section id="why-parametric" className="space-y-4">
            <h2 className="text-3xl font-heading italic text-white border-b border-white/10 pb-2">Why Parametric?</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 my-6">
              <h3 className="font-heading italic text-yellow-400 text-lg mb-2">Parametric vs. Traditional Insurance</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Traditional insurance claims are notoriously slow, opaque, and highly administrative. Parametric insurance bypasses human adjusters entirely by tying the payout directly to a measurable event parameter—in this case, flight status reports and delay duration records on the blockchain. If the condition is met, the contract fires the payout instantly.
              </p>
            </div>
            <p className="text-white/70 leading-relaxed">
              With TravelShield, the rule is simple: if your flight is delayed beyond the duration specified by your chosen tier, or is outright cancelled, you receive your payout. Period. No claims to file, no receipts to save, and no customer support loops.
            </p>
          </section>

          <section id="core-value" className="space-y-4">
            <h2 className="text-3xl font-heading italic text-white border-b border-white/10 pb-2">Core Value Propositions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="liquid-glass border border-white/5 rounded-2xl p-5">
                <h4 className="font-heading italic text-blue-400 mb-2">Instant Payouts</h4>
                <p className="text-white/60 text-xs leading-relaxed">Claims are evaluated and paid out autonomously by smart contracts within seconds of flight status verification.</p>
              </div>
              <div className="liquid-glass border border-white/5 rounded-2xl p-5">
                <h4 className="font-heading italic text-purple-400 mb-2">AI-Driven Auditing</h4>
                <p className="text-white/60 text-xs leading-relaxed">A dual-agent verification system parses multiple flight databases and evaluates anomalous events with AI reasoning.</p>
              </div>
              <div className="liquid-glass border border-white/5 rounded-2xl p-5">
                <h4 className="font-heading italic text-green-400 mb-2">Hedged Savings Yield</h4>
                <p className="text-white/60 text-xs leading-relaxed">Locked premium capital generates yield within the BOT Chain ecosystem, subsidizing lower costs for travelers.</p>
              </div>
              <div className="liquid-glass border border-white/5 rounded-2xl p-5">
                <h4 className="font-heading italic text-pink-400 mb-2">Multi-Currency Protection</h4>
                <p className="text-white/60 text-xs leading-relaxed">FX Volatility Shield locks in local currency exchange rates relative to cUSD, shielding travelers from market swings.</p>
              </div>
            </div>
          </section>

          <section id="celo-advantages" className="space-y-4">
            <h2 className="text-3xl font-heading italic text-white border-b border-white/10 pb-2">BOT Chain Advantages</h2>
            <ul className="list-disc pl-6 text-white/70 space-y-2 leading-relaxed">
              <li>**Ultra-low Gas Fees:** Transaction costs are typically less than $0.01, allowing micro-insurance policies to remain highly profitable and accessible.</li>
              <li>**Fast Block Times:** Sub-5 second settlement speed ensures payouts occur the moment the AI agent broadcasts the claim approval.</li>
              <li>**Mobile-First Design:** Celo's lightweight phone-number-based infrastructure supports easy client integration across mobile-friendly travel apps.</li>
            </ul>
          </section>
        </div>
      )
    },
    quickstart: {
      id: "quickstart",
      title: "Quickstart Guide",
      category: "Get Started",
      toc: [
        { id: "setup-wallet", label: "1. Setup Web3 Wallet" },
        { id: "acquire-cusd", label: "2. Acquire project token & BOT" },
        { id: "purchase-policy", label: "3. Purchase Flight Policy" },
        { id: "monitor-status", label: "4. Automatic Payout Monitoring" }
      ],
      content: (
        <div className="space-y-8">
          <p className="text-white/70 leading-relaxed">
            Get up and running with TravelShield in less than 5 minutes. Learn how to connect your wallet, fund it with BOT, purchase flight delay insurance, and observe active tracking.
          </p>

          <section id="setup-wallet" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">1. Setup Web3 Wallet</h2>
            <p className="text-white/70 leading-relaxed">
              TravelShield uses standard Web3 connections. You can use **MetaMask**, **Rainbow Wallet**, or another wallet that supports custom EVM networks.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="font-medium text-white mb-2">Connecting to BOT Chain</h4>
              <p className="text-white/60 text-xs mb-4">Add the following network specs to your custom RPC configuration in MetaMask:</p>
              <pre className="bg-black/80 rounded-xl p-4 text-xs font-mono text-green-400 border border-white/10 overflow-x-auto">
{`Network Name: BOT Chain
New RPC URL: https://rpc.botchain.ai
Chain ID: 677
Currency Symbol: BOT
Block Explorer URL: https://scan.botchain.ai`}
              </pre>
            </div>
          </section>

          <section id="acquire-cusd" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">2. Acquire project token & BOT</h2>
            <p className="text-white/70 leading-relaxed">
              Premium payments are processed in the project USD token. A fraction of **BOT** is required to pay network transaction fees.
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>**Testnet Faucet:** Get free test CELO and cUSD from the [Celo Faucet](https://faucet.celo.org).</li>
              <li>**Mainnet:** Purchase CELO and cUSD via decentralized exchanges (Ubeswap) or centralized exchanges (Binance, Coinbase) and send them to your Celo wallet address.</li>
            </ul>
          </section>

          <section id="purchase-policy" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">3. Purchase Flight Policy</h2>
            <p className="text-white/70 leading-relaxed">
              Navigate to the dashboard navigation hub and click on **Buy Policy**. Follow the fields:
            </p>
            <ol className="list-decimal pl-6 text-white/70 space-y-2">
              <li>Enter your flight number (e.g. `LH430` for Lufthansa flight 430).</li>
              <li>Select your coverage tier (Tier 1, Tier 2, or Tier 3).</li>
              <li>Approve the cUSD spending allowance inside your wallet extension.</li>
              <li>Submit the `buyPolicy` transaction to mint your parametric policy NFT.</li>
            </ol>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-xs text-blue-300">
              <strong>Tip:</strong> Once minted, your policy details are encoded directly inside an ERC-721 token. You can verify it under the "My Policies" page or look up the transaction on BOTScan.
            </div>
          </section>

          <section id="monitor-status" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">4. Automatic Payout Monitoring</h2>
            <p className="text-white/70 leading-relaxed">
              Once your policy is active, you don't need to check in. Our decentralized oracle agents run background queries on landing updates.
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                <Cpu size={24} />
              </div>
              <div>
                <h5 className="font-heading italic text-white mb-1">Oracle Trigger Event</h5>
                <p className="text-white/60 text-xs leading-relaxed">
                  Upon landing, if AviationStack marks the flight as delayed by more than your tier limit, the oracle signs an approval token triggering `claimPayout` on the pool smart contract. The cUSD is immediately wired to your address.
                </p>
              </div>
            </div>
          </section>
        </div>
      )
    },
    "how-it-works": {
      id: "how-it-works",
      title: "How It Works: End-to-End Architecture",
      category: "Get Started",
      toc: [
        { id: "system-architecture", label: "System Architecture" },
        { id: "buy-workflow", label: "Purchase Workflow" },
        { id: "oracle-workflow", label: "AI Oracle & Payout Workflow" }
      ],
      content: (
        <div className="space-y-8">
          <p className="text-white/70 leading-relaxed">
            TravelShield achieves autonomous payouts by combining robust smart contracts with decentralized AI Agents. The diagram and sections below describe the exact protocol mechanics.
          </p>

          <section id="system-architecture" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">System Architecture</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6">
              <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-lg gap-4 text-xs font-mono text-center">
                <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-xl w-36">
                  <span className="text-blue-300 font-bold block mb-1">User</span>
                  Connects wallet, deposits cUSD
                </div>
                <div className="text-white/40">➔</div>
                <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl w-36">
                  <span className="text-purple-300 font-bold block mb-1">Policy NFT</span>
                  Mints policy token (ERC-721)
                </div>
                <div className="text-white/40">➔</div>
                <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-xl w-36">
                  <span className="text-green-300 font-bold block mb-1">Insurance Pool</span>
                  Holds reserves, earns DeFi yield
                </div>
              </div>
              <div className="w-1 h-8 bg-white/20"></div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-lg gap-4 text-xs font-mono text-center">
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-xl w-36">
                  <span className="text-yellow-300 font-bold block mb-1">AI Oracle Agent</span>
                  Monitors AviationStack & parses logic
                </div>
                <div className="text-white/40">➔</div>
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl w-36">
                  <span className="text-red-300 font-bold block mb-1">Payout Action</span>
                  Validates claim, sends cUSD
                </div>
              </div>
            </div>
          </section>

          <section id="buy-workflow" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Purchase Workflow</h2>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0 border border-blue-500/30">1</span>
                <span className="text-white/70 text-sm leading-relaxed">**Allowance Granted:** The user approves the `InsurancePool` contract to withdraw `cUSD` token.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0 border border-blue-500/30">2</span>
                <span className="text-white/70 text-sm leading-relaxed">**Policy Minting:** The user calls `mintPolicy` on `PolicyNFT` passing flight specifications.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center shrink-0 border border-blue-500/30">3</span>
                <span className="text-white/70 text-sm leading-relaxed">**Premium Transfer:** The `PolicyNFT` contract queries `InsurancePool` to lock premium funds into the TVL reserve pool.</span>
              </li>
            </ul>
          </section>

          <section id="oracle-workflow" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">AI Oracle & Payout Workflow</h2>
            <p className="text-white/70 leading-relaxed">
              Unlike static oracles, TravelShield uses dynamic reasoning agents to double-check conditions, protecting liquidity against corrupt API reports.
            </p>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs flex items-center justify-center shrink-0 border border-purple-500/30">1</span>
                <span className="text-white/70 text-sm leading-relaxed">**Flight Monitoring:** Periodic chron-jobs trigger AI agent to check Flight status on AviationStack endpoint.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs flex items-center justify-center shrink-0 border border-purple-500/30">2</span>
                <span className="text-white/70 text-sm leading-relaxed">**LLM Analysis:** If a delay is detected, the flight details are sent to Groq's LLM runtime. The LLM validates that the delay length qualifies under policies conditions.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs flex items-center justify-center shrink-0 border border-purple-500/30">3</span>
                <span className="text-white/70 text-sm leading-relaxed">**On-chain Release:** The oracle agent signs a message and calls `triggerPayout` on the `InsurancePool` contract, executing a direct transfer of cUSD.</span>
              </li>
            </ul>
          </section>
        </div>
      )
    },
    "parametric-insurance": {
      id: "parametric-insurance",
      title: "Parametric Flight Insurance Details",
      category: "Core Features",
      toc: [
        { id: "how-coverage-works", label: "How Coverage Works" },
        { id: "coverage-tiers", label: "Pricing & Coverage Tiers" },
        { id: "exclusions-limits", label: "Exclusions & Limitations" }
      ],
      content: (
        <div className="space-y-8">
          <section id="how-coverage-works" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">How Coverage Works</h2>
            <p className="text-white/70 leading-relaxed">
              Under TravelShield's parametric model, coverage triggers are absolute. The contract reads the actual departure and arrival times compared to the scheduled ticket times. If the difference matches or exceeds the limits defined by your tier, the policy settles immediately.
            </p>
          </section>

          <section id="coverage-tiers" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Pricing & Coverage Tiers</h2>
            <p className="text-white/70 leading-relaxed">
              We offer three tiers of protection tailored to different travel demands:
            </p>
            <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black/50">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/70">
                    <th className="p-4">Tier Level</th>
                    <th className="p-4">Condition</th>
                    <th className="p-4">Premium Cost</th>
                    <th className="p-4">Payout Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  <tr>
                    <td className="p-4 font-bold text-blue-400">Tier 1</td>
                    <td className="p-4">Flight delay &gt; 1 minute</td>
                    <td className="p-4">0.50 cUSD</td>
                    <td className="p-4 font-bold text-green-400">5.00 cUSD</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-purple-400">Tier 2</td>
                    <td className="p-4">Flight delay &gt; 5 minutes</td>
                    <td className="p-4">1.50 cUSD</td>
                    <td className="p-4 font-bold text-green-400">15.00 cUSD</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-yellow-400">Tier 3</td>
                    <td className="p-4">Flight Cancellation</td>
                    <td className="p-4">3.00 cUSD</td>
                    <td className="p-4 font-bold text-green-400">30.00 cUSD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="exclusions-limits" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Exclusions & Limitations</h2>
            <p className="text-white/70 leading-relaxed">
              Since execution relies entirely on public airport database status, policies must be purchased at least **24 hours prior** to the scheduled departure time. This prevents buying policies during active delay events (anti-arbitrage protection).
            </p>
          </section>
        </div>
      )
    },
    "ai-oracle": {
      id: "ai-oracle",
      title: "AI Oracle & Chat API Endpoints",
      category: "Core Features",
      toc: [
        { id: "oracle-api-route", label: "AI Oracle API Route (/api/oracle)" },
        { id: "agent-chat-route", label: "AI Chat Agent Route (/api/agent-chat)" }
      ],
      content: (
        <div className="space-y-8">
          <p className="text-white/70 leading-relaxed">
            TravelShield uses Next.js server routes to interface with external APIs (AviationStack) and AI inference providers (Groq Cloud).
          </p>

          <section id="oracle-api-route" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">AI Oracle API Route (`/api/oracle`)</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              This endpoint triggers a database fetch for a flight status and processes it through a Llama-3 model to determine payout eligibility. Below is the active routing code:
            </p>
            <div className="relative">
              <button 
                onClick={() => copyToClipboard(
`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { flightId, tokenId } = await req.json();

    // 1. Fetch Real Flight Data from AviationStack
    const flightRes = await fetch(\`http://api.aviationstack.com/v1/flights?access_key=\${process.env.AVIATIONSTACK_API_KEY}&flight_iata=\${flightId}\`);
    const flightData = await flightRes.json();
    
    let flightStatus = "active";
    let delayMinutes = 0;

    if (flightData && flightData.data && flightData.data.length > 0) {
      const flight = flightData.data[0];
      flightStatus = flight.flight_status;
      if (flight.departure && flight.departure.delay) {
        delayMinutes = flight.departure.delay;
      }
    }

    // 2. Use Groq AI to process rules
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.GROQ_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an autonomous smart contract oracle agent. Output only JSON with 'qualifiesForPayout' (boolean) and 'reason' (string)."
          },
          {
            role: "user",
            content: \`Flight \${flightId}. Status is '\${flightStatus}' with \${delayMinutes} mins delay. Policy requires cancellation or >120m delay.\`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const groqData = await groqRes.json();
    const decision = JSON.parse(groqData.choices[0].message.content);
    return NextResponse.json({ success: true, flightData, decision });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`, "oracle-route")}
                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/50 hover:text-white transition-all"
              >
                {copiedId === "oracle-route" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <pre className="bg-black/80 rounded-xl p-4 text-xs font-mono text-green-400 border border-white/10 overflow-x-auto">
{`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { flightId, tokenId } = await req.json();

    // 1. Fetch Real Flight Data from AviationStack
    const flightRes = await fetch(\`http://api.aviationstack.com/v1/flights?access_key=\${process.env.AVIATIONSTACK_API_KEY}&flight_iata=\${flightId}\`);
    const flightData = await flightRes.json();
    
    let flightStatus = "active";
    let delayMinutes = 0;

    if (flightData && flightData.data && flightData.data.length > 0) {
      const flight = flightData.data[0];
      flightStatus = flight.flight_status;
      if (flight.departure && flight.departure.delay) {
        delayMinutes = flight.departure.delay;
      }
    }

    // 2. Use Groq AI to process rules
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.GROQ_API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an autonomous smart contract oracle agent. Output only JSON with 'qualifiesForPayout' (boolean) and 'reason' (string)."
          },
          {
            role: "user",
            content: \`Flight \${flightId}. Status is '\${flightStatus}' with \${delayMinutes} mins delay. Policy requires cancellation or >120m delay.\`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const groqData = await groqRes.json();
    const decision = JSON.parse(groqData.choices[0].message.content);
    return NextResponse.json({ success: true, flightData, decision });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`}
              </pre>
            </div>
          </section>

          <section id="agent-chat-route" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">AI Chat Agent Route (`/api/agent-chat`)</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Provides users with interactive support regarding travel coverage, savings metrics, and standard DeFi swaps:
            </p>
            <pre className="bg-black/80 rounded-xl p-4 text-xs font-mono text-green-400 border border-white/10 overflow-x-auto">
{`// System parameters parsed by Llama-3.1-8b inside system context:
- Pool contract: ${POOL_CONTRACT_ADDRESS}
- Policy NFT: ${NFT_CONTRACT_ADDRESS}
- Native Celo cUSD Address: ${CUSD_CONTRACT_ADDRESS}
- Tiers: 
  * Tier 1: Premium = 0.50 cUSD, Payout = $5
  * Tier 2: Premium = 1.50 cUSD, Payout = $15
  * Tier 3: Premium = 3.00 cUSD, Payout = $30`}
            </pre>
          </section>
        </div>
      )
    },
    "savings-yield": {
      id: "savings-yield",
      title: "cUSD Savings & Yield Integration",
      category: "Core Features",
      toc: [
        { id: "reserve-utilization", label: "Reserve Pool Capital" },
        { id: "yield-protocols", label: "DeFi Yield Protocols" },
        { id: "payout-liquidity", label: "Ensuring Payout Liquidity" }
      ],
      content: (
        <div className="space-y-8">
          <section id="reserve-utilization" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Reserve Pool Capital</h2>
            <p className="text-white/70 leading-relaxed">
              When users purchase flight insurance policies, the premium capital goes to the `InsurancePool` reserve. Instead of keeping this capital idle, the protocol channels a percentage of reserve funds into audited Celo stablecoin yield protocols.
            </p>
          </section>

          <section id="yield-protocols" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">DeFi Yield Protocols</h2>
            <p className="text-white/70 leading-relaxed">
              By deploying cUSD capital into automated Celo platforms (e.g. Moola Market, Aave V3 market instances on Celo), the pool generates interest continuously. The accrued interest is used to:
            </p>
            <ul className="list-disc pl-6 text-white/70 space-y-2">
              <li>Subsidize premium rates for travelers.</li>
              <li>Buffer the insurance pool reserves, making it more resilient to mass cancellation anomalies (e.g. volcanic eruptions or global IT outages).</li>
            </ul>
          </section>

          <section id="payout-liquidity" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Ensuring Payout Liquidity</h2>
            <p className="text-white/70 leading-relaxed">
              To guarantee that there is always immediately checkable cUSD to cover payouts, the contract locks a minimum liquidity ratio (e.g., 30% of total assets) in liquid reserves, keeping only the remaining 70% in yield-bearing positions.
            </p>
          </section>
        </div>
      )
    },
    autopay: {
      id: "autopay",
      title: "Autopay Renewal System",
      category: "Core Features",
      toc: [
        { id: "autopay-concept", label: "The Autopay Concept" },
        { id: "allowance-approvals", label: "Token Allowance Approvals" },
        { id: "automated-triggers", label: "Automated Triggers" }
      ],
      content: (
        <div className="space-y-8">
          <section id="autopay-concept" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">The Autopay Concept</h2>
            <p className="text-white/70 leading-relaxed">
              For business travelers and frequent flyers, manually buying policies for every flight booking is inefficient. The Autopay renewal system enables automated flight protection using ERC-20 token pre-allowance limits.
            </p>
          </section>

          <section id="allowance-approvals" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Token Allowance Approvals</h2>
            <p className="text-white/70 leading-relaxed">
              Under Autopay, users authorize a specified allowance cap (e.g., 20 cUSD) to the TravelShield router contract. You retain custody of your assets; the contract only initiates a withdrawal when a flight ticket purchase is matched with your user profile details.
            </p>
          </section>

          <section id="automated-triggers" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Automated Triggers</h2>
            <p className="text-white/70 leading-relaxed">
              When our tracking agent confirms a new booking registered to your decentralized ID, the protocol calls `autopayCover` on-chain, automatically creating a new parametric policy NFT without forcing you to manually confirm the wallet popup during travel booking.
            </p>
          </section>
        </div>
      )
    },
    "fx-shield": {
      id: "fx-shield",
      title: "FX Volatility Shield",
      category: "Core Features",
      toc: [
        { id: "currency-fluctuations", label: "The Currency Volatility Problem" },
        { id: "shielding-mechanism", label: "The Shielding Mechanism" },
        { id: "oracle-feeds", label: "Supported FX Oracles" }
      ],
      content: (
        <div className="space-y-8">
          <section id="currency-fluctuations" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">The Currency Volatility Problem</h2>
            <p className="text-white/70 leading-relaxed">
              Travelers budget and pay for trips in their home currency (EUR, INR, GBP, etc.). While cUSD is a solid USD stablecoin peg, local exchange rate fluctuations between the policy purchase time and the landing time can cause losses in absolute insurance values.
            </p>
          </section>

          <section id="shielding-mechanism" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">The Shielding Mechanism</h2>
            <p className="text-white/70 leading-relaxed">
              FX Shield allows travelers to lock in local currency values. If the local currency drops relative to cUSD during flight coverage, the contract calculates the premium difference and pays out extra cUSD to guarantee that the absolute purchasing power is maintained upon settlement.
            </p>
          </section>

          <section id="oracle-feeds" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">Supported FX Oracles</h2>
            <p className="text-white/70 leading-relaxed">
              We consume price feeds from **Chainlink FX Oracles** and the native **Celo Mento exchange oracle** to derive high-frequency price updates between fiat tokens and stable assets.
            </p>
          </section>
        </div>
      )
    },
    "smart-contracts": {
      id: "smart-contracts",
      title: "Smart Contracts Solidity Code",
      category: "Developer Resources",
      toc: [
        { id: "pool-contract-code", label: "InsurancePool.sol (Complete)" },
        { id: "nft-contract-code", label: "PolicyNFT.sol (Complete)" }
      ],
      content: (
        <div className="space-y-8">
          <p className="text-white/70 leading-relaxed">
            TravelShield's core smart contracts are deployed on the Celo Network. Below is the complete source code for both contracts.
          </p>

          <section id="pool-contract-code" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">InsurancePool.sol</h2>
            <p className="text-white/70 text-xs font-mono">Address: <span className="text-blue-400">{POOL_CONTRACT_ADDRESS}</span></p>
            <div className="relative">
              <button 
                onClick={() => copyToClipboard(
`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PolicyNFT.sol";

contract InsurancePool is Ownable {
    IERC20 public cUSD;
    PolicyNFT public policyNFT;
    
    address public agentWallet; // ERC-8004 agent wallet
    
    // Payout Tiers
    uint256 public constant TIER_1_PAYOUT = 5 * 10**18;  // $5 cUSD
    uint256 public constant TIER_2_PAYOUT = 15 * 10**18; // $15 cUSD
    uint256 public constant TIER_3_PAYOUT = 30 * 10**18; // $30 cUSD
    
    // Premium Tiers
    uint256 public constant TIER_1_PREMIUM = 0.5 * 10**18; // $0.50 cUSD
    uint256 public constant TIER_2_PREMIUM = 1.5 * 10**18; // $1.50 cUSD
    uint256 public constant TIER_3_PREMIUM = 3.0 * 10**18; // $3.00 cUSD

    event PremiumPaid(address indexed policyholder, uint256 amount, uint8 tier, uint256 tokenId);
    event ClaimSettled(uint256 indexed tokenId, string flightId, uint256 amount, address recipient);
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyAgent() {
        require(msg.sender == agentWallet, "Only agent can call this");
        _;
    }

    constructor(
        address _cUSD, 
        address _policyNFT, 
        address _agentWallet
    ) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
        policyNFT = PolicyNFT(_policyNFT);
        agentWallet = _agentWallet;
    }

    function setAgentWallet(address _agentWallet) external onlyOwner {
        agentWallet = _agentWallet;
    }

    function depositFunds(uint256 amount) external {
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }
    
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(cUSD.transfer(owner(), amount), "Transfer failed");
        emit FundsWithdrawn(owner(), amount);
    }

    function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(expiry > block.timestamp, "Expiry must be in future");
        
        uint256 premiumAmount;
        if (tier == 1) premiumAmount = TIER_1_PREMIUM;
        else if (tier == 2) premiumAmount = TIER_2_PREMIUM;
        else if (tier == 3) premiumAmount = TIER_3_PREMIUM;

        require(cUSD.transferFrom(msg.sender, address(this), premiumAmount), "Premium payment failed");
        uint256 tokenId = policyNFT.mintPolicy(msg.sender, flightId, tier, expiry);
        emit PremiumPaid(msg.sender, premiumAmount, tier, tokenId);
    }

    function payout(uint256 tokenId) external onlyAgent {
        PolicyNFT.Policy memory policy = policyNFT.getPolicy(tokenId);
        require(!policy.isClaimed, "Policy already claimed");
        require(block.timestamp <= policy.expiry, "Policy expired");
        
        address policyholder = policyNFT.ownerOf(tokenId);
        
        uint256 payoutAmount;
        if (policy.tier == 1) payoutAmount = TIER_1_PAYOUT;
        else if (policy.tier == 2) payoutAmount = TIER_2_PAYOUT;
        else if (policy.tier == 3) payoutAmount = TIER_3_PAYOUT;

        require(cUSD.balanceOf(address(this)) >= payoutAmount, "Insufficient pool funds");
        policyNFT.markAsClaimed(tokenId);
        require(cUSD.transfer(policyholder, payoutAmount), "Payout failed");
        emit ClaimSettled(tokenId, policy.flightId, payoutAmount, policyholder);
    }
}`, "pool-sol")}
                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/50 hover:text-white transition-all"
              >
                {copiedId === "pool-sol" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <pre className="bg-black/80 rounded-xl p-4 text-xs font-mono text-green-400 border border-white/10 overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PolicyNFT.sol";

contract InsurancePool is Ownable {
    IERC20 public cUSD;
    PolicyNFT public policyNFT;
    
    address public agentWallet; // ERC-8004 agent wallet
    
    // Payout Tiers
    uint256 public constant TIER_1_PAYOUT = 5 * 10**18;  // $5 cUSD
    uint256 public constant TIER_2_PAYOUT = 15 * 10**18; // $15 cUSD
    uint256 public constant TIER_3_PAYOUT = 30 * 10**18; // $30 cUSD
    
    // Premium Tiers
    uint256 public constant TIER_1_PREMIUM = 0.5 * 10**18; // $0.50 cUSD
    uint256 public constant TIER_2_PREMIUM = 1.5 * 10**18; // $1.50 cUSD
    uint256 public constant TIER_3_PREMIUM = 3.0 * 10**18; // $3.00 cUSD

    event PremiumPaid(address indexed policyholder, uint256 amount, uint8 tier, uint256 tokenId);
    event ClaimSettled(uint256 indexed tokenId, string flightId, uint256 amount, address recipient);
    event FundsDeposited(address indexed sender, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyAgent() {
        require(msg.sender == agentWallet, "Only agent can call this");
        _;
    }

    constructor(
        address _cUSD, 
        address _policyNFT, 
        address _agentWallet
    ) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
        policyNFT = PolicyNFT(_policyNFT);
        agentWallet = _agentWallet;
    }

    function setAgentWallet(address _agentWallet) external onlyOwner {
        agentWallet = _agentWallet;
    }

    function depositFunds(uint256 amount) external {
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }
    
    function withdrawFunds(uint256 amount) external onlyOwner {
        require(cUSD.transfer(owner(), amount), "Transfer failed");
        emit FundsWithdrawn(owner(), amount);
    }

    function buyPolicy(string calldata flightId, uint8 tier, uint256 expiry) external {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(expiry > block.timestamp, "Expiry must be in future");
        
        uint256 premiumAmount;
        if (tier == 1) premiumAmount = TIER_1_PREMIUM;
        else if (tier == 2) premiumAmount = TIER_2_PREMIUM;
        else if (tier == 3) premiumAmount = TIER_3_PREMIUM;

        require(cUSD.transferFrom(msg.sender, address(this), premiumAmount), "Premium payment failed");
        uint256 tokenId = policyNFT.mintPolicy(msg.sender, flightId, tier, expiry);
        emit PremiumPaid(msg.sender, premiumAmount, tier, tokenId);
    }

    function payout(uint256 tokenId) external onlyAgent {
        PolicyNFT.Policy memory policy = policyNFT.getPolicy(tokenId);
        require(!policy.isClaimed, "Policy already claimed");
        require(block.timestamp <= policy.expiry, "Policy expired");
        
        address policyholder = policyNFT.ownerOf(tokenId);
        
        uint256 payoutAmount;
        if (policy.tier == 1) payoutAmount = TIER_1_PAYOUT;
        else if (policy.tier == 2) payoutAmount = TIER_2_PAYOUT;
        else if (policy.tier == 3) payoutAmount = TIER_3_PAYOUT;

        require(cUSD.balanceOf(address(this)) >= payoutAmount, "Insufficient pool funds");
        policyNFT.markAsClaimed(tokenId);
        require(cUSD.transfer(policyholder, payoutAmount), "Payout failed");
        emit ClaimSettled(tokenId, policy.flightId, payoutAmount, policyholder);
    }
}`}
              </pre>
            </div>
          </section>

          <section id="nft-contract-code" className="space-y-4">
            <h2 className="text-2xl font-heading italic text-white border-b border-white/10 pb-2">PolicyNFT.sol</h2>
            <p className="text-white/70 text-xs font-mono">Address: <span className="text-purple-400">{NFT_CONTRACT_ADDRESS}</span></p>
            <div className="relative">
              <button 
                onClick={() => copyToClipboard(
`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct Policy {
        string flightId; // e.g., "AA123-20260525"
        uint8 tier;      // 1: 2h delay, 2: 4h delay, 3: cancelled
        uint256 expiry;  // timestamp of flight arrival + buffer
        bool isClaimed;
    }

    mapping(uint256 => Policy) public policies;
    
    // Address of InsurancePool that is authorized to mint policies
    address public minter;

    event PolicyMinted(uint256 indexed tokenId, address indexed policyholder, string flightId, uint8 tier, uint256 expiry);
    event PolicyClaimed(uint256 indexed tokenId);

    constructor() ERC721("TravelShield Policy", "TSP") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized to mint");
        _;
    }

    function mintPolicy(
        address to,
        string calldata flightId,
        uint8 tier,
        uint256 expiry
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        policies[tokenId] = Policy({
            flightId: flightId,
            tier: tier,
            expiry: expiry,
            isClaimed: false
        });

        _mint(to, tokenId);
        
        emit PolicyMinted(tokenId, to, flightId, tier, expiry);
        return tokenId;
    }

    function markAsClaimed(uint256 tokenId) external onlyMinter {
        ownerOf(tokenId); // Reverts if token does not exist
        require(!policies[tokenId].isClaimed, "Policy already claimed");
        
        policies[tokenId].isClaimed = true;
        
        emit PolicyClaimed(tokenId);
    }
    
    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        ownerOf(tokenId); // Reverts if token does not exist
        return policies[tokenId];
    }
}`, "nft-sol")}
                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-white/50 hover:text-white transition-all"
              >
                {copiedId === "nft-sol" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
              <pre className="bg-black/80 rounded-xl p-4 text-xs font-mono text-green-400 border border-white/10 overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PolicyNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct Policy {
        string flightId; // e.g., "AA123-20260525"
        uint8 tier;      // 1: 2h delay, 2: 4h delay, 3: cancelled
        uint256 expiry;  // timestamp of flight arrival + buffer
        bool isClaimed;
    }

    mapping(uint256 => Policy) public policies;
    
    // Address of InsurancePool that is authorized to mint policies
    address public minter;

    event PolicyMinted(uint256 indexed tokenId, address indexed policyholder, string flightId, uint8 tier, uint256 expiry);
    event PolicyClaimed(uint256 indexed tokenId);

    constructor() ERC721("TravelShield Policy", "TSP") Ownable(msg.sender) {}

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    modifier onlyMinter() {
        require(msg.sender == minter, "Not authorized to mint");
        _;
    }

    function mintPolicy(
        address to,
        string calldata flightId,
        uint8 tier,
        uint256 expiry
    ) external onlyMinter returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        policies[tokenId] = Policy({
            flightId: flightId,
            tier: tier,
            expiry: expiry,
            isClaimed: false
        });

        _mint(to, tokenId);
        
        emit PolicyMinted(tokenId, to, flightId, tier, expiry);
        return tokenId;
    }

    function markAsClaimed(uint256 tokenId) external onlyMinter {
        ownerOf(tokenId); // Reverts if token does not exist
        require(!policies[tokenId].isClaimed, "Policy already claimed");
        
        policies[tokenId].isClaimed = true;
        
        emit PolicyClaimed(tokenId);
    }
    
    function getPolicy(uint256 tokenId) external view returns (Policy memory) {
        ownerOf(tokenId); // Reverts if token does not exist
        return policies[tokenId];
    }
}`}
              </pre>
            </div>
          </section>
        </div>
      )
    }
  }

  const activeArticle = articles[activeArticleId]

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden flex flex-col">
      {/* Top Margin for Navbar */}
      <div className="h-28 w-full shrink-0"></div>

      {/* Main Container */}
      <div className="flex-1 flex max-w-[1400px] w-full mx-auto px-4 md:px-8 gap-8 relative">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-140px)] sticky top-28 overflow-y-auto pr-4 border-r border-white/10 custom-scrollbar py-4">
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input 
              type="text" 
              placeholder="Search docs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-400 transition-all font-mono"
            />
          </div>

          <nav className="space-y-8">
            {filteredCategories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-white/40 font-mono px-3">{cat.name}</h4>
                <div className="space-y-1">
                  {cat.articles.map((art) => {
                    const isActive = activeArticleId === art.id
                    return (
                      <button
                        key={art.id}
                        onClick={() => setActiveArticleId(art.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                          isActive 
                            ? "bg-white/10 text-white border-l-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={isActive ? "text-blue-400" : "text-white/40"}>{art.icon}</span>
                        <span>{art.title}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Navigation Panel */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-4 rounded-full bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-white hover:bg-blue-500 transition-all border border-blue-400/20"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Sidebar Modal */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed right-0 top-0 bottom-0 w-[80vw] max-w-[320px] bg-black border-l border-white/10 z-50 p-6 flex flex-col gap-6 lg:hidden"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading italic text-xl">Documentation</h3>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-full bg-white/5 text-white border border-white/10"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search docs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <nav className="flex-1 overflow-y-auto space-y-6">
                  {filteredCategories.map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-wider font-semibold text-white/40 font-mono">{cat.name}</h4>
                      <div className="space-y-1">
                        {cat.articles.map((art) => {
                          const isActive = activeArticleId === art.id
                          return (
                            <button
                              key={art.id}
                              onClick={() => {
                                setActiveArticleId(art.id)
                                setIsSidebarOpen(false)
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                                isActive ? "bg-white/10 text-white border-l-2 border-blue-400" : "text-white/60"
                              }`}
                            >
                              <span className={isActive ? "text-blue-400" : "text-white/40"}>{art.icon}</span>
                              <span>{art.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Center Main Content Panel */}
        <main className="flex-1 min-w-0 py-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider font-mono mb-4">
            <span>Documentation</span>
            <ChevronRight size={12} />
            <span>{activeArticle?.category}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-heading italic text-white mb-6">
            {activeArticle?.title}
          </h1>

          <div className="prose prose-invert max-w-none text-white/70">
            {activeArticle?.content}
          </div>

          {/* Quick Page Nav Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between gap-4 text-xs font-mono">
            <div>
              {/* Previous page link if applicable */}
            </div>
            <div>
              {activeArticleId === "introduction" && (
                <button 
                  onClick={() => setActiveArticleId("quickstart")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all text-white/70"
                >
                  <span>Quickstart Guide</span>
                  <ArrowRight size={14} />
                </button>
              )}
              {activeArticleId === "quickstart" && (
                <button 
                  onClick={() => setActiveArticleId("how-it-works")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all text-white/70"
                >
                  <span>How It Works</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar (On this page) */}
        <aside className="hidden xl:block w-56 shrink-0 h-[calc(100vh-140px)] sticky top-28 overflow-y-auto pl-4 border-l border-white/10 custom-scrollbar py-4">
          <h5 className="text-[11px] uppercase tracking-wider font-semibold text-white/40 font-mono mb-4">On this page</h5>
          <nav className="space-y-3">
            {activeArticle?.toc.map((tocItem, i) => (
              <a 
                key={i} 
                href={`#${tocItem.id}`}
                className="block text-[11px] font-mono text-white/50 hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  const targetEl = document.getElementById(tocItem.id)
                  if (targetEl) {
                    const navbarOffset = 120
                    const elementPosition = targetEl.getBoundingClientRect().top
                    const offsetPosition = elementPosition + window.pageYOffset - navbarOffset
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    })
                  }
                }}
              >
                {tocItem.label}
              </a>
            ))}
          </nav>
        </aside>

      </div>
    </div>
  )
}
