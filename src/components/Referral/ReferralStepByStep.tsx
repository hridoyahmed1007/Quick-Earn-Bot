import React from 'react';
import { Share2, UserPlus, Coins, Unlock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ReferralStepByStep: React.FC = () => {
  const steps = [
    {
      num: '০১',
      title: 'রেফার লিংক শেয়ার করুন',
      desc: 'আপনার ইউনিক রেফারেল লিংক কপি করে টেলিগ্রাম, ফেসবুক, মেসেঞ্জার বা বন্ধুদের কাছে শেয়ার করুন।',
      icon: Share2,
      badgeColor: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20',
      iconColor: 'text-[#00E5FF]',
    },
    {
      num: '০২',
      title: 'বন্ধু বটে একাউন্ট খুলবে',
      desc: 'আপনার ইনভাইট লিংকে ক্লিক করে বন্ধু টেলিগ্রাম বটে প্রবেশ করবে এবং সাইনআপ সম্পন্ন করবে।',
      icon: UserPlus,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      num: '০৩',
      title: 'কাজ সম্পন্ন ও ইনস্ট্যান্ট কমিশন',
      desc: 'বন্ধু কাজ বা বিজ্ঞাপন দেখলে সরাসরি ইনস্ট্যান্ট ৳১৫ বোনাস এবং প্রতিটি আয়ের ১০% কমিশন আপনার ওয়ালেটে আসবে।',
      icon: Coins,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      num: '০৪',
      title: '১৫টি রেফারে উইথড্র আনলক',
      desc: 'সর্বনিম্ন ১৫ জন একটিভ রেফারেল সম্পন্ন হলেই আপনি সরাসরি বিকাশ, নগদ বা রকেটে টাকা তুলতে পারবেন।',
      icon: Unlock,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div 
      id="referral-step-by-step-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232326] shadow-xl space-y-3.5 relative overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5 gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 truncate">
            <span>🚀 রেফার করে আয় করার সহজ ধাপসমূহ</span>
          </h2>
          <p className="text-[10px] text-[#8E8E93] mt-0.5 truncate">
            Step by step কীভাবে রেফার করবেন এবং আনলিমিটেড ইনকাম করবেন
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-black border border-[#00E5FF]/20 whitespace-nowrap shrink-0">
          ৪টি সহজ ধাপ
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="p-3 rounded-xl bg-[#0E0E10] border border-[#1F1F24] hover:border-[#2A2A2E] transition-all flex items-start gap-3 relative group"
            >
              {/* Step Number & Icon */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${s.badgeColor}`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
                <span className="text-[9px] font-black font-mono text-[#8E8E93] mt-1">
                  ধাপ {s.num}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white">{s.title}</h3>
                  <span className="text-[8px] font-mono font-bold text-[#8E8E93] uppercase">
                    Step {idx + 1}
                  </span>
                </div>
                <p className="text-[10.5px] text-[#8E8E93] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
