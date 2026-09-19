import React from 'react';
import { useApp } from '../../context/AppContext';

export const ReferralListSection: React.FC = () => {
  const { referrals } = useApp();

  // Clean formatted mock list if empty
  const displayList = referrals.length > 0 ? referrals : [
    { id: '1', username: 'Rahim', lifecycleStatus: 'qualified', commissionEarnedBdt: 50.0 },
    { id: '2', username: 'Nayeem', lifecycleStatus: 'joined', commissionEarnedBdt: 0.0 },
  ];

  const formatDisplayName = (raw: string) => {
    if (!raw) return 'User';
    let clean = raw.replace('@', '');
    clean = clean.split('_')[0];
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          My Referrals
        </h3>
        <span className="text-[10px] font-bold text-[#8E8E93] bg-[#111113] px-2 py-0.5 rounded-full border border-[#1C1C1F]">
          {displayList.length} Members
        </span>
      </div>

      <div className="space-y-2">
        {displayList.map((ref) => {
          const isQualified = ref.lifecycleStatus === 'qualified' || (ref.commissionEarnedBdt && ref.commissionEarnedBdt > 0);
          const displayName = formatDisplayName(ref.username);
          const initial = displayName.charAt(0).toUpperCase();

          return (
            <div
              key={ref.id}
              className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between gap-3 text-xs"
            >
              {/* User Avatar & Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1F1F22] border border-[#2A2A2E] text-[#00E5FF] font-bold text-xs flex items-center justify-center shrink-0">
                  {initial}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-white truncate text-xs">
                    {displayName}
                  </div>
                  <div className="mt-0.5">
                    {isQualified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        🟢 Qualified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        🟡 Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Commission Earned */}
              <div className="text-right shrink-0">
                <span className={`font-mono font-black text-xs ${isQualified ? 'text-emerald-400' : 'text-[#8E8E93]'}`}>
                  {isQualified ? `+৳${ref.commissionEarnedBdt > 0 ? ref.commissionEarnedBdt.toFixed(0) : '50'}` : '৳0'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
