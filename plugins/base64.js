const { cmd } = require("../command");

cmd(
  {
    pattern: "base64",
    alias: ["b64"],
    react: "🔤",
    desc: "Encode text to Base64 or decode Base64 to text",
    category: "utilities",
    filename: __filename,
  },
  async (dilshan, mek, m, { q, reply }) => {
    if (!q) return reply("📝 *Please provide text or Base64 string.*");

    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(q.replace(/\s/g, ''));

    try {
      if (isBase64) {
        const buff = Buffer.from(q, 'base64');
        const decoded = buff.toString('utf-8');
        await reply(`📥 *Decoded Text:*\n\n${decoded}`);
      } else {
        const buff = Buffer.from(q, 'utf-8');
        const encoded = buff.toString('base64');
        await reply(`📤 *Encoded Base64:*\n\n${encoded}`);
      }
    } catch (err) {
      console.error(err);
      reply("❌ *Invalid Base64 or text input.*");
    }
  }
);
