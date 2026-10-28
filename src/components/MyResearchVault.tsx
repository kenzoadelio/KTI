import React, { useState, useEffect } from 'react';
import {
  User,
  FlaskConical,
  BookOpen,
  Award,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  ShieldCheck,
  TrendingUp,
  Tag,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface LabEntry {
  id: string;
  date: string;
  title: string;
  category: 'Laboratorium Kimia' | 'Eksperimen Hayati' | 'Analisis Data SPSS' | 'Catatan Lapangan';
  variables: { name: string; value: string }[];
  observation: string;
  conclusion: string;
  status: 'Selesai' | 'Pengamatan Berjalan' | 'Perlu Uji Ulang';
}

interface ProjectTrack {
  id: string;
  title: string;
  category: string;
  targetVenue: string;
  progressPercent: number;
  stage: 'Draf Proposal' | 'Eksperimen Lab' | 'Analisis Data' | 'Review Naskah' | 'Siap Submit';
  deadline: string;
}

const DEFAULT_LAB_ENTRIES: LabEntry[] = [
  {
    id: 'lab-1',
    date: '24 Oktober 2026',
    title: 'Uji Kuat Tarik (Tensile Strength) Bioplastik Formulasi 4% Minyak Jeruk',
    category: 'Laboratorium Kimia',
    variables: [
      { name: 'Pati Singkong', value: '10 gram' },
      { name: 'Gliserol', value: '2.0 mL' },
      { name: 'Minyak Jeruk', value: '4% (v/w)' },
      { name: 'Suhu Pemanasan', value: '70°C selama 20 menit' },
    ],
    observation: 'Film plastik yang terbentuk sangat homogen, elastisitas meningkat signifikan dibandingkan kontrol 0%. Nilai kuat tarik rata-rata triplo mencapai 18.4 MPa (kontrol: 11.2 MPa). Permukaan lebih tahan air.',
    conclusion: 'Formulasi 4% minyak jeruk memenuhi hipotesis kerja sebagai agen hidrofobik tanpa merusak fleksibilitas polimer.',
    status: 'Selesai',
  },
  {
    id: 'lab-2',
    date: '20 Oktober 2026',
    title: 'Pengamatan Biodegradasi Tanah Hari ke-7 & Penimbangan Selisih Massa',
    category: 'Eksperimen Hayati',
    variables: [
      { name: 'Media Tanah', value: 'Kompos Organik Lembap (pH 6.8)' },
      { name: 'Kedalaman Kubur', value: '5 cm' },
      { name: 'Ukuran Sampel', value: '3 x 3 cm' },
    ],
    observation: 'Sampel bioplastik mulai mengalami fragmentasi dan keretakan struktural 62% pada hari ke-7. Koloni mikroba tanah tampak aktif mendegradasi matriks pati.',
    conclusion: 'Laju degradasi berjalan sesuai ekspektasi teoretis; diprediksi terurai >95% pada hari ke-14.',
    status: 'Pengamatan Berjalan',
  },
  {
    id: 'lab-3',
    date: '16 Oktober 2026',
    title: 'Estimasi Regresi VECM Pengaruh Kurs Rupiah terhadap IHSG (980 Observasi)',
    category: 'Analisis Data SPSS',
    variables: [
      { name: 'Model', value: 'Vector Error Correction Model' },
      { name: 'Lag Optimum', value: 'Lag 2 (AIC Min)' },
      { name: 'Signifikansi Kurs', value: 'p-value 0.0034 (< 0.01)' },
    ],
    observation: 'Hasil uji kointegrasi Johansen mengonfirmasi adanya hubungan keseimbangan jangka panjang antara depresiasi Rupiah dan koreksi IHSG.',
    conclusion: 'Data sekunder BEI dan BI valid untuk dimasukkan ke Bab IV naskah proposal ilmiah.',
    status: 'Selesai',
  },
];

const DEFAULT_PROJECTS: ProjectTrack[] = [
  {
    id: 'proj-1',
    title: 'Sintesis Bioplastik Pati Singkong & Limbah Kulit Jeruk Manis Ramah Lingkungan',
    category: 'Sains Lingkungan & Material',
    targetVenue: 'OPSI Kemendikbud & Regeneron ISEF 2026',
    progressPercent: 90,
    stage: 'Siap Submit',
    deadline: '15 November 2026',
  },
  {
    id: 'proj-2',
    title: 'Analisis Ekonometrika Volatilitas Nilai Tukar Rupiah Terhadap Pasar Modal BEI',
    category: 'Ilmu Ekonomi & Bisnis',
    targetVenue: 'LKIR BRIN 2026 & Jurnal Terindeks SINTA',
    progressPercent: 65,
    stage: 'Analisis Data',
    deadline: '28 Desember 2026',
  },
  {
    id: 'proj-3',
    title: 'Sistem Irigasi Cerdas Hemat Air Berbasis ESP32 & Algoritma Ambang Batas',
    category: 'Teknologi Rekayasa & IoT',
    targetVenue: 'MYRES Kemenag & International Young Scientists (ICYS)',
    progressPercent: 40,
    stage: 'Eksperimen Lab',
    deadline: '10 Februari 2027',
  },
];

export const MyResearchVault: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'notebook' | 'projects' | 'profile'>('notebook');
  const [labEntries, setLabEntries] = useState<LabEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kenzo_lab_entries');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LAB_ENTRIES;
  });

  const [projects, setProjects] = useState<ProjectTrack[]>(() => {
    try {
      const saved = localStorage.getItem('kenzo_projects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROJECTS;
  });

  // Modal / Form state for new log
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogCategory, setNewLogCategory] = useState<LabEntry['category']>('Laboratorium Kimia');
  const [newLogObservation, setNewLogObservation] = useState('');
  const [newLogConclusion, setNewLogConclusion] = useState('');
  const [newLogVarName, setNewLogVarName] = useState('');
  const [newLogVarVal, setNewLogVarVal] = useState('');

  const [copiedOrcid, setCopiedOrcid] = useState(false);

  useEffect(() => {
    localStorage.setItem('kenzo_lab_entries', JSON.stringify(labEntries));
  }, [labEntries]);

  useEffect(() => {
    localStorage.setItem('kenzo_projects', JSON.stringify(projects));
  }, [projects]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    const newEntry: LabEntry = {
      id: `lab-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      title: newLogTitle.trim(),
      category: newLogCategory,
      variables: newLogVarName ? [{ name: newLogVarName, value: newLogVarVal || '-' }] : [],
      observation: newLogObservation.trim() || 'Pengamatan variabel terkontrol telah dicatat.',
      conclusion: newLogConclusion.trim() || 'Data eksperimen konsisten dengan parameter desain.',
      status: 'Pengamatan Berjalan',
    };

    setLabEntries([newEntry, ...labEntries]);
    setNewLogTitle('');
    setNewLogObservation('');
    setNewLogConclusion('');
    setNewLogVarName('');
    setNewLogVarVal('');
    setIsAddLogOpen(false);
  };

  const handleDeleteLog = (id: string) => {
    setLabEntries(labEntries.filter((l) => l.id !== id));
  };

  const userName = user?.name || 'Kenzo Adelio';
  const userEmail = user?.email || 'kenzoadelio19@gmail.com';
  const userSchool = user?.school || 'SMA Labschool / Peneliti Muda Indonesia';
  const orcidId = '0009-0004-8192-3841';

  return (
    <div className="space-y-6">
      {/* Hero Banner: Personalized Researcher Vault */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-indigo-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {language === 'id' ? 'Ruang Riset Pribadi · Terverifikasi' : 'Personal Research Vault · Verified'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {userName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {userSchool} · {userEmail}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-mono border border-white/10">
                <span className="text-emerald-400 font-bold">ORCID:</span>
                <span>{orcidId}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://orcid.org/${orcidId}`);
                    setCopiedOrcid(true);
                    setTimeout(() => setCopiedOrcid(false), 2000);
                  }}
                  className="hover:text-emerald-300 transition-colors ml-1 cursor-pointer"
                  title="Salin Link ORCID"
                >
                  {copiedOrcid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl font-semibold">
                ✓ Peneliti Aktif OPSI & BRIN
              </span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-amber-300">{labEntries.length}</div>
              <div className="text-[11px] text-slate-300 font-medium">Log Catatan Lab</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-indigo-300">{projects.length}</div>
              <div className="text-[11px] text-slate-300 font-medium">Proyek Riset Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'notebook', label: 'Buku Catatan Lab Digital (Lab Notebook)', icon: <FlaskConical className="w-4 h-4" /> },
          { id: 'projects', label: 'Pelacak Proyek & Target Publikasi', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'profile', label: 'Paspor Peneliti & Portofolio Lengkap', icon: <Award className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Sub-tab 1: Digital Lab Notebook */}
      {activeTab === 'notebook' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Log Catatan Laboratorium Digital ({userName})
              </h2>
              <p className="text-xs text-slate-500">
                Pencatatan runut waktu metodologis untuk validitas pembuktian eksperimen saat sidang atau audit kompetisi internasional.
              </p>
            </div>

            <button
              onClick={() => setIsAddLogOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Log Eksperimen Baru</span>
            </button>
          </div>

          {/* Add Log Modal/Collapsible */}
          {isAddLogOpen && (
            <form onSubmit={handleAddLog} className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-indigo-600" />
                  <span>Catat Pengamatan Eksperimen Hari Ini</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Judul Pengujian / Replikasi</label>
                  <input
                    type="text"
                    required
                    value={newLogTitle}
                    onChange={(e) => setNewLogTitle(e.target.value)}
                    placeholder="Contoh: Uji Titik Leleh Bioplastik Variasi 6% Minyak Atsiri"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori Eksperimen</label>
                  <select
                    value={newLogCategory}
                    onChange={(e) => setNewLogCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Laboratorium Kimia">Laboratorium Kimia</option>
                    <option value="Eksperimen Hayati">Eksperimen Hayati</option>
                    <option value="Analisis Data SPSS">Analisis Data SPSS</option>
                    <option value="Catatan Lapangan">Catatan Lapangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Parameter / Variabel Kunci</label>
                  <input
                    type="text"
                    value={newLogVarName}
                    onChange={(e) => setNewLogVarName(e.target.value)}
                    placeholder="Contoh: Suhu Hotplate, Konsentrasi Pelarut"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nilai / Kondisi Pengukuran</label>
                  <input
                    type="text"
                    value={newLogVarVal}
                    onChange={(e) => setNewLogVarVal(e.target.value)}
                    placeholder="Contoh: 85°C selama 30 menit (Triplo)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deskripsi Pengamatan Empiris</label>
                <textarea
                  rows={3}
                  value={newLogObservation}
                  onChange={(e) => setNewLogObservation(e.target.value)}
                  placeholder="Deskripsikan perubahan visual, tekstur, nilai angka instrumen, dan anomali jika ada..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kesimpulan Awal & Tindak Lanjut</label>
                <input
                  type="text"
                  value={newLogConclusion}
                  onChange={(e) => setNewLogConclusion(e.target.value)}
                  placeholder="Contoh: Hipotesis terdukung, lanjutkan ke uji perendaman air besok pagi."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLogOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Simpan ke Buku Catatan
                </button>
              </div>
            </form>
          )}

          {/* List of Lab Logs */}
          <div className="space-y-3">
            {labEntries.map((log) => (
              <div key={log.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {log.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {log.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      log.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {log.status}
                    </span>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {log.title}
                </h3>

                {log.variables && log.variables.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {log.variables.map((v, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-mono">
                        <strong className="text-indigo-600">{v.name}:</strong> {v.value}
                      </span>
                    ))}
                  </div>
                )}

                <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed border border-slate-100 space-y-1.5">
                  <div>
                    <strong className="text-slate-900">Hasil Pengamatan:</strong> {log.observation}
                  </div>
                  <div>
                    <strong className="text-indigo-700">Inferensi Ilmiah:</strong> {log.conclusion}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Project Tracker */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Pelacak Target Naskah & Kompetisi ({userName})
            </h2>
            <p className="text-xs text-slate-500">
              Pantau progres penyusunan karya ilmiah Anda dari perumusan Bab I hingga tahap submission konferensi internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                      {proj.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {proj.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {proj.stage}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Progres Kelengkapan Naskah</span>
                    <span className="font-bold text-indigo-600">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Target: <strong>{proj.targetVenue}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tenggat: {proj.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Profile & Portfolio */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Kartu Tanda Peneliti Remaja (Verified Young Researcher Passport)
              </h2>
              <p className="text-xs text-slate-500">
                Portofolio resmi berstandar Open Science Framework untuk pendaftaran kompetisi internasional dan beasiswa.
              </p>
            </div>
            <button
              onClick={() => alert('Portofolio PDF resmi siap diekspor ke format CV Riset.')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer text-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ekspor Portofolio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Identitas Peneliti</div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div><span className="text-slate-400">Nama Lengkap:</span> <strong className="text-slate-900">{userName}</strong></div>
                <div><span className="text-slate-400">Email Akun:</span> <strong className="text-slate-900">{userEmail}</strong></div>
                <div><span className="text-slate-400">Afiliasi / Sekolah:</span> <strong className="text-slate-900">{userSchool}</strong></div>
                <div><span className="text-slate-400">Status Akun:</span> <strong className="text-emerald-600">✓ Resmi Terverifikasi</strong></div>
                <div><span className="text-slate-400">ORCID Terdaftar:</span> <strong className="text-indigo-600 font-mono">{orcidId}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fokus & Rekam Jejak Riset</div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div><span className="text-slate-400">Bidang Keahlian:</span> <strong className="text-slate-900">Biopolimer, Lingkungan, Ekonometrika</strong></div>
                <div><span className="text-slate-400">Instrumen Kuasai:</span> <strong className="text-slate-900">Uji Kuat Tarik, Spektrofotometer, SPSS, VECM</strong></div>
                <div><span className="text-slate-400">Kompetisi Target:</span> <strong className="text-slate-900">OPSI 2026, Regeneron ISEF, LKIR BRIN</strong></div>
                <div><span className="text-slate-400">Sitasi Terhubung:</span> <strong className="text-slate-900">Crossref, OpenAlex, Google Scholar</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
