import React from 'react';

export const ReferralHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Share your link',
    },
    {
      num: '02',
      title: 'Friend joins',
    },
    {
      num: '03',
      title: 'Qualified হলে commission পান',
    },
  ];

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
        How It Works
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] text-center space-y-1"
          >
            <span className="text-xs font-black text-[#00E5FF] font-mono block">
              {step.num}
            </span>
            <span className="text-[11px] font-semibold text-white block leading-tight">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
