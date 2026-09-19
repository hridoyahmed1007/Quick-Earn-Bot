import React from 'react';
import { Activity, UserPlus, CheckCircle2, Coins, Gift } from 'lucide-react';
import { MOCK_REFERRAL_ACTIVITIES } from '../../data/mockData';

export const ReferralActivityFeed: React.FC = () => {
  const activities = MOCK_REFERRAL_ACTIVITIES;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'joined':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-400" />;
      case 'activated':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'commission_approved':
        return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Gift className="w-3.5 h-3.5 text-[#00E5FF]" />;
    }
  };

  const getActivityMessage = (item: typeof activities[0]) => {
    switch (item.type) {
      case 'joined':
        return `${item.username} joined via your referral link`;
      case 'activated':
        return `${item.username} activated account (completed first task)`;
      case 'commission_approved':
        return `Referral commission approved: +৳${item.amountBdt?.toFixed(2)} from ${item.username}`;
      case 'milestone_unlocked':
        return `Unlocked Level 2 Milestone Bonus +৳${item.amountBdt?.toFixed(2)}`;
      default:
        return 'Referral event recorded';
    }
  };

  return (
    <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Live Activity Stream</h3>
            <p className="text-[10px] text-[#8E8E93]">Real-time referral & commission logs</p>
          </div>
        </div>

        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Stream Items */}
      <div className="space-y-1.5">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between gap-2 text-xs"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 rounded-lg bg-[#1F1F22] border border-[#2A2A2E] shrink-0">
                {getActivityIcon(item.type)}
              </div>
              <span className="text-white text-[11px] font-medium truncate">
                {getActivityMessage(item)}
              </span>
            </div>

            <span className="text-[10px] font-mono text-[#8E8E93] shrink-0">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
