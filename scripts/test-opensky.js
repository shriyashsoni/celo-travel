async function main() {
  const flightNumber = process.argv[2] || "SWA3325"; // Example callsign

  console.log("Fetching all states...");
  const statesRes = await fetch("https://opensky-network.org/api/states/all");
  const statesData = await statesRes.json();

  if (!statesData.states) {
    console.log("No states returned");
    return;
  }

  const flightState = statesData.states.find(s => s[1] && s[1].trim().toUpperCase() === flightNumber.toUpperCase());

  if (!flightState) {
    console.log("Flight not found in live states for callsign:", flightNumber);
    return;
  }

  const icao24 = flightState[0];
  console.log("Found flight! ICAO24:", icao24, "Callsign:", flightState[1].trim());
  console.log("Country:", flightState[2], "Alt:", flightState[7], "Velocity:", flightState[9]);

  // Now fetch flights for this aircraft
  const now = Math.floor(Date.now() / 1000);
  const twoDaysAgo = now - (2 * 24 * 60 * 60);

  console.log(`Fetching flights for aircraft ${icao24} from ${twoDaysAgo} to ${now}...`);
  const flightRes = await fetch(`https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${twoDaysAgo}&end=${now}`);
  
  if (flightRes.ok) {
    const flights = await flightRes.json();
    if (flights && flights.length > 0) {
      const recentFlight = flights[0]; // First one might be oldest or newest, need to check
      console.log("Recent flight data:", recentFlight);
    } else {
      console.log("No flight history found for this aircraft.");
    }
  } else {
    console.log("Failed to fetch aircraft flights:", flightRes.status);
  }
}

main();
