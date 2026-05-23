import { NextResponse } from 'next/server';

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flightId = searchParams.get('flightId');

    if (!flightId) {
      return NextResponse.json({ error: "Missing flightId parameter" }, { status: 400 });
    }

    const flightRes = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&flight_iata=${flightId}`, {
      next: { revalidate: 30 }
    });
    
    const flightData = await flightRes.json();

    if (flightData.error) {
      return NextResponse.json({ error: flightData.error.message || "AviationStack API Error" }, { status: 400 });
    }

    if (!flightData || !flightData.data || flightData.data.length === 0) {
      return NextResponse.json({ error: "Flight not found in real-time AviationStack database. Please verify the IATA flight number (e.g. BA12 or AA2651)." }, { status: 404 });
    }

    const flight = flightData.data[0];

    return NextResponse.json({
      success: true,
      flight: {
        airline: flight.airline?.name || "Unknown Airline",
        status: flight.flight_status || "Unknown",
        departureIata: flight.departure?.iata || "N/A",
        arrivalIata: flight.arrival?.iata || "N/A",
        scheduledTime: flight.departure?.scheduled || null,
        date: flight.flight_date || null
      }
    });

  } catch (error) {
    console.error("Flight Search Error:", error);
    return NextResponse.json({ error: "Failed to connect to AviationStack server." }, { status: 500 });
  }
}
