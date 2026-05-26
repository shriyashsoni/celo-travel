import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are TravelShield AI — an intelligent, conversational DeFi agent built on the Celo blockchain. You help users with:

1. **Travel Insurance**: Explain policy tiers, help users choose coverage, check claim status
2. **Savings Goals**: Help users set and track cUSD savings goals for their trips
3. **DeFi Operations**: Guide users through swaps (cUSD ↔ CELO), lending on Aave, and stablecoin management
4. **FX Hedging**: Advise on protecting travel funds from local currency devaluation
5. **Bill Pay**: Help schedule recurring payments and manage subscriptions

Key facts about TravelShield:
- Policies are NFTs minted on Celo Sepolia testnet
- Premiums: Tier 1 (>1min delay) = 0.50 cUSD, Tier 2 (>5min delay) = 1.50 cUSD, Tier 3 (Cancellation) = 3.00 cUSD  
- Payouts: Tier 1 = $5, Tier 2 = $15, Tier 3 = $30
- Settlement token: cUSD (Celo Dollar)
- AI Oracle uses AviationStack + Groq LLM for autonomous claim processing
- Pool contract: 0x89FDD0Ad4bd2B2c48ECB39A6f636Af000F56Abe6
- Policy NFT: 0xb37d83B8f7260b83aAc7013c2c09b329eE37986C

When users ask to perform actions, provide clear step-by-step guidance. Be concise, friendly, and knowledgeable. Use emoji sparingly. Format responses in markdown when helpful.

If a user asks something outside your scope, politely redirect them to relevant TravelShield features.`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing messages array" }, { status: 400 });
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const groqMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-10) // Keep last 10 messages for context window
    ];

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!groqRes.ok) {
      const errorData = await groqRes.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const reply = groqData.choices[0].message.content;

    return NextResponse.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Agent Chat Error:", error);
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 });
  }
}
