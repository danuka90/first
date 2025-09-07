const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "tts",
    alias: ["speak", "say"],
    react: "🗣️",
    desc: "Convert text to Sinhala voice",
    category: "tools",
    filename: __filename,
  },
  async (
    dilshan,
    mek,
    m,
    {
      from,
      quoted,
      q,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*Please provide text to convert into Sinhala speech!* 🎤");

      const text = q;
      const lang = "si";

      if (text.length > 200) {
        return reply("*Text too long! Please limit to 200 characters.* ❌");
      }

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${lang}&client=tw-ob`;

      const response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        },
      });

      await dilshan.sendMessage(
        from,
        {
          audio: Buffer.from(response.data),
          mimetype: "audio/mpeg",
          ptt: true,
        },
        { quoted: mek }
      );

      return reply(`*✅ Text successfully converted to Sinhala speech!*`);
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
