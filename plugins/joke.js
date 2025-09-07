const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "joke",
    alias: ["funny"],
    react: "😂",
    desc: "Send a random joke",
    category: "fun",
    filename: __filename,
  },
  async (dilshan, mek, m, { reply }) => {
    try {
      const res = await axios.get("https://official-joke-api.appspot.com/random_joke");
      const { setup, punchline } = res.data;
      reply(`🤣 *${setup}*\n\n${punchline}`);
    } catch {
      reply("*Couldn't fetch a joke right now. Try again later.* ❌");
    }
  }
);
