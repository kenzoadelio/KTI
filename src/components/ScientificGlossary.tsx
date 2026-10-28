import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { GlossaryTerm } from '../types';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';
import { useLanguage } from '../context/LanguageContext';

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'g-1',
    term: 'Biodegradasi (Biodegradation)',
    category: 'Biologi & Hayati',
    definitionId: 'Proses perombakan senyawa organik kompleks oleh aktivitas enzim mikroorganisme tanah (bakteri, fungi) menjadi air, karbon dioksida, dan biomassa alami.',
    definitionEn: 'The biological breakdown of complex organic matter into water, CO2, and biomass by enzymatic micro-organisms.',
    exampleId: 'Uji biodegradasi bioplastik pati singkong diukur berdasarkan persentase kehilangan massa (weight loss) selama 14 hari di tanah kompos.',
    exampleEn: 'Biodegradation kinetics of cassava bioplastics were quantified by soil burial weight loss over 14 days.',
  },
  {
    id: 'g-2',
    term: 'Research Gap (Celah Penelitian)',
    category: 'Metodologi',
    definitionId: 'Ruang lingkup, variabel, atau fenomena yang belum terjawab atau belum pernah dieksplorasi secara memadai oleh publikasi ilmiah terdahulu.',
    definitionEn: 'An unaddressed topic, missing variable, or empirical void remaining unanswered in existing literature.',
    exampleId: 'Research gap dalam riset ini adalah belum adanya studi mengenai ketahanan air bioplastik pati dengan penambahan minyak kulit jeruk manis.',
    exampleEn: 'The research gap lies in the uninvestigated water resistance of starch bioplastics enhanced with orange peel essential oil.',
  },
  {
    id: 'g-3',
    term: 'Rancangan Acak Lengkap / RAL (CRD)',
    category: 'Metodologi',
    definitionId: 'Rancangan percobaan di mana perlakuan dialokasikan secara acak ke seluruh unit percobaan yang bersifat homogen (lingkungan seragam).',
    definitionEn: 'An experimental design in which treatments are allocated completely at random among homogeneous experimental units.',
    exampleId: 'RAL satu faktor digunakan dalam eksperimen sintesis bioplastik dengan 4 variasi konsentrasi minyak atsiri.',
    exampleEn: 'A single-factor Completely Randomized Design was employed across 4 essential oil concentration treatments.',
  },
  {
    id: 'g-4',
    term: 'Kuat Tarik (Tensile Strength)',
    category: 'Fisika & Kimia',
    definitionId: 'Tegangan maksimum yang mampu ditahan oleh suatu material plastik sebelum mengalami patah atau putus saat ditarik.',
    definitionEn: 'The maximum longitudinal stress a material withstands before tensile failure or rupture.',
    exampleId: 'Kuat tarik bioplastik diuji menggunakan Universal Testing Machine (UTM) dengan satuan MegaPascal (MPa).',
    exampleEn: 'Tensile strength of the bio-films was recorded on a Universal Testing Machine in MegaPascals (MPa).',
  },
  {
    id: 'g-5',
    term: 'IHSG (Indeks Harga Saham Gabungan)',
    category: 'Ekonomi & Finansial',
    definitionId: 'Indikator pergerakan seluruh saham biasa dan saham preferen yang tercatat di Bursa Efek Indonesia (BEI) sebagai barometer kesehatan pasar modal.',
    definitionEn: 'The composite stock index reflecting price performance of all listed equities on the Indonesia Stock Exchange.',
    exampleId: 'Penelitian ekonomi makro menggunakan time-series IHSG sebagai variabel penjelas likuiditas pasar modal domestik.',
    exampleEn: 'The macro investigation adopted IDX composite time-series as an explanatory metric of capital market liquidity.',
  },
  {
    id: 'g-6',
    term: 'P-Value (Nilai Probabilitas)',
    category: 'Metodologi',
    definitionId: 'Peluang memperoleh hasil uji statistik yang sama atau lebih ekstrem dengan asumsi hipotesis nol (H0) bernilai benar. Nilai p < 0,05 menunjukkan signifikansi.',
    definitionEn: 'The probability of observing sample outcomes as extreme as observed, assuming the null hypothesis is true.',
    exampleId: 'Nilai p-value uji ANOVA tercatat 0,008 (< 0,05), sehingga H0 ditolak dan terdapat pengaruh nyata perlakuan konsentrasi.',
    exampleEn: 'The ANOVA p-value yielded 0.008 (< 0.05), rejecting H0 and confirming a statistically significant concentration effect.',
  },
  {
    id: 'g-7',
    term: 'Triplo (Triplicate)',
    category: 'Metodologi',
    definitionId: 'Pengulangan prosedur pengukuran sebanyak tiga kali secara independen untuk memastikan presisi, akurasi, dan menghitung standar deviasi.',
    definitionEn: 'Repeating an experimental trial three independent times to calculate standard deviation and error bars.',
    exampleId: 'Setiap formulasi bioplastik dicetak dan diuji secara triplo agar data eksperimen diakui valid oleh dewan juri.',
    exampleEn: 'Each bio-film formulation was cast and characterized in triplicate to satisfy rigorous jury standards.',
  },
  {
    id: 'g-8',
    term: 'Plasticizer (Pemplastis)',
    category: 'Fisika & Kimia',
    definitionId: 'Zat aditif berbobot molekul rendah (seperti gliserol atau sorbitol) yang ditambahkan ke polimer untuk meningkatkan fleksibilitas dan mengurangi kerapuhan.',
    definitionEn: 'A low-molecular-weight additive (e.g. glycerol) added to a polymer matrix to boost ductility and inhibit brittleness.',
    exampleId: 'Gliserol berfungsi sebagai plasticizer yang menyusup ke rantai amilosa singkong agar lembaran plastik lentur.',
    exampleEn: 'Glycerol functions as a plasticizer intercalating between amylose chains to prevent film brittle cracking.',
  },
];

