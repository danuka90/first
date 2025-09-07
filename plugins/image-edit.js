const { cmd } = require("../command");
const sharp = require("sharp");
const fs = require("fs");
const { getRandom } = require("../lib/functions");

async function processImage(m, quoted, effectFn, dilshan, from, mek, reply, caption = "✅ Edited by *DILSHAN-MD*") {
  const isQuotedImage =
    quoted &&
    (quoted.type === "imageMessage" ||
      (quoted.type === "viewOnceMessage" && quoted.msg.type === "imageMessage"));

  if (!(m.type === "imageMessage" || isQuotedImage)) {
    return reply("⚠️ Reply to an *image* with this command!");
  }

  reply("⏳ Processing your image...");

  const imgBuffer = isQuotedImage ? await quoted.download() : await m.download();
  let edited = effectFn(sharp(imgBuffer));

  const outFile = getRandom(".jpg");
  await edited.toFile(outFile);

  await dilshan.sendMessage(
    from,
    { image: fs.readFileSync(outFile), caption },
    { quoted: mek }
  );

  fs.unlinkSync(outFile);
}

/* ─────────────── Filters ─────────────── */
cmd({
  pattern: "warm",
  react: "🔥",
  desc: "Apply warm tone filter.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.modulate({ brightness: 1.1, saturation: 1.2 }).tint("#ff9966")
  , dilshan, from, mek, reply, "🔥 Warm Filter by *DILSHAN-MD*");
});

cmd({
  pattern: "cyberpunk",
  react: "🤖",
  desc: "Apply cyberpunk neon style.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.modulate({ saturation: 2, brightness: 1.2 }).tint("#ff00ff").sharpen()
  , dilshan, from, mek, reply, "🤖 Cyberpunk Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "rainbow",
  react: "🌈",
  desc: "Apply rainbow color overlay.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.modulate({ hue: 180, saturation: 1.5 })
  , dilshan, from, mek, reply, "🌈 Rainbow Filter by *DILSHAN-MD*");
});

cmd({
  pattern: "hdr",
  react: "🌄",
  desc: "Apply HDR effect.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.linear(1.4, -20).sharpen().modulate({ saturation: 1.3 })
  , dilshan, from, mek, reply, "🌄 HDR Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "oil",
  react: "🎨",
  desc: "Apply oil painting effect.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.median(5).modulate({ saturation: 0.8, brightness: 1.1 })
  , dilshan, from, mek, reply, "🎨 Oil Painting Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "neon",
  react: "💡",
  desc: "Apply neon glow effect.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.modulate({ saturation: 2 }).linear(1.2, 0).sharpen()
  , dilshan, from, mek, reply, "💡 Neon Glow by *DILSHAN-MD*");
});

cmd({
  pattern: "sketch",
  react: "✏️",
  desc: "Convert image to pencil sketch.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.grayscale().negate().blur(5).modulate({ brightness: 1.2 })
  , dilshan, from, mek, reply, "✏️ Sketch Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "cartoon",
  react: "🖌️",
  desc: "Apply cartoon effect.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) =>
    img.sharpen().median(3).modulate({ saturation: 1.5, brightness: 1.1 })
  , dilshan, from, mek, reply, "🖌️ Cartoon Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "sepia",
  react: "📸",
  desc: "Apply sepia filter to image.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.modulate({ saturation: 0.3 }).tint("#704214"), dilshan, from, mek, reply, "📸 Sepia Filter by *DILSHAN-MD*");
});

cmd({
  pattern: "bright",
  react: "☀️",
  desc: "Increase brightness.",
  category: "edit",
  use: ".bright <value 1-3>",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, q, reply }) => {
  const val = parseFloat(q) || 1.5;
  await processImage(m, quoted, (img) => img.modulate({ brightness: val }), dilshan, from, mek, reply, `☀️ Brightness ${val}x by *DILSHAN-MD*`);
});

