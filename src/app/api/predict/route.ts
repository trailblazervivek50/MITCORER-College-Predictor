import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create form data to forward to Eduvale prediction engine
    const formData = new URLSearchParams();
    
    // Exactly send these required fields based on the student form
    formData.append('exam_type', body.exam_type || 'MHT-CET');
    formData.append('pred_mode', body.pred_mode || 'percentile');
    formData.append('score', body.score?.toString() || '');
    formData.append('district', body.district || 'Any');
    formData.append('gender', body.gender || 'Male');
    formData.append('category', body.category || 'OPEN');
    
    // Extensible fields (as per requirements for later)
    if (body.branch && Array.isArray(body.branch)) {
      body.branch.forEach((b: string) => formData.append('branch[]', b));
    } else if (body.branch) {
      formData.append('branch', body.branch);
    }
    
    if (body.tfws) formData.append('tfws', body.tfws);
    if (body.ews) formData.append('ews', body.ews);
    if (body.university) formData.append('university', body.university);

    const response = await fetch('https://eduvale.in/mht-cet/college-predictor/predict.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from prediction engine: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const colleges: any[] = [];

    // Parse the returned HTML table
    // Adjust selectors based on the actual HTML structure of eduvale's predict.php output
    // The prompt says "Parse every row" so we'll look for tr elements within tbody
    $('table tbody tr').each((i, row) => {
      const columns = $(row).find('td');
      if (columns.length > 0) {
        // Extracting based on typical table structure. Might need adjustments.
        // Assuming columns: College, District, University, Branch, Quota, R1, R2, R3, R4, Avg
        const collegeName = $(columns[0]).text().trim();
        const district = $(columns[1]).text().trim();
        const university = $(columns[2]).text().trim();
        const branch = $(columns[3]).text().trim();
        const quota = $(columns[4]).text().trim();
        const round1 = $(columns[5]).text().trim();
        const round2 = $(columns[6]).text().trim();
        const round3 = $(columns[7]).text().trim();
        const round4 = $(columns[8]).text().trim();
        const average = $(columns[9]).text().trim();

        // Only add if we actually extracted a college name
        if (collegeName) {
          colleges.push({
            id: i.toString(),
            name: collegeName,
            district,
            university,
            branch,
            quota,
            round1,
            round2,
            round3,
            round4,
            average,
          });
        }
      }
    });

    // If no table found, fallback to checking result-card or other structures if necessary
    // But the prompt specifically states "The prediction engine returns an HTML table."
    
    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('Error in prediction API:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
