import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const fmt = (n) => `Rs. ${Number(n).toLocaleString('en-IN')}`;

export async function generatePdfReport(result, chartsElement) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  doc.setFontSize(18);
  doc.text('TaxLedger — Tax Report', 40, 50);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${now}`, 40, 68);

  autoTable(doc, {
    startY: 90,
    head: [['Salary Details', '']],
    body: [
      ['Gross Salary', fmt(result.grossSalary)],
      ['Standard Deduction', fmt(result.standardDeduction)],
      ['Taxable Income', fmt(result.taxableIncome)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [20, 32, 58] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Income Range', 'Rate', 'Tax']],
    body: result.breakdown.map((s) => [s.range, `${s.rate}%`, fmt(s.taxOnSlab)]),
    theme: 'grid',
    headStyles: { fillColor: [20, 32, 58] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Summary', '']],
    body: [
      ...(result.rebateApplied > 0 ? [['Section 87A Rebate', `- ${fmt(result.rebateApplied)}`]] : []),
      ...(result.surcharge > 0 ? [['Surcharge', `+ ${fmt(result.surcharge)}`]] : []),
      ['Health & Education Cess', `+ ${fmt(result.cess)}`],
      ['Total Tax Payable', fmt(result.totalTax)],
      ['Net Take-Home (Annual)', fmt(result.netTakeHome)],
      ['Net Take-Home (Monthly)', fmt(Math.round(result.netTakeHome / 12))],
    ],
    theme: 'grid',
    headStyles: { fillColor: [20, 32, 58] },
  });

  // Embed charts as an image if a DOM node was passed in
  if (chartsElement) {
    const canvas = await html2canvas(chartsElement, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 515;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addPage();
    doc.setFontSize(14);
    doc.text('Visual Breakdown', 40, 40);
    doc.addImage(imgData, 'PNG', 40, 60, imgWidth, imgHeight);
  }

  doc.save(`tax-report-${Date.now()}.pdf`);
}

export function exportToExcel(result) {
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ['TaxLedger — Tax Report'],
    ['Generated', new Date().toLocaleString('en-IN')],
    [],
    ['Gross Salary', result.grossSalary],
    ['Standard Deduction', result.standardDeduction],
    ['Taxable Income', result.taxableIncome],
    ['Rebate Applied', result.rebateApplied || 0],
    ['Surcharge', result.surcharge || 0],
    ['Cess', result.cess],
    ['Total Tax', result.totalTax],
    ['Net Take-Home (Annual)', result.netTakeHome],
    ['Net Take-Home (Monthly)', Math.round(result.netTakeHome / 12)],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  const slabSheet = XLSX.utils.json_to_sheet(
    result.breakdown.map((s) => ({
      'Income Range': s.range,
      'Rate (%)': s.rate,
      'Tax on Slab': s.taxOnSlab,
    }))
  );
  XLSX.utils.book_append_sheet(wb, slabSheet, 'Slab Breakdown');

  XLSX.writeFile(wb, `tax-report-${Date.now()}.xlsx`);
}

export function buildShareUrl(calculationId) {
  return `${window.location.origin}/shared/${calculationId}`;
}