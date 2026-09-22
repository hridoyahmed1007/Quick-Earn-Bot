import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  KeyRound,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

interface AdminCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdminUsername: string;
  onCredentialsChanged: (newUsername: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const AdminCredentialsModal: React.FC<AdminCredentialsModalProps> = ({
  isOpen,
  onClose,
  currentAdminUsername,
  onCredentialsChanged,
  showToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentAdminUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('বর্তমান পাসওয়ার্ড প্রদান করা আবশ্যক!');
      triggerHaptic('error');
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setErrorMsg('নতুন ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে!');
      triggerHaptic('error');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      triggerHaptic('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!');
      triggerHaptic('error');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('light');

    try {
      const res = await fetch('/api/admin/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim(),
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ক্রেডেনশিয়াল পরিবর্তন ব্যর্থ হয়েছে!');
      }

      triggerHaptic('success');
      showToast('পাসওয়ার্ড পরিবর্তিত হয়েছে', 'নতুন ইউজারনেম ও পাসওয়ার্ড সফলভাবে সেভ করা হয়েছে।', 'success');
      onCredentialsChanged(data.username);
      onClose();
    } catch (err: any) {
      triggerHaptic('error');
      setErrorMsg(err.message || 'পরিবর্তন ব্যর্থ হয়েছে!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-[#141416] border border-[#232326] rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Close Button */}
          <button
            id="close_admin_creds_modal_btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[#00E5FF] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">অ্যাডমিন ক্রেডেনশিয়াল পরিবর্তন</h2>
              <p className="text-xs text-[#8E8E93]">ইউজারনেম ও লগইন পাসওয়ার্ড আপডেট করুন</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Current Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                বর্তমান পাসওয়ার্ড (Current Password)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#71717A] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin_curr_pass_input"
                  type={showCurrentPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] text-white text-xs rounded-xl pl-9 pr-10 py-2.5 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 text-[#71717A] hover:text-white"
                  tabIndex={-1}
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Username */}
            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                নতুন ইউজারনেম (New Username)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#71717A] pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin_new_username_input"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="নতুন ইউজারনেম লিখুন"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                নতুন পাসওয়ার্ড (New Password)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#71717A] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin_new_pass_input"
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] text-white text-xs rounded-xl pl-9 pr-10 py-2.5 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 text-[#71717A] hover:text-white"
                  tabIndex={-1}
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-1">
                কনফার্ম নতুন পাসওয়ার্ড (Confirm Password)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-[#71717A] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin_confirm_pass_input"
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E1E22] border border-[#2F2F36] focus:border-[#00E5FF] text-white text-xs rounded-xl pl-9 pr-10 py-2.5 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 text-[#71717A] hover:text-white"
                  tabIndex={-1}
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A2E] text-xs font-semibold text-[#8E8E93] hover:text-white transition-colors"
              >
                বাতিল করুন
              </button>

              <button
                id="admin_save_creds_btn"
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] hover:opacity-95 text-[#0A0A0B] text-xs font-black shadow-md shadow-[#00E5FF]/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0A0A0B] border-t-transparent rounded-full animate-spin" />
                    <span>সেভ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>সেভ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
