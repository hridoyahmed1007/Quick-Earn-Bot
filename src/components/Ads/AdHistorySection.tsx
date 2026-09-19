import React, { useState } from 'react';
import { motion } from 'motion/react';
import { History, CheckCircle2, Clock, AlertTriangle, Filter, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionItem } from '../../types';

export const AdHistorySection: React.FC = () => {
  const { transactions, language } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // Filter ad transactions
  const adTransactions = transactions.filter((t) => t.type === 'ad');

  const filteredHistory = adTransactions.filter((tx) => {
    // Status filter
    if (selectedStatus !== 'all' && tx.status !== selectedStatus) return false;
    // Provider filter
    if (selectedProvider !== 'all') {
      const matchKey = tx.providerKey || tx.title.toLowerCase();
      if (!matchKey.includes(selectedProvider.toLowerCase())) return false;
    }
    return true;
  });

  const renderStatusBadge = (status: 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" />
            Pending Verification
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Failed / Unverified
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <History className="w-4 h-4 text-[#00E5FF]" />
            Ad History Ledger 📜
          </h3>
          <p className="text-[10px] text-[#8E8E93]">
            Verified transaction log for advertisement rewards
          </p>
        </div>

        <span className="text-[10px] font-bold font-mono text-[#8E8E93]">
          {filteredHistory.length} Records
        </span>
      </div>

      {/* Filter Bars */}
      <div className="space-y-2 bg-[#161618] p-3 rounded-2xl border border-[#232326]">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[10px] text-[#8E8E93] font-semibold shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#00E5FF]" /> Status:
          </span>
          {['all', 'completed', 'pending', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#00E5FF] text-[#0A0A0B]'
                  : 'bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Provider Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-[#232326] no-scrollbar text-xs">
          <span className="text-[10px] text-[#8E8E93] font-semibold shrink-0 mr-1">Provider:</span>
          {['all', 'Gigapop', 'Monetag', 'Relaxgram'].map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvider(prov)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                selectedProvider === prov
                  ? 'bg-amber-500 text-[#0A0A0B]'
                  : 'bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>
      </div>

      {/* History Ledger List */}
      {filteredHistory.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[#161618] border border-[#232326] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#1F1F22] border border-[#2A2A2E] text-[#8E8E93] flex items-center justify-center mx-auto">
            <History className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-white">No Ad History Records Found</p>
          <p className="text-[10px] text-[#8E8E93]">
            Watch advertisement offers to populate your immutable ledger!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] flex items-center justify-between gap-3 hover:border-[#2A2A2E] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#222224] text-[#00E5FF] border border-[#2A2A2E] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{tx.title}</h4>
                    <span className="text-[9px] font-mono text-[#8E8E93] bg-[#222224] px-1.5 py-0.2 rounded border border-[#2A2A2E]">
                      {tx.txnCode || `TXN-AD-${tx.id.slice(-4).toUpperCase()}`}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#8E8E93] mt-0.5 flex items-center gap-2">
                    <span>{tx.timestamp}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">+৳{tx.amountBdt.toFixed(2)} BDT</span>
                  </p>
                </div>
              </div>

              <div>{renderStatusBadge(tx.status)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
