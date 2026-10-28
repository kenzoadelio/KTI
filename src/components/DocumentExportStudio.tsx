import React, { useState } from 'react';
import {
  FileDown,
  FileText,
  Code2,
  Printer,
  Copy,
  Check,
  Sparkles,
  Download,
} from 'lucide-react';
import { ProposalData } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const DocumentExportStudio: React.FC<{ currentProposal: ProposalData | null }> = ({
  currentProposal,
}) => {
  const { language } = useLanguage();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!currentProposal) return null;

  // Generate Markdown representation
  const markdownContent = `# ${currentProposal.judul}

**Bidang Keilmuan:** ${currentProposal.bidang}  
**Jenjang:** ${currentProposal.jenjang}  
**Pendekatan:** ${currentProposal.pendekatan}  

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang
${currentProposal.bab1.latarBelakang}

### 1.2 Rumusan Masalah
${currentProposal.bab1.rumusanMasalah.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### 1.3 Tujuan Penelitian
${currentProposal.bab1.tujuanPenelitian.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### 1.4 Manfaat Penelitian
- **Manfaat Teoretis:** ${currentProposal.bab1.manfaatPenelitian.teoretis}
- **Manfaat Praktis:**
${currentProposal.bab1.manfaatPenelitian.praktis.map((p) => `  - ${p}`).join('\n')}

---

## BAB II: TINJAUAN PUSTAKA

### 2.1 Kajian Teori
${currentProposal.bab2.kajianTeori}

### 2.2 Penelitian Terdahulu
${currentProposal.bab2.penelitianTerdahulu}

### 2.3 Kerangka Berpikir
${currentProposal.bab2.kerangkaBerpikir}

${currentProposal.bab2.hipotesis ? `### 2.4 Hipotesis Penelitian\n${currentProposal.bab2.hipotesis}` : ''}

---

## BAB III: METODOLOGI PENELITIAN

### 3.1 Jenis dan Pendekatan Penelitian
${currentProposal.bab3.jenisPenelitian}

### 3.2 Waktu dan Tempat
${currentProposal.bab3.waktuDanTempat}

### 3.3 Populasi dan Sampel
${currentProposal.bab3.populasiDanSampel}

### 3.4 Variabel Penelitian
${currentProposal.bab3.variabelPenelitian}

### 3.5 Teknik Pengumpulan Data
${currentProposal.bab3.teknikPengumpulanData}

### 3.6 Instrumen Penelitian
${currentProposal.bab3.instrumenPenelitian}

### 3.7 Teknik Analisis Data
${currentProposal.bab3.teknikAnalisisData}

---

