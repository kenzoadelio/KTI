import React, { useState } from 'react';
import {
  BarChart3,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { StatisticalGuideItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

const STATISTICAL_TESTS: StatisticalGuideItem[] = [
  {
    id: 'anova_oneway',
    name: 'One-Way ANOVA (Analisis Variansi Satu Arah)',
    nameEn: 'One-Way ANOVA',
    goal: 'Membandingkan rata-rata lebih dari 2 kelompok perlakuan (misal: konsentrasi 0%, 2%, 4%, 6%).',
    goalEn: 'Compare means across >2 experimental treatment groups (e.g. 0%, 2%, 4%, 6%).',
    variableType: 'Variabel Bebas: Kategori (>2 kelompok). Variabel Terikat: Numerik kontinu (Rasio/Interval).',
    assumptions: [
      'Data berdistribusi normal (Uji Shapiro-Wilk atau Kolmogorov-Smirnov p > 0,05).',
      'Varian antar kelompok homogen (Uji Levene p > 0,05).',
      'Pengamatan antar sampel bersifat independen.',
    ],
    assumptionsEn: [
      'Data normally distributed (Shapiro-Wilk or KS test p > 0.05).',
      'Homogeneity of variances (Levene test p > 0.05).',
      'Independent sampling.',
    ],
    exampleCase: 'Menguji apakah terdapat perbedaan signifikan kuat tarik bioplastik pada penambahan minyak atsiri 0%, 2%, 4%, dan 6%.',
    exampleCaseEn: 'Testing whether tensile strength differs significantly across 0%, 2%, 4%, and 6% essential oil additives.',
    recommendedSoftware: 'SPSS (Analyze > Compare Means > One-Way ANOVA) atau RStudio aov()',
  },
  {
    id: 'paired_ttest',
    name: 'Paired Samples t-Test (Uji-t Berpasangan)',
    nameEn: 'Paired Samples t-Test',
    goal: 'Membandingkan rata-rata dari 1 kelompok yang diukur 2 kali (Pre-test vs. Post-test).',
    goalEn: 'Compare means from the same subject measured before and after treatment (Pre vs Post).',
    variableType: 'Satu kelompok subjek yang sama dengan 2 titik waktu pengukuran kontinu.',
    assumptions: [
      'Selisih skor (post - pre) berdistribusi normal.',
      'Data berskala interval atau rasio.',
    ],
    assumptionsEn: [
      'Differences between pairs normally distributed.',
      'Continuous interval/ratio scale.',
    ],
    exampleCase: 'Mengukur efektivitas media pembelajaran gamifikasi terhadap nilai tes fisika sebelum dan sesudah intervensi.',
    exampleCaseEn: 'Evaluating test score improvement before and after applying a gamified physics simulation module.',
    recommendedSoftware: 'SPSS (Analyze > Compare Means > Paired-Samples T Test)',
  },
  {
    id: 'independent_ttest',
    name: 'Independent Samples t-Test (Uji-t Dua Sampel Bebas)',
    nameEn: 'Independent Samples t-Test',
    goal: 'Membandingkan rata-rata antara 2 kelompok subjek yang berbeda (Kelompok Eksperimen vs. Kontrol).',
    goalEn: 'Compare means between 2 independent groups (Treatment vs Control).',
    variableType: 'Variabel Bebas: 2 Kategori (Kontrol & Eksperimen). Variabel Terikat: Numerik kontinu.',
    assumptions: [
      'Data masing-masing kelompok berdistribusi normal.',
      'Homogenitas varians terpenuhi (Levene test).',
    ],
    assumptionsEn: [
      'Normality in each separate group.',
      'Equal variances assumed or Welch correction applied.',
    ],
    exampleCase: 'Membandingkan laju penguraian bioplastik singkong dibanding plastik komersial oxo-biodegradable.',
    exampleCaseEn: 'Comparing degradation rates of cassava bioplastics versus commercial oxo-degradable polymers.',
    recommendedSoftware: 'SPSS (Analyze > Compare Means > Independent-Samples T Test)',
  },
  {
    id: 'linear_regression',
    name: 'Regresi Linier Sederhana & Berganda',
    nameEn: 'Linear Regression Analysis',
    goal: 'Menguji pengaruh dan memprediksi seberapa besar kontribusi variabel bebas (X) terhadap variabel terikat (Y).',
    goalEn: 'Determine the statistical influence and predictive weight of independent predictor(s) on dependent outcome.',
    variableType: 'Variabel Bebas (X) dan Variabel Terikat (Y) berskala kuantitatif interval/rasio.',
    assumptions: [
      'Uji Linieritas hubungan X dan Y.',
      'Uji Multikolinearitas (VIF < 10) pada regresi berganda.',
      'Uji Heteroskedastisitas (Glejser / Scatterplot).',
      'Normalitas residual.',
    ],
    assumptionsEn: [
      'Linear relationship between predictors and outcome.',
      'No multicollinearity (VIF < 10).',
      'Homoscedasticity and normality of residuals.',
    ],
    exampleCase: 'Menganalisis pengaruh fluktuasi IHSG dan kurs USD/IDR terhadap tingkat inflasi bulanan Indonesia.',
    exampleCaseEn: 'Analyzing the predictive impact of IDX composite movements and USD/IDR exchange rates on monthly inflation.',
    recommendedSoftware: 'SPSS (Analyze > Regression > Linear) atau EViews / Python statsmodels',
  },
  {
    id: 'chi_square',
    name: 'Chi-Square Test of Independence (Uji Chi-Kuadrat)',
    nameEn: 'Chi-Square Test',
    goal: 'Menguji hubungan asosiasi antara 2 variabel kategorik / kualitatif.',
    goalEn: 'Examine association or independence between 2 categorical variables.',
    variableType: 'Kedua variabel berupa data kategorik nominal atau ordinal (tabel kontingensi 2x2 atau RxC).',
    assumptions: [
      'Tidak ada sel dengan nilai frekuensi harapan (expected count) kurang dari 5 melebihi 20% sel.',
      'Sampel independen.',
    ],
    assumptionsEn: [
      'No expected cell frequency less than 5 exceeds 20% of cells.',
      'Mutually exclusive independent observations.',
    ],
    exampleCase: 'Mengetahui apakah terdapat hubungan antara preferensi pemilihan jurusan IPA/IPS dengan tingkat literasi sains siswa.',
    exampleCaseEn: 'Investigating if high school science stream preference is statistically associated with student scientific literacy tier.',
    recommendedSoftware: 'SPSS (Analyze > Descriptive Statistics > Crosstabs > Statistics: Chi-square)',
  },
];

export const StatisticalSelector: React.FC = () => {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('anova_oneway');
  const [copied, setCopied] = useState(false);

  const activeTest = STATISTICAL_TESTS.find((t) => t.id === selectedId) || STATISTICAL_TESTS[0];

  const handleCopyGuide = () => {
    const text = `[Panduan Uji Statistik: ${activeTest.name}]\nTujuan: ${activeTest.goal}\nTipe Variabel: ${activeTest.variableType}\nAsumsi Uji:\n${activeTest.assumptions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\nContoh Kasus: ${activeTest.exampleCase}\nSoftware: ${activeTest.recommendedSoftware}`;
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
              {language === 'id' ? 'Analisis Data Kuantitatif' : 'Quantitative Data Analysis'}
            </span>
            <span>·</span>
            <span>{language === 'id' ? 'Panduan Memilih Uji Hipotesis' : 'Hypothesis Testing Selector'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Pemilih Uji Statistik & Hipotesis Riset' : 'Statistical Test & Hypothesis Selector'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Tentukan uji statistik yang valid untuk mengolah data eksperimen atau kuesioner Anda agar tidak salah saat sidang KTI.'
              : 'Select mathematically valid statistical tests for your experiments or surveys to satisfy scientific scrutiny.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyGuide}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
          <span>{copied ? 'Tersalin' : 'Salin Panduan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Tests */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pilihan Metode Uji Statistik:
          </span>
          {STATISTICAL_TESTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedId === item.id
                  ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-800'
              }`}
            >
              <div>
                <h5 className="text-xs font-bold">{item.name}</h5>
                <span
                  className={`text-[10px] block mt-0.5 line-clamp-1 ${
                    selectedId === item.id ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {item.goal}
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 ${
                  selectedId === item.id ? 'text-blue-400' : 'text-slate-400'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Rekomendasi Analisis
            </span>
            <h4 className="text-lg font-bold text-slate-900 mt-1">{activeTest.name}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{activeTest.goal}</p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <span className="font-bold text-slate-800 block mb-1">Syarat Tipe Skala Data & Variabel:</span>
              <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                {activeTest.variableType}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Uji Asumsi Klasik yang Wajib Dipenuhi:</span>
              <div className="space-y-1">
                {activeTest.assumptions.map((as, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{as}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Contoh Kasus Penerapan pada KTI Siswa:</span>
              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 italic">
                "{activeTest.exampleCase}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span><strong>Menu Software:</strong> {activeTest.recommendedSoftware}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
