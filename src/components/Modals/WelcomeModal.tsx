import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Play, Users, Wallet, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { dailyBonus, adProviders, referralConfig, withdrawalSettings } = useApp();

  const safeDailyBonus = Array.isArray(dailyBonus) ? dailyBonus : [];
  const safeAdProviders = Array.isArray(adProviders) ? adProviders : [];

  // Derive dynamic real values from current application configuration
  const currentClaimable = safeDailyBonus.find((d) => d.isCurrentDay && !d.isClaimed);
  const nextBonusAmount = currentClaimable?.rewardBdt ?? safeDailyBonus[0]?.rewardBdt ?? 2.0;
  
  // Calculate highest ad reward from configured ad networks
  const maxAdReward = safeAdProviders.length > 0 
    ? Math.max(...safeAdProviders.map((a) => a.rewardBdt)) 
    : 3.0;

  // Active referral commission rule from admin settings
  const referralRewardBdt = referralConfig?.commissionAmountBdt ?? 15.0;
  
  // Minimum withdrawal limit from admin settings
  const minWithdrawBdt = withdrawalSettings?.minWithdrawBdt ?? 900;

  const handleConfirm = () => {
    triggerHaptic('medium');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="welcome-popup-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleConfirm();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none overflow-y-auto"
        >
          <motion.div
            id="welcome-popup-container"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1], // Gentle spring curve, no aggressive bounce
            }}
            className="relative w-full max-w-sm my-auto rounded-[24px] bg-[#141416] border border-[#26262B] shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]"
          >
          {/* Subtle Ambient Top Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-28 bg-[#00E5FF]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Scrollable Content Container */}
          <div className="p-5 overflow-y-auto space-y-4 text-[#EDEDED] relative z-10 scrollbar-none">
            
            {/* Header Section */}
            <div className="text-center space-y-1.5 pt-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold"
              >
                <span>👋 Assalamu Alaikum</span>
              </motion.div>

              <h2 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5 pt-1">
                <span>Welcome to</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#70F3FF]">
                  Quick Earn
                </span>
              </h2>

              <p className="text-xs text-[#A0A0A5] leading-relaxed px-2">
                আপনার earning journey শুরু করুন এবং নিয়ম মেনে নিরাপদে Earn করুন।
              </p>
            </div>

            {/* Info Items List */}
            <div className="space-y-2 pt-1">
              
              {/* 1. Login Bonus */}
              <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#232328] flex items-center justify-between gap-3 hover:border-[#00E5FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>Login Bonus</span>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                    <p className="text-[11px] text-[#8E8E93] leading-tight mt-0.5">
                      প্রতিদিন Login করে Daily Bonus নিন
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    +৳{nextBonusAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 2. Ad Reward */}
              <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#232328] flex items-center justify-between gap-3 hover:border-[#00E5FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Ad Reward
                    </div>
                    <p className="text-[11px] text-[#8E8E93] leading-tight mt-0.5">
                      Available Ads complete করে Earn করুন
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-lg border border-[#00E5FF]/20">
                    Up to ৳{maxAdReward.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 3. Referral Reward */}
              <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#232328] flex items-center justify-between gap-3 hover:border-[#00E5FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Referral
                    </div>
                    <p className="text-[11px] text-[#8E8E93] leading-tight mt-0.5">
                      বন্ধুদের Invite করে Commission পান
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-black font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20 whitespace-nowrap">
                    ৳{referralRewardBdt.toFixed(0)} / Ref
                  </span>
                </div>
              </div>

              {/* 4. Minimum Withdraw */}
              <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#232328] flex items-center justify-between gap-3 hover:border-[#00E5FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Minimum Withdraw
                    </div>
                    <p className="text-[11px] text-[#8E8E93] leading-tight mt-0.5">
                      bKash / Nagad / Rocket / Upay
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    ৳{minWithdrawBdt}
                  </span>
                </div>
              </div>

            </div>

            {/* 5. Important Security Notice */}
            <div className="p-3.5 rounded-2xl bg-[#1E1616] border border-rose-500/25 space-y-1.5">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>🛡️ Important Security Rules</span>
              </div>
              <ul className="space-y-1 text-[11px] text-[#C4C4CC] leading-relaxed pl-1">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>VPN/Proxy ব্যবহার করে কাজ করবেন না।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>একাধিক account বা suspicious activity করলে account restriction হতে পারে।</span>
                </li>
              </ul>
            </div>

            {/* Confirmation Button */}
            <div className="pt-2">
              <motion.button
                id="welcome-confirm-btn"
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirm}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0A0A0B] font-black text-sm shadow-lg shadow-[#00E5FF]/25 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ঠিক আছে</span>
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </motion.button>
            </div>

          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
