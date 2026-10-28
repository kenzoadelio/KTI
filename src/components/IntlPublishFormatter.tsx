import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Copy,
  Check,
  Download,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Globe2,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LATEX_PRESETS = {
  bioplastic: {
    title: 'Synthesis and Mechanical Characterization of Cassava Starch Bioplastics with Citrus Peel Additives',
    authors: 'Kenzo Adelio, B. Suryanto, D. Rahmawati',
    abstractEn:
      'Conventional petroleum-based single-use plastics pose persistent environmental hazards due to non-biodegradability. This study formulates a biodegradable alternative synthesized from cassava starch (Manihot esculenta) integrated with essential oil from sweet orange peel (Citrus sinensis) as an organic hydrophobic agent. Using an evaporation casting approach with triplo experimental replications, mechanical tensile strength, water swelling index, and 14-day soil burial degradation were characterized. Formulations containing 4% (v/w) citrus peel essential oil achieved an optimum tensile strength of 18.4 MPa and a 34.2% reduction in water absorption relative to the pure starch control, degrading 98.6% within compost soil after 14 days. These findings demonstrate the technical feasibility of bio-derived packaging films with enhanced moisture barrier properties.',
    keywords: 'Cassava starch, bioplastics, citrus peel oil, tensile strength, soil biodegradation',
  },
  finance: {
    title: 'Econometric Analysis of Indonesian Rupiah Volatility and Policy Rate on the IDX Composite Index',
    authors: 'Kenzo Adelio, A. Pratama',
    abstractEn:
      'This study investigates the transmission dynamics of monetary policy adjustments and foreign exchange volatility toward the Indonesia Stock Exchange Composite Index (IHSG) over the 2020-2023 observation period. Employing a Vector Error Correction Model (VECM) with Johansen cointegration across 980 daily secondary market observations, long-run equilibrium relationships are established. Empirical estimates indicate that Indonesian Rupiah depreciation against the US Dollar imposes a statistically significant negative long-term effect on equity valuations (p < 0.01), whereas central bank policy rate shifts exhibit transient short-term adjustments. The model offers empirical foundation for institutional portfolio hedging strategies during foreign exchange turbulence.',
    keywords: 'Exchange rate, IHSG, monetary transmission, VECM, financial markets',
  },
};

