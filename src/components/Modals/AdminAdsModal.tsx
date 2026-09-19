import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Briefcase,
  Radio,
  History,
  Search,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Zap,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Sliders,
  DollarSign,
  Coins,
  Layers,
  Sparkles,
  Users,
  FileText,
  Wallet,
  UserCheck,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdProvider, MicroJob, ChannelTask, AdminAuditLog } from '../../types';
import { AdminReferralSection } from '../Admin/AdminReferralSection';
import { AdminWalletSection } from '../Admin/AdminWalletSection';
import { AdminProfileSection } from '../Admin/AdminProfileSection';
import { TelegramOfficialLogo } from '../Common/TelegramOfficialLogo';

export const AdminAdsModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    activeAdminTab,
    setActiveAdminTab,
    adProviders,
    microJobs,
    channelTasks,
    auditLogs,
    fetchAuditLogs,
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
  } = useApp();

  const isBn = language === 'bn';

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'inactive' | 'archived'>('all');

  // Sub-modal for Add / Edit
  const [editingItem, setEditingItem] = useState<{
    type: 'ads' | 'micro_jobs' | 'channel_tasks';
    isNew: boolean;
    data: any;
  } | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'ads' | 'micro_jobs' | 'channel_tasks';
    id: string;
    title: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminModalOpen) {
      fetchAuditLogs();
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  // Filtered lists
  const filteredAds = adProviders.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.providerKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ad.adUnitId && ad.adUnitId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all'
        ? !ad.archived
        : statusFilter === 'archived'
        ? ad.archived
        : ad.status === statusFilter && !ad.archived;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = microJobs.filter((job) => {
    const matchesSearch =
      job.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.titleBn && job.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.platform.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? !job.archived
        : statusFilter === 'archived'
        ? job.archived
        : job.status === statusFilter && !job.archived;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = channelTasks.filter((task) => {
    const matchesSearch =
      task.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.channelHandle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? !task.archived
        : statusFilter === 'archived'
        ? task.archived
        : task.status === statusFilter && !task.archived;
    return matchesSearch && matchesStatus;
  });

  // Handle Reorder Up / Down
  const handleMove = async (type: 'ads' | 'micro_jobs' | 'channel_tasks', index: number, direction: 'up' | 'down') => {
    if (type === 'ads') {
      const list = [...adProviders];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      await adminReorderAds(list.map((i) => i.id));
    } else if (type === 'micro_jobs') {
      const list = [...microJobs];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      await adminReorderMicroJobs(list.map((i) => i.id));
    } else if (type === 'channel_tasks') {
      const list = [...channelTasks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return;
      const [moved] = list.splice(index, 1);
      list.splice(targetIndex, 0, moved);
      await adminReorderChannelTasks(list.map((i) => i.id));
    }
  };

  // Handle Save Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);

    try {
      const { type, isNew, data } = editingItem;
      if (type === 'ads') {
        if (isNew) {
          await adminAddAd(data);
        } else {
          await adminUpdateAd(data.id, data);
        }
      } else if (type === 'micro_jobs') {
        if (isNew) {
          await adminAddMicroJob(data);
        } else {
          await adminUpdateMicroJob(data.id, data);
        }
      } else if (type === 'channel_tasks') {
        if (isNew) {
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
    <div id="admin_ads_management_modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl max-h-[90vh] bg-[#111113] border border-[#232326] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#EDEDED]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#232326] bg-[#161618] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#00B4D8] flex items-center justify-center text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">Ads & Tasks Admin Control</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live DB Active
                </span>
              </div>
              <p className="text-xs text-[#8E8E93]">
                Manage all 3 categories (Ads, Micro Jobs, Channel Tasks) with instant real-time sync.
              </p>
            </div>
          </div>
          <button
            id="close_admin_ads_modal_btn"
            onClick={() => setIsAdminModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-[#232326] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Main Category Tabs */}
        <div className="px-4 pt-3 pb-2 border-b border-[#232326] bg-[#141416] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            id="admin_tab_ads_btn"
            onClick={() => setActiveAdminTab('ads')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'ads'
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md shadow-[#00E5FF]/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>1. Ads Placements ({adProviders.length})</span>
          </button>

          <button
            id="admin_tab_micro_jobs_btn"
            onClick={() => setActiveAdminTab('micro_jobs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'micro_jobs'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Micro Jobs ({microJobs.length})</span>
          </button>

          <button
            id="admin_tab_channel_tasks_btn"
            onClick={() => setActiveAdminTab('channel_tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'channel_tasks'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>3. Channel Tasks ({channelTasks.length})</span>
          </button>

          <button
            id="admin_tab_referral_btn"
            onClick={() => setActiveAdminTab('referral')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'referral'
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Referral System</span>
          </button>

          <button
            id="admin_tab_wallet_btn"
            onClick={() => setActiveAdminTab('wallet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'wallet'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>5. Wallet Management</span>
          </button>

          <button
            id="admin_tab_profile_btn"
            onClick={() => setActiveAdminTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'profile'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>6. Profile Management</span>
          </button>

          <button
            id="admin_tab_audit_logs_btn"
            onClick={() => setActiveAdminTab('audit_logs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'audit_logs'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 font-black'
                : 'bg-[#1C1C1F] text-[#8E8E93] hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>7. DB Audit Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Toolbar: Search, Status Filter & Create New Button */}
        {['ads', 'micro_jobs', 'channel_tasks'].includes(activeAdminTab) && (
          <div className="p-3 sm:px-4 bg-[#111113] border-b border-[#232326] flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8E8E93] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin_search_catalog_input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, ID, network..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#18181B] border border-[#232326] text-xs text-white placeholder-[#8E8E93] focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
              <select
                id="admin_status_filter_select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="py-1.5 px-2.5 rounded-xl bg-[#18181B] border border-[#232326] text-xs text-[#8E8E93] focus:outline-none focus:text-white"
              >
                <option value="all">Active Only</option>
                <option value="available">Status: Available</option>
                <option value="inactive">Status: Inactive</option>
                <option value="archived">Archived / Deleted</option>
              </select>
            </div>

            <button
              id="admin_create_new_btn"
              onClick={() => {
                if (activeAdminTab === 'ads') {
                  setEditingItem({
                    type: 'ads',
                    isNew: true,
                    data: {
                      name: '',
                      providerKey: 'gigapop',
                      adUnitId: '',
                      rewardBdt: 2.5,
                      rewardCoins: 250,
                      dailyLimit: 25,
                      cooldownSec: 60,
                      status: 'available',
                      descriptionEn: 'Rewarded video ads network placement.',
                      descriptionBn: 'ভিডিও বিজ্ঞাপন নেটওয়ার্ক।',
                    },
                  });
                } else if (activeAdminTab === 'micro_jobs') {
                  setEditingItem({
                    type: 'micro_jobs',
                    isNew: true,
                    data: {
                      titleEn: '',
                      titleBn: '',
                      platform: 'Facebook',
                      taskType: 'Follow',
                      actionUrl: 'https://',
                      rewardBdt: 10.0,
                      rewardCoins: 1000,
                      totalSlots: 100,
                      verificationType: 'manual',
                      proofRequirement: 'screenshot',
                      status: 'available',
                      dailyLimit: 1,
                    },
                  });
                } else if (activeAdminTab === 'channel_tasks') {
                  setEditingItem({
                    type: 'channel_tasks',
                    isNew: true,
                    data: {
                      titleEn: '',
                      titleBn: '',
                      channelName: '',
                      channelHandle: '@',
                      actionUrl: 'https://t.me/',
                      category: 'channel_join',
                      taskType: 'Join Channel',
                      rewardBdt: 5.0,
                      rewardCoins: 500,
                      totalSlots: 500,
                      verificationType: 'bot_api',
                      status: 'available',
                    },
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-[#0A0A0B] text-xs font-black hover:opacity-90 shadow-md shadow-[#00E5FF]/20"
            >
              <Plus className="w-4 h-4" />
              <span>
                {activeAdminTab === 'ads'
                  ? '+ Add New Ad'
                  : activeAdminTab === 'micro_jobs'
                  ? '+ Add Micro Job'
                  : '+ Add Channel Task'}
              </span>
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 1. ADS TAB LIST */}
          {activeAdminTab === 'ads' && (
            <div className="space-y-3">
              {filteredAds.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232326] text-[#8E8E93] text-xs">
                  No ad placements match your filters. Click <b>+ Add New Ad</b> to create one.
                </div>
              ) : (
                filteredAds.map((ad, idx) => (
                  <div
                    key={ad.id}
                    className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] hover:border-[#2E2E32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] shrink-0 font-black text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{ad.name}</h4>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-[#232326] text-[#00E5FF] border border-[#2E2E32]">
                            {ad.providerKey}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                              ad.status === 'available'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {ad.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] mt-1 flex-wrap">
                          <span className="text-[#00E5FF] font-bold">৳{ad.rewardBdt} BDT</span>
                          <span>•</span>
                          <span>Limit: {ad.dailyLimit}/day</span>
                          <span>•</span>
                          <span>Unit ID: {ad.adUnitId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => handleMove('ads', idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove('ads', idx, 'down')}
                        disabled={idx === filteredAds.length - 1}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Status Toggle */}
                      <button
                        onClick={() =>
                          adminToggleAdStatus(
                            ad.id,
                            ad.status === 'available' ? 'inactive' : 'available'
                          )
                        }
                        title="Toggle Status"
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                          ad.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                      >
                        {ad.status === 'available' ? 'Active' : 'Disabled'}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'ads',
                            isNew: false,
                            data: { ...ad },
                          })
                        }
                        title="Edit Placement"
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'ads',
                            id: ad.id,
                            title: ad.name,
                          })
                        }
                        title="Delete/Archive"
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 2. MICRO JOBS TAB LIST */}
          {activeAdminTab === 'micro_jobs' && (
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232326] text-[#8E8E93] text-xs">
                  No micro jobs match your search. Click <b>+ Add Micro Job</b> to create one.
                </div>
              ) : (
                filteredJobs.map((job, idx) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] hover:border-[#2E2E32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-black text-xs">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{job.titleEn}</h4>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-[#232326] text-emerald-400 border border-[#2E2E32]">
                            {job.platform}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                              job.status === 'available' || job.status === 'featured'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] mt-1 flex-wrap">
                          <span className="text-emerald-400 font-bold">৳{job.rewardBdt} BDT</span>
                          <span>•</span>
                          <span>Slots: {job.slotsLeft || job.totalSlots} left</span>
                          <span>•</span>
                          <span>Verify: {job.verificationType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleMove('micro_jobs', idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove('micro_jobs', idx, 'down')}
                        disabled={idx === filteredJobs.length - 1}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          adminToggleMicroJobStatus(
                            job.id,
                            job.status === 'available' ? 'inactive' : 'available'
                          )
                        }
                        title="Toggle Status"
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                          job.status === 'available' || job.status === 'featured'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                      >
                        {job.status === 'available' || job.status === 'featured' ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'micro_jobs',
                            isNew: false,
                            data: { ...job },
                          })
                        }
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'micro_jobs',
                            id: job.id,
                            title: job.titleEn,
                          })
                        }
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. CHANNEL TASKS TAB LIST */}
          {activeAdminTab === 'channel_tasks' && (
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232326] text-[#8E8E93] text-xs">
                  No channel tasks match your search. Click <b>+ Add Channel Task</b> to create one.
                </div>
              ) : (
                filteredTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] hover:border-[#2E2E32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(34,158,217,0.35)] border border-sky-400/30 flex items-center justify-center shrink-0">
                        <TelegramOfficialLogo className="w-10 h-10" shape="squircle" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{task.channelName}</h4>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-black rounded-lg border flex items-center gap-1 ${
                              task.category === 'group_join'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            {task.category === 'group_join' ? '👥 গ্রুপ জয়েন' : '📢 চ্যানেল জয়েন'}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-[#232326] text-blue-400 border border-[#2E2E32]">
                            {task.channelHandle}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                              task.status === 'available'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] mt-1 flex-wrap">
                          <span className="text-blue-400 font-bold">৳{task.rewardBdt} BDT</span>
                          <span>•</span>
                          <span>Type: {task.taskType || (task.category === 'group_join' ? 'Join Group' : 'Join Channel')}</span>
                          <span>•</span>
                          <span>Slots: {task.slotsLeft || task.totalSlots}</span>
                        </div>
                        {(task.descriptionEn || task.descriptionBn) && (
                          <p className="text-[10px] text-[#8E8E93] line-clamp-1 mt-1">
                            {task.descriptionEn || task.descriptionBn}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => handleMove('channel_tasks', idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove('channel_tasks', idx, 'down')}
                        disabled={idx === filteredTasks.length - 1}
                        title="Move Down"
                        className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          adminToggleChannelTaskStatus(
                            task.id,
                            task.status === 'available' ? 'inactive' : 'available'
                          )
                        }
                        title="Toggle Status"
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                          task.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                      >
                        {task.status === 'available' ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() =>
                          setEditingItem({
                            type: 'channel_tasks',
                            isNew: false,
                            data: {
                              ...task,
                              category: task.category || 'channel_join',
                              taskType: task.taskType || (task.category === 'group_join' ? 'Join Group' : 'Join Channel'),
                            },
                          })
                        }
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'channel_tasks',
                            id: task.id,
                            title: task.channelName,
                          })
                        }
                        className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. REFERRAL SYSTEM TAB */}
          {activeAdminTab === 'referral' && <AdminReferralSection />}

          {/* 5. WALLET & PAYOUT MANAGEMENT TAB */}
          {activeAdminTab === 'wallet' && <AdminWalletSection />}

          {/* 6. PROFILE MENU MANAGEMENT TAB */}
          {activeAdminTab === 'profile' && <AdminProfileSection />}

          {/* 7. DATABASE AUDIT LOGS FULL TAB */}
          {activeAdminTab === 'audit_logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141416] border border-[#232326]">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    Live System & Admin Audit Trail ({auditLogs.length} Events)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => fetchAuditLogs()}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#232326] hover:bg-[#2E2E32] text-xs font-bold text-[#8E8E93] hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Trail</span>
                </button>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#141416] border border-[#232326] text-[#8E8E93] text-xs">
                  No audit logs recorded yet in database.
                </div>
              ) : (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-[#161618] border border-[#262629] space-y-1.5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                              log.category === 'referral'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : log.category === 'ads'
                                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                                : log.category === 'micro_jobs'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : log.category === 'channel_tasks'
                                ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                            }`}
                          >
                            {log.category}
                          </span>
                          <h5 className="text-xs font-bold text-white">{log.action}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-[#8E8E93]">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA]">{log.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] font-mono">
                        <span>Admin: <strong className="text-white">{log.adminId}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-[#00E5FF]">{log.targetTitle}</strong> ({log.targetId})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Real-time DB Audit Logs Footer Preview */}
        <div className="p-3 bg-[#0D0D0E] border-t border-[#232326] flex items-center justify-between text-[11px] text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Live Engine Connected • Last modified: {auditLogs[0] ? auditLogs[0].timestamp : 'Synchronized'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#00E5FF]">QuickEarn v3.4 Pro</span>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* EDIT / CREATE POPUP FORM MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141416] border border-[#2A2A2E] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#EDEDED]"
            >
              <div className="flex items-center justify-between border-b border-[#232326] pb-3">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00E5FF]" />
                  <span>
                    {editingItem.isNew ? 'Create New' : 'Edit'}{' '}
                    {editingItem.type === 'ads'
                      ? 'Ad Placement'
                      : editingItem.type === 'micro_jobs'
                      ? 'Micro Job'
                      : 'Channel Task'}
                  </span>
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="w-8 h-8 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-[#8E8E93] hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-3.5">
                {/* 1. ADS FORM FIELDS */}
                {editingItem.type === 'ads' && (
                  <>
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Ad Placement Name *</label>
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
                        placeholder="e.g., Gigapup HD Video"
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Description</label>
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
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white placeholder-[#6E6E73] focus:outline-none focus:border-[#00E5FF] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Provider Key *</label>
                        <select
                          value={editingItem.data.providerKey || 'gigapop'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, providerKey: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="gigapop">Gigapup (Official)</option>
                          <option value="monetag">Monetag</option>
                          <option value="adsgram">Adsgram</option>
                          <option value="relaxgram">Relaxgram</option>
                          <option value="unity">Unity Ads</option>
                          <option value="adsterra">Adsterra</option>
                          <option value="custom">Custom Network</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Ad Unit / Zone ID</label>
                        <input
                          type="text"
                          value={editingItem.data.adUnitId || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, adUnitId: e.target.value },
                            })
                          }
                          placeholder="e.g. gp_zone_9921"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Reward (৳ BDT)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={editingItem.data.rewardBdt ?? 2.5}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                rewardBdt: Number(e.target.value),
                                rewardCoins: Math.round(Number(e.target.value) * 100),
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Daily Limit</label>
                        <input
                          type="number"
                          min="1"
                          value={editingItem.data.dailyLimit ?? 25}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, dailyLimit: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">Cooldown (sec)</label>
                        <input
                          type="number"
                          min="0"
                          value={editingItem.data.cooldownSec ?? 60}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, cooldownSec: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 2. MICRO JOBS FORM FIELDS */}
                {editingItem.type === 'micro_jobs' && (
                  <div className="space-y-4">
                    {/* Category Selection Grid */}
                    <div className="bg-[#121215] p-3.5 rounded-2xl border border-[#2A2A2E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-white flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
                          <span>কাজের ক্যাটাগরি সিলেক্ট করুন (Job Category) *</span>
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

                    {/* Job Titles: English & Bengali */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          Job Title (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.titleEn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                titleEn: e.target.value,
                                titleBn: editingItem.data.titleBn || e.target.value,
                              },
                            })
                          }
                          placeholder="e.g. Watch 2 Min Video & Like"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          কাজের বাংলা টাইটেল (Bengali Title) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.titleBn || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                titleBn: e.target.value,
                                titleEn: editingItem.data.titleEn || e.target.value,
                              },
                            })
                          }
                          placeholder="যেমন: ২ মিনিট ভিডিও দেখুন ও লাইক দিন"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                    </div>

                    {/* Job Descriptions: English & Bengali */}
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        কাজের বিস্তারিত বিবরণ ও নিয়মাবলী (Bengali Description) *
                      </label>
                      <textarea
                        rows={2}
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
                        placeholder="যেমন: লিঙ্কে ক্লিক করে ভিডিও ২ মিনিট দেখুন। লাইক ও কমেন্ট করে স্ক্রিনশট বা ইউজারনেম জমা দিন।"
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        Task Instructions / Description (English)
                      </label>
                      <textarea
                        rows={2}
                        value={editingItem.data.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, descriptionEn: e.target.value },
                          })
                        }
                        placeholder="e.g. Open link, watch full video for 2 minutes, like and subscribe, then submit proof."
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                      />
                    </div>

                    {/* Action URL */}
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        টার্গেট লিংক / কাজের লিংক (Target Action URL) *
                      </label>
                      <div className="relative">
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
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                        {editingItem.data.actionUrl && (
                          <a
                            href={editingItem.data.actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#00E5FF] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Reward, Total Slots, Slots Left */}
                    <div className="grid grid-cols-3 gap-2.5 bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E]">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-amber-400">পুরস্কার (৳ BDT) *</label>
                        </div>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          required
                          value={editingItem.data.rewardBdt ?? 10.0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                rewardBdt: val,
                                rewardCoins: Math.round(val * 100),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-amber-300 font-black focus:outline-none"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">
                          +{Math.round((Number(editingItem.data.rewardBdt) || 0) * 100)} Coins
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-white block mb-1">
                          মোট স্লট (Total) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editingItem.data.totalSlots ?? 100}
                          onChange={(e) => {
                            const val = Number(e.target.value);
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
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white font-bold focus:outline-none"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">মোট ইউজার</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                          খালি স্লট (Left) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={editingItem.data.totalSlots || 99999}
                          required
                          value={editingItem.data.slotsLeft ?? editingItem.data.totalSlots ?? 100}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, slotsLeft: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-emerald-300 font-black focus:outline-none"
                        />
                        <span className="text-[10px] text-emerald-500/80 mt-1 block">বাকি স্লট</span>
                      </div>
                    </div>

                    {/* Proof Type, Estimated Time, Difficulty & Status */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">প্রুফ টাইপ</label>
                        <select
                          value={editingItem.data.proofRequirement || 'screenshot'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, proofRequirement: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="screenshot">📸 স্ক্রিনশট প্রুফ</option>
                          <option value="username">👤 ইউজারনেম প্রুফ</option>
                          <option value="url">🔗 লিংক সাবমিট</option>
                          <option value="text">📝 টেক্সট / সিক্রেট কোড</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">কাজের সময়</label>
                        <select
                          value={editingItem.data.estimatedTime || '2 min'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, estimatedTime: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="30s">30 সেকেন্ড</option>
                          <option value="1 min">1 মিনিট</option>
                          <option value="2 min">2 মিনিট</option>
                          <option value="5 min">5 মিনিট</option>
                          <option value="10 min">10 মিনিট</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">কঠিনতা (Level)</label>
                        <select
                          value={editingItem.data.difficulty || 'Easy'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, difficulty: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="Easy">🟢 Easy (সহজ)</option>
                          <option value="Medium">🟡 Medium (মাঝারি)</option>
                          <option value="Hard">🔴 Hard (কঠিন)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">স্ট্যাটাস</label>
                        <select
                          value={editingItem.data.status || 'available'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, status: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="available">সক্রিয় (Active)</option>
                          <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CHANNEL TASKS FORM FIELDS */}
                {editingItem.type === 'channel_tasks' && (
                  <div className="space-y-4">
                    {/* Category Selection: Channel Join vs Group Join */}
                    <div className="bg-[#121215] p-3.5 rounded-2xl border border-[#2A2A2E] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-white flex items-center gap-1.5">
                          <TelegramOfficialLogo className="w-4 h-4" />
                          <span>টাস্কের ধরণ সিলেক্ট করুন (Telegram Task Category) *</span>
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

                      <div className="grid grid-cols-2 gap-2">
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
                            Telegram Channel subscription task
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
                            Telegram Group community member task
                          </p>
                          {editingItem.data.category === 'group_join' && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Channel / Group Name and Handle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          {editingItem.data.category === 'group_join' ? 'গ্রুপের নাম (Group Name) *' : 'চ্যানেলের নাম (Channel Name) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.channelName || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                channelName: val,
                                titleEn:
                                  editingItem.data.titleEn ||
                                  (editingItem.data.category === 'group_join'
                                    ? `Join ${val} Group`
                                    : `Join ${val}`),
                                titleBn:
                                  editingItem.data.titleBn ||
                                  (editingItem.data.category === 'group_join'
                                    ? `${val} গ্রুপে জয়েন করুন`
                                    : `${val} চ্যানেলে জয়েন করুন`),
                              },
                            });
                          }}
                          placeholder={
                            editingItem.data.category === 'group_join'
                              ? 'যেমন: BD Earners Community Group'
                              : 'যেমন: Quick Earn Official Announcement'
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          টেলিগ্রাম হ্যান্ডেল / ইউজারনেম (Handle @) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingItem.data.channelHandle || ''}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            if (val && !val.startsWith('@')) val = `@${val}`;
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                channelHandle: val,
                                actionUrl:
                                  editingItem.data.actionUrl &&
                                  editingItem.data.actionUrl !== 'https://t.me/'
                                    ? editingItem.data.actionUrl
                                    : `https://t.me/${val.replace('@', '')}`,
                              },
                            });
                          }}
                          placeholder="@ChannelHandle"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                    </div>

                    {/* Direct Invite URL */}
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        টেলিগ্রাম ইনভাইট / ডিরেক্ট লিংক (Invite URL) *
                      </label>
                      <div className="relative">
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
                          placeholder="https://t.me/..."
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                        {editingItem.data.actionUrl && (
                          <a
                            href={editingItem.data.actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#00E5FF] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Titles: English & Bengali */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          টাস্ক টাইটেল (English Title) *
                        </label>
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
                          placeholder="e.g. Join Official Announcement Channel"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                          টাস্ক বাংলা টাইটেল (Bengali Title) *
                        </label>
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
                          placeholder="যেমন: অফিসিয়াল টেলিগ্রাম চ্যানেলে যুক্ত হোন"
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>
                    </div>

                    {/* Descriptions: English & Bengali */}
                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        টাস্কের বিবরণ ও নির্দেশাবলী (Bengali Description) *
                      </label>
                      <textarea
                        rows={2}
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
                        placeholder="যেমন: টেলিগ্রাম চ্যানেলে জয়েন করুন এবং ভেরিফাই বাটনে ক্লিক করে সাথে সাথে ক্যাশ রিওয়ার্ড নিন।"
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#8E8E93] block mb-1">
                        Task Description / Rules (English)
                      </label>
                      <textarea
                        rows={2}
                        value={editingItem.data.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            data: { ...editingItem.data, descriptionEn: e.target.value },
                          })
                        }
                        placeholder="Join our official Telegram community and click verify to claim your instant reward."
                        className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none focus:border-[#00E5FF] resize-none"
                      />
                    </div>

                    {/* Reward, Total Slots, Slots Left */}
                    <div className="grid grid-cols-3 gap-2.5 bg-[#121215] p-3 rounded-2xl border border-[#2A2A2E]">
                      <div>
                        <label className="text-[11px] font-bold text-amber-400 block mb-1">
                          পুরস্কার (৳ BDT) *
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.5"
                          required
                          value={editingItem.data.rewardBdt ?? 4.0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditingItem({
                              ...editingItem,
                              data: {
                                ...editingItem.data,
                                rewardBdt: val,
                                rewardCoins: Math.round(val * 100),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-amber-300 font-black focus:outline-none"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">
                          +{Math.round((Number(editingItem.data.rewardBdt) || 0) * 100)} Coins
                        </span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-white block mb-1">
                          মোট স্লট (Total) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={editingItem.data.totalSlots ?? 500}
                          onChange={(e) => {
                            const val = Number(e.target.value);
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
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white font-bold focus:outline-none"
                        />
                        <span className="text-[10px] text-[#8E8E93] mt-1 block">মোট ইউজার</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                          খালি স্লট (Left) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={editingItem.data.totalSlots || 99999}
                          required
                          value={editingItem.data.slotsLeft ?? editingItem.data.totalSlots ?? 500}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, slotsLeft: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-emerald-300 font-black focus:outline-none"
                        />
                        <span className="text-[10px] text-emerald-500/80 mt-1 block">বাকি স্লট</span>
                      </div>
                    </div>

                    {/* Verification Type, Estimated Time, Status */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">ভেরিফিকেশন পদ্ধতি</label>
                        <select
                          value={editingItem.data.verificationType || 'bot_api'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, verificationType: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="bot_api">🤖 Bot Auto-Check (বট ভেরিফাই)</option>
                          <option value="automatic">⚡ Instant Auto Verify</option>
                          <option value="manual">👤 Admin Manual Check</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">সময়কাল (Time)</label>
                        <select
                          value={editingItem.data.estimatedTime || '15s'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, estimatedTime: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="10s">10 সেকেন্ড</option>
                          <option value="15s">15 সেকেন্ড</option>
                          <option value="30s">30 সেকেন্ড</option>
                          <option value="1 min">1 মিনিট</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#8E8E93] block mb-1">স্ট্যাটাস</label>
                        <select
                          value={editingItem.data.status || 'available'}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              data: { ...editingItem.data, status: e.target.value },
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#1C1C1F] border border-[#2A2A2E] text-xs text-white focus:outline-none"
                        >
                          <option value="available">সক্রিয় (Active)</option>
                          <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232326]">
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
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-[#0A0A0B] text-xs font-black hover:opacity-90 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving to Database...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
    </div>
  );
};
