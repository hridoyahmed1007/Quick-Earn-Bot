import React from 'react';
import { Filter, CheckCircle2, ArrowDown } from 'lucide-react';
import { MOCK_REFERRAL_FUNNEL } from '../../data/mockData';

export const ReferralFunnelCard: React.FC = () => {
  const funnel = MOCK_REFERRAL_FUNNEL;

  const steps = [
    { label: '1. Invited', count: funnel.invited, percent: 100, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: '2. Joined', count: funnel.joined, percent: Math.round((funnel.joined / funnel.invited) * 100), color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF10]' },
    { label: '3. Activated', count: funnel.activated, percent: Math.round((funnel.activated / funnel.invited) * 100), color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: '4. Qualified', count: funnel.qualified, percent: Math.round((funnel.qualified / funnel.invited) * 100), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Referral Conversion Funnel</h3>
            <p className="text-[10px] text-[#8E8E93]">User lifecycle conversion breakdown</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          40% Overall Conversion
        </span>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-1">
            <div className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${step.bg}`} />
                <span className="font-bold text-white">{step.label}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#8E8E93]">{step.percent}% Rate</span>
                <span className={`font-mono font-extrabold ${step.color}`}>{step.count} Users</span>
              </div>
            </div>

            {/* Down Arrow separator except last */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center text-[#3A3A3E] py-0.5">
                <ArrowDown className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
