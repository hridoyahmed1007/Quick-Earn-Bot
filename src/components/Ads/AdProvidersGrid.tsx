import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Zap, Tv, Sparkles, MousePointerClick, Send, Clock, ShieldCheck, AlertCircle, Wrench, ArrowRight, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdProvider, ProviderStatus } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

export const AdProvidersGrid: React.FC = () => {
  const { adProviders, openAdPlayer, language, getTierAdjustedReward, profileLevel } = useApp();
  const [cooldowns, setCooldowns] = useState<{ [key: string]: number }>({});
  const isBn = language === 'bn' || language === 'mixed';

  // Simulating real-time cooldown countdown clock for watched providers
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const next = { ...prev };
        let updated = false;
        Object.keys(next).forEach((key) => {
          if (next[key] > 0) {
            next[key] = next[key] - 1;
            updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = (providerKey: string) => {
    switch (providerKey) {
      case 'gigapop':
        return <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'monetag':
        return <Play className="w-5 h-5 text-[#00E5FF] fill-[#00E5FF]" />;
      case 'adsgram':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      default:
        return <Tv className="w-5 h-5 text-[#00E5FF]" />;
    }
  };

  const renderStatusBadge = (status: ProviderStatus, isAvailable: boolean) => {
    if (!isAvailable && status === 'maintenance') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[9px] font-black flex items-center gap-1 shrink-0 whitespace-nowrap">
          <Wrench className="w-2.5 h-2.5" />
          <span>{isBn ? 'রক্ষণাবেক্ষণ' : 'Maintenance'}</span>
        </span>
      );
    }

    if (!isAvailable || status === 'unavailable') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-black flex items-center gap-1 shrink-0 whitespace-nowrap">
          <AlertCircle className="w-2.5 h-2.5" />
          <span>{isBn ? 'সাময়িক বন্ধ' : 'Unavailable'}</span>
        </span>
      );
    }

    if (status === 'checking') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-500/25 text-slate-400 text-[9px] font-black flex items-center gap-1 shrink-0 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-ping" />
          <span>{isBn ? 'যাচাই চলছে' : 'Checking...'}</span>
        </span>
      );
    }

    return (
      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[8.5px] font-black flex items-center gap-1 shrink-0 whitespace-nowrap shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{isBn ? 'সক্রিয় ও প্রস্তুত' : 'Active & Ready'}</span>
      </span>
    );
  };

  const handleWatchClick = (provider: AdProvider) => {
    if (!provider.isAvailable || provider.status !== 'available') return;
    if (provider.completedToday >= provider.dailyLimit) return;
    if (cooldowns[provider.id] && cooldowns[provider.id] > 0) return;

    triggerHaptic();
    openAdPlayer(provider);

    // Set local cooldown simulation
    setCooldowns((prev) => ({
      ...prev,
      [provider.id]: provider.cooldownSec || 20,
    }));
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-black text-white flex items-center gap-1.5">
            <span>{isBn ? '📺 অফিসিয়াল বিজ্ঞাপন নেটওয়ার্ক' : 'Available Ad Networks 📺'}</span>
          </h3>
          <p className="text-[10.5px] text-[#8E8E93]">
            {isBn ? 'ভিডিও বিজ্ঞাপন সম্পূর্ণ দেখে ইনস্ট্যান্ট ওয়ালেট ক্যাশ আর্নিং নিন' : 'Verified official ad provider integrations'}
          </p>
        </div>

        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#18181B] text-[#00E5FF] border border-[#27272D]">
          {adProviders.filter((p) => p.isAvailable).length} {isBn ? 'টি সক্রিয়' : 'Online'}
        </span>
      </div>

      {/* Grid List of Super Premium Medium Cards */}
      <div className="space-y-3">
        {adProviders.map((provider) => {
          const availableCount = Math.max(0, provider.dailyLimit - provider.completedToday);
          const isLimitReached = availableCount === 0;
          const providerCooldown = cooldowns[provider.id] || 0;
          const isDisabled = !provider.isAvailable || provider.status !== 'available' || isLimitReached || providerCooldown > 0;
          const rewardCalc = getTierAdjustedReward(provider.rewardBdt, provider.rewardCoins);

          return (
            <div
              key={provider.id}
              className={`p-4 rounded-[22px] bg-[#141416] border transition-all duration-300 flex flex-col gap-3 shadow-lg relative overflow-hidden group ${
                isDisabled
                  ? 'border-[#222226] opacity-85'
                  : 'border-[#26262C] hover:border-[#00E5FF55] hover:shadow-[0_0_24px_rgba(0,229,255,0.08)]'
              }`}
            >
              {/* Top Accent line & Background subtle glow */}
              {!isDisabled && (
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#00E5FF]/5 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
              )}

              {/* Row 1: Icon + Name + Status + Reward Pill */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-2xl bg-[#1A1A1E] border border-[#2B2B32] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#00E5FF40] transition-colors">
                    {getProviderIcon(provider.providerKey)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[13.5px] font-black text-white group-hover:text-[#00E5FF] transition-colors leading-tight">
                        {provider.name}
                      </h4>
                      {renderStatusBadge(provider.status, provider.isAvailable)}
                    </div>

                    <p className="text-[11px] text-[#9A9AA0] mt-1 leading-snug">
                      {isBn ? provider.descriptionBn : provider.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Reward Pill */}
                <div className="shrink-0 text-right">
                  <div className="text-[12px] font-black text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2.5 py-1 rounded-xl shadow-[0_0_10px_rgba(0,229,255,0.12)] inline-flex items-center gap-1 font-mono">
                    <Gift className="w-3 h-3 text-[#00E5FF]" />
                    <span>+৳{rewardCalc.finalBdt.toFixed(2)}</span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[8.5px] font-black px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 ml-0.5">
                        +{rewardCalc.bonusPercent}%
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[#00E5FF]/80 font-bold block mt-0.5">
                    {rewardCalc.hasBonus
                      ? (isBn ? `বেস ৳${provider.rewardBdt.toFixed(2)} + বুস্ট` : `Base ৳${provider.rewardBdt.toFixed(2)} + Boost`)
                      : (isBn ? 'ইনস্ট্যান্ট ক্যাশ' : 'Instant Cash')}
                  </span>
                </div>
              </div>

              {/* Row 2: 3-Column Telemetry Box (Duration, Remaining, Reward) */}
              <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#0C0C0E] border border-[#1E1E23] text-[10.5px]">
                <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#141417]/70">
                  <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
                    <Clock className="w-2.5 h-2.5 text-[#00E5FF]" />
                    <span>{isBn ? 'বিজ্ঞাপন সময়' : 'Est. Duration'}</span>
                  </span>
                  <span className="font-extrabold text-white">
                    ~{provider.durationSec} {isBn ? 'সেকেন্ড' : 'sec'}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#141417]/70">
                  <span className="text-[#71717A] uppercase text-[9px] font-black mb-0.5">
                    {isBn ? 'দৈনিক লিমিট' : 'Remaining'}
                  </span>
                  <span className="font-extrabold text-white font-mono">
                    {availableCount} / {provider.dailyLimit} {isBn ? 'টি' : ''}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#141417]/70">
                  <span className="text-[#71717A] uppercase text-[9px] font-black text-emerald-400 mb-0.5">
                    {isBn ? 'ইনস্ট্যান্ট আয়' : 'Reward'}
                  </span>
                  <span className="font-black text-emerald-400 font-mono">
                    +৳{rewardCalc.finalBdt.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Row 3: Security Line + Watch Action Button */}
              <div className="flex items-center justify-between pt-1 border-t border-[#1C1C20] gap-2">
                <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {isBn ? 'সার্ভার ভেরিফাইড সিকিউর সেশন' : 'Server Verified Session'}
                  </span>
                </div>

                <motion.button
                  whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                  disabled={isDisabled}
                  onClick={() => handleWatchClick(provider)}
                  className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
                    !provider.isAvailable || provider.status === 'maintenance'
                      ? 'bg-[#222224] text-[#636366] border border-[#2A2A2E] cursor-not-allowed'
                      : isLimitReached
                      ? 'bg-[#222224] text-amber-500/80 border border-amber-500/20 cursor-not-allowed'
                      : providerCooldown > 0
                      ? 'bg-[#18181C] text-[#00E5FF] border border-[#00E5FF35] font-mono cursor-not-allowed text-[11px]'
                      : 'bg-[#00E5FF] hover:bg-[#33EAFF] text-[#0A0A0B] shadow-[0_0_15px_rgba(0,229,255,0.3)] active:scale-95'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 ${isDisabled ? '' : 'fill-current'}`} />
                  <span>
                    {!provider.isAvailable || provider.status === 'maintenance'
                      ? (isBn ? 'রক্ষণাবেক্ষণ' : 'MAINTENANCE')
                      : isLimitReached
                      ? (isBn ? 'দৈনিক লিমিট শেষ' : 'LIMIT REACHED')
                      : providerCooldown > 0
                      ? (isBn ? `${String(providerCooldown).padStart(2, '0')} সে. অপেক্ষা` : `WAIT 00:${String(providerCooldown).padStart(2, '0')}`)
                      : (isBn ? 'বিজ্ঞাপন দেখুন' : 'WATCH AD')}
                  </span>
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
