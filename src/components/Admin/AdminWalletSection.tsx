import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wallet,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Sliders,
  ShieldCheck,
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  ArrowUpDown,
  Lock,
  Unlock,
  AlertOctagon,
  CreditCard,
  History,
  TrendingUp,
  UserCheck,
  Send,
  Eye,
  Check,
  X,
  FileText,
  BadgeAlert,
  HelpCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PaymentMethodConfig,
  WithdrawalSettings,
  WithdrawalRequirementsConfig,
  WalletOverviewStats,
  WithdrawalRecord,
} from '../../types';

type WalletSubTab = 'overview' | 'withdrawals' | 'methods' | 'settings' | 'requirements' | 'ledger';

export const AdminWalletSection: React.FC = () => {
  const { language, showToast, triggerHaptic, user, fetchWalletConfig, fetchAuditLogs } = useApp();
  const isBn = language === 'bn';

  // Navigation Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<WalletSubTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data
  const [stats, setStats] = useState<WalletOverviewStats>({
    totalWalletBalance: 14520.5,
    totalEarnings: 58940.0,
    totalWithdrawn: 42350.0,
    pendingWithdrawalsCount: 1,
    pendingWithdrawalsAmount: 950.0,
    verifiedWithdrawalsCount: 1,
    verifiedWithdrawalsAmount: 1200.0,
    processingWithdrawalsCount: 1,
    processingWithdrawalsAmount: 1500.0,
    completedWithdrawalsCount: 39,
    completedWithdrawalsAmount: 43250.0,
    rejectedWithdrawalsCount: 5,
    rejectedWithdrawalsAmount: 4800.0,
    todayRequestsCount: 5,
    todayRequestsAmount: 4850.0,
    todayCompletedPayoutsCount: 3,
    todayCompletedPayoutsAmount: 3200.0,
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([]);
  const [settings, setSettings] = useState<WithdrawalSettings>({
    minWithdrawBdt: 900,
    maxWithdrawBdt: 25000,
    dailyWithdrawLimitBdt: 50000,
    dailyWithdrawLimitCount: 3,
    feeType: 'none',
    feeValue: 0,
    isWithdrawalEnabled: true,
    maintenanceNotice: '',
    updatedAt: '2026-08-15 10:00:00',
    updatedBy: 'ADMIN_SUPER_01',
  });

  const [requirements, setRequirements] = useState<WithdrawalRequirementsConfig>({
    minQualifiedReferrals: 15,
    minVerifiedAds: 5,
    minCompletedMicroJobs: 0,
    minAccountAgeHours: 0,
    requireAccountVerification: false,
    requireAchievementUnlock: false,
    updatedAt: '2026-08-15 10:00:00',
    updatedBy: 'ADMIN_SUPER_01',
  });

  const [ledgerTransactions, setLedgerTransactions] = useState<any[]>([]);

  // Withdrawals Filters
  const [wdStatusFilter, setWdStatusFilter] = useState<string>('all');
  const [wdMethodFilter, setWdMethodFilter] = useState<string>('all');
  const [wdSearchQuery, setWdSearchQuery] = useState<string>('');

  // Modals
  const [selectedWdForAction, setSelectedWdForAction] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'process' | 'complete' | 'reject' | 'details' | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [paymentReferenceInput, setPaymentReferenceInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Payment Method Modal
  const [editingMethod, setEditingMethod] = useState<{ isNew: boolean; data: Partial<PaymentMethodConfig> } | null>(null);

  // Manual Adjustment Modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustTargetUser, setAdjustTargetUser] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustReason, setAdjustReason] = useState('');
  const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);

  // Settings Local Form State
  const [localSettings, setLocalSettings] = useState<WithdrawalSettings>(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Requirements Local Form State
  const [localRequirements, setLocalRequirements] = useState<WithdrawalRequirementsConfig>(requirements);
  const [isSavingRequirements, setIsSavingRequirements] = useState(false);

  // Initial Load
  const fetchAllWalletData = async () => {
    try {
      setIsLoading(true);
      const [ovRes, wdRes, pmRes, txRes] = await Promise.all([
        fetch('/api/admin/wallet/overview'),
        fetch('/api/admin/wallet/withdrawals'),
        fetch('/api/admin/wallet/payment-methods'),
        fetch('/api/admin/wallet/transactions'),
      ]);

      if (ovRes.ok) {
        const ovData = await ovRes.json();
        if (ovData.stats) setStats(ovData.stats);
        if (ovData.settings) {
          setSettings(ovData.settings);
          setLocalSettings(ovData.settings);
        }
        if (ovData.requirements) {
          setRequirements(ovData.requirements);
          setLocalRequirements(ovData.requirements);
        }
      }

      if (wdRes.ok) {
        const wdData = await wdRes.json();
        if (wdData.withdrawals) setWithdrawals(wdData.withdrawals);
      }

      if (pmRes.ok) {
        const pmData = await pmRes.json();
        if (pmData.paymentMethods) setPaymentMethods(pmData.paymentMethods);
      }

      if (txRes.ok) {
        const txData = await txRes.json();
        if (txData.transactions) setLedgerTransactions(txData.transactions);
      }
    } catch (e) {
      console.error('Error fetching admin wallet data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWalletData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    triggerHaptic('light');
    await fetchAllWalletData();
    setIsRefreshing(false);
    showToast('🔄 Synced', 'Live wallet records and database metrics refreshed.');
  };

  // Filtered withdrawals
  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesStatus = wdStatusFilter === 'all' || w.status === wdStatusFilter;
    const matchesMethod = wdMethodFilter === 'all' || (w.method || '').toLowerCase() === wdMethodFilter.toLowerCase();
    const query = wdSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (w.id && w.id.toLowerCase().includes(query)) ||
      (w.userId && w.userId.toLowerCase().includes(query)) ||
      (w.username && w.username.toLowerCase().includes(query)) ||
      (w.fullName && w.fullName.toLowerCase().includes(query)) ||
      (w.accountNumber && w.accountNumber.includes(query)) ||
      (w.paymentReference && w.paymentReference.toLowerCase().includes(query));

    return matchesStatus && matchesMethod && matchesSearch;
  });

  // Action Handlers
  const handleVerifyWithdrawal = async (wdId: string) => {
    try {
      setIsSubmittingAction(true);
      const res = await fetch(`/api/admin/wallet/withdrawals/${wdId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 'ADMIN_SUPER_01', notes: actionNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast('✅ Verified', 'Withdrawal request verified and marked ready for payout.');
        setActionType(null);
        setSelectedWdForAction(null);
        await fetchAllWalletData();
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to verify.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleProcessWithdrawal = async (wdId: string) => {
    try {
      setIsSubmittingAction(true);
      const res = await fetch(`/api/admin/wallet/withdrawals/${wdId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 'ADMIN_PAYOUT_01', notes: actionNotes }),
      });
      if (res.ok) {
        showToast('⚡ Processing', 'Payout marked as Processing.');
        setActionType(null);
        setSelectedWdForAction(null);
        await fetchAllWalletData();
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to process.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleCompleteWithdrawal = async (wdId: string) => {
    if (!paymentReferenceInput.trim()) {
      showToast('⚠️ Required', 'Please enter payment receipt / transaction reference ID.');
      return;
    }
    try {
      setIsSubmittingAction(true);
      const res = await fetch(`/api/admin/wallet/withdrawals/${wdId}/mark-completed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'ADMIN_PAYOUT_01',
          paymentReference: paymentReferenceInput.trim(),
          notes: actionNotes,
        }),
      });
      if (res.ok) {
        showToast('🎉 Completed', `Payout finalized with Ref: ${paymentReferenceInput.trim()}`);
        setActionType(null);
        setSelectedWdForAction(null);
        setPaymentReferenceInput('');
        await fetchAllWalletData();
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to finalize payout.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleRejectWithdrawal = async (wdId: string) => {
    if (!rejectionReasonInput.trim()) {
      showToast('⚠️ Required', 'Please provide a clear rejection reason for user.');
      return;
    }
    try {
      setIsSubmittingAction(true);
      const res = await fetch(`/api/admin/wallet/withdrawals/${wdId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 'ADMIN_SUPER_01',
          reason: rejectionReasonInput.trim(),
          refundBalance: true,
        }),
      });
      if (res.ok) {
        showToast('❌ Rejected & Refunded', 'Withdrawal rejected and balance restored to user wallet.');
        setActionType(null);
        setSelectedWdForAction(null);
        setRejectionReasonInput('');
        await fetchAllWalletData();
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to reject.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Payment Methods Handlers
  const handleToggleMethodStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const res = await fetch(`/api/admin/wallet/payment-methods/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, adminId: 'ADMIN_SUPER_01' }),
      });
      if (res.ok) {
        showToast('✅ Updated', `Payment method status changed to ${nextStatus}.`);
        await fetchAllWalletData();
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    }
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMethod) return;

    try {
      setIsSubmittingAction(true);
      if (editingMethod.isNew) {
        const res = await fetch('/api/admin/wallet/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingMethod.data, adminId: 'ADMIN_SUPER_01' }),
        });
        if (res.ok) {
          showToast('✅ Method Added', 'New payment provider added to live wallet.');
          setEditingMethod(null);
          await fetchAllWalletData();
        } else {
          const err = await res.json();
          showToast('❌ Error', err.error || 'Failed to create method.');
        }
      } else {
        const res = await fetch(`/api/admin/wallet/payment-methods/${editingMethod.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingMethod.data, adminId: 'ADMIN_SUPER_01' }),
        });
        if (res.ok) {
          showToast('✅ Method Saved', 'Payment provider configuration updated.');
          setEditingMethod(null);
          await fetchAllWalletData();
        } else {
          const err = await res.json();
          showToast('❌ Error', err.error || 'Failed to update method.');
        }
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleArchiveMethod = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/wallet/payment-methods/${id}?adminId=ADMIN_SUPER_01`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('🗑️ Archived', 'Payment method removed from active list.');
        await fetchAllWalletData();
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      const res = await fetch('/api/admin/wallet/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...localSettings, adminId: 'ADMIN_SUPER_01' }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        await fetchWalletConfig();
        await fetchAuditLogs();
        showToast('✅ Settings Saved', 'Live withdrawal limits and fee rules updated.');
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to save settings.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Save Requirements Handler
  const handleSaveRequirements = async () => {
    try {
      setIsSavingRequirements(true);
      const res = await fetch('/api/admin/wallet/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...localRequirements, adminId: 'ADMIN_SUPER_01' }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequirements(data.requirements);
        await fetchWalletConfig();
        await fetchAuditLogs();
        showToast('✅ Requirements Saved', 'Withdrawal eligibility rules updated in database.');
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Failed to save requirements.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSavingRequirements(false);
    }
  };

  // Manual Adjustment Submit
  const handleManualAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetUser.trim() || !adjustAmount || Number(adjustAmount) <= 0 || !adjustReason.trim()) {
      showToast('⚠️ Incomplete', 'Please fill all adjustment fields.');
      return;
    }

    try {
      setIsSubmittingAdjustment(true);
      const res = await fetch('/api/admin/wallet/manual-adjustment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: adjustTargetUser.trim(),
          amountBdt: Number(adjustAmount),
          adjustmentType: adjustType,
          reason: adjustReason.trim(),
          adminId: 'ADMIN_SUPER_01',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast('✅ Adjustment Credited', data.message || 'User wallet adjusted successfully.');
        setIsAdjustmentModalOpen(false);
        setAdjustTargetUser('');
        setAdjustAmount('');
        setAdjustReason('');
        await fetchAllWalletData();
      } else {
        const err = await res.json();
        showToast('❌ Error', err.error || 'Adjustment failed.');
      }
    } catch (e) {
      showToast('❌ Error', 'Network error.');
    } finally {
      setIsSubmittingAdjustment(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'rejected':
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
            <X className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-300">
            {st}
          </span>
        );
    }
  };

  return (
    <div id="admin-wallet-management-root" className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Wallet & Payout Management
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Database
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time financial control, withdrawal approvals, payment gateway settings, and automated audits.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="admin-wallet-adjust-btn"
            onClick={() => {
              triggerHaptic('light');
              setIsAdjustmentModalOpen(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-950/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Adjust Balance
          </button>

          <button
            id="admin-wallet-refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/5 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh live wallet records"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-white/5 overflow-x-auto no-scrollbar">
        <button
          id="subtab-wallet-overview"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('overview');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Wallet Overview
        </button>

        <button
          id="subtab-wallet-withdrawals"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('withdrawals');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'withdrawals'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          Withdraw Requests
          {stats.pendingWithdrawalsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-black">
              {stats.pendingWithdrawalsCount}
            </span>
          )}
        </button>

        <button
          id="subtab-wallet-methods"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('methods');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'methods'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          Payment Methods
          <span className="text-[10px] text-neutral-500">({paymentMethods.length})</span>
        </button>

        <button
          id="subtab-wallet-settings"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('settings');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          Withdrawal Settings
        </button>

        <button
          id="subtab-wallet-requirements"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('requirements');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'requirements'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          Requirements
        </button>

        <button
          id="subtab-wallet-ledger"
          onClick={() => {
            triggerHaptic('selection');
            setActiveSubTab('ledger');
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'ledger'
              ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-white/10'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
          }`}
        >
          <History className="w-3.5 h-3.5 text-cyan-400" />
          Ledger
        </button>
      </div>

      {/* Global Maintenance Alert if Withdrawals are paused */}
      {!settings.isWithdrawalEnabled && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-xs">
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-200">Withdrawals are Currently Paused:</span> Users will see a
            maintenance notice when trying to withdraw. You can customize the notice or resume payouts in the
            Withdrawal Settings tab.
          </div>
        </div>
      )}

      {/* TAB 1: WALLET OVERVIEW */}
      {activeSubTab === 'overview' && (
        <motion.div
          key="wallet-overview-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-6"
        >
          {/* Main Key Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total Balance In System */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Total Active Balances</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white mt-1.5 tracking-tight">
                ৳{stats.totalWalletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Held across active users
              </div>
            </div>

            {/* Total System Earnings */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Total Earnings Credited</span>
                <DollarSign className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl font-bold text-white mt-1.5 tracking-tight">
                ৳{stats.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-medium">Ads, jobs & referrals</div>
            </div>

            {/* Total Cashout Completed */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Total Payouts Completed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1.5 tracking-tight">
                ৳{stats.totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 font-medium">
                {stats.completedWithdrawalsCount} successful payouts
              </div>
            </div>

            {/* Pending Requests In Queue */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Pending Approval Queue</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-400 mt-1.5 tracking-tight">
                ৳{stats.pendingWithdrawalsAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1 font-medium">
                {stats.pendingWithdrawalsCount} requests awaiting check
              </div>
            </div>
          </div>

          {/* Workflow Status Breakdown */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Payout Pipeline Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-neutral-800/60 border border-amber-500/10">
                <div className="text-[11px] font-medium text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  1. Pending Review
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {stats.pendingWithdrawalsCount} requests
                </div>
                <div className="text-[11px] text-neutral-400">
                  ৳{stats.pendingWithdrawalsAmount.toFixed(2)} BDT
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/60 border border-blue-500/10">
                <div className="text-[11px] font-medium text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  2. Verified
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {stats.verifiedWithdrawalsCount} requests
                </div>
                <div className="text-[11px] text-neutral-400">
                  ৳{stats.verifiedWithdrawalsAmount.toFixed(2)} BDT
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/60 border border-purple-500/10">
                <div className="text-[11px] font-medium text-purple-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  3. In Processing
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {stats.processingWithdrawalsCount} payouts
                </div>
                <div className="text-[11px] text-neutral-400">
                  ৳{stats.processingWithdrawalsAmount.toFixed(2)} BDT
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/60 border border-emerald-500/10">
                <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  4. Completed Payouts
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {stats.completedWithdrawalsCount} payouts
                </div>
                <div className="text-[11px] text-neutral-400">
                  ৳{stats.completedWithdrawalsAmount.toFixed(2)} BDT
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Hub & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quick Action Hub */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Quick Operations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setWdStatusFilter('pending');
                    setActiveSubTab('withdrawals');
                  }}
                  className="p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Review Pending Payouts</div>
                    <div className="text-[11px] text-amber-400 mt-0.5 font-medium">
                      {stats.pendingWithdrawalsCount} waiting in queue
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab('methods');
                  }}
                  className="p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Manage Gateways</div>
                    <div className="text-[11px] text-blue-400 mt-0.5 font-medium">
                      {paymentMethods.filter((m) => m.status === 'active').length} active providers
                    </div>
                  </div>
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab('settings');
                  }}
                  className="p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Min/Max Limits</div>
                    <div className="text-[11px] text-purple-400 mt-0.5 font-medium">
                      ৳{settings.minWithdrawBdt} - ৳{settings.maxWithdrawBdt} BDT
                    </div>
                  </div>
                  <Sliders className="w-4 h-4 text-purple-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab('requirements');
                  }}
                  className="p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-white/5 text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">Referral Threshold</div>
                    <div className="text-[11px] text-rose-400 mt-0.5 font-medium">
                      {requirements.minQualifiedReferrals} qualified referrals
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>

            {/* Today's Metrics */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-neutral-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Today's Activity
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-800/60 border border-white/5">
                  <div className="text-[11px] text-neutral-400">Requests Received Today</div>
                  <div className="text-lg font-bold text-white mt-0.5">{stats.todayRequestsCount} requests</div>
                  <div className="text-xs text-neutral-400 font-medium mt-0.5">
                    ৳{stats.todayRequestsAmount.toFixed(2)} BDT
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-800/60 border border-white/5">
                  <div className="text-[11px] text-neutral-400">Payouts Sent Today</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    {stats.todayCompletedPayoutsCount} payouts
                  </div>
                  <div className="text-xs text-emerald-400/80 font-medium mt-0.5">
                    ৳{stats.todayCompletedPayoutsAmount.toFixed(2)} BDT
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-800/40 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Gateway Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  bKash, Nagad, Rocket Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: WITHDRAW REQUESTS */}
      {activeSubTab === 'withdrawals' && (
        <motion.div
          key="withdrawals-list-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-neutral-900/90 border border-white/5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={wdSearchQuery}
                onChange={(e) => setWdSearchQuery(e.target.value)}
                placeholder="Search by ID, username, mobile number..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-800/90 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              {wdSearchQuery && (
                <button
                  onClick={() => setWdSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <select
                value={wdStatusFilter}
                onChange={(e) => setWdStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800/90 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending ({stats.pendingWithdrawalsCount})</option>
                <option value="verified">Verified ({stats.verifiedWithdrawalsCount})</option>
                <option value="processing">Processing ({stats.processingWithdrawalsCount})</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Method Filter */}
              <select
                value={wdMethodFilter}
                onChange={(e) => setWdMethodFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800/90 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Gateways</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
                <option value="upay">Upay</option>
              </select>
            </div>
          </div>

          {/* List of Withdrawals */}
          {filteredWithdrawals.length === 0 ? (
            <div className="p-12 rounded-2xl bg-neutral-900/60 border border-white/5 text-center text-neutral-400 space-y-2">
              <CreditCard className="w-8 h-8 text-neutral-600 mx-auto" />
              <div className="text-sm font-semibold text-neutral-300">No withdrawal requests found</div>
              <div className="text-xs text-neutral-500">
                {wdSearchQuery || wdStatusFilter !== 'all'
                  ? 'Try adjusting your search query or status filter.'
                  : 'New user payout requests will appear here in real-time.'}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredWithdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  {/* Left: User & Method Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-white">{w.id}</span>
                      {getStatusBadge(w.status)}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                        {w.method}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="font-semibold text-neutral-200">{w.fullName || w.username}</span>
                      <span>•</span>
                      <span className="font-mono text-neutral-300">{w.accountNumber || w.maskedAccount}</span>
                      <span>•</span>
                      <span className="text-[11px] text-neutral-500">{w.requestedAt}</span>
                    </div>

                    {w.paymentReference && (
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Txn Ref: {w.paymentReference}
                      </div>
                    )}

                    {w.rejectionReason && (
                      <div className="text-[11px] text-rose-400 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Rejected: {w.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Middle: Amount & Fee */}
                  <div className="text-left md:text-right">
                    <div className="text-base font-bold text-white tracking-tight">
                      ৳{Number(w.amountBdt || 0).toFixed(2)} BDT
                    </div>
                    {w.feeBdt > 0 && (
                      <div className="text-[10px] text-neutral-400">
                        Fee: ৳{w.feeBdt} (Net: ৳{w.netAmountBdt})
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    {/* View Details */}
                    <button
                      onClick={() => {
                        setSelectedWdForAction(w);
                        setActionType('details');
                      }}
                      className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Inspect user eligibility & transaction details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Pending Action -> Verify */}
                    {w.status === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedWdForAction(w);
                          setActionType('verify');
                          setActionNotes('');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify
                      </button>
                    )}

                    {/* Verified Action -> Process Payout */}
                    {w.status === 'verified' && (
                      <button
                        onClick={() => {
                          setSelectedWdForAction(w);
                          setActionType('process');
                          setActionNotes('');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Process
                      </button>
                    )}

                    {/* Processing Action -> Mark Completed */}
                    {(w.status === 'processing' || w.status === 'verified') && (
                      <button
                        onClick={() => {
                          setSelectedWdForAction(w);
                          setActionType('complete');
                          setPaymentReferenceInput(`TRX${Date.now().toString().slice(-8)}BD`);
                          setActionNotes('');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    )}

                    {/* Reject Action (Available for non-completed) */}
                    {w.status !== 'completed' && w.status !== 'rejected' && w.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          setSelectedWdForAction(w);
                          setActionType('reject');
                          setRejectionReasonInput('');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer"
                        title="Reject and refund user balance"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* TAB 3: PAYMENT METHODS */}
      {activeSubTab === 'methods' && (
        <motion.div
          key="payment-methods-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/90 border border-white/5">
            <div>
              <div className="text-xs font-bold text-white">Payment Gateways & Providers</div>
              <div className="text-[11px] text-neutral-400">Configure enabled withdrawal channels and limits.</div>
            </div>
            <button
              onClick={() => {
                setEditingMethod({
                  isNew: true,
                  data: {
                    name: '',
                    displayName: '',
                    accountType: 'personal',
                    status: 'active',
                    requiredAccountField: '11-Digit Mobile Number',
                    accountPlaceholder: '01XXXXXXXXX',
                    minAmountBdt: 900,
                    maxAmountBdt: 25000,
                    feeType: 'none',
                    feeValue: 0,
                  },
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Gateway
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`p-4 rounded-2xl bg-neutral-900/90 border transition-all ${
                  pm.status === 'active' ? 'border-white/5' : 'border-rose-500/20 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {pm.displayName || pm.name}
                        {pm.status === 'active' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 capitalize">{pm.accountType} Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleMethodStatus(pm.id, pm.status)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        pm.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                      }`}
                    >
                      {pm.status === 'active' ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => setEditingMethod({ isNew: false, data: pm })}
                      className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all cursor-pointer"
                      title="Edit gateway parameters"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-neutral-500">Min - Max:</span>{' '}
                    <span className="text-neutral-200 font-medium">
                      ৳{pm.minAmountBdt} - ৳{pm.maxAmountBdt}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Fee:</span>{' '}
                    <span className="text-neutral-200 font-medium">
                      {pm.feeType === 'none' ? 'None (0%)' : `${pm.feeValue} (${pm.feeType})`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: WITHDRAWAL SETTINGS */}
      {activeSubTab === 'settings' && (
        <motion.div
          key="withdrawal-settings-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 space-y-4">
            {/* Global Master Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-800/80 border border-white/5">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Global Withdrawal Master Switch
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  When toggled OFF, users are informed that payouts are temporarily paused for maintenance.
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setLocalSettings((prev) => ({ ...prev, isWithdrawalEnabled: !prev.isWithdrawalEnabled }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  localSettings.isWithdrawalEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.isWithdrawalEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Maintenance Message */}
            {!localSettings.isWithdrawalEnabled && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Custom Maintenance Notice (Displayed to users)
                </label>
                <input
                  type="text"
                  value={localSettings.maintenanceNotice || ''}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, maintenanceNotice: e.target.value }))
                  }
                  placeholder="উইথড্র সেবা বর্তমানে মেইন্টেন্যান্সের জন্য সাময়িক বন্ধ রয়েছে..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Min & Max Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Minimum Withdrawal Amount (BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="10"
                    value={localSettings.minWithdrawBdt}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({ ...prev, minWithdrawBdt: Number(e.target.value) }))
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Maximum Single Withdrawal Limit (BDT)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="100"
                    value={localSettings.maxWithdrawBdt}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({ ...prev, maxWithdrawBdt: Number(e.target.value) }))
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Fee Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Withdrawal Fee Model</label>
                <select
                  value={localSettings.feeType}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, feeType: e.target.value as any }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="none">No Fee (Free Withdrawal)</option>
                  <option value="fixed">Fixed BDT Amount</option>
                  <option value="percentage">Percentage (%) of Amount</option>
                </select>
              </div>

              {localSettings.feeType !== 'none' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    {localSettings.feeType === 'fixed' ? 'Fixed Fee in BDT' : 'Fee Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={localSettings.feeValue}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({ ...prev, feeValue: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSavingSettings ? 'Saving Settings...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: REQUIREMENTS */}
      {activeSubTab === 'requirements' && (
        <motion.div
          key="requirements-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/5 space-y-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                User Withdrawal Prerequisites & Anti-Fraud Gates
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Users must satisfy these conditions before submitting a cashout request.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Minimum Qualified Referrals */}
              <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-white/5 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-200">
                  Minimum Qualified Referrals Required
                </label>
                <div className="text-[11px] text-neutral-400">
                  User cannot withdraw until they refer at least this many verified users.
                </div>
                <input
                  type="number"
                  min="0"
                  value={localRequirements.minQualifiedReferrals}
                  onChange={(e) =>
                    setLocalRequirements((prev) => ({
                      ...prev,
                      minQualifiedReferrals: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Minimum Ads Watched */}
              <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-white/5 space-y-1.5">
                <label className="text-xs font-semibold text-neutral-200">
                  Minimum Verified Ads Watched
                </label>
                <div className="text-[11px] text-neutral-400">
                  Requires user activity before first withdrawal.
                </div>
                <input
                  type="number"
                  min="0"
                  value={localRequirements.minVerifiedAds}
                  onChange={(e) =>
                    setLocalRequirements((prev) => ({
                      ...prev,
                      minVerifiedAds: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveRequirements}
                disabled={isSavingRequirements}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {isSavingRequirements ? 'Saving Rules...' : 'Save Requirements'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 6: TRANSACTION LEDGER */}
      {activeSubTab === 'ledger' && (
        <motion.div
          key="ledger-pane"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          <div className="p-3 rounded-2xl bg-neutral-900/90 border border-white/5 flex items-center justify-between">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Unified Global Transaction Ledger
            </div>
            <div className="text-[11px] text-neutral-400">Showing last {ledgerTransactions.length} events</div>
          </div>

          <div className="space-y-2">
            {ledgerTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-neutral-900/80 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    {tx.title}
                    <span className="text-[10px] text-neutral-500">({tx.username || tx.userId})</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {tx.id} • {tx.timestamp}
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-bold ${
                      tx.type === 'withdraw' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {tx.type === 'withdraw' ? '-' : '+'}৳{Number(tx.amountBdt || 0).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-400 capitalize">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ACTION MODAL: VERIFY / PROCESS / COMPLETE / REJECT / DETAILS */}
      <AnimatePresence>
        {selectedWdForAction && actionType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 p-5 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    {actionType === 'verify' && 'Verify Withdrawal Eligibility'}
                    {actionType === 'process' && 'Initiate Payout Processing'}
                    {actionType === 'complete' && 'Complete & Finalize Payout'}
                    {actionType === 'reject' && 'Reject Withdrawal Request'}
                    {actionType === 'details' && 'Withdrawal & User Audit Detail'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedWdForAction(null);
                    setActionType(null);
                  }}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Card */}
              <div className="p-3.5 rounded-xl bg-neutral-800/80 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Request ID:</span>
                  <span className="font-mono text-white font-bold">{selectedWdForAction.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">User:</span>
                  <span className="text-neutral-200 font-semibold">
                    {selectedWdForAction.fullName || selectedWdForAction.username} ({selectedWdForAction.username})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Method & Account:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {selectedWdForAction.method} ({selectedWdForAction.accountNumber || selectedWdForAction.maskedAccount})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Amount:</span>
                  <span className="text-base font-bold text-white">
                    ৳{Number(selectedWdForAction.amountBdt || 0).toFixed(2)} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Current Status:</span>
                  <span>{getStatusBadge(selectedWdForAction.status)}</span>
                </div>
              </div>

              {/* Verification Specific Notes */}
              {actionType === 'verify' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    Confirm that this user has no duplicate accounts, meets the 15 referral prerequisite, and the
                    mobile number format is valid.
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Admin Audit Note (Optional)</label>
                    <input
                      type="text"
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="e.g., Verified referral count and active phone number."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Complete Specific: Transaction Reference ID */}
              {actionType === 'complete' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      Payment Transaction ID / Reference (Mandatory)
                    </label>
                    <input
                      type="text"
                      value={paymentReferenceInput}
                      onChange={(e) => setPaymentReferenceInput(e.target.value)}
                      placeholder="e.g. TRX9938BKASH4821 or Bank Slip ID"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white text-xs font-mono font-semibold focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-neutral-400">
                      This transaction receipt code will be permanently recorded in the ledger and shown to the user.
                    </p>
                  </div>
                </div>
              )}

              {/* Reject Specific: Mandatory Reason */}
              {actionType === 'reject' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    Rejecting this withdrawal will automatically restore ৳{selectedWdForAction.amountBdt} BDT back to
                    the user's wallet balance.
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-200">Rejection Reason (Sent to User)</label>
                    <textarea
                      rows={2}
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      placeholder="e.g., Invalid bKash account number / Unregistered mobile number."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Details Specific: Audit view */}
              {actionType === 'details' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-800/60 border border-white/5 space-y-1">
                    <div className="font-semibold text-white">Compliance Check</div>
                    <div className="text-neutral-400">
                      • Referrals at request: {selectedWdForAction.userTotalReferralsAtRequest || 16}/15 required
                    </div>
                    <div className="text-neutral-400">
                      • Balance at request: ৳{selectedWdForAction.userBalanceAtRequest || selectedWdForAction.amountBdt}
                    </div>
                    <div className="text-neutral-400">• Requested: {selectedWdForAction.requestedAt}</div>
                    {selectedWdForAction.verifiedAt && (
                      <div className="text-blue-400">
                        • Verified at: {selectedWdForAction.verifiedAt} ({selectedWdForAction.verifiedBy})
                      </div>
                    )}
                    {selectedWdForAction.processedAt && (
                      <div className="text-purple-400">
                        • Processed at: {selectedWdForAction.processedAt} ({selectedWdForAction.processedBy})
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWdForAction(null);
                    setActionType(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Close
                </button>

                {actionType === 'verify' && (
                  <button
                    onClick={() => handleVerifyWithdrawal(selectedWdForAction.id)}
                    disabled={isSubmittingAction}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isSubmittingAction ? 'Verifying...' : 'Confirm Verification'}
                  </button>
                )}

                {actionType === 'process' && (
                  <button
                    onClick={() => handleProcessWithdrawal(selectedWdForAction.id)}
                    disabled={isSubmittingAction}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {isSubmittingAction ? 'Processing...' : 'Mark as Processing'}
                  </button>
                )}

                {actionType === 'complete' && (
                  <button
                    onClick={() => handleCompleteWithdrawal(selectedWdForAction.id)}
                    disabled={isSubmittingAction}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isSubmittingAction ? 'Finalizing...' : 'Finalize Payout'}
                  </button>
                )}

                {actionType === 'reject' && (
                  <button
                    onClick={() => handleRejectWithdrawal(selectedWdForAction.id)}
                    disabled={isSubmittingAction}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    {isSubmittingAction ? 'Rejecting...' : 'Reject & Auto-Refund'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: EDIT / ADD PAYMENT METHOD */}
      <AnimatePresence>
        {editingMethod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.form
              onSubmit={handleSavePaymentMethod}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  {editingMethod.isNew ? 'Add Payment Gateway' : 'Edit Gateway Configuration'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingMethod(null)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Method Name (e.g. bKash)</label>
                  <input
                    type="text"
                    required
                    value={editingMethod.data.name || ''}
                    onChange={(e) =>
                      setEditingMethod((prev) => ({
                        ...prev!,
                        data: { ...prev!.data, name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Display Name (Bangla / English)</label>
                  <input
                    type="text"
                    required
                    value={editingMethod.data.displayName || ''}
                    onChange={(e) =>
                      setEditingMethod((prev) => ({
                        ...prev!,
                        data: { ...prev!.data, displayName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Account Type</label>
                    <select
                      value={editingMethod.data.accountType || 'personal'}
                      onChange={(e) =>
                        setEditingMethod((prev) => ({
                          ...prev!,
                          data: { ...prev!.data, accountType: e.target.value as any },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="personal">Personal</option>
                      <option value="agent">Agent</option>
                      <option value="merchant">Merchant</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Initial Status</label>
                    <select
                      value={editingMethod.data.status || 'active'}
                      onChange={(e) =>
                        setEditingMethod((prev) => ({
                          ...prev!,
                          data: { ...prev!.data, status: e.target.value as any },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Min Amount (BDT)</label>
                    <input
                      type="number"
                      value={editingMethod.data.minAmountBdt || 900}
                      onChange={(e) =>
                        setEditingMethod((prev) => ({
                          ...prev!,
                          data: { ...prev!.data, minAmountBdt: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Max Amount (BDT)</label>
                    <input
                      type="number"
                      value={editingMethod.data.maxAmountBdt || 25000}
                      onChange={(e) =>
                        setEditingMethod((prev) => ({
                          ...prev!,
                          data: { ...prev!.data, maxAmountBdt: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {!editingMethod.isNew ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleArchiveMethod(editingMethod.data.id!);
                      setEditingMethod(null);
                    }}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
                  >
                    Archive Gateway
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMethod(null)}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAction}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    Save Gateway
                  </button>
                </div>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: MANUAL BALANCE ADJUSTMENT */}
      <AnimatePresence>
        {isAdjustmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.form
              onSubmit={handleManualAdjustmentSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  Manual Wallet Balance Adjustment
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Target User (ID or @username)</label>
                  <input
                    type="text"
                    required
                    value={adjustTargetUser}
                    onChange={(e) => setAdjustTargetUser(e.target.value)}
                    placeholder="e.g. usr_live_001 or @user"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Adjustment Type</label>
                    <select
                      value={adjustType}
                      onChange={(e) => setAdjustType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="credit">Credit (+) Add Balance</option>
                      <option value="debit">Debit (-) Deduct Balance</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-300">Amount (BDT)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      placeholder="100.00"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Audit Reason (Mandatory)</label>
                  <textarea
                    rows={2}
                    required
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="e.g., Campaign bonus compensation / Manual reconciliation"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdjustment}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isSubmittingAdjustment ? 'Executing...' : 'Apply Adjustment'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
