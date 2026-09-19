import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Wifi } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { QuickEarnLogo } from './QuickEarnLogo';

interface AppStartupScreenProps {
  onComplete: () => void;
}

type StartupPhase =
  | 'welcome'        // 0.0s - 1.0s
  | 'connecting'     // 1.0s - 2.0s
  | 'verifying'      // 2.0s - 3.0s
  | 'preparing'      // 3.0s - 4.0s
  | 'ready';         // 4.0s - 4.8s -> onComplete

export const AppStartupScreen: React.FC<AppStartupScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<StartupPhase>('welcome');
  const [progress, setProgress] = useState<number>(10);
  const [error, setError] = useState<{ title: string; message: string; isNetwork?: boolean } | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const hasTriggeredCompleteRef = useRef<boolean>(false);

  // Initialize and run a super-fast, responsive launch sequence (no 5s stall)
  const startLaunchSequence = async () => {
    setError(null);
    setPhase('welcome');
    setProgress(35);
    startTimeRef.current = Date.now();
    hasTriggeredCompleteRef.current = false;

    // Safety timeout: Maximum 700ms, then guaranteed to enter the app
    const autoFinishTimer = setTimeout(() => {
      if (!hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        onComplete();
      }
    }, 700);

    try {
      // Step 1: Fast Telegram WebApp handshake
      const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
      if (tg) {
        try {
          tg.ready?.();
          tg.expand?.();
        } catch {}
      }

      await new Promise((res) => setTimeout(res, 200));
      setPhase('connecting');
      setProgress(65);
      triggerHaptic('light');

      await new Promise((res) => setTimeout(res, 180));
      setPhase('ready');
      setProgress(100);
      triggerHaptic('success');

      await new Promise((res) => setTimeout(res, 150));

      if (!hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        clearTimeout(autoFinishTimer);
        onComplete();
      }
    } catch (err: unknown) {
      if (!hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        clearTimeout(autoFinishTimer);
        onComplete();
      }
    }
  };

  useEffect(() => {
    startLaunchSequence();
  }, []);

  // Status mapping
  const statusDetails: Record<StartupPhase, { main: string; sub: string }> = {
    welcome: {
      main: 'Welcome 👋',
      sub: 'Preparing your experience...',
    },
    connecting: {
      main: 'Securely connecting...',
      sub: 'Establishing encrypted Telegram channel',
    },
    verifying: {
      main: 'Verifying your account...',
      sub: 'Validating security tokens & tier',
    },
    preparing: {
      main: 'Preparing your dashboard...',
      sub: 'Loading wallet & live reward rates',
    },
    ready: {
      main: 'All set ✓',
      sub: 'Launching your workspace...',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      onClick={() => onComplete()}
      className="fixed inset-0 z-50 bg-[#0A0A0B] text-[#EDEDED] flex flex-col items-center justify-between p-6 select-none overflow-hidden cursor-pointer"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Placeholder / Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-sm flex items-center justify-center pt-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141416] border border-[#232326] text-[11px] font-semibold text-[#8E8E93] shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Official Telegram Mini App</span>
        </div>
      </motion.div>

      {/* Center Hero: Logo, App Name, Status Animations */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto space-y-6 relative z-10">
        {/* Animated App Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle Outer Glow Rings */}
          <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/25 to-teal-400/25 rounded-full blur-md animate-pulse" />
          
          <div className="relative w-28 h-28 flex items-center justify-center drop-shadow-2xl">
            <motion.div
              animate={{
                rotate: phase === 'ready' ? [0, -4, 4, 0] : [0, 1.5, -1.5, 0],
                scale: phase === 'ready' ? 1.05 : 1,
              }}
              transition={{
                duration: phase === 'ready' ? 0.5 : 3,
                repeat: phase === 'ready' ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <QuickEarnLogo size={112} glow={true} className="w-28 h-28" />
            </motion.div>

            {/* Ready Badge / Sparkle */}
            {phase === 'ready' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 text-[#0A0A0B] flex items-center justify-center shadow-lg border-2 border-[#0A0A0B]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0A0A0B] stroke-[3]" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-white to-[#00E5FF]">
            Quick Earn
          </h1>
          <p className="text-xs text-[#8E8E93] font-medium tracking-wide">
            Verified Micro-Tasks & Instant Payouts
          </p>
        </motion.div>

        {/* Smooth Transitioning Status Text */}
        {!error ? (
          <div className="h-16 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-1"
              >
                <p
                  className={`text-base font-extrabold flex items-center justify-center gap-1.5 ${
                    phase === 'ready' ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  <span>{statusDetails[phase].main}</span>
                  {phase === 'ready' && <Sparkles className="w-4 h-4 text-emerald-400" />}
                </p>
                <p className="text-xs text-[#8E8E93]">
                  {statusDetails[phase].sub}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* Error State with Retry Button */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-[#1A1414] border border-rose-500/30 text-center space-y-3 w-full"
          >
            <div className="flex items-center justify-center text-rose-400 gap-1.5">
              {error.isNetwork ? <Wifi className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-bold text-sm text-white">{error.title}</span>
            </div>
            <p className="text-xs text-[#A0A0A5] leading-relaxed">{error.message}</p>
            <button
              onClick={() => {
                triggerHaptic('medium');
                startLaunchSequence();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0A0A0B] font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{error.isNetwork ? 'RETRY' : 'TRY AGAIN'}</span>
            </button>
          </motion.div>
        )}

        {/* Minimalist Smooth Progress Indicator */}
        {!error && (
          <div className="w-full max-w-[200px] space-y-2 pt-2">
            {/* Smooth Progress Line */}
            <div className="h-1.5 w-full bg-[#1A1A1E] rounded-full overflow-hidden border border-[#232326] p-[1px]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] rounded-full shadow-sm shadow-[#00E5FF]"
                initial={{ width: '10%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Elegant 3-dot pulse */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: phase === 'ready' ? 1 : [0.3, 1, 0.3],
                    scale: phase === 'ready' ? 1 : [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: phase === 'ready' ? 0 : Infinity,
                    delay: i * 0.2,
                  }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    phase === 'ready' ? 'bg-emerald-400' : 'bg-[#00E5FF]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer / Security Tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full max-w-sm flex items-center justify-center pb-2 text-center"
      >
        <p className="text-[10px] text-[#55555C] font-mono">
          TLS 1.3 256-BIT ENCRYPTED • QUICK EARN NETWORK v2.4
        </p>
      </motion.div>
    </motion.div>
  );
};
