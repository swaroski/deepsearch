const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { topic } = req.body;
  console.log("Generating for topic:", topic);

  try {
    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          {
            role: "user",
            content: `Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions...`,
          }
        ]
      }),
    });

    const data = await openrouterRes.json();
    const text = data?.choices?.[0]?.message?.content || "No response";

    const questions = text.split(/\n+/).filter(Boolean); // crude question split
    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate questions" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
