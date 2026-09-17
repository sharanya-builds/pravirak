import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Phone, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiError } from '../../api/client';

type Mode = 'LOGIN' | 'REGISTER';

interface LoginPageProps {
  onAuthenticated: () => void;
  onContinueAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthenticated, onContinueAsGuest }) => {
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>('LOGIN');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim() || (mode === 'REGISTER' && !name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'LOGIN') {
        await login(identifier.trim(), password);
      } else {
        await register(name.trim(), identifier.trim(), password);
      }
      onAuthenticated();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950 flex items-center justify-center text-amber-400 shadow-sm border border-indigo-900 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">PRAVIRAK</h1>
            <p className="text-xs text-slate-500 mt-1">{t.ideasToLivelihoods}</p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex bg-slate-100 dark:bg-[#161616] rounded-xl p-1 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer font-bold ${
                  mode === 'LOGIN' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.loginTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('REGISTER');
                  setError(null);
                }}
                className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer font-bold ${
                  mode === 'REGISTER' ? 'bg-[#1E3A8A] text-white shadow-xs' : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.registerTab}
              </button>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#D1D5DB] mb-1">
              {mode === 'LOGIN' ? t.welcomeBack : t.registerTab}
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mb-6">
              {t.loginSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] mb-1.5">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali Sharma"
                      className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#161616] border border-slate-300 dark:border-neutral-700 rounded-xl text-slate-900 dark:text-[#D1D5DB] focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] mb-1.5">
                  {t.phoneOrEmail}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210 or you@email.com"
                    className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#161616] border border-slate-300 dark:border-neutral-700 rounded-xl text-slate-900 dark:text-[#D1D5DB] focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] mb-1.5">{t.password}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#161616] border border-slate-300 dark:border-neutral-700 rounded-xl text-slate-900 dark:text-[#D1D5DB] focus:ring-2 focus:ring-blue-900 focus:outline-hidden"
                    autoComplete={mode === 'LOGIN' ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-[#20040A] border border-rose-200 dark:border-rose-900 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1E3A8A] hover:bg-[#1E40AF] disabled:opacity-60 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <>
                    <span>{mode === 'LOGIN' ? t.loginButton : t.registerButton}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                <span className="bg-white dark:bg-[#111111] px-3 text-slate-400 dark:text-neutral-500 font-semibold">{t.orContinueAs}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2.5 text-xs font-bold text-slate-700 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#262626] border border-slate-300 dark:border-neutral-700 rounded-xl transition-all cursor-pointer"
            >
              {t.continueAsGuest}
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            {t.guestDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
