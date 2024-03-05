import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

async function main() {
  const filePath = "./scraper/reviews.json";
  const wordsDescribingBook = [
    "Engrossed",
    "Empathetic",
    "Inspired",
    "Nostalgic",
    "Reflective",
  ];

  try {
    // Read the file content
    const data = await Deno.readTextFile(filePath);
    // Parse the JSON content
    const reviews = JSON.parse(data);

    say(
      `Hi there! This tool will analyse 12 book reviews for "These Violent Delights" by Chloe Gong. I will tell you how the users rated and felt about a book based on their review`
    );

    // Iterate over each review in the reviews array
    for (const review of reviews) {
      const prompt = `
        I'm going to provide you with a book review about "These Violent Delights" by Chloe Gong. I want you to analyse the review and provide me two answers:

        First, analyse this review and tell me how much the review has rated the book out of 5. If the review does not provide a numerical rating then output NA.

        I want the output to be as such:
        "Rating: user rating/5.0 or NA"

        Second, analyse this review and tell me what the reviewer felt about the book "overall." Choose one word from these words, ${wordsDescribingBook} that describes the reviewer's feelings about the book.

        Provide the output for these two reviews in an json like this:

        {rating: user rating/5.0, feeling: word describing the book}

        Do not provide responses that aren't in the json format. I don't want paragraphs of results. 

        Here is the review:

        ${review}
      `;
      const analysisResult = await gptPrompt(prompt, {
        temperature: 0.7,
        max_tokens: 100,
      });
      say(`\n${analysisResult}\n`);
    }
  } catch (error) {
    console.error("Failed to read or parse JSON file:", error);
  }
}

main();
