export type ReferenceType = 'journal' | 'book' | 'conference' | 'thesis' | 'website';

export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: number | string;
  journalName: string;
  citationCount: number;
  doi?: string;
  pdfUrl?: string | null;
  isOpenAccess?: boolean;
  abstract: string;
  source?: string;
  apaCitation?: string;
  // Detailed metadata for references
  itemType?: ReferenceType;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  url?: string;
  isVerified?: boolean;
  verificationSource?: string;
  officialUrl?: string;
  issn?: string;
  repositoryType?: 'openalex' | 'crossref' | 'semantic_scholar' | 'pubmed_pmc' | 'arxiv' | 'garuda_sinta' | 'doaj' | string;
}

export interface VerificationResult {
  isValid: boolean;
  doi?: string;
  title?: string;
  authors?: string[];
  journalName?: string;
  publicationYear?: number | string;
  publisher?: string;
  issn?: string[];
  citationCount?: number;
  doiUrl?: string;
  verificationSource?: string;
  message?: string;
}

export interface AdvancedSearchFilters {
  query: string;
  exactPhrase?: string;
  author?: string;
  journal?: string;
  yearFrom?: string;
  yearTo?: string;
  filterOpenAccess?: boolean;
  sortBy?: 'relevance_score:desc' | 'cited_by_count:desc' | 'publication_date:desc';
  repositorySource?: 'all' | 'openalex' | 'crossref' | 'semantic_scholar' | 'pubmed_pmc' | 'arxiv' | 'garuda_sinta' | 'doaj';
}

export interface ScholarSearchResponse {
  papers: Paper[];
  total: number;
  query?: string;
  sourcesBreakdown?: Record<string, number>;
  repositoriesQueried?: string[];
}

export interface ProposalBab1 {
  latarBelakang: string;
  rumusanMasalah: string[];
  tujuanPenelitian: string[];
  manfaatPenelitian: {
    teoretis: string;
    praktis: string[];
  };
  batasanMasalah: string;
}

export interface ProposalBab2 {
  kajianTeori: string;
  penelitianTerdahulu: string;
  kerangkaBerpikir: string;
  hipotesis?: string;
}

export interface ProposalBab3 {
  jenisPenelitian: string;
  waktuDanTempat: string;
  populasiDanSampel: string;
  variabelPenelitian: string;
  teknikPengumpulanData: string;
  instrumenPenelitian: string;
  teknikAnalisisData: string;
}

export interface ProposalData {
  judul: string;
  abstrakSingkat?: string;
  bidang: string;
  jenjang: string;
  pendekatan: string;
  bab1: ProposalBab1;
  bab2: ProposalBab2;
  bab3: ProposalBab3;
  daftarPustaka: string[];
  saranPembimbing?: string;
  updatedAt?: string;
  track?: 'national' | 'international';
}

