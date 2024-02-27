import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/openai.js";

main();

/**
 * This function will ask the user for their Goodreads username and userid. It will then scrape their "read" bookshelf from Goodreads and create a csv/json file with the book name, author name, review. The program will analyse which books have reviews and it will call the OpenAI-API to analyse the reviews and add two-columns, rating and review-in-one-word. This is to prevent a redundant API call."
 */
async function main() {
  // temporary review
  const bookReview = `
    Taking deep dive into the past for this one, and finally reading more Agatha Christie. Up until now, surprise surprise, I’ve actually only read The Murder on the Orient Express, I believe, which was recommended to me by a friend. Now that I’ve read this one too, I think I might just start from the beginning and go through the rest of the Hercule Poirot mysteries and see how I feel about them. 

    The Murder of Roger Ackroyd is a self-explanatory title, but the plot is really quite intricate. It revolves around a small town where everyone knows everyone, and thus most often have something to hide. After the death of one of the most rich patrons in town, the town is thrown into a disarray, and more and more suspicious circumstances arise around the death. As the suspects are narrowed down, it becomes clear that only a few number of people could have committed the murder, and it is up to Hercule Poirot and his deductions to solve it all.

    Overall, quite a good read. The characters were excellent, and it was essentially a closed room scenario, since there were really only very few possibilities for the perpetrator. That is not to say it wasn’t exciting though. There were intricate storylines woven for everyone, and it was very difficult to tell who would end up being the murderer all the way up until the final chapters. The ending also has an interesting twist to it.

    Rating: 4.5/5.0`;

  const wordsDescribingBook = [
    "Engrossed",
    "Empathetic",
    "Inspired",
    "Nostalgic",
    "Reflective",
  ];

  // currently working on analysing the review
  say(
    `Hi there! Here's a review of "The Murder of Roger Ackroyd" by Agatha Christie. This review was provided by DownTheRabbitHoleBlog.`
  );
  say(`${bookReview}\n`);

  const prompt = `
      I'm going to provide you with a book review about "The Murder of Roger Ackroyd" by Agatha Christie. I want you to analyse the review and provide me two answers: 
      
      First, analyse this review and tell me how much the review has rated the book out of 5. If the review does not provide a numerical rating then output "NA."     

      I want the output to be as such: 
      "Rating: user rating/5.0 or NA"
      
      Second, analyse this review and tell me what the reviewer felt about the book "overall." Choose one word from these words, ${wordsDescribingBook} that describes the reviewer's feelings about the book. 

      Provide the output for these two reviews in an array like this:

      [user rating/5.0, word describing the book]

      Here is the review:

      ${bookReview}
    `;
  const rating = await gptPrompt(prompt, {
    temperature: 0.7,
    max_tokens: 100,
  });
  say(`\n${rating}\n`);
}
