const { cmd } = require("../command");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const os = require("os");

cmd({
  pattern: "ss",
  react: "❤️",
  desc: "Take website screenshot",
  category: "tools",
  use: ".screenshot <url>",
  filename: __filename,
}, async (dilshan, mek, m, { from, q, reply }) => {
  if (!q) return reply("🖼️ *Please provide a website URL.*\nExample: `.screenshot https://example.com`");

  let url = q.trim();
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;

  try {
    reply("📸 Taking screenshot, please wait...");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });

    await page.evaluate(() => {
      const link = document.createElement('link');
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });

    await page.addStyleTag({
      content: `* { font-family: 'Noto Sans Sinhala', sans-serif !important; }`
    });

    const screenshotPath = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await browser.close();

    const buffer = fs.readFileSync(screenshotPath);
    await dilshan.sendMessage(from, {
      image: buffer,
      caption: `╭〔 *📷 Website Screenshot* 〕─⬣
┃ 🌐 URL: ${url}
╰───────────────⬣`
    }, { quoted: mek });

    fs.unlinkSync(screenshotPath);

  } catch (e) {
    console.error("Screenshot error:", e);
    reply("❌ *Failed to take screenshot.* Please check the URL or try again later.");
  }
});
