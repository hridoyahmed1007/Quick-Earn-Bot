import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Users,
  Tv,
  Wallet,
  Target,
  Gift,
  Check,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

export const AchievementDetailModal: React.FC = () => {
  const { activeAchievementDetail, setActiveAchievementDetail, language, navigateTo, openEarningTab } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  if (!activeAchievementDetail) return null;

  const ach = activeAchievementDetail;
  const isCompleted = ach.unlocked || ach.claimed;
  const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
  const remainingValue = Math.max(0, ach.maxProgress - ach.progress);

  const handleAction = () => {
    triggerHaptic();
    setActiveAchievementDetail(null);
    if (ach.category === 'referral') {
      navigateTo('referral');
    } else if (ach.category === 'ads') {
      openEarningTab('ads');
    } else if (ach.category === 'earnings') {
      navigateTo('ads');
    } else if (ach.category === 'withdrawal') {
      navigateTo('wallet');
    }
  };

  return (
    <AnimatePresence>
      <div
        id="achievement-detail-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        onClick={() => setActiveAchievementDetail(null)}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#161619] border border-[#27272E] rounded-[26px] p-5 space-y-4 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#111113] border border-[#232326] text-[#00E5FF] flex items-center gap-1">
              <Award className="w-3 h-3 text-[#00E5FF]" />
              <span>{ach.category.toUpperCase()} MILESTONE</span>
            </span>
            <button
              onClick={() => {
                triggerHaptic();
                setActiveAchievementDetail(null);
              }}
              className="w-8 h-8 rounded-full bg-[#1A1A1E] border border-[#282830] flex items-center justify-center text-[#8E8E93] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Icon & Title */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/35 flex items-center justify-center shadow-[0_0_24px_rgba(255,184,0,0.2)] text-amber-400">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">
                {isBn ? ach.titleBn : ach.titleEn}
              </h3>
              <p className="text-[12px] text-[#A1A1AA] mt-1.5 leading-relaxed bg-[#0E0E11] p-2.5 rounded-xl border border-[#202026]">
                {isBn ? ach.descriptionBn : ach.descriptionEn}
              </p>
            </div>
          </div>

          {/* Requirement & Telemetry Box */}
          <div className="p-3.5 rounded-2xl bg-[#0F0F12] border border-[#222228] space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8E8E93] font-extrabold flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{isBn ? 'শর্ত ও টার্গেট' : 'Requirement'}</span>
              </span>
              <span className="font-black text-white">
                {isBn ? ach.requirementBn : ach.requirementEn}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-[#18181D] rounded-full overflow-hidden p-0.5 border border-[#26262C]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(255,184,0,0.5)]'
                      : 'bg-gradient-to-r from-[#00E5FF] to-teal-400 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  }`}
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="text-[#8E8E93] font-mono font-medium">
                  {ach.category === 'earnings' ? `৳${ach.progress}` : ach.progress} / {ach.category === 'earnings' ? `৳${ach.maxProgress}` : ach.maxProgress} {ach.unit}
                </span>
                <span className={`font-black ${isCompleted ? 'text-amber-400' : 'text-[#00E5FF]'}`}>
                  {progressPercent}% {isBn ? 'সম্পন্ন' : 'Complete'}
                </span>
              </div>
            </div>

            {/* Remaining status */}
            {!isCompleted && remainingValue > 0 && (
              <p className="text-[11px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl text-center">
                {isBn
                  ? `⚡ আর মাত্র ${ach.category === 'earnings' ? `৳${remainingValue}` : remainingValue} ${ach.unit} বাকি আছে!`
                  : `⚡ Just ${ach.category === 'earnings' ? `৳${remainingValue}` : remainingValue} ${ach.unit} remaining to unlock!`}
              </p>
            )}
          </div>

          {/* Reward Info */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-emerald-400 block">
                  +৳{ach.rewardBdt.toFixed(2)} নগদ বোনাস
                </span>
                <span className="text-[10px] text-emerald-300/80 block">
                  {isBn ? 'ভেরিফিকেশনের পর সরাসরি মূল ওয়ালেটে জমা হবে' : 'Instantly credited upon verification'}
                </span>
              </div>
            </div>
            {isCompleted && (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>CREDITED</span>
              </span>
            )}
          </div>

          {/* Anti-Fraud Security Guarantee */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93] justify-center bg-[#111114] py-2 rounded-xl border border-[#202026]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isBn ? '১০০% অটোমেটিক সার্ভার ভেরিফাইড সিকিউরিটি' : 'Server Verified Real Activity Guarantee'}</span>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <button
              onClick={() => {
                triggerHaptic();
                setActiveAchievementDetail(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#232328] text-white font-extrabold text-xs hover:bg-[#2F2F36] transition-all border border-[#2C2C34]"
            >
              {isBn ? 'বন্ধ করুন' : 'CLOSE'}
            </button>
          ) : (
            <button
              onClick={handleAction}
              className="w-full py-3 rounded-2xl bg-[#00E5FF] hover:bg-[#33EAFF] text-[#0A0A0B] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.35)] active:scale-95"
            >
              <span>{isBn ? 'এখনই টাস্ক শুরু করুন' : 'MAKE PROGRESS NOW'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
