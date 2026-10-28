import React, { useState, useEffect } from 'react';
import { Paper, ProposalData } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { ScholarSearch } from './components/ScholarSearch';
import { ProposalBuilder } from './components/ProposalBuilder';
import { ProposalAiAssistant } from './components/ProposalAiAssistant';
import { TopicBrainstormer } from './components/TopicBrainstormer';
import { AiMentorChat } from './components/AiMentorChat';
import { ParaphraseTool } from './components/ParaphraseTool';
import { PuebiGrammarChecker } from './components/PuebiGrammarChecker';
import { PaperSummarizer } from './components/PaperSummarizer';
import { DefenseSimulator } from './components/DefenseSimulator';
import { MyResearchVault } from './components/MyResearchVault';
import { IntlConferenceMatcher } from './components/IntlConferenceMatcher';
import { IntlPeerReviewer } from './components/IntlPeerReviewer';
import { IntlPublishFormatter } from './components/IntlPublishFormatter';
import { IntlGrantsCatalog } from './components/IntlGrantsCatalog';
import { ReferenceLibrary } from './components/ReferenceLibrary';
import { EconomicMarketTracker } from './components/EconomicMarketTracker';
import { ResearchToolkit } from './components/ResearchToolkit';
import { AuthModal } from './components/AuthModal';
import { VerificationModal } from './components/VerificationModal';
import { useLanguage } from './context/LanguageContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  Heart,
  HelpCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

// Sample preloaded papers for immediate exploration
const DEFAULT_SAVED_PAPERS: Paper[] = [
  {
    id: 'paper-sample-1',
    title: 'Sintesis dan Karakterisasi Bioplastik Berbasis Pati Singkong dengan Penambahan Gliserol dan Minyak Atsiri',
    authors: ['Suryanto, B.', 'Rahmawati, D.', 'Pratama, A.'],
    publicationYear: 2023,
    journalName: 'Jurnal Rekayasa Kimia dan Lingkungan',
    citationCount: 24,
    doi: '10.23955/rkl.v18i2.28911',
    isOpenAccess: true,
    abstract: 'Penelitian ini bertujuan untuk menganalisis sifat mekanik dan daya biodegradasi bioplastik berbahan dasar pati singkong dengan variasi konsentrasi gliserol sebagai plasticizer serta penambahan minyak atsiri sebagai agen antimikroba alami. Hasil uji biodegradasi menunjukkan bioplastik terurai sempurna dalam tanah dalam waktu 14 hari.',
    source: 'Jurnal Terakreditasi SINTA 2',
    apaCitation: 'Suryanto, B., Rahmawati, D., & Pratama, A. (2023). Sintesis dan Karakterisasi Bioplastik Berbasis Pati Singkong dengan Penambahan Gliserol dan Minyak Atsiri. Jurnal Rekayasa Kimia dan Lingkungan. https://doi.org/10.23955/rkl.v18i2.28911',
  },
  {
    id: 'paper-sample-2',
    title: 'Uji Efektivitas Ekstrak Daun Kelor (Moringa oleifera) terhadap Penghambatan Bakteri Staphylococcus aureus',
    authors: ['Widodo, S.', 'Kusumawati, E.'],
    publicationYear: 2022,
    journalName: 'Jurnal Biologi Tropis',
    citationCount: 38,
    doi: '10.29303/jbt.v22i3.3912',
    isOpenAccess: true,
    abstract: 'Daun kelor mengandung senyawa fitokimia flavonoid, saponin, dan tanin yang berpotensi sebagai antibakteri alami. Metode difusi cakram kertas digunakan untuk menguji zona hambat ekstrak etanol daun kelor pada konsentrasi 25%, 50%, dan 75% terhadap pertumbuhan bakteri Staphylococcus aureus.',
    source: 'Jurnal Nasional Terindeks SINTA',
    apaCitation: 'Widodo, S., & Kusumawati, E. (2022). Uji Efektivitas Ekstrak Daun Kelor (Moringa oleifera) terhadap Penghambatan Bakteri Staphylococcus aureus. Jurnal Biologi Tropis. https://doi.org/10.29303/jbt.v22i3.3912',
  },
];

