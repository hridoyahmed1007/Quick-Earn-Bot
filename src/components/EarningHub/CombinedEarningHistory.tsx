import React, { useState, useMemo } from 'react';
import { History, PlayCircle, Briefcase, Radio, CheckCircle2, Hourglass, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CombinedEarningHistory: React.FC = () => {
  const { earningTransactions, language } = useApp();
  const [filterSource, setFilterSource] = useState<'all' | 'ads' | 'micro_jobs' | 'channel_tasks'>('all');

  const filteredHistory = useMemo(() => {
    return earningTransactions.filter((item) => {
      if (filterSource !== 'all' && item.sourceType !== filterSource) {
        return false;
      }
      return true;
    });
  }, [earningTransactions, filterSource]);

  const renderBadgeIcon = (source: 'ads' | 'micro_jobs' | 'channel_tasks') => {
    switch (source) {
      case 'ads':
        return <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'micro_jobs':
        return <Briefcase className="w-3.5 h-3.5 text-teal-400" />;
      case 'channel_tasks':
        return <Radio className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-[#161618] border border-[#232326] rounded-2xl p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#232326] pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#8E8E93]" />
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? 'আর্নিং ট্রানজ্যাকশন লেজার' : 'Earning Transactions Ledger'}
          </h3>
        </div>

        <span className="text-[10px] text-[#8E8E93] bg-[#1F1F22] border border-[#2A2A2E] px-2 py-0.5 rounded-full font-medium">
          {filteredHistory.length} Records
        </span>
      </div>

      {/* Source Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All History' },
          { id: 'ads', label: '🎬 Ads' },
          { id: 'micro_jobs', label: '💼 Jobs' },
          { id: 'channel_tasks', label: '📢 Channels' },
        ].map((f) => {
          const isActive = filterSource === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterSource(f.id as any)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1F1F22] text-white border border-[#2A2A2E]'
                  : 'bg-[#111113] text-[#8E8E93] border border-[#232326] hover:text-white hover:bg-[#1F1F22]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Ledger Items List */}
      <div className="space-y-2 pt-1">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-[#111113] border border-[#232326] rounded-xl p-3 flex items-center justify-between gap-3 text-xs hover:border-[#2A2A2E] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-[#161618] border border-[#232326] rounded-lg shrink-0">
                  {renderBadgeIcon(item.sourceType)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{item.title}</div>
                  <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] mt-0.5">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span className="font-mono text-[#8E8E93]">{item.txnCode}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-bold text-emerald-300 text-sm">
                  +৳{item.amountBdt.toFixed(2)}
                </div>
                {item.status === 'completed' ? (
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Completed
                  </span>
                ) : item.status === 'pending' ? (
                  <span className="text-[10px] text-amber-300 font-semibold flex items-center justify-end gap-0.5">
                    <Hourglass className="w-2.5 h-2.5" />
                    Pending
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-semibold flex items-center justify-end gap-0.5">
                    <XCircle className="w-2.5 h-2.5" />
                    Rejected
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-emerald-300/60">
            No transaction records found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};
