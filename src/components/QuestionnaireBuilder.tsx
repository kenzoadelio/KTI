import React, { useState } from 'react';
import {
  ListChecks,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Sparkles,
  Printer,
} from 'lucide-react';
import { LikertQuestion } from '../types';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_QUESTIONS: LikertQuestion[] = [
  {
    id: 'q-1',
    variable: 'Kesadaran Lingkungan',
    indicator: 'Pengetahuan Dampak Sampah',
    statement: 'Saya memahami bahwa sampah plastik konvensional membutuhkan ratusan tahun untuk terurai di alam liar.',
    type: 'favorable',
  },
  {
    id: 'q-2',
    variable: 'Kesadaran Lingkungan',
    indicator: 'Kebiasaan Penggunaan Plastik',
    statement: 'Saya tetap menggunakan kantong plastik sekali pakai meskipun membawa tas belanja ramah lingkungan.',
    type: 'unfavorable',
  },
  {
    id: 'q-3',
    variable: 'Penerimaan Bioplastik',
    indicator: 'Minat Pembelian Produk Ramah Lingkungan',
    statement: 'Saya bersedia membayar sedikit lebih mahal untuk produk kemasan bioplastik yang terbukti mudah terurai tanah.',
    type: 'favorable',
  },
  {
    id: 'q-4',
    variable: 'Penerimaan Bioplastik',
    indicator: 'Kekhawatiran Kualitas Fisik',
    statement: 'Kemasan berbahan dasar pati nabati terasa rapuh dan meragukan untuk menyimpan makanan basah.',
    type: 'unfavorable',
  },
  {
    id: 'q-5',
    variable: 'Dukungan Kebijakan',
    indicator: 'Regulasi Sekolah / Kampus',
    statement: 'Pihak sekolah/kampus perlu menerapkan larangan penggunaan kantong plastik sekali pakai di area kantin.',
    type: 'favorable',
  },
];

export const QuestionnaireBuilder: React.FC = () => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<LikertQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('cendekia_likert_questions');
      return saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  });

  const [newVar, setNewVar] = useState('');
  const [newIndicator, setNewIndicator] = useState('');
  const [newStatement, setNewStatement] = useState('');
  const [newType, setNewType] = useState<'favorable' | 'unfavorable'>('favorable');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('cendekia_likert_questions', JSON.stringify(questions));
  }, [questions]);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatement.trim()) return;

    const newQ: LikertQuestion = {
      id: `q_${Date.now()}`,
      variable: newVar.trim() || 'Variabel Penelitian',
      indicator: newIndicator.trim() || 'Indikator Utama',
      statement: newStatement.trim(),
      type: newType,
    };

    setQuestions((prev) => [...prev, newQ]);
    setNewStatement('');
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleCopyForm = () => {
    const text = `[Kuesioner Instrumen Penelitian]\nSkala Likert: 1 (Sangat Tidak Setuju) s.d. 5 (Sangat Setuju)\n\n${questions
      .map(
        (q, idx) =>
          `Pernyataan ${idx + 1} [${q.variable} - ${q.indicator}] (${q.type === 'favorable' ? 'Positif' : 'Negatif/Reverse'}):\n"${q.statement}"\n[ ] STS (1)  [ ] TS (2)  [ ] N (3)  [ ] S (4)  [ ] SS (5)\n`
      )
      .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Instrumen Riset Kuantitatif' : 'Quantitative Survey Instrument'}
            </span>
            <span>·</span>
            <span>Skala Likert 5 Poin (STS - TS - N - S - SS)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Penyusun Instrumen & Kuesioner Penelitian' : 'Likert Questionnaire & Survey Builder'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Rancang butir pernyataan angket penelitian berdasarkan kisi-kisi variabel dan indikator dengan dukungan reverse coding.'
              : 'Construct valid survey questionnaire items with favorable/unfavorable indicators and reverse coding support.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyForm}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copied ? 'Tersalin' : 'Salin Kuesioner'}</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{q.variable}</span>
                    <span>·</span>
                    <span>{q.indicator}</span>
                    <span>·</span>
                    <span
                      className={`font-semibold ${
                        q.type === 'favorable' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {q.type === 'favorable' ? 'Positif (Favorable)' : 'Negatif (Unfavorable / Reverse)'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mt-1 leading-snug">
                    "{q.statement}"
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(q.id)}
                className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Respondent Choices Preview */}
            <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-600">
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/70">1 - Sangat Tidak Setuju</div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/70">2 - Tidak Setuju</div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/70">3 - Netral / Ragu</div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/70">4 - Setuju</div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/70">5 - Sangat Setuju</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Statement Form */}
      <form onSubmit={handleAddQuestion} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <span className="font-bold text-slate-700 block">
          {language === 'id' ? '+ Tambah Butir Pernyataan Angket Baru:' : '+ Add New Survey Item:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            placeholder="Variabel (misal: Sikap Terhadap Bioplastik)"
            value={newVar}
            onChange={(e) => setNewVar(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Indikator (misal: Kemauan Membayar)"
            value={newIndicator}
            onChange={(e) => setNewIndicator(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
          >
            <option value="favorable">Positif (Favorable: 1 s.d. 5)</option>
            <option value="unfavorable">Negatif (Reverse Coding: 5 s.d. 1)</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Tuliskan kalimat butir pernyataan kuesioner..."
            value={newStatement}
            onChange={(e) => setNewStatement(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </form>
    </div>
  );
};
