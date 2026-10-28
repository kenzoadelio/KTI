import React, { useState } from 'react';
import {
  BookMarked,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { PhrasebankCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';

const PHRASEBANK_CATEGORIES: PhrasebankCategory[] = [
  {
    id: 'gap',
    titleId: 'Menunjukkan Research Gap (Keterbatasan Riset Terdahulu)',
    titleEn: 'Identifying Research Gap & Novelty',
    descriptionId: 'Frasa akademis untuk menjelaskan kebaruan penelitian Anda dibanding rujukan sebelumnya.',
    descriptionEn: 'Academic phrases to establish novelty and explain limitations of prior works.',
    phrases: [
      {
        id: 'p-1',
        idText: 'Meskipun penelitian terdahulu telah mengkaji [aspek X], namun eksplorasi mendalam terkait [aspek Y] masih sangat terbatas.',
        enText: 'Although prior studies have extensively investigated [aspect X], empirical exploration regarding [aspect Y] remains notably sparse.',
        purpose: 'Menyoroti celah penelitian spesifik',
      },
      {
        id: 'p-2',
        idText: 'Hingga saat ini, belum ada konsensus yang jelas mengenai interaksi antara [variabel X] dan [variabel Y] dalam kondisi lingkungan tropis.',
        enText: 'To date, no clear scholarly consensus exists concerning the interaction between [variable X] and [variable Y] under tropical ambient conditions.',
        purpose: 'Membuka perdebatan akademis',
      },
      {
        id: 'p-3',
        idText: 'Penelitian ini hadir untuk menjembatani kesenjangan tersebut dengan menyintesis formulasi baru berbasis bahan alam lokal.',
        enText: 'This study aims to bridge this empirical void by synthesizing a novel formulation derived from indigenous bio-resources.',
        purpose: 'Menegaskan kontribusi naskah Anda',
      },
    ],
  },
  {
    id: 'literature',
    titleId: 'Kajian Pustaka & Sintesis Literatur (Bab II)',
    titleEn: 'Literature Review & Synthesis (Chapter 2)',
    descriptionId: 'Frasa transisi untuk menyandingkan pendapat beberapa pakar atau jurnal ilmiah.',
    descriptionEn: 'Connective phrases to contrast and synthesize findings from multiple scholars.',
    phrases: [
      {
        id: 'p-4',
        idText: 'Temuan ini sejalan dengan hipotesis yang diajukan oleh Suryanto et al. (2023), yang menyatakan bahwa penambahan plasticizer meningkatkan elastisitas membran.',
        enText: 'These findings align closely with the hypothesis posited by Suryanto et al. (2023), who demonstrated that plasticizer addition enhances membrane elasticity.',
        purpose: 'Mendukung temuan terdahulu',
      },
      {
        id: 'p-5',
        idText: 'Berbeda dengan laporan Rahmawati (2022) yang mencatat penurunan stabilitas, data pengujian saat ini menunjukkan resistensi air yang lebih kokoh.',
        enText: 'In contrast to Rahmawati (2022) reporting reduced stability, current experimental data reveal substantially enhanced water resistance.',
        purpose: 'Mempertentangkan dua hasil riset',
      },
      {
        id: 'p-6',
        idText: 'Ditinjau dari perspektif termodinamika polimer, fenomena tersebut dapat dijelaskan melalui mekanisme ikatan hidrogen antar-rantai pati.',
        enText: 'Viewed through the lens of polymer thermodynamics, this phenomenon is attributable to intermolecular hydrogen bonding along starch chains.',
        purpose: 'Memberikan penjelasan teoritis mendalam',
      },
    ],
  },
  {
    id: 'method',
    titleId: 'Menjelaskan Metodologi & Prosedur (Bab III)',
    titleEn: 'Describing Methodology & Protocols (Chapter 3)',
    descriptionId: 'Kalimat formal baku untuk menjabarkan tahapan eksperimen laboratorium atau survei.',
    descriptionEn: 'Formal scientific prose for experimental protocols, controls, and instruments.',
    phrases: [
      {
        id: 'p-7',
        idText: 'Untuk meminimalkan bias eksperimental, seluruh pengujian dilakukan secara triplo (tiga kali pengulangan independen).',
        enText: 'To mitigate experimental bias, all analytical measurements were performed in triplicate across independent trials.',
        purpose: 'Menjelaskan reliabilitas pengulangan',
      },
      {
        id: 'p-8',
        idText: 'Sampel diinkubasi pada suhu terkontrol (27 ± 2 °C) dengan kelembapan relatif 65% selama rentang waktu 14 hari berturut-turut.',
        enText: 'Specimens were incubated at controlled temperature (27 ± 2 °C) under 65% relative humidity over 14 consecutive days.',
        purpose: 'Spesifikasi kondisi perlakuan',
      },
      {
        id: 'p-9',
        idText: 'Data kuantitatif yang diperoleh selanjutnya diuji normalitasnya menggunakan uji Shapiro-Wilk sebelum dianalisis dengan ANOVA satu arah.',
        enText: 'The resulting quantitative dataset was subjected to Shapiro-Wilk normality testing prior to conducting One-Way Analysis of Variance (ANOVA).',
        purpose: 'Justifikasi pemilihan analisis statistik',
      },
    ],
  },
  {
    id: 'conclusion',
    titleId: 'Penarikan Kesimpulan & Rekomendasi (Bab V)',
    titleEn: 'Conclusions & Implications (Chapter 5)',
    descriptionId: 'Frasa akademis penutup untuk menjawab rumusan masalah dan memberi saran riset masa depan.',
    descriptionEn: 'Concluding phrases to summarize empirical answers and suggest future research.',
    phrases: [
      {
        id: 'p-10',
        idText: 'Secara keseluruhan, bukti empiris dalam penelitian ini membuktikan bahwa penambahan minyak atsiri 4% menghasilkan formulasi paling optimal.',
        enText: 'Taken together, the empirical evidence demonstrates that a 4% essential oil concentration produces the most optimal formulation.',
        purpose: 'Menjawab rumusan masalah secara lugas',
      },
      {
        id: 'p-11',
        idText: 'Temuan ini membuka peluang aplikasi industri kemasan ramah lingkungan skala UMKM yang bernilai ekonomis tinggi.',
        enText: 'These insights unveil promising avenues for commercializing cost-effective eco-packaging among local small-medium enterprises.',
        purpose: 'Menyoroti manfaat praktis',
      },
    ],
  },
];

export const AcademicPhrasebank: React.FC = () => {
  const { language } = useLanguage();
  const [activeCatId, setActiveCatId] = useState<string>('gap');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const activeCategory = PHRASEBANK_CATEGORIES.find((c) => c.id === activeCatId) || PHRASEBANK_CATEGORIES[0];

  const handleCopy = (phraseText: string, id: string) => {
    navigator.clipboard.writeText(phraseText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCategories = PHRASEBANK_CATEGORIES.map((cat) => {
    const matchedPhrases = cat.phrases.filter(
      (p) =>
        p.idText.toLowerCase().includes(search.toLowerCase()) ||
        p.enText.toLowerCase().includes(search.toLowerCase()) ||
        p.purpose.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, phrases: matchedPhrases };
  }).filter((cat) => cat.phrases.length > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Tata Bahasa & Diksi Akademis' : 'Scholarly Writing & Syntax'}
            </span>
            <span>·</span>
            <span>{language === 'id' ? 'Standar Academic Phrasebank' : 'Academic Phrasebank Standard'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Kamus Frasa & Pola Kalimat Akademis' : 'Academic Phrasebank & Scholarly Syntax'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Koleksi frasa penghubung formal dan kalimat standar baku ilmiah dwibahasa (Indonesia & Inggris) untuk memperkaya naskah KTI Anda.'
              : 'Curated bilingual scientific phrase templates (Indonesian & English) to elevate the scholastic tone of your manuscript.'}
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder={language === 'id' ? 'Cari frasa (gap, anova, teori)...' : 'Search phrases...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
        {PHRASEBANK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCatId(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeCatId === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'id' ? cat.titleId.split('(')[0] : cat.titleEn.split('&')[0]}
          </button>
        ))}
      </div>

      {/* Phrase Cards */}
      <div className="space-y-3.5">
        {(search ? filteredCategories.flatMap((c) => c.phrases) : activeCategory.phrases).map((phrase) => (
          <div
            key={phrase.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                🎯 {phrase.purpose}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(phrase.idText, `${phrase.id}-id`)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === `${phrase.id}-id` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copiedId === `${phrase.id}-id` ? 'Tersalin' : 'Salin (ID)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(phrase.enText, `${phrase.id}-en`)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  {copiedId === `${phrase.id}-en` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                  <span>{copiedId === `${phrase.id}-en` ? 'Copied' : 'Copy (EN)'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-900 font-medium leading-relaxed">
                🇮🇩 {phrase.idText}
              </div>
              <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 text-slate-800 font-medium leading-relaxed italic">
                🇺🇸 {phrase.enText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