export const ScientificGlossary: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = GLOSSARY_TERMS.filter((term) => {
    const matchesCat = activeCategory === 'all' || term.category === activeCategory;
    const matchesSearch =
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.definitionId.toLowerCase().includes(search.toLowerCase()) ||
      term.definitionEn.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Glosarium & Terminologi Ilmiah' : 'Scientific Glossary'}
            </span>
            <span>·</span>
            <span>{language === 'id' ? 'Audio Pengucapan & Penjelasan Dwibahasa' : 'Bilingual Definitions with Audio Narration'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Glosarium Istilah & Konsep Riset' : 'Scientific Glossary & Concepts'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Pahami istilah teknis biologi, metodologi, kimia, dan ekonomi secara mendalam lengkap dengan pelafalan suara narator AI.'
              : 'Master key research terminology across biology, methodology, chemistry, and economics with AI speech narration.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder={language === 'id' ? 'Cari istilah ilmiah...' : 'Search term...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
        {[
          { id: 'all', label: 'Semua Bidang' },
          { id: 'Metodologi', label: 'Metodologi Riset' },
          { id: 'Biologi & Hayati', label: 'Hayati & Lingkungan' },
          { id: 'Fisika & Kimia', label: 'Kimia & Material' },
          { id: 'Ekonomi & Finansial', label: 'Ekonomi & Pasar' },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                  {item.category}
                </span>

                <AudioSpeechPlayer
                  text={`${item.term}. Definisi: ${language === 'id' ? item.definitionId : item.definitionEn}. Contoh penggunaan: ${language === 'id' ? item.exampleId : item.exampleEn}`}
                  size="sm"
                  label={language === 'id' ? 'Dengarkan' : 'Listen'}
                />
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-2">{item.term}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {language === 'id' ? item.definitionId : item.definitionEn}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 italic">
              <strong>{language === 'id' ? 'Contoh dalam KTI:' : 'Paper Example:'}</strong> "
              {language === 'id' ? item.exampleId : item.exampleEn}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
