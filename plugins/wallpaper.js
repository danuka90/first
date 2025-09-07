const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "wall",
    alias: ["wallpaper"],
    react: "🖼️",
    desc: "Download HD Wallpapers",
    category: "download",
    filename: __filename,
  },
  async (
    dilshan,
    mek,
    m,
    {
      from,
      q,
      reply,
    }
  ) => {
    try {
      if (!q) return reply("*🖼️ Please enter a keyword to search HD wallpapers!*");

      reply("*🔍 Searching for HD wallpapers... Please wait a moment.*");

      const res = await axios.get(`https://wallhaven.cc/api/v1/search?q=${encodeURIComponent(q)}&sorting=random&resolutions=1920x1080,2560x1440,3840x2160`);
      const wallpapers = res.data.data;

      if (!wallpapers || wallpapers.length === 0) {
        return reply("*❌ No HD wallpapers found for that keyword.*");
      }

      const selected = wallpapers.slice(0, 5); // get top 5

      const header = `
╭━━❰ 🎨 *WALL DOWNLOADER* ❱━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃────────────────────────
┃ 🖼️ *Search:* ${q}
┃ 🎯 *Results:* ${selected.length} HD Wallpapers
┃
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`;

      await dilshan.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/danukaya123/firstcus/blob/main/images/Dilshan-MD.png?raw=true",
          },
          caption: header,
        },
        { quoted: mek }
      );

      for (const wallpaper of selected) {
        const caption = `
📥 *Resolution:* ${wallpaper.resolution}
🔗 *Link:* ${wallpaper.url}
`;

        await dilshan.sendMessage(
          from,
          {
            image: { url: wallpaper.path },
            caption,
          },
          { quoted: mek }
        );
      }

      return reply("*🌟 Enjoy your HD wallpapers! Thank you for using DANUWA-MD.*");
    } catch (e) {
      console.error(e);
      reply(`*❌ Error:* ${e.message || e}`);
    }
  }
);
