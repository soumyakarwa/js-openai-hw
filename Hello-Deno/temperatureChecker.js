/**
 * temperatureChecker.js takes the temperature in Fahrenheit and then outputs “cold”, “warm”, or “hot”.
 */

function checkTemperature(temp) {
  if (temp < 50) {
    return "cold";
  } else if (temp >= 50 && temp <= 80) {
    return "warm";
  } else {
    return "hot";
  }
}

const temperature = prompt(
  "What is the temperature right now? In Fahrenheit..."
);
console.log(`Currently it's ${checkTemperature(temperature)}!`);