// Sample preloaded default proposal
const DEFAULT_PROPOSAL: ProposalData = {
  judul: 'Pemanfaatan Pati Singkong (Manihot esculenta) dan Minyak Kulit Jeruk sebagai Bioplastik Biodegradable Ramah Lingkungan',
  bidang: 'IPA Hayati & Lingkungan',
  jenjang: 'SMA/MA/SMK',
  pendekatan: 'Kuantitatif Eksperimental',
  abstrakSingkat: 'Penelitian ini mengembangkan bioplastik ramah lingkungan berbasis pati singkong dengan pemanfaatan limbah minyak kulit jeruk manis sebagai agen antibakteri dan pelapis ketahanan air.',
  bab1: {
    latarBelakang: `Sampah plastik konvensional berbahan dasar minyak bumi (petroleum-based plastics) merupakan salah satu krisis lingkungan paling mendesak di Indonesia. Berdasarkan data Kementerian Lingkungan Hidup dan Kehutanan (KLHK), timbulan sampah plastik nasional mencapai jutaan ton per tahun dan memerlukan waktu ratusan tahun untuk dapat terurai secara alami.

Di sisi lain, Indonesia merupakan salah satu produsen singkong terbesar di dunia dengan kandungan pati amilosa dan amilopektin yang melimpah. Pati singkong memiliki potensi besar untuk disintesis menjadi bioplastik yang dapat terurai oleh mikroorganisme tanah (biodegradable). Namun demikian, kelemahan utama bioplastik murni berbahan pati adalah sifat mekaniknya yang rapuh dan ketahanan terhadap air yang masih rendah.

Untuk mengatasi permasalahan tersebut, pemanfaatan limbah kulit jeruk manis (Citrus sinensis) yang mengandung senyawa d-limonena dan minyak atsiri hydrophobic berpotensi memperbaiki ketahanan air serta memberikan efek antimikroba alami. Oleh sebab itu, penelitian ini dilakukan untuk merumuskan formulasi optimum bioplastik berbasis pati singkong dan limbah kulit jeruk yang kuat, tahan air, dan ramah lingkungan.`,
    rumusanMasalah: [
      'Bagaimana pengaruh variasi konsentrasi minyak kulit jeruk terhadap kuat tarik (tensile strength) bioplastik pati singkong?',
      'Bagaimana pengaruh penambahan minyak kulit jeruk terhadap laju biodegradasi bioplastik dalam tanah?',
      'Berapa komposisi formula optimum bioplastik pati singkong yang menghasilkan ketahanan air paling baik namun tetap mudah terurai?',
    ],
    tujuanPenelitian: [
      'Mengetahui pengaruh variasi konsentrasi minyak kulit jeruk terhadap sifat mekanik dan kuat tarik bioplastik pati singkong.',
      'Mengukur laju dan waktu biodegradasi bioplastik dalam media tanah kompos.',
      'Menemukan formulasi terbaik bioplastik berbasis pati singkong yang ramah lingkungan dan fungsional.',
    ],
    manfaatPenelitian: {
      teoretis: 'Memberikan sumbangan keilmuan dalam bidang sains material terbarukan dan kimia terapan mengenai interaksi pati nabati dengan minyak atsiri alami sebagai aditif biopolimer.',
      praktis: [
        'Bagi Lingkungan: Memberikan alternatif kemasan biodegradable untuk mengurangi penumpukan sampah plastik sekali pakai.',
        'Bagi Petani & UMKM: Meningkatkan nilai ekonomis komoditas singkong lokal dan mendaur ulang limbah kulit jeruk.',
        'Bagi Pelajar: Menjadi model riset sains tepat guna yang aplikatif dan dapat dikembangkan di laboratorium sekolah.',
      ],
    },
    batasanMasalah: 'Penelitian ini dibatasi pada pengujian sifat fisik (daya serap air), sifat mekanik sederhana, dan uji laju biodegradasi tanah selama 14 hari dengan bahan baku singkong lokal varietas mukibat.',
  },
  bab2: {
    kajianTeori: `Bioplastik didefinisikan sebagai plastik yang berasal dari sumber daya biomassa terbarukan, seperti minyak nabati, pati jagung, pati singkong, atau mikrobiota. Pati tersusun atas dua fraksi polimer glukosa, yaitu amilosa dengan rantai lurus dan amilopektin dengan rantai bercabang. Rasio amilosa terhadap amilopektin sangat menentukan karakteristik pembentukan film tipis (gelatinisasi).

Plasticizer seperti gliserol digunakan untuk menurunkan gaya tarik antarmolekul rantai polimer pati, sehingga menghasilkan lapisan plastik yang lebih lentur dan tidak mudah retak. Selanjutnya, senyawa d-limonena dalam minyak kulit jeruk berfungsi sebagai fase hidrofobik yang menghambat penetrasi molekul air ke dalam matriks pati.`,
    penelitianTerdahulu: `Menurut penelitian Suryanto et al. (2023), penambahan plasticizer gliserol sebesar 2-3 mL pada 10 gram pati singkong menghasilkan film bioplastik dengan elastisitas yang baik dan dapat terurai sempurna di tanah dalam 14 hari. Namun ketahanan air masih perlu ditingkatkan dengan bahan hidrofobik alami.`,
    kerangkaBerpikir: 'Pati Singkong (Rapuh & Hidrofilik) + Gliserol (Fleksibilitas) + Minyak Kulit Jeruk (Anti-air & Antibakteri) -> Pemanasan & Cetak Film -> Karakterisasi Kuat Tarik, Daya Serap Air, dan Uji Biodegradasi Tanah.',
    hipotesis: 'Terdapat pengaruh signifikan penambahan konsentrasi minyak kulit jeruk terhadap peningkatan ketahanan air dan sifat mekanik bioplastik pati singkong tanpa menghambat laju biodegradasi alaminya.',
  },
  bab3: {
    jenisPenelitian: 'Penelitian ini merupakan penelitian kuantitatif dengan pendekatan eksperimental laboratorium menggunakan Rancangan Acak Lengkap (RAL) satu faktor.',
    waktuDanTempat: 'Penelitian dilaksanakan selama dua bulan di Laboratorium Kimia dan Biologi SMA Negeri serta pengujian biodegradasi di lingkungan pekarangan sekolah.',
    populasiDanSampel: 'Sampel penelitian adalah pati singkong murni lokal dan limbah kulit jeruk manis dengan variasi konsentrasi minyak atsiri: 0%, 2%, 4%, dan 6% (v/w pati) dengan tiga kali pengulangan (triplo).',
    variabelPenelitian: 'Variabel Bebas: Konsentrasi minyak kulit jeruk. Variabel Terikat: Kuat tarik (tensile strength), persentase serap air (water absorption), dan laju biodegradasi (weight loss). Variabel Kontrol: Massa pati (10 gram), volume gliserol (2 mL), dan suhu pemanasan (70°C).',
    teknikPengumpulanData: '1) Uji Ketahanan Air: Pengukuran selisih massa bioplastik sebelum dan setelah perendaman air selama 60 menit. 2) Uji Biodegradasi: Penguburan sampel bioplastik berukuran 3x3 cm dalam tanah sedalam 5 cm dan ditimbang setiap 3 hari.',
    instrumenPenelitian: 'Timbangan analitik digital ketelitian 0,001 g, magnetic stirrer hotplate, jangka sorong digital, gelas ukur, dan cetakan kaca teflon.',
    teknikAnalisisData: 'Data hasil pengujian dianalisis secara deskriptif kuantitatif dan disajikan dalam bentuk tabel serta grafik tren perbandingan.',
  },
  daftarPustaka: [
    'Suryanto, B., Rahmawati, D., & Pratama, A. (2023). Sintesis dan Karakterisasi Bioplastik Berbasis Pati Singkong dengan Penambahan Gliserol dan Minyak Atsiri. Jurnal Rekayasa Kimia dan Lingkungan, 18(2), 112-120. https://doi.org/10.23955/rkl.v18i2.28911',
    'Kementerian Lingkungan Hidup dan Kehutanan. (2023). Sistem Informasi Pengelolaan Sampah Nasional (SIPSN). Jakarta: KLHK RI.',
    'Guenther, E. (2018). Minyak Atsiri: Komposisi dan Pemanfaatan Terapan. Jakarta: Universitas Indonesia Press.',
  ],
  saranPembimbing: 'Proposal ini memiliki ide yang kuat untuk ajang OPSI (Olimpiade Penelitian Siswa Indonesia). Pastikan prosedur uji biodegradasi didokumentasikan dengan foto setiap interval 3 hari untuk bukti autentik dalam laporan akhir.',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('scholar');
  const [savedPapers, setSavedPapers] = useState<Paper[]>(() => {
    try {
      const saved = localStorage.getItem('cendekia_saved_papers');
      return saved ? JSON.parse(saved) : DEFAULT_SAVED_PAPERS;
    } catch {
      return DEFAULT_SAVED_PAPERS;
    }
  });

  const [currentProposal, setCurrentProposal] = useState<ProposalData | null>(() => {
    try {
      const saved = localStorage.getItem('cendekia_current_proposal');
      return saved ? JSON.parse(saved) : DEFAULT_PROPOSAL;
    } catch {
      return DEFAULT_PROPOSAL;
    }
  });

  const { language, settings, t } = useLanguage();
  const [initialTopic, setInitialTopic] = useState('');
  const [dismissEcoAlert, setDismissEcoAlert] = useState(false);

  // Auto-detect if topic relates to economics / finance / macro
  const isEconomicsTopic = React.useMemo(() => {
    if (!settings.autoDetectEconomics) return false;
    const combined = `${currentProposal?.judul || ''} ${currentProposal?.bidang || ''} ${initialTopic || ''}`.toLowerCase();
    const keywords = [
      'ekonomi', 'ihsg', 'rupiah', 'kurs', 'inflasi', 'saham', 'pasar modal',
      'investasi', 'keuangan', 'moneter', 'perbankan', 'bunga', 'pajak',
      'komoditas', 'sawit', 'cpo', 'emas', 'nikel', 'finance', 'macro', 'micro',
      'devisa', 'valuta', 'forex'
    ];
    return keywords.some((k) => combined.includes(k));
  }, [currentProposal, initialTopic, settings.autoDetectEconomics]);

  // Persist saved papers to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('cendekia_saved_papers', JSON.stringify(savedPapers));
    } catch (e) {
      console.warn('Failed to save papers to localStorage:', e);
    }
  }, [savedPapers]);

  // Persist current proposal to LocalStorage
  useEffect(() => {
    if (currentProposal) {
      try {
        localStorage.setItem('cendekia_current_proposal', JSON.stringify(currentProposal));
      } catch (e) {
        console.warn('Failed to save proposal to localStorage:', e);
      }
    }
  }, [currentProposal]);

  const handleToggleSavePaper = (paper: Paper) => {
    setSavedPapers((prev) => {
      const exists = prev.some((p) => p.id === paper.id);
      if (exists) {
        return prev.filter((p) => p.id !== paper.id);
      } else {
        return [...prev, paper];
      }
    });
  };

  const handleRemovePaper = (paperId: string) => {
    setSavedPapers((prev) => prev.filter((p) => p.id !== paperId));
  };

  const handleAddManualPaper = (newPaper: Paper) => {
    setSavedPapers((prev) => [newPaper, ...prev]);
  };

  const handleUseAsProposalTopic = (topic: string, paper?: Paper) => {
    setInitialTopic(topic);
    if (paper) {
      // Also ensure paper is saved so it can be cited
      setSavedPapers((prev) => {
        if (!prev.some((p) => p.id === paper.id)) {
          return [...prev, paper];
        }
        return prev;
      });
    }
    setActiveTab('proposal');
  };

  const handleInsertSynthesisToBab2 = (text: string) => {
    if (!currentProposal) return;
    const updated = { ...currentProposal };
    updated.bab2.penelitianTerdahulu = updated.bab2.penelitianTerdahulu
      ? `${updated.bab2.penelitianTerdahulu}\n\n${text}`
      : text;
    setCurrentProposal(updated);
  };

  const handleInsertEconomicDataToProposal = (citationText: string) => {
    if (!currentProposal) return;
    const updated = { ...currentProposal };
    if (!updated.daftarPustaka.includes(citationText)) {
      updated.daftarPustaka.push(citationText);
    }
    // Also append to bab 3 data collection
    updated.bab3.teknikPengumpulanData = `${updated.bab3.teknikPengumpulanData}\n\n[Data Sekunder Resmi]: ${citationText}`;
    setCurrentProposal(updated);
  };

  const handleApplyAdviceToProposal = (
    section: 'latarBelakang' | 'rumusanMasalah' | 'tujuanPenelitian' | 'metodologi' | 'all',
    content: any
  ) => {
    if (!currentProposal) return;
    const updated: ProposalData = JSON.parse(JSON.stringify(currentProposal));

    if (section === 'latarBelakang' && typeof content === 'string') {
      updated.bab1.latarBelakang = `${content}\n\n${updated.bab1.latarBelakang}`;
    } else if (section === 'rumusanMasalah' && Array.isArray(content)) {
      updated.bab1.rumusanMasalah = content;
    } else if (section === 'tujuanPenelitian' && Array.isArray(content)) {
      updated.bab1.tujuanPenelitian = content;
    } else if (section === 'metodologi' && typeof content === 'object') {
      if (content.pendekatan) updated.bab3.jenisPenelitian = content.pendekatan;
      if (content.populasiDanSampel) updated.bab3.populasiDanSampel = content.populasiDanSampel;
      if (content.instrumen) updated.bab3.instrumenPenelitian = content.instrumen;
      if (content.analisisStatistik) updated.bab3.teknikAnalisisData = content.analisisStatistik;
      if (content.teknikPengumpulanData) updated.bab3.teknikPengumpulanData = content.teknikPengumpulanData;
    }

    setCurrentProposal(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedPapers.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Automatic Economic Topic Detection Callout */}
        {isEconomicsTopic && !dismissEcoAlert && activeTab !== 'market' && (
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span>{t('detectedEcoTopic')}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Feed Pasar 24/7</span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {t('detectedEcoDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => setActiveTab('market')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
              >
                <span>{t('openMarketHub')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDismissEcoAlert(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs cursor-pointer"
                title="Tutup pemberitahuan"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {activeTab === 'scholar' && (
          <ScholarSearch
            savedPapers={savedPapers}
            onToggleSavePaper={handleToggleSavePaper}
            onUseAsProposalTopic={handleUseAsProposalTopic}
            onInsertSynthesisToBab2={handleInsertSynthesisToBab2}
          />
        )}

        {activeTab === 'assistant' && (
          <ProposalAiAssistant
            currentProposal={currentProposal}
            onApplyAdviceToProposal={handleApplyAdviceToProposal}
            onNavigateToProposalBuilder={() => setActiveTab('proposal')}
          />
        )}

        {activeTab === 'proposal' && (
          <ProposalBuilder
            currentProposal={currentProposal}
            onUpdateProposal={setCurrentProposal}
            savedPapers={savedPapers}
            initialTopic={initialTopic}
          />
        )}

        {activeTab === 'market' && (
          <EconomicMarketTracker
            onInsertToProposal={handleInsertEconomicDataToProposal}
          />
        )}

        {activeTab === 'toolkit' && (
          <ResearchToolkit
            currentProposal={currentProposal}
            onInsertToProposal={handleInsertSynthesisToBab2}
          />
        )}

        {activeTab === 'brainstorm' && (
          <TopicBrainstormer
            onSelectTopicForProposal={(t, _cat) => {
              setInitialTopic(t);
              setActiveTab('proposal');
            }}
            onSearchScholarTopic={(t) => {
              setActiveTab('scholar');
            }}
          />
        )}

        {activeTab === 'mentor' && (
          <AiMentorChat currentProposal={currentProposal} />
        )}

        {activeTab === 'paraphrase' && (
          <ParaphraseTool />
        )}

        {activeTab === 'grammar' && (
          <PuebiGrammarChecker />
        )}

        {activeTab === 'summarizer' && (
          <PaperSummarizer />
        )}

        {activeTab === 'defense' && (
          <DefenseSimulator />
        )}

        {activeTab === 'myLab' && (
          <MyResearchVault />
        )}

        {activeTab === 'intlMatch' && (
          <IntlConferenceMatcher />
        )}

        {activeTab === 'intlReviewer' && (
          <IntlPeerReviewer />
        )}

        {activeTab === 'intlPublish' && (
          <IntlPublishFormatter />
        )}

        {activeTab === 'intlGrants' && (
          <IntlGrantsCatalog />
        )}

        {activeTab === 'library' && (
          <ReferenceLibrary
            savedPapers={savedPapers}
            onRemovePaper={handleRemovePaper}
            onAddManualPaper={handleAddManualPaper}
            onNavigateToProposal={() => setActiveTab('proposal')}
          />
        )}
      </main>

      {/* Floating Mentor Consultation Trigger */}
      {activeTab !== 'mentor' && (
        <button
          onClick={() => setActiveTab('mentor')}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 text-xs font-semibold transition-all hover:-translate-y-0.5 cursor-pointer border border-slate-700/80"
          title="Buka Konsultasi Riset dengan Pembimbing AI"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Tanya Pembimbing KTI</span>
        </button>
      )}

      {/* Authentication and Verification Dialogs */}
      <AuthModal />
      <VerificationModal />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">CendekiaKTI</span>
            <span>·</span>
            <span className="text-slate-500">Panduan Riset & Proposal Ilmiah</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Pedoman OPSI · LKIR BRIN · MYRES</span>
            <span>·</span>
            <span>Data BEI & OpenAlex</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
