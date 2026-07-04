const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('predict_response.html', 'utf-8');
const $ = cheerio.load(html);
const colleges = [];

$('.result-card').each((i, el) => {
  const card = $(el);
  const collegeName = card.find('h4').text().trim();
  
  const metaText = card.find('.result-meta').text().replace('📍', '').trim();
  const metaParts = metaText.split('|').map(s => s.trim());
  const district = metaParts[0] || '';
  const university = metaParts[1] || '';
  
  let branch = '';
  let quota = '';
  
  card.find('.result-branch').each((j, branchEl) => {
    const text = $(branchEl).text();
    if (text.includes('Branch:')) {
      branch = text.replace('Branch:', '').trim();
    } else if (text.includes('Quota:')) {
      quota = $(branchEl).find('.quota-badge').text().trim();
    }
  });
  
  const trs = card.find('.round-table tr');
  // the first row is headers, the second is data
  if (trs.length >= 2) {
    const tds = $(trs[1]).find('td');
    const round1 = $(tds[0]).text().trim();
    const round2 = $(tds[1]).text().trim();
    const round3 = $(tds[2]).text().trim();
    const round4 = $(tds[3]).text().trim();
    const average = $(tds[4]).text().trim();
    
    colleges.push({
      rank: i + 1,
      collegeName,
      district,
      university,
      branch,
      quota,
      round1,
      round2,
      round3,
      round4,
      average
    });
  }
});

console.log(`Found ${colleges.length} colleges`);
console.log(colleges[0]);
