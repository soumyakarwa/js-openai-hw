/**
 * multipleChoice.js asks the user 3 multiple choice questions and then tells the user how many they got right.
 * I used ChatGPT to correctly implement the syntax for questions.forEach in line 50.
 */

function checkResponse(letter) {
  if (letter == "A" || letter == "a") {
    return 0;
  } else if (letter == "B" || letter == "b") {
    return 1;
  } else if (letter == "C" || letter == "c") {
    return 2;
  } else {
    return 3;
  }
}

const questions = [
  {
    questionNumber: 1,
    question: "What is the capital of the U.S.?",
    options: [
      "A: New York",
      "B: Los Angeles",
      "C: Washington D.C.",
      "D: Chicago",
    ],
    correctIndex: 2,
  },
  {
    questionNumber: 2,
    question: "Which element is needed to make nuclear weapons and energy?",
    options: ["A: Oxygen", "B: Uranium", "C: Chlorine", "D: Hydrogen"],
    correctIndex: 1,
  },
  {
    questionNumber: 3,
    question: "What is the largest planet in our Solar System?",
    options: ["A: Earth", "B: Neptune", "C: Saturn", "D: Jupiter"],
    correctIndex: 3,
  },
];

console.log(
  "I'm going to ask you three multiple choice questions. They are about general knowledge. You have to answer with the option (A, B, C, or D) you think is correct. At the end of the three questions, I will tell you how many questions you answered correctly. I will also tell you the right answer for those you answered incorrectly."
);

var answeredCorrectly = [false, false, false];

questions.forEach((q) => {
  console.log(`\nQuestion ${q.questionNumber}`);
  console.log(`\n${q.question}`);
  q.options.forEach((opt) => {
    console.log(opt);
  });
  const ans = prompt(`\nAnswer:`);

  if (checkResponse(ans) == q.correctIndex) {
    answeredCorrectly[q.questionNumber - 1] = true;
  }
});

var tally = 3;

answeredCorrectly.forEach((answer, i) => {
  if (answer == false) {
    tally--;
    console.log(
      `The correct answer for Question ${questions[i].questionNumber} was ${
        questions[i].options[questions[i].correctIndex]
      }`
    );
  }
});

console.log(`You got ${tally} questions right!`);
