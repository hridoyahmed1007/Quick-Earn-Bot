import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Settings, ShieldAlert, CheckCircle2, DollarSign, Clock, RefreshCw, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLeaderboardControlModalProps {
  onClose: () => void;
}

export const AdminLeaderboardControlModal: React.FC<AdminLeaderboardControlModalProps> = ({ onClose }) => {
  const { language, showToast } = useApp();

  const [dailyEnabled, setDailyEnabled] = useState(true);
  const [weeklyEnabled, setWeeklyEnabled] = useState(true);
  const [tieBreaker, setTieBreaker] = useState<'earnings' | 'time' | 'activity'>('earnings');
  const [rewardPoolDaily, setRewardPoolDaily] = useState('1750');

  const [payouts] = useState([
    { id: 'pay_01', winner: '@sohel_rana_99', rank: '#1', period: 'Today Daily', amount: '৳1,000', status: 'Paid', txn: 'TXN-LEAD-8821' },
    { id: 'pay_02', winner: '@sumon_barisal', rank: '#2', period: 'Today Daily', amount: '৳500', status: 'Paid', txn: 'TXN-LEAD-8822' },
    { id: 'pay_03', winner: '@nadiya_sultana', rank: '#3', period: 'Today Daily', amount: '৳250', status: 'Pending', txn: 'TXN-LEAD-8823' },
  ]);

  const handleSaveSettings = () => {
    showToast(
      language === 'bn' ? 'কনফিগারেশন সংরক্ষিত' : 'Settings Saved',
      language === 'bn' ? 'লিডারবোর্ড কন্ট্রোল সেটিংস আপডেট করা হয়েছে।' : 'Leaderboard settings updated successfully.',
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#121214] border border-[#232326] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#232326] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'এডমিন লিডারবোর্ড কন্ট্রোল' : 'Admin Leaderboard Settings'}
              </h3>
              <p className="text-[10px] text-[#8E8E93]">
                {language === 'bn' ? 'রিওয়ার্ড পুল, টাই-ব্রেকার ও অ্যান্টি-ফ্রড ফিল্টার' : 'Reward pools, tie-breakers & distribution management'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1C1C1F] text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles & Settings */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-[#232326] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Daily Leaderboard Competition</p>
              <p className="text-[10px] text-[#8E8E93]">Automatically resets at 00:00 UTC daily</p>
            </div>
            <button
              onClick={() => setDailyEnabled(!dailyEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                dailyEnabled ? 'bg-[#00E5FF]' : 'bg-[#2A2A2E]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-black transition-transform ${
                  dailyEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-[#232326] space-y-2">
            <label className="text-xs font-bold text-white block">Tie-Breaker Priority System</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['earnings', 'time', 'activity'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTieBreaker(mode)}
                  className={`py-2 rounded-xl border text-[11px] font-bold capitalize transition-all ${
                    tieBreaker === mode
                      ? 'bg-[#00E5FF15] border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-[#131315] border-[#232326] text-[#8E8E93]'
                  }`}
                >
                  {mode === 'earnings' ? 'Verified Income' : mode === 'time' ? 'Earliest Time' : 'Task Activity'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-[#232326] space-y-2">
            <label className="text-xs font-bold text-white block">Daily Prize Pool Allocation (BDT)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#00E5FF]">৳</span>
              <input
                type="number"
                value={rewardPoolDaily}
                onChange={(e) => setRewardPoolDaily(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131315] border border-[#232326] text-white text-xs font-bold focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          </div>
        </div>

        {/* Payout Distribution History */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-[#232326] space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Leaderboard Reward Payouts Ledger</span>
            </span>
            <span className="text-[10px] text-[#8E8E93]">Live Audit</span>
          </h4>

          <div className="space-y-2 text-xs">
            {payouts.map((p) => (
              <div key={p.id} className="p-2.5 rounded-xl bg-[#131315] border border-[#232326] flex items-center justify-between">
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>{p.winner}</span>
                    <span className="text-[10px] text-[#00E5FF] font-bold">{p.rank}</span>
                  </p>
                  <p className="text-[9px] text-[#8E8E93]">{p.txn} • {p.period}</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-white block">{p.amount}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      p.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full py-3 rounded-2xl bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0A0A0B] font-bold text-xs shadow-lg transition-all"
        >
          {language === 'bn' ? 'পরিবর্তন কনফার্ম করুন' : 'Save Leaderboard Controls'}
        </button>
      </motion.div>
    </div>
  );
};
