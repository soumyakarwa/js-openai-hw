import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";
import { readCSV } from "https://deno.land/x/csv/mod.ts";

async function main() {
  const filePath = "./scraper/reviews.csv";
  const wordsDescribingBook = [
    "Engrossed",
    "Empathetic",
    "Inspired",
    "Nostalgic",
    "Reflective",
  ];

  var ratings = [];
  var words = [];
  try {
    const f = await Deno.open(filePath);

    let reviews = [];
    for await (const row of readCSV(f)) {
      for await (const cell of row) {
        reviews.push(cell);
      }
    }

    say(
      `Hi there! This tool will analyse reviews for "The Paris Apartment" by Lucy Foley. It will provide two results: first, what rating the reader gave the book and two, one word describing what the reading experience was like.`
    );

    // Iterate over each review in the reviews array
    for (const review of reviews) {
      const prompt = `
        I'm going to provide you with a book review about "These Violent Delights" by Chloe Gong. I want you to analyse the review and provide me two answers:

        First, analyse this review and tell me how much the review has rated the book out of 5. If the review does not provide a numerical rating then output NA.
        
        Second, analyse this review and tell me what the reviewer felt about the book "overall." Choose one word from these words, ${wordsDescribingBook} that describes the reviewer's feelings about the book.

        Provide the output for these two categories, rating and feeling, in a javascript object like this:

        {rating: user rating/5.0, feeling: word describing the book}

        Do not put the javascript object properties -rating or feeling- in quotation marks.

        Provide no other analysis, except for the aforementioned javascript object.

        Here is the review:

        ${review}
      `;
      const analysisResult = await gptPrompt(prompt, {
        temperature: 0.7,
        max_tokens: 100,
      });
      say(`\n${analysisResult}\n`);
      ratings.push(analysisResult.rating);
      words.push(analysisResult.feeling);
    }
  } catch (error) {
    console.error("Failed to read or parse JSON file:", error);
  }

  console.log(ratings);
  console.log(words);
}

main();
