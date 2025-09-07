const fetch = require("node-fetch");
const { cmd } = require("../command");

const pendingTiktok = {}; 

cmd(
  {
    pattern: "tiktoksearch",
    react: "📱",
    desc: "Search TikTok videos by keyword and download selected result.",
    category: "download",
    filename: __filename,
  },
  async (dilshan, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a search keyword.*\n\n💡 Example: `.tiktoksearch dance`");

      await dilshan.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      const response = await fetch(`https://api.diioffc.web.id/api/search/tiktok?query=${encodeURIComponent(q)}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      if (!data || !data.status || !data.result || data.result.length === 0) {
        return reply("❌ No TikTok results found. Try another keyword.");
      }

      const results = data.result.slice(0, 7);

      pendingTiktok[sender] = results;

      const resultList = results.map((v, i) => (
`╭─❰ 🎬 *${i + 1}. Title:* ${v.title || "No title"} ❱
│ 👤 *Author:* ${v.author?.name || "Unknown"} (@${v.author?.username || "?"})
│ ⏱️ *Duration:* ${v.duration || "?"}s
│ ❤️ *Likes:* ${v.stats?.like || 0}
│ ▶️ *Plays:* ${v.stats?.play || 0}
╰───────────────⭓`
)).join("\n\n");

      const caption = `
╭━━━❰ 📱 *TIKTOK SEARCH* ❱━━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃───────────────────────
┃ 🔎 *Query:* ${q}
┃───────────────────────
${resultList}
┃───────────────────────
┃ 💡 Reply with a *number* (1-${results.length}) to download
╰━━━━━━━━━━━━━━━━━━━━━━━╯

⚡ Powered by: *Dilshan Chanushka*
`;

      await dilshan.sendMessage(
        from,
        {
          image: { url: results[0].cover || results[0].origin_cover || "https://github.com/danukaya123/firstcus/blob/main/images/Dilshan-MD.png?raw=true" },
          caption,
        },
        { quoted: mek }
      );

      await dilshan.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (e) {
      console.log("TikTok Search Error:", e);
      reply("❌ *Error:* " + e.message);
    }
  }
);

cmd(
  {
    filter: (text, { sender }) => {
      return pendingTiktok[sender] && /^[1-7]$/.test(text.trim());
    },
  },
  async (dilshan, mek, m, { from, body, sender, reply }) => {
    const selected = parseInt(body.trim()) - 1;
    const results = pendingTiktok[sender];
    const video = results[selected];
    delete pendingTiktok[sender]; // Clear cache

    if (!video) return reply("❌ Invalid selection.");

    const caption = `
╭━━❰ 📥 *TIKTOK DOWNLOAD* ❱━━╮
┃ 🎬 *Title:* ${video.title || "TikTok Video"}
┃ ───────────────────────
┃ 👤 *Author:* ${video.author?.name || "Unknown"} (@${video.author?.username || "?"})
┃ ⏱️ *Duration:* ${video.duration || 0}s
┃ ❤️ *Likes:* ${video.stats?.like || 0}
┃ ▶️ *Plays:* ${video.stats?.play || 0}
┃ 🔗 *Link:* https://www.tiktok.com/@${video.author?.username}/video/${video.video_id}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

⚡ Powered by: *Dilshan Chanushka*
`;

    if (video.media?.no_watermark) {
      await dilshan.sendMessage(from, { react: { text: "📥", key: m.key } });
      await dilshan.sendMessage(
        from,
        {
          video: { url: video.media.no_watermark },
          caption,
        },
        { quoted: mek }
      );
    } else {
      reply("⚠️ Failed to fetch TikTok video.");
    }
  }
);