cmd({
  pattern: "contrast",
  react: "🎨",
  desc: "Adjust contrast.",
  category: "edit",
  use: ".contrast <value>",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, q, reply }) => {
  const val = parseFloat(q) || 1.5;
  await processImage(m, quoted, (img) => img.linear(val, -(128 * (val - 1))), dilshan, from, mek, reply, `🎨 Contrast ${val}x by *DILSHAN-MD*`);
});

cmd({
  pattern: "vintage",
  react: "📷",
  desc: "Apply vintage effect.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.modulate({ saturation: 0.5, brightness: 1.1 }).tint("#d1a96f"), dilshan, from, mek, reply, "📷 Vintage Effect by *DILSHAN-MD*");
});

cmd({
  pattern: "sharpen",
  react: "🔪",
  desc: "Sharpen the image.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.sharpen(), dilshan, from, mek, reply, "🔪 Sharpened by *DILSHAN-MD*");
});

cmd({
  pattern: "pixel",
  react: "🟦",
  desc: "Pixelate image.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.resize(50).resize(500), dilshan, from, mek, reply, "🟦 Pixelated by *DILSHAN-MD*");
});

/* ─────────────── Basic Edits ─────────────── */
cmd({
  pattern: "blur",
  react: "🌫️",
  desc: "Blur image.",
  category: "edit",
  use: ".blur <value>",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, q, reply }) => {
  const val = parseInt(q) || 10;
  await processImage(m, quoted, (img) => img.blur(val), dilshan, from, mek, reply, `🌫️ Blurred (${val}) by *DILSHAN-MD*`);
});

cmd({
  pattern: "gray",
  react: "⚫",
  desc: "Convert to grayscale.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.grayscale(), dilshan, from, mek, reply, "⚫ Grayscale by *DILSHAN-MD*");
});

cmd({
  pattern: "invert",
  react: "🔄",
  desc: "Invert image colors.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.negate(), dilshan, from, mek, reply, "🔄 Inverted by *DILSHAN-MD*");
});

cmd({
  pattern: "rotate",
  react: "🔃",
  desc: "Rotate image by degrees.",
  category: "edit",
  use: ".rotate <deg>",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, q, reply }) => {
  const deg = parseInt(q) || 90;
  await processImage(m, quoted, (img) => img.rotate(deg), dilshan, from, mek, reply, `🔃 Rotated ${deg}° by *DILSHAN-MD*`);
});

cmd({
  pattern: "flip",
  react: "↕️",
  desc: "Flip image vertically.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.flip(), dilshan, from, mek, reply, "↕️ Flipped Vertically by *DILSHAN-MD*");
});

cmd({
  pattern: "flop",
  react: "↔️",
  desc: "Flip image horizontally.",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.flop(), dilshan, from, mek, reply, "↔️ Flopped Horizontally by *DILSHAN-MD*");
});

/* ─────────────── Upscale ─────────────── */
cmd({
  pattern: "hd",
  react: "📈",
  desc: "Upscale image to HD (2x).",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.resize({ width: 1280, height: 1280, fit: "inside" }), dilshan, from, mek, reply, "📈 HD Upscaled by *DILSHAN-MD*");
});

cmd({
  pattern: "4k",
  react: "🖼️",
  desc: "Upscale image to 4K (4x).",
  category: "edit",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, reply }) => {
  await processImage(m, quoted, (img) => img.resize({ width: 3840, height: 3840, fit: "inside" }), dilshan, from, mek, reply, "🖼️ 4K Upscaled by *DILSHAN-MD*");
});


// 🔹 Resize
cmd({
  pattern: "resize",
  react: "📐",
  desc: "Resize the image (default 300x300).",
  category: "edit",
  use: ".resize <width>x<height>",
  filename: __filename,
}, async (dilshan, mek, m, { from, quoted, q, reply }) => {
  const match = q.match(/(\d+)x(\d+)/);
  const w = match ? parseInt(match[1]) : 300;
  const h = match ? parseInt(match[2]) : 300;
  await processImage(m, quoted, (img) => img.resize(w, h), dilshan, from, mek, reply, `📐 Resized to ${w}x${h} by *DILSHAN-MD*`);
});
