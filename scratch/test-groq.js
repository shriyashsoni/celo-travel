import dotenv from "dotenv";
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function main() {
  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not defined in .env");
    process.exit(1);
  }

  console.log("Testing Groq API key...");
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: "Hello! Say test." }],
        temperature: 0.7,
        max_tokens: 10,
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Success! Response:", data.choices[0].message.content);
    } else {
      const err = await res.text();
      console.error("Failed! Status:", res.status, "Error:", err);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

main();
