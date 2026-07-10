const fs = require('fs');


async function testParams() {
  const variations = [
    { pred_mode: 'score', score: '95' },
    { pred_mode: 'rank', score: '1000' }
  ];

  for (const v of variations) {
    const formData = new URLSearchParams();
    formData.append('exam_type', 'MHTCET');
    formData.append('pred_mode', v.pred_mode);
    formData.append('score', v.score);
    formData.append('district', 'Pune');
    formData.append('gender', 'Male');
    formData.append('category', 'OPEN');

    const res = await fetch('https://eduvale.in/mht-cet/college-predictor/predict.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    
    const html = await res.text();
    console.log(`pred_mode: ${v.pred_mode}, length: ${html.length}`);
    if (html.includes('<table') && !html.includes('result-card')) {
        console.log(`FOUND DIFFERENT TABLE FOR ${v.pred_mode}!`);
        fs.writeFileSync(`debug_${v.pred_mode}.html`, html);
    }
  }
}
testParams();
