import React, { useState } from 'react';
import { ArrowLeft, Wallet, ShieldCheck, CheckCircle2, AlertCircle, Smartphone, CreditCard, ShieldAlert, Users, Clock, Coins } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UI_TEXT } from '../../../utils/translations';
import { triggerHaptic } from '../../../utils/haptics';

export const WithdrawView: React.FC = () => {
  const { user, goBack, language, requestWithdrawal, withdrawalSettings, withdrawalRequirements } = useApp();
  const ui = UI_TEXT[language];
  const isBn = language === 'bn' || language === 'mixed';

  const MIN_WITHDRAW_BDT = withdrawalSettings?.minWithdrawBdt || 900;
  const MIN_REQUIRED_REFERRALS = withdrawalRequirements?.minQualifiedReferrals ?? 15;

  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amountBdt, setAmountBdt] = useState<string>(String(MIN_WITHDRAW_BDT));
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setErrorMessage('');

    if (!accountNumber.trim()) {
      setErrorMessage(isBn ? 'সঠিক ১১ ডিজিটের মোবাইল একাউন্ট নম্বর দিন' : 'Please enter a valid mobile account number.');
      triggerHaptic('warning');
      return;
    }

    const amt = parseFloat(amountBdt);
    if (isNaN(amt) || amt < MIN_WITHDRAW_BDT) {
      setErrorMessage(isBn ? `সর্বনিম্ন উত্তোলন ৳${MIN_WITHDRAW_BDT}.০০ টাকা` : `Minimum cashout is ৳${MIN_WITHDRAW_BDT}.00 BDT.`);
      triggerHaptic('warning');
      return;
    }

    if (user.totalReferrals < MIN_REQUIRED_REFERRALS) {
      setErrorMessage(isBn ? `উইথড্র করতে সর্বনিম্ন ${MIN_REQUIRED_REFERRALS} জন রেফার থাকতে হবে (বর্তমান: ${user.totalReferrals} জন)` : `Minimum ${MIN_REQUIRED_REFERRALS} referrals required.`);
      triggerHaptic('warning');
      return;
    }

    const res = requestWithdrawal(selectedMethod, accountNumber.trim(), amt);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setAccountNumber('');
      goBack();
    }
  };

  const methods = [
    { id: 'bKash', name: 'bKash (বিকাশ)', color: 'border-pink-500/50 bg-pink-500/15 text-pink-400' },
    { id: 'Nagad', name: 'Nagad (নগদ)', color: 'border-orange-500/50 bg-orange-500/15 text-orange-400' },
    { id: 'Rocket', name: 'Rocket (রকেট)', color: 'border-purple-500/50 bg-purple-500/15 text-purple-400' },
    { id: 'Upay', name: 'Upay (উপায়)', color: 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400' },
  ] as const;

  return (
    <div className="space-y-4 pb-28 max-w-lg mx-auto select-none">
      {/* Back Navigation Bar */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1F1F24]">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-[#141416] border border-[#232328] text-[#8E8E93] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-extrabold text-white">Instant Cashout</h2>
          <p className="text-[10px] text-[#8E8E93]">
            {isBn ? 'ইনস্ট্যান্ট টাকা উত্তোলন গেটওয়ে' : 'Instant Payment Processing'}
          </p>
        </div>
      </div>

      {/* Available Balance Banner */}
      <div className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-10 right-0 w-36 h-36 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <span className="text-[9px] text-[#8E8E93] uppercase tracking-wider font-extrabold block">{ui.totalBalance}</span>
          <span className="text-2xl font-black text-[#00E5FF] font-mono mt-0.5 block">৳{user.bdtBalance.toFixed(2)} BDT</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/25 flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5" />
        </div>
      </div>

      {/* Cashout Form */}
      <form onSubmit={handleWithdraw} className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-3.5">
        {/* Method Selection Grid */}
        <div>
          <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1.5">
            {ui.selectMethod}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {methods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedMethod(method.id as any);
                }}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  selectedMethod === method.id
                    ? `${method.color} ring-1 ring-[#00E5FF] shadow-md`
                    : 'border-[#1F1F24] bg-[#0E0E10] text-[#8E8E93] hover:border-[#2A2A2E]'
                }`}
              >
                <span>{method.name}</span>
                {selectedMethod === method.id && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#00E5FF]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
            {ui.enterAccount}
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="017XXXXXXXX"
            maxLength={11}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] focus:border-[#00E5FF] focus:outline-none text-xs text-white placeholder-[#636366] font-mono font-bold"
          />
        </div>

        {/* Amount BDT */}
        <div>
          <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
            {ui.enterAmount}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8E8E93]">৳</span>
            <input
              type="number"
              value={amountBdt}
              onChange={(e) => setAmountBdt(e.target.value)}
              placeholder={String(MIN_WITHDRAW_BDT)}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] focus:border-[#00E5FF] focus:outline-none text-sm text-white font-mono font-bold"
            />
          </div>
          <div className="flex gap-1.5 pt-1.5 overflow-x-auto no-scrollbar">
            {[MIN_WITHDRAW_BDT, MIN_WITHDRAW_BDT + 100, MIN_WITHDRAW_BDT + 500, MIN_WITHDRAW_BDT + 1000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmountBdt(String(val))}
                className="py-1 px-2.5 rounded-lg bg-[#0E0E10] border border-[#1F1F24] text-[10px] font-mono font-bold text-[#8E8E93] hover:text-white shrink-0"
              >
                ৳{val}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] font-black text-xs flex items-center justify-center gap-2 shadow-lg glow-cyan active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>উইথড্র রিকোয়েস্ট সাবমিট করুন</span>
        </button>
      </form>

      {/* Rules Card */}
      <div className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-2.5">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
          <ShieldAlert className="w-4 h-4" />
          <span>উইথড্রর প্রধান নিয়মাবলী (Withdrawal Rules)</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-[#8E8E93]">
          <p className="flex items-center gap-1.5 text-white">
            <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>১. সর্বনিম্ন উত্তোলন <strong>৳{MIN_WITHDRAW_BDT}.০০ টাকা</strong>।</span>
          </p>
          <p className="flex items-center gap-1.5 text-white">
            <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>২. উইথড্র করার জন্য <strong>কমপক্ষে {MIN_REQUIRED_REFERRALS}টি রেফার</strong> থাকতে হবে।</span>
          </p>
          <p className="flex items-center gap-1.5 text-white">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
            <span>৩. পেমেন্ট প্রসেসিং সময়: ১ থেকে ২৪ ঘণ্টার মধ্যে।</span>
          </p>
        </div>
      </div>
    </div>
  );
};
