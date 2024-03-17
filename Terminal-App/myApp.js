import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";
import { readCSV } from "https://deno.land/x/csv/mod.ts";

async function main() {
  const filePath = "./scraper/reviews.csv";
  const wordsDescribingBook = [
    "Loved it",
    "It was fine",
    "Nothing special",
    "Bored",
    "Hated it",
  ];

  var reviews = [];
  var ratings = [];
  var words = [];
  try {
    const f = await Deno.open(filePath);
    for await (const row of readCSV(f)) {
      for await (const cell of row) {
        reviews.push(cell);
      }
    }

    say(`Hey there! \n`);

    say(
      ` This tool will analyse reviews for "The Paris Apartment" by Lucy Foley. It will provide two results: first, what rating the reader gave the book and two, one word describing what the reading experience was like. \n`
    );

    // Iterate over each review in the reviews array
    for (const review of reviews) {
      const prompt = `
        I'm going to provide you with a book review about "These Violent Delights" by Chloe Gong. I want you to analyse the review and provide me two answers:

        First, analyse this review and tell me how much the review has rated the book out of 5. If the review does not provide a numerical rating then output NA.
        
        Second, analyse this review and tell me what the reviewer felt about the book "overall." Choose one phrase from this list, ${wordsDescribingBook} that describes the reviewer's feelings about the book.

        Here are some pointers to consider while analysing the review: 
        Consider the user of emotive words like "love," "disappointed," "joy," "eager" etc. Also consider the combination of these words while analyisng the review. For instance if the reviewer something along the lines of "I loved characters of the book but was disappointed with the predictable plot turns" that would mean the reviewer found the book to belong in the category of It was fine or Nothing special.

        Ensure the output is strictly in JSON format, suitable for parsing with JSON.parse(). The format should be as follows:
        
        {"rating": "<rating or NA>", "feeling": "<chosen phrase>"}

        Do not include any text or characters outside of the JSON structure. THIS IS VERY IMPORTANT

        Review:
        ${review}
      `;
      const analysisResult = await gptPrompt(prompt, {
        temperature: 0.7,
        max_tokens: 100,
      });
      const cleanedString = analysisResult
        .replace("```json", "")
        .replace("```json ", "")
        .replace("```", "")
        .replace("``` ", "");
      const jsonResult = JSON.parse(cleanedString);
      ratings.push(jsonResult.rating);
      words.push(jsonResult.feeling);
    }
  } catch (error) {
    console.error("Failed to read or parse JSON file:", error);
  }

  const reviewDetails = reviews.map((review, index) => ({
    review,
    rating: ratings[index],
    feeling: words[index],
  }));

  console.log(reviewDetails);
}

main();
