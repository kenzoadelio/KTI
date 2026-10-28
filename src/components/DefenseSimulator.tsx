import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Award,
  Users,
  Timer,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Target,
  Globe,
  Flag,
  FileCheck2,
  Volume2,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';

interface JuryPersona {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  focus: string;
  personality: string;
  affiliation?: string;
}

interface DefenseQuestion {
  id: number;
  juryId: string;
  category: string;
  question: string;
  contextHint: string;
  rubricCriteria: string[];
  modelAnswer: string;
  keyWordsToInclude: string[];
}

// 1. Panel Juri Lomba Nasional (OPSI Puspresnas / LKIR BRIN / MYRES)
const NATIONAL_JURY_PANEL: JuryPersona[] = [
  {
    id: 'jury-nat-1',
    name: 'Prof. Dr. Ir. Sudarmono',
    role: 'Ketua Dewan Juri · Pakar Metodologi',
    avatarBg: 'bg-indigo-600',
    focus: 'Validitas Eksperimen, Variabel Kontrol, Instrumen, dan Replikasi.',
    personality: 'Kritis, teliti terhadap detail teknis laboratorium dan bias data.',
    affiliation: 'BRIN & OPSI Kemendikbud',
  },
  {
    id: 'jury-nat-2',
    name: 'Dr. Ratna Indrawati, M.Si.',
    role: 'Anggota Juri · Spesialis Teori & Kebaruan',
    avatarBg: 'bg-purple-600',
    focus: 'Research Novelty, Kerangka Teori, dan Perbandingan Penelitian Terdahulu.',
    personality: 'Fokus pada diferensiasi ide, urgensi riset, dan landasan pustaka.',
    affiliation: 'Universitas Indonesia / Tim Juri LKIR',
  },
  {
    id: 'jury-nat-3',
    name: 'Bapak Hadi Prakoso, M.Sc.',
    role: 'Anggota Juri · Pakar Aplikasi & Dampak Industri',
    avatarBg: 'bg-emerald-600',
    focus: 'Kelayakan Komersial, Analisis Biaya, Keamanan, dan Kemanfaatan Publik.',
    personality: 'Praktis, menanyakan implementasi nyata dan efisiensi biaya produksi.',
    affiliation: 'Pusat Riset Teknologi Industri',
  },
];

