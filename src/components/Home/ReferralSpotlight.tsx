import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Copy, Check, Share2, Award, Sparkles, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralSpotlight: React.FC = () => {
  const { user, copyReferralLink, navigateTo, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const targetMilestone = 25;
  const currentRefs = user.totalReferrals;
  const progressPercent = Math.min(100, Math.round((currentRefs / targetMilestone) * 100));

  const handleCopy = () => {
    copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'telegram' | 'whatsapp' | 'facebook') => {
    const link = `https://t.me/QuickEarnBot?start=${user.referralCode}`;
    const text = encodeURIComponent(`Join Quick Earn Mini App and start earning daily bKash cash rewards! My code: ${user.referralCode}`);

    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(link)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
    }
  };

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-lg relative overflow-hidden space-y-3.5">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1">
              Invite & Earn 👥
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              Invite friends, earn passive 10% commission
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('referral')}
          className="text-[10px] font-bold text-[#00E5FF] hover:underline"
        >
          View All
        </button>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">Total Referrals</span>
          <span className="text-base font-extrabold text-white mt-0.5 block">{user.totalReferrals}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F]">
          <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block">Referral Earnings</span>
          <span className="text-base font-extrabold text-[#00E5FF] mt-0.5 block">৳{user.referralEarningsBdt.toFixed(2)}</span>
        </div>
      </div>

      {/* Milestone Progress Bar */}
      <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#8E8E93] font-semibold flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            Next Reward Milestone
          </span>
          <span className="font-bold text-white font-mono">
            {currentRefs} / {targetMilestone} Referrals
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 rounded-full bg-[#222224] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-[#00E5FF] to-teal-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {currentRefs >= targetMilestone ? (
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3" />
            🎉 ৳100 Milestone Bonus Unlocked!
          </span>
        ) : (
          <span className="text-[9px] text-[#636366] block">
            Invite {targetMilestone - currentRefs} more active friends to unlock ৳100 cash bonus!
          </span>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('telegram')}
          className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>INVITE FRIENDS</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="py-2.5 px-3 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2E] text-white border border-[#2A2A2E] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />}
          <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
        </motion.button>
      </div>

      {/* Quick Share Icons Row */}
      <div className="flex items-center justify-between text-[10px] text-[#8E8E93] pt-1">
        <span>Quick Share:</span>
        <div className="flex items-center gap-3">
          <button onClick={() => handleShare('telegram')} className="hover:text-[#00E5FF] transition-colors font-semibold">
            Telegram
          </button>
          <span>•</span>
          <button onClick={() => handleShare('whatsapp')} className="hover:text-emerald-400 transition-colors font-semibold">
            WhatsApp
          </button>
          <span>•</span>
          <button onClick={() => handleShare('facebook')} className="hover:text-blue-400 transition-colors font-semibold">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};
