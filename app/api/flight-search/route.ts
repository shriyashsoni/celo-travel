import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flightId = searchParams.get('flightId');

    if (!flightId) {
      return NextResponse.json({ error: "Missing flightId parameter" }, { status: 400 });
    }

    const statesRes = await fetch("https://opensky-network.org/api/states/all", {
      next: { revalidate: 60 } // Cache for 60 seconds to avoid rate limits
    });
    const statesData = await statesRes.json();

    if (!statesData || !statesData.states) {
      return NextResponse.json({ error: "No flight data available" }, { status: 404 });
    }

    const flightState = statesData.states.find((s: any) => s[1] && s[1].trim().toUpperCase() === flightId.toUpperCase());

    if (!flightState) {
      return NextResponse.json({ error: "Flight not found in live tracking. It may not be airborne." }, { status: 404 });
    }

    // OpenSky State Vector Index Mapping:
    // 0: icao24, 1: callsign, 2: origin_country, 7: baro_altitude, 8: on_ground, 9: velocity
    const altitude = flightState[7] !== null ? Math.round(flightState[7]) : 0;
    const velocityMs = flightState[9] !== null ? flightState[9] : 0;
    const velocityKmh = Math.round(velocityMs * 3.6);

    return NextResponse.json({
      success: true,
      flight: {
        airline: flightState[1].trim(), // callsign
        status: flightState[8] ? 'Grounded' : 'Airborne',
        country: flightState[2],
        altitude: `${altitude} meters`,
        velocity: `${velocityKmh} km/h`,
        icao24: flightState[0]
      }
    });

  } catch (error) {
    console.error("Flight Search Error:", error);
    return NextResponse.json({ error: "Failed to search live flight data" }, { status: 500 });
  }
}