const NATIONAL_QUESTIONS: DefenseQuestion[] = [
  {
    id: 1,
    juryId: 'jury-nat-1',
    category: 'Metodologi & Kontrol',
    question: 'Bagaimana Anda membuktikan bahwa variabel kontrol dalam eksperimen Anda benar-benar steril dan tidak terkontaminasi oleh fluktuasi suhu atau kelembapan ruangan?',
    contextHint: 'Juri menguji ketelitian prosedur isolasi lingkungan dan reliabilitas instrumen pengkondisian.',
    rubricCriteria: [
      'Menyebutkan parameter lingkungan yang dikontrol (suhu, RH, durasi)',
      'Menyebutkan penggunaan alat ukur berkalibrasi',
      'Menjelaskan perlakuan terhadap sampel blanko/kontrol negatif',
    ],
    modelAnswer: 'Terima kasih atas pertanyaan kritis Dewan Juri. Untuk menjamin isolasi variabel kontrol, seluruh proses sintesis dilakukan dalam chamber tertutup dengan termohigrometer digital bersertifikat kalibrasi. Kami menetapkan suhu ruang konstan 25±1°C dan kelembapan relatif 60±5%. Selain itu, kami selalu menyertakan sampel kontrol tanpa aditif yang diperlakukan dengan durasi dan perlakuan pemanasan yang persis sama sebagai baseline pembanding.',
    keyWordsToInclude: ['kalibrasi', 'kontrol', 'baseline', 'chamber', 'suhu', 'pembanding'],
  },
  {
    id: 2,
    juryId: 'jury-nat-2',
    category: 'Kebaruan (Novelty)',
    question: 'Riset tentang bioplastik pati singkong sudah banyak dilakukan sejak 5 tahun lalu. Apa tepatnya kebaruan (novelty) mutlak penelitian Anda dibanding publikasi yang sudah ada?',
    contextHint: 'Tunjukkan celah riset (research gap) dan sintesis material spesifik yang belum pernah dieksplorasi secara mendalam.',
    rubricCriteria: [
      'Menyebutkan perbandingan konkret dengan literatur sebelumnya',
      'Menjelaskan inovasi rasio atau formula senyawa aktif',
      'Menekankan keunggulan empiris yang baru pertama kali dicapai',
    ],
    modelAnswer: 'Pertanyaan yang sangat mendasar. Mayoritas penelitian terdahulu, seperti Suryanto (2020), hanya berfokus pada sifat mekanik dengan plasticizer sintetis dan memiliki kelemahan degradasi air yang buruk. Kebaruan penelitian kami terletak pada pemanfaatan limbah minyak atsiri kulit jeruk manis sebagai agen hidrofobik ganda yang belum pernah diteliti rasio difusinya pada matriks pati singkong varietas lokal ini, menghasilkan ketahanan air 34% lebih tinggi tanpa mengorbankan laju biodegradasi.',
    keyWordsToInclude: ['kebaruan', 'novelty', 'limbah', 'perbedaan', 'terdahulu', 'hidrofobik'],
  },
  {
    id: 3,
    juryId: 'jury-nat-1',
    category: 'Analisis Data & Statistik',
    question: 'Berapa jumlah pengulangan (replikasi) yang Anda lakukan, dan apakah jumlah sampel tersebut memenuhi uji kecukupan statistik (statistical power)?',
    contextHint: 'Juri menguji apakah kesimpulan ditarik dari jumlah ulangan yang valid secara statistik atau sekadar kebetulan.',
    rubricCriteria: [
      'Menyebutkan metode replikasi (misal triplo/tiga kali)',
      'Menyebutkan nilai standar deviasi atau margin of error',
      'Menyampaikan uji homogenitas varians',
    ],
    modelAnswer: 'Seluruh perlakuan eksperimen dilakukan secara triplo (tiga kali pengulangan independen) sesuai kaidah Rancangan Acak Lengkap (RAL). Kami melakukan uji ANOVA satu arah dan uji lanjut Duncan dengan tingkat kepercayaan 95% (alpha = 0,05). Standar deviasi antarulangan berada di bawah 4,5%, yang mengindikasikan presisi tinggi dan reliabilitas statistik yang memadai untuk menarik inferensi.',
    keyWordsToInclude: ['triplo', 'replikasi', 'standar deviasi', 'anova', 'signifikan', 'kepercayaan'],
  },
  {
    id: 4,
    juryId: 'jury-nat-3',
    category: 'Dampak & Kelayakan Tekno-Ekonomi',
    question: 'Jika produk inovasi Anda diproduksi massal oleh industri, apakah biayanya mampu bersaing dengan plastik konvensional yang jauh lebih murah?',
    contextHint: 'Buktikan bahwa Anda memahami analisis biaya bahan baku (Bill of Materials) dan sumber daya lokal.',
    rubricCriteria: [
      'Menjelaskan efisiensi bahan baku berbasis limbah murah/gratis',
      'Memberikan estimasi perbandingan harga per unit',
      'Menyoroti nilai tambah ekologis jangka panjang',
    ],
    modelAnswer: 'Dari hasil perhitungan tekno-ekonomi kami, bahan baku utama kami menggunakan limbah kulit jeruk dari pedagang jus lokal dengan biaya perolehan mendekati nol rupiah, dipadu dengan pati singkong curah seharga Rp8.000/kg. Estimasi biaya produksi per lembar adalah Rp450, mendekati plastik konvensional (Rp250). Selisih biaya tersebut terkompensasi penuh oleh nilai tambah nol pajak limbah karbon dan kecepatan dekomposisi 14 hari tanpa biaya pengolahan TPA.',
    keyWordsToInclude: ['biaya', 'ekonomi', 'limbah', 'produksi', 'kompensasi', 'nilai tambah'],
  },
  {
    id: 5,
    juryId: 'jury-nat-1',
    category: 'Validitas & Keterbatasan Studi',
    question: 'Apa kelemahan atau ancaman validitas internal terbesar dalam penelitian ini yang belum sempat Anda selesaikan?',
    contextHint: 'Kejujuran akademis sangat dihargai oleh juri. Akui batasan studi dengan elegan dan tawarkan mitigasinya.',
    rubricCriteria: [
      'Keterbukaan terhadap batasan metodologi yang dihadapi',
      'Tidak defensif membabi buta',
      'Memberikan usulan uji konfirmasi lanjutan',
    ],
    modelAnswer: 'Kelemahan paling krusial yang kami identifikasi adalah durasi uji pelapukan luar ruangan (outdoor weathering) yang baru mencakup 14 hari, serta belum tersedianya alat uji spektroskopi FTIR di laboratorium sekolah untuk melihat ikatan kimia secara molekuler. Sebagai mitigasi, kami menyarankan pengujian lanjutan di laboratorium terakreditasi BRIN untuk mengonfirmasi interaksi gugus fungsional.',
    keyWordsToInclude: ['keterbatasan', 'kelemahan', 'mitigasi', 'validitas', 'lanjutan', 'laboratorium'],
  },
  {
    id: 6,
    juryId: 'jury-nat-2',
    category: 'Teori & Mekanisme Ilmiah',
    question: 'Bagaimana keterkaitan antara hasil temuan empiris Anda dengan teori dasar yang Anda ulas di Bab II?',
    contextHint: 'Tautkan data angka hasil eksperimen dengan konsep teoretis gelatinisasi dan ikatan hidrogen.',
    rubricCriteria: [
      'Menjelaskan mekanisme ilmiah di balik fenomena',
      'Mengutip teori yang relevan di Bab II',
      'Menjelaskan apakah hipotesis diterima atau ditolak dengan argumen saintifik',
    ],
    modelAnswer: 'Temuan kami secara tepat mengonfirmasi teori polimerisasi amilosa-amilopektin yang kami bahas pada subbab 2.1. Penambahan plasticizer menurunkan gaya kohesi antarmolekul rantai pati sehingga meningkatkan fleksibilitas, sedangkan rantai nonpolar d-limonena berhasil membentuk pelindung hidrofobik di permukaan film tipis sesuai dengan hipotesis kerja kami.',
    keyWordsToInclude: ['teori', 'konfirmasi', 'mekanisme', 'amilosa', 'ikatan', 'hipotesis'],
  },
];

