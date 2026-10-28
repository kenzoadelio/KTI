import React, { useState, useRef } from 'react';
import { Paper, CitationStyle, ReferenceType, VerificationResult } from '../types';
import {
  formatCitationByStyle,
  generateInTextCitation,
  parseBibTeX,
  parseRIS,
  exportToBibTeX,
  exportToRIS,
} from '../utils/citationFormatter';
import { verifyReferenceValidity } from '../services/api';
import { CitationModal } from './CitationModal';
import {
  Bookmark,
  Trash2,
  Quote,
  Copy,
  Check,
  Download,
  Plus,
  BookOpen,
  Search,
  Upload,
  FileCode,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Info,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface ReferenceLibraryProps {
  savedPapers: Paper[];
  onRemovePaper: (paperId: string) => void;
  onAddManualPaper: (paper: Paper) => void;
  onNavigateToProposal: () => void;
}

export const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({
  savedPapers,
  onRemovePaper,
  onAddManualPaper,
  onNavigateToProposal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStyle, setActiveStyle] = useState<CitationStyle>('APA');
  const [selectedCitationPaper, setSelectedCitationPaper] = useState<Paper | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedItem, setCopiedItem] = useState<{ id: string; type: 'inText' | 'full' } | null>(null);

  // Verification state
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationMap, setVerificationMap] = useState<Record<string, VerificationResult>>({});
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [validationSummary, setValidationSummary] = useState<{ total: number; valid: number } | null>(null);

  // Forms and Modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Manual reference form state
  const [itemType, setItemType] = useState<ReferenceType>('journal');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('2024');
  const [journalName, setJournalName] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [doi, setDoi] = useState('');
  const [url, setUrl] = useState('');
  const [abstract, setAbstract] = useState('');

  // Import state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPapers = savedPapers.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.journalName && p.journalName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVerifyPaper = async (paper: Paper) => {
    setVerifyingId(paper.id);
    try {
      const res = await verifyReferenceValidity(paper.doi, paper.title, paper.authors[0]);
      setVerificationMap((prev) => ({ ...prev, [paper.id]: res }));
    } catch (err: any) {
      setVerificationMap((prev) => ({
        ...prev,
        [paper.id]: { isValid: false, message: 'Gagal menghubungi server verifikasi.' },
      }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleVerifyAllPapers = async () => {
    if (savedPapers.length === 0 || isVerifyingAll) return;
    setIsVerifyingAll(true);
    let validCount = 0;

    for (const paper of savedPapers) {
      try {
        const res = await verifyReferenceValidity(paper.doi, paper.title, paper.authors[0]);
        setVerificationMap((prev) => ({ ...prev, [paper.id]: res }));
        if (res.isValid) validCount++;
      } catch {
        // continue
      }
    }

    setValidationSummary({ total: savedPapers.length, valid: validCount });
    setIsVerifyingAll(false);
  };

  const handleCopyInText = (paper: Paper) => {
    const citation = generateInTextCitation(paper, activeStyle);
    navigator.clipboard.writeText(citation);
    setCopiedItem({ id: paper.id, type: 'inText' });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleCopyFull = (paper: Paper, index: number) => {
    const citation = formatCitationByStyle(paper, activeStyle, index + 1);
    navigator.clipboard.writeText(citation);
    setCopiedItem({ id: paper.id, type: 'full' });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleCopyAll = () => {
    if (savedPapers.length === 0) return;
    const allCitations = savedPapers
      .map((p, idx) => formatCitationByStyle(p, activeStyle, idx + 1))
      .sort()
      .join('\n\n');

    navigator.clipboard.writeText(allCitations);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (savedPapers.length === 0) return;
    const allCitations = savedPapers
      .map((p, idx) => formatCitationByStyle(p, activeStyle, idx + 1))
      .sort()
      .join('\n\n');

    const content = `DAFTAR PUSTAKA (${activeStyle} Style)\n\n${allCitations}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `Daftar_Pustaka_${activeStyle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBibTeX = () => {
    if (savedPapers.length === 0) return;
    const bibtex = exportToBibTeX(savedPapers);
    const blob = new Blob([bibtex], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `referensi_kti.bib`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadRIS = () => {
    if (savedPapers.length === 0) return;
    const ris = exportToRIS(savedPapers);
    const blob = new Blob([ris], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `referensi_kti.ris`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const authorList = authors
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const newPaper: Paper = {
      id: `manual-${Date.now()}`,
      title: title.trim(),
      authors: authorList.length > 0 ? authorList : ['Peneliti Anonim'],
      publicationYear: year.trim() || '2024',
      journalName: journalName.trim() || (itemType === 'book' ? 'Penerbit Buku' : 'Publikasi Ilmiah'),
      citationCount: 0,
      itemType,
      volume: volume.trim(),
      issue: issue.trim(),
      pages: pages.trim(),
      doi: doi.trim(),
      url: url.trim(),
      abstract: abstract.trim() || 'Entri referensi ditambahkan secara manual oleh siswa.',
      isOpenAccess: false,
      source: 'Entri Manual',
    };

    onAddManualPaper(newPaper);

    // Reset form
    setTitle('');
    setAuthors('');
    setJournalName('');
    setVolume('');
    setIssue('');
    setPages('');
    setDoi('');
    setUrl('');
    setAbstract('');
    setShowAddForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const fileName = file.name.toLowerCase();
      let imported: Paper[] = [];

      if (fileName.endsWith('.bib')) {
        imported = parseBibTeX(content);
      } else if (fileName.endsWith('.ris')) {
        imported = parseRIS(content);
      } else if (fileName.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          imported = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          setImportStatus('Format JSON tidak valid.');
          return;
        }
      } else {
        // Auto detect
        if (content.includes('@article') || content.includes('@book') || content.includes('@inproceedings')) {
          imported = parseBibTeX(content);
        } else if (content.includes('TY  -') || content.includes('TY -')) {
          imported = parseRIS(content);
        } else {
          setImportStatus('Format file tidak dikenali. Gunakan file .bib atau .ris.');
          return;
        }
      }

      if (imported.length > 0) {
        imported.forEach((p) => onAddManualPaper(p));
        setImportStatus(`Berhasil mengimpor ${imported.length} referensi!`);
        setTimeout(() => {
          setShowImportModal(false);
          setImportStatus(null);
        }, 1500);
      } else {
        setImportStatus('Tidak ada data referensi yang berhasil diekstrak.');
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!importText.trim()) return;

    let imported: Paper[] = [];
    if (importText.includes('@article') || importText.includes('@book') || importText.includes('@inproceedings')) {
      imported = parseBibTeX(importText);
    } else if (importText.includes('TY  -') || importText.includes('TY -')) {
      imported = parseRIS(importText);
    }

    if (imported.length > 0) {
      imported.forEach((p) => onAddManualPaper(p));
      setImportStatus(`Berhasil mengimpor ${imported.length} referensi!`);
      setImportText('');
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
      }, 1500);
    } else {
      setImportStatus('Teks tidak sesuai format BibTeX atau RIS.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            Manajemen Referensi Otomatis
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Daftar Pustaka & Koleksi Sitasi ({savedPapers.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Kelola rujukan ilmiah, atur gaya sitasi standar (APA 7th, MLA 9th, Chicago 17th), impor dari file BibTeX/RIS, dan hubungkan langsung ke naskah proposal KTI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Referensi Baru
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            Impor dari File (.bib / .ris)
          </button>

          {savedPapers.length > 0 && (
            <>
              <button
                onClick={handleVerifyAllPapers}
                disabled={isVerifyingAll}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
                title="Verifikasi keabsahan DOI dan metadata semua rujukan di Crossref & OpenAlex"
              >
                {isVerifyingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-100" />
                )}
                {isVerifyingAll ? 'Memverifikasi...' : 'Audit Validitas Referensi'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  title={`Salin semua daftar pustaka format ${activeStyle}`}
                >
                  {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedAll ? 'Tersalin!' : `Salin Semua (${activeStyle})`}
                </button>

                <button
                  onClick={handleDownloadBibTeX}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Ekspor ke format BibTeX (.bib)"
                >
                  <FileCode className="w-4 h-4 text-indigo-600" />
                </button>

                <button
                  onClick={handleDownloadRIS}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Ekspor ke format RIS / EndNote / Mendeley (.ris)"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Validation Summary Banner */}
      {validationSummary && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">
                Audit Validitas Selesai: {validationSummary.valid} dari {validationSummary.total} Referensi Terverifikasi Sah
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Metadata dicocokkan langsung ke Crossref DOI Registry & OpenAlex Academic Graph. Kredibilitas pustaka terjamin untuk naskah KTI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setValidationSummary(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-3 py-1 bg-white border border-emerald-300 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Style Selector Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
            Gaya Sitasi:
          </span>
          {(['APA', 'MLA', 'Chicago', 'IEEE', 'Harvard'] as CitationStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => setActiveStyle(style)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStyle === style
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {style === 'APA' && 'APA 7th (Standar KTI)'}
              {style === 'MLA' && 'MLA 9th'}
              {style === 'Chicago' && 'Chicago 17th'}
              {style === 'IEEE' && 'IEEE'}
              {style === 'Harvard' && 'Harvard'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          Format otomatis menyesuaikan kutipan teks dan daftar pustaka
        </div>
      </div>

      {/* Add Reference Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleSaveManual}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-blue-200 shadow-md space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Tambah Detail Referensi Baru</h3>
              <p className="text-xs text-slate-500">
                Isi metadata rujukan ilmiah untuk menghasilkan format sitasi yang akurat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tipe Rujukan *
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value as ReferenceType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="journal">Artikel Jurnal Ilmiah</option>
                <option value="book">Buku Teks / Buku Ilmiah</option>
                <option value="conference">Prosiding Konferensi</option>
                <option value="thesis">Skripsi / Tesis / Disertasi</option>
                <option value="website">Website Resmi / Laporan Instansi</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Judul Karya / Artikel / Buku *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Metodologi Penelitian Kuantitatif dan Kualitatif"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Penulis (Pisahkan dengan koma jika lebih dari satu) *
              </label>
              <input
                type="text"
                required
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Contoh: Sugiyono, Sutrisno Hadi"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tahun Publikasi *
              </label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {itemType === 'book' ? 'Nama Penerbit' : 'Nama Jurnal / Konferensi'}
              </label>
              <input
                type="text"
                value={journalName}
                onChange={(e) => setJournalName(e.target.value)}
                placeholder={itemType === 'book' ? 'Contoh: Alfabeta Bandung' : 'Contoh: Jurnal Biologi Indonesia'}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Volume & Nomor (Issue)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="Vol: 18"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="No: 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Halaman (Pages)
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Contoh: 112-120"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                DOI atau URL Tautan
              </label>
              <input
                type="text"
                value={doi || url}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('http') && !val.includes('doi.org')) {
                    setUrl(val);
                  } else {
                    setDoi(val);
                  }
                }}
                placeholder="10.23955/rkl.v18i2.28911 atau https://..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ringkasan / Abstrak (Opsional)
              </label>
              <textarea
                rows={2}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Catatan poin penting atau temuan utama karya ini untuk rujukan Bab II..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Simpan & Hasilkan Sitasi
            </button>
          </div>
        </form>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Impor Referensi dari File</h3>
                  <p className="text-[11px] text-slate-500">Mendukung file BibTeX (.bib) dan RIS (.ris)</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportStatus(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {importStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    importStatus.includes('Berhasil')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {importStatus}
                </div>
              )}

              {/* Upload file box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 p-6 rounded-2xl text-center cursor-pointer transition-colors"
              >
                <FileCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">Klik untuk Pilih File Referensi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mendukung .bib (BibTeX) atau .ris (Mendeley, Zotero, Google Scholar Export)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".bib,.ris,.txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="relative flex items-center py-2">
                <div className="grow border-t border-slate-200" />
                <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">
                  Atau Tempel Teks BibTeX / RIS
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Paste area */}
              <textarea
                rows={5}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Tempel sintaks BibTeX (@article{...}) atau sintaks RIS (TY  - JOUR...) di sini..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportStatus(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={handleTextImport}
                disabled={!importText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Impor dari Teks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Input for Saved Papers */}
      {savedPapers.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari rujukan tersimpan berdasarkan judul, nama penulis, atau nama jurnal..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
          />
        </div>
      )}

      {/* Papers List */}
      {savedPapers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Belum Ada Rujukan Tersimpan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Gunakan tab <strong>Cari Literatur (Scholar)</strong> untuk mencari paper jurnal ilmiah, atau klik tombol <em>"Tambah Referensi Baru"</em> untuk memasukkan buku/jurnal manual.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper, idx) => {
            const fullCitation = formatCitationByStyle(paper, activeStyle, idx + 1);
            const inTextCitation = generateInTextCitation(paper, activeStyle);
            const isCopiedInText = copiedItem?.id === paper.id && copiedItem.type === 'inText';
            const isCopiedFull = copiedItem?.id === paper.id && copiedItem.type === 'full';

            return (
              <div
                key={paper.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col gap-3 group"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {paper.publicationYear}
                    </span>
                    {paper.itemType && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {paper.itemType}
                      </span>
                    )}
                    <span className="text-xs font-medium text-slate-500 truncate max-w-xs">
                      {paper.journalName}
                    </span>

                    {/* Verification Status */}
                    {paper.isVerified || verificationMap[paper.id]?.isValid ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                        title="Terverifikasi resmi di Crossref DOI Registry / OpenAlex"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        Terverifikasi ({paper.verificationSource || verificationMap[paper.id]?.verificationSource || 'Crossref'})
                      </span>
                    ) : verificationMap[paper.id]?.isValid === false ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                        title={verificationMap[paper.id]?.message}
                      >
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        Perlu Cek Ulang
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVerifyPaper(paper)}
                        disabled={verifyingId === paper.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
                        title="Periksa keaslian artikel dan validitas DOI di Crossref Registry"
                      >
                        {verifyingId === paper.id ? (
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-600 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 text-slate-500 shrink-0" />
                        )}
                        {verifyingId === paper.id ? 'Memeriksa...' : 'Cek Validitas'}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => setSelectedCitationPaper(paper)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Lihat semua format gaya sitasi"
                    >
                      <Quote className="w-3.5 h-3.5 text-blue-600" />
                      Gaya Lain
                    </button>

                    <button
                      onClick={() => onRemovePaper(paper.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus dari koleksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {paper.doi ? (
                    <a
                      href={`https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline flex items-start gap-1"
                    >
                      <span>{paper.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                    </a>
                  ) : paper.url ? (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline flex items-start gap-1"
                    >
                      <span>{paper.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                    </a>
                  ) : (
                    paper.title
                  )}
                </h4>

                {/* Metadata details: Authors, Publisher, DOI */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                  <span className="text-slate-700 font-medium">
                    {paper.authors.join(', ')}
                  </span>
                  {paper.publisher && (
                    <span className="text-slate-400">
                      • Penerbit: <span className="text-slate-600 font-medium">{paper.publisher}</span>
                    </span>
                  )}
                  {paper.doi && (
                    <span className="text-slate-400">
                      • DOI:{' '}
                      <a
                        href={`https://doi.org/${paper.doi.replace(/^https?:\/\/doi\.org\//, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono text-[11px]"
                      >
                        {paper.doi}
                      </a>
                    </span>
                  )}
                </div>

                {/* Formatted Bibliographic Entry */}
                <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Format Daftar Pustaka ({activeStyle}):
                      </span>
                      <button
                        onClick={() => handleCopyFull(paper, idx)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        {isCopiedFull ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {isCopiedFull ? 'Tersalin' : 'Salin Entri'}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-serif text-slate-800 leading-relaxed pl-6 -indent-6">
                      {fullCitation}
                    </p>
                  </div>

                  {/* In-Text Citation preview */}
                  <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Kutipan Dalam Kalimat (In-Text):
                      </span>
                      <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {inTextCitation}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyInText(paper)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopiedInText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {isCopiedInText ? 'Tersalin' : 'Salin In-Text'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom call to action */}
          <div className="p-5 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-blue-900">
                Gunakan {savedPapers.length} Referensi Ini di Proposal KTI Anda
              </h4>
              <p className="text-xs text-blue-700 mt-0.5">
                AI akan menyelaraskan kutipan ini ke Bab II (Tinjauan Pustaka) dan membuatkan Bab Daftar Pustaka otomatis.
              </p>
            </div>
            <button
              onClick={onNavigateToProposal}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer shrink-0 flex items-center gap-2"
            >
              <span>Susun Proposal dengan Rujukan Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {selectedCitationPaper && (
        <CitationModal
          paper={selectedCitationPaper}
          onClose={() => setSelectedCitationPaper(null)}
          isSaved={true}
        />
      )}
    </div>
  );
};
