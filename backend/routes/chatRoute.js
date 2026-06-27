import express from "express";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("GROQ KEY:", process.env.GROQ_API_KEY);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for NearServe — a hyperlocal services marketplace in Nanded and Mumbai. You help users find vendors, understand the booking process, and answer questions about services like cleaning, plumbing, cooking, salon, laundry and AC repair. Keep answers short and friendly."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Groq response:", JSON.stringify(data));
  const reply = data.choices[0].message.content;
  res.json({ reply });
});

export default router;