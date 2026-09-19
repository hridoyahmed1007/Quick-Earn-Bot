import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Wallet, ShieldCheck, TrendingUp, ArrowUpRight, Zap, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UI_TEXT } from '../../utils/translations';
import { triggerHaptic } from '../../utils/haptics';

export const BalanceCard: React.FC = () => {
  const { user, language, navigateTo } = useApp();
  const ui = UI_TEXT[language];

  // Animated BDT balance counter
  const springBalance = useSpring(user.bdtBalance, { stiffness: 90, damping: 18 });
  const displayBalance = useTransform(springBalance, (current) => Number(current || 0).toFixed(2));

  // Pulse glow state when balance changes
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    springBalance.set(user.bdtBalance);
    setIsHighlighted(true);
    const timeout = setTimeout(() => setIsHighlighted(false), 1400);
    return () => clearTimeout(timeout);
  }, [user.bdtBalance]);

  const handleWithdrawClick = () => {
    triggerHaptic('medium');
    navigateTo('wallet');
  };

  const handleWalletClick = () => {
    triggerHaptic('light');
    navigateTo('wallet');
  };

  return (
    <div
      className={`relative rounded-[26px] p-5.5 bg-gradient-to-b from-[#18191D] via-[#131417] to-[#0E0F12] border transition-all duration-500 shadow-2xl overflow-hidden ${
        isHighlighted
          ? 'border-[#00E5FF] shadow-[0_0_35px_rgba(0,229,255,0.3)] ring-1 ring-[#00E5FF]/40'
          : 'border-[#26282E] hover:border-[#383B44] shadow-[0_12px_30px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Top Hairline Light Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />

      {/* Ambient Radial Glow Overlays */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#00E5FF]/10 via-emerald-500/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

      {/* Subtle Carbon Tech Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00E5FF 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* 1. TOP HEADER ROW */}
      <div className="relative z-10 flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75 absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 relative" />
          </div>
          <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider font-mono">
            {ui.totalBalance}
          </span>
        </div>

        {/* Security / Instant Guarantee Badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-[#00E5FF]" />
            <span>SECURED</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN BALANCE & TODAY'S EARNING ROW */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-5">
        {/* Left: Big Main Balance */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#00E5FF] drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              ৳
            </span>
            <motion.span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono drop-shadow-md">
              {displayBalance}
            </motion.span>
            <span className="text-xs font-black text-[#00E5FF] tracking-wider px-1.5 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              BDT
            </span>
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span>Instant 24/7 Cashout Available</span>
          </span>
        </div>

        {/* Right: Today's Income Card */}
        <div className="bg-gradient-to-br from-[#1C1E24] to-[#141519] px-3.5 py-2.5 rounded-2xl border border-[#2D313A] shadow-inner text-right min-w-[124px]">
          <span className="text-[9px] text-[#A1A1AA] uppercase tracking-wider font-semibold block">
            {ui.todayEarnings}
          </span>
          <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono flex items-center justify-end gap-1 mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            <span>+৳{user.todayEarnedBdt.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION BUTTONS ROW */}
      <div className="relative z-10 pt-3.5 border-t border-[#23262E] flex items-center justify-between gap-3">
        {/* Secondary CTA: VIEW WALLET */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleWalletClick}
          className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#1C1D22] hover:bg-[#25272E] text-[#E4E4E7] hover:text-white font-bold text-[11px] flex items-center justify-center gap-2 border border-[#2E313A] transition-all shadow-sm active:bg-[#16171B]"
        >
          <Wallet className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>VIEW WALLET</span>
        </motion.button>

        {/* Primary CTA: WITHDRAW */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleWithdrawClick}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] hover:from-[#70F3FF] hover:to-[#00E5FF] text-[#0A0A0B] font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all active:opacity-90"
        >
          <span>WITHDRAW</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
};