// 2. International Grand Jury Panel (Regeneron ISEF / ICYS / IEEE Youth Standard)
const INTERNATIONAL_JURY_PANEL: JuryPersona[] = [
  {
    id: 'jury-intl-1',
    name: 'Dr. Eleanor Vance, Ph.D.',
    role: 'Lead Grand Award Judge · ISEF Scientific Review Committee (SRC) Chair',
    avatarBg: 'bg-blue-600',
    focus: 'Experimental Controls, Falsifiability, Standardized ISO/ASTM Protocols & Safety Compliance.',
    personality: 'Rigorous, laser-focused on empirical controls, statistical significance, and lab reproducibility.',
    affiliation: 'MIT Department of Materials Science & Engineering',
  },
  {
    id: 'jury-intl-2',
    name: 'Dr. Marcus Thorne, Ph.D.',
    role: 'Grand Award Judge · Quantitative Systems & IEEE Senior Fellow',
    avatarBg: 'bg-indigo-700',
    focus: 'Statistical Power (1 - β ≥ 0.80), Uncertainty Propagation, and Algorithmic Bounds.',
    personality: 'Deep mathematical scrutiny, validates instrument precision tolerances, error bars, and inferential logic.',
    affiliation: 'Stanford Systems & Robotics Lab',
  },
  {
    id: 'jury-intl-3',
    name: 'Dr. Aisha Al-Mansoor, D.Sc.',
    role: 'Grand Award Judge · Global CleanTech Innovation Laureate',
    avatarBg: 'bg-emerald-600',
    focus: 'Global Patent Novelty Benchmarking, Techno-Economic Scalability, and Life-Cycle Carbon Impact.',
    personality: 'Inquisitive on commercial viability, feedstock abundance, and global socio-environmental adoption.',
    affiliation: 'Cambridge Institute for Sustainability Leadership',
  },
];

