import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";
import { readCSV } from "https://deno.land/x/csv/mod.ts";
import { green, blue, red, yellow } from "https://deno.land/std/fmt/colors.ts";

async function main() {
  const filePath = "./scraper/reviews.csv";
  const italics = "\x1b[3m";
  const reset = "\x1b[0m";
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

    say(yellow(`BOOK REVIEW ANALYZER\n`));

    say(
      `This tool is designed to analyze book reviews for "The Paris Apartment" by Lucy Foley. It previously gathered reviews from Goodreads and will deliver two key insights: firstly, the rating assigned to the book by each reviewer, and secondly, an expression capturing the essence of their reading experience.\n`
    );

    say(blue(`${italics}analyzing reviews${reset}\n`));

    // Iterate over each review in the reviews array
    for (const review of reviews) {
      const prompt = `
        I'm going to provide you with a book review about "These Violent Delights" by Chloe Gong. I want you to analyse the review and provide me two answers:

        First, analyse this review and tell me how much the review has rated the book out of 5. If the review does not provide a numerical rating then output NA.
        
        Second, analyse this review and tell me what the reviewer felt about the book "overall." Choose one phrase from this list, ${wordsDescribingBook} that describes the reviewer's feelings about the book.

        Here are some pointers to consider while analysing the review: 
        Consider the user of emotive words like "love," "disappointed," "joy," "eager" etc. Also consider the combination of these words while analyisng the review. For instance if the reviewer writes something along the lines of "I loved characters of the book but was disappointed with the predictable plot turns" that would mean the reviewer found the book to belong in the category of It was fine or Nothing special.

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

  var reviewDetails = reviews.map((review, index) => ({
    review,
    rating: ratings[index],
    feeling: words[index],
  }));

  reviewDetails = reviewDetails.slice(1);

  say(blue(`${italics}\nanalysis complete${reset}\n`));

  const response = await ask(
    red(
      `Would you like to view the result from the command line (1) or export the data into a JSON (2)? Answer with the appropriate option number.\n`
    )
  );

  if (response === "1") {
    // say(`${JSON.stringify(reviewDetails)}\n`);
    console.log(reviewDetails);
  } else {
    const jsonData = JSON.stringify(reviewDetails, null, 2);
    await Deno.remove("ReviewAnalysis.json");
    await Deno.writeTextFile("ReviewAnalysis.json", jsonData);
    say(
      `The analysis has been written into a file, ${italics}ReviewAnalysis.json${reset}\n`
    );
  }

  say(yellow(`Thanks for using Book Review Analyser! Come back soon :)`));
}

main();
