import { NextResponse } from 'next/server';

// Simulated FX rates for hackathon demo
// In production, these would come from CoinGecko, Mento, or a real FX oracle
const BASE_RATES: Record<string, { rate: number, symbol: string, name: string, flag: string, volatility: number }> = {
  NGN: { rate: 1580.0, symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬', volatility: 0.08 },
  KES: { rate: 129.5, symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪', volatility: 0.04 },
  ARS: { rate: 1185.0, symbol: '$', name: 'Argentine Peso', flag: '🇦🇷', volatility: 0.12 },
  TRY: { rate: 38.2, symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', volatility: 0.06 },
  EGP: { rate: 50.8, symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', volatility: 0.07 },
  ZAR: { rate: 18.3, symbol: 'R', name: 'South African Rand', flag: '🇿🇦', volatility: 0.05 },
  INR: { rate: 84.5, symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', volatility: 0.03 },
  BRL: { rate: 5.8, symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', volatility: 0.05 },
};

function generateHistoricalData(baseRate: number, volatility: number, days: number = 30) {
  const data = [];
  let currentRate = baseRate * (1 - volatility * 0.5); // Start lower
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random walk with upward bias (currency weakening)
    const change = (Math.random() - 0.45) * volatility * baseRate * 0.02;
    currentRate = Math.max(currentRate + change, baseRate * 0.8);
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(currentRate.toFixed(2)),
    });
  }
  
  // Ensure last data point matches base rate
  data[data.length - 1].rate = baseRate;
  
  return data;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get('currency')?.toUpperCase();

    if (currency && BASE_RATES[currency]) {
      const currencyData = BASE_RATES[currency];
      const history = generateHistoricalData(currencyData.rate, currencyData.volatility);
      const weekAgoRate = history[history.length - 8]?.rate || currencyData.rate;
      const weekChange = ((currencyData.rate - weekAgoRate) / weekAgoRate * 100);
      
      return NextResponse.json({
        success: true,
        currency,
        ...currencyData,
        currentRate: currencyData.rate,
        weeklyChange: parseFloat(weekChange.toFixed(2)),
        history,
        hedgeRecommendation: weekChange > 2 ? 'STRONG_HEDGE' : weekChange > 0.5 ? 'MODERATE_HEDGE' : 'HOLD',
      });
    }

    // Return all currencies overview
    const overview = Object.entries(BASE_RATES).map(([code, data]) => {
      const history = generateHistoricalData(data.rate, data.volatility);
      const weekAgoRate = history[history.length - 8]?.rate || data.rate;
      const weekChange = ((data.rate - weekAgoRate) / weekAgoRate * 100);
      
      return {
        code,
        ...data,
        currentRate: data.rate,
        weeklyChange: parseFloat(weekChange.toFixed(2)),
      };
    });

    return NextResponse.json({ success: true, currencies: overview });

  } catch (error) {
    console.error("FX Rates Error:", error);
    return NextResponse.json({ error: "Failed to fetch FX rates" }, { status: 500 });
  }
}
