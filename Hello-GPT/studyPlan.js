import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  const elements = {};
  elements.topic = await ask(
    "Hello User! Tell me a subject you want to learn more about. I'll design a customized study plan after you answer a few questions."
  );
  elements.depth = await ask(
    `Is your knowledge in ${elements.topic} at a beginner, intermediate or advanced level?`
  );
  elements.time = await ask(
    `How much time can you dedicate to this every day?`
  );

  const prompt = `
    I want to learn more about ${elements.topic}. Currently my knowledge in this topic is at a ${elements.depth} level. I have ${elements.time} to dedicate to this every day. Can you design a study plan for the next 6 months, for me to achieve my learning goals. 
  `;
  const studyPlan = await gptPrompt(prompt, {
    temperature: 0.7,
    max_tokens: 2048,
  });
  say(`\n${studyPlan}\n`);
}
