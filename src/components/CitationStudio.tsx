import React, { useState } from 'react';
import {
  Quote,
  Copy,
  Check,
  Download,
  BookOpen,
  Sparkles,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CitationStudio: React.FC = () => {
  const { language } = useLanguage();

  const [title, setTitle] = useState('Sintesis dan Karakterisasi Bioplastik Berbasis Pati Singkong dengan Minyak Atsiri');
  const [authors, setAuthors] = useState('Suryanto, B., Rahmawati, D., Pratama, A.');
  const [year, setYear] = useState('2023');
  const [journal, setJournal] = useState('Jurnal Rekayasa Kimia dan Lingkungan');
  const [volume, setVolume] = useState('18');
  const [issue, setIssue] = useState('2');
  const [pages, setPages] = useState('112-120');
  const [doi, setDoi] = useState('10.23955/rkl.v18i2.28911');
  const [activeStyle, setActiveStyle] = useState<'APA' | 'IEEE' | 'MLA' | 'Harvard' | 'Chicago' | 'Vancouver'>('APA');
  const [copied, setCopied] = useState(false);

  // Parse authors
  const authorList = authors
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean);

  // Generate formatting based on active style
  const formattedCitation = React.useMemo(() => {
    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, '').trim();
    const doiUrl = cleanDoi ? `https://doi.org/${cleanDoi}` : '';

    switch (activeStyle) {
      case 'APA':
        return `${authors} (${year}). ${title}. ${journal}, ${volume}(${issue}), ${pages}.${doiUrl ? ` ${doiUrl}` : ''}`;
      case 'IEEE':
        return `[1] ${authors}, "${title}," ${journal}, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}.${cleanDoi ? ` doi: ${cleanDoi}.` : ''}`;
      case 'MLA':
        return `${authors}. "${title}." ${journal}, vol. ${volume}, no. ${issue}, ${year}, pp. ${pages}.${doiUrl ? ` ${doiUrl}` : ''}`;
      case 'Harvard':
        return `${authors}, ${year}. ${title}. ${journal}, ${volume}(${issue}), pp.${pages}.${doiUrl ? ` Available at: <${doiUrl}>.` : ''}`;
      case 'Chicago':
        return `${authors}. "${title}." ${journal} ${volume}, no. ${issue} (${year}): ${pages}.${doiUrl ? ` ${doiUrl}` : ''}`;
      case 'Vancouver':
        return `${authors}. ${title}. ${journal}. ${year};${volume}(${issue}):${pages}.${doiUrl ? ` doi: ${cleanDoi}` : ''}`;
      default:
        return `${authors} (${year}). ${title}. ${journal}.`;
    }
  }, [activeStyle, title, authors, year, journal, volume, issue, pages, doi]);

  // BibTeX representation
  const bibtexCode = React.useMemo(() => {
    const firstAuthorKey = authorList[0] ? authorList[0].split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') : 'author';
    const citeKey = `${firstAuthorKey}${year}${title.slice(0, 4).toLowerCase().replace(/[^a-z]/g, '')}`;

    return `@article{${citeKey},
  title = {${title}},
  author = {${authorList.join(' and ')}},
  journal = {${journal}},
  volume = {${volume}},
  number = {${issue}},
  pages = {${pages}},
  year = {${year}},
  doi = {${doi.replace(/^https?:\/\/doi\.org\//, '')}}
}`;
  }, [title, authorList, journal, volume, issue, pages, year, doi]);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(formattedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBibtex = () => {
    const blob = new Blob([bibtexCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation_${year}_${title.slice(0, 10).replace(/[^a-zA-Z0-9]/g, '_')}.bib`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Standarisasi Sitasi' : 'Citation Standardization'}
            </span>
            <span>·</span>
            <span>6 Gaya Resmi (APA, IEEE, MLA, Harvard, Chicago, Vancouver)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Quote className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Studio & Generator Sitasi Ilmiah' : 'Multi-Style Citation Studio'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Konversi metadata buku, jurnal, dan prosiding ke dalam format kutipan standar karya tulis ilmiah & ekspor BibTeX.'
              : 'Convert book, journal, and conference metadata into standard scientific citation formats & BibTeX export.'}
          </p>
        </div>
      </div>

      {/* Style Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
        {(['APA', 'IEEE', 'MLA', 'Harvard', 'Chicago', 'Vancouver'] as const).map((style) => (
          <button
            key={style}
            type="button"
            onClick={() => setActiveStyle(style)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeStyle === style
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {style} {style === 'APA' ? '7th' : style === 'MLA' ? '9th' : ''}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block font-semibold text-slate-700 mb-1">
            {language === 'id' ? 'Judul Makalah / Artikel' : 'Paper / Article Title'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            {language === 'id' ? 'Nama Penulis (Pisahkan dengan koma)' : 'Authors (Comma separated)'}
          </label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {language === 'id' ? 'Tahun Publikasi' : 'Publication Year'}
          </label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            {language === 'id' ? 'Nama Jurnal / Penerbit' : 'Journal / Publisher Name'}
          </label>
          <input
            type="text"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Volume / No / Halaman</label>
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Vol"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-center text-slate-900"
            />
            <input
              type="text"
              placeholder="No"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-16 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-center text-slate-900"
            />
            <input
              type="text"
              placeholder="Halaman"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="flex-1 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block font-semibold text-slate-700 mb-1">DOI (Digital Object Identifier)</label>
          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            placeholder="10.xxxx/xxxx"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono"
          />
        </div>
      </div>

      {/* Generated Result Box */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Hasil Sitasi Format {activeStyle}:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCitation}
              className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Tersalin!' : 'Salin Sitasi'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadBibtex}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Download className="w-3 h-3 text-blue-400" />
              <span>Unduh .bib</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/90 text-xs sm:text-sm text-slate-900 leading-relaxed font-serif select-all">
          {formattedCitation}
        </div>
      </div>
    </div>
  );
};
