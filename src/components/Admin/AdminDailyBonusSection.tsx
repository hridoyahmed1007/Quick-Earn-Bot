import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gift,
  Save,
  RefreshCw,
  Sparkles,
  Zap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  TrendingUp,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyBonusConfig } from '../../types';

export const AdminDailyBonusSection: React.FC = () => {
  const {
    dailyBonusConfig,
    fetchDailyBonusConfig,
    adminUpdateDailyBonusConfig,
    language,
    showToast,
  } = useApp();

  const isBn = language === 'bn';

  // Form State
  const [day1, setDay1] = useState<string>(String(dailyBonusConfig.day1RewardBdt || 2.0));
  const [day2, setDay2] = useState<string>(String(dailyBonusConfig.day2RewardBdt || 4.0));
  const [day3, setDay3] = useState<string>(String(dailyBonusConfig.day3RewardBdt || 6.0));
  const [day4, setDay4] = useState<string>(String(dailyBonusConfig.day4RewardBdt || 8.0));
  const [day5, setDay5] = useState<string>(String(dailyBonusConfig.day5RewardBdt || 10.0));
  const [day6, setDay6] = useState<string>(String(dailyBonusConfig.day6RewardBdt || 15.0));
  const [day7, setDay7] = useState<string>(String(dailyBonusConfig.day7RewardBdt || 25.0));
  
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync when dailyBonusConfig changes from server
  useEffect(() => {
    setDay1(String(dailyBonusConfig.day1RewardBdt || 2.0));
    setDay2(String(dailyBonusConfig.day2RewardBdt || 4.0));
    setDay3(String(dailyBonusConfig.day3RewardBdt || 6.0));
    setDay4(String(dailyBonusConfig.day4RewardBdt || 8.0));
    setDay5(String(dailyBonusConfig.day5RewardBdt || 10.0));
    setDay6(String(dailyBonusConfig.day6RewardBdt || 15.0));
    setDay7(String(dailyBonusConfig.day7RewardBdt || 25.0));
  }, [dailyBonusConfig]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDailyBonusConfig();
    setIsRefreshing(false);
    showToast('🔄 Refreshed', 'Daily bonus configuration reloaded.');
  };

  const handleApplyPreset = (tier: 'standard' | 'high' | 'festive') => {
    if (tier === 'standard') {
      setDay1('2.0');
      setDay2('4.0');
      setDay3('6.0');
      setDay4('8.0');
      setDay5('10.0');
      setDay6('15.0');
      setDay7('25.0');
      showToast('⚡ Preset Applied', 'Standard daily bonuses (৳2 - ৳25) loaded. Click Save to apply live.');
    } else if (tier === 'high') {
      setDay1('5.0');
      setDay2('10.0');
      setDay3('15.0');
      setDay4('20.0');
      setDay5('25.0');
      setDay6('35.0');
      setDay7('50.0');
      showToast('⚡ Preset Applied', 'High reward daily bonuses (৳5 - ৳50) loaded. Click Save to apply live.');
    } else if (tier === 'festive') {
      setDay1('10.0');
      setDay2('20.0');
      setDay3('30.0');
      setDay4('40.0');
      setDay5('50.0');
      setDay6('75.0');
      setDay7('100.0');
      showToast('🎉 Preset Applied', 'Festive multiplier bonuses (৳10 - ৳100) loaded. Click Save to apply live.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const d1 = parseFloat(day1);
    const d2 = parseFloat(day2);
    const d3 = parseFloat(day3);
    const d4 = parseFloat(day4);
    const d5 = parseFloat(day5);
    const d6 = parseFloat(day6);
    const d7 = parseFloat(day7);

    if (isNaN(d1) || d1 <= 0 || isNaN(d7) || d7 <= 0) {
      showToast('❌ Invalid Amounts', 'All reward amounts must be positive numbers greater than 0.');
      return;
    }

    setIsSaving(true);
    try {
      await adminUpdateDailyBonusConfig({
        day1RewardBdt: d1,
        day2RewardBdt: d2,
        day3RewardBdt: d3,
        day4RewardBdt: d4,
        day5RewardBdt: d5,
        day6RewardBdt: d6,
        day7RewardBdt: d7,
        dailyLoginBonusAmount: d1,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalWeeklyBdt = (
    (parseFloat(day1) || 0) +
    (parseFloat(day2) || 0) +
    (parseFloat(day3) || 0) +
    (parseFloat(day4) || 0) +
    (parseFloat(day5) || 0) +
    (parseFloat(day6) || 0) +
    (parseFloat(day7) || 0)
  ).toFixed(2);

  const daysList = [
    { day: 1, val: day1, set: setDay1, title: 'Day 1 (Login Bonus)', special: false },
    { day: 2, val: day2, set: setDay2, title: 'Day 2 (Streak)', special: false },
    { day: 3, val: day3, set: setDay3, title: 'Day 3 (Streak)', special: false },
    { day: 4, val: day4, set: setDay4, title: 'Day 4 (Streak)', special: false },
    { day: 5, val: day5, set: setDay5, title: 'Day 5 (Streak)', special: false },
    { day: 6, val: day6, set: setDay6, title: 'Day 6 (Streak)', special: false },
    { day: 7, val: day7, set: setDay7, title: 'Day 7 (Grand Reward)', special: true },
  ];

  return (
    <div id="admin_daily_bonus_section" className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#1E1A14] to-[#141416] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">Daily Bonus & Streak Configuration</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                100% Real-Time
              </span>
            </div>
            <p className="text-xs text-[#A0A0A5] mt-0.5">
              {isBn 
                ? 'ডেইলি বোনাস এবং ৭ দিনের স্ট্রিক রিওয়ার্ড এডমিন থেকে পরিবর্তন করুন। সব ব্যবহারকারী তাৎক্ষণিক নতুন রেট পাবে।'
                : 'Configure 7-day daily bonus and streak cash rewards. Instantly applies across user popups and bonus cards.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A30] text-[#A0A0A5] hover:text-white border border-[#2E2E34] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div className="p-4 rounded-2xl bg-[#141416] border border-[#232326] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-[#8E8E93] font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Preset Configurations:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('standard')}
            className="px-3 py-1.5 rounded-xl bg-[#1E1E24] hover:bg-[#2A2A32] text-xs font-bold text-amber-300 border border-amber-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Standard (৳2 - ৳25)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('high')}
            className="px-3 py-1.5 rounded-xl bg-[#1E1E24] hover:bg-[#2A2A32] text-xs font-bold text-[#00E5FF] border border-[#00E5FF]/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>High Reward (৳5 - ৳50)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('festive')}
            className="px-3 py-1.5 rounded-xl bg-[#1E1E24] hover:bg-[#2A2A32] text-xs font-bold text-emerald-400 border border-emerald-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Festive (৳10 - ৳100)</span>
          </button>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-5 rounded-3xl bg-[#141416] border border-[#232326] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1F1F24] pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>7-Day Streak Rewards Breakdown (BDT)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8E8E93] font-bold block">7-Day Total Pool:</span>
              <span className="text-xs font-mono font-black text-amber-400">৳{totalWeeklyBdt} BDT</span>
            </div>
          </div>

          {/* Grid of 7 days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {daysList.map((d) => (
              <div
                key={d.day}
                className={`p-3.5 rounded-2xl border transition-all ${
                  d.special
                    ? 'bg-gradient-to-br from-amber-500/15 via-[#1E1A14] to-[#16161A] border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'bg-[#18181C] border-[#25252B] hover:border-[#383842]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#A0A0A5] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-lg bg-[#24242A] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                      {d.day}
                    </span>
                    <span>{d.title}</span>
                  </span>
                  {d.special && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/25 text-amber-300 text-[9px] font-extrabold border border-amber-500/30">
                      MEGA
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">৳</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={d.val}
                    onChange={(e) => d.set(e.target.value)}
                    className="w-full pl-7 pr-12 py-2 rounded-xl bg-[#0E0E10] border border-[#232328] focus:border-amber-400 focus:outline-none text-sm text-white font-mono font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8E8E93]">
                    BDT
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mt-1.5 font-mono">
                  <span>Day Reward:</span>
                  <span className="text-emerald-400 font-bold">৳{parseFloat(d.val) || 0} BDT</span>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#1F1F24]">
            <div className="text-[11px] text-[#8E8E93] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Last Updated: <strong className="text-white">{dailyBonusConfig.updatedAt || 'Recently'}</strong> by <strong className="text-white">{dailyBonusConfig.updatedBy || 'ADMIN'}</strong>
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0A0B] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Live Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Apply Daily Bonus Globally</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
