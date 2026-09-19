import React from 'react';
import { Users, UserCheck, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralStatsGrid: React.FC = () => {
  const { user } = useApp();

  const totalReferrals = user.totalReferrals || 18;
  const qualified = user.activeReferrals || 15;
  const earned = user.referralEarningsBdt || 1250;

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {/* 1. Total Referrals */}
      <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] text-center space-y-1 shadow-sm">
        <div className="flex items-center justify-center gap-1 text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>Total Referrals</span>
        </div>
        <div className="text-xl font-black text-white font-mono">
          {totalReferrals}
        </div>
      </div>

      {/* 2. Qualified */}
      <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] text-center space-y-1 shadow-sm">
        <div className="flex items-center justify-center gap-1 text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Qualified</span>
        </div>
        <div className="text-xl font-black text-emerald-400 font-mono">
          {qualified}
        </div>
      </div>

      {/* 3. Earned */}
      <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] text-center space-y-1 shadow-sm">
        <div className="flex items-center justify-center gap-1 text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Earned</span>
        </div>
        <div className="text-xl font-black text-amber-400 font-mono">
          ৳{earned.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </div>
      </div>
    </div>
  );
};

