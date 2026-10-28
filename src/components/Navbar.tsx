import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  FileText,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Bookmark,
  Sparkles,
  TrendingUp,
  Settings2,
  Wrench,
  User as UserIcon,
  UserCheck,
  LogOut,
  ShieldAlert,
  LogIn,
  ChevronDown,
  SpellCheck,
  Workflow,
  Gavel,
  FlaskConical,
  Globe,
  FileCheck2,
  Code2,
  DollarSign,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSettingsModal } from './LanguageSettingsModal';

export type NavTab =
  | 'scholar'
  | 'assistant'
  | 'proposal'
  | 'market'
  | 'toolkit'
  | 'library'
  | 'brainstorm'
  | 'mentor'
  | 'paraphrase'
  | 'grammar'
  | 'summarizer'
  | 'defense'
  | 'myLab'
  | 'intlMatch'
  | 'intlReviewer'
  | 'intlPublish'
  | 'intlGrants';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, savedCount }) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    user,
    isAuthenticated,
    isGuest,
    isVerified,
    logout,
    openAuthModal,
    openVerifyModal,
  } = useAuth();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const tabs: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number; isLive?: boolean }> = [
    {
      id: 'scholar',
      label: t('tabScholar'),
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: 'assistant',
      label: t('tabAssistant'),
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'proposal',
      label: t('tabProposal'),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'market',
      label: t('tabMarket'),
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      isLive: true,
    },
    {
      id: 'toolkit',
      label: t('tabToolkit'),
      icon: <Wrench className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'library',
      label: t('tabLibrary'),
      icon: <Bookmark className="w-4 h-4" />,
      badge: savedCount,
    },
    {
      id: 'brainstorm',
      label: t('tabBrainstorm'),
      icon: <Lightbulb className="w-4 h-4" />,
    },
    {
      id: 'mentor',
      label: t('tabMentor'),
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: 'paraphrase',
      label: t('tabParaphrase'),
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'grammar',
      label: t('tabGrammar'),
      icon: <SpellCheck className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'summarizer',
      label: t('tabSummarizer'),
      icon: <Workflow className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'defense',
      label: t('tabDefense'),
      icon: <Gavel className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'myLab',
      label: t('tabMyLab'),
      icon: <FlaskConical className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'intlMatch',
      label: t('tabIntlMatch'),
      icon: <Globe className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'intlReviewer',
      label: t('tabIntlReviewer'),
      icon: <FileCheck2 className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'intlPublish',
      label: t('tabIntlPublish'),
      icon: <Code2 className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'intlGrants',
      label: t('tabIntlGrants'),
      icon: <DollarSign className="w-4 h-4 text-amber-500" />,
    },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <>
      {/* Top Unverified Warning Ribbon */}
      {user && !user.isVerified && !user.isGuest && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-600/30">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-slate-950" />
              <span>{t('verifyWarningRibbon')}</span>
            </div>
            <button
              onClick={openVerifyModal}
              className="px-2.5 py-0.5 rounded-md bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              {t('verifyNowBtn')}
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Zone 1: Brand Wordmark */}
            <div
              onClick={() => onTabChange('scholar')}
              className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-600 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Cendekia<span className="text-blue-600">KTI</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 hidden xl:inline">
                  · Riset & Data
                </span>
              </div>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer relative ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.isLive && (
                      <span className="inline-flex items-center gap-1 ml-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </span>
                    )}
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Quick Actions, User Profile & CTA */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Language Toggle */}
              <button
                onClick={toggleLanguage}
                title="Ganti Bahasa / Switch Language"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200"
              >
                <span>{language === 'id' ? 'ID' : 'EN'}</span>
              </button>

              {/* Language & Voice Settings Modal Trigger */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                title={t('languageSettings')}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
              >
                <Settings2 className="w-4 h-4" />
              </button>

              {/* User Account / Profile Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-24 truncate hidden sm:inline">{user.name}</span>
                    {user.isVerified ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded hidden md:inline">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded hidden md:inline">
                        !
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in text-xs">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-slate-400 text-[11px] font-mono truncate">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {user.isVerified ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              ✓ {t('verifiedBadge')}
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                openVerifyModal();
                              }}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              ⚠️ {t('verifyAccountBtn')}
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400">{user.academicLevel || 'Siswa'}</span>
                        </div>
                      </div>

                      <div className="p-1">
                        {!user.isVerified && !user.isGuest && (
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              openVerifyModal();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-2"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            <span>{t('verifyAccountBtn')}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{t('logoutBtn')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {t('loginBtn')}
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors cursor-pointer hidden sm:inline"
                  >
                    {t('signUpBtn')}
                  </button>
                </div>
              )}

              {/* Primary CTA */}
              <button
                onClick={() => onTabChange('proposal')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{t('quickProposalBtn')}</span>
              </button>
            </div>
          </div>

          {/* Mobile Submenu Navigation Bar */}
          <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  )}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="text-[10px] px-1 rounded bg-slate-700 text-white font-mono ml-0.5">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <LanguageSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
