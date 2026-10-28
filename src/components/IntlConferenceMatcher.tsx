import React, { useState } from 'react';
import {
  Globe,
  Award,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Bookmark,
  FileCheck,
  DollarSign,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface IntlVenue {
  id: string;
  name: string;
  organizer: string;
  location: string;
  field: 'Sains & Material' | 'Teknologi & IoT' | 'Ekonomi & Sosial' | 'Lingkungan & Energi';
  level: 'SMA/K' | 'Mahasiswa (S1)' | 'Semua Jenjang';
  deadline: string;
  conferenceDate: string;
  indexing: string;
  apc: 'Gratis (Waiver Siswa)' | 'Didanai Penuh' | 'Biaya Terjangkau ($50)';
  wordLimit: string;
  formatStyle: string;
  acceptanceRate: string;
  description: string;
  eligibilityChecklist: string[];
}

const VENUES_DATABASE: IntlVenue[] = [
  {
    id: 'venue-isef',
    name: 'Regeneron International Science and Engineering Fair (ISEF)',
    organizer: 'Society for Science · Washington D.C., USA',
    location: 'Amerika Serikat (Rotasi Global)',
    field: 'Sains & Material',
    level: 'SMA/K',
    deadline: '15 Februari 2027',
    conferenceDate: '10–15 Mei 2027',
    indexing: 'Kompetisi Sains Terbesar Dunia (Puspresnas / BRIN Afiliasi)',
    apc: 'Didanai Penuh',
    wordLimit: 'Abstrak 250 kata, Naskah 20 Halaman (Format ISEF)',
    formatStyle: 'Standar Regeneron ISEF SRC / IRB Ethics Form',
    acceptanceRate: '~3% (Finalis Delegasi Nasional)',
    description: 'Ajang olimpiade riset sains dan teknik tingkat internasional paling bergengsi di dunia bagi siswa SMA/SMK dengan total hadiah dan beasiswa lebih dari $9 Juta USD.',
    eligibilityChecklist: [
      'Siswa aktif SMA/SMK sederajat berusia di bawah 20 tahun',
      'Pemenang atau finalis seleksi nasional OPSI Kemendikdasmen atau LKIR BRIN',
      'Memenuhi etika riset SRC (Scientific Review Committee) & Form Keselamatan Lab',
    ],
  },
  {
    id: 'venue-icys',
    name: 'International Conference of Young Scientists (ICYS)',
    organizer: 'International ICYS Steering Committee',
    location: 'Eropa / Turki (Hybrid)',
    field: 'Sains & Material',
    level: 'SMA/K',
    deadline: '20 Januari 2027',
    conferenceDate: '18–24 April 2027',
    indexing: 'Prosiding Konferensi Ilmiah Remaja Internasional Terindeks',
    apc: 'Gratis (Waiver Siswa)',
    wordLimit: 'Extended Abstract 1.000 kata + Poster Ilmiah',
    formatStyle: 'Format ICYS Oral Presentation & Full Poster Paper',
    acceptanceRate: '~12%',
    description: 'Konferensi tahunan kompetisi penelitian perorangan atau tim kecil pelajar sekolah menengah dunia dalam kategori Fisika Terapan, Kimia Terapan, Ilmu Hayati, dan Ilmu Lingkungan.',
    eligibilityChecklist: [
      'Kategori perorangan atau tim maksimal 2 siswa',
      'Presentasi oral 100% dalam Bahasa Inggris akademik',
      'Data eksperimental primer orisinal',
    ],
  },
  {
    id: 'venue-ieee-youth',
    name: 'IEEE Global Youth & Student Conference on Applied Technology',
    organizer: 'IEEE Region 10 (Asia-Pacific)',
    location: 'Singapura / Virtual Hybrid',
    field: 'Teknologi & IoT',
    level: 'Semua Jenjang',
    deadline: '10 Desember 2026',
    conferenceDate: '12–14 Maret 2027',
    indexing: 'IEEE Xplore Digital Library & Scopus Indexed',
    apc: 'Biaya Terjangkau ($50)',
    wordLimit: '4–6 Halaman Full Paper (IEEE 2-Column Template)',
    formatStyle: 'IEEE Standard Two-Column Conference Template',
    acceptanceRate: '~28%',
    description: 'Konferensi teknologi komputasi, IoT, dan elektronika bagi peneliti muda di kawasan Asia-Pasifik. Naskah yang diterima akan terindeks di IEEE Xplore dan database Scopus.',
    eligibilityChecklist: [
      'Naskah format 2 kolom IEEE LaTeX / Word',
      'Tingkat kesamaan plagiarisme di bawah 15%',
      'Melampirkan diagram skematik dan data pengujian perangkat',
    ],
  },
  {
    id: 'venue-scopus-env',
    name: 'Journal of Sustainable Material & Green Chemistry (Scopus Q2)',
    organizer: 'Elsevier / International Green Sciences Press',
    location: 'Amsterdam, Belanda (Online Open Access)',
    field: 'Lingkungan & Energi',
    level: 'Semua Jenjang',
    deadline: '30 November 2026',
    conferenceDate: 'Terbit Reguler Setiap Triwulan',
    indexing: 'Scopus Q2 · SJR 0.68 · Web of Science (ESCI)',
    apc: 'Gratis (Waiver Siswa)',
    wordLimit: '5.000–7.000 kata (Full Research Article)',
    formatStyle: 'Elsevier Single Column Article Template (Harvard/APA)',
    acceptanceRate: '~19%',
    description: 'Jurnal ilmiah internasional bereputasi tinggi yang mempublikasikan inovasi bioplastik, polimer alami, ekonomi sirkular, dan material hijau berkelanjutan.',
    eligibilityChecklist: [
      'Menyertakan Graphical Abstract resolusi tinggi',
      'Uji replikasi triplo dengan signifikansi statistik p < 0.05',
      'Surat pernyataan orisinalitas bebas konflik kepentingan',
    ],
  },
  {
    id: 'venue-asean-econ',
    name: 'ASEAN Youth Economic & Social Development Summit',
    organizer: 'ASEAN Secretariat & ERIA Research Institute',
    location: 'Kuala Lumpur, Malaysia',
    field: 'Ekonomi & Sosial',
    level: 'Semua Jenjang',
    deadline: '05 Januari 2027',
    conferenceDate: '22–24 Februari 2027',
    indexing: 'Prosiding Resmi ASEAN Secretariat & Policy Brief',
    apc: 'Didanai Penuh',
    wordLimit: '3.500 kata Policy Research Paper',
    formatStyle: 'Policy Paper Format & Chicago Manual of Style',
    acceptanceRate: '~8% (Delegasi Asia Tenggara)',
    description: 'Simposium riset kebijakan moneter, pasar modal, dan pemberdayaan ekonomi sirkular bagi delegasi muda berprestasi di kawasan ASEAN.',
    eligibilityChecklist: [
      'Warga negara anggota ASEAN berusia 15-25 tahun',
      'Analisis berbasis data sekunder terverifikasi (IHSG, FX, atau BPS)',
      'Memberikan rekomendasi kebijakan praktis bagi otoritas moneter',
    ],
  },
];

export const IntlConferenceMatcher: React.FC = () => {
  const { language } = useLanguage();
  const [selectedField, setSelectedField] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<IntlVenue | null>(null);

  const filteredVenues = VENUES_DATABASE.filter((v) => {
    const matchField = selectedField === 'All' || v.field === selectedField;
    const matchSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchField && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-4 h-4 text-blue-300" />
            {language === 'id' ? 'Target Konferensi & Jurnal Internasional' : 'Global Conference & Scopus Matcher'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            {language === 'id' ? 'Tembus Panggung Riset & Jurnal Dunia' : 'Target Premier Global Venues & Scopus'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {language === 'id'
              ? 'Temukan konferensi bergengsi (Regeneron ISEF, ICYS, IEEE) dan jurnal internasional bereputasi (Scopus Q1/Q2) yang cocok dengan topik riset Anda, lengkap dengan info beasiswa biaya naskah (APC Waiver).'
              : 'Match your research with top international competitions, IEEE conferences, and Scopus journals with full student waiver info.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verifikasi Indeks Resmi Scopus & IEEE</span>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-300" />
              <span>Info Pembebasan Biaya (Student Waiver)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama konferensi, organizer, atau kata kunci (misal: ISEF, Scopus, IEEE)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Bidang:</span>
            {['All', 'Sains & Material', 'Teknologi & IoT', 'Ekonomi & Sosial', 'Lingkungan & Energi'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedField === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'All' ? 'Semua Bidang' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 uppercase tracking-wider">
                  {venue.field}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {venue.apc}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {venue.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {venue.organizer} · {venue.location}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {venue.description}
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Indeksasi:</span>
                  <strong className="text-indigo-600">{venue.indexing}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Format Naskah:</span>
                  <span className="font-mono text-[11px]">{venue.formatStyle}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Acceptance Rate:</span>
                  <strong className="text-slate-800">{venue.acceptanceRate}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Tenggat: {venue.deadline}</span>
              </div>

              <button
                onClick={() => setSelectedVenue(venue)}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Cek Syarat & Format</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Venue Details & Eligibility */}
      {selectedVenue && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {selectedVenue.field} · {selectedVenue.level}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedVenue.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVenue(null)}
                className="text-xs text-slate-400 hover:text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">Petunjuk Format Naskah:</div>
                <p className="text-slate-600 leading-relaxed">{selectedVenue.wordLimit}</p>
                <div className="font-mono text-[11px] text-blue-700 font-semibold">{selectedVenue.formatStyle}</div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">Daftar Kriteria Kelayakan (Checklist):</div>
                <div className="space-y-1.5">
                  {selectedVenue.eligibilityChecklist.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  alert(`Template naskah ${selectedVenue.name} telah siap. Gunakan tab 'Translator & LaTeX IEEE' untuk mengekspor naskah Anda.`);
                  setSelectedVenue(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Gunakan Template Ini Untuk Naskah Saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
