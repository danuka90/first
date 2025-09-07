const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "apk",
    alias: [],
    react: "📍",
    desc: "Download your favourite apk",
    category: "download",
    filename: __filename,
  },
  async (dilshan, mek, m, { q, reply, from }) => {
    try {
      if (!q) return reply("❌ *Please provide an app name to search!*");

      await dilshan.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
      const { data } = await axios.get(apiUrl);

      if (!data?.datalist?.list?.length) {
        return reply("⚠️ *No apps found with the given name.*");
      }

      const app = data.datalist.list[0];
      const appSize = (app.size / 1048576).toFixed(2); 
      
      const caption = `
╭━━━❰ 📱 *APK DOWNLOADER* ❱━━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃────────────────────────
┃ 📱 *Name:* ${app.name}
┃ 📦 *Size:* ${appSize} MB
┃ 📦 *Package:* ${app.package}
┃ 🕒 *Updated:* ${app.updated}
┃ 👤 *Developer:* ${app.developer.name}
┃────────────────────────
┃ ❤️ Download your favorite APKs!
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯`;

      await dilshan.sendMessage(
        from,
        {
          image: { url: app.icon },
          caption: caption,
        },
        { quoted: mek }
      );

      await dilshan.sendMessage(
        from,
        {
          document: { url: app.file.path_alt },
          fileName: `${app.name}.apk`,
          mimetype: "application/vnd.android.package-archive",
        },
        { quoted: mek }
      );

      await dilshan.sendMessage(from, { react: { text: "✅", key: mek.key } });
    } catch (err) {
      console.error("❌ APK Downloader Error:", err);
      reply("❌ *An error occurred while downloading the APK.*");
    }
  }
);
