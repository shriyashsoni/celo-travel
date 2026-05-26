import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function getActiveFlights() {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_status=active&limit=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data) {
      console.log("Here are some currently active flights you can search:");
      data.data.forEach(flight => {
        if (flight.flight && flight.flight.iata) {
          console.log(`Flight Number: ${flight.flight.iata} | Airline: ${flight.airline.name} | From: ${flight.departure.iata} To: ${flight.arrival.iata}`);
        }
      });
    } else {
      console.log("Error or no data:", data);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

getActiveFlights();
