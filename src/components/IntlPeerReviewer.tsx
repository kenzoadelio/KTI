import React, { useState } from 'react';
import {
  FileCheck2,
  Users,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Send,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ReviewerComment {
  section: string;
  comment: string;
  severity: 'Major' | 'Minor' | 'Praise';
  suggestedAction: string;
}

interface PeerReviewReport {
  overallDecision: 'Major Revision' | 'Minor Revision' | 'Accept with Minor Edits';
  confidenceScore: string;
  editorNote: string;
  reviewer1: {
    name: string;
    focus: string;
    generalImpression: string;
    comments: ReviewerComment[];
  };
  reviewer2: {
    name: string;
    focus: string;
    generalImpression: string;
    comments: ReviewerComment[];
  };
}

const SAMPLE_REVIEWS: Record<string, PeerReviewReport> = {
  bioplastic: {
    overallDecision: 'Minor Revision',
    confidenceScore: '92% (High Acceptance Probability upon Revisions)',
    editorNote:
      'The Editorial Board has received two constructive peer reviews for your manuscript on cassava starch bioplastics. Both reviewers acknowledge the strong ecological importance of citrus peel additive. Address the specific comments below regarding temperature degradation and error bars before final acceptance.',
    reviewer1: {
      name: 'Reviewer #1 (Materials Characterization & Statistical Methodology)',
      focus: 'Mechanical Testing (ASTM D882), Error Bars, and Replications',
      generalImpression:
        'A well-constructed empirical study with robust triplo replications. The methodology is clearly described, and the 18.4 MPa tensile strength is notable for a plant-based biopolymer.',
      comments: [
        {
          section: 'Section 3.2: Mechanical Testing',
          comment: 'Please include explicit error bars (± Standard Deviation) in Figure 2 for the 4% and 6% formulations.',
          severity: 'Minor',
          suggestedAction: 'Add standard deviation bars and annotate ANOVA significance (p < 0.05).',
        },
        {
          section: 'Section 4.1: Water Absorption',
          comment: 'The explanation of hydrophobicity mechanism is plausible. Please cite recent 2023-2025 literature on d-limonene diffusion barriers.',
          severity: 'Minor',
          suggestedAction: 'Add 2 citations on terpene hydrophobic interactions.',
        },
      ],
    },
    reviewer2: {
      name: 'Reviewer #2 (Applied Polymers & Industrial Scale-up)',
      focus: 'Thermal Stability, Shelf-life, and Comparative Baseline',
      generalImpression:
        'The novelty of using orange peel essential oil as an antimicrobial plasticizer is appealing. However, the manuscript overclaims food packaging viability without thermal degradation testing.',
      comments: [
        {
          section: 'Section 1: Introduction & Novelty Claim',
          comment: 'Tone down the claim of "complete replacement of commercial polyethylene" to "viable biodegradable alternative for short shelf-life dry goods".',
          severity: 'Major',
          suggestedAction: 'Revise abstract line 12 and conclusion to reflect accurate scope.',
        },
        {
          section: 'Section 5: Limitations',
          comment: 'Author must explicitly state the upper thermal limit (temperatures above 70°C) as a boundary condition.',
          severity: 'Minor',
          suggestedAction: 'Insert one paragraph on thermal limits and UV resistance in discussion.',
        },
      ],
    },
  },
  finance: {
    overallDecision: 'Major Revision',
    confidenceScore: '84% (Conditional on Model Robustness Check)',
    editorNote:
      'Your econometric investigation into Indonesian Rupiah exchange rate volatility and the IDX Composite is topical. Reviewer 2 requires an additional ARCH-LM test for heteroskedasticity and control for global oil price shocks.',
    reviewer1: {
      name: 'Reviewer #1 (Macroeconometrics & Time-Series Modeling)',
      focus: 'Stationarity, Cointegration, and Lag Selection',
      generalImpression:
        'Sound econometric approach using Johansen cointegration and VECM. The daily sample size of 980 observations provides adequate degrees of freedom.',
      comments: [
        {
          section: 'Section 3.3: Unit Root Tests',
          comment: 'Report both ADF (Augmented Dickey-Fuller) and Phillips-Perron tests at 1st difference.',
          severity: 'Minor',
          suggestedAction: 'Tabulate PP test statistics alongside ADF in Table 2.',
        },
      ],
    },
    reviewer2: {
      name: 'Reviewer #2 (Financial Markets & Empirical Banking)',
      focus: 'Omitted Variable Bias & Policy Transmission',
      generalImpression:
        'The inverse relationship between USD/IDR depreciation and stock market indices is expected. The manuscript lacks control variables for global energy and commodity cycles.',
      comments: [
        {
          section: 'Section 4.2: Impulse Response Analysis',
          comment: 'Include Brent crude oil or US 10-Year Treasury Yield as an exogenous control to avoid spurious causality.',
          severity: 'Major',
          suggestedAction: 'Re-run VECM with Brent oil as an exogenous shock regressor.',
        },
      ],
    },
  },
};

export const IntlPeerReviewer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<'bioplastic' | 'finance'>('bioplastic');
  const [customText, setCustomText] = useState('');
  const [copiedRebuttal, setCopiedRebuttal] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const report = SAMPLE_REVIEWS[selectedTopic];

  const generatedRebuttal = `Dear Editor-in-Chief and Reviewers,

We sincerely thank the Editorial Board and both Reviewers for their constructive and insightful feedback on our manuscript entitled "${selectedTopic === 'bioplastic' ? 'Synthesis and Characterization of Cassava Starch Bioplastics with Citrus Peel Additives' : 'Econometric Volatility Analysis of Indonesian Rupiah on IDX Composite'}". 

Below is our point-by-point response:

Response to Reviewer #1:
1. Standard Deviation & Error Bars: We have updated Figure 2 with explicit error bars (±SD) based on our triplo dataset and confirmed ANOVA significance at p = 0.024.
2. Hydrophobic Citation: Two recent 2024 references on terpene diffusion barriers have been incorporated into Section 4.1.

Response to Reviewer #2:
1. Claims Calibration: We have recalibrated the abstract and discussion to specify "viable alternative for dry food and short shelf-life packaging" rather than universal plastic replacement.
2. Boundary Conditions: A dedicated paragraph detailing thermal boundaries (<70°C) and outdoor UV exposure has been inserted in Section 5.

We believe these revisions significantly strengthen the empirical clarity and academic rigor of the manuscript.

Respectfully submitted,
The Authors (Kenzo Adelio et al.)`;

  const handleCopyRebuttal = () => {
    navigator.clipboard.writeText(generatedRebuttal);
    setCopiedRebuttal(true);
    setTimeout(() => setCopiedRebuttal(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-4 h-4 text-purple-300" />
            {language === 'id' ? 'Simulasi Double-Blind Peer Review Internasional' : 'Double-Blind Global Peer Review AI'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Audit Naskah Standar Jurnal Q1 & IEEE' : 'Pre-submission Peer Review Audit'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Dapatkan kritik akademis mendalam dari 2 reviewer anonim (Reviewer 1: Metodologi & Statistik, Reviewer 2: Kebaruan & Keterbatasan) sebelum naskah dikirim ke jurnal atau kompetisi dunia.'
              : 'Receive simulated blind reviews from 2 academic experts with an editorial decision letter and automatic rebuttal generator.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-purple-200 font-semibold">Pilih Contoh Naskah Riset:</span>
            <button
              onClick={() => setSelectedTopic('bioplastic')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                selectedTopic === 'bioplastic'
                  ? 'bg-white text-purple-950 border-white font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              Naskah Bioplastik & Lingkungan
            </button>
            <button
              onClick={() => setSelectedTopic('finance')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                selectedTopic === 'finance'
                  ? 'bg-white text-purple-950 border-white font-bold shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              Naskah Valas Rupiah & IHSG
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Board Decision Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Surat Keputusan Dewan Redaksi Jurnal (Editor Decision Letter)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status Keputusan:</span>
            <span
              className={`text-xs font-black px-3 py-1 rounded-full ${
                report.overallDecision === 'Minor Revision'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {report.overallDecision}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic bg-slate-50 p-4 rounded-2xl border border-slate-200">
          "{report.editorNote}"
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Indeks Keyakinan Penerimaan: <strong className="text-indigo-600">{report.confidenceScore}</strong></span>
        </div>
      </div>

      {/* Reviewer 1 & Reviewer 2 Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviewer 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Double-Blind Reviewer #1
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {report.reviewer1.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Fokus Evaluasi: {report.reviewer1.focus}
            </p>
          </div>

          <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
            <strong className="text-blue-900">Komentar Umum:</strong> {report.reviewer1.generalImpression}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Catatan Khusus Reviewer:</div>
            {report.reviewer1.comments.map((c, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.section}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    c.severity === 'Major' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-slate-600">{c.comment}</p>
                <div className="pt-1 text-[11px] text-indigo-700 font-medium">
                  💡 Saran Perbaikan: {c.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviewer 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <div className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
              Double-Blind Reviewer #2 (Kritis)
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {report.reviewer2.name}
            </h3>
            <p className="text-[11px] text-slate-500">
              Fokus Evaluasi: {report.reviewer2.focus}
            </p>
          </div>

          <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 text-xs text-slate-700 leading-relaxed">
            <strong className="text-purple-900">Komentar Umum:</strong> {report.reviewer2.generalImpression}
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Catatan Khusus Reviewer:</div>
            {report.reviewer2.comments.map((c, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.section}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    c.severity === 'Major' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-slate-600">{c.comment}</p>
                <div className="pt-1 text-[11px] text-purple-700 font-medium">
                  💡 Saran Perbaikan: {c.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Author Response Letter / Rebuttal Generator */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-3xl p-6 sm:p-8 border border-indigo-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Draft Surat Tanggapan Penulis (Point-by-Point Author Response Letter)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Dokumen resmi untuk membalas masukan reviewer saat mengunggah naskah revisi (Revision Submission).
            </p>
          </div>

          <button
            onClick={handleCopyRebuttal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copiedRebuttal ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedRebuttal ? 'Surat Tersalin!' : 'Salin Draft Surat Tanggapan'}</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
          {generatedRebuttal}
        </div>
      </div>
    </div>
  );
};
