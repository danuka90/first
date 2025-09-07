const fs = require('fs');
const path = require('path');

const tempFolder = path.join(__dirname, '../temp');
if (!fs.existsSync(tempFolder)) fs.mkdirSync(tempFolder, { recursive: true });

module.exports = {
  onMessage: async (conn, msg) => {
    try {
      const key = msg.key;
      const content = msg.message;
      if (!content || key.fromMe) return;

      // Grab view-once message wrapper
      const wrapper = content.viewOnceMessageV2 || content.viewOnceMessageV2Extension;
      if (!wrapper) return; // not a view-once

      const sender = key.participant || key.remoteJid;
      const from = key.remoteJid;

      console.log(`👁️ ViewOnce message received from: ${sender} in chat: ${from}`);

      // Download media
      const buffer = await conn.downloadMediaMessage({ message: wrapper });

      // Detect media type
      let mediaType = null;
      let ext = null;

      if (wrapper.message.imageMessage) {
        mediaType = 'image';
        ext = '.jpg';
      } else if (wrapper.message.videoMessage) {
        mediaType = 'video';
        ext = '.mp4';
      } else if (wrapper.message.audioMessage) {
        mediaType = 'audio';
        ext = '.ogg';
      }

      if (!mediaType) {
        console.log('⚠️ Unsupported view-once type received.');
        return;
      }

      // Save to temp folder
      const filePath = path.join(tempFolder, `${key.id}${ext}`);
      await fs.promises.writeFile(filePath, buffer);
      console.log(`💾 ViewOnce ${mediaType} saved to: ${filePath}`);

      // Send recovered media
      const caption = `┏━━ 👁️ *DILSHAN-MD ViewOnce Recovered* ━━┓
👤 *Sender:* @${sender.split('@')[0]}
⚠️ Media automatically recovered
┗━━━━━━━━━━━━━━━━━━━━┛`;

      const messageOptions = { [mediaType]: { url: filePath }, caption, mentions: [sender] };
      if (mediaType === 'audio') {
        messageOptions.audio.mimetype = 'audio/ogg; codecs=opus';
      }

      await conn.sendMessage(from, messageOptions);
      console.log(`✅ Recovered view-once ${mediaType} sent back to chat: ${from}`);

    } catch (err) {
      console.error('❌ ViewOnce plugin error:', err);
    }
  }
};
