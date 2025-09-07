const googleTTS = require('google-tts-api'); // No API key needed
const axios = require('axios');

async function getTTS(text, lang = 'en') {
  const url = googleTTS.getAudioUrl(text, {
    lang,
    slow: false,
    host: 'https://translate.google.com',
  });
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(data);
}

module.exports = { getTTS };
