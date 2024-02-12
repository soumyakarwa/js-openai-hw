/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

async function main() {
  var temp = 0.1 + Math.random() * (0.5 - 0.1);
  say(`Hello, Player! The temperature for this round is ${temp}`);

  const topic = await ask("What do you want to be quized on?");

  const questionsString = await gptPrompt(
    `
    Generate 4 questions for a triva game. Do not provide answers.
    The topic is ${topic}.
    provide the questions as a javascript array of strings like this:
    ["question 1", "question 2", "question 3", "question 4"]

    Include only the array, start with [ and end with ].
    `,
    { max_tokens: 1024, temperature: temp }
  );

  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);
    end();
    return;
  }

  say("");
  var correctAnswers = 0;

  for (const q of questions) {
    const a = await ask(q);
    const response = await gptPrompt(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer yes or no. If no, provide the correct answer.
    `,
      { max_tokens: 64, temperature: temp }
    );
    say(response);

    if (response.toLowerCase().includes("yes")) {
      correctAnswers++;
    }

    say("");
  }

  say(`You got ${correctAnswers} out of 4 questions correct`);
}
