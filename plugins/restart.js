const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "restart",
  react: '♻️',
  desc: "Restart the bot",
  category: "owner",
  filename: __filename
}, async (
  conn, mek, m, {
    from, sender, reply
  }
) => {
  try {
    const ownerJid = config.BOT_OWNER + '@s.whatsapp.net';

    if (sender !== ownerJid) {
      return reply("❌ This command is only for the bot owner.");
    }

    await reply("♻️ Restarting DILSHAN-MD now...\nPlease wait a few seconds.");

    await sleep(1500);
    const { exec } = require("child_process");
    exec("pm2 restart all");

  } catch (e) {
    console.error("Restart error:", e);
    reply("❌ Failed to restart:\n" + e);
  }
});
