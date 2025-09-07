const { cmd } = require("../command");
const math = require("mathjs");

cmd(
  {
    pattern: "calc",
    alias: ["calculate", "math"],
    react: "🧮",
    desc: "Evaluate math expressions (supports sin, sqrt, log, etc.)",
    category: "tools",
    filename: __filename,
  },
  async (dilshan, mek, m, { q, reply }) => {
    try {
      if (!q) {
        return reply(
          `*📌 Please enter a math expression to evaluate.*\n\n*Examples:*\n.calc 5 + 3\n.calc sqrt(25)\n.calc sin(30 deg)\n.calc 3^3 + log(100)`
        );
      }

      // Replace deg with actual unit for mathjs
      const expression = q
        .replace(/(\d+)\s*deg/g, "($1 deg)") // ensures "30deg" or "30 deg" -> "(30 deg)"
        .replace(/π/g, "pi") // allow π symbol
        .trim();

      // Configure mathjs for degree-based trigonometry
      const scope = {
        deg: math.unit("1 deg"),
        pi: math.pi,
        e: math.e,
      };

      let result;
      try {
        result = math.evaluate(expression, scope);

        if (typeof result === "object" && result.format) {
          result = result.toString(); // convert units, fractions, etc.
        }
      } catch (err) {
        return reply(`❌ *Invalid Expression:*\n\`\`\`${err.message}\`\`\``);
      }

      return reply(`*🧮 Result:*\n\`\`\`${q} = ${result}\`\`\``);
    } catch (e) {
      console.error(e);
      reply(`❌ *Unexpected Error:*\n\`\`\`${e.message}\`\`\``);
    }
  }
);
