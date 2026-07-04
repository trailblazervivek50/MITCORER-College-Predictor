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
    
    // Lookup dataset mapping College Name -> Official DTE College Code
    const dteCollegeCodes: Record<string, string> = {
      "MIT College of Railway Engineering & Research, Barshi": "6901",
      "JSPM Narhe Technical Campus, Pune": "6278",
      "COEP Technological University": "6006",
      "Shivnagar Vidya Prasarak Mandal's College of Engineering, Malegaon-Baramati": "6111"
    };

    $('.result-card').each((i, el) => {
      const card = $(el);
      const collegeName = card.find('h4').text().trim();
      
      const metaText = card.find('.result-meta').text().replace('📍', '').trim();
      const metaParts = metaText.split('|').map(s => s.trim());
      const district = metaParts[0] || '';
      
      // Fetch Official DTE College Code from lookup dataset, defaulting to "N/A"
      const collegeCode = dteCollegeCodes[collegeName] || "N/A";
      
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
      
      // Parse every <tr> from the returned HTML table. We skip the first row (headers).
      trs.each((rowIdx, rowEl) => {
        if (rowIdx === 0) return; // Skip headers
        
        const tds = $(rowEl).find('td');
        // Verify that every row contains the expected number of columns (5) before parsing
        if (tds.length === 5) {
          // Read every <td> separately and trim whitespace
          const val1 = tds.eq(0).text().trim();
          const val2 = tds.eq(1).text().trim();
          const val3 = tds.eq(2).text().trim();
          const val4 = tds.eq(3).text().trim();
          const valAvg = tds.eq(4).text().trim();
          
          // Handle "-" values correctly by defaulting to "-" if empty
          round1 = val1 && val1 !== '' ? val1 : '-';
          round2 = val2 && val2 !== '' ? val2 : '-';
          round3 = val3 && val3 !== '' ? val3 : '-';
          round4 = val4 && val4 !== '' ? val4 : '-';
          average = valAvg && valAvg !== '' ? valAvg : '-';
        }
      });
      
      if (collegeName) {
        predictions.push({
          rank: i + 1,
          collegeCode,
          collegeName,
          district,
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
