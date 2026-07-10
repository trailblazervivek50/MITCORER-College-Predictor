const fs = require('fs');

async function downloadHTML() {
  const formData = new URLSearchParams();
  formData.append('exam_type', 'MHTCET');
  formData.append('pred_mode', 'percentile');
  formData.append('score', '85');
  formData.append('district', 'Pune');
  formData.append('gender', 'Male');
  formData.append('category', 'OPEN');

  const res = await fetch('https://eduvale.in/mht-cet/college-predictor/predict.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  });
  
  const html = await res.text();
  fs.writeFileSync('debug_response.html', html);
  console.log(`Saved ${html.length} bytes to debug_response.html`);
}

downloadHTML();
