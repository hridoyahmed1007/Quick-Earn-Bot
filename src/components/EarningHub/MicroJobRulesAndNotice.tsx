import React from 'react';
import { HelpCircle, AlertCircle, ShieldCheck, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MicroJobRulesAndNotice: React.FC = () => {
  const { language } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  const rules = isBn
    ? [
        'Eligible micro job সিলেক্ট বা বেছে নিন।',
        'নির্দেশিকা অনুযায়ী কাজ বা ওয়েবসাইটের লিঙ্ক ওপেন করুন।',
        'লিঙ্কে নির্ধারিত ১০ সেকেন্ড সময় অপেক্ষা করুন।',
        'সফলভাবে Verify Now বাটনে ক্লিক করে ইনস্ট্যান্ট রিওয়ার্ড ব্যালেন্সে বুঝে নিন।',
        'সঠিক তথ্য দিন ও প্ল্যাটফর্মের কাজের নিয়মাবলী মেনে চলুন।',
      ]
    : [
        'Select an eligible micro job from the list.',
        'Open the task/website link following instructions.',
        'Wait for the required 10-second verification time.',
        'Click Verify Now to receive instant reward in your balance.',
        'Follow platform terms and complete authentic tasks.',
      ];

  return (
    <div className="space-y-3 pt-1">
      {/* Rules Card */}
      <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {isBn ? 'How Micro Jobs Earning Works 💡' : 'How Micro Jobs Earning Works 💡'}
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              {isBn ? 'মাইক্রো জব করে আয় করার সহজ নিয়মাবলী' : 'Simple rules to earn from micro jobs'}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#EDEDED]">
              <span className="w-5 h-5 rounded-full bg-[#1F1F22] border border-[#2A2A2E] text-emerald-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <p className="text-[11px] leading-snug">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Card */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            {isBn ? 'Important Notice • গুরুত্বপূর্ণ তথ্য' : 'Important Notice'}
          </h4>
        </div>
        <p className="text-[11px] text-[#8E8E93] leading-relaxed pl-1">
          {isBn
            ? '«Note: সব মাইক্রো জব প্রতিবার available নাও থাকতে পারে। স্লট ক্যাপাসিটি, এলিজিবিলিটি এবং বিজ্ঞাপনদাতার চাহিদামতো নতুন জব প্রতিনিয়ত আপডেট হয়।»'
            : '«Note: Micro jobs availability depends on advertiser slots, region eligibility, and active campaign limits. New tasks are added continuously.»'}
        </p>
      </div>

      {/* Anti-Abuse System Badge */}
      <div className="p-3 rounded-2xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between text-xs text-[#8E8E93]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-semibold">
            Anti-Fraud & Replay Prevention Active
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          PROTECTED
        </span>
      </div>
    </div>
  );
};
