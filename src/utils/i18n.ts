import { Language } from '../types';

export const translations = {
  id: {
    // Brand
    brandName: 'CendekiaKTI',
    brandTagline: 'Asisten Riset & Proposal Ilmiah Cerdas',
    badgeStudent: 'Pelajar & Mahasiswa',
    
    // Navbar Tabs
    tabScholar: 'Pencarian Scholar',
    tabAssistant: 'Asisten Proposal AI',
    tabProposal: 'Naskah Proposal',
    tabLibrary: 'Manajer Referensi',
    tabBrainstorm: 'Inspirasi Judul',
    tabMentor: 'Konsultasi Riset',
    tabParaphrase: 'Parafrase EYD',
    tabGrammar: 'Cek Ejaan PUEBI',
    tabSummarizer: 'Ekstraktor & Mindmap',
    tabDefense: 'Simulasi Sidang Juri',
    tabMyLab: 'Portofolio & Lab Saya',
    tabIntlMatch: 'Target Konferensi Dunia',
    tabIntlReviewer: 'Reviewer Jurnal Global',
    tabIntlPublish: 'Translator & LaTeX IEEE',
    tabIntlGrants: 'Hibah Riset Global',
    tabMarket: 'Pasar & Ekonomi 24/7',
    tabToolkit: 'Peralatan Riset (12 Alat)',
    quickProposalBtn: 'Susun Proposal',

    // Auth & Account
    loginBtn: 'Masuk Akun',
    signUpBtn: 'Daftar Akun',
    guestBtn: 'Mode Tamu',
    verifyAccountBtn: 'Verifikasi Akun',
    verifiedBadge: 'Terverifikasi',
    unverifiedBadge: 'Belum Verifikasi',
    logoutBtn: 'Keluar Akun',
    verifyWarningRibbon: 'Akun Anda belum diverifikasi. Verifikasi sekarang untuk mendapatkan lencana Peneliti Terverifikasi.',
    verifyNowBtn: 'Verifikasi Sekarang',

    // Language & Settings
    languageSettings: 'Pengaturan Bahasa & Suara',
    languageLabel: 'Bahasa Antarmuka',
    indonesian: 'Bahasa Indonesia',
    english: 'English (US)',
    ttsVoiceLabel: 'Pilihan Suara Narator AI',
    ttsSpeedLabel: 'Kecepatan Bicara',
    normalSpeed: 'Normal (1.0x)',
    close: 'Tutup',
    save: 'Simpan',

    // Text to Speech
    ttsPlay: 'Dengarkan Audio',
    ttsPlaying: 'Sedang Membaca...',
    ttsStop: 'Hentikan Audio',
    ttsLoading: 'Menyiapkan Suara AI...',
    ttsError: 'Gagal memutar audio',
    ttsBrowserNotice: 'Menggunakan suara browser default',

    // Economic Market Tracker
    marketTitle: 'Data Pasar Modal & Indikator Ekonomi 24/7',
    marketSubtitle: 'Pusat data sekunder terverifikasi untuk riset ilmu ekonomi, akuntansi, bisnis, dan studi sosial kuantitatif.',
    liveTicker: 'LIVE 24/7',
    ihsgTitle: 'IHSG (Indeks Harga Saham Gabungan)',
    forexTitle: 'Kurs Valuta Asing (Rupiah FX)',
    commoditiesTitle: 'Komoditas Unggulan & Strategis',
    macroTitle: 'Indikator Makroekonomi Nasional (BI & BPS)',
    timeRange1D: '1 Hari',
    timeRange1W: '1 Minggu',
    timeRange1M: '1 Bulan',
    timeRange1Y: '1 Tahun',
    citeSecondaryData: 'Kutip Data Sekunder untuk Bab III / IV',
    downloadCsv: 'Unduh Data CSV (SPSS / Excel)',
    copiedCitation: 'Sitasi data sekunder berhasil disalin ke clipboard!',
    detectedEcoTopic: 'Topik Ekonomi Terdeteksi',
    detectedEcoDesc: 'Riset Anda mencakup variabel moneter/ekonomi. Data IHSG, Kurs Rupiah, dan Makroekonomi 24/7 siap digunakan untuk data sekunder.',
    openMarketHub: 'Buka Data Pasar 24/7',
    calculatorTitle: 'Kalkulator Konversi Kurs Rupiah',
    amount: 'Jumlah',
    convertResult: 'Hasil Konversi',

    // Scholar Search
    searchPlaceholder: 'Cari jurnal, DOI, artikel (contoh: bioplastik, stunting, inflasi rupiah)...',
    searchBtn: 'Cari Literatur',
    filterAll: 'Semua Sumber Terverifikasi',
    filterOpenAccess: 'Hanya Open Access (PDF Gratis)',
    filterYear: 'Tahun',
    sortRelevance: 'Relevansi Tertinggi',
    sortCitations: 'Sitasi Terbanyak',
    sortNewest: 'Terbaru',
    verifyBadge: 'Terverifikasi Resmi',
    noResults: 'Tidak ada artikel yang cocok. Coba kata kunci yang lebih umum.',

    // Proposal Assistant & Builder
    assistantTitle: 'Asisten AI Pembuat Proposal KTI',
    assistantSubtitle: 'Dapatkan saran terstruktur untuk Latar Belakang, Rumusan Masalah, dan Metodologi penelitian.',
    topicInputPlaceholder: 'Tulis topik riset awal Anda (misal: Pengaruh Fluktuasi IHSG terhadap Nilai Tukar Rupiah)...',
    generateAdviceBtn: 'Analisis & Beri Saran Proposal',
    downloadPdf: 'Ekspor PDF Naskah',
    readAloudProposal: 'Dengarkan Naskah Bab',

    // Floating Mentor
    askMentor: 'Tanya Pembimbing KTI',
    mentorTitle: 'Konsultasi Riset & Pembimbing KTI AI',
    send: 'Kirim',
  },
  en: {
    // Brand
    brandName: 'CendekiaKTI',
    brandTagline: 'Intelligent Academic Research & KTI Assistant',
    badgeStudent: 'Students & Scholars',

    // Navbar Tabs
    tabScholar: 'Scholar Search',
    tabAssistant: 'AI Proposal Assistant',
    tabProposal: 'Proposal Manuscript',
    tabLibrary: 'Reference Manager',
    tabBrainstorm: 'Topic Brainstorm',
    tabMentor: 'Research Mentorship',
    tabParaphrase: 'Academic Paraphraser',
    tabGrammar: 'PUEBI Spellchecker',
    tabSummarizer: 'Extractor & Mindmap',
    tabDefense: 'Jury Defense Sim',
    tabMyLab: 'My Lab & Portfolio',
    tabIntlMatch: 'Global Venues & Scopus',
    tabIntlReviewer: 'Global Peer Review AI',
    tabIntlPublish: 'Translator & LaTeX IEEE',
    tabIntlGrants: 'Global Grants & Awards',
    tabMarket: 'Market & Economy 24/7',
    tabToolkit: 'Research Toolkit (12 Tools)',
    quickProposalBtn: 'Draft Proposal',

    // Auth & Account
    loginBtn: 'Log In',
    signUpBtn: 'Sign Up',
    guestBtn: 'Guest Mode',
    verifyAccountBtn: 'Verify Account',
    verifiedBadge: 'Verified',
    unverifiedBadge: 'Unverified',
    logoutBtn: 'Log Out',
    verifyWarningRibbon: 'Your account is not verified yet. Verify now to earn an Officially Verified Researcher badge.',
    verifyNowBtn: 'Verify Now',

    // Language & Settings
    languageSettings: 'Language & Voice Settings',
    languageLabel: 'Interface Language',
    indonesian: 'Bahasa Indonesia',
    english: 'English (US)',
    ttsVoiceLabel: 'AI Voice Narrator Voice',
    ttsSpeedLabel: 'Speech Rate',
    normalSpeed: 'Normal (1.0x)',
    close: 'Close',
    save: 'Save',

    // Text to Speech
    ttsPlay: 'Listen Audio',
    ttsPlaying: 'Speaking...',
    ttsStop: 'Stop Audio',
    ttsLoading: 'Synthesizing AI Voice...',
    ttsError: 'Audio playback failed',
    ttsBrowserNotice: 'Using standard browser synthesis',

    // Economic Market Tracker
    marketTitle: 'Financial Markets & Economic Indicators 24/7',
    marketSubtitle: 'Verified secondary research data hub for economics, finance, accounting, business, and quantitative studies.',
    liveTicker: '24/7 LIVE',
    ihsgTitle: 'IDX Composite Index (IHSG)',
    forexTitle: 'Indonesian Rupiah Foreign Exchange Rates',
    commoditiesTitle: 'Strategic & Industrial Commodities',
    macroTitle: 'Macroeconomic Metrics (Bank Indonesia & BPS)',
    timeRange1D: '1 Day',
    timeRange1W: '1 Week',
    timeRange1M: '1 Month',
    timeRange1Y: '1 Year',
    citeSecondaryData: 'Cite Secondary Data for Chapter 3 & 4',
    downloadCsv: 'Download CSV Dataset (SPSS / Excel)',
    copiedCitation: 'Secondary data citation copied to clipboard!',
    detectedEcoTopic: 'Economic Topic Detected',
    detectedEcoDesc: 'Your research touches financial or macroeconomic variables. 24/7 IDX, Rupiah FX, and Macro metrics are ready for citation.',
    openMarketHub: 'Open Market Hub 24/7',
    calculatorTitle: 'Rupiah FX Currency Calculator',
    amount: 'Amount',
    convertResult: 'Conversion Result',

    // Scholar Search
    searchPlaceholder: 'Search scholarly journals, DOI, topics (e.g. bioplastics, rupiah inflation, microfinance)...',
    searchBtn: 'Search Literature',
    filterAll: 'All Verified Sources',
    filterOpenAccess: 'Open Access Only (Free PDF)',
    filterYear: 'Year',
    sortRelevance: 'Highest Relevance',
    sortCitations: 'Most Cited',
    sortNewest: 'Newest',
    verifyBadge: 'Officially Verified',
    noResults: 'No papers found. Try broader keywords.',

    // Proposal Assistant & Builder
    assistantTitle: 'AI Proposal Research Assistant',
    assistantSubtitle: 'Receive structured guidance for Background, Problem Formulations, and Research Methodology.',
    topicInputPlaceholder: 'Enter your preliminary research topic (e.g. Impact of IDX Volatility on Rupiah Exchange Rate)...',
    generateAdviceBtn: 'Analyze & Provide Proposal Guidance',
    downloadPdf: 'Export Proposal PDF',
    readAloudProposal: 'Read Chapter Aloud',

    // Floating Mentor
    askMentor: 'Ask Research Mentor',
    mentorTitle: 'Research Mentorship & KTI Advisor AI',
    send: 'Send',
  },
};

export type TranslationKey = keyof typeof translations.id;
