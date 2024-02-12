/**
 * usdToEuro.js converts usd to euro
 */

// $1 = €0.93 (As of February 3, 2024)
const conversion = 0.9254;

const amount = prompt("Enter a dollar amount to two decimal places");

const euros = parseFloat(amount) * conversion;

console.log(`$${amount} is equal to €${euros.toFixed(2)}`);
