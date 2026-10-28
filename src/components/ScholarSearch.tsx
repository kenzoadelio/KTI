import React, { useState } from 'react';
import { Paper, AdvancedSearchFilters, ScholarSearchResponse } from '../types';
import { searchScholarPapers } from '../services/api';
import { CitationModal } from './CitationModal';
import { PaperSynthesisModal } from './PaperSynthesisModal';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  BookOpen,
  Quote,
  Bookmark,
  ExternalLink,
  Sparkles,
  FileText,
  SlidersHorizontal,
  Loader2,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  X,
  Filter,
  Check,
  Calendar,
  User,
  Building,
  RotateCcw,
  Globe,
  Database,
  Layers,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ScholarSearchProps {
  savedPapers: Paper[];
  onToggleSavePaper: (paper: Paper) => void;
  onUseAsProposalTopic: (topic: string, paper?: Paper) => void;
  onInsertSynthesisToBab2: (text: string) => void;
}

type RepositoryFilterKey =
  | 'all'
  | 'openalex'
  | 'crossref'
  | 'pubmed_pmc'
  | 'arxiv'
  | 'garuda_sinta'
  | 'doaj'
  | 'semantic_scholar';

interface RepositoryOption {
  key: RepositoryFilterKey;
  labelId: string;
  labelEn: string;
  badgeLabel: string;
  badgeColor: string;
  iconName: string;
}

const REPOSITORY_OPTIONS: RepositoryOption[] = [
  {
    key: 'all',
    labelId: 'Semua Basis Data (All Scholars)',
    labelEn: 'All Scholar Databases',
    badgeLabel: 'Semua Scholar',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconName: '🌐',
  },
  {
    key: 'garuda_sinta',
    labelId: 'SINTA & Garuda Kemdikbud RI',
    labelEn: 'SINTA & Garuda Indonesia',
    badgeLabel: 'SINTA / Garuda 🇮🇩',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconName: '🇮🇩',
  },
  {
    key: 'openalex',
    labelId: 'Google Scholar & OpenAlex',
    labelEn: 'Google Scholar & OpenAlex',
    badgeLabel: 'Google Scholar / OpenAlex',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconName: '🎓',
  },
  {
    key: 'crossref',
    labelId: 'Crossref Official DOI Registry',
    labelEn: 'Crossref Official DOI',
    badgeLabel: 'Crossref DOI Resmi',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconName: '🏛️',
  },
  {
    key: 'pubmed_pmc',
    labelId: 'PubMed & Europe PMC (Biomedis)',
    labelEn: 'PubMed & Europe PMC',
    badgeLabel: 'PubMed / Europe PMC',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconName: '🔬',
  },
  {
    key: 'arxiv',
    labelId: 'arXiv Cornell (Open Science)',
    labelEn: 'arXiv Cornell Preprints',
    badgeLabel: 'arXiv Open Science',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconName: '⚛️',
  },
  {
    key: 'doaj',
    labelId: 'DOAJ (Open Access Directory)',
    labelEn: 'DOAJ Directory',
    badgeLabel: 'DOAJ Open Access',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    iconName: '📖',
  },
  {
    key: 'semantic_scholar',
    labelId: 'Semantic Scholar AI Graph',
    labelEn: 'Semantic Scholar AI',
    badgeLabel: 'Semantic Scholar AI',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconName: '🧠',
  },
];

