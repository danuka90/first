const { cmd } = require('../command');
const os = require('os');
const fs = require('fs');
const config = require('../config');

const formatUptime = (seconds) => {
    const pad = (s) => (s < 10 ? '0' + s : s);
    const days = Math.floor(seconds / (24 * 3600));
    const hrs = Math.floor((seconds % (24 * 3600)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days > 0 ? `${days}d ` : ''}${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

cmd({
    pattern: "alive",
    react: "📣",
    desc: "Check if the bot is online and functioning.",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const start = Date.now();
        await conn.sendPresenceUpdate('composing', from);
        const ping = Date.now() - start;
        const uptime = formatUptime(process.uptime());
        const platform = os.platform();
        const cpuModel = os.cpus()?.[0]?.model?.split('@')[0]?.trim()?.slice(0, 40) || 'Unknown CPU';

        const aliveImg = 'https://github.com/danukaya123/firstcus/blob/main/images/alive.png?raw=true';
        const voicePath = './media/alive.ogg';

        const channelJid = '120363418166326365@newsletter';
        const channelName = '🍁 ＤＡＮＵＷＡ－ 〽️Ｄ 🍁';
        const channelInvite = '0029Vb3xuG98F2pC9mT4Wg3f';

        const userName = m.pushName || "User";

        const aliveCaption = `╭━━━[ 🤖 𝗦𝗬𝗦𝗧𝗘𝗠 𝗢𝗡𝗟𝗜𝗡𝗘 ]━━━╮
┃ 👋 𝗛𝗲𝘆 ${userName},
┃ 💠 𝗣𝗥𝗘𝗙𝗜𝗫: "${config.PREFIX || '.'}"
┃ 🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${config.BOT_NAME || 'DILSHAN-MD'}
┃ ⏱️ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptime}
┃ 📡 𝗣𝗟𝗔𝗧𝗙𝗢𝗥𝗠: ${platform}
┃ 🧬 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: ${config.VERSION || '1.0.0'}
╰━━━━━━━━━━━━━━━━━━━━━━╯
  👑 *OWNER:* *DILSHAN CHANUSHKA*`;

        await conn.sendMessage(from, {
            image: { url: aliveImg },
            caption: aliveCaption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: channelName,
                    serverMessageId: -1
                }
            }
        }, { quoted: mek });

        if (fs.existsSync(voicePath)) {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(voicePath),
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            }, { quoted: mek });
        }

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
});
