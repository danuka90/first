const { cmd } = require("../command");
const yts = require("yt-search");

cmd(
  {
    pattern: "yts",
    alias: ["youtubesearch"],
    react: "🔎",
    desc: "Search YouTube videos",
    category: "search",
    filename: __filename,
  },
  async (dilshan, mek, m, { from, quoted, q, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a search query!* 🔍");

      await dilshan.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      const search = await yts(q);
      if (!search || !search.videos || search.videos.length === 0) {
        return reply("❌ *No results found on YouTube.*");
      }

      const results = search.videos.slice(0, 10);
      const first = results[0]; 

      const resultList = results.map((v, i) => (
`╭─❰ 🎬 *${i + 1}. ${v.title}* ❱
│ ⏱️ Duration: ${v.timestamp}
│ 📅 Uploaded: ${v.ago}
│ 👁️ Views: ${v.views.toLocaleString()}
│ 🔗 ${v.url}
╰───────────────⭓`)
      ).join("\n\n");

      const caption = `
╭━━━❰ 🔍 *YOUTUBE SEARCH* ❱━━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃───────────────────────
┃ 🔎 *Query:* ${q}
┃───────────────────────
${resultList}
┃───────────────────────
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await dilshan.sendMessage(
        from,
        {
          image: { url: first.thumbnail },
          caption,
        },
        { quoted: mek }
      );

      await dilshan.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (err) {
      console.error("❌ YTS Error:", err);
      reply("❌ *An error occurred while searching YouTube.*");
    }
  }
);
