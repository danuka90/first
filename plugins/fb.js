const { cmd } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");
const he = require("he");

cmd(
  {
    pattern: "fb",
    alias: ["facebook"],
    react: "❤️",
    desc: "Download Facebook Video",
    category: "download",
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
      if (!q)
        return reply("*Please provide a valid Facebook video URL!* ❤️");

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("*Invalid Facebook URL! Please check and try again.* ☹️");

      reply("*Downloading your video...* ❤️");

      const result = await getFbVideoInfo(q);
      if (!result || (!result.sd && !result.hd)) {
        return reply("*Failed to download video. Please try again later.* ☹️");
      }

      const { title, sd, hd, thumbnail } = result;
      const bestQualityUrl = hd || sd;
      const qualityText = hd ? "HD" : "SD";
      const safeTitle = he.decode(title || "Unknown").normalize("NFC");

      const desc = `
╭━━━❰ 📲 *FB DOWNLOADER* ❱━━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃───────────────────────
┃ 🎬 *Title:* ${safeTitle}
┃ 📥 *Quality:* ${qualityText}
┃
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

🔻 Download your favorite Facebook videos fast!
❤️ Made with passion by *Dilshan Chanushka* 💫`;

      if (thumbnail) {
        await dilshan.sendMessage(
          from,
          {
            image: { url: thumbnail },
            caption: desc,
          },
          { quoted: mek }
        );
      } else {
        await dilshan.sendMessage(
          from,
          {
            text: desc,
          },
          { quoted: mek }
        );
      }

      await dilshan.sendMessage(
        from,
        {
          video: { url: bestQualityUrl },
          caption: `*📥 Downloaded in ${qualityText} quality*`,
        },
        { quoted: mek }
      );

      return reply("*Thank you for using DILSHAN-MD! Enjoy your video!* 💖");
    } catch (e) {
      console.error("❌ Error in DILSHAN-MD FB Plugin:", e);
      return reply(
        "❌ *Facebook video could not be fetched.*\nCheck if the link is valid, public, and try again later."
      );
    }
  }
);
