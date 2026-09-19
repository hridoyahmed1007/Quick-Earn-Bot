import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, FileText, CheckCircle2, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_COMMISSION_RECORDS } from '../../data/mockData';
import { CommissionLedgerStatus } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

export const ReferralHistoryTabs: React.FC = () => {
  const { referrals } = useApp();
  const [activeTab, setActiveTab] = useState<'members' | 'commissions'>('members');
  const [commissionFilter, setCommissionFilter] = useState<'all' | CommissionLedgerStatus>('all');

  const commissions = MOCK_COMMISSION_RECORDS;

  const filteredCommissions = commissions.filter((c) => {
    if (commissionFilter === 'all') return true;
    return c.status === commissionFilter;
  });

  const getLifecycleTag = (status: string) => {
    switch (status) {
      case 'qualified':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
            Qualified ✓
          </span>
        );
      case 'activated':
        return (
          <span className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 text-[9px] font-bold border border-teal-500/20">
            Activated
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-bold border border-[#00E5FF]/20">
            Joined
          </span>
        );
    }
  };

  const getStatusBadge = (status: CommissionLedgerStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'reversed':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[9px] font-bold border border-rose-500/20 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            Reversed
          </span>
        );
    }
  };

  return (
    <div 
      id="referral-history-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-3.5 relative overflow-hidden"
    >
      {/* Tabs Switcher Header */}
      <div className="flex items-center p-1 rounded-xl bg-[#0E0E10] border border-[#1F1F24]">
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('members');
          }}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'members'
              ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>রেফারেল মেম্বার ({referrals.length})</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('commissions');
          }}
          className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'commissions'
              ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
              : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>কমিশন লেজার ({commissions.length})</span>
        </button>
      </div>

      {/* Tab 1: Referral Members */}
      {activeTab === 'members' && (
        <div className="space-y-1.5">
          {referrals.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-[#0E0E10] border border-[#1F1F24]">
              <p className="text-xs text-[#8E8E93]">এখনও কোনো রেফারেল মেম্বার যুক্ত হয়নি।</p>
            </div>
          ) : (
            referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#18181C] border border-[#232328] text-white font-mono font-bold text-xs flex items-center justify-center">
                    {(ref.username || 'User').replace('@', '').charAt(0).toUpperCase() || 'U'}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{ref.username}</span>
                      <span className="text-[8px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-1 py-0.2 rounded">L{ref.level}</span>
                    </div>
                    <span className="text-[9px] text-[#8E8E93] block">
                      Joined: {ref.joinedAt}
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  {getLifecycleTag(ref.lifecycleStatus || 'qualified')}
                  <span className="text-[10px] font-mono font-bold text-emerald-400 block pt-0.5">
                    +৳{ref.commissionEarnedBdt.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Commission History Ledger */}
      {activeTab === 'commissions' && (
        <div className="space-y-2">
          {/* Commission Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {(['all', 'approved', 'pending', 'reversed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  triggerHaptic('light');
                  setCommissionFilter(filter);
                }}
                className={`px-2 py-1 rounded-md text-[9px] font-bold capitalize transition-all border shrink-0 ${
                  commissionFilter === filter
                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                    : 'bg-[#0E0E10] text-[#8E8E93] border-[#1F1F24] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {filteredCommissions.map((rec) => (
              <div
                key={rec.id}
                className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-[#00E5FF] font-bold block">
                      {rec.txnCode}
                    </span>
                    <span className="font-bold text-white text-xs block">{rec.type}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-black text-xs block ${
                        rec.status === 'reversed' ? 'text-rose-400 line-through' : 'text-emerald-400'
                      }`}
                    >
                      +৳{rec.amountBdt.toFixed(2)}
                    </span>
                    {getStatusBadge(rec.status)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#8E8E93] pt-1 border-t border-[#1F1F24]">
                  <span>User: {rec.referralUsername}</span>
                  <span>{rec.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
