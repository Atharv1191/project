require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

app.post("/analyse", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === "") {
    return res.status(400).json({ error: "Transcript is required" });
  }

  try {
    const prompt = `
You are a sales coach AI. Analyse the following sales call transcript and detect signals.

For each signal found, return:
- type: one of "buying_interest", "objection", "confusion", "stall"
- quote: the exact words from the transcript that show this signal
- tip: a one-line coaching tip for the sales rep

Return ONLY a valid JSON object in this exact format, no extra text, no markdown:
{
  "signals": [
    {
      "type": "buying_interest",
      "quote": "exact quote here",
      "tip": "coaching tip here"
    }
  ]
}

Transcript:
${transcript}
`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    const text = response.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Something went wrong. Check your API key or try again." });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "NimitAI backend is running" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});