## DAFTAR PUSTAKA
${currentProposal.daftarPustaka.map((d) => `- ${d}`).join('\n')}
`;

  // Generate LaTeX representation
  const latexContent = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{top=3cm, bottom=3cm, left=4cm, right=3cm}

\\title{${currentProposal.judul.replace(/&/g, '\\&')}}
\\author{Peneliti Muda CendekiaKTI}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
${currentProposal.abstrakSingkat || 'Abstrak naskah proposal penelitian karya ilmiah.'}
\\end{abstract}

\\section{Pendahuluan}
\\subsection{Latar Belakang}
${currentProposal.bab1.latarBelakang.replace(/&/g, '\\&')}

\\subsection{Rumusan Masalah}
\\begin{enumerate}
${currentProposal.bab1.rumusanMasalah.map((r) => `  \\item ${r.replace(/&/g, '\\&')}`).join('\n')}
\\end{enumerate}

\\subsection{Tujuan Penelitian}
\\begin{enumerate}
${currentProposal.bab1.tujuanPenelitian.map((t) => `  \\item ${t.replace(/&/g, '\\&')}`).join('\n')}
\\end{enumerate}

\\section{Tinjauan Pustaka}
\\subsection{Kajian Teori}
${currentProposal.bab2.kajianTeori.replace(/&/g, '\\&')}

\\section{Metodologi Penelitian}
\\subsection{Pendekatan dan Desain}
${currentProposal.bab3.jenisPenelitian.replace(/&/g, '\\&')}

\\subsection{Pengumpulan dan Analisis Data}
${currentProposal.bab3.teknikAnalisisData.replace(/&/g, '\\&')}

\\section*{Daftar Pustaka}
\\begin{itemize}
${currentProposal.daftarPustaka.map((p) => `  \\item ${p.replace(/&/g, '\\&')}`).join('\n')}
\\end{itemize}

\\end{document}
`;

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = () => {
    // Generate clean Word-compatible HTML format
    const htmlWord = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${currentProposal.judul}</title>
<style>
body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; margin: 2.5cm; }
h1 { font-size: 14pt; text-align: center; text-transform: uppercase; }
h2 { font-size: 12pt; text-transform: uppercase; margin-top: 1cm; }
h3 { font-size: 12pt; font-weight: bold; }
p { text-align: justify; text-indent: 1.25cm; margin-bottom: 0.5cm; }
ol, ul { margin-left: 1.25cm; }
</style>
</head>
<body>
<h1>${currentProposal.judul}</h1>
<p style="text-align: center; text-indent: 0;"><strong>Bidang:</strong> ${currentProposal.bidang} | <strong>Jenjang:</strong> ${currentProposal.jenjang}</p>
<hr/>
<h2>BAB I: PENDAHULUAN</h2>
<h3>1.1 Latar Belakang</h3>
${currentProposal.bab1.latarBelakang.split('\n\n').map((p) => `<p>${p}</p>`).join('')}
<h3>1.2 Rumusan Masalah</h3>
<ol>
${currentProposal.bab1.rumusanMasalah.map((r) => `<li>${r}</li>`).join('')}
</ol>
<h3>1.3 Tujuan Penelitian</h3>
<ol>
${currentProposal.bab1.tujuanPenelitian.map((t) => `<li>${t}</li>`).join('')}
</ol>
<h2>BAB II: TINJAUAN PUSTAKA</h2>
<h3>2.1 Kajian Teori</h3>
${currentProposal.bab2.kajianTeori.split('\n\n').map((p) => `<p>${p}</p>`).join('')}
<h2>BAB III: METODOLOGI PENELITIAN</h2>
<h3>3.1 Jenis Penelitian</h3>
<p>${currentProposal.bab3.jenisPenelitian}</p>
<h3>3.2 Teknik Analisis Data</h3>
<p>${currentProposal.bab3.teknikAnalisisData}</p>
<h2>DAFTAR PUSTAKA</h2>
<ul>
${currentProposal.daftarPustaka.map((d) => `<li>${d}</li>`).join('')}
</ul>
</body>
</html>`;

    downloadFile(`Proposal_${currentProposal.judul.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.doc`, htmlWord, 'application/msword;charset=utf-8');
  };

  const handleDownloadMarkdown = () => {
    downloadFile(`Proposal_${currentProposal.judul.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.md`, markdownContent, 'text/markdown;charset=utf-8');
  };

  const handleDownloadLatex = () => {
    downloadFile(`Proposal_${currentProposal.judul.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.tex`, latexContent, 'text/plain;charset=utf-8');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Ekspor Multi-Format' : 'Multi-Format Export'}
            </span>
            <span>·</span>
            <span>Word (.doc), Markdown (.md), LaTeX (.tex)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileDown className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Studio Ekspor Dokumen Proposal' : 'Document Export Studio'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Unduh naskah lengkap proposal Anda ke dalam format Microsoft Word, Markdown, atau LaTeX Overleaf siap publikasi.'
              : 'Download your full manuscript directly into Microsoft Word, Markdown, or LaTeX Overleaf formats.'}
          </p>
        </div>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Word (.doc) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Microsoft Word (.doc)</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Format dokumen rapi dengan margin 4-4-3-3 cm, font Times New Roman 12pt, dan spasi 1.5 siap cetak dan edit di MS Word.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadWord}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh File Word (.doc)</span>
          </button>
        </div>

        {/* Markdown (.md) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm mb-2">
              <Code2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Academic Markdown (.md)</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Format teks murni standar GitHub / Obsidian / Notion, mudah diedit di semua text editor modern tanpa masalah format.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Unduh Markdown (.md)</span>
          </button>
        </div>

        {/* LaTeX (.tex) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-400 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">LaTeX Overleaf (.tex)</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Source code LaTeX artikel ilmiah dengan struktur section, equations, dan bibliografi standar jurnal internasional.
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadLatex}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh LaTeX (.tex)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
