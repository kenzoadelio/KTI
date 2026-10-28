import React, { useState } from 'react';
import { BrainstormTopic } from '../types';
import { brainstormTopics } from '../services/api';
import {
  Lightbulb,
  Sparkles,
  Award,
  ArrowRight,
  Loader2,
  Compass,
  CheckCircle,
  HelpCircle,
  Tag,
} from 'lucide-react';

interface TopicBrainstormerProps {
  onSelectTopicForProposal: (topic: string, category: string) => void;
  onSearchScholarTopic: (topic: string) => void;
}

export const TopicBrainstormer: React.FC<TopicBrainstormerProps> = ({
  onSelectTopicForProposal,
  onSearchScholarTopic,
}) => {
  const [field, setField] = useState('IPA Hayati & Lingkungan');
  const [level, setLevel] = useState('SMA / MA / SMK');
  const [keywords, setKeywords] = useState('');
  const [currentIssues, setCurrentIssues] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<BrainstormTopic[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const predefinedFields = [
    'IPA Hayati & Lingkungan',
    'Fisika, Energi Terbarukan & Rekayasa',
    'Sosial, Budaya & Humaniora (IPS)',
    'Teknologi Informasi, AI & Digital',
    'Kesehatan, Gizi & Pangan Fungsional',
  ];

  const sampleKeywords = [
    'Pemanfaatan sampah plastik',
    'Kesehatan mental pelajar',
    'Kearifan lokal daerah',
    'Energi alternatif surya/air',
    'AI dalam pembelajaran',
    'Tanaman obat tradisional',
  ];

  const handleBrainstorm = async () => {
    setLoading(true);
    setHasGenerated(true);

    try {
      const results = await brainstormTopics(field, level, keywords, currentIssues);
      setTopics(results);
    } catch (err: any) {
      alert(`Gagal membuat ide: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-linear-to-br from-amber-500 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-3">
            <Lightbulb className="w-3.5 h-3.5 text-amber-200" />
            Inspirasi Judul & Ide Riset KTI
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Bingung Mencari Judul Karya Tulis Ilmiah?
          </h1>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed mb-6">
            Temukan ide penelitian orisinal, bernilai kebaruan (novelty) tinggi, dan terbukti realistis dikerjakan oleh siswa untuk ajang OPSI Kemdikbud, LKIR BRIN, Madrasah Young Researchers, atau tugas akhir sekolah.
          </p>

          {/* Keywords suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-amber-200 font-semibold">Inspirasi Cepat:</span>
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setKeywords(kw)}
                className="text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Bidang Lomba / Riset
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {predefinedFields.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jenjang Peneliti
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="SMP / MTs">SMP / MTs (Pemula)</option>
              <option value="SMA / MA / SMK">SMA / MA / SMK (Menengah)</option>
              <option value="Mahasiswa (D4 / S1)">Mahasiswa S1/D4</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topik Minat / Kata Kunci Khusus
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Contoh: daun mangga, eco-enzyme, konsentrasi belajar, sampah plastik..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            AI mengombinasikan masalah nyata di Indonesia dengan metode riset siswa.
          </p>

          <button
            onClick={handleBrainstorm}
            disabled={loading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-amber-200 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Meramu Ide KTI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hasilkan Ide Judul KTI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-sm font-semibold text-slate-700">Mencari ide riset yang kompetitif dan realistis...</p>
          <p className="text-xs text-slate-400">Menyesuaikan dengan standar ajang OPSI & LKIR BRIN</p>
        </div>
      )}

      {/* Results */}
      {!loading && topics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                    {t.field || field}
                  </span>
                  {t.potentialCompetitions && t.potentialCompetitions.length > 0 && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      {t.potentialCompetitions[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {t.title}
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-slate-700 block mb-0.5">⚠️ Masalah / Urgensi:</strong>
                    <p className="text-slate-600 leading-relaxed">{t.urgency}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <strong className="text-amber-900 block mb-0.5">✨ Nilai Kebaruan (Novelty):</strong>
                    <p className="text-amber-800 leading-relaxed">{t.novelty}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                    <strong className="text-blue-900 block mb-0.5">🔬 Usulan Metode & Alat:</strong>
                    <p className="text-blue-800 leading-relaxed">{t.methodSuggestion} • <span className="font-semibold text-blue-900">{t.targetTools}</span></p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSearchScholarTopic(t.title)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  Cari Literatur Jurnal
                </button>

                <button
                  onClick={() => onSelectTopicForProposal(t.title, t.field || field)}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Gunakan untuk Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State Tips */}
      {!hasGenerated && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-2">
          <h4 className="font-bold text-sm flex items-center gap-2 text-amber-900">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            Kriteria Judul KTI yang Disukai Juri Nasional:
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-amber-800">
            <li><strong>Masalah Nyata:</strong> Bersumber dari fenomena yang kamu lihat langsung di sekolah atau lingkungan tempat tinggalmu.</li>
            <li><strong>Solusi Tepat Guna:</strong> Menggunakan bahan alami, limbah lokal, atau teknologi sederhana yang efisien dan murah.</li>
            <li><strong>Jelas Variabelnya:</strong> Tergambar apa yang diuji/diubah (variabel bebas) dan apa indikator keberhasilannya (variabel terikat).</li>
          </ul>
        </div>
      )}
    </div>
  );
};
