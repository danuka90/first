const { cmd } = require("../command");

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

cmd(
  {
    pattern: "uptime",
    react: "⏱️",
    desc: "Show how long the bot has been running",
    category: "system",
    filename: __filename,
  },
  async (dilshan, mek, m, { reply }) => {
    const uptime = process.uptime(); // in seconds
    reply(`⏱️ *Bot Uptime:* ${formatUptime(uptime)}`);
  }
);
