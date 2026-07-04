async function testParam(exam_type) {
  const formData = new URLSearchParams();
  formData.append('exam_type', exam_type);
  formData.append('pred_mode', 'percentile');
  formData.append('score', '95');
  formData.append('district', 'Pune');
  formData.append('gender', 'Male');
  formData.append('category', 'OPEN');

  const res = await fetch('https://eduvale.in/mht-cet/college-predictor/predict.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  });
  const html = await res.text();
  console.log(`Exam type: '${exam_type}', Status: ${res.status}, Length: ${html.length}`);
  if (html.length > 200) {
     require('fs').writeFileSync('predict_response.html', html);
  }
}

async function run() {
  await testParam('MHT CET');
  await testParam('MHTCET');
  await testParam('mht cet');
  await testParam('CET');
}

run();
