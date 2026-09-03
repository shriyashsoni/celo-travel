"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User, RefreshCcw } from "lucide-react";
import { useAccount } from "wagmi";
import { DashboardShell } from "@/components/DashboardShell";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function AgentPage() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am TravelShield AI, your conversational DeFi agent on BOT Chain. I can help you mint travel insurance, save for your next trip, hedge against currency devaluation, or manage your stablecoin portfolio. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting right now. Please try again later." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "An error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-body overflow-x-hidden">
      <main className="flex-1 pt-32 pb-20 px-6 sm:px-8 max-w-4xl mx-auto w-full relative z-10 flex flex-col h-[calc(100vh-80px)]">
        
        <div className="text-center mb-8">
          <div className="liquid-glass rounded-full px-4 py-1.5 inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-yellow-400" size={16} />
            <span className="text-xs font-semibold tracking-wider uppercase">DeFAI Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading italic mb-4">
            Conversational Agent
          </h1>
          <p className="text-white/60 font-light mb-6">
            Ask me to buy policies, swap cUSD, check yields, or hedge your local currency.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="https://8004scan.io" 
              target="_blank" 
              rel="noreferrer"
              className="liquid-glass px-4 py-2 rounded-full border border-purple-500/30 text-purple-400 hover:border-purple-500/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
            >
              <Sparkles size={14} className="text-purple-400 shrink-0" /> View Agent on 8004scan.io
            </a>
            <a 
              href="https://docs.self.xyz/agent-id" 
              target="_blank" 
              rel="noreferrer"
              className="liquid-glass px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <Sparkles size={14} className="text-emerald-400 shrink-0" /> Register Self Agent ID (ERC-8004)
            </a>
          </div>
        </div>

        <div className="liquid-glass rounded-3xl flex-1 overflow-hidden flex flex-col border border-white/10 relative">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${
                  msg.role === 'user' 
                    ? 'bg-white text-black border-transparent' 
                    : 'liquid-glass-strong border-purple-500/30 text-purple-400'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-white text-black rounded-tr-sm'
                    : 'liquid-glass border border-white/5 text-white/90 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-full liquid-glass-strong flex items-center justify-center border border-purple-500/30 text-purple-400">
                  <RefreshCcw size={18} className="animate-spin" />
                </div>
                <div className="liquid-glass rounded-2xl rounded-tl-sm p-4 border border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/40 border-t border-white/10 relative z-10 backdrop-blur-md">
            {!isConnected && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                <p className="text-white/60 text-sm">Please connect your wallet to use the AI Agent.</p>
              </div>
            )}
            <form onSubmit={sendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message TravelShield AI..."
                className="w-full liquid-glass border border-white/10 rounded-full py-4 pl-6 pr-16 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                disabled={!isConnected || isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || !isConnected || isLoading}
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-white text-black flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} className="mr-0.5 mt-0.5" />
              </button>
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}
