const { cmd } = require("../command");

cmd(
  {
    pattern: "ping",
    react: "🏓",
    desc: "Bot response speed test",
    category: "system",
    filename: __filename,
  },
  async (dilshan, mek, m, { reply }) => {
    const start = Date.now();
    await reply("🏓 Pinging...");
    const end = Date.now();
    await reply(`🏓 Pong! Response time: *${end - start}ms*`);
  }
);
