const { cmd } = require("../command");

const dares = [
  "Send a voice note singing your favorite song.",
  "Change your profile pic to a cartoon character for 1 hour.",
  "Tell the group your most awkward crush.",
  "Say 'I love you' to the last person you chatted with.",
  "Do 10 push-ups and send a video.",
  "Type the alphabet backward as fast as you can.",
  "Text your crush and say 'I dreamed about you last night!'",
  "Send your last 3 emojis.",
  "Imitate an animal and send a voice note.",
  "Send a selfie with a funny face.",
  "Write a poem about someone in the group.",
  "Record yourself dancing and send it.",
  "Let someone else in the group choose your next status."
];

cmd(
  {
    pattern: "dare",
    alias: ["dr"],
    react: "🔥",
    desc: "Play dare challenge",
    category: "fun",
    filename: __filename,
  },
  async (dilshan, mek, m, { reply }) => {
    const challenge = dares[Math.floor(Math.random() * dares.length)];
    reply(`🔥 *Dare Challenge:*\n\n${challenge}`);
  }
);
