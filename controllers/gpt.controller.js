const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    handleGPTRequest: async (req, res) => {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4.1",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            });

            const reply = response.choices[0].message.content.trim();
            res.json({ reply });
        } catch (err) {
            console.error("GPT error:", err?.response?.data || err.message);
            res.status(500).json({ error: "GPT request failed" });
        }
    },
};
