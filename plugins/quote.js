const axios = require('axios');
const { commands } = require('../command');

commands.push({
  pattern: 'quote',
  desc: 'Get a random quote from ZenQuotes',
  category: "fun",
  react: '📜',
  function: async (sock, m, msg, { reply }) => {
    try {
      const res = await axios.get('https://zenquotes.io/api/random');
      const quote = res.data[0];
      await reply(`📝 *${quote.q}*\n— ${quote.a}`);
    } catch (err) {
      console.error('Quote Error:', err);
      await reply('❌ Failed to fetch a quote.');
    }
  }
});
