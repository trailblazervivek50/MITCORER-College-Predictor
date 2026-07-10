const fs = require('fs');
const xlsx = require('xlsx');

async function downloadAndParse() {
  const fileId = '1RK6tEpAA62Od4GgQYNbXFv8_ylWCBUnv';
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  console.log(`Downloading from ${url}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Downloaded ${buffer.length} bytes.`);
    
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    console.log('Worksheets:', workbook.SheetNames);
    
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`\nSheet: ${sheetName}`);
      console.log('Headers:', data[0]);
      console.log('Row 1:', data[1]);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

downloadAndParse();
