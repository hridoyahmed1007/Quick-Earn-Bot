import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Share2, Link as LinkIcon, CheckCircle2, Gift, Send, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface ReferralLinkCardProps {
  onOpenShareSheet?: () => void;
}

export const ReferralLinkCard: React.FC<ReferralLinkCardProps> = ({ onOpenShareSheet }) => {
  const { user, copyReferralLink, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = user.referralCode || 'REF-8X4K29';
  const referralUrl = `https://t.me/QuickEarnBot?start=${referralCode}`;

  const handleCopy = () => {
    triggerHaptic('medium');
    copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    triggerHaptic('medium');
    const shareText = encodeURIComponent(
      `💰 Quick Earn Telegram Mini App-এ কাজ করে প্রতিদিন ঘরে বসে টাকা আয় করুন!\n🎁 আমার রেফার কোড: ${referralCode}\n👇 নিচের লিংকে ক্লিক করে এখনই জয়েন করুন:\n${referralUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${shareText}`, '_blank');
    if (showToast) {
      showToast('📲 Telegram Share', 'টেলিগ্রাম শেয়ারিং উইন্ডো ওপেন হয়েছে!');
    }
  };

  return (
    <div 
      id="referral-link-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-3.5 relative overflow-hidden"
    >
      {/* Top Title & Code Badge */}
      <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center shrink-0">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black text-white uppercase tracking-wider truncate">
              আপনার ইনভাইট লিংক (INVITE LINK)
            </h2>
            <p className="text-[10px] text-[#8E8E93] truncate">
              লিংক শেয়ার করে আয় ও উইথড্র আনলক করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full border border-[#00E5FF]/20 whitespace-nowrap shrink-0">
            CODE: {referralCode}
          </span>
        </div>
      </div>

      {/* Referral Link Input & Action Buttons Box */}
      <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-2">
        <div className="flex items-center gap-2">
          <input
            readOnly
            type="text"
            value={referralUrl}
            className="w-full bg-transparent text-xs text-[#00E5FF] font-mono font-bold focus:outline-none px-1 truncate selection:bg-[#00E5FF]/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1F1F24]">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleCopy}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
              copied
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] glow-cyan'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>লিংক কপি করুন</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onOpenShareSheet || handleShareTelegram}
            className="py-2 rounded-xl bg-[#1E1E24] hover:bg-[#282830] text-white border border-[#2F2F38] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4 text-[#00E5FF]" />
            <span>বন্ধুদের শেয়ার করুন</span>
          </motion.button>
        </div>
      </div>

      {/* Rewards Quick Summary Pill */}
      <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Gift className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-extrabold text-white block leading-tight">রেফারেল রিওয়ার্ড অফার</span>
            <span className="text-[10px] text-[#8E8E93]">প্রতি ভ্যালিড রেফারে বোনাস + ১০% কমিশন</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black font-mono shrink-0">
          +৳15.00 / Refer
        </span>
      </div>
    </div>
  );
};
