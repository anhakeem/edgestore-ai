// api/libs/helpers/generatePDF.ts
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export default async function generatePersonaPDF(persona: any, sessionId: string): Promise<string> {
  const exportDir = path.join(__dirname, '../../public/exports');
  fs.mkdirSync(exportDir, { recursive: true });

  const filename = `persona_profile_${sessionId}.pdf`;
  const fullPath = path.join(exportDir, filename);

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: `EdgeAgent Profile – ${sessionId}`,
      Author: 'EdgeStore AI',
    },
  });

  doc.pipe(fs.createWriteStream(fullPath));

  // 🔰 Insert Logo (Top-Left)
  const logoPath = path.join(__dirname, '../../public/logo-cyan.svg');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 100 });
  }

  doc.fontSize(22).fillColor('cyan').text(`EdgeAgent Profile`, 160, 50);
  doc.fontSize(16).fillColor('gray').text(`Session: ${sessionId}`, 160, 80);
  doc.moveDown(2);

  doc.fontSize(14).fillColor('white');
  doc.text(`🧠 Intent: ${persona.insights?.dominantIntent || 'Unknown'}`);
  doc.text(`⚠️ Churn Risk: ${persona.insights?.churnRisk || 'Unknown'}`);
  doc.text(`🧩 Interests: ${(persona.insights?.interest || []).join(', ') || 'None'}`);
  doc.text(`🕒 Last Seen: ${persona.insights?.lastSeen || 'N/A'}`);
  doc.text(`📊 Total Events: ${persona.insights?.totalEvents ?? 'N/A'}`);

  doc.moveDown();
  doc.fillColor('green').fontSize(15).text('Recommendations', { underline: true });

  doc.fillColor('white').fontSize(12);
  (persona.recommendations || ['No recommendations available.']).forEach((rec: string, i: number) => {
    doc.text(`- ${rec}`);
  });

  doc.end();

  return `/public/exports/${filename}`;
}
