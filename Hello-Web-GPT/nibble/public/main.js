// Note: Adjusted to async function
document.getElementById("generate").addEventListener("click", async () => {
  const subject = document.getElementById("subject").value;
  const complexity = document.getElementById("complexity").value;
  const time = document.getElementById("time").value;

  const interimDiv = document.getElementById("interim-text");
  const lessonTitleDiv = document.getElementById("lesson-title");
  const sectionTitleDiv1 = document.getElementById("section-title1");
  const sectionTitleDiv2 = document.getElementById("section-title2");
  const sectionContentDiv1 = document.getElementById("section-content1");
  const sectionContentDiv2 = document.getElementById("section-content2");

  if (subject && complexity && time) {
    interimDiv.innerHTML = `Working on your lesson...`;
    lessonTitleDiv.innerHTML = ``;
    sectionContentDiv1.innerHTML = ``;
    sectionTitleDiv1.innerHTML = ``;
    sectionContentDiv2.innerHTML = ``;
    sectionTitleDiv2.innerHTML = ``;
    const promptText = `
      You are a knowledge expanding AI bot. Tell me a quick bite lesson like in Khan Academy or Brilliant.org about ${subject}. I want the quick bit lesson to be at a ${complexity} level and easy to digest in ${time} minutes. For example, if I select "History, intermediate", you could tell me something about the Indus Valley Civilization. If I select "Logic, easy", you could explain some mathematical logic at high-school or early college level. 

      Make the length of the lesson appropriate to the ${time} selected. For instance, if ${time} is 5 minutes, then make the lesson 200 words total. For instance, if ${time} is 10 minutes, then make the lesson 500 words total. For instance, if ${time} is 10 minutes, then make the lesson 700 words total. 

      Ensure the output is strictly in JSON format, suitable for parsing with JSON.parse(). The format should be as follows:
      
      {
        "lesson": {lessonTitle}
        "part1": {"title": {title}, "content": {content}}
        "part2": {title: {title}, "content": {content}}
      }

      {lessonTitle} should be a short snippy title that describes the lesson
      {title} of part1 should be the title for a short introduction to the lesson
      {content} of part1 should be the the short introduction to the lesson
      {title} of part2 should be the title for a specific part of the lesson
      {content} of part2 should be the the specific content of the lesson
      
      
      For EXAMPLE, if you're teaching me about the Indus Valley Civilization, the json format would be:

      {
        "lesson": "Urban Planning of the Indus Valley Civilization",
        "part1": {"title": "What is the Indus Valley Civilization", "content": "some introductory content about the indus valley"}
        "part2": {"title": "How was the Indus Valley Urban Planning special?", "content": "content about the specifics"}
      }
        
    `;

    try {
      // Await the async nibblePrompt function
      const response = await nibblePrompt(promptText);
      // Use innerHTML to display the result
      interimDiv.innerHTML = ``;
      const cleanedString = response
        .replace("```json", "")
        .replace("```json ", "")
        .replace("```", "")
        .replace("``` ", "");
      const obj = JSON.parse(cleanedString);
      console.log(obj.lesson);
      lessonTitleDiv.innerHTML = `${obj.lesson}`;
      sectionTitleDiv1.innerHTML = `${obj.part1.title}`;
      sectionContentDiv1.innerHTML = `${obj.part1.content}`;
      sectionTitleDiv2.innerHTML = `${obj.part2.title}`;
      sectionContentDiv2.innerHTML = `${obj.part2.content}`;
    } catch (error) {
      console.error(error); // Log any errors
      resultDiv.innerHTML = "There was an error processing your request.";
    }
  } else {
    resultDiv.innerHTML = "Please make sure all selections are made!";
  }
});

async function nibblePrompt(promptText) {
  try {
    const response = await fetch(
      `/api/gpt?prompt=${encodeURIComponent(promptText)}`
    ).then((response) => response.text());
    return response;
  } catch (error) {
    throw error; // Rethrow the error to be caught by the caller
  }
}
