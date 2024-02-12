/**
 * randomNumberGenerator.js prints a random number between 1 and 6 (inclusive)
 * I used ChatGPT to experiment with how to generate a random number with inclusive bounds
 */

const type = prompt(
  "Do you want to generate a random integer or decimal between 1 and 6 inclusive?"
);

var randomNumber;

if (
  type.includes("integer") ||
  type.includes("Integer") ||
  type.includes("int")
) {
  randomNumber = Math.floor(Math.random() * 6) + 1;
} else {
  randomNumber = Math.random() * (6 - 1) + 1;
}

console.log(`A random number between 1 and 6 inclusive is ${randomNumber}`);
