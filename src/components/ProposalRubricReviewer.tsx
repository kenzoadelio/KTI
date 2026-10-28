import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { ProposalData, RubricCriterion } from '../types';
import { useLanguage } from '../context/LanguageContext';

const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: 'urgency',
    titleId: 'Urgensi & Latar Belakang Masalah',
    titleEn: 'Problem Urgency & Background',
    weight: 20,
    maxScore: 100,
    descriptionId: 'Kejelasan alur piramida terbalik, didukung fakta/data statistik resmi dan kerugian bila masalah tidak diselesaikan.',
    descriptionEn: 'Clarity of the inverted pyramid structure, backed by official statistical evidence.',
  },
  {
    id: 'novelty',
    titleId: 'Kebaruan Ide & Orisinalitas (Research Gap)',
    titleEn: 'Novelty & Research Gap',
    weight: 25,
    maxScore: 100,
    descriptionId: 'Adanya pembeda nyata dan nilai tambah dibanding penelitian terdahulu yang relevan.',
    descriptionEn: 'Clear differentiation and added scholarly value compared to prior literature.',
  },
  {
    id: 'method',
    titleId: 'Ketepatan Metodologi & Desain Eksperimen',
    titleEn: 'Methodological Rigor & Experimental Design',
    weight: 30,
    maxScore: 100,
    descriptionId: 'Kesesuaian rancangan uji (RAL/RAK/Survei), kejelasan variabel bebas/terikat, dan validitas uji statistik.',
    descriptionEn: 'Appropriateness of design, variable controls, and validity of statistical testing.',
  },
  {
    id: 'impact',
    titleId: 'Manfaat Teoretis & Solusi Praktis Masyarakat',
    titleEn: 'Theoretical & Practical Impact',
    weight: 15,
    maxScore: 100,
    descriptionId: 'Dampak nyata bagi konservasi lingkungan, ekonomi lokal, dan pengembangan ilmu pengetahuan.',
    descriptionEn: 'Tangible benefits for environmental sustainability, economy, or scientific advancement.',
  },
  {
    id: 'formatting',
    titleId: 'Format Penulisan, Sitasi, & Bahasa Baku',
    titleEn: 'Manuscript Formatting & Citation Rigor',
    weight: 10,
    maxScore: 100,
    descriptionId: 'Kesesuaian kaidah EYD/APA 7th, konsistensi daftar pustaka primer 5 tahun terakhir.',
    descriptionEn: 'APA 7th citation compliance and adherence to academic formatting.',
  },
];

export const ProposalRubricReviewer: React.FC<{ currentProposal: ProposalData | null }> = ({
  currentProposal,
}) => {
  const { language } = useLanguage();

  const [scores, setScores] = useState<Record<string, number>>({
    urgency: 88,
    novelty: 85,
    method: 90,
    impact: 84,
    formatting: 86,
  });

  const [copied, setCopied] = useState(false);

  const handleScoreChange = (id: string, val: number) => {
    setScores((prev) => ({ ...prev, [id]: val }));
  };

  // Weighted total score
  const totalScore = Math.round(
    RUBRIC_CRITERIA.reduce((acc, curr) => {
      const s = scores[curr.id] || 80;
      return acc + (s * curr.weight) / 100;
    }, 0)
  );

  const predicate =
    totalScore >= 90
      ? { label: 'Sangat Memuaskan (Potensi Medali Emas)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
      : totalScore >= 80
      ? { label: 'Baik Sekali (Layak Lolos Finalis OPSI / LKIR)', color: 'text-blue-700 bg-blue-50 border-blue-200' }
      : totalScore >= 70
      ? { label: 'Cukup (Perlu Penguatan Metodologi)', color: 'text-amber-700 bg-amber-50 border-amber-200' }
      : { label: 'Perlu Revisi Menyeluruh', color: 'text-rose-700 bg-rose-50 border-rose-200' };

  const handleCopyReport = () => {
    const report = `[Evaluasi Rubrik Proposal KTI - Standar OPSI / LKIR BRIN]\nJudul: ${currentProposal?.judul || 'Draf Proposal'}\nNilai Akhir: ${totalScore}/100 (${predicate.label})\n\nRincian Penilaian:\n${RUBRIC_CRITERIA.map(
      (c) => `- ${c.titleId} (Bobot ${c.weight}%): ${scores[c.id]}/100`
    ).join('\n')}\n\nCatatan Evaluasi Juri:\n1. Pastikan perlakuan kontrol pada eksperimen didokumentasikan dengan foto setiap 3 hari.\n2. Tingkatkan proporsi jurnal rujukan terindeks Scopus/SINTA 1-2 dalam 5 tahun terakhir.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Standar Penjurian Lomba' : 'Competition Jury Rubric'}
            </span>
            <span>·</span>
            <span>Pedoman OPSI Puspresnas & LKIR BRIN</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Evaluator Rubrik Penilaian Proposal' : 'Proposal Rubric Reviewer & Scorecard'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Uji kelayakan draf proposal Anda menggunakan standar rubrik penilaian dewan juri kompetisi riset nasional.'
              : 'Evaluate your proposal readiness against national research competition scoring rubrics and jury criteria.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="p-3 rounded-2xl bg-slate-900 text-white text-center min-w-24 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Skor Total</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">{totalScore}</span>
            <span className="text-[10px] text-slate-400 block font-mono">/ 100</span>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin Lembar Nilai'}</span>
          </button>
        </div>
      </div>

      {/* Predicate Banner */}
      <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${predicate.color}`}>
        <span>Predikat Kelayakan: {predicate.label}</span>
        <span className="font-mono text-xs">Bobot Terkoreksi: 100%</span>
      </div>

      {/* Criteria Breakdown */}
      <div className="space-y-4">
        {RUBRIC_CRITERIA.map((criterion) => {
          const score = scores[criterion.id] || 80;
          return (
            <div
              key={criterion.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">
                      {language === 'id' ? criterion.titleId : criterion.titleEn}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      (Bobot: {criterion.weight}%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {language === 'id' ? criterion.descriptionId : criterion.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={score}
                    onChange={(e) => handleScoreChange(criterion.id, Number(e.target.value))}
                    className="w-32 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-bold font-mono text-slate-900 w-10 text-right">
                    {score}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
