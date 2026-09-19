import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, X, CheckCircle2, Sparkles, Coins, Gift, ShieldCheck, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdWatchState } from '../../types';

export const AdPlayerModal: React.FC = () => {
  const { activeAdModal, closeAdPlayer, completeAdReward, navigateTo, user, language } = useApp();
  
  const [watchState, setWatchState] = useState<AdWatchState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sessionCode, setSessionCode] = useState<string>('');
  const [showExitWarning, setShowExitWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!activeAdModal) return;

    // Generate random mock session code
    const mockCode = `SESS-AD-${Math.floor(100000 + Math.random() * 900000)}`;
    setSessionCode(mockCode);
    const initialDuration = activeAdModal.durationSec || 15;
    setTimeLeft(initialDuration);
    setShowExitWarning(false);

    // Step 1: Preparing...
    setWatchState('preparing');
    const t1 = setTimeout(() => {
      // Step 2: Loading...
      setWatchState('loading');
      const t2 = setTimeout(() => {
        // Step 3: Ready & Watching
        setWatchState('watching');
      }, 800);
      return () => clearTimeout(t2);
    }, 600);

    return () => clearTimeout(t1);
  }, [activeAdModal]);

  // Countdown timer when state is 'watching'
  useEffect(() => {
    if (watchState !== 'watching') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Trigger Verifying phase
          triggerVerification();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [watchState]);

  const triggerVerification = () => {
    setWatchState('verifying');
    const t1 = setTimeout(() => {
      setWatchState('rewarding');
      const t2 = setTimeout(() => {
        setWatchState('completed');
      }, 600);
    }, 1000);
  };

  if (!activeAdModal) return null;

  const totalDuration = activeAdModal.durationSec || 15;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100)
  );

  const handleClaimAndClose = () => {
    completeAdReward(activeAdModal.id);
  };

  const handleContinueWatching = () => {
    completeAdReward(activeAdModal.id);
  };

  const handleGoToHistory = () => {
    completeAdReward(activeAdModal.id);
    navigateTo('ads');
  };

  const handleAttemptClose = () => {
    if (watchState === 'completed' || watchState === 'failed') {
      closeAdPlayer();
    } else {
      setShowExitWarning(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm rounded-[24px] bg-[#161618] border border-[#232326] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between p-3.5 bg-[#111113] border-b border-[#232326]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20]">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">{activeAdModal.name}</h3>
                <p className="text-[9px] font-mono text-[#8E8E93]">
                  Session: {sessionCode || 'SESS-AD-INIT'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-xl bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleAttemptClose}
                className="p-1.5 rounded-xl bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Warning Banner if closing early */}
          {showExitWarning && watchState === 'watching' && (
            <div className="p-3 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-[11px] font-semibold flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Closing early voids reward verification!</span>
              </div>
              <button
                onClick={() => {
                  closeAdPlayer();
                }}
                className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-[10px]"
              >
                Quit
              </button>
            </div>
          )}

          {/* Ad Stage View Container */}
          <div className="relative aspect-video bg-[#0A0A0C] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[#00E5FF08] animate-pulse pointer-events-none" />

            {watchState === 'preparing' || watchState === 'loading' ? (
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <Loader2 className="w-10 h-10 text-[#00E5FF] animate-spin" />
                <h4 className="text-xs font-bold text-white">
                  {watchState === 'preparing' ? 'Preparing Ad Session...' : 'Loading Advertisement...'}
                </h4>
                <p className="text-[10px] text-[#8E8E93]">Establishing verified provider tunnel</p>
              </div>
            ) : watchState === 'watching' ? (
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-[#161618] border-2 border-[#00E5FF] flex items-center justify-center text-[#00E5FF] shadow-lg glow-cyan">
                    <Play className="w-8 h-8 ml-1 fill-[#00E5FF] animate-pulse" />
                  </div>
                  {/* Countdown Timer Badge */}
                  <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-md font-mono">
                    {timeLeft}s
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">
                  {language === 'bn' ? 'বিজ্ঞাপন প্লে হচ্ছে...' : 'Sponsored Ad Stream Active'}
                </h4>
                <p className="text-[10px] text-[#8E8E93] mt-0.5 max-w-[220px]">
                  {language === 'bn' ? activeAdModal.descriptionBn : activeAdModal.descriptionEn}
                </p>
              </div>
            ) : watchState === 'verifying' || watchState === 'rewarding' ? (
              <div className="relative z-10 flex flex-col items-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-[#00E5FF] animate-bounce" />
                <h4 className="text-xs font-bold text-white">
                  {watchState === 'verifying' ? 'Verifying Session Ticket...' : 'Crediting Ledger Balance...'}
                </h4>
                <p className="text-[10px] text-[#8E8E93]">Signing cryptographically verified reward</p>
              </div>
            ) : watchState === 'completed' ? (
              <div className="relative z-10 flex flex-col items-center animate-fade-in space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-1 glow-emerald">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-300">
                  🎉 Reward Verified & Added!
                </h4>
                <p className="text-[11px] font-black text-white font-mono">
                  +৳{activeAdModal.rewardBdt.toFixed(2)} BDT
                </p>
                <p className="text-[10px] text-[#8E8E93]">
                  New Balance: ৳{(user.bdtBalance + activeAdModal.rewardBdt).toFixed(2)} BDT
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center space-y-1">
                <AlertTriangle className="w-10 h-10 text-rose-400" />
                <h4 className="text-xs font-bold text-rose-400">Verification Pending</h4>
                <p className="text-[10px] text-[#8E8E93]">
                  Ad watch could not be fully verified by provider.
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#1F1F22] h-1.5">
            <div
              className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-1.5 transition-all duration-300 shadow-[0_0_8px_#00E5FF]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-[#111113] flex flex-col gap-2">
            {watchState === 'completed' ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleContinueWatching}
                    className="py-2.5 px-3 rounded-xl bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] text-xs font-black transition-all shadow-md glow-cyan flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>WATCH MORE</span>
                  </button>

                  <button
                    onClick={handleGoToHistory}
                    className="py-2.5 px-3 rounded-xl bg-[#1F1F22] hover:bg-[#2A2A2E] text-white border border-[#2A2A2E] text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>VIEW HISTORY</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Coins className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-[9px] text-[#8E8E93]">Claimable Reward</p>
                    <p className="text-xs font-extrabold text-[#00E5FF] font-mono">
                      +৳{activeAdModal.rewardBdt.toFixed(2)} BDT
                    </p>
                  </div>
                </div>

                <button
                  disabled={watchState !== 'completed'}
                  onClick={handleClaimAndClose}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                    watchState === 'completed'
                      ? 'bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] glow-cyan'
                      : 'bg-[#1F1F22] text-[#636366] border border-[#2A2A2E] cursor-not-allowed'
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>CLAIM REWARD</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
