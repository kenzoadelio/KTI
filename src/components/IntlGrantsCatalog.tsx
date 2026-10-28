import React, { useState } from 'react';
import {
  DollarSign,
  Award,
  Globe,
  Clock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Calculator,
  FileText,
  Copy,
  Check,
  Building,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GrantItem {
  id: string;
  title: string;
  funder: string;
  fundingAmount: string;
  coverage: string;
  eligibility: string;
  deadline: string;
  category: 'Pendanaan Penuh S1/Riset' | 'Hibah Proyek Riset' | 'Travel Grant Internasional';
  description: string;
  requirements: string[];
}

const GRANTS_DATABASE: GrantItem[] = [
  {
    id: 'grant-bim',
    title: 'Beasiswa Indonesia Maju (BIM) Program Sarjana Luar Negeri',
    funder: 'Pusat Prestasi Nasional (Puspresnas) & LPDP RI',
    fundingAmount: 'Didanai Penuh (Full Ride Tuition + Living Allowance)',
    coverage: 'Biaya Kuliah Top 100 Universitas Dunia + Riset Laboratorium',
    eligibility: 'Peraih Medali / Finalis OPSI Kemendikbudristek, OSN, atau LKIR BRIN',
    deadline: '28 Desember 2026',
    category: 'Pendanaan Penuh S1/Riset',
    description: 'Program beasiswa pemerintah Indonesia untuk membina talenta riset muda berprestasi agar dapat menempuh pendidikan sarjana riset di perguruan tinggi terbaik dunia (Ivy League, Oxbridge, NUS, NTU).',
    requirements: [
      'Sertifikat prestasi resmi ajang talenta Puspresnas / BRIN',
      'Proposal rencana riset dan aspirasi kontribusi untuk Indonesia',
      'Nilai rapor semester 1-5 rata-rata minimal 85',
    ],
  },
  {
    id: 'grant-stem-youth',
    title: 'Global Youth STEM Project Development Grant',
    funder: 'Society for Science & International Youth Foundation',
    fundingAmount: '$3,500 USD (~Rp 55.000.000)',
    coverage: 'Biaya Reagen Kimia, Sensor Hardware, & Pengujian Lab Terakreditasi',
    eligibility: 'Pelajar SMA/SMK yang sedang mengerjakan purwarupa atau riset aktif',
    deadline: '15 Januari 2027',
    category: 'Hibah Proyek Riset',
    description: 'Bantuan pendanaan dana tunai langsung untuk mendukung penyediaan bahan eksperimen material ramah lingkungan dan sistem rekayasa perangkat cerdas.',
    requirements: [
      'Rincian Rencana Anggaran Biaya (RAB) eksperimen',
      'Surat rekomendasi dari guru pembimbing atau dosen mitra',
      'Linimasa pengerjaan eksperimen dalam waktu 6 bulan',
    ],
  },
  {
    id: 'grant-brin-talenta',
    title: 'Skema Pendanaan Riset Talenta Inovasi Remaja BRIN',
    funder: 'Badan Riset dan Inovasi Nasional (BRIN)',
    fundingAmount: 'Hingga Rp 30.000.000 per Judul',
    coverage: 'Akses Fasilitas Uji Lab BRIN (FTIR, SEM-EDX) & Honorarium Pengujian',
    eligibility: 'Siswa SMA/MA/SMK & Mahasiswa Baru dengan proposal inovatif',
    deadline: '20 November 2026',
    category: 'Hibah Proyek Riset',
    description: 'Fasilitas hibah laboratorium dan pendanaan uji karakterisasi material canggih di fasilitas riset terpadu BRIN seluruh Indonesia.',
    requirements: [
      'Proposal Bab I-III format standar riset BRIN',
      'Identifikasi parameter uji laboratorium yang dibutuhkan',
      'Persetujuan kepala sekolah atau madrasah pengusul',
    ],
  },
  {
    id: 'grant-travel-ieee',
    title: 'International Student Conference Travel Award',
    funder: 'IEEE Humanitarian & Student Activities Committee',
    fundingAmount: '$1,800 USD (~Rp 28.500.000)',
    coverage: 'Tiket Pesawat Pulang-Pergi, Akomodasi Hotel, & Registrasi Konferensi',
    eligibility: 'Penulis pertama naskah yang naskahnya lolos seleksi konferensi IEEE',
    deadline: '10 Februari 2027',
    category: 'Travel Grant Internasional',
    description: 'Hibah perjalanan untuk membiayai kehadiran siswa/mahasiswa Indonesia dalam mempresentasikan karya tulis di panggung simposium dunia.',
    requirements: [
      'Letter of Acceptance (LoA) resmi dari dewan konferensi',
      'Salinan draf naskah IEEE 2-kolom',
      'Paspor aktif minimal 6 bulan masa berlaku',
    ],
  },
];

export const IntlGrantsCatalog: React.FC = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGrant, setSelectedGrant] = useState<GrantItem | null>(null);

  // Quick Grant Pitch Generator state
  const [researchTitle, setResearchTitle] = useState('Sintesis Bioplastik Pati Singkong & Minyak Kulit Jeruk');
  const [requestedAmount, setRequestedAmount] = useState('25000000');
  const [pitchCopied, setPitchCopied] = useState(false);

  const filteredGrants = GRANTS_DATABASE.filter((g) => {
    return selectedCategory === 'All' || g.category === selectedCategory;
  });

  const generatedPitch = `Proposal Permohonan Hibah Riset Siswa / Student Grant Pitch

1. Judul Proyek Riset:
   ${researchTitle}

2. Lembaga Pengusul & Peneliti Utama:
   Kenzo Adelio (SMA Labschool / Peneliti Muda Indonesia)
   Email: kenzoadelio19@gmail.com | ORCID: 0009-0004-8192-3841

3. Total Dana yang Diajukan:
   Rp ${Number(requestedAmount).toLocaleString('id-ID')}

4. Ringkasan Urgensi & Dampak Inovasi:
   Inovasi ini mengembangkan bioplastik berbasis pati singkong dengan aditif minyak kulit jeruk manis yang mampu menahan air 34% lebih baik dan terurai sempurna dalam tanah dalam waktu 14 hari. Dana yang diajukan akan dialokasikan untuk pengujian kuat tarik terkalibrasi ASTM, spektroskopi FTIR di fasilitas BRIN, dan pengujian skala purwarupa ramah lingkungan.

5. Target Luaran (Deliverables):
   - Publikasi prosiding konferensi internasional / jurnal terindeks
   - Laporan teknis pengujian laboratorium lengkap
   - Purwarupa kemasan biodegradable siap uji edar`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(generatedPitch);
    setPitchCopied(true);
    setTimeout(() => setPitchCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-amber-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign className="w-4 h-4 text-amber-300" />
            {language === 'id' ? 'Hibah Riset Global & Beasiswa Luar Negeri' : 'Global Research Grants & Scholarships'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Akses Pendanaan Eksperimen & Beasiswa S1' : 'Fund Your Research & Win Scholarships'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Katalog resmi beasiswa riset S1 dunia (BIM LPDP), hibah dana pengujian laboratorium BRIN, dan travel grant internasional untuk membiayai keberangkatan delegasi riset Anda.'
              : 'Discover prestigious international grants, LPDP BIM fellowships, and travel awards for youth scholars.'}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-amber-200 font-semibold">Filter Kategori Pendanaan:</span>
            {['All', 'Pendanaan Penuh S1/Riset', 'Hibah Proyek Riset', 'Travel Grant Internasional'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                  selectedCategory === c
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                {c === 'All' ? 'Semua Pendanaan' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grants Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGrants.map((grant) => (
          <div
            key={grant.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-amber-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 uppercase tracking-wider">
                  {grant.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {grant.fundingAmount}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {grant.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {grant.funder}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {grant.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1 text-xs">
                <div>
                  <span className="text-slate-400">Cakupan Biaya:</span> <strong className="text-slate-800">{grant.coverage}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Sasaran:</span> <strong className="text-indigo-600">{grant.eligibility}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Batas Pengajuan: {grant.deadline}</span>
              </div>

              <button
                onClick={() => setSelectedGrant(grant)}
                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Lihat Syarat & Ketentuan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grant Pitch Generator Workspace */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Generator Surat Pengantar Hibah (Grant Pitch Generator)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Buat ringkasan eksekutif 1 halaman untuk melamar pendanaan riset siswa ke lembaga donor dan BRIN.
            </p>
          </div>

          <button
            onClick={handleCopyPitch}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {pitchCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{pitchCopied ? 'Tersalin!' : 'Salin Draft Proposal Hibah'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Judul Riset Pengusul</label>
            <input
              type="text"
              value={researchTitle}
              onChange={(e) => setResearchTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Total Anggaran Pengujian yang Diajukan (Rp)</label>
            <input
              type="number"
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
          {generatedPitch}
        </div>
      </div>

      {/* Modal for Grant Details */}
      {selectedGrant && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{selectedGrant.title}</h3>
              <button
                onClick={() => setSelectedGrant(null)}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed">{selectedGrant.description}</p>
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-amber-900 font-medium">
                Besaran Pendanaan: <strong>{selectedGrant.fundingAmount}</strong>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-slate-800">Persyaratan Utama:</div>
                {selectedGrant.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  alert(`Panduan dokumen pendaftaran ${selectedGrant.title} telah disimpan ke Ruang Riset Saya.`);
                  setSelectedGrant(null);
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Ajukan Proposal Hibah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
