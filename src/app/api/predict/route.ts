import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  let body: any;
  let html = '';
  let responseStatus = 0;
  let responseHeaders = {};

  try {
    body = await request.json();
    
    // Create form data to forward to Eduvale prediction engine
    const formData = new URLSearchParams();
    
    // Map Exam Type appropriately
    let examTypeVal = body.exam_type || 'MHT-CET';
    if (examTypeVal === 'MHT-CET') examTypeVal = 'MHTCET';
    // 'JEE' is usually accepted as 'JEE'
    
    // Exactly send these required fields based on the student form
    formData.append('exam_type', examTypeVal);
    formData.append('pred_mode', body.pred_mode || 'percentile');
    formData.append('score', body.score?.toString() || '');
    formData.append('district', body.district || 'Any');
    formData.append('gender', body.gender || 'Male');
    formData.append('category', body.category || 'OPEN');
    
    // Extensible fields
    if (body.branch && Array.isArray(body.branch)) {
      body.branch.forEach((b: string) => formData.append('branch[]', b));
    } else if (body.branch) {
      formData.append('branch', body.branch);
    }
    
    if (body.tfws) formData.append('tfws', 'true');
    if (body.ews) formData.append('ews', 'true');
    if (body.university) formData.append('university', body.university);

    const targetUrl = 'https://eduvale.in/mht-cet/college-predictor/predict.php';
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    responseStatus = response.status;
    responseHeaders = Object.fromEntries(response.headers.entries());

    if (!response.ok) {
      throw new Error(`Failed to fetch from prediction engine: ${response.statusText}`);
    }

    html = await response.text();
    const $ = cheerio.load(html);
    
    const predictions: any[] = [];

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
      let round1 = '-', round2 = '-', round3 = '-', round4 = '-', average = '-';
      
      if (trs.length >= 2) {
        const tds = $(trs[1]).find('td');
        round1 = $(tds[0]).text().trim() || '-';
        round2 = $(tds[1]).text().trim() || '-';
        round3 = $(tds[2]).text().trim() || '-';
        round4 = $(tds[3]).text().trim() || '-';
        average = $(tds[4]).text().trim() || '-';
      }
      
      if (collegeName) {
        predictions.push({
          rank: i + 1,
          collegeName,
          district,
          university,
          branch,
          quota,
          r1: round1,
          r2: round2,
          r3: round3,
          r4: round4,
          average
        });
      }
    });

    if (predictions.length === 0) {
      console.warn("Prediction Parsing Warning: No colleges extracted.");
      console.log("POST payload:", formData.toString());
      console.log("Request URL:", targetUrl);
      console.log("HTTP Status:", responseStatus);
      console.log("Response Headers:", responseHeaders);
      console.log("HTML Sample:", html.substring(0, 1000));
    }

    return NextResponse.json({
      student: {
        name: body.fullName || '',
        score: body.score || '',
        category: body.category || '',
        district: body.district || '',
        gender: body.gender || ''
      },
      predictions
    });

  } catch (error) {
    console.error('Error in prediction API:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
