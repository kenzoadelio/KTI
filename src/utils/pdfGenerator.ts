import { jsPDF } from 'jspdf';
import { ProposalData } from '../types';

export interface PdfExportOptions {
  schoolName?: string;
  authorName?: string;
  academicYear?: string;
  includeCoverPage?: boolean;
  citationStyle?: 'APA' | 'Harvard' | 'IEEE';
}

export function generateProposalPdf(proposal: ProposalData, options: PdfExportOptions = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 25;
  const marginRight = 20;
  const marginTop = 25;
  const marginBottom = 25;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let currentY = marginTop;

  // Helper to add a new page with header & footer
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginTop;
      return true;
    }
    return false;
  };

  const addHeaderAndFooter = () => {
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Skip header & footer on cover page if cover page exists
      if (options.includeCoverPage && i === 1) {
        continue;
      }

      // Running header
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Proposal Karya Tulis Ilmiah (KTI)', marginLeft, 15);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(marginLeft, 17, pageWidth - marginRight, 17);

      // Running footer with page number
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const pageStr = options.includeCoverPage ? `${i - 1}` : `${i}`;
      doc.text(pageStr, pageWidth - marginRight, pageHeight - 12, { align: 'right' });
    }
  };

  // 1. Optional Cover Page
  if (options.includeCoverPage) {
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);

    doc.text('PROPOSAL KARYA TULIS ILMIAH', pageWidth / 2, 45, { align: 'center' });

    doc.setFontSize(13);
    const titleLines = doc.splitTextToSize(proposal.judul.toUpperCase(), contentWidth - 10);
    doc.text(titleLines, pageWidth / 2, 60, { align: 'center' });

    // Decorative divider line
    doc.setDrawColor(30, 64, 175); // Deep blue
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 25, 80 + (titleLines.length - 1) * 6, pageWidth / 2 + 25, 80 + (titleLines.length - 1) * 6);

    // Meta box
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const startMetaY = 125;
    doc.text(`Bidang Penelitian : ${proposal.bidang}`, pageWidth / 2, startMetaY, { align: 'center' });
    doc.text(`Jenjang Peneliti   : ${proposal.jenjang}`, pageWidth / 2, startMetaY + 8, { align: 'center' });
    doc.text(`Pendekatan Riset   : ${proposal.pendekatan}`, pageWidth / 2, startMetaY + 16, { align: 'center' });

    // Author & School block at bottom
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('Disusun Oleh:', pageWidth / 2, 210, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(options.authorName || 'Tim Peneliti Siswa', pageWidth / 2, 218, { align: 'center' });

    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(options.schoolName || 'Lembaga Pendidikan / Sekolah', pageWidth / 2, 245, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.text(`Tahun ${options.academicYear || new Date().getFullYear()}`, pageWidth / 2, 253, { align: 'center' });

    // Move to next page for Chapter 1
    doc.addPage();
    currentY = marginTop;
  }

  // 2. Document Title on First Page
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('PROPOSAL KARYA TULIS ILMIAH', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  const headerTitleLines = doc.splitTextToSize(proposal.judul.toUpperCase(), contentWidth);
  doc.text(headerTitleLines, pageWidth / 2, currentY, { align: 'center' });
  currentY += headerTitleLines.length * 6 + 6;

  // Metadata subheader
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  doc.text(`Bidang: ${proposal.bidang} | Jenjang: ${proposal.jenjang} | Metode: ${proposal.pendekatan}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
  currentY += 10;

  // Helper for Chapter Header
  const renderChapterHeader = (chapRoman: string, chapTitle: string) => {
    checkPageBreak(30);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text(`BAB ${chapRoman}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    doc.text(chapTitle, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
  };

  // Helper for Section Subheader
  const renderSectionHeader = (numberStr: string, sectionTitle: string) => {
    checkPageBreak(18);
    doc.setFont('times', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(25, 25, 25);
    doc.text(`${numberStr} ${sectionTitle}`, marginLeft, currentY);
    currentY += 6;
  };

  // Helper for Body Paragraph
  const renderParagraph = (text: string, indent = 8) => {
    if (!text) return;
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);

    const paragraphs = text.split('\n\n');
    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      const lines = doc.splitTextToSize(trimmed, contentWidth - indent);
      checkPageBreak(lines.length * 5.5 + 4);

      // Render first line indented
      if (lines.length > 0) {
        doc.text(lines[0], marginLeft + indent, currentY);
        currentY += 5.5;
        // Remaining lines with standard margin
        for (let i = 1; i < lines.length; i++) {
          checkPageBreak(6);
          doc.text(lines[i], marginLeft, currentY);
          currentY += 5.5;
        }
      }
      currentY += 3; // spacing between paragraphs
    });
  };

  // Helper for Numbered List
  const renderNumberedList = (items: string[]) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);

    items.forEach((item, index) => {
      const numLabel = `${index + 1}.`;
      const itemLines = doc.splitTextToSize(item, contentWidth - 12);
      checkPageBreak(itemLines.length * 5.5 + 3);

      doc.text(numLabel, marginLeft + 4, currentY);
      doc.text(itemLines[0], marginLeft + 12, currentY);
      currentY += 5.5;

      for (let i = 1; i < itemLines.length; i++) {
        checkPageBreak(6);
        doc.text(itemLines[i], marginLeft + 12, currentY);
        currentY += 5.5;
      }
      currentY += 2;
    });
    currentY += 3;
  };

  // ==================== BAB I ====================
  renderChapterHeader('I', 'PENDAHULUAN');

  renderSectionHeader('1.1', 'Latar Belakang Masalah');
  renderParagraph(proposal.bab1.latarBelakang);

  renderSectionHeader('1.2', 'Rumusan Masalah');
  renderNumberedList(proposal.bab1.rumusanMasalah);

  renderSectionHeader('1.3', 'Tujuan Penelitian');
  renderNumberedList(proposal.bab1.tujuanPenelitian);

  renderSectionHeader('1.4', 'Manfaat Penelitian');
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('A. Manfaat Teoretis', marginLeft + 4, currentY);
  currentY += 5.5;
  renderParagraph(proposal.bab1.manfaatPenelitian.teoretis, 4);

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('B. Manfaat Praktis', marginLeft + 4, currentY);
  currentY += 5.5;
  renderNumberedList(proposal.bab1.manfaatPenelitian.praktis);

  renderSectionHeader('1.5', 'Batasan Masalah');
  renderParagraph(proposal.bab1.batasanMasalah);

  // ==================== BAB II ====================
  renderChapterHeader('II', 'TINJAUAN PUSTAKA DAN KERANGKA BERPIKIR');

  renderSectionHeader('2.1', 'Kajian Teori');
  renderParagraph(proposal.bab2.kajianTeori);

  renderSectionHeader('2.2', 'Penelitian Terdahulu yang Relevan');
  renderParagraph(proposal.bab2.penelitianTerdahulu);

  renderSectionHeader('2.3', 'Kerangka Berpikir');
  renderParagraph(proposal.bab2.kerangkaBerpikir);

  if (proposal.bab2.hipotesis) {
    renderSectionHeader('2.4', 'Hipotesis Penelitian');
    renderParagraph(proposal.bab2.hipotesis);
  }

  // ==================== BAB III ====================
  renderChapterHeader('III', 'METODOLOGI PENELITIAN');

  renderSectionHeader('3.1', 'Jenis dan Pendekatan Penelitian');
  renderParagraph(proposal.bab3.jenisPenelitian);

  renderSectionHeader('3.2', 'Waktu dan Tempat Penelitian');
  renderParagraph(proposal.bab3.waktuDanTempat);

  renderSectionHeader('3.3', 'Populasi dan Sampel Penelitian');
  renderParagraph(proposal.bab3.populasiDanSampel);

  renderSectionHeader('3.4', 'Variabel Penelitian');
  renderParagraph(proposal.bab3.variabelPenelitian);

  renderSectionHeader('3.5', 'Teknik Pengumpulan Data');
  renderParagraph(proposal.bab3.teknikPengumpulanData);

  renderSectionHeader('3.6', 'Instrumen Penelitian');
  renderParagraph(proposal.bab3.instrumenPenelitian);

  renderSectionHeader('3.7', 'Teknik Analisis Data');
  renderParagraph(proposal.bab3.teknikAnalisisData);

  // ==================== DAFTAR PUSTAKA ====================
  renderChapterHeader('', 'DAFTAR PUSTAKA');

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);

  // Hanging indent for standard citations (APA / Harvard)
  proposal.daftarPustaka.forEach((citation) => {
    const lines = doc.splitTextToSize(citation, contentWidth);
    checkPageBreak(lines.length * 5.5 + 4);

    if (lines.length > 0) {
      // First line flushed left
      doc.text(lines[0], marginLeft, currentY);
      currentY += 5.5;

      // Subsequent lines indented (hanging indent standard 8mm)
      for (let i = 1; i < lines.length; i++) {
        checkPageBreak(6);
        doc.text(lines[i], marginLeft + 8, currentY);
        currentY += 5.5;
      }
    }
    currentY += 3.5; // spacing between citations
  });

  // Stamp header & footer across all pages
  addHeaderAndFooter();

  // Save the PDF
  const cleanTitle = proposal.judul
    .substring(0, 35)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  doc.save(`Proposal_KTI_${cleanTitle}.pdf`);
}
