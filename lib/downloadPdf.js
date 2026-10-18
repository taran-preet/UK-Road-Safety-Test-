import { jsPDF } from "jspdf";

const grade = (h) => (h >= 9 ? "A+" : h >= 6 ? "B" : h >= 3 ? "C" : "D");
const feedback = (h) =>
  h >= 9
    ? "Excellent hazard awareness. You spotted almost everything early."
    : h >= 6
      ? "Good work. A few developing hazards slipped past you."
      : h >= 3
        ? "Fair. Keep scanning side roads, kerbs and driveways."
        : "Needs practice. Look for vehicles that signal, creep or pull away.";

export function downloadPdf({ name, score, hits, misses, pct }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const total = hits + misses;
  let y = 0;

  // --- Header background ---
  doc.setFillColor(11, 61, 145);
  doc.rect(0, 0, W, 110, "F");

  // Badge
  doc.setFillColor(255, 255, 255, 0.18);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.roundedRect(40, 22, 160, 18, 3, 3, "S");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("UK HAZARD PERCEPTION TEST", 120, 34, { align: "center" });

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`Test Result — ${name}`, 40, 65);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 215, 240);
  doc.text("Official hazard perception assessment report", 40, 82);

  // Date/time top right
  doc.setFontSize(8);
  doc.setTextColor(200, 215, 240);
  doc.text(`${date}  |  ${time}`, W - 40, 34, { align: "right" });

  y = 130;

  // --- Score Cards (3 boxes) ---
  const cards = [
    {
      label: "POINTS",
      value: `${score}`,
      bg: [255, 247, 220],
      border: [242, 182, 50],
      text: [140, 100, 0],
    },
    {
      label: "Scored",
      value: `${pct}%`,
      bg: [230, 249, 240],
      border: [76, 195, 138],
      text: [26, 138, 85],
    },
    {
      label: "GRADE",
      value: grade(hits),
      bg: [232, 238, 255],
      border: [107, 140, 255],
      text: [42, 79, 214],
    },
  ];
  const cardW = (W - 80 - 20) / 3;
  cards.forEach((c, i) => {
    const x = 40 + i * (cardW + 10);
    doc.setFillColor(...c.bg);
    doc.setDrawColor(...c.border);
    doc.setLineWidth(1);
    doc.roundedRect(x, y, cardW, 70, 8, 8, "FD");
    doc.setTextColor(...c.text);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text(c.value, x + cardW / 2, y + 38, { align: "center" });
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 115, 130);
    doc.text(c.label, x + cardW / 2, y + 56, { align: "center" });
  });

  y += 90;

  // --- Section: Test Breakdown ---
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(140, 150, 163);
  doc.text("TEST BREAKDOWN", 40, y);
  y += 10;

  const rows = [
    ["Hazards Stopped", `${hits} / ${total}`],
    ["Hazards Missed", `${misses}`],
    ["Test Duration", "60 seconds"],
    ["Points per Hazard", "30 pts"],
  ];
  rows.forEach((row, i) => {
    const rowY = y + i * 30;
    doc.setFillColor(
      i % 2 === 0 ? 247 : 255,
      i % 2 === 0 ? 249 : 255,
      i % 2 === 0 ? 252 : 255,
    );
    doc.rect(40, rowY, W - 80, 26, "F");
    doc.setDrawColor(237, 240, 244);
    doc.setLineWidth(0.5);
    doc.line(40, rowY + 26, W - 40, rowY + 26);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(74, 85, 104);
    doc.text(row[0], 54, rowY + 17);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 35, 50);
    doc.text(row[1], W - 54, rowY + 17, { align: "right" });
  });

  y += rows.length * 30 + 20;

  // --- Detection Rate Bar ---
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(140, 150, 163);
  doc.text("DETECTION RATE", 40, y);
  y += 10;

  const barW = W - 80;
  doc.setFillColor(237, 240, 244);
  doc.roundedRect(40, y, barW, 12, 6, 6, "F");
  doc.setFillColor(76, 195, 138);
  doc.roundedRect(40, y, barW * (pct / 100), 12, 6, 6, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 138, 85);
  doc.text(`${pct}%`, W - 40, y + 9, { align: "right" });

  y += 30;

  // --- Feedback ---
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(140, 150, 163);
  doc.text("FEEDBACK", 40, y);
  y += 10;

  doc.setFillColor(240, 247, 255);
  doc.setDrawColor(197, 216, 245);
  doc.setLineWidth(1);
  doc.roundedRect(40, y, W - 80, 44, 6, 6, "FD");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(45, 74, 122);
  const lines = doc.splitTextToSize(feedback(hits), W - 110);
  doc.text(lines, 54, y + 16);

  y += 64;

  // --- Footer ---
  doc.setFillColor(247, 249, 252);
  doc.rect(0, y, W, 36, "F");
  doc.setDrawColor(237, 240, 244);
  doc.setLineWidth(0.5);
  doc.line(0, y, W, y);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(138, 150, 163);
  doc.text("UK Road Hazard Perception Test", 40, y + 22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 85, 104);
  // doc.text('hazard-next.app', W - 40, y + 22, { align: 'right' });

  doc.save(`hazard-result-${name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}
