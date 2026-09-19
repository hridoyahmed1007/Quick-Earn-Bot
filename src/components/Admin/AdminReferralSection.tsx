import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertOctagon,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Save,
  Search,
  Filter,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  FileText,
  Activity,
  Layers,
  Calendar,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReferralConfig, ReferralQualificationTrigger, ReferralStatus, ReferralRecord } from '../../types';

export const AdminReferralSection: React.FC = () => {
  const {
    referralConfig,
    referralStats,
    adminReferralsList,
    fetchReferralData,
    adminUpdateReferralConfig,
    adminUpdateReferralStatus,
    language,
    showToast,
  } = useApp();

  const isBn = language === 'bn';

  // Local Form State
  const [isActive, setIsActive] = useState<boolean>(referralConfig.isActive);
  const [selectedReward, setSelectedReward] = useState<number>(referralConfig.commissionAmountBdt);
  const [customReward, setCustomReward] = useState<string>('');
  const [isCustomReward, setIsCustomReward] = useState<boolean>(
    ![10, 20, 30, 50].includes(referralConfig.commissionAmountBdt)
  );
  const [qualificationRule, setQualificationRule] = useState<ReferralQualificationTrigger>(
    referralConfig.qualificationRule
  );
  const [dailyLimit, setDailyLimit] = useState<number>(referralConfig.dailyLimitPerUser || 0);

  // Search & Filter for Referral Users List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Moderation Modal for single referral
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<ReferralRecord | null>(null);
  const [moderationAction, setModerationAction] = useState<ReferralStatus>('qualified');
  const [moderationReason, setModerationReason] = useState<string>('');
  const [isSubmittingModeration, setIsSubmittingModeration] = useState<boolean>(false);

  // Sync initial config when referralConfig updates from server
  useEffect(() => {
    setIsActive(referralConfig.isActive);
    setSelectedReward(referralConfig.commissionAmountBdt);
    if (![10, 20, 30, 50].includes(referralConfig.commissionAmountBdt)) {
      setIsCustomReward(true);
      setCustomReward(String(referralConfig.commissionAmountBdt));
    } else {
      setIsCustomReward(false);
      setCustomReward('');
    }
    setQualificationRule(referralConfig.qualificationRule);
    setDailyLimit(referralConfig.dailyLimitPerUser || 0);
  }, [referralConfig]);

  // Load data on mount
  useEffect(() => {
    fetchReferralData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchReferralData();
    setIsRefreshing(false);
  };

  // Preset reward options
  const PRESET_REWARDS = [10, 20, 30, 50];

  const handleSelectPreset = (amount: number) => {
    setIsCustomReward(false);
    setSelectedReward(amount);
    setCustomReward('');
  };

  const handleCustomRewardChange = (val: string) => {
    setCustomReward(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setSelectedReward(num);
    }
  };

  // Save Settings to live DB
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalAmount = isCustomReward ? parseFloat(customReward) || selectedReward : selectedReward;

    if (finalAmount <= 0) {
      showToast('❌ Invalid Amount', 'Commission amount must be greater than ৳0.', 'warning');
      return;
    }

    setIsSavingConfig(true);
    try {
      await adminUpdateReferralConfig({
        isActive,
        commissionAmountBdt: finalAmount,
        qualificationRule,
        dailyLimitPerUser: Number(dailyLimit) || 0,
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Handle Moderation Submit
  const handleExecuteModeration = async () => {
    if (!selectedRecordForModal) return;
    setIsSubmittingModeration(true);
    try {
      await adminUpdateReferralStatus(
        selectedRecordForModal.id,
        moderationAction,
        moderationReason || `Manual admin action: set to ${moderationAction}`
      );
      setSelectedRecordForModal(null);
      setModerationReason('');
    } finally {
      setIsSubmittingModeration(false);
    }
  };

  // Filtered Referral Records
  const filteredReferrals = adminReferralsList.filter((item) => {
    const matchesSearch =
      item.referrerUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referredUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.referralCode && item.referralCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="admin_referral_management_section" className="space-y-4 text-[#EDEDED]">
      {/* Top Banner with System Status & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#18181B] border border-[#27272A] shadow-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isActive
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#27272A] text-[#8E8E93]'
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">
                {isBn ? 'রেফারেল সিস্টেম কন্ট্রোল' : 'Referral System Management'}
              </h3>
              <span
                className={`px-2 py-0.5 text-[10px] font-black rounded-full border flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`}
                />
                {isActive ? (isBn ? 'সক্রিয় (Active)' : 'LIVE & ACTIVE') : isBn ? 'নিষ্ক্রিয় (Paused)' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-[#8E8E93]">
              {isBn
                ? 'কমিশন রেট, কোয়ালিফিকেশন রুল ও রিয়েল-টাইম রেফারেল রেকর্ড'
                : 'Configure reward rates, qualification triggers & manage referral users.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id="refresh_referral_admin_btn"
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-[#232326] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>

          <button
            id="toggle_referral_active_btn"
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
            }`}
          >
            {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
            <span>{isActive ? (isBn ? 'সিস্টেম সক্রিয়' : 'Active') : isBn ? 'সিস্টেম বন্ধ' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Referral Statistics Cards (6 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* 1. Total Referrals */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-[#232326] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              {isBn ? 'মোট রেফারেল' : 'Total Referrals'}
            </span>
            <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">
            {referralStats.totalReferrals}
          </p>
          <span className="text-[9px] text-[#8E8E93] block mt-0.5">Platform total signups</span>
        </div>

        {/* 2. Qualified Referrals */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {isBn ? 'কোয়ালিফাইড' : 'Qualified'}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
            {referralStats.qualifiedReferrals}
          </p>
          <span className="text-[9px] text-emerald-400/70 block mt-0.5">Commission paid</span>
        </div>

        {/* 3. Pending Referrals */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-amber-500/20 bg-amber-500/[0.02] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              {isBn ? 'পেন্ডিং' : 'Pending'}
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">
            {referralStats.pendingReferrals}
          </p>
          <span className="text-[9px] text-amber-400/70 block mt-0.5">Awaiting trigger</span>
        </div>

        {/* 4. Total Commission Paid (BDT) */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-[#232326] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              {isBn ? 'মোট পেইড কমিশন' : 'Total Paid (BDT)'}
            </span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">
            ৳{referralStats.totalReferralEarnings.toFixed(2)}
          </p>
          <span className="text-[9px] text-[#8E8E93] block mt-0.5">Credited to wallets</span>
        </div>

        {/* 5. Today's Referrals */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-[#232326] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              {isBn ? 'আজকের রেফারেল' : "Today's Referrals"}
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-white font-mono">
            {referralStats.todayReferrals}
          </p>
          <span className="text-[9px] text-[#8E8E93] block mt-0.5">New joins today</span>
        </div>

        {/* 6. Today's Paid (BDT) */}
        <div className="p-3 rounded-2xl bg-[#141416] border border-[#232326] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">
              {isBn ? 'আজকের আর্নিং' : "Today's Earnings"}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
            ৳{referralStats.todayReferralEarnings.toFixed(2)}
          </p>
          <span className="text-[9px] text-[#8E8E93] block mt-0.5">Distributed today</span>
        </div>
      </div>

      {/* Main Configuration Card (Referral Amount & Qualification Rules) */}
      <form onSubmit={handleSaveSettings} className="p-4 rounded-2xl bg-[#141416] border border-[#232326] space-y-4">
        <div className="flex items-center justify-between border-b border-[#232326] pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00E5FF]" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              {isBn ? 'রেফারেল কনফিগারেশন ও কমিশন রেট' : 'Referral Reward & Qualification Settings'}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#8E8E93]">
            Last updated: {referralConfig.updatedAt || 'Recently'}
          </span>
        </div>

        {/* 1. Referral Commission Amount Configuration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span>{isBn ? 'রেফারেল কমিশন পরিমাণ (প্রতি সফল রেফারে)' : 'Referral Commission Amount (Per Valid Refer)'}</span>
            <span className="text-emerald-400 font-mono font-black text-sm">
              Current: ৳{isCustomReward ? parseFloat(customReward) || selectedReward : selectedReward}
            </span>
          </label>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PRESET_REWARDS.map((amount) => {
              const isSelected = !isCustomReward && selectedReward === amount;
              return (
                <button
                  key={amount}
                  id={`preset_reward_${amount}_btn`}
                  type="button"
                  onClick={() => handleSelectPreset(amount)}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400'
                      : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white border border-[#2A2A2E] hover:border-emerald-500/40'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>৳{amount}</span>
                </button>
              );
            })}

            {/* Custom Amount Button / Tab */}
            <button
              id="custom_reward_tab_btn"
              type="button"
              onClick={() => setIsCustomReward(true)}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                isCustomReward
                  ? 'bg-[#00E5FF] text-black shadow-md shadow-[#00E5FF]/20 ring-2 ring-[#00E5FF]'
                  : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white border border-[#2A2A2E] hover:border-[#00E5FF]/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'কাস্টম অ্যামাউন্ট' : 'Custom'}</span>
            </button>
          </div>

          {/* Custom Input Field */}
          {isCustomReward && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-1"
            >
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-bold text-sm">৳</span>
                <input
                  id="custom_referral_reward_input"
                  type="number"
                  step="1"
                  min="1"
                  max="1000"
                  placeholder="Enter custom reward in BDT (e.g. 25, 40, 100)"
                  value={customReward}
                  onChange={(e) => handleCustomRewardChange(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#1C1C1F] border border-[#00E5FF]/40 text-white font-mono text-xs placeholder:text-[#636366] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </motion.div>
          )}

          <p className="text-[10px] text-[#8E8E93] italic">
            * All future qualified referrals will automatically be credited this configured amount. Past credited commissions remain unaffected in historical ledger.
          </p>
        </div>

        {/* 2. Qualification Rules (Triggers) */}
        <div className="space-y-2 pt-2 border-t border-[#232326]">
          <label className="text-xs font-bold text-white block">
            {isBn ? 'কোয়ালিফিকেশন রুল / ট্রিগার (কখন কমিশন জমা হবে)' : 'Qualification Trigger Rule (When Commission is Credited)'}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Rule 1: Registration */}
            <div
              id="rule_registration_btn"
              onClick={() => setQualificationRule('registration')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                qualificationRule === 'registration'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                  : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3A3A3E]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck className={`w-4 h-4 ${qualificationRule === 'registration' ? 'text-emerald-400' : 'text-[#8E8E93]'}`} />
                  <span>1. On Register</span>
                </div>
                {qualificationRule === 'registration' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] leading-relaxed">
                {isBn
                  ? 'নতুন ইউজার রেফার কোড দিয়ে জয়েন করার সাথে সাথেই রেফারার কমিশন পাবে।'
                  : 'Immediately when the referred user signs up using the referral code.'}
              </p>
            </div>

            {/* Rule 2: First Task (Default) */}
            <div
              id="rule_first_task_btn"
              onClick={() => setQualificationRule('first_task')}
              className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                qualificationRule === 'first_task'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                  : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3A3A3E]'
              }`}
            >
              <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-emerald-500 text-black font-black text-[8px] uppercase">
                RECOMMENDED
              </span>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Award className={`w-4 h-4 ${qualificationRule === 'first_task' ? 'text-emerald-400' : 'text-[#8E8E93]'}`} />
                  <span>2. First Task</span>
                </div>
                {qualificationRule === 'first_task' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] leading-relaxed">
                {isBn
                  ? 'ইউজার যখন প্রথম মাইক্রো জব বা চ্যানেল টাস্ক সফলভাবে সম্পন্ন করবে।'
                  : 'When the referred user successfully completes their first task.'}
              </p>
            </div>

            {/* Rule 3: First Ad */}
            <div
              id="rule_first_ad_btn"
              onClick={() => setQualificationRule('first_ad')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                qualificationRule === 'first_ad'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                  : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3A3A3E]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Zap className={`w-4 h-4 ${qualificationRule === 'first_ad' ? 'text-emerald-400' : 'text-[#8E8E93]'}`} />
                  <span>3. First Ad</span>
                </div>
                {qualificationRule === 'first_ad' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[10px] leading-relaxed">
                {isBn
                  ? 'ইউজার প্রথম ভেরিফাইড বিজ্ঞাপন ভিডিও দেখার পর রেফারার পুরস্কৃত হবে।'
                  : 'When the referred user watches their first verified reward ad.'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Daily Limit Control & Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#232326]">
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-[#8E8E93] whitespace-nowrap">
              {isBn ? 'দৈনিক সর্বোচ্চ লিমিট (০ = আনলিমিটেড):' : 'Daily Max Referrals / User (0 = Unlimited):'}
            </label>
            <input
              id="referral_daily_limit_input"
              type="number"
              min="0"
              max="500"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
              className="w-20 px-2.5 py-1.5 rounded-lg bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs font-mono focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <button
            id="save_referral_config_btn"
            type="submit"
            disabled={isSavingConfig}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingConfig ? 'Saving to Database...' : isBn ? 'কনফিগারেশন সেভ করুন' : 'Save Changes to Live DB'}</span>
          </button>
        </div>
      </form>

      {/* Referral Users List with Real-time Filters & Moderation */}
      <div className="p-4 rounded-2xl bg-[#141416] border border-[#232326] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              <span>{isBn ? 'রেফারেল ইউজার তালিকা ও অডিট' : 'Referral Users Database'}</span>
              <span className="px-2 py-0.2 rounded-full bg-[#232326] text-[#8E8E93] text-[10px] font-mono">
                {filteredReferrals.length} records
              </span>
            </h4>
            <p className="text-[10px] text-[#8E8E93]">
              {isBn ? 'রেফারার, রেফার করা ইউজার, কোড ও কমিশন স্ট্যাটাস' : 'Search, review status, and moderate referral commissions.'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              id="search_referral_users_input"
              type="text"
              placeholder="Search user, ID or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs placeholder:text-[#636366] focus:outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'qualified', label: 'Qualified' },
            { id: 'pending', label: 'Pending' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'fraud', label: 'Fraud / Flagged' },
          ].map((f) => (
            <button
              key={f.id}
              id={`filter_referral_${f.id}_btn`}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-[#00E5FF] text-black shadow-sm font-black'
                  : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white border border-[#232326]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* User Records Table / List */}
        {filteredReferrals.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#18181A] border border-[#232326] space-y-2">
            <Users className="w-8 h-8 text-[#636366] mx-auto opacity-50" />
            <p className="text-xs text-[#8E8E93]">No referral records match your query.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredReferrals.map((rec) => {
              const isQualified = rec.status === 'qualified';
              const isPending = rec.status === 'pending';
              const isFraud = rec.status === 'fraud';
              const isRejected = rec.status === 'rejected';

              return (
                <div
                  key={rec.id}
                  id={`referral_record_${rec.id}`}
                  className="p-3 rounded-xl bg-[#18181A] hover:bg-[#1E1E22] border border-[#262629] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-1">
                    {/* User Attribution */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#8E8E93]">Referrer:</span>
                        <span className="text-xs font-bold text-white">@{rec.referrerUsername}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#636366]" />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#8E8E93]">Referred:</span>
                        <span className="text-xs font-bold text-[#00E5FF]">@{rec.referredUsername}</span>
                      </div>
                    </div>

                    {/* Metadata & Code */}
                    <div className="flex items-center gap-3 text-[10px] text-[#8E8E93] flex-wrap">
                      <span>Code: <strong className="text-white font-mono">{rec.referralCode || (rec as any).referralCodeUsed}</strong></span>
                      <span>•</span>
                      <span>{rec.createdAt}</span>
                      {rec.reason && (
                        <>
                          <span>•</span>
                          <span className="text-[#A1A1AA] italic">{rec.reason}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badges & Action */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Commission Amount */}
                    <div className="text-right">
                      <span className="text-xs font-black font-mono text-emerald-400 block">
                        ৳{rec.commissionAmountBdt.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#8E8E93] uppercase">
                        {rec.commissionStatus}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        isQualified
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : isPending
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : isFraud
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                      }`}
                    >
                      {rec.status}
                    </span>

                    {/* Moderate Button */}
                    <button
                      id={`moderate_referral_${rec.id}_btn`}
                      type="button"
                      onClick={() => {
                        setSelectedRecordForModal(rec);
                        setModerationAction(rec.status === 'qualified' ? 'rejected' : 'qualified');
                        setModerationReason('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#262629] hover:bg-[#323236] text-[#EDEDED] hover:text-white text-[10px] font-bold transition-colors"
                    >
                      Action
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Moderation Action Modal */}
      <AnimatePresence>
        {selectedRecordForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#161618] border border-[#2A2A2E] rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="text-sm font-black text-white">Moderate Referral Status</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecordForModal(null)}
                  className="w-7 h-7 rounded-lg bg-[#232326] text-[#8E8E93] hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#1F1F23] border border-[#2A2A2E] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Referrer:</span>
                  <span className="text-white font-bold">@{selectedRecordForModal.referrerUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Referred User:</span>
                  <span className="text-[#00E5FF] font-bold">@{selectedRecordForModal.referredUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Current Status:</span>
                  <span className="uppercase font-mono font-bold text-amber-400">{selectedRecordForModal.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Reward Amount:</span>
                  <span className="font-mono text-emerald-400 font-bold">৳{selectedRecordForModal.commissionAmountBdt.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">New Status:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModerationAction('qualified')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      moderationAction === 'qualified'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-[#1F1F23] border-[#2A2A2E] text-[#8E8E93]'
                    }`}
                  >
                    ✓ Qualify & Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setModerationAction('rejected')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      moderationAction === 'rejected'
                        ? 'bg-zinc-500/20 border-zinc-500 text-zinc-300'
                        : 'bg-[#1F1F23] border-[#2A2A2E] text-[#8E8E93]'
                    }`}
                  >
                    ✗ Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setModerationAction('fraud')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      moderationAction === 'fraud'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-[#1F1F23] border-[#2A2A2E] text-[#8E8E93]'
                    }`}
                  >
                    ⚠ Flag Fraud
                  </button>
                </div>
              </div>

              {/* Note / Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">Admin Reason / Audit Note:</label>
                <input
                  type="text"
                  placeholder="e.g. Verified task proof manually / Multi-account detected"
                  value={moderationReason}
                  onChange={(e) => setModerationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs placeholder:text-[#636366] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForModal(null)}
                  className="px-4 py-2 rounded-xl bg-[#232326] text-[#8E8E93] hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteModeration}
                  disabled={isSubmittingModeration}
                  className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#70F3FF] text-black text-xs font-black shadow-md shadow-[#00E5FF]/20 disabled:opacity-50"
                >
                  {isSubmittingModeration ? 'Updating...' : 'Confirm Update'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
