import React, { useState, useEffect } from 'react';
import { Paper, PaperSynthesis } from '../types';
import { summarizePaperForBab2 } from '../services/api';
import { Sparkles, X, Copy, Check, PlusCircle, Loader2, BookOpen } from 'lucide-react';

interface PaperSynthesisModalProps {
  paper: Paper | null;
  onClose: () => void;
  onInsertToBab2?: (text: string) => void;
}

export const PaperSynthesisModal: React.FC<PaperSynthesisModalProps> = ({
  paper,
  onClose,
  onInsertToBab2,
}) => {
  const [loading, setLoading] = useState(false);
  const [synthesis, setSynthesis] = useState<PaperSynthesis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  useEffect(() => {
    if (!paper) {
      setSynthesis(null);
      return;
    }

    let isMounted = true;
    async function runSynthesis() {
      if (!paper) return;
      setLoading(true);
      setError(null);
      setInserted(false);

      try {
        const result = await summarizePaperForBab2({
          title: paper.title,
          authors: paper.authors,
          abstract: paper.abstract,
        });
        if (isMounted) {
          setSynthesis(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Gagal mengekstrak sintesis jurnal');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    runSynthesis();
    return () => {
      isMounted = false;
    };
  }, [paper]);

  if (!paper) return null;

  const handleCopySynthesis = () => {
    if (!synthesis) return;
    navigator.clipboard.writeText(synthesis.sintesisBab2);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (!synthesis || !onInsertToBab2) return;
    onInsertToBab2(synthesis.sintesisBab2);
    setInserted(true);
    setTimeout(() => setInserted(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-linear-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                Sintesis Jurnal untuk Bab II KTI
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">AI Powered</span>
              </h3>
              <p className="text-xs text-slate-600">Ekstraksi intisari penelitian untuk tinjauan pustaka & penelitian terdahulu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper title */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Artikel Yang Dianalisis</p>
          <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">{paper.title}</h4>
          <p className="text-xs text-slate-600 mt-1">
            {paper.authors.slice(0, 3).join(', ')} ({paper.publicationYear}) • {paper.journalName}
          </p>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-slate-700">Menganalisis artikel dan merumuskan sintesis Bab II...</p>
              <p className="text-xs text-slate-400">Mengekstrak metode, temuan kunci, dan format kalimat kutipan</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <p className="font-semibold">Terjadi kendala saat menganalisis jurnal:</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}

          {synthesis && !loading && (
            <>
              {/* Ready-to-use Bab 2 Sentence */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                      Kalimat Siap Pakai untuk Bab II (Penelitian Terdahulu)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {synthesis.kutipanInText}
                  </span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-serif bg-white p-3 rounded-lg border border-indigo-100 italic">
                  "{synthesis.sintesisBab2}"
                </p>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={handleCopySynthesis}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Kalimat'}
                  </button>

                  {onInsertToBab2 && (
                    <button
                      onClick={handleInsert}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                    >
                      {inserted ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      {inserted ? 'Berhasil Dimasukkan ke Bab II!' : 'Sisipkan ke Bab II Proposal'}
                    </button>
                  )}
                </div>
              </div>

              {/* Structured Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    🎯 Masalah & Tujuan
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{synthesis.masalahDanTujuan}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    🔬 Metode yang Dipakai
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{synthesis.metode}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    💡 Temuan Kunci
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{synthesis.temuanUtama}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Tips Riset Siswa:</strong> Jangan hanya menyalin kutipan secara lepas. Kaitkan temuan jurnal ini dengan masalah spesifik yang kamu teliti di proposalmu untuk menunjukkan posisi riset (State of the Art).
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