const INTERNATIONAL_QUESTIONS: DefenseQuestion[] = [
  {
    id: 1,
    juryId: 'jury-intl-1',
    category: 'Statistical Power & Sample Size',
    question: 'How did you establish statistical power (1 - β ≥ 0.80) to ensure that your sample size (N) is sufficiently powered against Type II error in your primary hypothesis test?',
    contextHint: 'The SRC Grand Jury evaluates whether your statistical inference is backed by adequate sample power rather than small-sample artifact.',
    rubricCriteria: [
      'Explicitly cites statistical power target (0.80 or 80%) and alpha level (0.05)',
      'Mentions effect size (Cohen’s d or f) and power calculation tool (e.g. G*Power)',
      'Confirms independent replication count across treatments',
    ],
    modelAnswer: 'Thank you for this foundational question, Dr. Vance. Prior to physical testing, we conducted an a priori power calculation using G*Power 3.1. Assuming a two-tailed alpha of 0.05, a targeted statistical power of 1 - β = 0.85, and a projected large effect size of Cohen’s d = 0.80, the required sample size was computed as n = 28 per group. We conducted our experimental trials in triplicate with n = 36 independent specimens across 4 treatment groups, confirming our dataset exceeds the required threshold to eliminate Type II false negative inference.',
    keyWordsToInclude: ['power', 'sample size', 'beta', 'alpha', 'effect size', 'replicate', 'cohen', 'g*power'],
  },
  {
    id: 2,
    juryId: 'jury-intl-1',
    category: 'Standardized Protocols (ASTM/ISO)',
    question: 'Which specific ASTM or ISO standard testing protocols did you follow to ensure your tensile and barrier measurements can be replicated anywhere in the world?',
    contextHint: 'International science fairs require adherence to standardized laboratory test procedures and environmental conditioning.',
    rubricCriteria: [
      'Identifies exact ASTM or ISO standard codes (e.g., ASTM D638, ASTM D570)',
      'Specifies specimen geometry, crosshead velocity, and conditioning chamber specs',
      'Explains calibration verification of load cell or sensing apparatus',
    ],
    modelAnswer: 'All mechanical evaluations strictly adhered to ASTM D638 (Standard Test Method for Tensile Properties of Plastics) utilizing Type IV dumb-bell specimens conditioned for 48 hours at 23±2°C and 50±5% relative humidity. We deployed a computer-controlled Universal Testing Machine with a certified 500 N load cell calibrated to ISO 7500-1 Class 0.5 accuracy, operating at a constant crosshead displacement of 5.0 mm/min. For water barrier kinetics, we executed gravimetric sorption according to ASTM D570-98.',
    keyWordsToInclude: ['astm', 'iso', 'd638', 'd570', 'conditioning', 'crosshead', 'calibrated', 'standard'],
  },
  {
    id: 3,
    juryId: 'jury-intl-2',
    category: 'Uncertainty & Error Propagation',
    question: 'How did you compute quantitative error propagation (Δf) from your primary sensor precision down to your final stated efficiency claim?',
    contextHint: 'Dr. Thorne tests whether measurement errors could statistically negate your claimed percentage improvement.',
    rubricCriteria: [
      'Presents Gauss’s partial derivative error propagation formula',
      'Quotes primary sensor tolerances (balance precision, digital micrometer resolution)',
      'Demonstrates that measured delta (+18.6%) far exceeds cumulative instrument uncertainty (±1.4%)',
    ],
    modelAnswer: 'We modeled uncertainty through multivariate error propagation using Gauss’s root-sum-square formulation: Δf = sqrt( sum( (∂f/∂x_i * Δx_i)^2 ) ). Primary mass was measured on a Shimadzu analytical balance with ±0.1 mg uncertainty, while specimen thickness had an instrument tolerance of ±0.002 mm. Compounding these through our tensile modulus equation yielded a maximum propagated uncertainty of ±1.4%. Because our empirical improvement is +18.6%, the observed effect size substantially outstrips combined instrumental tolerance.',
    keyWordsToInclude: ['propagation', 'uncertainty', 'partial derivative', 'gauss', 'tolerance', 'precision', 'modulus'],
  },
  {
    id: 4,
    juryId: 'jury-intl-2',
    category: 'Boundary Conditions & Stress Envelopes',
    question: 'What are the deterministic boundary conditions, physical failure modes, and thermal stress thresholds of your engineered composite under non-ideal operating environments?',
    contextHint: 'Grand Award judges look for maturity: whether you have pushed your innovation to failure and know its exact limits.',
    rubricCriteria: [
      'Specifies upper and lower operational thermal boundaries (°C)',
      'Identifies the physical failure mechanism (brittle fracture, plasticizer leaching, or hydrolytic cleavage)',
      'States validated operational envelope for industrial deployment',
    ],
    modelAnswer: 'We investigated thermal and moisture failure thresholds across a stress matrix ranging from -10°C to 85°C. Thermogravimetric and dynamic mechanical analyses show that below 0°C, the composite undergoes vitrification of the amorphous domain, inducing brittle fracture along interfacial boundaries. Above 68°C under 85% relative humidity, plasticizer leaching accelerates, reducing tensile retention by 34%. Consequently, our validated operational envelope is certified between 15°C and 55°C at under 75% RH.',
    keyWordsToInclude: ['boundary', 'thermal', 'stress', 'failure', 'threshold', 'vitrification', 'envelope', 'humidity'],
  },
  {
    id: 5,
    juryId: 'jury-intl-3',
    category: 'Global Novelty & Prior Art Matrix',
    question: 'What is the precise patent or literature benchmark that distinguishes your work from existing publications in Scopus Q1 journals over the past three years?',
    contextHint: 'Assess your awareness of state-of-the-art patents and why your mechanism is genuinely novel.',
    rubricCriteria: [
      'Cites specific recent literature or patent references (2023-2025)',
      'Provides quantitative comparison of performance trade-offs',
      'Articulates the unique molecular or structural mechanism achieved',
    ],
    modelAnswer: 'State-of-the-art biocomposites published in ACS Sustainable Chemistry (Chen et al., 2024) achieved 38 MPa tensile strength, but suffered from unacceptably high water absorption exceeding 40%. Other patents rely on toxic synthetic crosslinkers. Our definitive novelty lies in deploying a non-toxic essential oil fraction containing d-limonene that acts as a dual hydrophobic capping agent, forming self-assembling micellar barriers. This elevates tensile modulus to 44.2 MPa while reducing water transmission by 52%, a milestone unachieved in contemporary literature.',
    keyWordsToInclude: ['novelty', 'benchmark', 'literature', 'scopus', 'tensile', 'barrier', 'mechanism', 'patent'],
  },
  {
    id: 6,
    juryId: 'jury-intl-3',
    category: 'Techno-Economics & Scalability',
    question: 'What is your techno-economic bill of materials (BOM) cost per kilogram at pilot-scale manufacturing (100,000 units), and how does it compete globally with petroleum-based polymers?',
    contextHint: 'Prove that your laboratory breakthrough can be commercially scaled with positive unit economics.',
    rubricCriteria: [
      'Quotes estimated cost per kilogram or unit ($/kg)',
      'Compares directly with petroleum baseline (e.g. PE, PP) and commercial bioplastics (PLA)',
      'Explains feedstock valorization and carbon offset incentives',
    ],
    modelAnswer: 'At an annualized pilot production of 100 metric tons, our techno-economic model projects a raw material cost of $1.18 per kilogram, favorably positioned against virgin polyethylene ($1.65/kg) and commercial PLA ($2.80/kg). By valorizing agricultural byproduct peel waste acquired at nominal logistics cost, our synthesis pathway achieves a projected 28% gross manufacturing margin at commercial scale while mitigating 2.4 kg of CO2-equivalent per kilogram produced.',
    keyWordsToInclude: ['cost', 'techno-economic', 'bom', 'production', 'commercial', 'scale', 'feedstock', 'margin'],
  },
];

