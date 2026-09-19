import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface AdminLoginViewProps {
  onLoginSuccess: (username: string, token: string) => void;
  onExit: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onExit,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const defaultUsername = 'admin_quickearn';
  const defaultPassword = 'EarnAdmin@2026#';

  const handleQuickFill = () => {
    triggerHaptic('medium');
    setUsername(defaultUsername);
    setPassword(defaultPassword);
    setErrorMsg(null);
  };

  const handleCopy = (text: string, label: string) => {
    triggerHaptic('light');
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('অনুগ্রহ করে ইউজারনেম এবং পাসওয়ার্ড উভয়ই লিখুন।');
      triggerHaptic('error');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    triggerHaptic('light');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ভুল ইউজারনেম অথবা পাসওয়ার্ড!');
      }

      triggerHaptic('success');
      onLoginSuccess(data.username, data.token);
    } catch (err: any) {
      triggerHaptic('error');
      setErrorMsg(err.message || 'লগইন ব্যর্থ হয়েছে! পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDED] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-[#00E5FF] selection:text-[#0A0A0B]">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left Return Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          id="admin_login_exit_btn"
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141416]/80 hover:bg-[#1E1E22] text-xs font-semibold text-[#8E8E93] hover:text-white border border-[#232326] transition-all backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>ইউজার অ্যাপে ফিরে যান</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#141416] border border-[#232326] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#00B4D8] flex items-center justify-center text-[#0A0A0B] shadow-lg shadow-[#00E5FF]/20 mb-3.5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] text-[11px] font-bold mb-2">
            <KeyRound className="w-3 h-3" />
            <span>Admin Authentication Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            অ্যাডমিন প্যানেল লগইন
          </h1>
          <p className="text-xs text-[#8E8E93] mt-1 max-w-xs">
            কুইক আর্ন কন্ট্রোল প্যানেলে প্রবেশ করতে আপনার ইউজারনেম ও পাসওয়ার্ড দিন
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
              অ্যাডমিন ইউজারনেম (Username)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#71717A] pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                id="admin_username_input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="उदा. admin_quickearn"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] text-white text-sm rounded-xl pl-10 pr-4 py-3 placeholder:text-[#52525B] transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1.5">
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#71717A] pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin_password_input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] text-white text-sm rounded-xl pl-10 pr-11 py-3 placeholder:text-[#52525B] transition-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#71717A] hover:text-white p-1 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin_login_submit_btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] hover:opacity-95 text-[#0A0A0B] text-sm font-black shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>লগইন করুন (Access Panel)</span>
              </>
            )}
          </button>
        </form>

        {/* Initial Random Credentials Helper */}
        <div className="mt-6 pt-5 border-t border-[#232326]">
          <div className="p-3.5 rounded-2xl bg-[#1A1A1E] border border-[#2A2A30]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                ডিফল্ট অ্যাডমিন ক্রেডেনশিয়াল
              </span>
              <button
                id="admin_login_quick_fill_btn"
                type="button"
                onClick={handleQuickFill}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 transition-all flex items-center gap-1"
              >
                <span>⚡ অটো-ফিল করুন</span>
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141416] border border-[#232326]">
                <span className="text-[#8E8E93]">Username:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold">{defaultUsername}</span>
                  <button
                    onClick={() => handleCopy(defaultUsername, 'user')}
                    className="text-[#71717A] hover:text-[#00E5FF]"
                    title="Copy Username"
                  >
                    {copiedKey === 'user' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#141416] border border-[#232326]">
                <span className="text-[#8E8E93]">Password:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#00E5FF] font-semibold">{defaultPassword}</span>
                  <button
                    onClick={() => handleCopy(defaultPassword, 'pass')}
                    className="text-[#71717A] hover:text-[#00E5FF]"
                    title="Copy Password"
                  >
                    {copiedKey === 'pass' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-[#71717A] mt-2 text-center">
              লগইন করার পর আপনি অ্যাডমিন প্যানেল থেকে যেকোনো সময় ইউজারনেম ও পাসওয়ার্ড পরিবর্তন করতে পারবেন।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
