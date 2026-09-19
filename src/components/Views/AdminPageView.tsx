import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  PlayCircle,
  Briefcase,
  Radio,
  History,
  Search,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sliders,
  DollarSign,
  Coins,
  Layers,
  Sparkles,
  Users,
  FileText,
  Wallet,
  UserCheck,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowLeft,
  RefreshCw,
  Zap,
  Send,
  User,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdProvider, MicroJob, ChannelTask } from '../../types';
import { AdminReferralSection } from '../Admin/AdminReferralSection';
import { AdminWalletSection } from '../Admin/AdminWalletSection';
import { AdminProfileSection } from '../Admin/AdminProfileSection';
import { AdminDailyBonusSection } from '../Admin/AdminDailyBonusSection';
import { TelegramOfficialLogo } from '../Common/TelegramOfficialLogo';
import { AdminLoginView } from '../Admin/AdminLoginView';
import { AdminCredentialsModal } from '../Admin/AdminCredentialsModal';

export const AdminPageView: React.FC = () => {
  const {
    activeAdminTab,
    setActiveAdminTab,
    adProviders,
    microJobs,
    channelTasks,
    auditLogs,
    fetchAuditLogs,
    dailyBonusConfig,
    referralConfig,
    withdrawalSettings,
    withdrawalRequirements,
    adminAddAd,
    adminUpdateAd,
    adminToggleAdStatus,
    adminDeleteAd,
    adminReorderAds,
    adminAddMicroJob,
    adminUpdateMicroJob,
    adminToggleMicroJobStatus,
    adminDeleteMicroJob,
    adminReorderMicroJobs,
    adminAddChannelTask,
    adminUpdateChannelTask,
    adminToggleChannelTaskStatus,
    adminDeleteChannelTask,
    adminReorderChannelTasks,
    language,
    navigateTo,
    showToast,
  } = useApp();

  const isBn = language === 'bn';

  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      sessionStorage.getItem('quickearn_admin_token') ||
      localStorage.getItem('quickearn_admin_token')
    );
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    if (typeof window === 'undefined') return 'admin_quickearn';
    return (
      sessionStorage.getItem('quickearn_admin_username') ||
      localStorage.getItem('quickearn_admin_username') ||
      'admin_quickearn'
    );
  });

  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'inactive' | 'archived'>('all');
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  // Sub-modal for Add / Edit
  const [editingItem, setEditingItem] = useState<{
    type: 'ads' | 'micro_jobs' | 'channel_tasks';
    mode: 'add' | 'edit';
    data: any;
  } | null>(null);

  // Sub-modal for Confirm Delete
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'ads' | 'micro_jobs' | 'channel_tasks';
    id: string;
    title: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSuccess = (user: string, token: string) => {
    setIsAuthenticated(true);
    setAdminUsername(user);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('quickearn_admin_token', token);
      sessionStorage.setItem('quickearn_admin_username', user);
      localStorage.setItem('quickearn_admin_token', token);
      localStorage.setItem('quickearn_admin_username', user);
    }
    showToast(
      isBn ? 'স্বাগতম অ্যাডমিন!' : 'Welcome Admin!',
      isBn ? 'অ্যাডমিন কন্ট্রোল প্যানেল আনলক হয়েছে।' : 'Admin panel access granted.',
      'success'
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('quickearn_admin_token');
      sessionStorage.removeItem('quickearn_admin_username');
      localStorage.removeItem('quickearn_admin_token');
      localStorage.removeItem('quickearn_admin_username');
    }
    showToast(
      isBn ? 'লগআউট সম্পন্ন' : 'Logged out',
      isBn ? 'আপনি অ্যাডমিন সেশন থেকে বের হয়েছেন।' : 'Admin session closed.',
      'info'
    );
  };

  const handleOpenSite = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    navigateTo('home');
  };

  // If not authenticated, display the secure AdminLoginView
  if (!isAuthenticated) {
    return (
      <AdminLoginView
        onLoginSuccess={handleLoginSuccess}
        onExit={handleOpenSite}
      />
    );
  }

  const handleRefreshAuditLogs = async () => {
    setIsRefreshingLogs(true);
    try {
      await fetchAuditLogs();
      showToast(isBn ? 'লগ রিফ্রেশ হয়েছে' : 'Logs refreshed', isBn ? 'সর্বশেষ ডেটাবেজ অডিট পাওয়া গেছে' : 'Latest DB audit retrieved', 'info');
    } finally {
      setIsRefreshingLogs(false);
    }
  };

  // Reordering Helpers
  const moveItem = async (type: 'ads' | 'micro_jobs' | 'channel_tasks', index: number, direction: 'up' | 'down') => {
    let list = type === 'ads' ? [...adProviders] : type === 'micro_jobs' ? [...microJobs] : [...channelTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const orderedIds = list.map((item: any) => item.id);
    if (type === 'ads') await adminReorderAds(orderedIds);
    else if (type === 'micro_jobs') await adminReorderMicroJobs(orderedIds);
    else if (type === 'channel_tasks') await adminReorderChannelTasks(orderedIds);
  };

  // Handle Save (Add or Update)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const { type, mode, data } = editingItem;
      if (type === 'ads') {
        if (mode === 'add') {
          await adminAddAd(data);
        } else {
          await adminUpdateAd(data.id, data);
        }
      } else if (type === 'micro_jobs') {
        if (mode === 'add') {
          await adminAddMicroJob(data);
        } else {
          await adminUpdateMicroJob(data.id, data);
        }
      } else if (type === 'channel_tasks') {
        if (mode === 'add') {
          await adminAddChannelTask(data);
        } else {
          await adminUpdateChannelTask(data.id, data);
        }
      }
      setEditingItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Confirm Delete
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);
    try {
      if (deleteConfirm.type === 'ads') {
        await adminDeleteAd(deleteConfirm.id);
      } else if (deleteConfirm.type === 'micro_jobs') {
        await adminDeleteMicroJob(deleteConfirm.id);
      } else if (deleteConfirm.type === 'channel_tasks') {
        await adminDeleteChannelTask(deleteConfirm.id);
      }
      setDeleteConfirm(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admin_page_view" className="min-h-screen bg-[#0A0A0B] text-[#EDEDED] flex flex-col font-sans selection:bg-[#00E5FF] selection:text-[#0A0A0B]">
      {/* Top Fixed Admin Bar */}
      <header className="sticky top-0 z-40 border-b border-[#232326] bg-[#141416]/95 backdrop-blur-xl px-4 py-3.5 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#00B4D8] flex items-center justify-center text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">Quick Earn Admin Panel</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Dedicated Route (/admin)
                </span>
              </div>
              <p className="text-xs text-[#8E8E93]">
                Full site configuration, real-time database management & payout controllers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin User Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1E] border border-[#2A2A30] text-xs font-mono text-[#00E5FF]">
              <User className="w-3.5 h-3.5" />
              <span className="font-semibold">{adminUsername}</span>
            </div>

            {/* Change Password & Username Button */}
            <button
              id="admin_change_creds_btn"
              onClick={() => setIsCredsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E1E22] hover:bg-[#2A2A2E] text-xs font-bold text-[#EDEDED] hover:text-white transition-all border border-[#2F2F36] shadow-sm"
              title="Change Admin Password & Username"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">পাসওয়ার্ড পরিবর্তন</span>
            </button>

            {/* Logout Button */}
            <button
              id="admin_logout_btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 border border-rose-500/25 transition-all shadow-sm"
              title="Logout Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>

            {/* Go to User Site */}
            <button
              id="admin_back_to_site_btn"
              onClick={handleOpenSite}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#232326] hover:bg-[#2A2A2E] text-xs font-bold text-[#EDEDED] hover:text-white transition-all border border-[#2F2F36] shadow-sm"
              title="Return to User Site"
            >
              <ArrowLeft className="w-4 h-4 text-[#00E5FF]" />
              <span className="hidden sm:inline">Go to User Site</span>
              <span className="sm:hidden">Site</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 flex flex-col space-y-5">
        
        {/* Navigation Tabs Bar */}
        <div className="p-1.5 rounded-2xl bg-[#141416] border border-[#232326] flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-lg">
          <button
            id="admin_page_tab_daily_bonus_btn"
            onClick={() => setActiveAdminTab('daily_bonus')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'daily_bonus'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Daily Bonus (৳{dailyBonusConfig?.day1RewardBdt || 2}-৳{dailyBonusConfig?.day7RewardBdt || 25})</span>
          </button>

          <button
            id="admin_page_tab_ads_btn"
            onClick={() => setActiveAdminTab('ads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'ads'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>2. Ads Providers ({adProviders.filter(a => a.isAvailable).length})</span>
          </button>

          <button
            id="admin_page_tab_referral_btn"
            onClick={() => setActiveAdminTab('referral')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'referral'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Referral (৳{referralConfig?.commissionAmountBdt || 15}/Ref)</span>
          </button>

          <button
            id="admin_page_tab_wallet_btn"
            onClick={() => setActiveAdminTab('wallet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'wallet'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>4. Wallet & Withdraw (Min ৳{withdrawalSettings?.minWithdrawBdt || 900})</span>
          </button>

          <button
            id="admin_page_tab_micro_jobs_btn"
            onClick={() => setActiveAdminTab('micro_jobs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'micro_jobs'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>5. Micro Jobs ({microJobs.length})</span>
          </button>

          <button
            id="admin_page_tab_channel_tasks_btn"
            onClick={() => setActiveAdminTab('channel_tasks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'channel_tasks'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>6. Channel Tasks ({channelTasks.length})</span>
          </button>

          <button
            id="admin_page_tab_profile_btn"
            onClick={() => setActiveAdminTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'profile'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>7. Profile & Links</span>
          </button>

          <button
            id="admin_page_tab_audit_btn"
            onClick={() => {
              setActiveAdminTab('audit_logs');
              fetchAuditLogs();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'audit_logs'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#1E1E22]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>8. DB Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Tab Specific Views */}
        {activeAdminTab === 'daily_bonus' && <AdminDailyBonusSection />}
        {activeAdminTab === 'referral' && <AdminReferralSection />}
        {activeAdminTab === 'wallet' && <AdminWalletSection />}
        {activeAdminTab === 'profile' && <AdminProfileSection />}

        {/* Tab: DB Audit Logs */}
        {activeAdminTab === 'audit_logs' && (
          <div className="bg-[#141416] border border-[#232326] rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#232326]">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#00E5FF]" />
                  <span>Real-Time Database Audit Logs</span>
                </h3>
                <p className="text-xs text-[#8E8E93]">
                  All admin mutations are recorded persistently in SQLite table with timestamp, action type and JSON payloads.
                </p>
              </div>
              <button
                onClick={handleRefreshAuditLogs}
                disabled={isRefreshingLogs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E1E22] hover:bg-[#28282E] text-xs font-bold text-[#EDEDED] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingLogs ? 'animate-spin text-[#00E5FF]' : ''}`} />
                <span>{isRefreshingLogs ? 'Refreshing...' : 'Refresh Logs'}</span>
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#8E8E93] border border-dashed border-[#2A2A2E] rounded-2xl">
                No administrative audit records logged yet. Make an edit to see live audit logs.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#18181B] border border-[#232326] hover:border-[#2E2E33] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          log.action.includes('add') ? 'bg-emerald-500/20 text-emerald-400' :
                          log.action.includes('delete') ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {log.action.toUpperCase()}
                        </span>
                        <span className="font-bold text-white">{log.category}</span>
                        <span className="text-[#8E8E93] font-mono text-[10px]">ID: {log.targetId}</span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] font-mono line-clamp-2">
                        {log.details}
                      </p>
                    </div>
                    <div className="text-right whitespace-nowrap text-[10px] text-[#71717A]">
                      <div>{log.adminUser}</div>
                      <div>{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Ads, Micro Jobs, Channel Tasks */}
        {(activeAdminTab === 'ads' || activeAdminTab === 'micro_jobs' || activeAdminTab === 'channel_tasks') && (
          <div className="space-y-4">
            {/* Toolbar: Search, Filter, and Add New Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#141416] border border-[#232326] shadow-lg">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeAdminTab === 'ads'
                        ? 'Search Ad networks...'
                        : activeAdminTab === 'micro_jobs'
                        ? 'Search Micro jobs...'
                        : 'Search Telegram channels...'
                    }
                    className="w-full pl-9 pr-3 py-2 bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl text-xs text-white placeholder-[#8E8E93] focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl text-xs text-white focus:border-[#00E5FF] focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="available">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              <button
                id="admin_add_new_item_btn"
                onClick={() => {
                  if (activeAdminTab === 'ads') {
                    setEditingItem({
                      type: 'ads',
                      mode: 'add',
                      data: {
                        name: '',
                        descriptionEn: '',
                        descriptionBn: '',
                        providerKey: 'gigapop',
                        type: 'rewarded_video',
                        rewardBdt: 0.5,
                        rewardCoins: 50,
                        durationSec: 15,
                        dailyLimit: 20,
                        isAvailable: true,
                        icon: 'sparkles',
                      },
                    });
                  } else if (activeAdminTab === 'micro_jobs') {
                    setEditingItem({
                      type: 'micro_jobs',
                      mode: 'add',
                      data: {
                        titleEn: '',
                        titleBn: '',
                        descriptionEn: '',
                        descriptionBn: '',
                        rewardBdt: 2.0,
                        difficulty: 'Easy',
                        actionUrl: 'https://',
                        instructionsEn: ['Follow the link and complete steps', 'Submit screenshot or username'],
                        instructionsBn: ['লিঙ্কে প্রবেশ করে কাজ শেষ করুন', 'ইউজারনেম বা স্ক্রিনশট দিন'],
                        proofRequirement: 'username',
                        verificationType: 'manual',
                        status: 'available',
                        slotsLeft: 100,
                        totalSlots: 100,
                        icon: 'briefcase',
                        estimatedTime: '2 min',
                      },
                    });
                  } else if (activeAdminTab === 'channel_tasks') {
                    setEditingItem({
                      type: 'channel_tasks',
                      mode: 'add',
                      data: {
                        titleEn: '',
                        titleBn: '',
                        channelName: '',
                        channelHandle: '@',
                        actionUrl: 'https://t.me/',
                        descriptionEn: '',
                        descriptionBn: '',
                        category: 'channel_join',
                        rewardBdt: 4.0,
                        verificationType: 'bot_api',
                        estimatedTime: '15s',
                        totalSlots: 500,
                        slotsLeft: 500,
                        status: 'available',
                      },
                    });
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-[#0A0A0B] text-xs font-black hover:opacity-90 shadow-md shadow-[#00E5FF]/20"
              >
                <Plus className="w-4 h-4" />
                <span>
                  Add New {activeAdminTab === 'ads' ? 'Ad Network' : activeAdminTab === 'micro_jobs' ? 'Micro Job' : 'Channel Task'}
                </span>
              </button>
            </div>

            {/* List Table Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeAdminTab === 'ads' &&
                adProviders
                  .filter((a) => {
                    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.providerKey.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'available' ? a.isAvailable : !a.isAvailable;
                    return matchesSearch && matchesStatus;
                  })
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#141416] border border-[#232326] hover:border-[#2F2F36] transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] flex items-center justify-center text-[#00E5FF] font-bold">
                            <PlayCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1F] text-[#8E8E93]">
                                {item.providerKey}
                              </span>
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-[#8E8E93] mt-0.5">
                              <span className="text-[#00E5FF] font-bold">৳{item.rewardBdt.toFixed(2)}</span>
                              <span>•</span>
                              <span>{item.durationSec}s</span>
                              <span>•</span>
                              <span>Limit: {item.dailyLimit}/day</span>
                            </div>
                            {(item.descriptionEn || item.descriptionBn) && (
                              <p className="text-[11px] text-[#8E8E93] line-clamp-1 mt-0.5">
                                {item.descriptionEn || item.descriptionBn}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => adminToggleAdStatus(item.id, !item.isAvailable)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            item.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.isAvailable ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#232326]/60">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveItem('ads', index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveItem('ads', index, 'down')}
                            disabled={index === adProviders.length - 1}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingItem({ type: 'ads', mode: 'edit', data: { ...item } })}
                            className="px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'ads', id: item.id, title: item.name })}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Archive</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

              {activeAdminTab === 'micro_jobs' &&
                microJobs
                  .filter((m) => {
                    const matchesSearch = m.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || m.titleBn.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'available' ? m.status === 'available' : m.status !== 'available';
                    return matchesSearch && matchesStatus;
                  })
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#141416] border border-[#232326] hover:border-[#2F2F36] transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] flex items-center justify-center text-[#00E5FF] font-bold">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{item.titleEn}</span>
                            </h4>
                            <p className="text-xs text-[#8E8E93] line-clamp-1">{item.titleBn}</p>
                            <div className="flex items-center gap-3 text-xs text-[#8E8E93] mt-1">
                              <span className="text-[#00E5FF] font-bold">৳{item.rewardBdt.toFixed(2)}</span>
                              <span>•</span>
                              <span>Slots: {item.slotsLeft}/{item.totalSlots}</span>
                              <span>•</span>
                              <span className="capitalize">{item.difficulty || 'Easy'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => adminToggleMicroJobStatus(item.id, item.status === 'available' ? 'inactive' : 'available')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            item.status === 'available'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status === 'available' ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#232326]/60">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveItem('micro_jobs', index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveItem('micro_jobs', index, 'down')}
                            disabled={index === microJobs.length - 1}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingItem({ type: 'micro_jobs', mode: 'edit', data: { ...item } })}
                            className="px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'micro_jobs', id: item.id, title: item.titleEn })}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Archive</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

              {activeAdminTab === 'channel_tasks' &&
                channelTasks
                  .filter((c) => {
                    const matchesSearch = c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) || (c.channelHandle || c.channelName || '').toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'available' ? c.status === 'available' : c.status !== 'available';
                    return matchesSearch && matchesStatus;
                  })
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#141416] border border-[#232326] hover:border-[#2F2F36] transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(34,158,217,0.35)] border border-sky-400/30 flex items-center justify-center shrink-0">
                            <TelegramOfficialLogo className="w-10 h-10" shape="squircle" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>{item.channelName || item.titleEn}</span>
                              </h4>
                              <span
                                className={`px-2 py-0.5 text-[9px] font-black rounded-lg border flex items-center gap-1 ${
                                  item.category === 'group_join'
                                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                    : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {item.category === 'group_join' ? '👥 গ্রুপ জয়েন' : '📢 চ্যানেল জয়েন'}
                              </span>
                            </div>
                            <p className="text-xs text-[#00E5FF] font-mono">{item.channelHandle || item.actionUrl}</p>
                            <div className="flex items-center gap-3 text-xs text-[#8E8E93] mt-1">
                              <span className="text-[#00E5FF] font-bold">৳{item.rewardBdt.toFixed(2)}</span>
                              <span>•</span>
                              <span>Slots: {item.slotsLeft || 500}/{item.totalSlots || 500}</span>
                              <span>•</span>
                              <span className="capitalize">{item.verificationType || 'Bot API'}</span>
                            </div>
                            {(item.descriptionEn || item.descriptionBn) && (
                              <p className="text-[11px] text-[#8E8E93] line-clamp-1 mt-1">
                                {item.descriptionEn || item.descriptionBn}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => adminToggleChannelTaskStatus(item.id, item.status === 'available' ? 'inactive' : 'available')}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            item.status === 'available'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status === 'available' ? 'Active' : 'Inactive'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#232326]/60">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveItem('channel_tasks', index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveItem('channel_tasks', index, 'down')}
                            disabled={index === channelTasks.length - 1}
                            className="p-1.5 rounded-lg bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              setEditingItem({
                                type: 'channel_tasks',
                                mode: 'edit',
                                data: {
                                  ...item,
                                  category: item.category || 'channel_join',
                                  taskType: item.taskType || (item.category === 'group_join' ? 'Join Group' : 'Join Channel'),
                                  channelName: item.channelName || item.titleEn,
                                  channelHandle: item.channelHandle || '@telegram',
                                  actionUrl: item.actionUrl || 'https://t.me/',
                                  descriptionEn: item.descriptionEn || '',
                                  descriptionBn: item.descriptionBn || '',
                                },
                              })
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'channel_tasks', id: item.id, title: item.titleEn })}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Archive</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* Modal: Add or Edit item                                  */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141416] border border-[#2A2A2E] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#EDEDED]"
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2E] pb-3">
                <h3 className="text-base font-black text-white">
                  {editingItem.mode === 'add' ? 'Add New' : 'Edit'}{' '}
                  {editingItem.type === 'ads'
                    ? 'Ad Provider'
                    : editingItem.type === 'micro_jobs'
                    ? 'Micro Job'
                    : 'Channel Task'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 rounded-xl bg-[#232326] text-[#8E8E93] hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
                {editingItem.type === 'ads' && (
                  <>
                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Provider Display Name</label>
                      <input
                        type="text"
                        required
                        value={editingItem.data.name || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, name: e.target.value },
                          })
                        }
                        placeholder="e.g. Gigapup HD Video"
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={editingItem.data.descriptionEn || editingItem.data.descriptionBn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: {
                              ...editingItem.data,
                              descriptionEn: e.target.value,
                              descriptionBn: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Watch a short video sponsor to earn instant BDT reward"
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white placeholder-[#6E6E73] focus:border-[#00E5FF] focus:outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">Provider Key</label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.providerKey || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, providerKey: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">Ad Type</label>
                        <select
                          value={editingItem.data.type || 'rewarded_video'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, type: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none"
                        >
                          <option value="rewarded_video">Rewarded Video</option>
                          <option value="interstitial">Interstitial</option>
                          <option value="sponsor_ad">Sponsor Task</option>
                          <option value="click_banner">Banner Click</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">Reward (BDT ৳)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={editingItem.data.rewardBdt ?? ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                rewardBdt: val,
                              },
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">Daily Limit (Ads/day)</label>
                        <input
                          type="number"
                          required
                          value={editingItem.data.dailyLimit ?? ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, dailyLimit: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {editingItem.type === 'micro_jobs' && (
                  <>
                    {/* Micro Job Category Selection Grid */}
                    <div className="bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                          <span>কাজের ক্যাটাগরি নির্বাচন করুন (Job Category) *</span>
                        </label>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                          {editingItem.data.platform || 'Facebook'} ({editingItem.data.category || 'social'})
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
                        {[
                          { id: 'youtube', platform: 'YouTube', icon: '🎬', labelEn: 'YouTube', labelBn: 'ইউটিউব' },
                          { id: 'facebook', platform: 'Facebook', icon: '📘', labelEn: 'Facebook', labelBn: 'ফেসবুক' },
                          { id: 'website', platform: 'Website', icon: '🌐', labelEn: 'Website', labelBn: 'ওয়েবসাইট' },
                          { id: 'telegram', platform: 'Telegram', icon: '✈️', labelEn: 'Telegram', labelBn: 'টেলিগ্রাম' },
                          { id: 'app', platform: 'App Install', icon: '📱', labelEn: 'App Install', labelBn: 'অ্যাপ' },
                          { id: 'instagram', platform: 'Instagram', icon: '📷', labelEn: 'Instagram', labelBn: 'ইনস্টাগ্রাম' },
                          { id: 'tiktok', platform: 'TikTok', icon: '🎵', labelEn: 'TikTok', labelBn: 'টিকটক' },
                          { id: 'other', platform: 'Survey', icon: '📋', labelEn: 'Survey/Other', labelBn: 'অন্যান্য' },
                        ].map((cat) => {
                          const isSelected =
                            editingItem.data.category === cat.id ||
                            editingItem.data.platform?.toLowerCase() === cat.platform.toLowerCase();
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setEditingItem({
                                  ...editingItem,
                                  data: {
                                    ...editingItem.data,
                                    category: cat.id,
                                    platform: cat.platform,
                                  },
                                });
                              }}
                              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                                isSelected
                                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                                  : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3E3E44] hover:text-white'
                              }`}
                            >
                              <span className="text-base leading-none">{cat.icon}</span>
                              <span className="text-[10px] font-bold leading-tight truncate w-full">
                                {cat.labelBn}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">Job Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.titleEn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, titleEn: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                          placeholder="e.g. Subscribe to YouTube Channel"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">কাজের বাংলা টাইটেল (Bangla) *</label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.titleBn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, titleBn: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                          placeholder="যেমন: ইউটিউব চ্যানেল সাবস্ক্রাইব করুন"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">কাজের নিয়মাবলী ও নির্দেশাবলী (বাংলা) *</label>
                      <textarea
                        rows={2}
                        placeholder="কাজের বিস্তারিত নিয়ম ও সাবমিট করার নির্দেশনা বাংলায়..."
                        value={editingItem.data.descriptionBn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: {
                              ...editingItem.data,
                              descriptionBn: e.target.value,
                              descriptionEn: editingItem.data.descriptionEn || e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Job Instructions (English)</label>
                      <textarea
                        rows={2}
                        placeholder="Detailed task steps and submission instructions in English..."
                        value={editingItem.data.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, descriptionEn: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Target Action URL *</label>
                      <input
                        type="url"
                        required
                        value={editingItem.data.actionUrl || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, actionUrl: e.target.value },
                          })
                        }
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E]">
                      <div>
                        <label className="block text-amber-400 font-bold mb-1">পুরস্কার (৳ BDT) *</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          required
                          value={editingItem.data.rewardBdt ?? 10.0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                rewardBdt: val,
                                rewardCoins: Math.round(val * 100),
                              },
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-amber-300 font-black focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">
                          +{Math.round((Number(editingItem.data.rewardBdt) || 0) * 100)} Coins
                        </span>
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-1">মোট স্লট (Total) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editingItem.data.totalSlots ?? 100}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                totalSlots: val,
                                slotsLeft:
                                  editingItem.data.slotsLeft === undefined ||
                                  editingItem.data.slotsLeft > val
                                    ? val
                                    : editingItem.data.slotsLeft,
                              },
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white font-bold focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">মোট ইউজার</span>
                      </div>
                      <div>
                        <label className="block text-emerald-400 font-bold mb-1">খালি স্লট (Left) *</label>
                        <input
                          type="number"
                          min="0"
                          max={editingItem.data.totalSlots || 99999}
                          required
                          value={editingItem.data.slotsLeft ?? editingItem.data.totalSlots ?? 100}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                slotsLeft: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-emerald-300 font-black focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-emerald-500/80 mt-1 block">বাকি স্লট</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">প্রুফ টাইপ</label>
                        <select
                          value={editingItem.data.proofRequirement || 'screenshot'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, proofRequirement: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="screenshot">📸 স্ক্রিনশট প্রুফ</option>
                          <option value="username">👤 ইউজারনেম প্রুফ</option>
                          <option value="url">🔗 লিংক সাবমিট</option>
                          <option value="text">📝 টেক্সট / সিক্রেট কোড</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">কাজের সময়</label>
                        <select
                          value={editingItem.data.estimatedTime || '2 min'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, estimatedTime: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="30s">30 সেকেন্ড</option>
                          <option value="1 min">1 মিনিট</option>
                          <option value="2 min">2 মিনিট</option>
                          <option value="5 min">5 মিনিট</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">কঠিনতা</label>
                        <select
                          value={editingItem.data.difficulty || 'Easy'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, difficulty: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="Easy">🟢 সহজ (Easy)</option>
                          <option value="Medium">🟡 মাঝারি (Med)</option>
                          <option value="Hard">🔴 কঠিন (Hard)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">স্ট্যাটাস</label>
                        <select
                          value={editingItem.data.status || 'available'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, status: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="available">সক্রিয় (Active)</option>
                          <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {editingItem.type === 'channel_tasks' && (
                  <>
                    {/* Category Selection: Channel Join vs Group Join */}
                    <div className="bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-white flex items-center gap-1.5">
                          <TelegramOfficialLogo className="w-4 h-4" />
                          <span>টাস্কের ধরণ সিলেক্ট করুন (Task Category)</span>
                        </label>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                            editingItem.data.category === 'group_join'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {editingItem.data.category === 'group_join' ? '👥 গ্রুপ জয়েন মোড' : '📢 চ্যানেল জয়েন মোড'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Channel Join Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                category: 'channel_join',
                                taskType: 'Join Channel',
                              },
                            });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                            editingItem.data.category !== 'group_join'
                              ? 'bg-blue-500/15 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                              : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3E3E44]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`p-1.5 rounded-lg ${
                                editingItem.data.category !== 'group_join'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-[#28282D] text-[#8E8E93]'
                              }`}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-black">📢 চ্যানেল জয়েন</span>
                          </div>
                          <p className="text-[10px] text-[#8E8E93]">
                            Telegram Channel link
                          </p>
                          {editingItem.data.category !== 'group_join' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </button>

                        {/* Group Join Option */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                category: 'group_join',
                                taskType: 'Join Group',
                              },
                            });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                            editingItem.data.category === 'group_join'
                              ? 'bg-purple-500/15 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                              : 'bg-[#1C1C1F] border-[#2A2A2E] text-[#8E8E93] hover:border-[#3E3E44]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`p-1.5 rounded-lg ${
                                editingItem.data.category === 'group_join'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-[#28282D] text-[#8E8E93]'
                              }`}
                            >
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-black">👥 গ্রুপ জয়েন</span>
                          </div>
                          <p className="text-[10px] text-[#8E8E93]">
                            Telegram Group invite link
                          </p>
                          {editingItem.data.category === 'group_join' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">
                          {editingItem.data.category === 'group_join'
                            ? 'Group Name / Title (EN)'
                            : 'Channel Name / Title (EN)'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            editingItem.data.category === 'group_join'
                              ? 'e.g. BD Earners Community Group'
                              : 'e.g. Quick Earn Official Channel'
                          }
                          value={editingItem.data.titleEn || editingItem.data.channelName || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                titleEn: e.target.value,
                                channelName: editingItem.data.channelName || e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">
                          {editingItem.data.category === 'group_join'
                            ? 'Group Name / Title (BN)'
                            : 'Channel Name / Title (BN)'}
                        </label>
                        <input
                          type="text"
                          placeholder={
                            editingItem.data.category === 'group_join'
                              ? 'e.g. বিডি আর্নার্স কমিউনিটি গ্রুপ'
                              : 'e.g. কুইক আর্ন অফিসিয়াল চ্যানেল'
                          }
                          value={editingItem.data.titleBn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, titleBn: e.target.value },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">
                          {editingItem.data.category === 'group_join'
                            ? 'Telegram Group Handle (@)'
                            : 'Telegram Channel Handle (@)'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            editingItem.data.category === 'group_join'
                              ? '@BDEarnersCommunity'
                              : '@QuickEarnOfficial'
                          }
                          value={editingItem.data.channelHandle || editingItem.data.channelUsername || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                channelHandle: e.target.value,
                                channelUsername: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] font-bold mb-1">
                          {editingItem.data.category === 'group_join'
                            ? 'Telegram Group Direct / Invite Link'
                            : 'Telegram Channel Direct Link'}
                        </label>
                        <input
                          type="url"
                          required
                          placeholder={
                            editingItem.data.category === 'group_join'
                              ? 'https://t.me/BDEarnersCommunity'
                              : 'https://t.me/QuickEarnOfficial'
                          }
                          value={editingItem.data.actionUrl || editingItem.data.telegramLink || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                actionUrl: e.target.value,
                                telegramLink: e.target.value,
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Task Description / Instructions (English)</label>
                      <textarea
                        rows={2}
                        placeholder="Write detailed English description/instructions for users..."
                        value={editingItem.data.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, descriptionEn: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[#8E8E93] font-bold mb-1">Task Description / Instructions (Bangla)</label>
                      <textarea
                        rows={2}
                        placeholder="ইউজারদের জন্য বাংলায় বিস্তারিত কাজের বিবরণ ও নিয়মাবলী লিখুন..."
                        value={editingItem.data.descriptionBn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, descriptionBn: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E]">
                      <div>
                        <label className="block text-amber-400 font-bold mb-1">পুরস্কার (৳ BDT) *</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          required
                          value={editingItem.data.rewardBdt ?? 4.0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, rewardBdt: val, rewardCoins: Math.round(val * 100) },
                            })
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-amber-300 font-black focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">
                          +{Math.round((Number(editingItem.data.rewardBdt) || 0) * 100)} Coins
                        </span>
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-1">মোট স্লট (Total) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editingItem.data.totalSlots ?? 500}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                totalSlots: val,
                                slotsLeft:
                                  editingItem.data.slotsLeft === undefined ||
                                  editingItem.data.slotsLeft > val
                                    ? val
                                    : editingItem.data.slotsLeft,
                              },
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white font-bold focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">মোট ইউজার</span>
                      </div>
                      <div>
                        <label className="block text-emerald-400 font-bold mb-1">খালি স্লট (Left) *</label>
                        <input
                          type="number"
                          min="0"
                          max={editingItem.data.totalSlots || 99999}
                          required
                          value={editingItem.data.slotsLeft ?? editingItem.data.totalSlots ?? 500}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, slotsLeft: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full p-2.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-emerald-300 font-black focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                        <span className="text-[10px] text-emerald-500/80 mt-1 block">বাকি স্লট</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">ভেরিফিকেশন</label>
                        <select
                          value={editingItem.data.verificationType || 'bot_api'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, verificationType: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="bot_api">🤖 Bot Auto-Check</option>
                          <option value="automatic">⚡ Instant Auto Verify</option>
                          <option value="manual">👤 Admin Manual Check</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">সময়কাল</label>
                        <input
                          type="text"
                          placeholder="15s"
                          value={editingItem.data.estimatedTime || '15s'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, estimatedTime: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white focus:border-[#00E5FF] focus:outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#8E8E93] text-[10px] font-bold mb-1">স্ট্যাটাস</label>
                        <select
                          value={editingItem.data.status || 'available'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, status: e.target.value },
                            })
                          }
                          className="w-full p-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-white text-xs"
                        >
                          <option value="available">সক্রিয় (Active)</option>
                          <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2A2A2E]">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl bg-[#1C1C1F] text-xs font-bold text-[#8E8E93] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#00E5FF] text-[#0A0A0B] text-xs font-black hover:bg-[#00B4D8] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* Modal: Confirm Delete                                    */}
      {/* ======================================================== */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#141416] border border-[#2A2A2E] rounded-3xl p-5 shadow-2xl space-y-4 text-center text-[#EDEDED]"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Confirm Removal</h4>
                <p className="text-xs text-[#8E8E93] mt-1">
                  Are you sure you want to archive <b>"{deleteConfirm.title}"</b>? This will hide it from the user interface immediately.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 rounded-xl bg-[#1C1C1F] text-xs font-bold text-[#8E8E93] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-black hover:bg-rose-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Archiving...' : 'Yes, Remove'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Credentials Modal (Change Username/Password) */}
      <AdminCredentialsModal
        isOpen={isCredsModalOpen}
        onClose={() => setIsCredsModalOpen(false)}
        currentAdminUsername={adminUsername}
        onCredentialsChanged={(newUsername) => {
          setAdminUsername(newUsername);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('quickearn_admin_username', newUsername);
            localStorage.setItem('quickearn_admin_username', newUsername);
          }
        }}
        showToast={showToast}
      />
    </div>
  );
};