export const DefenseSimulator: React.FC = () => {
  const { language } = useLanguage();

  // Track Selector: 'national' (OPSI/LKIR) vs 'international' (ISEF/ICYS/IEEE)
  const [track, setTrack] = useState<'national' | 'international'>('international');

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    strengths: string[];
    improvements: string[];
  } | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);

  // Timer states (3 minutes per question)
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 90-Second Elevator Pitch Mode
  const [isPitchMode, setIsPitchMode] = useState(false);
  const [pitchTimeLeft, setPitchTimeLeft] = useState(90);
  const [isPitchTimerRunning, setIsPitchTimerRunning] = useState(false);

  // Practiced count per track
  const [practicedNational, setPracticedNational] = useState(0);
  const [practicedIntl, setPracticedIntl] = useState(0);

  const isIntl = track === 'international';
  const activeJuryPanel = isIntl ? INTERNATIONAL_JURY_PANEL : NATIONAL_JURY_PANEL;
  const activeQuestions = isIntl ? INTERNATIONAL_QUESTIONS : NATIONAL_QUESTIONS;

  const currentQ = activeQuestions[activeQuestionIndex] || activeQuestions[0];
  const currentJury = activeJuryPanel.find((j) => j.id === currentQ.juryId) || activeJuryPanel[0];

  // Question Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Pitch Timer
  useEffect(() => {
    let interval: any = null;
    if (isPitchTimerRunning && pitchTimeLeft > 0) {
      interval = setInterval(() => {
        setPitchTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pitchTimeLeft === 0) {
      setIsPitchTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPitchTimerRunning, pitchTimeLeft]);

  const handleTrackChange = (newTrack: 'national' | 'international') => {
    setTrack(newTrack);
    setActiveQuestionIndex(0);
    setUserAnswer('');
    setEvaluated(false);
    setScore(null);
    setFeedback(null);
    setShowModelAnswer(false);
    setTimeLeft(180);
    setIsTimerRunning(false);
  };

  const handleNextQuestion = (nextIdx: number) => {
    setActiveQuestionIndex(nextIdx);
    setUserAnswer('');
    setEvaluated(false);
    setScore(null);
    setFeedback(null);
    setShowModelAnswer(false);
    setTimeLeft(180);
    setIsTimerRunning(false);
  };

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;

    const lowerAns = userAnswer.toLowerCase();
    const words = lowerAns.split(/\s+/).filter(Boolean);
    const matchedKeywords = currentQ.keyWordsToInclude.filter((kw) =>
      lowerAns.includes(kw.toLowerCase())
    );

    const lengthScore = Math.min(30, (words.length / 50) * 30);
    const keywordScore = (matchedKeywords.length / currentQ.keyWordsToInclude.length) * 50;

    const politeBonus = isIntl
      ? /(thank you|dr\.|committee|jury|hypothesis|statistically|significance|observed)/i.test(lowerAns) ? 20 : 10
      : /(terima kasih|dewan juri|berdasarkan|penelitian|analisis|hipotesis)/i.test(lowerAns) ? 20 : 10;

    const totalScore = Math.min(100, Math.round(lengthScore + keywordScore + politeBonus));
    setScore(totalScore);

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (isIntl) {
      if (matchedKeywords.length >= 2) {
        strengths.push(`Your defense effectively incorporates core technical keywords: ${matchedKeywords.join(', ')}.`);
      }
      if (words.length >= 35) {
        strengths.push('Commendable depth of argumentation; avoids superficial assertions.');
      }
      if (/(thank you|dr\.|committee)/i.test(lowerAns)) {
        strengths.push('Excellent academic rhetoric and professional scientific courtesy.');
      }

      if (matchedKeywords.length < 2) {
        improvements.push(`Strengthen your argument by incorporating key terminology: ${currentQ.keyWordsToInclude.slice(0, 3).join(', ')}.`);
      }
      if (words.length < 25) {
        improvements.push('Response is too brief. Quantify your data metrics and detail your empirical rationale.');
      }
      if (!/(astm|iso|alpha|beta|power|p <|uncertainty|controls)/i.test(lowerAns)) {
        improvements.push('Reinforce your answer with quantitative tolerances, standard testing codes (ASTM/ISO), or p-values.');
      }
    } else {
      if (matchedKeywords.length >= 2) {
        strengths.push(`Argumen memuat istilah kunci penting: ${matchedKeywords.join(', ')}.`);
      }
      if (words.length >= 35) {
        strengths.push('Kedalaman elaborasi jawaban memadai dan tidak tergesa-gesa.');
      }
      if (/(terima kasih|dewan juri)/i.test(lowerAns)) {
        strengths.push('Etika retorika sidang sangat santun dan akademis.');
      }

      if (matchedKeywords.length < 2) {
        improvements.push(`Tambahkan terminologi penting seperti: ${currentQ.keyWordsToInclude.slice(0, 3).join(', ')}.`);
      }
      if (words.length < 25) {
        improvements.push('Jawaban terlalu singkat. Jelaskan mekanisme data dan pembenaran ilmiahnya.');
      }
      if (!/(kontrol|standar|replikasi|literatur|biaya|efisiensi)/i.test(lowerAns)) {
        improvements.push('Perkuat bukti numerik atau rujukan baku agar juri tidak meragukan data Anda.');
      }
    }

    setFeedback({
      strengths: strengths.length > 0 ? strengths : [isIntl ? 'Logical thesis response foundation established.' : 'Struktur jawaban sudah dimulai dengan baik.'],
      improvements: improvements.length > 0 ? improvements : [isIntl ? 'Maintain steady cadence and confident eye contact.' : 'Pertahankan intonasi percaya diri saat berbicara langsung.'],
    });

    setEvaluated(true);
    if (isIntl) {
      setPracticedIntl((prev) => Math.max(prev, activeQuestionIndex + 1));
    } else {
      setPracticedNational((prev) => Math.max(prev, activeQuestionIndex + 1));
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-6">
      {/* Track Selector Bar (Prominent at top) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-700">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>{language === 'id' ? 'Pilih Jalur Kompetisi:' : 'Select Competition Track:'}</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => handleTrackChange('national')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              track === 'national'
                ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-500" />
            <span>🇮🇩 Lomba Nasional (OPSI · LKIR BRIN · MYRES)</span>
          </button>

          <button
            onClick={() => handleTrackChange('international')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              track === 'international'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>🌐 International Track (Regeneron ISEF · ICYS · IEEE)</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border ${
        isIntl
          ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border-blue-500/20'
          : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/20'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            <Gavel className="w-4 h-4 text-blue-300" />
            {isIntl
              ? 'Regeneron ISEF & ICYS Grand Jury Defense Simulator'
              : 'Simulasi Sidang & Tanya Jawab Juri Nasional (OPSI / LKIR)'}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {isIntl
              ? 'Master Tough International Thesis Defense Questions'
              : 'Latihan Menjawab Pertanyaan Kritis Sidang KTI'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {isIntl
              ? 'Face a distinguished 3-judge International Grand Panel (MIT SRC Chair, Stanford IEEE Fellow, Cambridge Cleantech Laureate) evaluating statistical power (1 - β), ISO/ASTM standards, error propagation, and global novelty.'
              : 'Hadapi panel 3 dewan juri virtual (Pakar Metodologi, Teori & Kebaruan, dan Aplikasi Industri) dengan bank soal killer questions berstandar OPSI, LKIR BRIN, dan Sidang Skripsi.'}
          </p>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                {isIntl ? 'Questions Practiced:' : 'Soal Dilatih:'}{' '}
                <strong>{isIntl ? practicedIntl : practicedNational}</strong> / {activeQuestions.length}
              </span>
            </div>

            <button
              onClick={() => setShowRubricModal(true)}
              className="bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 font-semibold text-white transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isIntl ? 'ISEF 100-Point Scoring Rubric' : 'Rubrik Penilaian Juri'}</span>
            </button>

            <button
              onClick={() => setIsPitchMode(!isPitchMode)}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-3.5 py-1.5 rounded-full border border-cyan-400/30 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
            >
              <Timer className="w-4 h-4 text-cyan-300" />
              <span>{isPitchMode ? 'Tutup Pitch Timer' : isIntl ? '90s Elevator Pitch Mode' : 'Mode Pitch 90 Detik'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 90-Second Pitch Panel (Interactive Mode) */}
      {isPitchMode && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/30 rounded-3xl p-6 text-white shadow-lg animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-800/40">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Timer className="w-4 h-4" />
                <span>{isIntl ? 'Official ISEF 90-Second Booth Elevator Pitch' : 'Latihan Pitch 90 Detik ke Juri'}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {isIntl ? 'Deliver Your High-Impact Scientific Narrative Under Time Pressure' : 'Sampaikan Intisari Riset Anda Secara Padat & Mengesankan'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-3xl font-black font-mono ${pitchTimeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                {formatTimer(pitchTimeLeft)}
              </span>
              <button
                onClick={() => setIsPitchTimerRunning(!isPitchTimerRunning)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {isPitchTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPitchTimerRunning ? 'Pause' : 'Start Pitch'}</span>
              </button>
              <button
                onClick={() => {
                  setIsPitchTimerRunning(false);
                  setPitchTimeLeft(90);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">1. Hook & Problem (0-20s)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isIntl ? 'Start with a shocking global statistic or critical real-world failure mode.' : 'Mulai dengan fakta urgensi empiris atau kegagalan metode lama.'}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">2. Hypothesis & Novelty (20-45s)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isIntl ? 'State your unique mechanism and why no prior publication solved it.' : 'Jelaskan mekanisme kebaruan yang belum pernah diteliti sebelumnya.'}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">3. Quantified Evidence (45-75s)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isIntl ? 'Cite ASTM standard testing, +% delta, and statistical p-value (p < 0.05).' : 'Sebutkan angka terukur pengujian triplo dan signifikansi data.'}
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-cyan-300 block mb-1">4. Scalability & Impact (75-90s)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isIntl ? 'Provide BOM cost/kg comparison and your patent or industrial roadmap.' : 'Tutup dengan kelayakan biaya produksi dan kemanfaatan nyata.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Jury Profile & Question Bank (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Jury Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${currentJury.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
                {currentJury.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {currentJury.name}
                </h3>
                <p className="text-[11px] text-blue-600 font-semibold">
                  {currentJury.affiliation || currentJury.role}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>{isIntl ? 'Grand Jury Scrutiny Focus:' : 'Fokus Penilaian Juri:'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {currentJury.focus}
              </p>
            </div>
          </div>

          {/* Question List Buttons */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{isIntl ? 'Grand Jury Question Bank (1-6)' : 'Pilihan Pertanyaan Juri (1-6)'}</span>
              <span className="text-[10px] text-slate-400 font-normal">{track.toUpperCase()}</span>
            </div>

            <div className="space-y-1.5">
              {activeQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => handleNextQuestion(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    activeQuestionIndex === idx
                      ? isIntl
                        ? 'bg-blue-50 border border-blue-200 text-blue-900 font-bold'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      activeQuestionIndex === idx ? (isIntl ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white') : 'bg-slate-200 text-slate-700'
                    }`}>
                      {q.id}
                    </span>
                    <span className="truncate">{q.category}: {q.question}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Question, Speech, Timer & Response Box (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Defense Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">
                  {currentQ.category}
                </span>
                <span className="text-xs text-slate-400">
                  {isIntl ? 'Question' : 'Pertanyaan'} {activeQuestionIndex + 1} of {activeQuestions.length}
                </span>
              </div>

              {/* Speech & Timer controls */}
              <div className="flex items-center gap-3">
                <AudioSpeechPlayer
                  text={currentQ.question}
                  label={isIntl ? 'Listen in English' : 'Dengarkan Pertanyaan Juri'}
                  size="sm"
                  variant="button"
                />

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-xl text-xs font-bold text-slate-700 font-mono">
                  <Timer className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formatTimer(timeLeft)}</span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer"
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                </div>
              </div>
            </div>

            {/* Question Text Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl relative">
              <div className="text-xs text-blue-300 font-semibold mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {currentJury.name} ({currentJury.role})
              </div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                "{currentQ.question}"
              </p>
              <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>{isIntl ? 'Jury Context Hint:' : 'Petunjuk Juri:'} {currentQ.contextHint}</span>
              </div>
            </div>

            {/* User Answer Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>{isIntl ? 'Formulate Your Oral Defense Response (Academic English)' : 'Ketik Jawaban Pembelaan Anda'}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} {isIntl ? 'words' : 'kata'}
                </span>
              </label>
              <textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={
                  isIntl
                    ? 'Example: "Thank you for the critical inquiry, Dr. Vance. In our experimental architecture, the sample size was mathematically established using G*Power 3.1..."'
                    : 'Contoh: "Terima kasih atas pertanyaan Dewan Juri. Dalam penelitian kami, variabel kontrol diisolasi dengan cara..."'
                }
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleEvaluateAnswer}
                disabled={!userAnswer.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                {isIntl ? 'Evaluate Defense Answer (AI)' : 'Uji & Nilai Jawaban AI'}
              </button>

              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                {showModelAnswer
                  ? isIntl
                    ? 'Hide Model Answer'
                    : 'Sembunyikan Kunci Jawaban'
                  : isIntl
                  ? 'View Gold-Standard Answer'
                  : 'Lihat Jawaban Standar Emas'}
              </button>
            </div>
          </div>

          {/* Feedback & Score Panel */}
          {evaluated && score !== null && feedback && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {isIntl ? 'Grand Jury Defense Readiness Score' : 'Skor Kesiapan Sidang'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-black ${
                      score >= 80 ? 'text-emerald-600' : score >= 65 ? 'text-blue-600' : 'text-amber-600'
                    }`}
                  >
                    {score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isIntl ? 'Key Strengths in Your Defense:' : 'Kelebihan Jawaban Anda:'}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-emerald-800/90 leading-relaxed">
                    {feedback.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isIntl ? 'Grand Jury Critique & Gaps:' : 'Catatan Kritis Dewan Juri:'}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-amber-800/90 leading-relaxed">
                    {feedback.improvements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Model Answer (Jawaban Standar Emas) */}
          {showModelAnswer && (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    {isIntl ? 'Gold-Standard Defense Answer (Academic English)' : 'Rekomendasi Jawaban Standar Emas Dewan Juri'}
                  </span>
                </div>

                <AudioSpeechPlayer
                  text={currentQ.modelAnswer}
                  label={isIntl ? 'Listen in English' : 'Dengarkan Jawaban Ideal'}
                  size="sm"
                  variant="button"
                />
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans shadow-xs">
                "{currentQ.modelAnswer}"
              </div>

              <div className="text-[11px] text-blue-900/80 space-y-1">
                <strong>💡 {isIntl ? 'Grand Jury Rhetoric Strategy:' : 'Kunci Retorika Sidang:'}</strong>{' '}
                {isIntl
                  ? 'Always open with polite professional appreciation, state concrete numerical metrics and standardized ASTM/ISO protocols directly, and conclude with receptiveness to ongoing methodological validation.'
                  : 'Selalu mulai dengan apresiasi sopan terhadap pertanyaan, langsung berikan parameter angka/metode spesifik, dan akhiri dengan keterbukaan terhadap saran dewan juri.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official Regeneron ISEF 100-Point Scoring Rubric Modal */}
      {showRubricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isIntl ? 'Official Regeneron ISEF 100-Point Judging Rubric' : 'Pedoman Penilaian Sidang Juri'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIntl ? 'Grand Award Criteria for Science & Engineering Projects' : 'Kriteria Resmi Penilaian OPSI & LKIR BRIN'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRubricModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-blue-950 block text-sm">I. Research Question / Problem Formulation</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Clear and focused purpose, contribution to field, testable hypotheses using scientific methods or explicit engineering goals.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-xs shrink-0">10 Pts</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-indigo-950 block text-sm">II. Design & Methodology</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Well-designed plan and data collection methods, variable control matrix, adequate sample size, reproducible lab protocols.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-xs shrink-0">15 Pts</span>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-teal-950 block text-sm">III. Execution: Data Collection, Analysis & Synthesis</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Systematic data collection, reproducibility, rigorous statistical tests (ANOVA, Tukey, error propagation), acknowledgment of limitations.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-600 text-white font-extrabold text-xs shrink-0">20 Pts</span>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-purple-950 block text-sm">IV. Creativity & Invention</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Demonstrating significant imagination and inventiveness in identifying problem, developing solution, or interpreting data.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-extrabold text-xs shrink-0">20 Pts</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-amber-950 block text-sm">V. Presentation & Oral Defense (Viva Voce)</span>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Clarity, logical sequence, depth of answers to questions, understanding of underlying science, independent student work.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-extrabold text-xs shrink-0">35 Pts</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRubricModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                {isIntl ? 'Close Rubric Inspector' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