export const ScholarSearch: React.FC<ScholarSearchProps> = ({
  savedPapers,
  onToggleSavePaper,
  onUseAsProposalTopic,
  onInsertSynthesisToBab2,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Main Search State
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Repository stats from last search
  const [sourcesBreakdown, setSourcesBreakdown] = useState<Record<string, number>>({});
  const [activeRepoFilter, setActiveRepoFilter] = useState<RepositoryFilterKey>('all');

  // Advanced Search Filter States
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [exactPhrase, setExactPhrase] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [journalFilter, setJournalFilter] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [filterOpenAccess, setFilterOpenAccess] = useState(false);
  const [sortBy, setSortBy] = useState<
    'relevance_score:desc' | 'cited_by_count:desc' | 'publication_date:desc'
  >('relevance_score:desc');

  // Quick Year Filter Preset
  const [activeYearPreset, setActiveYearPreset] = useState<
    'any' | '2025' | '2024' | '2021' | 'custom'
  >('any');

  // Modals & previews
  const [selectedCitationPaper, setSelectedCitationPaper] = useState<Paper | null>(null);
  const [selectedSynthesisPaper, setSelectedSynthesisPaper] = useState<Paper | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const [showExternalPortals, setShowExternalPortals] = useState(true);

  const sampleQueries = [
    {
      label: isEn ? '🌿 Cassava Starch Bioplastic' : '🌿 Bioplastik Pati Singkong',
      query: isEn
        ? 'biodegradable bioplastic cassava starch glycerol'
        : 'pemanfaatan pati singkong sebagai bioplastik ramah lingkungan',
    },
    {
      label: isEn ? '📱 Social Media & Student Focus' : '📱 Media Sosial & Belajar Siswa',
      query: isEn
        ? 'impact of social media on high school students learning concentration'
        : 'pengaruh media sosial terhadap konsentrasi belajar siswa sma',
    },
    {
      label: isEn ? '🧪 Moringa Leaf Antibacterial' : '🧪 Ekstrak Daun Kelor Antibakteri',
      query: isEn
        ? 'antibacterial efficacy of moringa oleifera leaf extract staphylococcus'
        : 'efektivitas ekstrak daun kelor moringa oleifera sebagai antibakteri',
    },
    {
      label: isEn ? '⚡ BSF Larvae Organic Waste' : '⚡ Larva BSF Sampah Organik',
      query: isEn
        ? 'black soldier fly larvae bioconversion organic municipal waste'
        : 'pengolahan sampah organik menggunakan larva black soldier fly',
    },
    {
      label: isEn ? '🎮 Educational Gamification' : '🎮 Gamifikasi Pembelajaran',
      query: isEn
        ? 'gamification in mathematics education high school students'
        : 'penerapan media gamifikasi dalam pemahaman konsep matematika siswa',
    },
    {
      label: isEn ? '💧 Activated Carbon Water Filter' : '💧 Filtrasi Air Limbah Sederhana',
      query: isEn
        ? 'activated carbon silica sand water purification wastewater'
        : 'efektivitas arang aktif dan pasir silika dalam penjernihan air',
    },
  ];

  const handleSearch = async (
    e?: React.FormEvent,
    customQuery?: string,
    overrideFilters?: Partial<AdvancedSearchFilters>,
    overrideRepo?: RepositoryFilterKey
  ) => {
    if (e) e.preventDefault();

    const currentSearchTerm = customQuery !== undefined ? customQuery : query;
    if (!currentSearchTerm.trim() && !exactPhrase && !authorFilter && !journalFilter) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    const repoToUse = overrideRepo !== undefined ? overrideRepo : activeRepoFilter;

    try {
      const filters: AdvancedSearchFilters = {
        query: currentSearchTerm,
        exactPhrase: overrideFilters?.exactPhrase ?? exactPhrase,
        author: overrideFilters?.author ?? authorFilter,
        journal: overrideFilters?.journal ?? journalFilter,
        yearFrom: overrideFilters?.yearFrom ?? yearFrom,
        yearTo: overrideFilters?.yearTo ?? yearTo,
        filterOpenAccess: overrideFilters?.filterOpenAccess ?? filterOpenAccess,
        sortBy: overrideFilters?.sortBy ?? sortBy,
        repositorySource: repoToUse,
      };

      const res: ScholarSearchResponse = await searchScholarPapers(filters);
      setPapers(res.papers || []);
      if (res.sourcesBreakdown) {
        setSourcesBreakdown(res.sourcesBreakdown);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (isEn
            ? 'Failed to fetch scientific papers from scholarly repositories.'
            : 'Gagal mencari literatur ilmiah dari basis data scholar.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyYearPreset = (preset: 'any' | '2025' | '2024' | '2021' | 'custom') => {
    setActiveYearPreset(preset);
    let from = '';
    let to = '';

    if (preset === '2025') {
      from = '2025';
    } else if (preset === '2024') {
      from = '2024';
    } else if (preset === '2021') {
      from = '2021';
    }

    setYearFrom(from);
    setYearTo(to);

    if (hasSearched) {
      handleSearch(undefined, undefined, { yearFrom: from, yearTo: to });
    }
  };

  const handleSelectRepoFilter = (repoKey: RepositoryFilterKey) => {
    setActiveRepoFilter(repoKey);
    if (hasSearched) {
      handleSearch(undefined, undefined, undefined, repoKey);
    }
  };

  const handleResetFilters = () => {
    setExactPhrase('');
    setAuthorFilter('');
    setJournalFilter('');
    setYearFrom('');
    setYearTo('');
    setFilterOpenAccess(false);
    setActiveYearPreset('any');
    setSortBy('relevance_score:desc');
    setActiveRepoFilter('all');
    if (hasSearched) {
      handleSearch(
        undefined,
        query,
        {
          exactPhrase: '',
          author: '',
          journal: '',
          yearFrom: '',
          yearTo: '',
          filterOpenAccess: false,
          sortBy: 'relevance_score:desc',
          repositorySource: 'all',
        },
        'all'
      );
    }
  };

  const hasActiveFilters = Boolean(
    exactPhrase ||
      authorFilter ||
      journalFilter ||
      yearFrom ||
      yearTo ||
      filterOpenAccess ||
      activeRepoFilter !== 'all'
  );

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isSaved = (paperId: string) => savedPapers.some((p) => p.id === paperId);

  // Helper to get distinctive repository badge
  const getRepositoryBadge = (paper: Paper) => {
    const repoType = paper.repositoryType;
    const sourceStr = (paper.source || '').toLowerCase();

    if (repoType === 'garuda_sinta' || sourceStr.includes('garuda') || sourceStr.includes('sinta')) {
      return {
        label: isEn ? 'SINTA & Garuda Indonesia 🇮🇩' : 'SINTA & Garuda Kemdikbud 🇮🇩',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: '🇮🇩',
      };
    }
    if (repoType === 'crossref' || sourceStr.includes('crossref')) {
      return {
        label: isEn ? 'Crossref Official DOI' : 'Crossref Official DOI Registry',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: '🏛️',
      };
    }
    if (repoType === 'pubmed_pmc' || sourceStr.includes('pubmed') || sourceStr.includes('europe pmc')) {
      return {
        label: 'PubMed & Europe PMC',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: '🔬',
      };
    }
    if (repoType === 'arxiv' || sourceStr.includes('arxiv')) {
      return {
        label: 'arXiv Cornell Open Science',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: '⚛️',
      };
    }
    if (repoType === 'doaj' || sourceStr.includes('doaj')) {
      return {
        label: 'DOAJ Peer-Reviewed OA',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: '📖',
      };
    }
    if (repoType === 'semantic_scholar' || sourceStr.includes('semantic')) {
      return {
        label: 'Semantic Scholar AI Graph',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: '🧠',
      };
    }

    return {
      label: 'Google Scholar & OpenAlex Global',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: '🎓',
    };
  };

  const extractDomain = (paper: Paper) => {
    if (paper.pdfUrl) {
      try {
        return new URL(paper.pdfUrl).hostname.replace(/^www\./, '');
      } catch {
        return 'jurnal.ac.id';
      }
    }
    if (paper.doi) return 'doi.org';
    return 'scholar.id';
  };

  // External direct search links for the current query
  const effectiveQuery = query.trim() || 'bioplastik pati singkong';
  const externalPortals = [
    {
      name: 'Google Scholar',
      color: 'hover:text-blue-600 hover:border-blue-300',
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'Garuda Kemdikbud 🇮🇩',
      color: 'hover:text-rose-600 hover:border-rose-300',
      url: `https://garuda.kemdikbud.go.id/documents?q=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'SINTA Kemdikbud 🇮🇩',
      color: 'hover:text-red-600 hover:border-red-300',
      url: `https://sinta.kemdikbud.go.id/affiliations/detail?q=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'Semantic Scholar AI',
      color: 'hover:text-indigo-600 hover:border-indigo-300',
      url: `https://www.semanticscholar.org/search?q=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'Crossref Official DOI',
      color: 'hover:text-purple-600 hover:border-purple-300',
      url: `https://search.crossref.org/?q=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'PubMed / Europe PMC',
      color: 'hover:text-emerald-600 hover:border-emerald-300',
      url: `https://europepmc.org/search?query=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'arXiv Open Science',
      color: 'hover:text-amber-600 hover:border-amber-300',
      url: `https://arxiv.org/search/?query=${encodeURIComponent(effectiveQuery)}&searchtype=all`,
    },
    {
      name: 'Indonesia OneSearch (Perpusnas)',
      color: 'hover:text-cyan-600 hover:border-cyan-300',
      url: `https://onesearch.id/Search/Results?lookfor=${encodeURIComponent(effectiveQuery)}`,
    },
    {
      name: 'Neliti Riset Indonesia',
      color: 'hover:text-teal-600 hover:border-teal-300',
      url: `https://www.neliti.com/search?q=${encodeURIComponent(effectiveQuery)}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-extrabold text-2xl tracking-tight text-slate-800">
              Universal <span className="text-blue-600 font-serif">Scholar</span> Cendekia
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 uppercase tracking-wider">
              {isEn ? 'All Scholarly Repositories' : 'Seluruh Basis Data Scholar Terpadu'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {isEn ? '6 Global & National Repositories' : '6 Indeks Global & Nasional'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
            {isEn
              ? 'Unified federated academic search combining Google Scholar, OpenAlex, Crossref Official DOI, PubMed / Europe PMC, arXiv Cornell, SINTA & Garuda Kemdikbudristek, and DOAJ. One search bar covers 250M+ peer-reviewed papers.'
              : 'Pencarian literatur ilmiah terpadu yang menggabungkan Google Scholar, OpenAlex (250 juta naskah), Crossref DOI Resmi, PubMed & Europe PMC, arXiv Cornell, SINTA & Garuda Kemdikbudristek, serta DOAJ ke dalam satu mesin telusur KTI.'}
          </p>

          {/* Search Bar Form */}
          <form onSubmit={(e) => handleSearch(e)} className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search research topics, keywords, authors, journals, or DOI (e.g. cassava bioplastic, moringa leaf)...'
                    : 'Cari topik KTI, kata kunci, nama jurnal, penulis, atau DOI (contoh: bioplastik pati singkong, ekstrak kelor)...'
                }
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!query.trim() && !exactPhrase && !authorFilter && !journalFilter)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-2xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Aggregating...' : 'Menggabungkan...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{isEn ? 'Search All' : 'Telusuri Seluruh Scholar'}</span>
                </>
              )}
            </button>

            {/* Advanced Search Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedModal(true)}
              className={`px-4 py-3.5 rounded-2xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                hasActiveFilters
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isEn ? 'Advanced search filters' : 'Buka filter pencarian lanjutan'}
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">
                {isEn ? 'Advanced Filters' : 'Pencarian Lanjutan'}
              </span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
            </button>
          </form>

          {/* Multi-Scholar Repository Switcher Tabs */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                {isEn ? 'Filter by Scholar Repository:' : 'Pilih Basis Data Scholar:'}
              </span>
              <button
                type="button"
                onClick={() => setShowExternalPortals(!showExternalPortals)}
                className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? 'Direct Portal Quick-Launch' : 'Akses Portal Resmi'}</span>
                {showExternalPortals ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {REPOSITORY_OPTIONS.map((repo) => {
                const isSelected = activeRepoFilter === repo.key;
                const count =
                  repo.key === 'all'
                    ? papers.length
                    : sourcesBreakdown[repo.key] ??
                      papers.filter((p) => p.repositoryType === repo.key).length;

                return (
                  <button
                    key={repo.key}
                    type="button"
                    onClick={() => handleSelectRepoFilter(repo.key)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-200'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{repo.iconName}</span>
                    <span>{isEn ? repo.labelEn : repo.labelId}</span>
                    {hasSearched && count !== undefined && count > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick External Scholar Launchers */}
          {showExternalPortals && (
            <div className="mt-3.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-bold mb-2">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {isEn
                    ? 'Direct 1-Click Search on Official Scholarly Portals:'
                    : 'Buka Pencarian Langsung di Portal Resmi Luar:'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {externalPortals.map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium transition-colors cursor-pointer text-[11px] shadow-2xs ${portal.color}`}
                    title={
                      isEn
                        ? `Open "${effectiveQuery}" in ${portal.name}`
                        : `Buka pencarian "${effectiveQuery}" di ${portal.name}`
                    }
                  >
                    <span>{portal.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick sample topics chips */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">
              {isEn ? 'Example Topics:' : 'Contoh Topik:'}
            </span>
            {sampleQueries.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(undefined, item.query);
                }}
                className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200/80 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">
                {isEn ? 'Active Filters:' : 'Filter Aktif:'}
              </span>
              {activeRepoFilter !== 'all' && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 flex items-center gap-1">
                  Basis Data: {REPOSITORY_OPTIONS.find((r) => r.key === activeRepoFilter)?.badgeLabel}
                  <button
                    onClick={() => handleSelectRepoFilter('all')}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {exactPhrase && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 flex items-center gap-1">
                  Frasa: "{exactPhrase}"
                  <button
                    onClick={() => {
                      setExactPhrase('');
                      handleSearch(undefined, query, { exactPhrase: '' });
                    }}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {authorFilter && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 flex items-center gap-1">
                  Penulis: {authorFilter}
                  <button
                    onClick={() => {
                      setAuthorFilter('');
                      handleSearch(undefined, query, { author: '' });
                    }}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {journalFilter && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 flex items-center gap-1">
                  Jurnal: {journalFilter}
                  <button
                    onClick={() => {
                      setJournalFilter('');
                      handleSearch(undefined, query, { journal: '' });
                    }}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {(yearFrom || yearTo) && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 flex items-center gap-1">
                  Tahun: {yearFrom || '...'} - {yearTo || '...'}
                  <button
                    onClick={() => {
                      setYearFrom('');
                      setYearTo('');
                      setActiveYearPreset('any');
                      handleSearch(undefined, query, { yearFrom: '', yearTo: '' });
                    }}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              {filterOpenAccess && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 flex items-center gap-1">
                  Hanya Open Access (PDF)
                  <button
                    onClick={() => {
                      setFilterOpenAccess(false);
                      handleSearch(undefined, query, { filterOpenAccess: false });
                    }}
                    className="hover:text-red-500 cursor-pointer font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-800 font-semibold ml-2 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                {isEn ? 'Reset All Filters' : 'Reset Semua Filter'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Search Modal Dialog */}
      {showAdvancedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isEn ? 'Advanced Scholar Search' : 'Pencarian Lanjutan Seluruh Scholar'}
                </h3>
              </div>
              <button
                onClick={() => setShowAdvancedModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isEn ? 'With all words (Primary Query)' : 'Dengan semua kata (Kata Kunci Utama)'}
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: bioplastik pati singkong"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isEn ? 'With the exact phrase' : 'Dengan frasa persis (Exact Phrase)'}
                </label>
                <input
                  type="text"
                  value={exactPhrase}
                  onChange={(e) => setExactPhrase(e.target.value)}
                  placeholder='Contoh: "staphylococcus aureus"'
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isEn ? 'Author name' : 'Nama Penulis'}
                  </label>
                  <input
                    type="text"
                    value={authorFilter}
                    onChange={(e) => setAuthorFilter(e.target.value)}
                    placeholder="Contoh: Bambang Admadi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isEn ? 'Journal name' : 'Nama Jurnal'}
                  </label>
                  <input
                    type="text"
                    value={journalFilter}
                    onChange={(e) => setJournalFilter(e.target.value)}
                    placeholder="Contoh: Jurnal Rekayasa Kimia"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {isEn ? 'Target Scholar Repository' : 'Basis Data Target'}
                </label>
                <select
                  value={activeRepoFilter}
                  onChange={(e) => setActiveRepoFilter(e.target.value as RepositoryFilterKey)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {REPOSITORY_OPTIONS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.iconName} {isEn ? r.labelEn : r.labelId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isEn ? 'From year' : 'Tahun Mulai'}
                  </label>
                  <input
                    type="number"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value)}
                    placeholder="2020"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {isEn ? 'To year' : 'Tahun Akhir'}
                  </label>
                  <input
                    type="number"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value)}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={filterOpenAccess}
                    onChange={(e) => setFilterOpenAccess(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>
                    {isEn
                      ? 'Only articles with full-text open access (PDF available)'
                      : 'Hanya tampilkan artikel dengan teks lengkap (Open Access PDF)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
              >
                {isEn ? 'Reset Filters' : 'Reset Filter'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Batal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvancedModal(false);
                    handleSearch();
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  {isEn ? 'Apply Search' : 'Terapkan Pencarian'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar (Filters) */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            {/* Repository Source Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{isEn ? 'Scholar Repository' : 'Basis Data Scholar'}</span>
              </h4>
              <div className="space-y-1 text-xs">
                {REPOSITORY_OPTIONS.map((item) => {
                  const count =
                    item.key === 'all'
                      ? papers.length
                      : sourcesBreakdown[item.key] ??
                        papers.filter((p) => p.repositoryType === item.key).length;

                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSelectRepoFilter(item.key)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                        activeRepoFilter === item.key
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{item.iconName}</span>
                        <span className="truncate">{isEn ? item.labelEn : item.labelId}</span>
                      </span>
                      {hasSearched && count > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold ml-1 shrink-0">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year Presets */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isEn ? 'Publication Time' : 'Rentang Waktu'}
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'any', label: isEn ? 'Any time' : 'Kapan saja' },
                  { id: '2025', label: isEn ? 'Since 2025' : 'Sejak 2025' },
                  { id: '2024', label: isEn ? 'Since 2024' : 'Sejak 2024' },
                  { id: '2021', label: isEn ? 'Since 2021 (Last 5 Yrs)' : 'Sejak 2021 (5 Thn Terakhir)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleApplyYearPreset(item.id as any)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      activeYearPreset === item.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeYearPreset === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}

                {/* Custom Range */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {isEn ? 'Custom year range:' : 'Rentang khusus:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="2020"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="2025"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                    />
                    <button
                      onClick={() => {
                        setActiveYearPreset('custom');
                        handleSearch();
                      }}
                      className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isEn ? 'Sort Results' : 'Urutkan Menurut'}
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: 'relevance_score:desc', label: isEn ? 'Relevance' : 'Relevansi Multi-Scholar' },
                  { id: 'cited_by_count:desc', label: isEn ? 'Most Cited' : 'Sitasi Terbanyak' },
                  { id: 'publication_date:desc', label: isEn ? 'Latest Year' : 'Tahun Terbaru' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSortBy(item.id as any);
                      if (hasSearched) handleSearch(undefined, undefined, { sortBy: item.id as any });
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      sortBy === item.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <span>{item.label}</span>
                    {sortBy === item.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Types */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isEn ? 'Access Type' : 'Jenis Akses'}
              </h4>
              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterOpenAccess}
                  onChange={(e) => {
                    setFilterOpenAccess(e.target.checked);
                    if (hasSearched) handleSearch(undefined, undefined, { filterOpenAccess: e.target.checked });
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>{isEn ? 'Full Text Only (PDF)' : 'Hanya Teks Lengkap (PDF)'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content: Search Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => handleSearch()}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg cursor-pointer"
              >
                {isEn ? 'Retry' : 'Coba Lagi'}
              </button>
            </div>
          )}

          {/* Result Count and Multi-Scholar Breakdown Stats */}
          {hasSearched && !loading && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
                <span>
                  {isEn ? (
                    <>
                      Found <strong>{papers.length}</strong> papers across scholarly repositories
                      {query ? ` for "${query}"` : ''}
                    </>
                  ) : (
                    <>
                      Ditemukan <strong>{papers.length}</strong> naskah ilmiah dari seluruh basis data scholar
                      {query ? ` untuk "${query}"` : ''}
                    </>
                  )}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {isEn ? 'Deduplicated & Merged' : 'Otomatis Dideduplikasi & Divalidasi'}
                </span>
              </div>

              {/* Source breakdown pills */}
              {Object.keys(sourcesBreakdown).length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-bold text-slate-400">
                    {isEn ? 'Sources:' : 'Kontribusi:'}
                  </span>
                  {sourcesBreakdown.openalex !== undefined && sourcesBreakdown.openalex > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                      🎓 OpenAlex ({sourcesBreakdown.openalex})
                    </span>
                  )}
                  {sourcesBreakdown.crossref !== undefined && sourcesBreakdown.crossref > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                      🏛️ Crossref ({sourcesBreakdown.crossref})
                    </span>
                  )}
                  {sourcesBreakdown.garuda_sinta !== undefined && sourcesBreakdown.garuda_sinta > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                      🇮🇩 SINTA/Garuda ({sourcesBreakdown.garuda_sinta})
                    </span>
                  )}
                  {sourcesBreakdown.pubmed_pmc !== undefined && sourcesBreakdown.pubmed_pmc > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      🔬 PubMed/PMC ({sourcesBreakdown.pubmed_pmc})
                    </span>
                  )}
                  {sourcesBreakdown.arxiv !== undefined && sourcesBreakdown.arxiv > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      ⚛️ arXiv ({sourcesBreakdown.arxiv})
                    </span>
                  )}
                  {sourcesBreakdown.doaj !== undefined && sourcesBreakdown.doaj > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-medium">
                      📖 DOAJ ({sourcesBreakdown.doaj})
                    </span>
                  )}
                  {sourcesBreakdown.semantic_scholar !== undefined && sourcesBreakdown.semantic_scholar > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                      🧠 Semantic Scholar ({sourcesBreakdown.semantic_scholar})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-2.5">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                  <div className="h-12 bg-slate-50 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Results List */}
          {!loading && papers.length > 0 && (
            <div className="space-y-4">
              {papers.map((paper) => {
                const isExpanded = expandedAbstracts[paper.id] || false;
                const saved = isSaved(paper.id);
                const domain = extractDomain(paper);
                const repoBadge = getRepositoryBadge(paper);

                return (
                  <div
                    key={paper.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        {/* Repository Badge Line */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${repoBadge.badgeClass}`}
                          >
                            <span>{repoBadge.icon}</span>
                            <span>{repoBadge.label}</span>
                          </span>

                          {paper.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{paper.verificationSource || 'Verified Index'}</span>
                            </span>
                          )}

                          {paper.doi && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              DOI: {paper.doi}
                            </span>
                          )}
                        </div>

                        {/* Title (Classic Scholar Blue #1a0dab) */}
                        <h3 className="text-base sm:text-lg font-medium leading-snug">
                          {paper.doi ? (
                            <a
                              href={`https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1a0dab] hover:underline cursor-pointer"
                            >
                              {paper.title}
                            </a>
                          ) : paper.pdfUrl ? (
                            <a
                              href={paper.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1a0dab] hover:underline cursor-pointer"
                            >
                              {paper.title}
                            </a>
                          ) : (
                            <span className="text-[#1a0dab]">{paper.title}</span>
                          )}
                        </h3>

                        {/* Metadata Line (Classic Scholar Green #006621) */}
                        <div className="text-xs sm:text-[13px] text-[#006621] font-normal truncate">
                          <span>
                            {paper.authors.slice(0, 3).join(', ')}
                            {paper.authors.length > 3 ? ' et al.' : ''}
                          </span>
                          <span className="mx-1">-</span>
                          <span>{paper.journalName}</span>
                          <span className="mx-1">,</span>
                          <span>{paper.publicationYear}</span>
                          <span className="mx-1">-</span>
                          <span className="text-slate-500">{domain}</span>
                        </div>

                        {/* Snippet / Abstract Text */}
                        <div className="text-xs sm:text-[13px] text-[#545454] leading-relaxed pt-1">
                          <p className={isExpanded ? '' : 'line-clamp-2'}>{paper.abstract}</p>
                          {paper.abstract && paper.abstract.length > 180 && (
                            <button
                              onClick={() => toggleAbstract(paper.id)}
                              className="text-xs font-semibold text-blue-600 hover:underline mt-1 flex items-center gap-0.5 cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  {isEn ? 'Close abstract' : 'Tutup abstrak'} <ChevronUp className="w-3.5 h-3.5" />
                                </>
                              ) : (
                                <>
                                  {isEn ? 'Read full abstract' : 'Selengkapnya'}{' '}
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right [PDF] Tag */}
                      {paper.pdfUrl && (
                        <div className="shrink-0 self-start sm:self-auto sm:ml-4">
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                            title={isEn ? 'Open full-text document' : 'Buka teks lengkap dokumen'}
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            <span>[PDF] {domain}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Scholar Action Links Footer */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Simpan */}
                        <button
                          onClick={() => onToggleSavePaper(paper)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                            saved
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-300'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${saved ? 'fill-emerald-600 text-emerald-600' : ''}`}
                          />
                          <span>
                            {saved
                              ? isEn
                                ? 'Saved'
                                : 'Tersimpan'
                              : isEn
                              ? 'Save'
                              : 'Simpan'}
                          </span>
                        </button>

                        {/* Kutip */}
                        <button
                          onClick={() => setSelectedCitationPaper(paper)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium cursor-pointer"
                        >
                          <Quote className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isEn ? 'Cite' : 'Kutip'}</span>
                        </button>

                        {/* Citation Count */}
                        {paper.citationCount > 0 && (
                          <span className="text-slate-500 px-2 py-1 font-medium">
                            {isEn
                              ? `Cited by ${paper.citationCount}`
                              : `Dirujuk ${paper.citationCount} kali`}
                          </span>
                        )}

                        {/* Sintesis AI Bab 2 */}
                        <button
                          onClick={() => setSelectedSynthesisPaper(paper)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-medium cursor-pointer"
                          title={
                            isEn
                              ? 'Synthesize key findings into Chapter II Literature Review'
                              : 'Ekstrak temuan jurnal ini untuk disintesis di Bab II'
                          }
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{isEn ? 'Synthesize Chapter II' : 'Sintesis Bab II'}</span>
                        </button>

                        {/* Text to Speech Narration */}
                        {paper.abstract && (
                          <AudioSpeechPlayer
                            text={`${paper.title}. Oleh ${paper.authors.slice(0, 2).join(' dan ')}. Abstrak: ${paper.abstract}`}
                            variant="badge"
                            label={isEn ? 'Listen' : 'Dengarkan'}
                          />
                        )}
                      </div>

                      {/* Use for proposal button */}
                      <button
                        onClick={() => onUseAsProposalTopic(paper.title, paper)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer ml-auto"
                      >
                        <span>{isEn ? 'Use for Proposal' : 'Gunakan untuk Proposal'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty search results message */}
          {hasSearched && !loading && papers.length === 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-base">
                {isEn
                  ? 'No articles found in selected repository'
                  : 'Tidak ada naskah ditemukan pada basis data ini'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isEn
                  ? 'Try switching to "All Scholar Databases" or use broader keywords like "cassava starch" or "bioplastic".'
                  : 'Coba ubah filter ke "Semua Basis Data (All Scholars)" atau gunakan kata kunci yang lebih umum seperti "pati singkong" atau "bioplastik".'}
              </p>
              <button
                onClick={() => handleSelectRepoFilter('all')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                {isEn ? 'Search All Repositories' : 'Cari di Seluruh Basis Data'}
              </button>
            </div>
          )}

          {/* Initial state before searching */}
          {!hasSearched && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {isEn
                      ? 'Integrated Multi-Scholar Repository Coverage:'
                      : 'Cakupan Repositori Ilmiah yang Terintegrasi:'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? 'Federated search querying global and Indonesian scholarly databases concurrently'
                      : 'Pencarian paralel ke basis data ilmiah internasional dan nasional Kemdikbudristek'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>🎓</span>
                    <span>Google Scholar & OpenAlex</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    250+ juta naskah dari universitas global, prosiding internasional, dan indeks sitasi dunia.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>🏛️</span>
                    <span>Crossref Official DOI</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Registri resmi International DOI Foundation, menjamin artikel peer-reviewed dan terverifikasi 100%.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>🇮🇩</span>
                    <span>SINTA & Garuda Kemdikbud</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Jurnal ilmiah terakreditasi nasional SINTA 1-6 dan Garba Rujukan Digital Kemdikbudristek RI.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>🔬</span>
                    <span>PubMed & Europe PMC</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Basis data 40+ juta literatur biomedis, kesehatan, bioteknologi, dan sains hayati dunia.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>⚛️</span>
                    <span>arXiv Cornell University</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Repositori open access preprint terkemuka bidang sains komputer, fisika, biologi komputasi, dan matematika.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                    <span>📖</span>
                    <span>DOAJ International</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Directory of Open Access Journals dengan akses PDF penuh berstandar peer-review ketat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedCitationPaper && (
        <CitationModal
          paper={selectedCitationPaper}
          onClose={() => setSelectedCitationPaper(null)}
          onSaveToLibrary={onToggleSavePaper}
          isSaved={isSaved(selectedCitationPaper.id)}
        />
      )}

      {selectedSynthesisPaper && (
        <PaperSynthesisModal
          paper={selectedSynthesisPaper}
          onClose={() => setSelectedSynthesisPaper(null)}
          onInsertToBab2={onInsertSynthesisToBab2}
        />
      )}
    </div>
  );
};
