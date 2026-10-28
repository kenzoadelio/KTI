import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Mail,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const VerificationModal: React.FC = () => {
  const {
    user,
    isVerifyModalOpen,
    closeVerifyModal,
    verifyCode,
    resendCode,
  } = useAuth();
  const { language } = useLanguage();

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [recentSentCode, setRecentSentCode] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (isVerifyModalOpen && user) {
      setRecentSentCode(user.verificationCode || '742918');
      setIsSuccess(false);
      setDigits(['', '', '', '', '', '']);
      setErrorMsg(null);
      setCountdown(60);
      setCanResend(false);

      // Auto focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isVerifyModalOpen, user]);

  // Countdown timer
  useEffect(() => {
    let timer: any = null;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  if (!isVerifyModalOpen || !user) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    // Take the last typed character
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setErrorMsg(null);

    // Auto advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const newDigits = [...digits];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setDigits(newDigits);
      if (pasteData.length === 6) {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg(language === 'id' ? 'Masukkan lengkap 6 digit kode verifikasi.' : 'Please enter all 6 digits of the verification code.');
      return;
    }

    const res = await verifyCode(code);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        closeVerifyModal();
      }, 1500);
    } else {
      setErrorMsg(res.message || (language === 'id' ? 'Kode verifikasi tidak valid.' : 'Invalid verification code.'));
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    const res = await resendCode();
    if (res.success && res.newCode) {
      setRecentSentCode(res.newCode);
      setCountdown(60);
      setCanResend(false);
      setErrorMsg(null);
    }
  };

  const handleAutoFill = () => {
    const code = user.verificationCode || recentSentCode || '742918';
    setDigits(code.split('').slice(0, 6));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight text-slate-900">
                {language === 'id' ? 'Verifikasi Akun Peneliti' : 'Verify Researcher Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'id' ? 'Masukkan 6 digit kode OTP' : 'Enter 6-digit OTP code'}
              </p>
            </div>
          </div>
          <button
            onClick={closeVerifyModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isSuccess ? (
            <div className="py-6 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {language === 'id' ? 'Akun Berhasil Diverifikasi!' : 'Account Successfully Verified!'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {language === 'id'
                  ? 'Selamat! Status Anda kini terverifikasi sebagai Peneliti Resmi CendekiaKTI.'
                  : 'Congratulations! You are now an officially verified CendekiaKTI researcher.'}
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-600 leading-relaxed">
                {language === 'id' ? (
                  <>
                    Kode verifikasi 6 digit telah dikirimkan ke email{' '}
                    <strong className="text-slate-900 font-mono">{user.email}</strong>.
                  </>
                ) : (
                  <>
                    A 6-digit verification code was sent to{' '}
                    <strong className="text-slate-900 font-mono">{user.email}</strong>.
                  </>
                )}
              </div>

              {/* Development Convenience Helper */}
              {recentSentCode && (
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-800 block">
                      {language === 'id' ? 'Kode OTP Anda (Simulasi Email):' : 'Your OTP Code (Email Simulation):'}
                    </span>
                    <span className="font-mono text-base font-bold text-blue-900 tracking-widest">
                      {recentSentCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    {language === 'id' ? 'Tempel Kode' : 'Paste Code'}
                  </button>
                </div>
              )}

              {/* 6-Digit OTP Inputs */}
              <div className="pt-2">
                <div className="flex items-center justify-between gap-2">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-xl font-bold font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
                    />
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleVerify}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{language === 'id' ? 'Konfirmasi Verifikasi' : 'Confirm Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Resend Code Section */}
              <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                <span>{language === 'id' ? 'Tidak menerima kode?' : "Didn't receive code?"}</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    {language === 'id' ? 'Kirim Ulang' : 'Resend Now'}
                  </button>
                ) : (
                  <span className="font-mono text-slate-400">
                    {language === 'id' ? `Tunggu ${countdown}s` : `Wait ${countdown}s`}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
