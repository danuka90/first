const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "ai",
  desc: "Chat with an AI model",
  category: "ai",
  react: '🤖',
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) return reply("❗Please provide a prompt.\nExample: `.ai What is quantum physics?`");

    const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
    const res = await axios.get(apiUrl, { timeout: 15000 });

    const message = res?.data?.message;
    if (!message) return reply("⚠️ AI didn't return a valid response. Try again later.");

    await reply(`🤖 *AI Response:*\n\n${message.trim()}`);

  } catch (err) {
    console.error("AI Plugin Error:", err.message || err);
    reply("❌ An unexpected error occurred. Try again shortly.");
  }
});
