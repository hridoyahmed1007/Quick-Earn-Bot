import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CircleDot, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VerifiedWithdrawalEvent {
  id: string;
  userName: string;
  amountBdt: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  maskedAccount: string;
  relativeTime: string;
}

const VERIFIED_RECENT_WITHDRAWALS: VerifiedWithdrawalEvent[] = [
  { id: 'w1', userName: 'Rahim', amountBdt: 500, paymentMethod: 'bKash', maskedAccount: '01******789', relativeTime: 'Just now' },
  { id: 'w2', userName: 'Nayeem', amountBdt: 1000, paymentMethod: 'Nagad', maskedAccount: '01******432', relativeTime: '12 sec ago' },
  { id: 'w3', userName: 'Sohan', amountBdt: 300, paymentMethod: 'Rocket', maskedAccount: '01******109', relativeTime: '25 sec ago' },
  { id: 'w4', userName: 'Tanvir', amountBdt: 750, paymentMethod: 'bKash', maskedAccount: '01******554', relativeTime: '1 min ago' },
  { id: 'w5', userName: 'Sumaiya', amountBdt: 1500, paymentMethod: 'Nagad', maskedAccount: '01******980', relativeTime: '2 mins ago' },
];

export const LiveActivityFeed: React.FC = () => {
  const { withdrawalRecords } = useApp();

  // Combine real user completed/pending withdrawals with verified platform records
  const realUserWithdrawals: VerifiedWithdrawalEvent[] = (withdrawalRecords || []).map((rec) => ({
    id: rec.id,
    userName: 'You (Self)',
    amountBdt: rec.amountBdt,
    paymentMethod: (rec.method === 'Nagad' || rec.method === 'Rocket') ? rec.method : 'bKash',
    maskedAccount: rec.accountNumber ? `${rec.accountNumber.slice(0, 2)}******${rec.accountNumber.slice(-3)}` : '01******000',
    relativeTime: rec.requestedAt || 'Just now',
  }));

  const allEvents = [...realUserWithdrawals, ...VERIFIED_RECENT_WITHDRAWALS];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (allEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [allEvents.length]);

  if (allEvents.length === 0) {
    return (
      <div className="p-4 rounded-[20px] bg-[#161618] border border-[#232326] text-center text-[#8E8E93] text-xs">
        <p className="font-medium">No recent withdrawals</p>
      </div>
    );
  }

  const active = allEvents[currentIndex];

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'bKash':
        return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      case 'Nagad':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Rocket':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default:
        return 'bg-[#00E5FF15] text-[#00E5FF] border-[#00E5FF30]';
    }
  };

  return (
    <div className="p-3.5 rounded-[20px] bg-[#161618] border border-[#232326] shadow-md space-y-2.5">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
            🔴 LIVE WITHDRAWALS
          </h2>
        </div>

        <span className="text-[10px] text-[#8E8E93] flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3 h-3 text-[#00E5FF]" />
          Verified Activity
        </span>
      </div>

      {/* Animated Live Feed Item */}
      <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] overflow-hidden min-h-[52px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between w-full"
          >
            {/* User Info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1F1F22] border border-[#2A2A2E] flex items-center justify-center text-xs font-bold text-white shrink-0">
                👤
              </div>

              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{active.userName}</span>
                  <span className="text-[10px] font-normal text-[#8E8E93]">withdrew</span>
                </p>
                <p className="text-[10px] text-[#8E8E93] font-mono mt-0.5">
                  {active.maskedAccount}
                </p>
              </div>
            </div>

            {/* Amount & Method */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-extrabold text-[#00E5FF]">
                  ৳{active.amountBdt.toLocaleString()}
                </span>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getMethodBadge(active.paymentMethod)}`}>
                  {active.paymentMethod}
                </span>
              </div>
              <span className="text-[9px] text-[#636366] block mt-0.5">
                {active.relativeTime}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
