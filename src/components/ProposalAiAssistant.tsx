import React, { useState } from 'react';
import { ProposalData, ProposalAssistantAdvice } from '../types';
import { getProposalAssistantSuggestions } from '../services/api';
import {
  Sparkles,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Loader2,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Check,
  Compass,
  FileText,
  Target,
  FlaskConical,
  ListOrdered,
  Globe,
  Flag,
} from 'lucide-react';

interface ProposalAiAssistantProps {
  currentProposal: ProposalData | null;
  onApplyAdviceToProposal: (section: 'latarBelakang' | 'rumusanMasalah' | 'tujuanPenelitian' | 'metodologi' | 'all', content: any) => void;
  onNavigateToProposalBuilder: () => void;
}

export const ProposalAiAssistant: React.FC<ProposalAiAssistantProps> = ({
  currentProposal,
  onApplyAdviceToProposal,
  onNavigateToProposalBuilder,
}) => {
  const [track, setTrack] = useState<'national' | 'international'>(
    currentProposal?.track || 'international'
  );

  const [topic, setTopic] = useState(currentProposal?.judul || '');
  const [field, setField] = useState(currentProposal?.bidang || 'IPA Hayati & Lingkungan');
  const [level, setLevel] = useState(currentProposal?.jenjang || 'Mahasiswa (D4 / S1)');
  const [researchType, setResearchType] = useState(currentProposal?.pendekatan || 'Kuantitatif Eksperimental');

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<ProposalAssistantAdvice | null>(null);
  const [appliedSections, setAppliedSections] = useState<Record<string, boolean>>({});

  const isIntl = track === 'international';

  const nationalTopics = [
    {
      title: 'Pemanfaatan Ekstrak Daun Kelor (Moringa oleifera) sebagai Pengawet Alami Daging Ayam Broiler',
      field: 'IPA Hayati & Lingkungan',
    },
    {
      title: 'Pengaruh Media Pembelajaran Interaktif Berbasis Augmented Reality terhadap Kemampuan Berpikir Kritis Mahasiswa',
      field: 'Teknologi Informasi, AI & Digital',
    },
    {
      title: 'Analisis Tingkat Stres Akademik dan Strategi Coping pada Mahasiswa Tingkat Akhir yang Menyusun Skripsi',
      field: 'Pendidikan & Psikologi Remaja',
    },
    {
      title: 'Sintesis Karbon Aktif dari Limbah Kulit Singkong untuk Adsorpsi Logam Berat Timbal (Pb) pada Air Sumur',
      field: 'Fisika, Energi Terbarukan & Rekayasa',
    },
  ];

  const intlTopics = [
    {
      title: 'Synthesis, Characterization, and Water Barrier Kinetics of Citrus sinensis Essential Oil-Loaded Starch Bio-Nanocomposites',
      field: 'Materials Science & Sustainable Bio-Engineering',
    },
    {
      title: 'Autonomous Multi-Sensor Drone Architecture for Real-Time Agricultural Moisture & Crop Stress Detection',
      field: 'Robotics, Embedded Systems & Intelligent Software',
    },
    {
      title: 'In-Silico Molecular Docking of Bioactive Phytochemicals Against Multi-Drug Resistant Bacterial Target Proteins',
      field: 'Translational Medical Sciences & Cellular Biochemistry',
    },
    {
      title: 'Kinetic Modeling of Microplastic Degradation Using Low-Cost Solar Photocatalytic Titania Thin Films',
      field: 'Earth & Environmental Sciences / Renewable Energy',
    },
  ];

  const sampleTopics = isIntl ? intlTopics : nationalTopics;

  const handleTrackChange = (newTrack: 'national' | 'international') => {
    setTrack(newTrack);
    setAdvice(null);
    if (newTrack === 'international') {
      setField('Materials Science & Sustainable Bio-Engineering');
      setLevel('Senior High School (Grades 10-12 / Pre-University)');
      setResearchType('Controlled Laboratory Experiment (Triplicate & Power Analysis)');
      setTopic(intlTopics[0].title);
    } else {
      setField('IPA Hayati & Lingkungan');
      setLevel('SMA / MA / SMK');
      setResearchType('Kuantitatif Eksperimental');
      setTopic(nationalTopics[0].title);
    }
  };

  const handleGetSuggestions = async (customTopic?: string) => {
    const selectedTopic = customTopic || topic;
    if (!selectedTopic.trim()) return;

    setLoading(true);
    setAppliedSections({});

    try {
      const result = await getProposalAssistantSuggestions({
        topic: selectedTopic,
        field,
        level,
        researchType,
        track,
        currentDraft: currentProposal ? {
          bab1: currentProposal.bab1,
          bab3: currentProposal.bab3,
        } : undefined,
      });

      setAdvice(result);
    } catch (err: any) {
      alert(`Gagal mendapatkan saran AI: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (section: 'latarBelakang' | 'rumusanMasalah' | 'tujuanPenelitian' | 'metodologi' | 'all') => {
    if (!advice) return;

    let contentToApply: any;
    if (section === 'latarBelakang') {
      contentToApply = advice.latarBelakang.drafPembuka;
    } else if (section === 'rumusanMasalah') {
      contentToApply = advice.rumusanMasalah;
    } else if (section === 'tujuanPenelitian') {
      contentToApply = advice.tujuanPenelitian;
    } else if (section === 'metodologi') {
      contentToApply = advice.metodologi;
    } else if (section === 'all') {
      contentToApply = advice;
    }

    onApplyAdviceToProposal(section, contentToApply);
    setAppliedSections((prev) => ({ ...prev, [section]: true }));
    setTimeout(() => {
      setAppliedSections((prev) => ({ ...prev, [section]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Track Selector Bar (Prominent at top) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-slate-700">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>{isIntl ? 'Competition Track Focus:' : 'Fokus Pembimbing Riset:'}</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => handleTrackChange('national')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isIntl
                ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-500" />
            <span>🇮🇩 Pembimbing KTI Nasional (OPSI / LKIR)</span>
          </button>

          <button
            onClick={() => handleTrackChange('international')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isIntl
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>🌐 ISEF International Research Advisor</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden ${
        isIntl
          ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950'
          : 'bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900'
      }`}>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            {isIntl ? 'International STEM Research Architecture Advisor' : 'Asisten AI Proposal KTI Mahasiswa & Siswa'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {isIntl
              ? 'Regeneron ISEF & ICYS Research Plan Consultant'
              : 'Konsultan Cerdas Per Bagian Proposal Ilmiah'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {isIntl
              ? 'Enter your preliminary research topic. The AI architect dissects and prescribes Section 1 (Rationale & Inverted Pyramid), Section 2 (Prior Art Matrix), and Section 3 (Power Analysis & ASTM/ISO Protocols) in 100% Academic English.'
              : 'Masukkan topik awal penelitian Anda. AI akan membedah dan memberikan saran spesifik untuk Latar Belakang (piramida terbalik), Rumusan Masalah yang tajam, Tujuan Penelitian, serta Metodologi & Variabel yang tepat.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">
              {isIntl ? 'Try Benchmark Topic:' : 'Coba Topik Mahasiswa:'}
            </span>
            {sampleTopics.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopic(item.title);
                  setField(item.field);
                  handleGetSuggestions(item.title);
                }}
                className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 px-3 py-1 rounded-full transition-colors cursor-pointer truncate max-w-xs"
              >
                {item.title.substring(0, 32)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isIntl ? 'Research Topic or Preliminary Hypothesis' : 'Topik Awal atau Judul Rencana Penelitian'}{' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                isIntl
                  ? 'E.g.: Synthesis, Characterization, and Water Barrier Kinetics of Citrus sinensis Essential Oil-Loaded Starch Bio-Nanocomposites'
                  : 'Contoh: Analisis Kualitas Air Sungai Citarum Akibat Limbah Industri Tekstil dan Strategi Bioremidiasi'
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isIntl ? 'Academic Standing' : 'Jenjang'}
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isIntl ? (
                <>
                  <option value="Senior High School (Grades 10-12 / Pre-University)">Senior High School (Grades 10-12 / Pre-University)</option>
                  <option value="Undergraduate Scholar (B.Sc. / B.Eng.)">Undergraduate Scholar (B.Sc. / B.Eng.)</option>
                  <option value="Junior High School (Grades 7-9)">Junior High School (Grades 7-9)</option>
                </>
              ) : (
                <>
                  <option value="Mahasiswa (D4 / S1)">Mahasiswa (D4 / S1 - Skripsi/KTI)</option>
                  <option value="SMA / MA / SMK">SMA / MA / SMK (Lomba OPSI/LKIR)</option>
                  <option value="SMP / MTs">SMP / MTs</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isIntl ? 'Research Category' : 'Bidang Keilmuan'}
            </label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isIntl ? (
                <>
                  <option value="Materials Science & Sustainable Bio-Engineering">Materials Science & Sustainable Bio-Engineering</option>
                  <option value="Translational Medical Sciences & Cellular Biochemistry">Translational Medical Sciences & Biochemistry</option>
                  <option value="Robotics, Embedded Systems & Intelligent Software">Robotics, Systems & Intelligent Software</option>
                  <option value="Earth & Environmental Sciences / Renewable Energy">Earth & Environmental Sciences / Clean Energy</option>
                  <option value="Behavioral & Cognitive Systems">Behavioral & Cognitive Systems</option>
                </>
              ) : (
                <>
                  <option value="IPA Hayati & Lingkungan">IPA Hayati & Lingkungan</option>
                  <option value="Fisika, Energi Terbarukan & Rekayasa">Fisika, Rekayasa & Material</option>
                  <option value="Sosial, Budaya & Humaniora (IPS)">Sosial Humaniora & Sosiologi</option>
                  <option value="Teknologi Informasi, AI & Digital">Teknologi Informasi & Data</option>
                  <option value="Kesehatan, Gizi & Farmasi Herbal">Kesehatan & Farmasi</option>
                  <option value="Pendidikan & Psikologi Remaja">Pendidikan & Psikologi</option>
                </>
              )}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isIntl ? 'Methodological Protocol' : 'Rencana Pendekatan Riset'}
            </label>
            <select
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isIntl ? (
                <>
                  <option value="Controlled Laboratory Experiment (Triplicate & Power Analysis)">Controlled Lab Experiment (Triplicate & Power Analysis)</option>
                  <option value="Engineering Design & Prototype Iteration (IEEE Standard)">Engineering Design & Prototype Iteration (IEEE)</option>
                  <option value="In-silico Computational Modeling & Molecular Dynamics">In-silico Computational Modeling</option>
                  <option value="Standardized Field Bio-Assay & Environmental Assay">Standardized Field Bio-Assay</option>
                </>
              ) : (
                <>
                  <option value="Kuantitatif Eksperimental">Kuantitatif Eksperimental (Uji Lab / Perlakuan)</option>
                  <option value="Kualitatif Deskriptif">Kualitatif Deskriptif (Wawancara & Observasi)</option>
                  <option value="Research & Development (R&D Prototipe)">Research & Development (R&D / Prototipe)</option>
                  <option value="Studi Komparatif / Korelasional">Studi Korelasional / Analisis Regresi</option>
                  <option value="Survei & Analisis Lapangan">Survei Lapangan & Kuesioner</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            {isIntl
              ? 'Ultra-fast AI advice with power analysis, ASTM standards, and explicit hypotheses.'
              : 'AI akan memberikan saran terarah untuk Bab I dan Bab III proposal Anda.'}
          </p>

          <button
            onClick={() => handleGetSuggestions()}
            disabled={loading || !topic.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-blue-200 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isIntl ? 'Analyzing Research Architecture...' : 'Menganalisis Topik...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isIntl ? 'Get ISEF AI Architecture Advice' : 'Minta Saran & Rekomendasi AI'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">
            {isIntl ? 'Synthesizing International Research Architecture...' : 'Menelaah Topik dan Merumuskan Saran Ilmiah...'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isIntl
              ? 'Formulating hypothesis-driven narrative, calculating statistical power, and designing ASTM/ISO experimental matrix.'
              : 'Memformulasikan alur latar belakang piramida terbalik, menentukan variabel bebas/terikat, dan menyusun metodologi yang realistis.'}
          </p>
        </div>
      )}

      {/* Suggestions Display Cards */}
      {advice && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. Analisis Topik & Variabel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isIntl ? 'Scientific Rationale & Variable Control Matrix' : 'Analisis Topik, Urgensi & Variabel Riset'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIntl ? 'Empirical urgency, literature deficit & novelty positioning' : 'Posisi ilmiah dan kebaruan (novelty) topik Anda'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-slate-800 uppercase tracking-wider text-[11px] block">
                  🎯 {isIntl ? 'Empirical Urgency & Global Significance:' : 'Urgensi Penelitian:'}
                </strong>
                <p className="text-slate-600 leading-relaxed">{advice.analisisTopik.urgensi}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <strong className="text-amber-900 uppercase tracking-wider text-[11px] block">
                  ✨ {isIntl ? 'Research Gap & Definitive Novelty:' : 'Research Gap / Nilai Kebaruan (Novelty):'}
                </strong>
                <p className="text-amber-800 leading-relaxed">{advice.analisisTopik.researchGap}</p>
              </div>
            </div>

            {/* Variabel Pills */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                {isIntl ? 'Prescribed Variable Architecture:' : 'Rekomendasi Variabel Penelitian:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-blue-700 block mb-0.5">
                    {isIntl ? 'Independent Variable (X):' : 'Variabel Bebas (X):'}
                  </span>
                  <span className="text-slate-700">{advice.analisisTopik.variabelUsulan.bebas}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-indigo-700 block mb-0.5">
                    {isIntl ? 'Dependent Variable (Y):' : 'Variabel Terikat (Y):'}
                  </span>
                  <span className="text-slate-700">{advice.analisisTopik.variabelUsulan.terikat}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-2xs">
                  <span className="font-bold text-slate-700 block mb-0.5">
                    {isIntl ? 'Controlled Variables:' : 'Variabel Kontrol:'}
                  </span>
                  <span className="text-slate-700">{advice.analisisTopik.variabelUsulan.kontrol || 'Environmental baselines'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Saran Latar Belakang Masalah */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isIntl ? 'Section 1: Background & Narrative Architecture' : 'Saran Bagian: Latar Belakang Masalah (Bab I)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIntl ? 'Inverted pyramid sequence and benchmark citations' : 'Alur piramida terbalik dan data pendukung yang wajib ada'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleApply('latarBelakang')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                {appliedSections['latarBelakang'] ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {appliedSections['latarBelakang']
                  ? (isIntl ? 'Applied to Section 1!' : 'Berhasil Diterapkan!')
                  : (isIntl ? 'Apply to Research Plan' : 'Terapkan ke Latar Belakang')}
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">
                  📐 {isIntl ? 'Inverted Pyramid Narrative Strategy:' : 'Panduan Alur Piramida Terbalik:'}
                </span>
                <p className="text-slate-600">{advice.latarBelakang.alurPiramida}</p>
              </div>

              <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-1">
                  ✍️ {isIntl ? 'Draft Opening Paragraph (Academic English):' : 'Contoh Draf Paragraf Pembuka:'}
                </span>
                <p className="text-slate-800 font-serif italic text-justify leading-relaxed bg-white p-3 rounded-xl border border-blue-100">
                  "{advice.latarBelakang.drafPembuka}"
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block">
                  🔍 {isIntl ? 'Key Benchmark Metrics to Quantify:' : 'Fakta & Data Empiris yang Perlu Dicari:'}
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {advice.latarBelakang.faktaDanDataYangPerluDicari.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Rumusan Masalah & Tujuan */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isIntl ? 'Hypothesis-Driven Questions & Synchronized Objectives' : 'Rumusan Masalah & Tujuan Penelitian Terukur'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIntl ? 'Falsifiable scientific questions paired 1:1 with specific objectives' : 'Pertanyaan penelitian terarah dan tujuan yang sinkron'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isIntl ? 'Research Questions' : 'Rumusan Masalah'}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleApply('rumusanMasalah')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {appliedSections['rumusanMasalah'] ? (isIntl ? 'Applied' : 'Tersalin') : (isIntl ? 'Apply (3 items)' : 'Terapkan (3 Butir)')}
                  </button>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                  {advice.rumusanMasalah.map((rumusan, i) => (
                    <li key={i} className="font-medium">{rumusan}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isIntl ? 'Specific Objectives' : 'Tujuan Penelitian'}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleApply('tujuanPenelitian')}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {appliedSections['tujuanPenelitian'] ? (isIntl ? 'Applied' : 'Tersalin') : (isIntl ? 'Apply (3 items)' : 'Terapkan (3 Butir)')}
                  </button>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                  {advice.tujuanPenelitian.map((tujuan, i) => (
                    <li key={i} className="font-medium">{tujuan}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* 4. Saran Metodologi Penelitian */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isIntl ? 'Section 3: Experimental Methodology & Safety Protocols' : 'Saran Bagian: Metodologi Penelitian (Bab III)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isIntl ? 'Power analysis (1 - beta), ASTM/ISO protocols, and inferential statistics' : 'Desain penelitian, sampling, instrumen, dan teknik analisis statistik'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleApply('metodologi')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                {appliedSections['metodologi'] ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                {appliedSections['metodologi'] ? (isIntl ? 'Applied!' : 'Berhasil Diterapkan!') : (isIntl ? 'Apply Protocols' : 'Terapkan ke Metodologi')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  🔬 {isIntl ? 'Study Design & Randomization:' : 'Rancangan & Desain Penelitian:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{advice.metodologi.pendekatan}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  👥 {isIntl ? 'Sample Cohort & Statistical Power (1 - β):' : 'Populasi, Sampel & Replikasi:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{advice.metodologi.populasiDanSampel}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  🛠️ {isIntl ? 'Standardized Instruments (ASTM/ISO):' : 'Instrumen & Alat Pengukuran:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{advice.metodologi.instrumen}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  📈 {isIntl ? 'Statistical Inference & Error Propagation:' : 'Teknik Analisis Statistik / Data:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{advice.metodologi.analisisStatistik}</p>
              </div>
            </div>
          </div>

          {/* 5. Tips Juri */}
          {advice.tipsJuri && (
            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-3xl flex items-start gap-3 text-xs">
              <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 uppercase tracking-wide block mb-1">
                  {isIntl ? 'Grand Jury & Reviewer Strategic Secret:' : 'Pesan Rahasia Reviewer & Juri KTI Nasional:'}
                </strong>
                <p className="text-amber-800 leading-relaxed font-medium">
                  {advice.tipsJuri}
                </p>
              </div>
            </div>
          )}

          {/* Navigate to full editor */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onNavigateToProposalBuilder}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <span>{isIntl ? 'Open Full Research Plan Editor & LaTeX Export' : 'Buka Editor Lengkap Naskah Proposal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
