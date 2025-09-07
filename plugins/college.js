const { cmd } = require("../command");
const sharp = require("sharp");
const fs = require("fs");
const { getRandom } = require("../lib/functions");

async function makeCollage(images, columns, rows, outFile) {
  const size = 400; // each image size
  const canvas = sharp({
    create: {
      width: size * columns,
      height: size * rows,
      channels: 3,
      background: "#111111" // dark bg
    }
  }).png();

  const composites = [];

  for (let i = 0; i < images.length; i++) {
    const buffer = await sharp(images[i])
      .resize(size, size, { fit: "cover" })
      .toBuffer();

    composites.push({
      input: buffer,
      top: Math.floor(i / columns) * size,
      left: (i % columns) * size,
    });
  }

  await canvas.composite(composites).toFile(outFile);
}

cmd({
  pattern: "collage",
  react: "🖼️",
  desc: "Create collage from multiple images",
  category: "edit",
  use: ".collage <Reply/send 2-6 images>",
  filename: __filename,
}, async (dilshan, mek, m, { from, reply, quoted }) => {
  try {
    const imgs = [];

    // Collect images if message has multiple
    if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      const qMsg = m.message.extendedTextMessage.contextInfo.quotedMessage;
      if (qMsg.imageMessage) {
        imgs.push(await quoted.download());
      }
    }

    // Check if user directly replied with multiple images
    if (m.message?.imageMessage) {
      imgs.push(await m.download());
    }

    // If message has multiple "grouped" images (album-like)
    if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.albumMessage) {
      const album = m.message.extendedTextMessage.contextInfo.quotedMessage.albumMessage;
      for (const item of album) {
        if (item.imageMessage) {
          const buff = await dilshan.downloadMediaMessage(item);
          imgs.push(buff);
        }
      }
    }

    if (imgs.length < 2) {
      return reply("⚠️ Please reply/send *at least 2 images* for collage!");
    }

    const outFile = getRandom(".png");
    const cols = 2;
    const rows = Math.ceil(imgs.length / cols);

    await makeCollage(imgs, cols, rows, outFile);

    await dilshan.sendMessage(
      from,
      { image: fs.readFileSync(outFile), caption: "🖼️ Collage created by *DILSHAN-MD*" },
      { quoted: mek }
    );

    fs.unlinkSync(outFile);
  } catch (e) {
    console.error("❌ Collage Plugin Error:", e);
    reply("❌ Could not generate collage. Try again!");
  }
});
