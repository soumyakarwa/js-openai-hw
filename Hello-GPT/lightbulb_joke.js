import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  const topic = await ask(
    "Hello User! Tell me a topic you want to hear a lightbulb joke about"
  );

  const prompt = `
    Tell me a lightbulb joke about ${topic}
  `;
  const joke = await gptPrompt(prompt, { temperature: 0.7 });
  say(`\n${joke}\n`);
}