export const IntlPublishFormatter: React.FC = () => {
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<'bioplastic' | 'finance'>('bioplastic');
  const [templateFormat, setTemplateFormat] = useState<'ieee' | 'elsevier'>('ieee');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);

  const currentData = LATEX_PRESETS[selectedTopic];

  const generateLatexSource = () => {
    if (templateFormat === 'ieee') {
      return `% IEEE Conference Two-Column Template
\\documentclass[conference]{IEEEtran}
\\usepackage{amsmath,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\usepackage{cite}

\\begin{document}

\\title{${currentData.title}}

\\author{\\IEEEauthorblockN{${currentData.authors}}
\\IEEEauthorblockA{\\textit{Young Researcher Division} \\\\
\\textit{SMA Labschool / Indonesia}\\ \\
Jakarta, Indonesia \\\\
kenzoadelio19@gmail.com}
}

\\maketitle

\\begin{abstract}
${currentData.abstractEn}
\\end{abstract}

\\begin{IEEEkeywords}
${currentData.keywords}
\\end{IEEEkeywords}

\\section{Introduction}
Global sustainability goals necessitate the transition toward circular bio-materials and data-driven policies. Prior literature has documented individual mechanical parameters, yet integrative optimization remains underexplored.

\\section{Methodology}
Experiments were conducted following standardized protocols with triplo replications. Statistical inference was validated using Analysis of Variance (ANOVA, $\\alpha = 0.05$).

\\section{Results and Discussion}
Empirical characterization revealed significant improvements in target variables without sacrificing degradability.

\\section{Conclusion}
The proposed formulation satisfies foundational criteria for high-impact international presentation.

\\bibliographystyle{IEEEtran}
% Add your .bib references here
\\end{document}`;
    } else {
      return `% Elsevier Single-Column Journal Template
\\documentclass[preprint,12pt]{elsarticle}
\\usepackage{amssymb}
\\usepackage{amsmath}
\\usepackage{lineno}

\\journal{Journal of Sustainable Science}

\\begin{document}

\\begin{frontmatter}

\\title{${currentData.title}}

\\author{${currentData.authors}}
\\address{Indonesia Young Researcher Network, Jakarta, Indonesia}

\\begin{abstract}
${currentData.abstractEn}
\\end{abstract}

\\begin{keyword}
${currentData.keywords}
\\end{keyword}

\\end{frontmatter}

\\linenumbers

\\section{Introduction}
Cassava-derived polymers represent promising bio-substrates for ecological packaging.

\\section{Materials and Methods}
All testing apparatus were calibrated in accordance with ASTM international protocols.

\\end{document}`;
    }
  };

  const latexCode = generateLatexSource();

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latexCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyEnglish = () => {
    navigator.clipboard.writeText(currentData.abstractEn);
    setCopiedEn(true);
    setTimeout(() => setCopiedEn(false), 2000);
  };

  const handleDownloadTex = () => {
    const blob = new Blob([latexCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `manuscript_${selectedTopic}_${templateFormat}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Code2 className="w-4 h-4 text-teal-300" />
            {language === 'id' ? 'Penerjemah Akademis & Generator LaTeX IEEE' : 'Academic Translator & LaTeX IEEE Generator'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Format Naskah Siap Submit Jurnal Dunia' : 'Compile Ready-to-Submit LaTeX & IEEE'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Terjemahkan draf naskah Anda ke Bahasa Inggris akademik bereputasi dan generate kode sumber LaTeX lengkap (IEEE 2-Kolom & Elsevier) yang siap dikompilasi di Overleaf tanpa error format.'
              : 'Translate research abstracts to formal academic English and generate valid LaTeX source files for IEEE and Elsevier.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-teal-200 font-semibold">Pilih Topik Draf:</span>
            <button
              onClick={() => setSelectedTopic('bioplastic')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                selectedTopic === 'bioplastic'
                  ? 'bg-white text-teal-950 border-white font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              Bioplastik Singkong & Jeruk
            </button>
            <button
              onClick={() => setSelectedTopic('finance')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                selectedTopic === 'finance'
                  ? 'bg-white text-teal-950 border-white font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              Ekonometrika Valas & IHSG
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: English Translation & Meta (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Hasil Terjemahan Akademis (Standard Q1)
                </h3>
              </div>
              <button
                onClick={handleCopyEnglish}
                className="text-xs text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedEn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEn ? 'Tersalin' : 'Salin Teks'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Judul Naskah Bahasa Inggris:</label>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {currentData.title}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Penulis & Afiliasi:</label>
              <div className="text-xs text-slate-700 font-mono">
                {currentData.authors} (SMA Labschool / Indonesia)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Abstrak Ilmiah Terjemahan:</label>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans max-h-64 overflow-y-auto">
                {currentData.abstractEn}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kata Kunci (Keywords):</label>
              <div className="text-xs font-medium text-teal-800 bg-teal-50/70 p-2.5 rounded-xl border border-teal-200">
                {currentData.keywords}
              </div>
            </div>
          </div>
        </div>

        {/* Right: LaTeX Generator & Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
              {/* Template selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Format:</span>
                <button
                  onClick={() => setTemplateFormat('ieee')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    templateFormat === 'ieee'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  IEEE 2-Column (.tex)
                </button>
                <button
                  onClick={() => setTemplateFormat('elsevier')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    templateFormat === 'elsevier'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Elsevier Article (.tex)
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLatex}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Salin Kode LaTeX"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin' : 'Salin LaTeX'}</span>
                </button>

                <button
                  onClick={handleDownloadTex}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Unduh File .tex"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .tex</span>
                </button>
              </div>
            </div>

            {/* LaTeX Code Display */}
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-slate-800 shadow-inner">
              <pre>{latexCode}</pre>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              💡 <strong>Tips Publikasi:</strong> File <code>.tex</code> di atas dapat langsung diimpor ke akun <strong>Overleaf</strong> atau dikompilasi dengan TeX Live / MiKTeX tanpa error paket.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
