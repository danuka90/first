const { cmd } = require("../command");
const axios = require("axios");

const API_BASE = "https://ai-proxy-server-smoky.vercel.app/";

cmd(
  {
    pattern: "gemini",
    react: "✨",
    desc: "Chat with Gemini AI",
    category: "ai",
    filename: __filename,
  },
  async (dilshan, mek, m, { from, q, reply }) => {
    if (!q) return reply("❌ Provide a query or prompt.");

    try {
      const payload = { query: q };
      const res = await axios.post(`${API_BASE}/gemini`, payload);

      await dilshan.sendMessage(from, { text: res.data.answer || "❌ No response" }, { quoted: mek });
    } catch (err) {
      console.error("Gemini Error:", err.message);
      reply("❌ Failed to fetch response from GEMINI.");
    }
  }
);
