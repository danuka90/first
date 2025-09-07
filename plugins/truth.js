const { cmd } = require("../command");

const truths = [
  "What’s a secret you’ve never told anyone?",
  "Have you ever lied to your best friend?",
  "What's your biggest fear?",
  "What's something you're glad your parents don't know about you?",
  "What was your most embarrassing moment?",
  "Have you ever had a crush on someone in this group?",
  "What’s the worst thing you’ve ever done at school?",
  "What is the biggest lie you've ever told?",
  "What’s a guilty pleasure you hide from others?",
  "Have you ever broken something and blamed someone else?",
  "What's the last thing you searched for on your phone?",
  "What's a habit you want to get rid of?",
  "Have you ever cheated in a game?"
];

cmd(
  {
    pattern: "truth",
    alias: ["tr"],
    react: "❓",
    desc: "Play truth question",
    category: "fun",
    filename: __filename,
  },
  async (dilshan, mek, m, { reply }) => {
    const question = truths[Math.floor(Math.random() * truths.length)];
    reply(`🧠 *Truth Question:*\n\n${question}`);
  }
);
