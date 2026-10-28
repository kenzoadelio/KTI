import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ProposalData } from '../types';
import { sendMentorMessage } from '../services/api';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  Lightbulb,
  FileText,
  FlaskConical,
  BarChart3,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AudioSpeechPlayer } from './AudioSpeechPlayer';

interface AiMentorChatProps {
  currentProposal: ProposalData | null;
}

interface PromptCategory {
  name: string;
  icon: React.ReactNode;
  prompts: string[];
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ currentProposal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo! Saya **Mentor Riset Cendekia KTI** 🎓.
Saya siap membimbing dan menjawab setiap pertanyaan seputar riset karya tulis ilmiah Anda, misalnya:
- **Merumuskan Variabel Penelitian:** Cara membedakan Variabel Bebas (X), Terikat (Y), dan Kontrol.
- **Penyusunan Latar Belakang:** Menyusun alur piramida terbalik dan menemukan celah riset (*research gap*).
- **Metodologi & Instrumen:** Memilih instrumen uji laboratorium, kuesioner skala Likert, atau wawancara.
- **Teknik Sampling & Uji Statistik:** Menghitung jumlah sampel dan memilih uji hipotesis (t-test, ANOVA, dsb.).
- **Persiapan Sidang & Penjurian:** Menjawab pertanyaan kritis dewan juri lomba (OPSI, LKTI, dsb.).

Silakan ketik pertanyaan Anda di bawah, atau pilih topik konsultasi cepat!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories: PromptCategory[] = [
    {
      name: 'Variabel & Hipotesis',
      icon: <FlaskConical className="w-3.5 h-3.5" />,
      prompts: [
        'Bagaimana cara membedakan Variabel Bebas (X), Terikat (Y), dan Kontrol pada eksperimen?',
        'Bantu buatkan hipotesis H0 dan H1 yang tepat untuk judul riset saya.',
        'Bagaimana cara mengontrol variabel pengganggu agar hasil eksperimen valid?',
      ],
    },
    {
      name: 'Latar Belakang & Bab I',
      icon: <FileText className="w-3.5 h-3.5" />,
      prompts: [
        'Bagaimana langkah menulis latar belakang dengan metode piramida terbalik?',
        'Bagaimana cara menjelaskan research gap (kebaruan riset) agar dinilai orisinal?',
        'Bantu susun 3 rumusan masalah yang tajam dan dapat diuji secara objektif.',
      ],
    },
    {
      name: 'Metodologi & Instrumen',
      icon: <Lightbulb className="w-3.5 h-3.5" />,
      prompts: [
        'Kapan harus menggunakan eksperimen laboratorium dibanding survei kualitatif?',
        'Bagaimana cara membuat kuesioner skala Likert yang valid dan reliabel?',
        'Apa saja parameter penting dalam uji laboratorium untuk bahan alami?',
      ],
    },
    {
      name: 'Sampel & Statistik',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
      prompts: [
        'Berapa jumlah sampel minimum yang diperlukan untuk penelitian survei siswa?',
        'Kapan saya harus menggunakan uji Paired t-test atau Independent t-test?',
        'Bagaimana teknik sampling yang benar: Random Sampling atau Purposive Sampling?',
      ],
    },
    {
      name: 'Sidang & Lomba KTI',
      icon: <Award className="w-3.5 h-3.5" />,
      prompts: [
        'Apa pertanyaan yang paling sering diajukan juri saat presentasi lomba KTI?',
        'Bagaimana cara menjawab jika juri menanyakan keterbatasan penelitian saya?',
        'Tips menyusun slide presentasi 10 menit yang memikat dewan juri.',
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText ?? input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customText) setInput('');
    setLoading(true);

    try {
      // Find first user message index to avoid sending leading assistant message to API
      const firstUserIdx = newMessages.findIndex((m) => m.role === 'user');
      const payloadMessages = (firstUserIdx >= 0 ? newMessages.slice(firstUserIdx) : newMessages).map(
        (m) => ({ role: m.role, content: m.content })
      );

      const responseText = await sendMentorMessage(payloadMessages, currentProposal);

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Maaf, terjadi kendala saat merespons: ${err.message}. Silakan periksa koneksi atau coba tanyakan ulang dengan kalimat berbeda.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Sesi konsultasi riset direset. Silakan tanyakan hal apa pun yang ingin Anda diskusikan tentang proposal atau metode penelitian Anda!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to format text with bold, bullet lines, and code
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Process bold markers **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Handle bullet line
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-2">
            <span className="text-indigo-600 font-bold">•</span>
            <span>{renderedLine}</span>
          </div>
        );
      }

      // Handle numbered line
      const matchNum = line.trim().match(/^(\d+[\.\)])\s*(.*)$/);
      if (matchNum) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-2">
            <span className="font-bold text-indigo-700 shrink-0">{matchNum[1]}</span>
            <span>{matchNum[2]}</span>
          </div>
        );
      }

      // Empty line spacer
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-0.5">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[780px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Mentor Riset & Konsultasi KTI AI
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Aktif & Siap Menjawab
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentProposal ? (
                <span>
                  Membimbing naskah: <strong className="text-slate-700 font-semibold">"{currentProposal.judul.substring(0, 50)}..."</strong>
                </span>
              ) : (
                'Tanyakan seputar judul, variabel, metode eksperimen, atau persiapan sidang'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Reset Obrolan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sesi</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs group relative ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {isUser ? m.content : formatText(m.content)}

                <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-slate-100/60">
                  <span
                    className={`text-[10px] ${
                      isUser ? 'text-blue-200' : 'text-slate-400 font-medium'
                    }`}
                  >
                    {m.timestamp}
                  </span>

                  {!isUser && (
                    <div className="flex items-center gap-1.5">
                      <AudioSpeechPlayer
                        text={m.content}
                        variant="icon"
                        className="hover:bg-slate-100 text-slate-400 hover:text-indigo-600 p-1"
                      />
                      <button
                        onClick={() => handleCopyText(m.id, m.content)}
                        className="text-[10px] font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
                        title="Salin jawaban mentor"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 mr-auto items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-slate-800 font-semibold">
                  Mentor sedang menjawab...
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Mode Cepat ⚡
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Topic & Quick Prompts Panel */}
      <div className="bg-slate-100/80 border-t border-slate-200 p-3 space-y-2">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Topik:
          </span>
          {categories.map((cat, idx) => {
            const isActive = activeCategoryIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategoryIdx(idx)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Suggestions */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories[activeCategoryIdx].prompts.map((promptText, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(promptText)}
              disabled={loading}
              className="text-[11px] bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-900 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-2xs font-medium"
            >
              <span>{promptText}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Tanyakan masalah risetmu (misal: bagaimana cara membuat uji organoleptik atau rumus slovin?)..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Kirim Tanya</span>
          </button>
        </form>
      </div>
    </div>
  );
};
