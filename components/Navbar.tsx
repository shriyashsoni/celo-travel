"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useAccount } from "wagmi";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const wasConnected = useRef(false);

  useEffect(() => {
    if (isConnected && !wasConnected.current) {
      // Just connected
      wasConnected.current = true;
      if (pathname !== "/admin") {
        router.push("/admin");
      }
    } else if (!isConnected) {
      wasConnected.current = false;
    }
  }, [isConnected, router, pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Buy Policy", href: "/buy-policy" },
    { name: "My Policies", href: "/policies" },
    { name: "AI Agent", href: "/agent" },
    { name: "Savings", href: "/savings" },
    { name: "Autopay", href: "/autopay" },
    { name: "FX Shield", href: "/fx-shield" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-6">
        <div className="flex items-center justify-between w-full max-w-7xl">
          {/* Left Side: Logo (flex-1 to balance right side) */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden liquid-glass flex items-center justify-center p-1">
                <img src="/logo.png" alt="TravelShield Logo" className="w-full h-full object-cover rounded-full" />
              </div>
            </Link>
          </div>
          
          {/* Center: Navigation Pill */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <div className="flex items-center gap-8 liquid-glass rounded-full px-8 py-3">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Wallet & Mobile Menu (flex-1 to balance left side) */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {isConnected && (
                <Link 
                  href="/admin" 
                  className="liquid-glass-strong px-5 py-2.5 rounded-full text-sm font-medium text-white hover:text-yellow-400 hover:border-yellow-400 transition-all border border-transparent whitespace-nowrap"
                >
                  Dashboard
                </Link>
              )}
              <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-3 rounded-full liquid-glass text-white"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex flex-col w-[80vw] max-w-[320px] h-[100dvh] bg-black border-l border-white/10"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-heading italic text-2xl text-white">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 object-cover rounded-full" />
                  TravelShield
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full liquid-glass text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col p-6 gap-6 flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="text-xl font-heading italic text-white/80 hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 border-t border-white/10 flex flex-col items-center justify-center gap-3 mt-auto w-full">
                {isConnected && (
                  <Link
                    href="/admin"
                    className="w-full text-center liquid-glass-strong px-5 py-3 rounded-full text-sm font-medium text-white hover:text-yellow-400 mb-2 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
