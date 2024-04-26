// Note: Adjusted to async function
// document.getElementById("generate").addEventListener("click", async () => {});

var mentionedCities = [];

async function myGPTPrompt(promptText) {
  try {
    const response = await fetch(
      `/api/gpt?prompt=${encodeURIComponent(promptText)}`
    ).then((response) => response.text());
    return response;
  } catch (error) {
    throw error; // Rethrow the error to be caught by the caller
  }
}

document.getElementById("send-button").addEventListener("click", function () {
  console.log("button clicked");
  var input = document.getElementById("message-input");
  var message = input.value.trim();
  if (message) {
    // Display the user message
    displayMessage(message, "user");

    // Clear the input field
    input.value = "";

    // Generate a computer response
    computerResponse(message);
  }
});

function displayMessage(message, sender) {
  var chatBox = document.getElementById("chat-box");
  var messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender + "-message");
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  mentionedCities.push(message);
  // Scroll to the bottom of the chat box
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function computerResponse(message) {
  // Just a timeout to simulate delay
  setTimeout(async function () {
    const funFactContent = document.getElementById("fun-fact-content");

    const promptText = `
    We are playing a game of Atlas. The game starts with me saying the name of a cities starting with letter S. After that you will say the name of another city starting with the last letter of the city I said. Then I have to say the name of another city starting with the last letter of the city name I just said. For example, if I say Sydney, you can say Yonkers and then I would say Seoul and then you can say Lucknow and so forth. A few more rules:

    1. We cannot mention any cities from this array: ${mentionedCities}
    2. We can only mention cities. We cannot mention Countries, Continents, etc. 
    
    I have said ${message}. Name a city starting the last letter of ${message}. Please also mention a fun fact about the city you name. Make sure the fun fact is about 75 words

    Ensure the output is strictly in JSON format, suitable for parsing with JSON.parse(). The format should be as follows:
    
    {
      "city": {city}
      "funfact": {funfact}
    }

    {city} should be with the first letter upper case and rest lower case, for example: "Indore"
    {funfact} should be about 75 words. 
    
    
    For EXAMPLE, if you say "Indore", the json format would be:

    {
      "city": "Indore",
      "funfact": {"Indore, a bustling city in the heart of India's Madhya Pradesh state, stands out for its vibrant culture and historical richness. Often dubbed as the 'Food Capital of India,' Indore's culinary scene is famous for its delectable street food, particularly the Sarafa Bazaar, which comes alive at night with an array of sweets and snacks. The city is also known for hosting the Kumbh Mela, one of the world's largest religious gatherings, every 12 years. Remarkably, Indore has been awarded the title of India's cleanest city multiple times in a row, reflecting its residents' commitment to cleanliness and sustainability. This thriving city seamlessly blends tradition with modernity, making it a fascinating destination for travelers and locals alike."}
    }
  `;
    var response;
    var obj;

    try {
      response = await myGPTPrompt(promptText);
      const cleanedString = response
        .replace("```json", "")
        .replace("```json ", "")
        .replace("```", "")
        .replace("``` ", "");
      obj = JSON.parse(cleanedString);
      console.log(obj);
    } catch (error) {
      console.error(error); // Log any errors
      funFactContent.innerHTML = "There was an error processing your request.";
    }
    console.log(mentionedCities);
    displayMessage(obj.city, "computer");
    funFactContent.innerHTML = obj.funfact;
  }, 1000);
}