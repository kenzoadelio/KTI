import React, { useState } from 'react';
import { ProposalData } from '../types';
import { generateProposalPdf, PdfExportOptions } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  X,
  Check,
  CheckCircle2,
  Building,
  User,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface PdfExportModalProps {
  proposal: ProposalData | null;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({ proposal, onClose }) => {
  const [schoolName, setSchoolName] = useState('SMA Negeri / Lembaga Pendidikan');
  const [authorName, setAuthorName] = useState('Tim Peneliti Pelajar');
  const [academicYear, setAcademicYear] = useState(`${new Date().getFullYear()}`);
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [citationStyle, setCitationStyle] = useState<'APA' | 'Harvard' | 'IEEE'>('APA');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!proposal) return null;

  const handleDownload = () => {
    setIsExporting(true);
    try {
      const options: PdfExportOptions = {
        schoolName: schoolName.trim(),
        authorName: authorName.trim(),
        academicYear: academicYear.trim(),
        includeCoverPage,
        citationStyle,
      };

      generateProposalPdf(proposal, options);

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      alert(`Gagal membuat file PDF: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Unduh Proposal KTI (Format PDF)
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Standar A4
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Sesuai standar margin 4-3-3-3 & format kutipan APA 7th Edition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Options */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Target Document Preview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Naskah yang Diekspor
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {proposal.judul}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>{proposal.bidang}</span>
              <span>•</span>
              <span>{proposal.jenjang}</span>
              <span>•</span>
              <span>{proposal.daftarPustaka.length} Rujukan Ilmiah</span>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCoverPage}
                  onChange={(e) => setIncludeCoverPage(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                Sertakan Halaman Sampul Depan Formal (Cover Page)
              </label>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md">
                Direkomendasikan
              </span>
            </div>

            {includeCoverPage && (
              <div className="space-y-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Nama Sekolah / Madrasah / Kampus
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Contoh: SMA Negeri 3 Bandung"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nama Peneliti / Tim Penulis
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Contoh: Naufal Rizky & Tim"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Tahun Riset
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2024"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Standard Format Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-0.5">Format Kutipan:</span>
                <span className="text-slate-500 text-[11px]">
                  APA 7th Edition (Hanging Indent)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-0.5">Tata Letak:</span>
                <span className="text-slate-500 text-[11px]">
                  Times New Roman, A4, Nomor Hal.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-200 transition-all cursor-pointer"
          >
            {exportSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>PDF Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh File PDF Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
