import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  BarChart,
  FileCheck,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MethodologyWizard: React.FC<{
  onInsertToBab3?: (methodologyText: string) => void;
}> = ({ onInsertToBab3 }) => {
  const { language } = useLanguage();

  const [field, setField] = useState<'ipa' | 'ips' | 'rekayasa' | 'ekonomi'>('ipa');
  const [approach, setApproach] = useState<'eksperimen_ral' | 'eksperimen_rak' | 'survei_kuantitatif' | 'kualitatif_studi_kasus' | 'rnd_addie'>('eksperimen_ral');
  const [sampleType, setSampleType] = useState('purposive');
  const [copied, setCopied] = useState(false);

  const methodologyPresets = {
    eksperimen_ral: {
      name: language === 'id' ? 'Eksperimental Laboratorium - Rancangan Acak Lengkap (RAL)' : 'Experimental Lab - Completely Randomized Design (CRD/RAL)',
      description: language === 'id'
        ? 'Cocok untuk eksperimen laboratorium dengan kondisi homogen (suhu, kelembapan, dan wadah terkontrol).'
        : 'Ideal for homogeneous laboratory experiments (controlled temperature, humidity, and vessels).',
      formula: 'Yij = μ + τi + εij',
      steps: [
        language === 'id' ? 'Penyiapan bahan baku dan sterilisasi alat ukur' : 'Preparation of raw materials and tool sterilization',
        language === 'id' ? 'Pembuatan perlakuan kontrol (0%) dan variasi konsentrasi (contoh: 2%, 4%, 6%)' : 'Formulation of control (0%) and concentration variations (e.g. 2%, 4%, 6%)',
        language === 'id' ? 'Pengulangan sebanyak 3 kali (triplo) untuk memastikan reliabilitas data' : '3-fold replication (triplo) to guarantee data reliability',
        language === 'id' ? 'Pengukuran parameter respon (kuat tarik, biodegradasi, zona hambat)' : 'Measurement of response parameters (tensile strength, biodegradation, inhibition zone)',
        language === 'id' ? 'Uji normalitas Shapiro-Wilk dan Analisis Variansi (ANOVA Satu Arah)' : 'Shapiro-Wilk normality test and One-Way ANOVA',
      ],
      suggestedSoftware: 'SPSS, RStudio, GraphPad Prism',
    },
    eksperimen_rak: {
      name: language === 'id' ? 'Eksperimental Lapangan - Rancangan Acak Kelompok (RAK)' : 'Field Experimental - Randomized Complete Block Design (RCBD/RAK)',
      description: language === 'id'
        ? 'Cocok untuk penelitian lahan terbuka atau subjek biologis dengan faktor variasi lingkungan (cahaya, blok lahan).'
        : 'Ideal for field or agronomic trials with environmental gradients (shade, slope, blocking factor).',
      formula: 'Yij = μ + τi + βj + εij',
      steps: [
        language === 'id' ? 'Pembagian petak/blok perlakuan berdasarkan tingkat kesuburan/gradien' : 'Partitioning plots/blocks based on soil fertility gradients',
        language === 'id' ? 'Pengacakan penempatan varietas dalam masing-masing kelompok blok' : 'Randomization within each blocking group',
        language === 'id' ? 'Pemberian dosis harian secara terjadwal' : 'Scheduled application of dosage treatments',
        language === 'id' ? 'Pencatatan data mingguan (tinggi tanaman, bobot basah, biomassa)' : 'Weekly record of plant height, fresh weight, and biomass',
        language === 'id' ? 'Uji Lanjut DMRT (Duncan Multiple Range Test) jika ANOVA signifikan' : 'Post-hoc DMRT (Duncan Multiple Range Test) if ANOVA is significant',
      ],
      suggestedSoftware: 'SPSS, SAS, Minitab',
    },
    survei_kuantitatif: {
      name: language === 'id' ? 'Deskriptif Kuantitatif & Korelasional (Survei)' : 'Quantitative Descriptive & Correlational Survey',
      description: language === 'id'
        ? 'Mengukur pengaruh atau korelasi antara variabel bebas (X) terhadap variabel terikat (Y) pada populasi responden.'
        : 'Measures causal impact or correlation between Independent Variable (X) and Dependent Variable (Y).',
      formula: 'Y = α + βX + e',
      steps: [
        language === 'id' ? 'Penentuan populasi target dan perhitungan sampel rumus Slovin (e = 5%)' : 'Target population specification and Slovin sample size calculation (e = 5%)',
        language === 'id' ? 'Penyusunan instrumen kuesioner skala Likert 1-5' : 'Design of 5-point Likert scale questionnaire',
        language === 'id' ? 'Uji validitas Pearson Product Moment dan Reliabilitas Cronbach Alpha (> 0,70)' : 'Pearson Product Moment validity & Cronbach Alpha reliability (> 0.70)',
        language === 'id' ? 'Penyebaran instrumen daring/luring kepada responden' : 'Distribution of survey questionnaires to respondents',
        language === 'id' ? 'Analisis Regresi Linier dan Uji Hipotesis t-hitung vs t-tabel' : 'Linear Regression analysis and t-test hypothesis evaluation',
      ],
      suggestedSoftware: 'SPSS, SmartPLS, JASP',
    },
    kualitatif_studi_kasus: {
      name: language === 'id' ? 'Kualitatif Deskriptif & Studi Kasus' : 'Qualitative Case Study & Phenomenology',
      description: language === 'id'
        ? 'Eksplorasi mendalam mengenai fenomena sosial, budaya lokal, kearifan lokal, atau kebijakan institusi.'
        : 'In-depth exploration of social phenomena, local cultural wisdom, or institutional policies.',
      formula: 'Triangulasi Sumber & Metode',
      steps: [
        language === 'id' ? 'Penetapan informan kunci (key informants) dengan teknik Purposive Sampling' : 'Selection of key informants via Purposive Sampling',
        language === 'id' ? 'Wawancara mendalam (in-depth interview) berpedoman semi-terstruktur' : 'Semi-structured in-depth interviews',
        language === 'id' ? 'Observasi partisipatif dan studi dokumentasi arsip resmi' : 'Participant observation and archival documentation',
        language === 'id' ? 'Triangulasi data untuk menguji kredibilitas (keabsahan data)' : 'Data triangulation for credibility and trustworthiness',
        language === 'id' ? 'Reduksi data, penyajian data, dan penarikan kesimpulan tematik' : 'Data reduction, thematic display, and conclusion drafting',
      ],
      suggestedSoftware: 'NVivo, ATLAS.ti, MAXQDA',
    },
    rnd_addie: {
      name: language === 'id' ? 'Research and Development (R&D) Model ADDIE' : 'Research & Development (R&D) ADDIE Framework',
      description: language === 'id'
        ? 'Pengembangan produk media pembelajaran, instrumen alat, aplikasi, atau modul terstandarisasi.'
        : 'Product engineering, educational media, hardware prototypes, or standardized learning modules.',
      formula: 'Analysis - Design - Development - Implementation - Evaluation',
      steps: [
        language === 'id' ? 'Analysis: Analisis kebutuhan lapangan dan karakteristik pengguna' : 'Analysis: Field needs assessment and user characteristics',
        language === 'id' ? 'Design: Pembuatan storyboard, skema rangkaian, dan blueprint produk' : 'Design: Storyboarding, circuit schematic, and product blueprint',
        language === 'id' ? 'Development: Pembuatan prototipe dan validasi ahli materi & media' : 'Development: Prototype fabrication and expert validation scoring',
        language === 'id' ? 'Implementation: Uji coba skala kecil dan skala luas' : 'Implementation: Small-scale and field user trials',
        language === 'id' ? 'Evaluation: Uji kepraktisan (N-Gain Score) dan efektivitas produk' : 'Evaluation: Practicality assessment and N-Gain Score calculation',
      ],
      suggestedSoftware: 'Excel, Figma, Tinkercad, JASP',
    },
  };

  const selectedPreset = methodologyPresets[approach];

  const generatedMethodologyText = `[Bab III: Metodologi Penelitian]\n1. Pendekatan dan Jenis Penelitian:\nPenelitian ini menggunakan pendekatan ${selectedPreset.name}. ${selectedPreset.description}\n\n2. Desain dan Model:\n${selectedPreset.formula}\n\n3. Tahapan Operasional:\n${selectedPreset.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n4. Teknik Pengambilan Sampel:\nTeknik sampling yang digunakan adalah ${sampleType === 'purposive' ? 'Purposive Sampling berdasarkan kriteria inklusi dan eksklusi' : 'Simple Random Sampling dengan probabilitas setara'}.\n\n5. Perangkat Lunak Analisis:\nData diolah menggunakan ${selectedPreset.suggestedSoftware}.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMethodologyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onInsertToBab3) {
      onInsertToBab3(generatedMethodologyText);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">
              {language === 'id' ? 'Rancang Bangun Riset' : 'Research Design'}
            </span>
            <span>·</span>
            <span>Standar Metodologi OPSI & LKIR BRIN</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600" />
            <span>{language === 'id' ? 'Panduan & Generator Metodologi Penelitian' : 'Research Methodology Wizard'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {language === 'id'
              ? 'Pilih desain eksperimen atau kualitatif yang tepat, dapatkan tahapan operasional riset, dan salin langsung ke Bab III.'
              : 'Select the optimal research design, obtain step-by-step procedures, and insert directly into Chapter 3.'}
          </p>
        </div>
      </div>

      {/* Select Field and Approach */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {language === 'id' ? '1. Bidang Keilmuan Penelitian' : '1. Scientific Discipline'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ipa', label: 'IPA / Hayati / Kimia' },
              { id: 'ips', label: 'Sosial & Humaniora' },
              { id: 'rekayasa', label: 'Teknologi & Rekayasa' },
              { id: 'ekonomi', label: 'Ekonomi & Akuntansi' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setField(f.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                  field === f.id
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            {language === 'id' ? '2. Desain & Pendekatan Penelitian' : '2. Research Design & Approach'}
          </label>
          <select
            value={approach}
            onChange={(e) => setApproach(e.target.value as any)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="eksperimen_ral">Eksperimen Lab: RAL (Rancangan Acak Lengkap)</option>
            <option value="eksperimen_rak">Eksperimen Lapangan: RAK (Rancangan Acak Kelompok)</option>
            <option value="survei_kuantitatif">Kuantitatif: Survei & Analisis Regresi</option>
            <option value="kualitatif_studi_kasus">Kualitatif: Studi Kasus & Triangulasi</option>
            <option value="rnd_addie">R&D: Model Pengembangan ADDIE</option>
          </select>
        </div>
      </div>

      {/* Selected Approach Blueprint Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              Rancangan Terpilih
            </span>
            <h4 className="text-base font-bold text-slate-900 mt-1">{selectedPreset.name}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{selectedPreset.description}</p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            <span>{copied ? 'Tersalin ke Bab 3!' : 'Salin Naskah Bab 3'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-700 block">
            {language === 'id' ? 'Tahapan Prosedur Kerja Riset:' : 'Standard Research Procedures:'}
          </span>
          <div className="space-y-1.5">
            {selectedPreset.steps.map((st, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-slate-200/60">
          <span>
            <strong>Model:</strong> <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{selectedPreset.formula}</code>
          </span>
          <span>·</span>
          <span>
            <strong>Software Disarankan:</strong> {selectedPreset.suggestedSoftware}
          </span>
        </div>
      </div>
    </div>
  );
};
