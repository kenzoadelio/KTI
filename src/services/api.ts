import {
  Paper,
  ProposalData,
  BrainstormTopic,
  ParaphraseResult,
  PaperSynthesis,
  AdvancedSearchFilters,
  ProposalAssistantAdvice,
  VerificationResult,
  ScholarSearchResponse,
  EconomicMarketData,
} from '../types';

export async function verifyReferenceValidity(
  doi?: string,
  title?: string,
  author?: string
): Promise<VerificationResult> {
  const response = await fetch('/api/scholar/verify-doi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doi, title, author }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal memverifikasi referensi`);
  }

  return response.json();
}

export async function searchScholarPapers(
  queryOrFilters: string | AdvancedSearchFilters,
  filterOpenAccess = false,
  sort = 'relevance_score:desc',
  source = 'all'
): Promise<ScholarSearchResponse> {
  let bodyPayload: any;

  if (typeof queryOrFilters === 'string') {
    bodyPayload = {
      query: queryOrFilters,
      filterOpenAccess,
      sort,
      source,
    };
  } else {
    bodyPayload = {
      query: queryOrFilters.query,
      exactPhrase: queryOrFilters.exactPhrase,
      author: queryOrFilters.author,
      journal: queryOrFilters.journal,
      yearFrom: queryOrFilters.yearFrom,
      yearTo: queryOrFilters.yearTo,
      filterOpenAccess: queryOrFilters.filterOpenAccess ?? filterOpenAccess,
      sort: queryOrFilters.sortBy ?? sort,
      source: queryOrFilters.repositorySource || source,
    };
  }

  const response = await fetch('/api/scholar/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal mencari karya ilmiah`);
  }

  return response.json();
}

export async function getProposalAssistantSuggestions(payload: {
  topic: string;
  field?: string;
  level?: string;
  researchType?: string;
  currentDraft?: any;
  track?: 'national' | 'international';
}): Promise<ProposalAssistantAdvice> {
  const response = await fetch('/api/gemini/proposal-suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal mendapatkan saran proposal AI`);
  }

  const data = await response.json();
  return data.suggestions;
}

export async function generateKtiProposal(payload: {
  topic: string;
  category: string;
  level: string;
  researchType: string;
  problemStatement?: string;
  savedReferences?: any[];
  targetSection?: string;
  track?: 'national' | 'international';
}): Promise<ProposalData> {
  const response = await fetch('/api/gemini/generate-proposal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal menyusun proposal KTI`);
  }

  const data = await response.json();
  return {
    ...data.proposal,
    bidang: payload.category,
    jenjang: payload.level,
    pendekatan: payload.researchType,
    track: payload.track || 'national',
    updatedAt: new Date().toISOString(),
  };
}

export async function sendMentorMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentContext?: any,
  track?: 'national' | 'international'
): Promise<string> {
  const response = await fetch('/api/gemini/ai-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, currentContext, track }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal terhubung ke Mentor AI`);
  }

  const data = await response.json();
  return data.reply;
}

export async function paraphraseText(
  text: string,
  mode: 'formal' | 'concise' | 'elaborate' = 'formal'
): Promise<ParaphraseResult> {
  const response = await fetch('/api/gemini/paraphrase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, mode }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal memparafrase teks`);
  }

  const data = await response.json();
  return data.result;
}

export async function brainstormTopics(
  field: string,
  level: string,
  keywords?: string,
  currentIssues?: string
): Promise<BrainstormTopic[]> {
  const response = await fetch('/api/gemini/brainstorm-topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field, level, keywords, currentIssues }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal mencari ide topik KTI`);
  }

  const data = await response.json();
  return data.topics || [];
}

export async function summarizePaperForBab2(paper: {
  title: string;
  authors: string[];
  abstract: string;
}): Promise<PaperSynthesis> {
  const response = await fetch('/api/gemini/summarize-paper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paper),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal menyintesis artikel ilmiah`);
  }

  const data = await response.json();
  return data.synthesis;
}

export async function fetchEconomicIndicators(): Promise<EconomicMarketData> {
  const response = await fetch('/api/market/economic-indicators');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Gagal memuat data indikator ekonomi`);
  }
  return response.json();
}

