const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");

const pendingMovies = {};
const pendingQuality = {};

// ---------- Step 1: Search Movie ----------
cmd(
  {
    pattern: "movie",
    react: "🎬",
    desc: "Download Sinhala Sub Movie",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, sender, reply }) => {
    if (!q) return reply("❌ Please provide a movie name.");
    try {
      const url = `https://sinhalasub.lk/?s=${encodeURIComponent(q)}&search_type=all`;
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      const movies = [];
      $(".result-item article").each((i, el) => {
        const title = $(el).find(".title a").text().trim();
        const link = $(el).find(".title a").attr("href");
        movies.push({ title, link });
      });

      if (!movies.length) return reply("❌ No movies found.");

      let desc = "🎬 *Select a movie by number:*\n";
      movies.forEach((m, i) => {
        desc += `${i + 1}. ${m.title}\n`;
      });

      await reply(desc);

      pendingMovies[sender] = { movies };
    } catch (e) {
      console.log(e);
      reply("❌ Error fetching movies.");
    }
  }
);

// ---------- Step 2: Reply-based Movie Selection ----------
cmd(
  {
    filter: (text, { sender }) => pendingMovies[sender] && /^[1-9][0-9]*$/.test(text.trim()),
  },
  async (robin, mek, m, { from, body, sender, reply }) => {
    const index = parseInt(body.trim()) - 1;
    const { movies } = pendingMovies[sender];
    if (index < 0 || index >= movies.length) return reply("❌ Invalid selection.");

    const movie = movies[index];
    delete pendingMovies[sender];

    try {
      const res = await axios.get(movie.link);
      const $ = cheerio.load(res.data);

      const qualities = [];
      $(".sbox .download-link").each((i, el) => {
        const server = $(el).find(".download-btn").text().trim();
        if (server.toLowerCase() === "telagram") return; // skip telegram
        const quality = $(el).find(".link-quality").text().trim();
        const size = $(el).find(".link-meta span").last().text().trim();
        const linkPage = $(el).find(".download-btn").attr("href");
        qualities.push({ server, quality, size, linkPage });
      });

      if (!qualities.length) return reply("❌ No download links found.");

      let desc = `🎬 *Select quality for ${movie.title}:*\n`;
      qualities.forEach((q, i) => {
        desc += `${i + 1}. ${q.quality} - ${q.size} (${q.server})\n`;
      });

      await reply(desc);

      pendingQuality[sender] = { movie, qualities };
    } catch (e) {
      console.log(e);
      reply("❌ Failed to fetch qualities.");
    }
  }
);

// ---------- Step 3: Reply-based Quality Selection (Send via URL) ----------
cmd(
  {
    filter: (text, { sender }) => pendingQuality[sender] && /^[1-9][0-9]*$/.test(text.trim()),
  },
  async (robin, mek, m, { from, body, sender, reply }) => {
    const { movie, qualities } = pendingQuality[sender];
    const index = parseInt(body.trim()) - 1;
    if (index < 0 || index >= qualities.length) return reply("❌ Invalid selection.");
    const selected = qualities[index];
    delete pendingQuality[sender];

    await reply(`⏳ Fetching link for ${selected.quality} of ${movie.title}...`);

    try {
      // Get the download page
      const res = await axios.get(selected.linkPage);
      const $ = cheerio.load(res.data);

      // Grab the direct movie link
      const directLink = $("#download-link").attr("href");
      if (!directLink) return reply("❌ Failed to get download link.");

      // ✅ Log the direct link
      console.log(`Direct movie link for "${movie.title}" [${selected.quality}]:`, directLink);

      // ----------------------
      // Send movie via URL directly (supports large files)
      // ----------------------
      await robin.sendMessage(from, {
        document: { url: directLink },
        mimetype: "video/mp4",
        fileName: `${movie.title}-${selected.quality}.mp4`,
        caption: `🎬 ${movie.title} - ${selected.quality}`,
      }, { quoted: mek });

      await reply(`✅ Movie sent!`);
    } catch (e) {
      console.log(e);
      reply("❌ Failed to fetch or send movie.");
    }
  }
);
