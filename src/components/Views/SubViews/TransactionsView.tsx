import React, { useState } from 'react';
import { ArrowLeft, History, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const TransactionsView: React.FC = () => {
  const { transactions, goBack, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'ad' | 'task' | 'referral' | 'withdraw'>('all');

  const filtered = transactions.filter((t) => (filter === 'all' ? true : t.type === filter));

  return (
    <div className="space-y-4 pb-28">
      {/* Back Navigation Bar */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-white">
            {language === 'bn' ? 'লেনদেন বিবরণী' : 'Transaction History'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'bn' ? 'সকল আয় ও ক্যাশআউট স্টেটমেন্ট' : 'Complete earning & withdrawal ledger'}
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {(['all', 'ad', 'task', 'referral', 'withdraw'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl font-bold capitalize shrink-0 transition-all ${
              filter === tab
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
            No transactions found for this filter.
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  {tx.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                </span>
                <div>
                  <p className="font-bold text-white">{tx.title}</p>
                  <p className="text-[10px] text-slate-400">
                    {tx.timestamp} {tx.accountNumber ? `• ${tx.accountNumber}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-black ${
                    tx.type === 'withdraw' ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {tx.type === 'withdraw' ? '-' : '+'}৳{tx.amountBdt.toFixed(2)}
                </span>
                <span className="text-[9px] block text-slate-500 capitalize">{tx.status}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
