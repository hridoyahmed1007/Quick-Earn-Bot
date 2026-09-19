import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  ArrowUpRight,
  History,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  ShieldCheck,
  ChevronRight,
  X,
  Lock,
  Coins,
  TrendingUp,
  Info,
  Check,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Users,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { SavedPaymentMethod, WithdrawalRecord, TransactionItem } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';

export const WalletView: React.FC = () => {
  const {
    user,
    language,
    showToast,
    transactions,
    withdrawalRecords,
    savedPaymentMethods,
    savePaymentMethod,
    deletePaymentMethod,
    requestWithdrawal,
    cancelWithdrawal,
    adminAdjustUserBalance,
    adminProcessWithdrawal,
  } = useApp();

  const isBn = language === 'bn' || language === 'mixed';

  // Navigation / View Tab state inside Wallet
  const [activeTab, setActiveTab] = useState<'withdraw' | 'status' | 'ledger' | 'accounts' | 'admin'>('withdraw');

  // Direct Cashout Form State
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [selectedSavedAccount, setSelectedSavedAccount] = useState<SavedPaymentMethod | null>(
    savedPaymentMethods.length > 0 ? savedPaymentMethods[0] : null
  );
  const [accountNumberInput, setAccountNumberInput] = useState<string>('01712345678');
  const [saveAccountCheckbox, setSaveAccountCheckbox] = useState<boolean>(true);
  const [amountInput, setAmountInput] = useState<string>('900');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<WithdrawalRecord | null>(null);

  // Modals & Details
  const [selectedWdDetail, setSelectedWdDetail] = useState<WithdrawalRecord | null>(null);
  const [selectedTxDetail, setSelectedTxDetail] = useState<TransactionItem | null>(null);
  const [showAddAccountModal, setShowAddAccountModal] = useState<boolean>(false);
  const [newMethodType, setNewMethodType] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [newAccountNumInput, setNewAccountNumInput] = useState<string>('');

  // Transaction Filter & Search
  const [txSearchQuery, setTxSearchQuery] = useState<string>('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'ad' | 'task' | 'referral' | 'bonus' | 'withdraw'>('all');

  // Admin Modal Inputs
  const [adminAmt, setAdminAmt] = useState<string>('');
  const [adminReason, setAdminReason] = useState<string>('');

  // Financial Balances & Requirements
  const MIN_WITHDRAW_BDT = 900;
  const MIN_REQUIRED_REFERRALS = 15;
  const pendingBalance = 85.0; // Locked pending proof verification
  const lifetimeTotalEarned = 2450.0;

  // Eligibility Checks
  const isBalanceEligible = user.bdtBalance >= MIN_WITHDRAW_BDT;
  const isReferralEligible = user.totalReferrals >= MIN_REQUIRED_REFERRALS;
  const isFullyEligible = isBalanceEligible && isReferralEligible;

  // Progress Percentages
  const balanceProgress = Math.min(100, Math.round((user.bdtBalance / MIN_WITHDRAW_BDT) * 100));
  const referralProgress = Math.min(100, Math.round((user.totalReferrals / MIN_REQUIRED_REFERRALS) * 100));

  // BD Mobile Validation Helper (013 - 019, 11 digits)
  const validateBdMobile = (num: string): boolean => {
    const cleaned = num.replace(/\s+/g, '').replace(/-/g, '');
    const regex = /^01[3-9]\d{8}$/;
    return regex.test(cleaned);
  };

  // Mask Account helper
  const maskAccount = (num: string): string => {
    if (num.length >= 11) {
      return `${num.slice(0, 3)}******${num.slice(-2)}`;
    }
    return num;
  };

  // Handle Direct Cashout Submission
  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    setErrorMessage('');

    const targetAccount = selectedSavedAccount ? selectedSavedAccount.accountNumber : accountNumberInput.trim();
    const targetMethod = selectedSavedAccount ? selectedSavedAccount.method : selectedMethod;
    const amt = parseFloat(amountInput);

    // 1. Account validation
    if (!targetAccount || !validateBdMobile(targetAccount)) {
      setErrorMessage(
        isBn
          ? 'সঠিক ১১ ডিজিটের মোবাইল একাউন্ট নম্বর দিন (যেমন: 017XXXXXXXX)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number.'
      );
      triggerHaptic('warning');
      return;
    }

    // 2. Amount validation
    if (isNaN(amt) || amt < MIN_WITHDRAW_BDT) {
      setErrorMessage(
        isBn
          ? `সর্বনিম্ন উত্তোলন ৳${MIN_WITHDRAW_BDT}.০০ টাকা হতে হবে।`
          : `Minimum withdrawal amount is ৳${MIN_WITHDRAW_BDT}.00 BDT.`
      );
      triggerHaptic('warning');
      return;
    }

    // 3. Referral Requirement validation
    if (user.totalReferrals < MIN_REQUIRED_REFERRALS) {
      setErrorMessage(
        isBn
          ? `উইথড্র করার জন্য আপনার অন্তত ${MIN_REQUIRED_REFERRALS}টি রেফার থাকতে হবে (বর্তমানে আপনার ${user.totalReferrals}টি রেফার রয়েছে)।`
          : `You must have at least ${MIN_REQUIRED_REFERRALS} referrals to withdraw (Current: ${user.totalReferrals}).`
      );
      triggerHaptic('warning');
      return;
    }

    // 4. Balance check
    if (amt > user.bdtBalance) {
      setErrorMessage(
        isBn
          ? 'আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।'
          : 'Insufficient balance available in wallet.'
      );
      triggerHaptic('error');
      return;
    }

    // Process Withdrawal with Animation
    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestWithdrawal(targetMethod, targetAccount, amt);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        if (!selectedSavedAccount && saveAccountCheckbox) {
          savePaymentMethod(selectedMethod as any, targetAccount);
        }
        const newRecord: WithdrawalRecord = {
          id: `WD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          userId: user.telegramId,
          method: targetMethod as any,
          accountNumber: targetAccount,
          maskedAccount: maskAccount(targetAccount),
          amountBdt: amt,
          feeBdt: 0,
          netAmountBdt: amt,
          status: 'pending',
          requestedAt: 'Just now',
        };
        setSubmissionSuccess(newRecord);
      }
    }, 1200);
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(txSearchQuery.toLowerCase());
    const matchesType = txTypeFilter === 'all' || tx.type === txTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 pb-28 max-w-lg mx-auto select-none">
      {/* ======================================================== */}
      {/* 1. TOP CARD: MEDIUM SIZE SUPER PREMIUM FINANCIAL WALLET */}
      {/* ======================================================== */}
      <div 
        id="wallet-hero-card"
        className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl relative overflow-hidden space-y-3.5"
      >
        {/* Subtle Ambient Top-Right Glow */}
        <div className="absolute -top-10 right-0 w-44 h-44 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Row */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#8E8E93] block">
                FINANCIAL CONTROL CENTER
              </span>
              <h1 className="text-sm font-extrabold text-white leading-tight">
                MY WALLET
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Real-Time Sync</span>
            </span>

            <button
              onClick={() => setActiveTab('admin')}
              className="p-1 rounded-lg bg-[#202024] border border-[#2A2A2E] text-[#8E8E93] hover:text-[#00E5FF] transition-colors"
              title="Admin Panel"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Available Balance Box */}
        <div className="p-3.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] relative z-10 shadow-inner flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold text-[#8E8E93] uppercase tracking-wider block">
              {isBn ? 'এভেলেবল ব্যালেন্স (AVAILABLE BALANCE)' : 'AVAILABLE BALANCE'}
            </span>
            <div className="text-2xl font-black text-[#00E5FF] font-mono tracking-tight flex items-baseline gap-1 mt-0.5">
              <span>৳{user.bdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-[#00E5FF]/70 font-sans font-bold">BDT</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-bold text-[#8E8E93] block">Status</span>
            <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase mt-0.5 border ${
              isFullyEligible 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
            }`}>
              {isFullyEligible ? 'Eligible ✓' : 'Criteria Pending'}
            </span>
          </div>
        </div>

        {/* Medium 3-Column Stats Row */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24]">
            <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
              Pending
            </span>
            <span className="text-xs font-black text-amber-400 font-mono block mt-0.5">
              ৳{pendingBalance.toFixed(2)}
            </span>
            <span className="text-[7px] text-[#8E8E93] block mt-0.5 truncate">Proof Review</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24]">
            <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
              Total Earned
            </span>
            <span className="text-xs font-black text-emerald-400 font-mono block mt-0.5">
              ৳{lifetimeTotalEarned.toFixed(2)}
            </span>
            <span className="text-[7px] text-[#8E8E93] block mt-0.5 truncate">Lifetime</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24]">
            <span className="text-[8px] font-bold text-[#8E8E93] uppercase block truncate">
              Referrals
            </span>
            <span className={`text-xs font-black font-mono block mt-0.5 ${
              isReferralEligible ? 'text-purple-400' : 'text-amber-400'
            }`}>
              {user.totalReferrals} / {MIN_REQUIRED_REFERRALS}
            </span>
            <span className="text-[7px] text-[#8E8E93] block mt-0.5 truncate">
              {isReferralEligible ? '✓ Qualified' : '15 Needed'}
            </span>
          </div>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0E0E10] border border-[#1F1F24] relative z-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'withdraw', label: '💸 Cashout' },
            { id: 'status', label: `📜 Status (${withdrawalRecords.length})` },
            { id: 'ledger', label: '💳 Ledger' },
            { id: 'accounts', label: '⚙️ Accounts' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(t.id as any);
                setSubmissionSuccess(null);
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-extrabold transition-all whitespace-nowrap text-center ${
                activeTab === t.id
                  ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
                  : 'text-[#8E8E93] hover:text-white hover:bg-[#1A1A1E]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. MIDDLE SECTION: DIRECT CASHOUT & METHOD SYSTEM       */}
      {/* ======================================================== */}
      {activeTab === 'withdraw' && (
        <div 
          id="withdraw-console-card"
          className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-4 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black text-white uppercase tracking-wider">
                  Instant Cashout Gateway
                </h2>
                <p className="text-[10px] text-[#8E8E93]">
                  মেথড, একাউন্ট নম্বর ও টাকার পরিমাণ সিলেক্ট করুন
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-bold border border-[#00E5FF]/20">
              0% Fee
            </span>
          </div>

          {/* Submission Success State Banner */}
          {submissionSuccess ? (
            <div className="py-4 text-center space-y-3 bg-[#0E0E10] p-4 rounded-2xl border border-emerald-500/30">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white">উইথড্র রিকোয়েস্ট সফল হয়েছে!</h3>
                <p className="text-[11px] text-[#8E8E93]">
                  পরিমাণ: <span className="font-bold text-[#00E5FF] font-mono">৳{submissionSuccess.amountBdt.toFixed(2)} BDT</span> ({submissionSuccess.method})
                </p>
                <p className="text-[9px] text-[#8E8E93] font-mono">আইডি: {submissionSuccess.id}</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold mt-1 uppercase">
                  STATUS: PENDING 🟡 (১-২৪ ঘণ্টার মধ্যে পাঠানো হবে)
                </span>
              </div>
              <button
                onClick={() => {
                  setSubmissionSuccess(null);
                  setActiveTab('status');
                }}
                className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0B] text-xs font-black shadow-md glow-cyan"
              >
                উইথড্র স্ট্যাটাস দেখুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleCashoutSubmit} className="space-y-3.5">
              {/* Method Selection System */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  ১. পেমেন্ট মেথড নির্বাচন করুন (Payment Method)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bKash', name: 'bKash (বিকাশ)', badge: 'Fast', color: 'border-pink-500/50 bg-pink-500/15 text-pink-400 shadow-pink-500/10' },
                    { id: 'Nagad', name: 'Nagad (নগদ)', badge: 'Instant', color: 'border-orange-500/50 bg-orange-500/15 text-orange-400 shadow-orange-500/10' },
                    { id: 'Rocket', name: 'Rocket (রকেট)', badge: '24/7', color: 'border-purple-500/50 bg-purple-500/15 text-purple-400 shadow-purple-500/10' },
                    { id: 'Upay', name: 'Upay (উপায়)', badge: 'Free', color: 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400 shadow-cyan-500/10' },
                  ].map((m) => {
                    const isSelected = selectedMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setSelectedMethod(m.id as any);
                          setSelectedSavedAccount(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? `${m.color} ring-1 ring-[#00E5FF] shadow-md scale-[1.02]`
                            : 'border-[#1F1F24] bg-[#0E0E10] text-[#8E8E93] hover:border-[#2A2A2E]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 shrink-0" />
                          <span className="text-xs font-black">{m.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account Number Input System */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                    ২. মোবাইল একাউন্ট নম্বর লিখুন (Account Number)
                  </label>
                  {validateBdMobile(accountNumberInput) && (
                    <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Valid BD Number
                    </span>
                  )}
                </div>

                {/* Saved Accounts Quick Chips */}
                {savedPaymentMethods.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    <span className="text-[9px] text-[#8E8E93] whitespace-nowrap shrink-0">Saved:</span>
                    {savedPaymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          setSelectedSavedAccount(pm);
                          setSelectedMethod(pm.method as any);
                          setAccountNumberInput(pm.accountNumber);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold shrink-0 border transition-all ${
                          selectedSavedAccount?.id === pm.id
                            ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                            : 'border-[#1F1F24] bg-[#0E0E10] text-[#8E8E93]'
                        }`}
                      >
                        {pm.method} • {pm.maskedAccount}
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    value={accountNumberInput}
                    onChange={(e) => {
                      setAccountNumberInput(e.target.value);
                      setSelectedSavedAccount(null);
                    }}
                    placeholder="017XXXXXXXX"
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] focus:border-[#00E5FF] focus:outline-none text-xs text-white font-mono font-bold placeholder-[#636366]"
                  />
                </div>
              </div>

              {/* Amount Selection System */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                    ৩. টাকার পরিমাণ সিলেক্ট / টাইপ করুন (Amount)
                  </label>
                  <span className="text-[10px] text-[#8E8E93]">
                    Available: <span className="text-[#00E5FF] font-mono font-bold">৳{user.bdtBalance.toFixed(2)}</span>
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8E8E93]">৳</span>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="900"
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] focus:border-[#00E5FF] focus:outline-none text-sm text-white font-mono font-black"
                  />
                </div>

                {/* Quick Amount Preset Chips */}
                <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                  {['900', '1000', '1500', '2000', 'ALL'].map((val) => {
                    const isAll = val === 'ALL';
                    const targetVal = isAll ? String(Math.floor(user.bdtBalance)) : val;
                    const isSelected = isAll 
                      ? amountInput === String(Math.floor(user.bdtBalance))
                      : amountInput === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setAmountInput(targetVal);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
                            : 'bg-[#0E0E10] border border-[#1F1F24] text-[#8E8E93] hover:text-white hover:border-[#00E5FF]/40'
                        }`}
                      >
                        {isAll ? 'সব (All)' : `৳${val}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conversion / Calculation Summary */}
              <div className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-1 text-[11px]">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>উত্তোলন রিকোয়েস্ট (Requested):</span>
                  <span className="font-mono font-bold text-white">৳{parseFloat(amountInput || '0').toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>ক্যাশআউট চার্জ (Gateway Fee):</span>
                  <span className="font-bold text-emerald-400">৳0.00 (ফ্রি)</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#1F1F24] font-bold">
                  <span className="text-white">আপনি পাবেন (Net Payout):</span>
                  <span className="text-[#00E5FF] font-mono text-sm font-black">
                    ৳{parseFloat(amountInput || '0').toFixed(2)} BDT
                  </span>
                </div>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
                  isSubmitting
                    ? 'bg-[#00E5FF]/50 text-[#0A0A0B] cursor-wait'
                    : 'bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] glow-cyan'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>সিকিউরিটি ভেরিফিকেশন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>উইথড্র রিকোয়েস্ট পাঠান (৳{parseFloat(amountInput || '0').toFixed(0)})</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STATUS & HISTORY TAB                                 */}
      {/* ======================================================== */}
      {activeTab === 'status' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#141416] border border-[#232328] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <span>উইথড্র হিস্ট্রি ও স্ট্যাটাস</span>
            </h3>
            <span className="text-[10px] font-mono text-[#8E8E93]">{withdrawalRecords.length} Items</span>
          </div>

          {withdrawalRecords.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232328]">
              <p className="text-xs text-[#8E8E93]">এখনও কোনো উইথড্র রিকোয়েস্ট নেই।</p>
            </div>
          ) : (
            <div className="space-y-2">
              {withdrawalRecords.map((wd) => (
                <div
                  key={wd.id}
                  onClick={() => setSelectedWdDetail(wd)}
                  className="p-3 rounded-xl bg-[#141416] border border-[#232328] hover:border-[#2A2A2E] cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-black border border-[#00E5FF]/20">
                        {wd.method}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{wd.maskedAccount}</span>
                    </div>

                    <span className="text-xs font-black text-[#00E5FF] font-mono">
                      ৳{wd.amountBdt.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1F1F24]">
                    <span className="text-[#8E8E93] font-mono">{wd.requestedAt}</span>
                    <span
                      className={`font-bold uppercase px-2 py-0.5 rounded-full ${
                        wd.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : wd.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {wd.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. LEDGER TAB                                           */}
      {/* ======================================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#141416] border border-[#232328] space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0E0E10] border border-[#1F1F24] text-xs text-white placeholder-[#636366] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'ad', label: 'Ads' },
                { id: 'task', label: 'Tasks' },
                { id: 'referral', label: 'Referral' },
                { id: 'bonus', label: 'Bonus' },
                { id: 'withdraw', label: 'Withdraw' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTxTypeFilter(f.id as any)}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold shrink-0 transition-all ${
                    txTypeFilter === f.id
                      ? 'bg-[#00E5FF] text-[#0A0A0B]'
                      : 'bg-[#0E0E10] text-[#8E8E93] border border-[#1F1F24]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232328]">
              <p className="text-xs text-[#8E8E93]">কোনো ট্রানজেকশন রেকর্ড পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTxDetail(tx)}
                  className="p-3 rounded-xl bg-[#141416] border border-[#232328] hover:border-[#2A2A2E] cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.type === 'withdraw'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {tx.type === 'withdraw' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white block">{tx.title}</span>
                      <span className="text-[9px] text-[#8E8E93] font-mono block">{tx.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-black font-mono block ${
                        tx.type === 'withdraw' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {tx.type === 'withdraw' ? '-' : '+'}৳{tx.amountBdt.toFixed(2)}
                    </span>
                    <span className="text-[8px] uppercase font-bold text-[#8E8E93]">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ACCOUNTS TAB                                         */}
      {/* ======================================================== */}
      {activeTab === 'accounts' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#141416] border border-[#232328] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#00E5FF]" />
              <span>সংরক্ষিত পেমেন্ট একাউন্ট</span>
            </h3>
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add New</span>
            </button>
          </div>

          {savedPaymentMethods.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232328]">
              <p className="text-xs text-[#8E8E93]">কোনো একাউন্ট সেভ করা নেই।</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedPaymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className="p-3 rounded-xl bg-[#141416] border border-[#232328] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-black border border-[#00E5FF]/20">
                      {pm.method}
                    </span>
                    <div>
                      <span className="text-xs font-mono font-bold text-white block">{pm.maskedAccount}</span>
                      {pm.isDefault && (
                        <span className="text-[8px] text-[#00E5FF] font-semibold">Default ✓</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deletePaymentMethod(pm.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[#8E8E93] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ADMIN TAB                                            */}
      {/* ======================================================== */}
      {activeTab === 'admin' && (
        <div className="p-4 rounded-xl bg-[#141416] border border-rose-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#232328] pb-2">
            <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Admin Balance Adjust</span>
            </h3>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
              ADMIN
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-[#8E8E93] uppercase">
              Manual Balance Adjustment (BDT)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={adminAmt}
                onChange={(e) => setAdminAmt(e.target.value)}
                placeholder="Amount (e.g. 500 or -500)"
                className="flex-1 px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-xs text-white font-mono"
              />
              <input
                type="text"
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="Audit reason..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-xs text-white"
              />
              <button
                onClick={() => {
                  const amt = parseFloat(adminAmt);
                  if (isNaN(amt) || !adminReason.trim()) {
                    showToast('Error', 'Provide valid amount and reason.', 'warning');
                    return;
                  }
                  adminAdjustUserBalance(amt, adminReason);
                  setAdminAmt('');
                  setAdminReason('');
                }}
                className="px-3 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. BOTTOM SECTION: MEDIUM-SIZED ULTRA-PREMIUM RULES CARD */}
      {/* ======================================================== */}
      <div 
        id="withdraw-rules-card"
        className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-b from-[#171722] via-[#121217] to-[#0E0E12] border border-[#262635] shadow-[0_6px_24px_rgba(0,0,0,0.5)] space-y-2.5 relative overflow-hidden"
      >
        {/* Ambient Top Glow Line & Radial Accents */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 via-50% via-[#00E5FF]/40 to-transparent pointer-events-none" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#00E5FF]/06 rounded-full blur-xl pointer-events-none" />

        {/* Rules Card Header */}
        <div className="flex items-center justify-between border-b border-[#22222E] pb-2 relative z-10 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-amber-400/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white uppercase tracking-wide truncate">
                উইথড্রর নিয়ম ও শর্তাবলী
              </h3>
              <p className="text-[10px] text-[#9898A6] truncate">
                টাকা উত্তোলনের শর্ত ও নীতিমালার বিবরণ
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[9px] font-black border border-amber-500/30 uppercase tracking-wider whitespace-nowrap shrink-0">
            MANDATORY
          </span>
        </div>

        {/* Live Eligibility Progress HUD (Medium & Balanced) */}
        <div className="p-2.5 rounded-xl bg-[#0D0D12]/95 border border-[#22222E] space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="font-bold text-white text-[11px] truncate">
              আপনার উইথড্র যোগ্যতা (Eligibility):
            </span>
            <span className={`font-black font-mono px-2 py-0.5 rounded text-[9px] uppercase whitespace-nowrap shrink-0 border ${
              isFullyEligible 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}>
              {isFullyEligible ? '🟢 উইথড্র যোগ্য' : '🟡 শর্ত পূরণ বাকি'}
            </span>
          </div>

          {/* Condition 1: 900 BDT Balance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px] gap-2">
              <span className="text-white font-medium">১. ব্যালেন্স (মিনিমাম ৳{MIN_WITHDRAW_BDT}):</span>
              <span className={`font-mono font-bold whitespace-nowrap shrink-0 ${isBalanceEligible ? 'text-emerald-400' : 'text-amber-300'}`}>
                ৳{user.bdtBalance.toFixed(2)} / ৳{MIN_WITHDRAW_BDT} {isBalanceEligible ? '✓' : `(আরও ৳${Math.max(0, MIN_WITHDRAW_BDT - user.bdtBalance).toFixed(0)} বাকি)`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1C1C26] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBalanceEligible 
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                    : 'bg-gradient-to-r from-amber-500 to-[#00E5FF]'
                }`}
                style={{ width: `${balanceProgress}%` }}
              />
            </div>
          </div>

          {/* Condition 2: 15 Referrals */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px] gap-2">
              <span className="text-white font-medium">২. রেফারেল (মিনিমাম {MIN_REQUIRED_REFERRALS} জন):</span>
              <span className={`font-mono font-bold whitespace-nowrap shrink-0 ${isReferralEligible ? 'text-emerald-400' : 'text-purple-300'}`}>
                {user.totalReferrals} / {MIN_REQUIRED_REFERRALS} জন {isReferralEligible ? '✓' : `(আরও ${Math.max(0, MIN_REQUIRED_REFERRALS - user.totalReferrals)}টি বাকি)`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#1C1C26] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isReferralEligible 
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                    : 'bg-gradient-to-r from-purple-500 to-[#00E5FF]'
                }`}
                style={{ width: `${referralProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Essential Rules List - Medium Height & Crisp Readability */}
        <div className="space-y-1.5 relative z-10">
          {/* Rule 1: 900 TK */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0F0F16]/90 border border-[#20202C] hover:border-emerald-500/30 transition-all flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-white leading-tight">সর্বনিম্ন উত্তোলন ৳৯০০.০০ টাকা</span>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/25 whitespace-nowrap shrink-0">
                  Min ৳900
                </span>
              </div>
              <p className="text-[10px] text-[#A2A2B2] leading-relaxed mt-0.5">
                উইথড্র করার জন্য আপনার মেইন ব্যালেন্সে সর্বনিম্ন ৯০০ টাকা থাকতে হবে।
              </p>
            </div>
          </div>

          {/* Rule 2: 15 Referrals Must */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0F0F16]/90 border border-[#20202C] hover:border-purple-500/30 transition-all flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-white leading-tight">সর্বনিম্ন ১৫টি রেফার অবশ্যই লাগবে</span>
                <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-500/15 px-1.5 py-0.5 rounded border border-purple-500/25 whitespace-nowrap shrink-0">
                  15 Refer Must
                </span>
              </div>
              <p className="text-[10px] text-[#A2A2B2] leading-relaxed mt-0.5">
                টাকা তোলার জন্য আপনার অ্যাকাউন্টে সর্বনিম্ন ১৫ জন সক্রিয় রেফারেল থাকা বাধ্যতামূলক।
              </p>
            </div>
          </div>

          {/* Rule 3: Processing Time */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#0F0F16]/90 border border-[#20202C] hover:border-[#00E5FF]/30 transition-all flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-white leading-tight">পেমেন্ট পাঠানোর সময়সীমা</span>
                <span className="text-[9px] font-mono font-bold text-[#00E5FF] bg-[#00E5FF]/15 px-1.5 py-0.5 rounded border border-[#00E5FF]/25 whitespace-nowrap shrink-0">
                  1-24 Hours
                </span>
              </div>
              <p className="text-[10px] text-[#A2A2B2] leading-relaxed mt-0.5">
                উইথড্র রিকোয়েস্ট পাঠানোর ১ থেকে ২৪ ঘণ্টার মধ্যে বিকাশ, নগদ বা রকেটে টাকা পৌঁছে যাবে।
              </p>
            </div>
          </div>

          {/* Rule 4: Security & Fake Account Warning */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#1A1114]/95 border border-rose-500/25 hover:border-rose-500/40 transition-all flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] font-extrabold text-rose-400 leading-tight">অ্যান্টি-ফ্রড ও ভিপিএন পলিসি</span>
                <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/25 whitespace-nowrap shrink-0">
                  Strict
                </span>
              </div>
              <p className="text-[10px] text-[#A2A2B2] leading-relaxed mt-0.5">
                VPN/Proxy বা ফেক রেফারেল ব্যবহার করলে একাউন্ট স্থায়ীভাবে নিষিদ্ধ ও পেমেন্ট বাতিল হবে।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODALS & POPUPS                                         */}
      {/* ======================================================== */}

      {/* MODAL 1: ADD PAYMENT ACCOUNT MODAL */}
      <AnimatePresence>
        {showAddAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-5 rounded-[22px] bg-[#141416] border border-[#232328] space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#232328] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Add Payment Account</h3>
                <button onClick={() => setShowAddAccountModal(false)} className="text-[#8E8E93] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase block mb-1">Gateway</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['bKash', 'Nagad', 'Rocket'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setNewMethodType(g as any)}
                        className={`py-2 text-xs font-bold rounded-xl border ${
                          newMethodType === g
                            ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                            : 'border-[#1F1F24] bg-[#0E0E10] text-[#8E8E93]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8E8E93] uppercase block mb-1">
                    11-Digit Account Number
                  </label>
                  <input
                    type="text"
                    value={newAccountNumInput}
                    onChange={(e) => setNewAccountNumInput(e.target.value)}
                    placeholder="017XXXXXXXX"
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] text-xs text-white font-mono font-bold focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!validateBdMobile(newAccountNumInput)) {
                      showToast('❌ Invalid Number', 'Please enter a valid 11-digit BD mobile number.', 'warning');
                      return;
                    }
                    savePaymentMethod(newMethodType, newAccountNumInput);
                    setNewAccountNumInput('');
                    setShowAddAccountModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0B] text-xs font-black shadow-md glow-cyan"
                >
                  SAVE ACCOUNT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: WITHDRAWAL RECORD DETAILS & TIMELINE */}
      <AnimatePresence>
        {selectedWdDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-5 rounded-[22px] bg-[#141416] border border-[#232328] space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#232328] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Withdrawal Details</h3>
                <button onClick={() => setSelectedWdDetail(null)} className="text-[#8E8E93] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-1.5">
                  <div className="flex justify-between text-[#8E8E93]">
                    <span>Withdrawal ID</span>
                    <span className="font-mono font-bold text-white">{selectedWdDetail.id}</span>
                  </div>
                  <div className="flex justify-between text-[#8E8E93]">
                    <span>Gateway & Account</span>
                    <span className="font-bold text-white font-mono">{selectedWdDetail.method} • {selectedWdDetail.maskedAccount}</span>
                  </div>
                  <div className="flex justify-between text-[#8E8E93]">
                    <span>Requested Amount</span>
                    <span className="font-black text-[#00E5FF] font-mono">৳{selectedWdDetail.amountBdt.toFixed(2)} BDT</span>
                  </div>
                  <div className="flex justify-between text-[#8E8E93]">
                    <span>Status</span>
                    <span className="font-extrabold uppercase text-amber-400">{selectedWdDetail.status}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
                  <span className="text-[10px] font-bold text-[#8E8E93] uppercase">Status Timeline</span>
                  <div className="space-y-1.5 pl-2 border-l-2 border-[#232328]">
                    <div className="text-[10px] text-emerald-400">✓ Request Created ({selectedWdDetail.requestedAt})</div>
                    <div className="text-[10px] text-emerald-400">✓ Security & Anti-Fraud Verification</div>
                    <div className="text-[10px] text-amber-400">● Payment Gateway Queue (১-২৪ ঘণ্টা)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: TRANSACTION DETAIL */}
      <AnimatePresence>
        {selectedTxDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-5 rounded-[22px] bg-[#141416] border border-[#232328] space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#232328] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Transaction Detail</h3>
                <button onClick={() => setSelectedTxDetail(null)} className="text-[#8E8E93] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#0E0E10] border border-[#1F1F24] space-y-2 text-xs">
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Tx ID</span>
                  <span className="font-mono font-bold text-white">{selectedTxDetail.id}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Title</span>
                  <span className="font-bold text-white">{selectedTxDetail.title}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Type</span>
                  <span className="font-bold text-white uppercase">{selectedTxDetail.type}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Amount</span>
                  <span className="font-mono font-black text-emerald-400">৳{selectedTxDetail.amountBdt.toFixed(2)} BDT</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Status</span>
                  <span className="font-bold text-emerald-400 uppercase">{selectedTxDetail.status}</span>
                </div>
                <div className="flex justify-between text-[#8E8E93]">
                  <span>Date & Time</span>
                  <span className="text-white">{selectedTxDetail.timestamp}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
