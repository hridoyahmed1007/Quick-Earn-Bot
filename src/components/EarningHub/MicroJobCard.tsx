import React from 'react';
import {
  Facebook,
  Youtube,
  Globe,
  Smartphone,
  FileText,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Hourglass,
  ArrowRight,
  ShieldCheck,
  Camera,
  Link,
  UserCheck,
  Gift,
} from 'lucide-react';
import { MicroJob } from '../../types';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface MicroJobCardProps {
  job: MicroJob;
  onSelectJob: (job: MicroJob) => void;
}

export const MicroJobCard: React.FC<MicroJobCardProps> = ({ job, onSelectJob }) => {
  const { language, earningTransactions, getTierAdjustedReward, profileLevel } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  const rewardCalc = getTierAdjustedReward(job.rewardBdt, job.rewardCoins);

  // Platform icon resolver
  const renderIcon = () => {
    switch (job.platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />;
      case 'android app':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'web portal':
        return <Globe className="w-4 h-4 text-teal-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const getProofLabel = () => {
    switch (job.proofRequirement) {
      case 'screenshot':
        return {
          icon: <Camera className="w-2.5 h-2.5 text-amber-400" />,
          labelBn: 'স্ক্রিনশট প্রুফ',
          labelEn: 'Screenshot Proof',
        };
      case 'url':
        return {
          icon: <Link className="w-2.5 h-2.5 text-teal-400" />,
          labelBn: 'লিংক সাবমিশন',
          labelEn: 'Link Submission',
        };
      case 'username':
        return {
          icon: <UserCheck className="w-2.5 h-2.5 text-indigo-400" />,
          labelBn: 'ইউজারনেম প্রুফ',
          labelEn: 'Username Proof',
        };
      default:
        return {
          icon: <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />,
          labelBn: 'অটো ভেরিফাই',
          labelEn: 'Code Verification',
        };
    }
  };

  const proofInfo = getProofLabel();
  const isCompleted =
    job.status === 'completed' ||
    job.status === 'approved' ||
    job.status === 'pending' ||
    (earningTransactions &&
      earningTransactions.some(
        (tx) => tx.title === job.titleEn || tx.title === job.titleBn || (tx as any).jobId === job.id
      ));

  const handleCardClick = () => {
    triggerHaptic();
    onSelectJob(isCompleted ? { ...job, status: 'completed' } : job);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#141417] border border-[#24242A] hover:border-emerald-500/50 rounded-[20px] px-3.5 py-3 shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer active:scale-[0.99] gap-2.5"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors pointer-events-none -mr-8 -mt-8" />

      <div>
        {/* Row 1: Platform Badge + Difficulty/Status Badges */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 bg-[#1B1B20] border border-[#2B2B33] px-2.5 py-1 rounded-xl shadow-inner">
            {renderIcon()}
            <span className="text-[11px] font-black text-white">
              {job.platform}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {job.status === 'featured' && (
              <span className="text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                HOT
              </span>
            )}
            {job.status === 'new' && (
              <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                NEW
              </span>
            )}
            <span className="text-[10px] font-black bg-[#1B1B20] text-[#9A9AA0] px-2 py-0.5 rounded-lg border border-[#2B2B33] uppercase">
              {job.difficulty === 'easy' ? (isBn ? 'সহজ' : 'EASY') : (isBn ? 'মিডিয়াম' : 'MEDIUM')}
            </span>
          </div>
        </div>

        {/* Row 2: Title */}
        <h4 className="text-[13px] font-black text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors mb-2">
          {isBn ? job.titleBn : job.titleEn}
        </h4>

        {/* Row 3: Bangla Description Snippet Box */}
        <div className="p-2 rounded-xl bg-[#0D0D10] border border-[#1E1E23] text-[11px] text-[#A1A1AA] leading-relaxed mb-2.5">
          <p className="line-clamp-2">
            {isBn ? job.descriptionBn : job.descriptionEn}
          </p>
        </div>

        {/* Row 4: 3-Column Telemetry Box (Duration, Slots, Proof Type) */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#0E0E11] border border-[#1F1F24] text-[10.5px] text-center">
          {/* Duration */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
            <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
              <Clock className="w-2.5 h-2.5 text-emerald-400" />
              <span>{isBn ? 'যাচাই সময়' : 'Verify Time'}</span>
            </span>
            <span className="font-extrabold text-white">
              {job.estimatedTime || '15 sec'}
            </span>
          </div>

          {/* Slots Left */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
            <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
              <Users className="w-2.5 h-2.5 text-[#00E5FF]" />
              <span>{isBn ? 'খালি স্লট' : 'Slots'}</span>
            </span>
            <span className="font-extrabold text-white font-mono">
              {job.slotsLeft} {isBn ? 'টি' : 'left'}
            </span>
          </div>

          {/* Proof Type */}
          <div className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#151519]/70">
            <span className="text-[#71717A] uppercase text-[9px] font-black flex items-center gap-1 mb-0.5">
              {proofInfo.icon}
              <span>{isBn ? 'প্রুফ' : 'Proof'}</span>
            </span>
            <span className="font-extrabold text-amber-400 truncate max-w-full text-[10px]">
              {isBn ? proofInfo.labelBn : proofInfo.labelEn}
            </span>
          </div>
        </div>
      </div>

      {/* Row 4: Card Footer (Reward + Action Button) */}
      <div className="pt-2 border-t border-[#1E1E24] flex items-center justify-between mt-auto gap-2">
        <div>
          <div className="text-[13px] font-black text-emerald-400 flex items-center gap-1 font-mono">
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span>+৳{rewardCalc.finalBdt.toFixed(2)}</span>
            {rewardCalc.hasBonus && (
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                +{rewardCalc.bonusPercent}% {profileLevel.tier}
              </span>
            )}
          </div>
          <div className="text-[9.5px] text-emerald-400/80 font-bold">
            {rewardCalc.hasBonus
              ? (isBn ? `বেস ৳${job.rewardBdt.toFixed(2)} + লেভেল বুস্ট` : `Base ৳${job.rewardBdt.toFixed(2)} + Boost`)
              : (isBn ? 'ইনস্ট্যান্ট ক্যাশ' : 'Instant Cash')}
          </div>
        </div>

        {isCompleted ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onSelectJob({ ...job, status: 'completed' });
            }}
            className="px-3.5 py-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 active:scale-95 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 transition-all shadow-[0_0_10px_rgba(52,211,153,0.15)]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isBn ? 'সম্পন্ন' : 'Complete'}</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic();
              onSelectJob(job);
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#0A0A0B] rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(52,211,153,0.25)] shrink-0"
          >
            <span>START TASK</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
