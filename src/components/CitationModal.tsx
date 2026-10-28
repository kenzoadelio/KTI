import React, { useState } from 'react';
import { Paper } from '../types';
import { X, Copy, Check, Bookmark, BookOpen, Quote } from 'lucide-react';

interface CitationModalProps {
  paper: Paper | null;
  onClose: () => void;
  onSaveToLibrary?: (paper: Paper) => void;
  isSaved?: boolean;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  paper,
  onClose,
  onSaveToLibrary,
  isSaved = false,
}) => {
  const [activeTab, setActiveTab] = useState<'APA' | 'Harvard' | 'IEEE' | 'MLA' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const authors = paper.authors && paper.authors.length > 0 ? paper.authors : ['Anonim'];
  const year = paper.publicationYear || '2024';
  const journal = paper.journalName || 'Publikasi Ilmiah';
  const title = paper.title || 'Tanpa Judul';
  const doi = paper.doi ? paper.doi.replace(/^https?:\/\/doi\.org\//, '') : '';
  const doiUrl = doi ? `https://doi.org/${doi}` : '';

  // Author formatting
  const formatAuthorsApa = () => {
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]}, & ${authors[1]}`;
    return `${authors[0]}, et al.`;
  };

  const citations: Record<string, string> = {
    APA: `${formatAuthorsApa()} (${year}). ${title}. ${journal}.${doiUrl ? ` ${doiUrl}` : ''}`,
    Harvard: `${authors.join(', ')} (${year}) '${title}', ${journal}.${doiUrl ? ` Tersedia di: ${doiUrl}` : ''}`,
    IEEE: `[1] ${authors.slice(0, 3).join(', ')}${authors.length > 3 ? ' et al.' : ''}, "${title}," ${journal}, ${year}.${doi ? ` doi: ${doi}.` : ''}`,
    MLA: `${authors[0]}${authors.length > 1 ? ', et al.' : ''}. "${title}." ${journal}, ${year}.${doiUrl ? ` ${doiUrl}.` : ''}`,
    BibTeX: `@article{${authors[0]?.split(' ')[0]?.toLowerCase() || 'ref'}${year},
  title = {${title}},
  author = {${authors.join(' and ')}},
  journal = {${journal}},
  year = {${year}}${doi ? `,\n  doi = {${doi}}` : ''}
}`,
  };

  const currentCitation = citations[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Sitasi & Rujukan Ilmiah</h3>
              <p className="text-xs text-slate-500">Salin format sitasi untuk Daftar Pustaka KTI Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper title preview */}
        <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-0.5">Artikel Terpilih</p>
          <p className="text-sm font-medium text-slate-800 line-clamp-2">{paper.title}</p>
        </div>

        {/* Citation Format Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {(['APA', 'Harvard', 'IEEE', 'MLA', 'BibTeX'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab} {tab === 'APA' && <span className="text-[10px] opacity-80">(Standar KTI)</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Citation Content Box */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="relative p-4 bg-slate-50 rounded-xl border border-slate-200">
            {activeTab === 'BibTeX' ? (
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
                {currentCitation}
              </pre>
            ) : (
              <p className="text-sm text-slate-800 leading-relaxed font-serif">
                {currentCitation}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Sesuai standar penulisan daftar pustaka akademik
            </span>
            {doi && (
              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                DOI: {doi}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {onSaveToLibrary && (
            <button
              onClick={() => onSaveToLibrary(paper)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                isSaved
                  ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600 text-emerald-600' : ''}`} />
              {isSaved ? 'Tersimpan di Koleksi' : 'Simpan ke Koleksi KTI'}
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Tersalin ke Clipboard!' : 'Salin Sitasi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
