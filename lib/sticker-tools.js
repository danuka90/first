// ✅ lib/sticker-tools.js (Updated with dynamic import for browser-id3-writer)
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const tmp = require("tmp");
const webpmux = require("node-webpmux");

// 🔄 Convert image/video to sticker
async function sticker(mode, filePath, type, msgId) {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: ".webp" });
    let cmd = `ffmpeg -i "${filePath}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white" -vcodec libwebp -lossless 1 -preset default -loop 0 -an -vsync 0 "${output}"`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve(fs.readFileSync(output));
    });
  });
}

// 🔘 Circle sticker
async function circleSticker(filePath, isVideo, msgId) {
  return new Promise((resolve, reject) => {
    const output = tmp.tmpNameSync({ postfix: ".webp" });
    const cmd = `ffmpeg -i "${filePath}" -vf "crop='min(iw,ih)':'min(iw,ih)',scale=512:512,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gte(sqrt(pow(X-256,2)+pow(Y-256,2)),256),0,255)'" -vcodec libwebp -lossless 1 -preset default -loop 0 -an -vsync 0 "${output}"`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve(fs.readFileSync(output));
    });
  });
}

// 🏷️ Add Exif metadata to sticker
async function addExif(mediaBuffer, pack = "DANUWA-MD", author = "DANUKA") {
  const output = tmp.tmpNameSync({ postfix: ".webp" });
  const exifAttr = {
    "sticker-pack-id": "com.danuwa.bot",
    "sticker-pack-name": pack,
    "sticker-pack-publisher": author,
  };

  const img = new webpmux.Image();
  await img.load(mediaBuffer);
  img.exif = webpmux.Exif.from(exifAttr);
  await img.save(output);
  return fs.readFileSync(output);
}

// 🔊 Add ID3 tags to audio using dynamic import
async function addAudioMetaData(audioBuffer, title = "Track", artist = "Artist", album = "DANUWA", url = "") {
  const ID3Writer = (await import("browser-id3-writer")).default;

  const writer = new ID3Writer(audioBuffer);
  writer.setFrame("TIT2", title)
    .setFrame("TPE1", [artist])
    .setFrame("TALB", album)
    .setFrame("WXXX", {
      description: "",
      url: url,
    });
  writer.addTag();
  return Buffer.from(writer.arrayBuffer);
}

// 🔄 Convert webp to mp4 (animated stickers)
async function webpToMp4(filePath) {
  return new Promise((resolve, reject) => {
    const outPath = tmp.tmpNameSync({ postfix: ".mp4" });
    const cmd = `ffmpeg -i "${filePath}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outPath}"`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve(outPath);
    });
  });
}

module.exports = {
  sticker,
  circleSticker,
  addExif,
  addAudioMetaData,
  webpToMp4,
};
