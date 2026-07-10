const fs = require('fs');
const html = fs.readFileSync('debug_response.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);

let foundCode = false;
$('.result-card').each((i, el) => {
  const text = $(el).text();
  const codes = text.match(/\b\d{4}\b/g);
  if (codes) {
    console.log(`Card ${i} contains potential codes:`, codes);
    foundCode = true;
  }
});
if (!foundCode) {
  console.log("NO 4-DIGIT CODES FOUND IN ANY RESULT CARD.");
}
