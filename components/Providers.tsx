"use client";

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { BOT_CHAIN } from "@/lib/bot-chain";

const botChain = {
  id: BOT_CHAIN.id,
  name: BOT_CHAIN.name,
  nativeCurrency: BOT_CHAIN.nativeCurrency,
  rpcUrls: { default: { http: [BOT_CHAIN.rpcUrl] }, public: { http: [BOT_CHAIN.rpcUrl] } },
  blockExplorers: { default: { name: "BOTScan", url: BOT_CHAIN.explorerUrl } },
} as const;

const config = getDefaultConfig({
  appName: "TravelShield",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "19fbff16f1c337b469d8bb8e3ae6ed9f", 
  chains: [botChain],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#7342E2", borderRadius: "medium" })}>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
