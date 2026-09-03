export const BOT_CHAIN = {
  id: 677,
  name: "BOT Chain",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrl: process.env.NEXT_PUBLIC_BOT_CHAIN_RPC || "https://rpc.botchain.ai",
  explorerUrl: process.env.NEXT_PUBLIC_BOT_CHAIN_EXPLORER || "https://scan.botchain.ai",
  explorerApiUrl: process.env.NEXT_PUBLIC_BOT_CHAIN_EXPLORER_API || "https://scan.botchain.ai/api",
  tokenAddress: (process.env.NEXT_PUBLIC_CUSD_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
} as const