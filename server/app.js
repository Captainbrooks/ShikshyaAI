import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("ShikshyaAI backend is running");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Expecting array of messages from frontend

    if (!messages || !messages.length)
      return res.status(400).json({ error: "No messages sent" });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "You are a friendly Nepali-English AI tutor. Always answer in simple Nepali-English mix. Use code blocks for code." },
        ...messages,
      ],
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`ShikshyaAI server running on port ${PORT}`);
});
