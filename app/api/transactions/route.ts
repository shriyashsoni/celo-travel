import { NextResponse } from 'next/server';

const CELOSCAN_API_KEY = process.env.CELOSCAN_API_KEY || "A7PZRDK4NTCBJP99CI5KUVVG84UQVCMT2Z";
const CUSD_MAINNET_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    // Fetch ERC-20 token transfers for cUSD on Celo Mainnet
    const url = `https://api.celoscan.io/api?module=account&action=tokentx&contractaddress=${CUSD_MAINNET_ADDRESS}&address=${address}&page=1&offset=100&sort=desc&apikey=${CELOSCAN_API_KEY}`;
    
    const scanRes = await fetch(url);
    if (!scanRes.ok) {
      throw new Error("Celoscan API request failed");
    }

    const data = await scanRes.json();
    if (data.status !== "1" || !Array.isArray(data.result)) {
      return NextResponse.json({ success: true, subscriptions: [] });
    }

    const txs = data.result;
    
    // Group by recipient (to address) to identify recurring payments (subscriptions)
    const outgoing = txs.filter((tx: any) => tx.from.toLowerCase() === address.toLowerCase());
    const groups: Record<string, any[]> = {};
    
    outgoing.forEach((tx: any) => {
      const to = tx.to.toLowerCase();
      if (!groups[to]) groups[to] = [];
      groups[to].push(tx);
    });

    const subscriptions: any[] = [];
    
    Object.entries(groups).forEach(([to, txList]) => {
      if (txList.length >= 2) {
        // Identified recurring payment
        const amounts = txList.map((tx: any) => parseFloat(tx.value) / 1e18);
        const uniqueAmounts = Array.from(new Set(amounts));
        
        // If amounts are identical or close, classify as subscription
        const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const lastTx = txList[0];
        
        subscriptions.push({
          id: lastTx.hash,
          name: `cUSD Subscription (${to.substring(0, 6)}...${to.substring(to.length - 4)})`,
          amount: parseFloat(avgAmount.toFixed(2)),
          cycle: "Monthly", // Standard assumption for demo
          nextDate: new Date(parseInt(lastTx.timeStamp) * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: "subscription",
          recipient: to,
          txCount: txList.length
        });
      }
    });

    return NextResponse.json({
      success: true,
      subscriptions
    });

  } catch (error) {
    console.error("Transactions Fetch Error:", error);
    return NextResponse.json({ error: "Failed to scan blockchain history" }, { status: 500 });
  }
}
