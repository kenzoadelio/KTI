import React, { useState } from 'react';
import { paraphraseText } from '../services/api';
import { ParaphraseResult } from '../types';
import {
  FileCheck2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ParaphraseTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'formal' | 'concise' | 'elaborate'>('formal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParaphraseResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleInputs = [
    'Di zaman sekarang banyak banget remaja yang kecanduan main medsos sampe nilai ujiannya pada jeblok.',
    'Kulit jeruk manis biasanya cuma dibuang padahal kalo diekstrak bisa bunuh hama kutu daun cabai.',
    'Peneliti pengen tau apa ada pengaruh penggunaan aplikasi Quizizz sama hasil belajar matematika siswa SMA.',
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const res = await paraphraseText(inputText, mode);
      setResult(res);
    } catch (err: any) {
      alert(`Gagal memparafrase teks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.paraphrased);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-linear-to-br from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            Parafrase Akademis & Pemoles EYD V
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Tingkatkan Bobot Kalimat Ilmiah KTI
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
            Ubah bahasa sehari-hari atau draf kasar menjadi kalimat ilmiah yang baku, objektif, sesuai kaidah EYD V (PUEBI), serta terhindar dari plagiarisme.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-200 font-semibold">Coba Kalimat Siswa:</span>
            {sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(sample)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer truncate max-w-xs"
              >
                Contoh {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-2">Gaya Bahasa:</span>
          {[
            { id: 'formal', label: 'Formal Baku & Objektif (Standar KTI)' },
            { id: 'concise', label: 'Ringkas & Padat' },
            { id: 'elaborate', label: 'Elaborasi Ilmiah Mendalam' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === m.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Input & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input side */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Teks Asli Siswa
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {inputText.length} karakter
              </span>
            </div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis atau tempel kalimat yang ingin diperbaiki ke bahasa ilmiah..."
              className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Output side */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Hasil Parafrase Ilmiah (EYD V)
              </label>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Tersalin' : 'Salin Hasil'}
                </button>
              )}
            </div>

            <div className="w-full min-h-[200px] p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 leading-relaxed font-sans flex flex-col justify-between">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-500 py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  <span className="text-xs font-medium">Menganalisis diksi dan memoles struktur kalimat...</span>
                </div>
              ) : result ? (
                <div>
                  <p className="font-medium text-slate-800 text-justify">{result.paraphrased}</p>

                  {result.changesSummary && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-slate-600">
                      <strong className="text-emerald-900 block mb-0.5">Catatan Perbaikan:</strong>
                      <p>{result.changesSummary}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-12">
                  Hasil pemolesan bahasa akademis akan muncul di sini.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleParaphrase}
            disabled={loading || !inputText.trim()}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-semibold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-emerald-200 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memoles Kalimat...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Poles ke Bahasa Akademis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
