import { NextResponse } from 'next/server';

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flightIata = searchParams.get('flightId');

    if (!flightIata) {
      return NextResponse.json({ error: "Missing flightId parameter" }, { status: 400 });
    }

    const flightRes = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&flight_iata=${flightIata}`);
    const flightData = await flightRes.json();

    if (!flightData || !flightData.data || flightData.data.length === 0) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    const flight = flightData.data[0];

    return NextResponse.json({
      success: true,
      flight: {
        date: flight.flight_date,
        status: flight.flight_status,
        airline: flight.airline?.name || 'Unknown Airline',
        departure: {
          airport: flight.departure?.airport,
          iata: flight.departure?.iata,
          scheduled: flight.departure?.scheduled,
          estimated: flight.departure?.estimated,
          delay: flight.departure?.delay || 0
        },
        arrival: {
          airport: flight.arrival?.airport,
          iata: flight.arrival?.iata,
          scheduled: flight.arrival?.scheduled,
          estimated: flight.arrival?.estimated,
        }
      }
    });

  } catch (error) {
    console.error("Flight Search Error:", error);
    return NextResponse.json({ error: "Failed to search flight data" }, { status: 500 });
  }
}
