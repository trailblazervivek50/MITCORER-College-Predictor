const fs = require('fs');
const cheerio = require('cheerio'); // Since we installed it in the project

const html = fs.readFileSync('predict_home.html', 'utf-8');
const $ = cheerio.load(html);

$('input, select').each((i, el) => {
  const name = $(el).attr('name');
  const type = $(el).attr('type') || el.tagName.toLowerCase();
  const value = $(el).attr('value') || '';
  if (name) {
    console.log(`Name: ${name}, Type: ${type}, Value: ${value}`);
    if (type === 'select') {
      $(el).find('option').each((j, opt) => {
        console.log(`  Option: ${$(opt).attr('value')} (${$(opt).text().trim()})`);
      });
    }
  }
});
