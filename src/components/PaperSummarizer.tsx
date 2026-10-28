import React, { useState } from 'react';
import {
  FileText,
  Workflow,
  Sparkles,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Target,
  FlaskConical,
  BarChart3,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';

interface PaperPreset {
  id: string;
  title: string;
  authors: string;
  field: string;
  abstract: string;
  fivePillars: {
    problem: string;
    method: string;
    findings: string;
    limitations: string;
    futureWork: string;
  };
  mindmap: {
    problemNode: string;
    methodNode: string;
    findingNode: string;
    impactNode: string;
  };
}

const PRESET_PAPERS: PaperPreset[] = [
  {
    id: 'paper-bio-1',
    title: 'Sintesis dan Karakterisasi Bioplastik Berbasis Pati Singkong dengan Minyak Kulit Jeruk',
    authors: 'Suryanto et al. (2023)',
    field: 'Sains Lingkungan & Material Terbarukan',
    abstract: `Penelitian ini bertujuan untuk mengatasi tingginya pencemaran plastik sintetis sekali pakai dengan mengembangkan bioplastik berbasis pati singkong (Manihot esculenta) yang diintegrasikan dengan minyak atsiri kulit jeruk manis (Citrus sinensis). Metode casting evaporasi digunakan dengan variasi gliserol 2 mL dan konsentrasi minyak kulit jeruk 0%, 2%, 4%, dan 6% (v/w). Pengujian meliputi uji kuat tarik (tensile strength), ketahanan air (swelling index), dan laju biodegradasi tanah selama 14 hari. Hasil penelitian menunjukkan penambahan minyak kulit jeruk 4% menghasilkan kuat tarik optimum 18,4 MPa dan menurunkan absorpsi air sebesar 34,2% dibandingkan kontrol, serta terurai sempurna 98,6% dalam media tanah kompos selama 14 hari. Keterbatasan riset terletak pada belum dilakukannya uji ketahanan panas di atas 80°C. Penelitian lanjutan disarankan mengevaluasi ketahanan termal dan pengujian skala kemasan pangan.`,
    fivePillars: {
      problem: 'Krisis akumulasi sampah plastik sintetis berbasis minyak bumi yang sulit terurai secara alami dan mencemari ekosistem tanah dan perairan Indonesia.',
      method: 'Metode casting evaporasi dengan formulasi pati singkong, plasticizer gliserol (2 mL), dan variasi minyak atsiri kulit jeruk (0-6%) dengan pengujian triplo.',
      findings: 'Formulasi 4% minyak atsiri menghasilkan kuat tarik optimal (18,4 MPa), penurunan serap air hingga 34,2%, serta biodegradasi 98,6% dalam 14 hari.',
      limitations: 'Pengujian belum mencakup uji ketahanan termal di atas 80°C dan durabilitas terhadap paparan sinar ultraviolet berintensitas tinggi.',
      futureWork: 'Pengembangan pelapis hidrofobik lapis ganda dan uji migrasi bahan untuk standar kelayakan kemasan pangan (food-grade).',
    },
    mindmap: {
      problemNode: 'Pencemaran Sampah Plastik Minyak Bumi',
      methodNode: 'Sintesis Pati Singkong + Minyak Atsiri Kulit Jeruk (0-6%)',
      findingNode: 'Kuat Tarik 18.4 MPa & Laju Urai Tanah 14 Hari',
      impactNode: 'Kemasan Biodegradable Ramah Lingkungan',
    },
  },
  {
    id: 'paper-fin-2',
    title: 'Analisis Pengaruh Volatilitas Nilai Tukar Rupiah dan Suku Bunga BI Terhadap Indeks Harga Saham Gabungan (IHSG)',
    authors: 'Pratama & Hidayat (2024)',
    field: 'Ekonomi Moneter & Pasar Modal',
    abstract: `Penelitian ini menganalisis transmisi kebijakan moneter dan stabilitas nilai tukar terhadap pergerakan Indeks Harga Saham Gabungan (IHSG) di Bursa Efek Indonesia periode 2020-2023. Menggunakan metode Vector Error Correction Model (VECM) dengan data sekunder harian sebanyak 980 observasi. Hasil estimasi menunjukkan bahwa dalam jangka panjang, depresiasi nilai tukar Rupiah terhadap Dolar AS (USD/IDR) berpengaruh negatif signifikan terhadap IHSG (p < 0,01), sedangkan BI 7-Day Reverse Repo Rate berpengaruh negatif pada jangka pendek namun tidak signifikan secara jangka panjang. Keterbatasan riset adalah belum memperhitungkan sentimen geopolitik global dan harga komoditas nikel/batubara. Riset selanjutnya disarankan mengintegrasikan model Machine Learning Random Forest untuk memprediksi volatilitas jangka pendek.`,
    fivePillars: {
      problem: 'Ketidakpastian pasar modal domestik akibat fluktuasi nilai tukar Rupiah dan transmisi kebijakan suku bunga acuan bank sentral.',
      method: 'Kuantitatif ekonometrika dengan Vector Error Correction Model (VECM) dan uji kointegrasi Johansen atas 980 observasi data sekunder harian.',
      findings: 'Nilai tukar Rupiah berkorelasi negatif signifikan terhadap IHSG jangka panjang (koefisien -0,482; p < 0,01), sementara suku bunga BI berdampak jangka pendek.',
      limitations: 'Model belum mengontrol variabel shock geopolitik global dan pergerakan indeks komoditas energi dunia.',
      futureWork: 'Penerapan algoritma machine learning non-linear dan integrasi data sentimen berita ekonomi real-time.',
    },
    mindmap: {
      problemNode: 'Volatilitas Valas & Ketidakpastian IHSG',
      methodNode: 'Ekonometrika VECM & Data Sekunder Harian (N=980)',
      findingNode: 'Kurs Rupiah Berpengaruh Negatif Signifikan Jangka Panjang',
      impactNode: 'Rekomendasi Kebijakan Lindung Nilai Moneter',
    },
  },
  {
    id: 'paper-agr-3',
    title: 'Sistem Irigasi Presisi Berbasis IoT dan Sensor Kelembapan Tanah untuk Peningkatan Hasil Panen Padi',
    authors: 'Kusuma et al. (2023)',
    field: 'Teknologi Pertanian & IoT',
    abstract: `Penelitian ini mengembangkan purwarupa Smart Irrigation System berbasis mikrokontroler ESP32 dan sensor kelembapan kapasitif pada lahan sawah tadah hujan. Pendekatan eksperimental membandingkan efisiensi konsumsi air irigasi konvensional sistem genangan dengan irigasi tetes terkendali otomatis. Data dianalisis secara deskriptif komparatif selama satu musim tanam (110 hari). Hasil menunjukkan penghematan penggunaan air irigasi mencapai 41,5% dengan peningkatan bobot gabah panen sebesar 12,8% dibandingkan kontrol konvensional. Keterbatasan sistem adalah ketergantungan pada stabilitas jaringan seluler 4G di area pedesaan. Riset mendatang diarahkan pada implementasi protokol komunikasi LoRaWAN berdaya rendah.`,
    fivePillars: {
      problem: 'Kelangkaan air irigasi pertanian di sawah tadah hujan dan inefisiensi metode irigasi genangan tradisional.',
      method: 'Eksperimental kuantitatif lapangan dengan mikrokontroler ESP32, sensor kelembapan tanah kapasitif, dan pengujian komparatif selama 110 hari.',
      findings: 'Efisiensi penghematan konsumsi air hingga 41,5% dan peningkatan hasil panen gabah sebesar 12,8% secara terukur.',
      limitations: 'Ketergantungan terhadap koneksi sinyal telekomunikasi seluler dan belum terujinya keawetan sensor terhadap korosi lumpur sawah jangka panjang.',
      futureWork: 'Adopsi transmisi nirkabel LoRaWAN jarak jauh berdaya hemat energi surya (solar cell).',
    },
    mindmap: {
      problemNode: 'Pemborosan Air Irigasi Sawah Konvensional',
      methodNode: 'Sistem Otomasi Sensor ESP32 & Algoritma Thresholding',
      findingNode: 'Hemat Air 41.5% & Peningkatan Gabah 12.8%',
      impactNode: 'Ketahanan Pangan & Pertanian Presisi Berkelanjutan',
    },
  },
];

export const PaperSummarizer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState<PaperPreset>(PRESET_PAPERS[0]);
  const [customAbstract, setCustomAbstract] = useState('');
  const [activeTabNode, setActiveTabNode] = useState<'problem' | 'method' | 'findings' | 'limitations' | 'futureWork'>('problem');
  const [copiedSynthesis, setCopiedSynthesis] = useState(false);

  const currentPillars = selectedPreset.fivePillars;

  // Synthesize into a polished Bab II literature review paragraph
  const generatedBab2Paragraph = `Berdasarkan penelitian ${selectedPreset.authors} mengenai "${selectedPreset.title}", ditemukan bahwa ${currentPillars.findings.toLowerCase()} Penelitian tersebut menggunakan ${currentPillars.method.toLowerCase()} Meskipun demikian, riset ini memiliki keterbatasan yakni ${currentPillars.limitations.toLowerCase()} Temuan ini menegaskan pentingnya ${currentPillars.futureWork.toLowerCase()}`;

  const handleCopyBab2 = () => {
    navigator.clipboard.writeText(generatedBab2Paragraph);
    setCopiedSynthesis(true);
    setTimeout(() => setCopiedSynthesis(false), 2000);
  };

  const handleSelectPreset = (preset: PaperPreset) => {
    setSelectedPreset(preset);
    setCustomAbstract('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-teal-700 via-emerald-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Workflow className="w-4 h-4 text-teal-300" />
            {language === 'id' ? 'Ekstraktor 5-Pilar & Visual Mindmap' : '5-Pillar Paper Extractor & Visual Mindmap'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Bedah Otomatis Naskah Jurnal & Alur Riset' : 'Deconstruct Academic Papers & Logic Flow'}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Ekstrak intisari artikel ilmiah ke dalam 5 pilar riset (Masalah, Metodologi, Temuan Kunci, Keterbatasan, Riset Lanjutan) lengkap dengan visualisasi alur berpikir logis untuk penyusunan Tinjauan Pustaka Bab II.'
              : 'Extract journal papers into 5 critical research pillars and generate an interactive SVG logic flow diagram for your literature review.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-teal-200 font-semibold">
              {language === 'id' ? 'Pilih Jurnal Sampel:' : 'Select Sample Paper:'}
            </span>
            {PRESET_PAPERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                  selectedPreset.id === p.id
                    ? 'bg-white text-teal-950 border-white shadow-xs font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {p.field.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Paper Meta & Abstract (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                {selectedPreset.field}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {selectedPreset.title}
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                {selectedPreset.authors}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'id' ? 'Abstrak Artikel Ilmiah' : 'Paper Abstract'}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {selectedPreset.abstract.length} {language === 'id' ? 'karakter' : 'characters'}
                </span>
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed font-sans max-h-72 overflow-y-auto">
                {selectedPreset.abstract}
              </div>
            </div>

            {/* Listen Audio TTS Player for Paper Summary */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {language === 'id' ? 'Dengarkan Ringkasan Riset:' : 'Listen to Synthesis:'}
              </span>
              <AudioSpeechPlayer
                text={generatedBab2Paragraph}
                label={language === 'id' ? 'Dengarkan Narasi' : 'Listen Narration'}
                size="sm"
                variant="button"
              />
            </div>
          </div>

          {/* Bab II Literature Synthesis Export Card */}
          <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-white rounded-3xl p-6 border border-teal-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                  {language === 'id' ? 'Format Siap Pakai Bab II (Tinjauan Pustaka)' : 'Bab II Ready-to-Cite Synthesis'}
                </span>
              </div>
              <button
                onClick={handleCopyBab2}
                className="text-xs text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-100/60 border border-teal-300 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedSynthesis ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSynthesis ? (language === 'id' ? 'Tersalin!' : 'Copied!') : (language === 'id' ? 'Salin Paragraf' : 'Copy Text')}
              </button>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-teal-100 text-xs text-slate-800 leading-relaxed font-serif italic">
              "{generatedBab2Paragraph}"
            </div>
            <p className="text-[11px] text-teal-800/80 leading-normal">
              💡 {language === 'id' ? 'Paragraf di atas telah diformat menggunakan standar sitasi akademis integratif yang menghubungkan metodologi, hasil, dan evaluasi kritis.' : 'Preformatted using standard integrative academic citation.'}
            </p>
          </div>
        </div>

        {/* Right Column: 5 Pillars & Visual Interactive Mindmap (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Visual Mindmap Canvas */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'id' ? 'Mindmap Alur Berpikir Logis Riset' : 'Visual Research Logic Flow'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'id' ? 'Klik simpul untuk sorot pilar' : 'Click node to inspect pillar'}
              </span>
            </div>

            {/* Interactive SVG Flow Diagram */}
            <div className="w-full bg-slate-900 rounded-2xl p-4 sm:p-6 overflow-x-auto text-white shadow-inner">
              <svg viewBox="0 0 680 180" className="w-full min-w-[560px] h-auto font-sans">
                {/* Connecting Gradient Lines */}
                <defs>
                  <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                <line x1="130" y1="90" x2="190" y2="90" stroke="url(#flowGrad)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="310" y1="90" x2="370" y2="90" stroke="url(#flowGrad)" strokeWidth="3" strokeDasharray="4 4" />
                <line x1="490" y1="90" x2="550" y2="90" stroke="url(#flowGrad)" strokeWidth="3" strokeDasharray="4 4" />

                {/* Node 1: Masalah */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-95"
                  onClick={() => setActiveTabNode('problem')}
                >
                  <rect
                    x="10"
                    y="45"
                    width="120"
                    height="90"
                    rx="14"
                    fill={activeTabNode === 'problem' ? '#0f766e' : '#1e293b'}
                    stroke={activeTabNode === 'problem' ? '#2dd4bf' : '#334155'}
                    strokeWidth={activeTabNode === 'problem' ? '2.5' : '1.5'}
                  />
                  <text x="70" y="70" fill="#99f6e4" fontSize="10" fontWeight="bold" textAnchor="middle">
                    1. MASALAH
                  </text>
                  <text x="70" y="92" fill="#e2e8f0" fontSize="9.5" textAnchor="middle" width="100">
                    Kesenjangan Riset
                  </text>
                  <text x="70" y="112" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    Urgensi Fenomena
                  </text>
                </g>

                {/* Node 2: Metodologi */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-95"
                  onClick={() => setActiveTabNode('method')}
                >
                  <rect
                    x="190"
                    y="45"
                    width="120"
                    height="90"
                    rx="14"
                    fill={activeTabNode === 'method' ? '#065f46' : '#1e293b'}
                    stroke={activeTabNode === 'method' ? '#34d399' : '#334155'}
                    strokeWidth={activeTabNode === 'method' ? '2.5' : '1.5'}
                  />
                  <text x="250" y="70" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
                    2. METODOLOGI
                  </text>
                  <text x="250" y="92" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    Desain & Sampel
                  </text>
                  <text x="250" y="112" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    Instrumen Ukur
                  </text>
                </g>

                {/* Node 3: Temuan Empiris */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-95"
                  onClick={() => setActiveTabNode('findings')}
                >
                  <rect
                    x="370"
                    y="45"
                    width="120"
                    height="90"
                    rx="14"
                    fill={activeTabNode === 'findings' ? '#1e3a8a' : '#1e293b'}
                    stroke={activeTabNode === 'findings' ? '#60a5fa' : '#334155'}
                    strokeWidth={activeTabNode === 'findings' ? '2.5' : '1.5'}
                  />
                  <text x="430" y="70" fill="#bfdbfe" fontSize="10" fontWeight="bold" textAnchor="middle">
                    3. TEMUAN KUNCI
                  </text>
                  <text x="430" y="92" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    Hasil Empiris
                  </text>
                  <text x="430" y="112" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    Statistik & Efek
                  </text>
                </g>

                {/* Node 4: Dampak & Solusi */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-95"
                  onClick={() => setActiveTabNode('futureWork')}
                >
                  <rect
                    x="550"
                    y="45"
                    width="120"
                    height="90"
                    rx="14"
                    fill={activeTabNode === 'futureWork' ? '#4c1d95' : '#1e293b'}
                    stroke={activeTabNode === 'futureWork' ? '#c084fc' : '#334155'}
                    strokeWidth={activeTabNode === 'futureWork' ? '2.5' : '1.5'}
                  />
                  <text x="610" y="70" fill="#e9d5ff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    4. DAMPAK & SARAN
                  </text>
                  <text x="610" y="92" fill="#e2e8f0" fontSize="9.5" textAnchor="middle">
                    Kontribusi Nyata
                  </text>
                  <text x="610" y="112" fill="#94a3b8" fontSize="8" textAnchor="middle">
                    Riset Masa Depan
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* 5-Pillar Detailed Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'id' ? 'Intisari 5 Pilar Riset Ilmiah' : '5 Core Scientific Pillars'}
              </span>
            </div>

            {/* Pillar 1: Problem */}
            <div
              onClick={() => setActiveTabNode('problem')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                activeTabNode === 'problem'
                  ? 'bg-teal-50/70 border-teal-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Target className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pilar 1: Kesenjangan Riset & Masalah (Research Gap)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentPillars.problem}
              </p>
            </div>

            {/* Pillar 2: Method */}
            <div
              onClick={() => setActiveTabNode('method')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                activeTabNode === 'method'
                  ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pilar 2: Desain Metodologi & Intervensi (Methodology)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentPillars.method}
              </p>
            </div>

            {/* Pillar 3: Findings */}
            <div
              onClick={() => setActiveTabNode('findings')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                activeTabNode === 'findings'
                  ? 'bg-blue-50/70 border-blue-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pilar 3: Temuan Kunci & Data Kuantitatif (Key Findings)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentPillars.findings}
              </p>
            </div>

            {/* Pillar 4: Limitations */}
            <div
              onClick={() => setActiveTabNode('limitations')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                activeTabNode === 'limitations'
                  ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pilar 4: Keterbatasan & Batasan Studi (Limitations)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentPillars.limitations}
              </p>
            </div>

            {/* Pillar 5: Future Work */}
            <div
              onClick={() => setActiveTabNode('futureWork')}
              className={`rounded-2xl p-4 border transition-all cursor-pointer ${
                activeTabNode === 'futureWork'
                  ? 'bg-purple-50/70 border-purple-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pilar 5: Implikasi & Arah Riset Lanjutan (Future Work)
                </h3>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentPillars.futureWork}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
