const fs = require("fs");

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY environment variable is not set.");
}

fs.writeFileSync("config.js", `const API_KEY = ${JSON.stringify(apiKey)};\n`);

console.log("config.js generated successfully.");
