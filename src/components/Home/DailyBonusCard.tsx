import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, CheckCircle2, Sparkles, Clock, X, ShieldCheck, Zap, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

export const DailyBonusCard: React.FC = () => {
  const { dailyBonus, claimDailyBonus, user } = useApp();

  const claimableDay = dailyBonus.find((d) => d.isCurrentDay && !d.isClaimed);
  const isClaimedToday = !claimableDay;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [justClaimed, setJustClaimed] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '05',
    minutes: '42',
    seconds: '18',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 0);

      const diffMs = nextMidnight.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor(diffMs / (1000 * 60 * 60));
      const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const rewardBdt = claimableDay ? claimableDay.rewardBdt : 25.0;
  const currentDayNum = claimableDay ? claimableDay.dayNumber : (user.streakDays % 7) + 1;

  const handleClaim = () => {
    if (!claimableDay) return;
    triggerHaptic('success');
    setJustClaimed(true);
    claimDailyBonus(claimableDay.dayNumber);
    setTimeout(() => {
      setJustClaimed(false);
    }, 2000);
  };

  const openDetails = () => {
    triggerHaptic('light');
    setIsModalOpen(true);
  };

  return (
    <>
      {/* DAILY BONUS CARD - EXACT SAME COMPACT SIZE WITH PREMIUM FINISH */}
      <div
        id="daily-bonus-card"
        onClick={openDetails}
        className="group relative cursor-pointer p-4 rounded-[22px] bg-gradient-to-r from-[#18191E] via-[#141518] to-[#101114] border border-[#272A33] hover:border-[#383C49] shadow-xl overflow-hidden transition-all duration-300 active:scale-[0.99]"
      >
        {/* Top Shimmer Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

        {/* Ambient Glows */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#00E5FF]/5 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          {/* Left Side: Glowing Icon & Bonus Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* 3D Gift Box Icon Container */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Gift className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              {!isClaimedToday && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                  <span>🎁 DAILY BONUS</span>
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  24H
                </span>
              </div>

              <p className="text-[11px] text-[#9496A1] mt-0.5 truncate flex items-center gap-1">
                {isClaimedToday ? (
                  <span className="text-emerald-400/90 font-medium">Bonus Claimed ✓</span>
                ) : (
                  <span>ট্যাপ করে ক্লেইম করুন</span>
                )}
              </p>

              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-black text-[#00E5FF] font-mono drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                  +৳{rewardBdt.toFixed(0)} BDT
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: CTA Button or Claimed Status */}
          <div className="shrink-0">
            {claimableDay ? (
              <motion.button
                id="btn-claim-daily-bonus"
                whileTap={{ scale: 0.94 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openDetails();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] hover:from-[#70F3FF] hover:to-[#00E5FF] text-[#0A0A0B] font-black text-[11px] shadow-[0_0_15px_rgba(0,229,255,0.35)] transition-all flex items-center gap-1.5 active:opacity-90"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLAIM</span>
              </motion.button>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-bold flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Bonus Claimed ✓</span>
                </span>
                <span className="text-[9.5px] text-[#8E909B] flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5 text-[#00E5FF]" />
                  Next in {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL: DETAILS IN BENGALI & INSTANT CLAIM */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            id="daily-bonus-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-[28px] bg-gradient-to-b from-[#1A1B22] via-[#141519] to-[#0E0F12] border border-[#2F323D] p-5.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Top Accent Light */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                id="btn-close-daily-bonus-modal"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#20222B] text-[#9496A1] hover:text-white flex items-center justify-center border border-[#2F323D] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Icon & Title */}
              <div className="flex flex-col items-center text-center mt-1 mb-4">
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-transparent text-amber-400 border border-amber-400/40 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                  <Gift className="w-8 h-8 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                  {justClaimed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-400 text-black flex items-center justify-center font-black shadow-lg"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>

                <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>দৈনিক বোনাস রিওয়ার্ড</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Day {currentDayNum}
                  </span>
                </h2>

                <p className="text-xs text-[#9E9EA7] mt-1">
                  প্রতি ২৪ ঘণ্টায় নিয়মিত ফ্রি বোনাস সংগ্রহ করুন
                </p>
              </div>

              {/* Bonus Amount Box */}
              <div className="rounded-2xl bg-[#181920] border border-[#2B2E38] p-3.5 mb-4 text-center">
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block">
                  আজকের বোনাস রিওয়ার্ড
                </span>
                <div className="text-2xl font-black text-[#00E5FF] font-mono mt-0.5 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                  +৳{rewardBdt.toFixed(2)} BDT
                </div>
                <span className="text-[10px] text-amber-400 font-semibold mt-0.5 inline-block">
                  + ৫০ গোল্ড রিওয়ার্ড কয়েন
                </span>
              </div>

              {/* Bengali Details List */}
              <div className="space-y-2.5 mb-5 bg-[#121317] p-3.5 rounded-2xl border border-[#232630]">
                <div className="flex items-start gap-2.5 text-left">
                  <Clock className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-[#D1D1D6] leading-relaxed">
                    <strong className="text-white">২৪ ঘণ্টার নিয়ম:</strong> প্রতি ২৪ ঘণ্টা পর পর ১ বার এই বোনাস ক্লেইম করা যাবে।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 text-left">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-[#D1D1D6] leading-relaxed">
                    <strong className="text-white">ইনস্ট্যান্ট জমা:</strong> ক্লেইম বাটনে চাপ দিলে টাকা সরাসরি আপনার মেইন ব্যালেন্সে জমা হবে।
                  </p>
                </div>

                <div className="flex items-start gap-2.5 text-left">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-[#D1D1D6] leading-relaxed">
                    <strong className="text-white">স্ট্রিক রিওয়ার্ড:</strong> একটানা প্রতিদিন ক্লেইম করলে বোনাসের পরিমাণ ধাপে ধাপে বৃদ্ধি পাবে।
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {claimableDay ? (
                <motion.button
                  id="btn-modal-confirm-claim"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleClaim}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] via-teal-400 to-[#00B8D4] hover:from-[#70F3FF] hover:to-[#00E5FF] text-[#0A0A0B] font-black text-xs shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ইনস্ট্যান্ট বোনাস নিন (+৳{rewardBdt.toFixed(2)})</span>
                </motion.button>
              ) : (
                <div className="space-y-2">
                  <div className="w-full py-3 px-4 rounded-xl bg-[#1C1E26] text-[#A1A1AA] border border-[#2D303B] font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>আজকের বোনাস ক্লেইম সম্পন্ন হয়েছে</span>
                  </div>
                  <div className="text-center text-[11px] text-[#71717A] font-mono flex items-center justify-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>পরবর্তী ক্লেইম বাকি: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