export interface ProposalAssistantAdvice {
  analisisTopik: {
    urgensi: string;
    researchGap: string;
    variabelUsulan: {
      bebas: string;
      terikat: string;
      kontrol?: string;
    };
  };
  latarBelakang: {
    alurPiramida: string;
    drafPembuka: string;
    faktaDanDataYangPerluDicari: string[];
  };
  rumusanMasalah: string[];
  tujuanPenelitian: string[];
  metodologi: {
    pendekatan: string;
    populasiDanSampel: string;
    teknikPengumpulanData: string;
    instrumen: string;
    analisisStatistik: string;
  };
  tipsJuri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BrainstormTopic {
  title: string;
  field: string;
  urgency: string;
  novelty: string;
  methodSuggestion: string;
  targetTools: string;
  potentialCompetitions?: string[];
}

export interface ParaphraseResult {
  original: string;
  paraphrased: string;
  changesSummary: string;
  readabilityScore: string;
}

export interface PaperSynthesis {
  masalahDanTujuan: string;
  metode: string;
  temuanUtama: string;
  sintesisBab2: string;
  kutipanInText: string;
}

export type Language = 'id' | 'en';

export interface MarketTimeSeriesPoint {
  date: string;
  value: number;
}

export interface EconomicIndicator {
  id: string;
  name: string;
  symbol: string;
  current: number;
  change: number;
  changePercent: number;
  unit: string;
  high24h?: number;
  low24h?: number;
  category: 'stock' | 'forex' | 'commodity' | 'macro';
  updateFrequency: string;
  notes?: string;
  history: MarketTimeSeriesPoint[];
  sourceCitation: string;
}

export interface EconomicMarketData {
  lastUpdated: string;
  status: string;
  isLive247: boolean;
  ihsg: EconomicIndicator;
  currencies: EconomicIndicator[];
  commodities: EconomicIndicator[];
  macro: EconomicIndicator[];
  marketSummary: string;
}
export interface AppSettings {
  language: Language;
  ttsVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  ttsSpeed: number; // 0.8, 1.0, 1.2, 1.5
  autoDetectEconomics: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  school?: string;
  role: 'student' | 'researcher' | 'teacher';
  isVerified: boolean;
  verificationCode?: string;
  avatar?: string;
  createdAt: string;
  isGuest: boolean;
  academicLevel?: 'SMP' | 'SMA/SMK' | 'Mahasiswa (S1)' | 'Pascasarjana';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isVerified: boolean;
}

// Feature: Plagiarism Checker
export interface PlagiarismResult {
  similarityScore: number;
  originalityScore: number;
  analyzedWordsCount: number;
  riskLevel: 'low' | 'moderate' | 'high';
  flaggedPhrases: Array<{
    text: string;
    similarity: number;
    matchedSource?: string;
    advice: string;
  }>;
  summary: string;
}

// Feature: Research Timeline / Gantt
export interface TimelineTask {
  id: string;
  title: string;
  chapter: 'Bab 1' | 'Bab 2' | 'Bab 3' | 'Bab 4/5' | 'Sidang/Lomba';
  startDate: string;
  endDate: string;
  progress: number; // 0 - 100
  isCompleted: boolean;
  assignedTo?: string;
}

// Feature: Research Budget / RAB
export interface BudgetItem {
  id: string;
  category: 'Bahan Habis Pakai' | 'Peralatan & Sewa Lab' | 'Transportasi & Lapangan' | 'Publikasi & Seminar' | 'Lain-lain';
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  notes?: string;
}

// Feature: Statistical Selector
export interface StatisticalGuideItem {
  id: string;
  name: string;
  nameEn: string;
  goal: string;
  goalEn: string;
  variableType: string;
  assumptions: string[];
  assumptionsEn: string[];
  exampleCase: string;
  exampleCaseEn: string;
  recommendedSoftware: string;
}

// Feature: Survey & Likert Questionnaire
export interface LikertQuestion {
  id: string;
  variable: string;
  indicator: string;
  statement: string;
  type: 'favorable' | 'unfavorable';
}

// Feature: Academic Phrasebank
export interface PhrasebankCategory {
  id: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  phrases: Array<{
    id: string;
    idText: string;
    enText: string;
    purpose: string;
  }>;
}

// Feature: Proposal Rubric
export interface RubricCriterion {
  id: string;
  titleId: string;
  titleEn: string;
  weight: number;
  maxScore: number;
  descriptionId: string;
  descriptionEn: string;
}

// Feature: Scientific Glossary Term
export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Metodologi' | 'Biologi & Hayati' | 'Ekonomi & Finansial' | 'Fisika & Kimia' | 'Sosial & Humaniora';
  definitionId: string;
  definitionEn: string;
  exampleId: string;
  exampleEn: string;
}

// Feature: Data Chart Studio
export interface DataChartPoint {
  label: string;
  treatment: string;
  replicate1: number;
  replicate2: number;
  replicate3: number;
  mean: number;
}

