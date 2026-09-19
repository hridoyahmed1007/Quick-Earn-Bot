import React from 'react';
import { Send, Users, Clock, CheckCircle2, Radio, ArrowRight, ShieldCheck, Gift, Bot } from 'lucide-react';
import { ChannelTask } from '../../types';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { TelegramOfficialLogo } from '../Common/TelegramOfficialLogo';

interface ChannelTaskCardProps {
  task: ChannelTask;
  onSelectTask: (task: ChannelTask) => void;
}

export const ChannelTaskCard: React.FC<ChannelTaskCardProps> = ({ task, onSelectTask }) => {
  const { language, getTierAdjustedReward, profileLevel } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  const rewardCalc = getTierAdjustedReward(task.rewardBdt, task.rewardCoins);

  const isCompleted = task.status === 'completed' || task.isJoined;
  const isFull = task.status === 'full';
  const isGroup = task.category === 'group_join';

  const getCategoryLabel = () => {
    if (isGroup) {
      return isBn ? '👥 গ্রুপ জয়েন' : '👥 GROUP JOIN';
    }
    return isBn ? '📢 চ্যানেল জয়েন' : '📢 CHANNEL JOIN';
  };

  return (
    <div
      onClick={() => {
        triggerHaptic();
        onSelectTask(task);
      }}
      className="bg-[#141417] border border-[#24242B] hover:border-blue-500/50 rounded-[20px] px-3.5 py-3 shadow-lg transition-all duration-300 flex flex-col gap-2.5 relative overflow-hidden group cursor-pointer active:scale-[0.99]"
    >
      {/* Background Telegram subtle ambient glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none -mr-8 -mt-8" />

      {/* Row 1: Official Telegram Logo + Category Badge + Title + Reward Pill */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Official Telegram Logo */}
          <div className="shrink-0 mt-0.5">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-[0_4px_14px_rgba(34,158,217,0.38)] border border-sky-400/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <TelegramOfficialLogo className="w-11 h-11" shape="squircle" />
            </div>
          </div>

          {/* Text Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                  isGroup
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                }`}
              >
                {getCategoryLabel()}
              </span>
              <span className="text-[11px] text-white font-black truncate">
                {task.channelName || (isBn ? task.titleBn : task.titleEn)}
              </span>
            </div>
            <p className="text-[10px] text-[#00E5FF] font-mono mt-0.5">
              {task.channelHandle || '@telegram'}
            </p>
          </div>
        </div>

        {/* Reward Pill */}
        <div className="shrink-0 text-right">
          <div className="text-[12px] font-black text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-xl shadow-[0_0_10px_rgba(59,130,246,0.12)] inline-flex items-center gap-1 font-mono">
            <Gift className="w-3 h-3 text-blue-400" />
            <span>+৳{rewardCalc.finalBdt.toFixed(2)}</span>
            {rewardCalc.hasBonus && (
              <span className="text-[8.5px] font-black px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 ml-0.5">
                +{rewardCalc.bonusPercent}%
              </span>
            )}
          </div>
          <span className="text-[9px] text-blue-400/80 font-bold block mt-0.5">
            {rewardCalc.hasBonus
              ? (isBn ? `বেস ৳${task.rewardBdt.toFixed(2)} + বুস্ট` : `Base ৳${task.rewardBdt.toFixed(2)} + Boost`)
              : (isBn ? 'ইনস্ট্যান্ট ক্যাশ' : 'Instant Cash')}
          </span>
        </div>
      </div>

      {/* Row 2: Description Guidance Snippet Box */}
      <div className="p-2 rounded-xl bg-[#0D0D10] border border-[#1E1E23] text-[11px] text-[#A1A1AA] leading-relaxed">
        <p className="line-clamp-2">
          {isBn
            ? (task.descriptionBn || task.instructionsBn?.[0] || 'টেলিগ্রাম চ্যানেলে জয়েন করুন এবং সাথে সাথে ইনস্ট্যান্ট ওয়ালেট বোনাস পান।')
            : (task.descriptionEn || task.instructionsEn?.[0] || 'Join Telegram channel and get verified instant cash reward.')}
        </p>
      </div>

      {/* Row 3: 3-Column Telemetry Box */}
      <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#0E0E11] border border-[#1F1F24] text-[10.5px] text-center">
        {/* Estimated Time */}
        <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
          <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
            <Clock className="w-2.5 h-2.5 text-blue-400" />
            <span>{isBn ? 'যাচাই সময়' : 'Verify Time'}</span>
          </span>
          <span className="font-extrabold text-white">
            {task.estimatedTime || '15 sec'}
          </span>
        </div>

        {/* Remaining Slots */}
        <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
          <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
            <Users className="w-2.5 h-2.5 text-[#00E5FF]" />
            <span>{isBn ? 'স্লট বাকি' : 'Slots'}</span>
          </span>
          <span className="font-extrabold text-white font-mono">
            {task.slotsLeft} {isBn ? 'টি' : 'left'}
          </span>
        </div>

        {/* Verification Method */}
        <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
          <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
            <Bot className="w-2.5 h-2.5 text-emerald-400" />
            <span>{isBn ? 'ভেরিফিকেশন' : 'Verification'}</span>
          </span>
          <span className="font-extrabold text-emerald-400 text-[10px]">
            {isBn ? 'বট অটো-চেক' : 'Bot API Verified'}
          </span>
        </div>
      </div>

      {/* Row 3: Security & Action Button Bar */}
      <div className="pt-2 border-t border-[#1E1E24] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {isBn ? '১০০% অটোমেটিক টেলিগ্রাম বট রিওয়ার্ড' : 'Automated Telegram Bot Payout'}
          </span>
        </div>

        {isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onSelectTask(task);
            }}
            className="px-3.5 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 transition-all shadow-[0_0_10px_rgba(52,211,153,0.15)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isBn ? 'সম্পন্ন' : 'Complete'}</span>
          </button>
        ) : isFull ? (
          <span className="px-3.5 py-2 bg-[#1F1F22] text-[#8E8E93] border border-[#2A2A2E] rounded-xl text-xs font-bold shrink-0">
            {isBn ? 'স্লট শেষ' : 'FULL'}
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onSelectTask(task);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(59,130,246,0.25)] shrink-0"
          >
            <span>START TASK</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
