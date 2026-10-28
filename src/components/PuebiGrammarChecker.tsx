import React, { useState } from 'react';
import {
  SpellCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Zap,
  Info,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface GrammarError {
  id: string;
  original: string;
  replacement: string;
  category: 'kbbi' | 'preposition' | 'conjunction' | 'pleonasm' | 'typography';
  categoryLabel: string;
  explanation: string;
  ruleCitation: string;
  index: number;
}

const SAMPLE_TEXTS = {
  sample1: `Berdasarkan analisa awal yang di lakukan di laboratorium, metodologi pengujian bioplastik sangat amat penting untuk mengetahui efektifitas daya tahan air. Namun di jaman sekarang, banyak praktek pembuatan plastik ramah lingkungan yang belum sesuai standard nasional. Sehingga para peneliti mencoba merubah formula dasarnya.`,
  sample2: `Penelitian ini bertujuan untuk menganalisa pengaruh fluktuasi IHSG dan kurs rupiah terhadap kinerja keuangan UMKM. Data di kumpulkan dilaboratorium komputer dengan menggunakan sistim regresi berganda. Adalah merupakan suatu hal mendesak untuk mencari faktor resiko yang paling dominan. Dan hasil penelitian ini diharapkan berguna bagi otoritas moneter.`,
  sample3: `Dalam penelitian sosiologi pendidikan ini, peneliti membagikan kuisioner kepada para responden sekalian disekolah. Aktifitas belajar siswa diukur dengan indikator yang jelas agar supaya diperoleh data yang obyektif. Sedangkan hipotesa awal menduga adanya korelasi positif yang signifikan.`,
};

// Comprehensive Indonesian Orthography & PUEBI Ruleset
const KBBI_REPLACEMENTS: Array<{
  pattern: RegExp;
  replacement: string;
  category: 'kbbi' | 'preposition' | 'conjunction' | 'pleonasm' | 'typography';
  categoryLabel: string;
  explanation: string;
  ruleCitation: string;
}> = [
  // Non-standard words to KBBI V standard
  { pattern: /\banalisa\b/gi, replacement: 'analisis', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku serapan kata asing dalam KBBI adalah "analisis", bukan "analisa".', ruleCitation: 'KBBI V Edisi Mutakhir' },
  { pattern: /\bpraktek\b/gi, replacement: 'praktik', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata baku menurut KBBI adalah "praktik" (penyerapan dari "practice" dengan akhiran -ik).', ruleCitation: 'KBBI V / Pedoman EYD V' },
  { pattern: /\baktifitas\b/gi, replacement: 'aktivitas', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Penyerapan sufiks asing "-ity" menjadi "-itas", sehingga bentuk bakunya adalah "aktivitas" dengan huruf "v".', ruleCitation: 'PUEBI / EYD V Pas. 3' },
  { pattern: /\befektifitas\b/gi, replacement: 'efektivitas', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku adalah "efektivitas" (menggunakan "v"), bukan "efektifitas".', ruleCitation: 'KBBI V' },
  { pattern: /\bkreatifitas\b/gi, replacement: 'kreativitas', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku adalah "kreativitas" dengan huruf "v".', ruleCitation: 'KBBI V' },
  { pattern: /\bproduktivitas\b/gi, replacement: 'produktivitas', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku adalah "produktivitas".', ruleCitation: 'KBBI V' },
  { pattern: /\bjaman\b/gi, replacement: 'zaman', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Penulisan baku menggunakan konsonan "z", yakni "zaman".', ruleCitation: 'KBBI V' },
  { pattern: /\bmerubah\b/gi, replacement: 'mengubah', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Berasal dari kata dasar "ubah" + prefiks "meng-", sehingga menjadi "mengubah", bukan "merubah" (rubah adalah nama hewan).', ruleCitation: 'EYD V Bab Pembentukan Kata' },
  { pattern: /\bobyek\b/gi, replacement: 'objek', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata baku menggunakan huruf "j", yakni "objek".', ruleCitation: 'KBBI V' },
  { pattern: /\bsubyek\b/gi, replacement: 'subjek', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata baku menggunakan huruf "j", yakni "subjek".', ruleCitation: 'KBBI V' },
  { pattern: /\bstandard\b/gi, replacement: 'standar', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku serapan bahasa Indonesia tidak menggunakan huruf "d" di akhir, yakni "standar".', ruleCitation: 'PUEBI Kata Serapan' },
  { pattern: /\bsistim\b/gi, replacement: 'sistem', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata baku menurut KBBI adalah "sistem" dengan vokal "e".', ruleCitation: 'KBBI V' },
  { pattern: /\bresiko\b/gi, replacement: 'risiko', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku adalah "risiko" dengan vokal "i", bukan "resiko".', ruleCitation: 'KBBI V' },
  { pattern: /\bteoritis\b/gi, replacement: 'teoretis', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku adalah "teoretis" dengan vokal "e", bukan "teoritis".', ruleCitation: 'PUEBI Serapan Asing' },
  { pattern: /\bhipotesa\b/gi, replacement: 'hipotesis', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata baku dalam penulisan karya ilmiah adalah "hipotesis".', ruleCitation: 'KBBI V' },
  { pattern: /\bkuisioner\b/gi, replacement: 'kuesioner', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku menurut KBBI adalah "kuesioner" dengan "ue".', ruleCitation: 'KBBI V' },
  { pattern: /\bsekedar\b/gi, replacement: 'sekadar', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata dasar baku adalah "kadar", sehingga bentuk berimbuhannya adalah "sekadar".', ruleCitation: 'KBBI V' },
  { pattern: /\bsilahkan\b/gi, replacement: 'silakan', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Kata dasar adalah "sila", bukan "silah", sehingga bentuk bakunya "silakan".', ruleCitation: 'KBBI V' },
  { pattern: /\bhakekat\b/gi, replacement: 'hakikat', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku menurut KBBI adalah "hakikat" dengan vokal "i".', ruleCitation: 'KBBI V' },
  { pattern: /\bkarir\b/gi, replacement: 'karier', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Penulisan baku serapan adalah "karier" dengan "ie".', ruleCitation: 'KBBI V' },
  { pattern: /\bkualitas\b/gi, replacement: 'kualitas', category: 'kbbi', categoryLabel: 'Baku KBBI V', explanation: 'Bentuk baku menggunakan "kualitas" bukan "kualitet/kwalitas".', ruleCitation: 'KBBI V' },
  { pattern: /\bmetodologi penelitian\b/gi, replacement: 'metode penelitian', category: 'kbbi', categoryLabel: 'Diksi Ilmiah', explanation: 'Gunakan "metode penelitian" untuk merujuk pada langkah operasional. "Metodologi" adalah ilmu/filsafat tentang metode.', ruleCitation: 'Pedoman Penulisan Karya Ilmiah' },

  // "Di-" Awalan Pasif (harus digabung)
  { pattern: /\bdi\s+(lakukan|teliti|uji|analisis|buat|gunakan|buktikan|temukan|amati|hasilkan|kumpulkan|peroleh|jelaskan|bahas)\b/gi, replacement: 'di$1', category: 'preposition', categoryLabel: 'Awalan Pasif di-', explanation: 'Awalan "di-" pada kata kerja pasif ditulis serangkai (disambung) tanpa spasi.', ruleCitation: 'EYD V Bab Penulisan Kata Berimbuhan' },

  // "Di-" Kata Depan Tempat (harus dipisah)
  { pattern: /\bdi(sekolah|laboratorium|kampus|kelas|lapangan|lingkungan|rumah|desa|kota|daerah|dunia|dalam|atas|bawah|samping|tengah|antara)\b/gi, replacement: 'di $1', category: 'preposition', categoryLabel: 'Kata Depan di', explanation: 'Kata depan "di" yang menunjukkan tempat atau arah ditulis terpisah dengan spasi.', ruleCitation: 'EYD V Bab Kata Depan' },

  // Pleonasme / Redundansi
  { pattern: /\bsangat\s+amat\b/gi, replacement: 'sangat', category: 'pleonasm', categoryLabel: 'Hindari Pleonasme', explanation: 'Penggunaan "sangat amat" adalah pemborosan kata (pleonasme). Pilih salah satu: "sangat" atau "amat".', ruleCitation: 'Kaidah Kalimat Efektif' },
  { pattern: /\badalah\s+merupakan\b/gi, replacement: 'merupakan', category: 'pleonasm', categoryLabel: 'Hindari Pleonasme', explanation: 'Penggabungan predikat "adalah" dan "merupakan" bersifat lewah/mubazir. Pilih "merupakan" atau "adalah".', ruleCitation: 'Kaidah Kalimat Efektif Ilmiah' },
  { pattern: /\bagar\s+supaya\b/gi, replacement: 'agar', category: 'pleonasm', categoryLabel: 'Hindari Pleonasme', explanation: 'Kata "agar" dan "supaya" bersinonim. Hindari pemakaian serentak.', ruleCitation: 'Kaidah Kalimat Efektif' },
  { pattern: /\bpara\s+([a-zA-Z]+)\s+sekalian\b/gi, replacement: 'para $1', category: 'pleonasm', categoryLabel: 'Hindari Pleonasme', explanation: '"Para" sudah bermakna jamak, penambahan "sekalian" berlebihan.', ruleCitation: 'Kaidah Kalimat Efektif' },

  // Konjungsi Intrakalimat di Awal Kalimat (PUEBI larangan)
  { pattern: /(\.\s+)(Sehingga|Dan|Sedangkan|Serta)(\s+)/g, replacement: '$1Oleh karena itu,$3', category: 'conjunction', categoryLabel: 'Konjungsi Intrakalimat', explanation: 'Konjungsi intrakalimat (sehingga, dan, sedangkan) dilarang berada di awal kalimat mandiri. Gunakan konjungsi antarkalimat seperti "Oleh karena itu" atau "Selain itu".', ruleCitation: 'PUEBI / EYD V Kaidah Hubungan Antarkalimat' },

  // Typographic issues
  { pattern: /\s+,/g, replacement: ',', category: 'typography', categoryLabel: 'Spasi Tanda Baca', explanation: 'Tanda koma harus menempel langsung pada kata di depannya tanpa spasi mendahului.', ruleCitation: 'EYD V Tanda Koma' },
  { pattern: /\s+\./g, replacement: '.', category: 'typography', categoryLabel: 'Spasi Tanda Baca', explanation: 'Tanda titik harus menempel langsung pada kata di depannya tanpa spasi mendahului.', ruleCitation: 'EYD V Tanda Titik' },
];

export const PuebiGrammarChecker: React.FC = () => {
  const { language, t } = useLanguage();
  const [text, setText] = useState(SAMPLE_TEXTS.sample1);
  const [analyzed, setAnalyzed] = useState(false);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [copied, setCopied] = useState(false);
  const [complianceScore, setComplianceScore] = useState<number>(100);

  const runAnalysis = (sourceText: string) => {
    const foundErrors: GrammarError[] = [];
    let errorCounter = 0;

    for (const rule of KBBI_REPLACEMENTS) {
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(sourceText)) !== null) {
        errorCounter++;
        let replacementVal = rule.replacement;
        if (rule.replacement.includes('$1')) {
          replacementVal = match[0].replace(regex, rule.replacement);
        }

        foundErrors.push({
          id: `err-${errorCounter}-${match.index}`,
          original: match[0],
          replacement: replacementVal,
          category: rule.category,
          categoryLabel: rule.categoryLabel,
          explanation: rule.explanation,
          ruleCitation: rule.ruleCitation,
          index: match.index,
        });
      }
    }

    // Sort by index
    foundErrors.sort((a, b) => a.index - b.index);
    setErrors(foundErrors);
    setAnalyzed(true);

    // Compute PUEBI Score
    const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
    if (wordCount === 0) {
      setComplianceScore(100);
    } else {
      const penalty = Math.min(60, foundErrors.length * 8);
      setComplianceScore(Math.max(40, 100 - penalty));
    }
  };

  const handleAutoFixAll = () => {
    let corrected = text;
    for (const rule of KBBI_REPLACEMENTS) {
      corrected = corrected.replace(rule.pattern, rule.replacement);
    }
    setText(corrected);
    runAnalysis(corrected);
  };

  const handleFixOne = (err: GrammarError) => {
    const newText = text.replace(err.original, err.replacement);
    setText(newText);
    runAnalysis(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <SpellCheck className="w-4 h-4 text-indigo-300" />
            {language === 'id' ? 'Korektor Ejaan Baku KBBI V & PUEBI' : 'KBBI & PUEBI Academic Grammar Checker'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Audit Ejaan & Kaidah Kebahasaan KTI' : 'Indonesian Academic Orthography & Style Audit'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Deteksi otomatis kata tidak baku (analisa, praktek, aktifitas), kekeliruan prefiks "di-" vs kata depan tempat, kalimat lewah pleonasme, serta kepatuhan tata bahasa ilmiah Pedoman Umum Ejaan Bahasa Indonesia (EYD V).'
              : 'Automated detection of non-standard Indonesian words, "di-" prefixes vs prepositions, redundant pleonasms, and PUEBI/EYD V academic orthography.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-indigo-200 font-semibold">
              {language === 'id' ? 'Muat Sampel Naskah:' : 'Load Sample Draft:'}
            </span>
            <button
              onClick={() => {
                setText(SAMPLE_TEXTS.sample1);
                runAnalysis(SAMPLE_TEXTS.sample1);
              }}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Sampel 1 (Sains Kimia)
            </button>
            <button
              onClick={() => {
                setText(SAMPLE_TEXTS.sample2);
                runAnalysis(SAMPLE_TEXTS.sample2);
              }}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Sampel 2 (Ekonomi & IHSG)
            </button>
            <button
              onClick={() => {
                setText(SAMPLE_TEXTS.sample3);
                runAnalysis(SAMPLE_TEXTS.sample3);
              }}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Sampel 3 (Sosial Pendidikan)
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'id' ? 'Naskah / Paragraf KTI' : 'Manuscript / Paragraph'}
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {wordCount} {language === 'id' ? 'kata' : 'words'} · {charCount} {language === 'id' ? 'karakter' : 'chars'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Salin Naskah"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? (language === 'id' ? 'Tersalin' : 'Copied') : (language === 'id' ? 'Salin' : 'Copy')}
                </button>
                <button
                  onClick={() => setText('')}
                  className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  {language === 'id' ? 'Kosongkan' : 'Clear'}
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (analyzed) runAnalysis(e.target.value);
              }}
              placeholder={
                language === 'id'
                  ? 'Ketik atau tempel paragraf naskah Bab I, II, atau III di sini...'
                  : 'Type or paste research manuscript paragraphs here...'
              }
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => runAnalysis(text)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                {language === 'id' ? 'Audit Ejaan & Tata Bahasa' : 'Scan Grammar & PUEBI'}
              </button>

              {errors.length > 0 && (
                <button
                  onClick={handleAutoFixAll}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  {language === 'id' ? `Perbaiki Semua Otomatis (${errors.length})` : `Auto-Fix All (${errors.length})`}
                </button>
              )}
            </div>
          </div>

          {/* Quick PUEBI Rules Cheatsheet */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              {language === 'id' ? 'Pedoman Penting EYD V / PUEBI Untuk Siswa:' : 'Key PUEBI Guidelines:'}
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 leading-relaxed">
              <li>
                <strong className="text-slate-700">Awalan di-</strong> (kata kerja pasif): ditulis serangkai tanpa spasi (contoh: <em>dianalisis, dilakukan, diuji</em>).
              </li>
              <li>
                <strong className="text-slate-700">Kata depan di</strong> (tempat/arah): ditulis terpisah dengan spasi (contoh: <em>di laboratorium, di sekolah</em>).
              </li>
              <li>
                <strong className="text-slate-700">Konjungsi Intrakalimat</strong> (<em>sehingga, dan, sedangkan</em>): tidak boleh mengawali kalimat tunggal/independen.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Diagnostic Results & Suggestions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Compliance Meter Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {language === 'id' ? 'Skor Kepatuhan PUEBI' : 'PUEBI Compliance Score'}
                </span>
              </div>
              <span
                className={`text-2xl font-black ${
                  complianceScore >= 90
                    ? 'text-emerald-600'
                    : complianceScore >= 75
                    ? 'text-indigo-600'
                    : 'text-amber-600'
                }`}
              >
                {complianceScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  complianceScore >= 90
                    ? 'bg-emerald-500'
                    : complianceScore >= 75
                    ? 'bg-indigo-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${complianceScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {errors.length === 0
                ? language === 'id'
                  ? 'Luar biasa! Tidak ditemukan pelanggaran ejaan non-baku maupun kaidah EYD V dasar pada teks ini.'
                  : 'Great! No orthography or basic PUEBI violations detected.'
                : language === 'id'
                ? `Terdeteksi ${errors.length} catatan kebahasaan yang perlu disesuaikan dengan standar karya ilmiah.`
                : `Detected ${errors.length} linguistic issues requiring academic adjustment.`}
            </p>
          </div>

          {/* Issue Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'id' ? 'Daftar Temuan Ejaan' : 'Correction Items'} ({errors.length})
              </span>
            </div>

            {errors.length === 0 ? (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 text-center text-emerald-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold">
                  {language === 'id' ? 'Naskah Rapi & Baku' : 'Manuscript Standardized'}
                </div>
                <div className="text-[11px] text-emerald-600 max-w-xs mx-auto">
                  {language === 'id'
                    ? 'Semua istilah telah memenuhi kaidah ejaan resmi. Anda siap memasukkannya ke proposal naskah.'
                    : 'All terms match standard academic guidelines.'}
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {errors.map((err) => (
                  <div
                    key={err.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 line-through">
                          {err.original}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          {err.replacement}
                        </span>
                      </div>

                      <button
                        onClick={() => handleFixOne(err)}
                        className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        {language === 'id' ? 'Perbaiki' : 'Fix'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">
                      {err.explanation}
                    </p>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider">
                        {err.categoryLabel}
                      </span>
                      <span>·</span>
                      <span>{err.ruleCitation}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
