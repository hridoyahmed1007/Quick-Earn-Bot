import React from 'react';
import { Coins } from 'lucide-react';

export const ReferralCommissionCard: React.FC = () => {
  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-2">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-[#00E5FF10] text-[#00E5FF] border border-[#00E5FF20]">
          <Coins className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Referral Commission
        </h3>
      </div>

      <p className="text-xs text-[#8E8E93] leading-relaxed pl-1">
        প্রতিটি qualified referral-এর জন্য আপনি <span className="font-bold text-emerald-400">৳৫০ commission</span> পাবেন।
      </p>
    </div>
  );
};
