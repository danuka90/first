const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();
const yts = require("yt-search");
const axios = require("axios");

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "song",
    alias: ["ytmp3", "mp3"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download",
    filename: __filename,
}, async (dilshan, mek, m, { from, args, reply }) => {
    try {
        const q = args.join(" ");
        if (!q) return reply("*Provide a name or a YouTube link.* 🎵❤️");

        let url = q;
        try {
            url = new URL(q).toString();
        } catch {
            const s = await yts(q);
            if (!s.videos.length) return reply("❌ No videos found!");
            url = s.videos[0].url;
        }

        const info = (await yts(url)).videos[0];

        const desc = `
╭━━❰ 🎵 *SONG DOWNLOAD* ❱━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃────────────────────────
┃ 🎬 *Title:* ${info.title}
┃ ⏳ *Duration:* ${info.timestamp || "Unknown"}
┃ 👀 *Views:* ${info.views}
┃ 📥 *Download URL:* ${info.url}
┃
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

🔻 Download your favorite songs fast!
❤️ Made with passion by *Dilshan Chanushka* 💫`;

        await dilshan.sendMessage(from, { image: { url: info.thumbnail }, caption: desc }, { quoted: mek });

        const downloadAudio = async (videoUrl, quality = "mp3") => {
            const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(videoUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
            const res = await axios.get(apiUrl);
            if (!res.data.success) throw new Error("Failed to fetch audio details.");

            const { id, title } = res.data;
            const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;

            while (true) {
                const prog = (await axios.get(progressUrl)).data;
                if (prog.success && prog.progress === 1000) {
                    const audio = await axios.get(prog.download_url, { responseType: "arraybuffer" });
                    return { buffer: audio.data, title };
                }
                await new Promise(r => setTimeout(r, 5000));
            }
        };

        const { buffer, title } = await downloadAudio(url);
        await dilshan.sendMessage(from, { audio: buffer, mimetype: "audio/mpeg", ptt: false, fileName: `${title}.mp3` }, { quoted: mek });

        reply("*Thank you for using DILSHAN-MD! Enjoy your song!* 💖");

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
