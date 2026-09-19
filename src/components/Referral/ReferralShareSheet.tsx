import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Share2, Copy, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface ReferralShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralShareSheet: React.FC<ReferralShareSheetProps> = ({ isOpen, onClose }) => {
  const { user, copyReferralLink, showToast, language } = useApp();

  if (!isOpen) return null;

  const referralUrl = `https://t.me/QuickEarnBot?start=${user.referralCode || 'REF-8X4K29'}`;
  const shareText = encodeURIComponent(
    `💰 Join Quick Earn Telegram Mini App & start earning online daily! Use my invite code: ${user.referralCode || 'REF-8X4K29'}\n${referralUrl}`
  );

  const handleShareTelegram = () => {
    triggerHaptic('medium');
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${shareText}`, '_blank');
    showToast('📲 Telegram Share', 'Opened Telegram sharing window!');
  };

  const handleShareWhatsApp = () => {
    triggerHaptic('medium');
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    showToast('💬 WhatsApp Share', 'Opened WhatsApp sharing window!');
  };

  const handleShareFacebook = () => {
    triggerHaptic('medium');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`, '_blank');
    showToast('📘 Facebook Share', 'Opened Facebook sharing window!');
  };

  const handleCopy = () => {
    copyReferralLink();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Sheet Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-[#161618] border-t sm:border border-[#232326] rounded-t-[28px] sm:rounded-[28px] p-5 shadow-2xl space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#232326] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Share Referral Link</h3>
                <p className="text-[11px] text-[#8E8E93]">Choose a platform to invite friends</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Social Platforms Grid */}
          <div className="grid grid-cols-3 gap-2.5 py-1">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleShareTelegram}
              className="p-3.5 rounded-2xl bg-[#0088cc]/15 border border-[#0088cc]/30 hover:bg-[#0088cc]/25 transition-all text-center space-y-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0088cc] text-white mx-auto flex items-center justify-center shadow-md">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white block">Telegram</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleShareWhatsApp}
              className="p-3.5 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-all text-center space-y-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white mx-auto flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white block">WhatsApp</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleShareFacebook}
              className="p-3.5 rounded-2xl bg-[#1877F2]/15 border border-[#1877F2]/30 hover:bg-[#1877F2]/25 transition-all text-center space-y-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white mx-auto flex items-center justify-center shadow-md">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white block">Facebook</span>
            </motion.button>
          </div>

          {/* Direct Copy Row */}
          <div className="p-3 rounded-2xl bg-[#111113] border border-[#1C1C1F] space-y-2">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
              Direct Referral Link
            </span>

            <div className="flex items-center gap-2">
              <input
                readOnly
                type="text"
                value={referralUrl}
                className="w-full bg-transparent text-xs text-[#00E5FF] font-mono focus:outline-none truncate"
              />

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-[#00E5FF] text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>COPY</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
