import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, AlertCircle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdRulesAndNotice: React.FC = () => {
  const { language } = useApp();

  const rules = [
    'Eligible advertisement সিলেক্ট বা বেছে নিন।',
    'Advertisement বা ভিডিওটি নির্ধারিত সময় সম্পূর্ণ দেখুন।',
    'Server verification এবং anti-fraud প্রক্রিয়ার জন্য অপেক্ষা করুন।',
    'সফল Verification সম্পন্ন হলে Instant Reward ব্যালেন্সে যোগ হবে।',
    'Daily limit এবং provider cooldown নিয়মাবলী মেনে চলুন।',
  ];

  return (
    <div className="space-y-3">
      {/* Rules Card */}
      <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00E5FF10] text-[#00E5FF] border border-[#00E5FF20]">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              How Ads Earning Works 💡
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              বিজ্ঞাপন দেখে আয় করার সহজ নিয়মাবলী
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#EDEDED]">
              <span className="w-5 h-5 rounded-full bg-[#1F1F22] border border-[#2A2A2E] text-[#00E5FF] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
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
            Important Notice • গুরুত্বপূর্ণ তথ্য
          </h4>
        </div>
        <p className="text-[11px] text-[#8E8E93] leading-relaxed pl-1">
          «Note: সব advertisement প্রতিবার available নাও থাকতে পারে। Provider availability, eligibility এবং network rules অনুযায়ী ad inventory পরিবর্ধন হতে পারে।»
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
