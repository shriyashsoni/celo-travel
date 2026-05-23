async function main() {
  const flightId = process.argv[2] || "AA2651";
  const key = "7be27e3889383b804f998f3c44d2a191";
  const url = `http://api.aviationstack.com/v1/flights?access_key=${key}&flight_iata=${flightId}`;
  
  console.log("Fetching:", url);
  const res = await fetch(url);
  const data = await res.json();
  
  if (data.error) {
    console.error("API Error:", data.error);
  } else if (data.data && data.data.length > 0) {
    console.log("Found flight:", data.data[0].airline.name, data.data[0].flight_status);
  } else {
    console.log("Flight not found in AviationStack.");
  }
}
main();
