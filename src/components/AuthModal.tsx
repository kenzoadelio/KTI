import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  UserCheck,
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    login,
    signup,
    guestLogin,
    isLoading,
  } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guest'>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [academicLevel, setAcademicLevel] = useState<'SMP' | 'SMA/SMK' | 'Mahasiswa (S1)' | 'Pascasarjana'>('SMA/SMK');
  const [role, setRole] = useState<'student' | 'researcher' | 'teacher'>('student');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync tab if opened with specific tab
  React.useEffect(() => {
    setActiveTab(authModalTab);
  }, [authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === 'login') {
      if (!email.trim()) {
        setErrorMsg(language === 'id' ? 'Masukkan alamat email Anda.' : 'Please enter your email address.');
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.message || (language === 'id' ? 'Gagal masuk akun.' : 'Failed to log in.'));
      }
    } else if (activeTab === 'signup') {
      if (!name.trim() || !email.trim()) {
        setErrorMsg(language === 'id' ? 'Nama lengkap dan email wajib diisi.' : 'Full name and email are required.');
        return;
      }
      const res = await signup({
        name,
        email,
        password,
        school,
        role,
        academicLevel,
      });
      if (!res.success) {
        setErrorMsg(res.message || (language === 'id' ? 'Gagal membuat akun baru.' : 'Failed to create new account.'));
      }
    } else if (activeTab === 'guest') {
      guestLogin();
    }
  };

  const handleFillDemo = () => {
    if (activeTab === 'login') {
      setEmail('kenzoadelio19@gmail.com');
      setPassword('cendekia2026');
    } else if (activeTab === 'signup') {
      setName('Kenzo Adelio');
      setEmail('kenzoadelio19@gmail.com');
      setSchool('SMA Negeri 1 Indonesia');
      setPassword('cendekia2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-slate-900">
                Cendekia<span className="text-blue-600">KTI</span> Account
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'id' ? 'Akses penuh riset & sinkronisasi proposal' : 'Full access to research & proposal sync'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls: Log In, Sign Up, Guest */}
        <div className="px-6 pt-4">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Masuk' : 'Log In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Daftar' : 'Sign Up'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('guest');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'guest'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Tamu' : 'Guest'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'guest' ? (
            /* Guest Mode Explainer */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'id' ? 'Masuk Cepat Tanpa Akun' : 'Quick Access Without Account'}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {language === 'id'
                    ? 'Anda dapat langsung menggunakan semua fitur pencarian jurnal, pasar 24/7, generator proposal, dan bimbingan KTI. Data disimpan di peramban lokal perangkat ini.'
                    : 'You can immediately use all scholar search tools, 24/7 market hub, proposal builder, and AI mentorship. Data is stored locally in this browser.'}
                </p>
                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1">
                  <span>✓ {language === 'id' ? 'Tanpa kata sandi' : 'No password needed'}</span>
                  <span>·</span>
                  <span>✓ {language === 'id' ? 'Akses instan' : 'Instant access'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={guestLogin}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'id' ? 'Mulai Eksplorasi sebagai Tamu' : 'Start Exploring as Guest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {activeTab === 'signup' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder={language === 'id' ? 'Contoh: Kenzo Adelio' : 'e.g. Alex Johnson'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {language === 'id' ? 'Jenjang' : 'Level'}
                      </label>
                      <select
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SMP">SMP / MTs</option>
                        <option value="SMA/SMK">SMA / MA / SMK</option>
                        <option value="Mahasiswa (S1)">Mahasiswa S1</option>
                        <option value="Pascasarjana">Pascasarjana S2/S3</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {language === 'id' ? 'Peran' : 'Role'}
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="student">{language === 'id' ? 'Siswa / Mahasiswa' : 'Student'}</option>
                        <option value="researcher">{language === 'id' ? 'Peneliti Muda' : 'Researcher'}</option>
                        <option value="teacher">{language === 'id' ? 'Guru Pembimbing' : 'Advisor / Teacher'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {language === 'id' ? 'Asal Sekolah / Universitas' : 'School / Institution'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={language === 'id' ? 'Contoh: SMAN 1 Jakarta / UI' : 'e.g. Stanford / State High School'}
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'id' ? 'Alamat Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'id' ? 'Kata Sandi' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  {language === 'id' ? '✨ Isi Data Contoh' : '✨ Fill Demo Data'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>
                  {activeTab === 'login'
                    ? language === 'id'
                      ? 'Masuk ke Akun'
                      : 'Log In to Account'
                    : language === 'id'
                    ? 'Daftar & Dapatkan Kode Verifikasi'
                    : 'Sign Up & Get Verification Code'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
