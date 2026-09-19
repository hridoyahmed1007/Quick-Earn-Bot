import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, ShieldCheck, CheckCircle2, Zap, AlertCircle, X } from 'lucide-react';
import { AdProvider } from '../../types';
import { useApp } from '../../context/AppContext';

interface AdSessionModalProps {
  provider: AdProvider | null;
  onClose: () => void;
}

export const AdSessionModal: React.FC<AdSessionModalProps> = ({ provider, onClose }) => {
  const { completeAdReward, language, getTierAdjustedReward, profileLevel } = useApp();
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!provider) {
      setTimeLeft(15);
      setIsVerifying(false);
      setIsCompleted(false);
      return;
    }

    setTimeLeft(provider.durationSec || 15);
    setIsVerifying(false);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Trigger verification
          setIsVerifying(true);
          setTimeout(() => {
            setIsVerifying(false);
            setIsCompleted(true);
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [provider]);

  if (!provider) return null;

  const handleClaimReward = () => {
    completeAdReward(provider.id);
    onClose();
  };

  const totalDuration = provider.durationSec || 15;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-sm bg-[#161618] border border-[#232326] rounded-3xl p-6 shadow-2xl text-center space-y-5 overflow-hidden"
        >
          {/* Top Network Badge */}
          <div className="flex items-center justify-between border-b border-[#232326] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {provider.name}
              </span>
            </div>
            {timeLeft === 0 && isCompleted && (
              <button
                onClick={onClose}
                className="p-1 rounded-full bg-[#1F1F22] text-[#8E8E93] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Ad Player Simulated Screen */}
          <div className="bg-[#111113] border border-[#232326] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
            {/* Background glowing particles */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/10 via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />

            {timeLeft > 0 ? (
              <div className="space-y-3 relative z-10">
                <PlayCircle className="w-12 h-12 text-[#00E5FF] animate-bounce mx-auto" />
                <div>
                  <div className="text-xs text-[#8E8E93] font-medium">
                    {language === 'bn' ? 'বিজ্ঞাপন স্ট্রিম হচ্ছে...' : 'Streaming Sponsored Ad...'}
                  </div>
                  <div className="text-2xl font-black text-white mt-1">
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-48 h-1.5 bg-[#161618] rounded-full overflow-hidden border border-[#232326] mx-auto">
                  <div
                    className="h-full bg-[#00E5FF] transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : isVerifying ? (
              <div className="space-y-3 relative z-10">
                <div className="w-10 h-10 border-3 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin mx-auto" />
                <div className="text-xs text-[#8E8E93] font-semibold">
                  Verifying session with Server API...
                </div>
              </div>
            ) : (
              <div className="space-y-3 relative z-10">
                <CheckCircle2 className="w-12 h-12 text-[#00E5FF] mx-auto animate-bounce" />
                <div>
                  <div className="text-sm font-bold text-white">Ad Complete!</div>
                  <div className="text-xs text-[#8E8E93]">
                    Server verified session TXN-AD-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reward Info */}
          {(() => {
            const rewardCalc = getTierAdjustedReward(provider.rewardBdt, provider.rewardCoins);
            return (
              <>
                <div className="bg-[#111113] border border-[#232326] rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#8E8E93]">
                      Eligible Reward:
                    </span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        +{rewardCalc.bonusPercent}% {profileLevel.tier}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-black text-[#00E5FF] font-mono">
                    +৳{rewardCalc.finalBdt.toFixed(2)} BDT
                  </span>
                </div>

                {/* CTA Action */}
                {isCompleted ? (
                  <button
                    onClick={handleClaimReward}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-950/80 active:scale-98"
                  >
                    {language === 'bn'
                      ? `রিওয়ার্ড গ্রহণ করুন (+৳${rewardCalc.finalBdt.toFixed(2)})`
                      : `CLAIM REWARD (+৳${rewardCalc.finalBdt.toFixed(2)})`}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/80 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Do not close player during countdown</span>
                  </div>
                )}
              </>
            );
          })()}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
