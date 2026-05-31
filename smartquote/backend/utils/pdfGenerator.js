const PDFDocument = require('pdfkit');

const generateProposalPDF = (quoteData, userData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const primaryColor = '#1a56db';
    const darkColor = '#111827';
    const mutedColor = '#6b7280';
    const lightBg = '#f9fafb';

    // ─── HEADER ───────────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 110).fill(primaryColor);

    doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold')
      .text('SMARTQUOTE', 50, 30);

    doc.fontSize(10).fillColor('rgba(255,255,255,0.8)').font('Helvetica')
      .text('Freelance Pricing Intelligence', 50, 62);

    doc.fontSize(10).fillColor('#ffffff').font('Helvetica')
      .text(`Proposal Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 82);

    // ─── PROPOSAL TITLE ───────────────────────────────────────────────────────
    doc.fillColor(darkColor).font('Helvetica-Bold').fontSize(20)
      .text('PROJECT PROPOSAL', 50, 130);

    doc.moveTo(50, 158).lineTo(545, 158).strokeColor(primaryColor).lineWidth(2).stroke();

    // ─── FROM / TO SECTION ────────────────────────────────────────────────────
    doc.y = 175;

    // FROM block
    doc.fontSize(9).fillColor(mutedColor).font('Helvetica-Bold').text('FROM', 50, 175);
    doc.fontSize(12).fillColor(darkColor).font('Helvetica-Bold')
      .text(userData.name || 'Freelancer', 50, 190);
    doc.fontSize(10).fillColor(mutedColor).font('Helvetica')
      .text(userData.email || '', 50, 207)
      .text(userData.country || '', 50, 222);

    // TO block
    doc.fontSize(9).fillColor(mutedColor).font('Helvetica-Bold').text('PREPARED FOR', 300, 175);
    doc.fontSize(12).fillColor(darkColor).font('Helvetica-Bold')
      .text(quoteData.clientName || 'Valued Client', 300, 190);
    doc.fontSize(10).fillColor(mutedColor).font('Helvetica')
      .text('Project Stakeholder', 300, 207);

    // ─── PROJECT SCOPE ────────────────────────────────────────────────────────
    doc.moveTo(50, 255).lineTo(545, 255).strokeColor('#e5e7eb').lineWidth(1).stroke();

    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold')
      .text('PROJECT SCOPE', 50, 270);

    const inputs = quoteData.inputs;
    doc.rect(50, 290, 495, 80).fill(lightBg).stroke('#e5e7eb');

    const scopeData = [
      ['Service', inputs.skill],
      ['Experience Level', capitalize(inputs.experienceLevel)],
      ['Complexity', capitalize(inputs.complexity)],
      ['Timeline', capitalize(inputs.urgency)],
      ['Estimated Hours', `${inputs.estimatedHours} hours`],
      ['Market', inputs.country]
    ];

    let sx = 55, sy = 298;
    scopeData.forEach((item, i) => {
      const col = i % 2 === 0 ? 0 : 250;
      const row = Math.floor(i / 2);
      doc.fontSize(8).fillColor(mutedColor).font('Helvetica').text(item[0].toUpperCase(), sx + col, sy + row * 22);
      doc.fontSize(10).fillColor(darkColor).font('Helvetica-Bold').text(item[1], sx + col + 95, sy + row * 22);
    });

    // ─── PRICING SUMMARY ──────────────────────────────────────────────────────
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold')
      .text('PRICING SUMMARY', 50, 390);

    const result = quoteData.result;

    // Pricing table header
    doc.rect(50, 412, 495, 24).fill(primaryColor);
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
      .text('Description', 60, 419)
      .text('Amount (USD)', 430, 419);

    const pricingRows = [
      ['Base Market Rate (per hour)', `$${result.baseHourly}`],
      ['After Experience Adjustment', `$${result.levelAdjusted}`],
      ['After Complexity Adjustment', `$${result.complexityAdjusted}`],
      ['After Market Calibration', `$${result.countryAdjusted}`],
      ['After Urgency Premium', `$${result.urgencyAdjusted}`],
      ['After Overhead (20%)', `$${result.hourlyWithOverhead}`],
    ];

    let ry = 436;
    pricingRows.forEach((row, i) => {
      if (i % 2 === 0) doc.rect(50, ry, 495, 20).fill('#f3f4f6');
      doc.fontSize(9).fillColor(darkColor).font('Helvetica')
        .text(row[0], 60, ry + 5)
        .text(row[1], 430, ry + 5, { width: 100, align: 'right' });
      ry += 20;
    });

    // Final totals
    doc.rect(50, ry, 495, 28).fill(primaryColor);
    doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold')
      .text('RECOMMENDED HOURLY RATE', 60, ry + 8)
      .text(`$${result.finalHourly}/hr`, 390, ry + 8, { width: 150, align: 'right' });
    ry += 28;

    doc.rect(50, ry, 495, 32).fill('#1e3a8a');
    doc.fontSize(13).fillColor('#ffffff').font('Helvetica-Bold')
      .text('TOTAL FIXED PRICE', 60, ry + 9)
      .text(`$${result.fixedPrice.toLocaleString()}`, 390, ry + 9, { width: 150, align: 'right' });
    ry += 32;

    // ─── MILESTONES ───────────────────────────────────────────────────────────
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold')
      .text('PAYMENT MILESTONES', 50, ry + 20);

    const milestones = [
      { phase: 'Project Kickoff (Deposit)', pct: 30 },
      { phase: 'Mid-Project Delivery', pct: 40 },
      { phase: 'Final Delivery & Approval', pct: 30 }
    ];

    let my = ry + 45;
    milestones.forEach((m, i) => {
      const amount = ((result.fixedPrice * m.pct) / 100).toFixed(2);
      doc.rect(50, my, 495, 22).fill(i % 2 === 0 ? lightBg : '#ffffff').stroke('#e5e7eb');
      doc.fontSize(9).fillColor(darkColor).font('Helvetica')
        .text(`${i + 1}. ${m.phase}`, 60, my + 6)
        .text(`${m.pct}% — $${parseFloat(amount).toLocaleString()}`, 390, my + 6, { width: 150, align: 'right' });
      my += 22;
    });

    // ─── JUSTIFICATION ────────────────────────────────────────────────────────
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold')
      .text('PRICING RATIONALE', 50, my + 20);

    doc.rect(50, my + 42, 495, 75).fill(lightBg).stroke('#e5e7eb');
    doc.fontSize(9).fillColor(darkColor).font('Helvetica')
      .text(result.justification, 60, my + 50, { width: 475, lineGap: 4 });

    // ─── TERMS ────────────────────────────────────────────────────────────────
    const termsY = my + 130;
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold')
      .text('TERMS & CONDITIONS', 50, termsY);

    const terms = [
      '1. This quote is valid for 30 days from the date of issue.',
      '2. All prices are in USD. International wire transfer fees are the responsibility of the client.',
      '3. Scope changes after project commencement may result in revised pricing.',
      '4. Intellectual property transfers to the client upon receipt of final payment.',
      '5. Work begins upon receipt of the deposit and signed agreement.'
    ];

    let ty = termsY + 22;
    terms.forEach(term => {
      doc.fontSize(8).fillColor(darkColor).font('Helvetica').text(term, 50, ty, { lineGap: 2 });
      ty += 16;
    });

    // ─── FOOTER ───────────────────────────────────────────────────────────────
    doc.rect(0, doc.page.height - 50, doc.page.width, 50).fill('#111827');
    doc.fontSize(8).fillColor('#9ca3af').font('Helvetica')
      .text('Generated by SmartQuote · Freelance Pricing Intelligence · smartquote.app', 50, doc.page.height - 30, {
        align: 'center', width: doc.page.width - 100
      });

    doc.end();
  });
};

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

module.exports = { generateProposalPDF };
