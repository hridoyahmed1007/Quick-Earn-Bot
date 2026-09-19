import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck,
  Send,
  MessageSquare,
  Mail,
  Share2,
  Globe,
  Info,
  Shield,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Smartphone,
  FileText,
  Sliders,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  ProfileSocialLink,
  ProfileFaqItem,
  ProfileSectionItem,
} from '../../types';

export const AdminProfileSection: React.FC = () => {
  const {
    profileConfig,
    adminUpdateProfileSupport,
    adminAddSocialLink,
    adminUpdateSocialLink,
    adminToggleSocialLinkStatus,
    adminDeleteSocialLink,
    adminReorderSocialLinks,
    adminUpdateProfileAppInfo,
    adminUpdateProfileLegal,
    adminAddProfileFaq,
    adminUpdateProfileFaq,
    adminDeleteProfileFaq,
    adminToggleProfileSectionVisibility,
    adminReorderProfileSections,
    language,
    showToast,
  } = useApp();

  const isBn = language === 'bn';

  // Sub-navigation inside Profile Admin
  const [activeSubTab, setActiveSubTab] = useState<
    'support' | 'socials' | 'appinfo_faqs' | 'legal' | 'layout'
  >('support');

  // SUPPORT STATE
  const [telegramTitle, setTelegramTitle] = useState(profileConfig.support?.telegram?.title || '');
  const [telegramHandle, setTelegramHandle] = useState(profileConfig.support?.telegram?.handle || '');
  const [telegramLink, setTelegramLink] = useState(profileConfig.support?.telegram?.link || '');
  const [telegramActive, setTelegramActive] = useState(profileConfig.support?.telegram?.isActive ?? true);

  const [whatsappTitle, setWhatsappTitle] = useState(profileConfig.support?.whatsapp?.title || '');
  const [whatsappNumber, setWhatsappNumber] = useState(profileConfig.support?.whatsapp?.number || '');
  const [whatsappLink, setWhatsappLink] = useState(profileConfig.support?.whatsapp?.link || '');
  const [whatsappActive, setWhatsappActive] = useState(profileConfig.support?.whatsapp?.isActive ?? true);

  const [emailTitle, setEmailTitle] = useState(profileConfig.support?.email?.title || '');
  const [emailAddress, setEmailAddress] = useState(profileConfig.support?.email?.address || '');
  const [emailActive, setEmailActive] = useState(profileConfig.support?.email?.isActive ?? true);

  const [isSavingSupport, setIsSavingSupport] = useState(false);

  // SOCIAL LINK MODAL / FORM
  const [editingSocial, setEditingSocial] = useState<{
    isNew: boolean;
    data: Partial<ProfileSocialLink>;
  } | null>(null);

  // APP INFO STATE
  const [appName, setAppName] = useState(profileConfig.appInfo?.appName || 'Quick Earn');
  const [appVersion, setAppVersion] = useState(profileConfig.appInfo?.version || 'v3.4.0');
  const [sloganEn, setSloganEn] = useState(profileConfig.appInfo?.sloganEn || '');
  const [sloganBn, setSloganBn] = useState(profileConfig.appInfo?.sloganBn || '');
  const [copyrightText, setCopyrightText] = useState(profileConfig.appInfo?.copyrightText || '');
  const [isSavingAppInfo, setIsSavingAppInfo] = useState(false);

  // FAQ MODAL / FORM
  const [editingFaq, setEditingFaq] = useState<{
    isNew: boolean;
    data: Partial<ProfileFaqItem>;
  } | null>(null);

  // LEGAL & PRIVACY STATE
  const [legalTitleEn, setLegalTitleEn] = useState(profileConfig.legal?.titleEn || 'Terms & Security Rules');
  const [legalTitleBn, setLegalTitleBn] = useState(profileConfig.legal?.titleBn || 'শর্তাবলী ও নিরাপত্তা নির্দেশিকা');
  const [legalRulesEnText, setLegalRulesEnText] = useState(
    (profileConfig.legal?.rulesEn || []).join('\n')
  );
  const [legalRulesBnText, setLegalRulesBnText] = useState(
    (profileConfig.legal?.rulesBn || []).join('\n')
  );
  const [isSavingLegal, setIsSavingLegal] = useState(false);

  // ==========================================
  // HANDLERS
  // ==========================================

  // Save Support
  const handleSaveSupport = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSupport(true);
    const success = await adminUpdateProfileSupport({
      telegram: {
        title: telegramTitle,
        handle: telegramHandle,
        link: telegramLink,
        isActive: telegramActive,
      },
      whatsapp: {
        title: whatsappTitle,
        number: whatsappNumber,
        link: whatsappLink,
        isActive: whatsappActive,
      },
      email: {
        title: emailTitle,
        address: emailAddress,
        isActive: emailActive,
      },
    });
    setIsSavingSupport(false);
    if (success) {
      showToast('Support Updated', 'Profile support contacts saved to live database', 'success');
    }
  };

  // Save App Info
  const handleSaveAppInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingAppInfo(true);
    const success = await adminUpdateProfileAppInfo({
      appName,
      version: appVersion,
      sloganEn,
      sloganBn,
      copyrightText,
    });
    setIsSavingAppInfo(false);
    if (success) {
      showToast('App Info Saved', 'App details updated in profile', 'success');
    }
  };

  // Save Legal
  const handleSaveLegal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingLegal(true);
    const rulesEn = legalRulesEnText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    const rulesBn = legalRulesBnText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const success = await adminUpdateProfileLegal({
      titleEn: legalTitleEn,
      titleBn: legalTitleBn,
      subtitleEn: profileConfig.legal?.subtitleEn || 'Official platform terms & guidelines',
      subtitleBn: profileConfig.legal?.subtitleBn || 'অফিসিয়াল নীতি ও প্ল্যাটফর্ম নির্দেশিকা',
      rulesEn,
      rulesBn,
    });
    setIsSavingLegal(false);
    if (success) {
      showToast('Legal Rules Saved', 'Terms & privacy terms updated in live database', 'success');
    }
  };

  // Social Links Reorder
  const handleMoveSocial = async (index: number, direction: 'up' | 'down') => {
    const list = [...(profileConfig.socialLinks || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    await adminReorderSocialLinks(list.map((s) => s.id));
  };

  // Save Social Link Form
  const handleSaveSocialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;

    if (editingSocial.isNew) {
      await adminAddSocialLink({
        titleEn: editingSocial.data.titleEn || 'New Social Link',
        titleBn: editingSocial.data.titleBn || editingSocial.data.titleEn || 'সোশ্যাল লিংক',
        platform: editingSocial.data.platform || 'Telegram',
        url: editingSocial.data.url || 'https://t.me/',
        icon: editingSocial.data.icon || 'Send',
        badgeEn: editingSocial.data.badgeEn || '',
        badgeBn: editingSocial.data.badgeBn || '',
        isActive: editingSocial.data.isActive ?? true,
      });
      showToast('Social Link Added', 'New link created in Profile Menu', 'success');
    } else if (editingSocial.data.id) {
      await adminUpdateSocialLink(editingSocial.data.id, {
        titleEn: editingSocial.data.titleEn,
        titleBn: editingSocial.data.titleBn,
        platform: editingSocial.data.platform,
        url: editingSocial.data.url,
        icon: editingSocial.data.icon,
        badgeEn: editingSocial.data.badgeEn,
        badgeBn: editingSocial.data.badgeBn,
        isActive: editingSocial.data.isActive,
      });
      showToast('Social Link Saved', 'Updated social link details', 'success');
    }
    setEditingSocial(null);
  };

  // Save FAQ Form
  const handleSaveFaqForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;

    if (editingFaq.isNew) {
      await adminAddProfileFaq({
        qEn: editingFaq.data.qEn || '',
        qBn: editingFaq.data.qBn || '',
        aEn: editingFaq.data.aEn || '',
        aBn: editingFaq.data.aBn || '',
        isActive: editingFaq.data.isActive ?? true,
      });
      showToast('FAQ Added', 'New FAQ item created', 'success');
    } else if (editingFaq.data.id) {
      await adminUpdateProfileFaq(editingFaq.data.id, {
        qEn: editingFaq.data.qEn,
        qBn: editingFaq.data.qBn,
        aEn: editingFaq.data.aEn,
        aBn: editingFaq.data.aBn,
        isActive: editingFaq.data.isActive,
      });
      showToast('FAQ Updated', 'FAQ item updated successfully', 'success');
    }
    setEditingFaq(null);
  };

  // Section Reorder
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const list = [...(profileConfig.sections || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    await adminReorderProfileSections(list.map((s) => s.key));
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17171A] to-[#1F1F24] border border-[#2E2E34] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Profile Menu Live Management</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Real DB
              </span>
            </h3>
            <p className="text-[11px] text-[#8E8E93]">
              Manage existing Profile support contacts, official socials, FAQs, legal rules & layout order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E8E93] self-end sm:self-center bg-[#111113] px-3 py-1.5 rounded-xl border border-[#232326]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Sync: Instant Cache + Server</span>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#232326]">
        <button
          id="admin_profile_subtab_support"
          onClick={() => setActiveSubTab('support')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'support'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
              : 'bg-[#18181B] text-[#8E8E93] hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>A. Contact Support</span>
        </button>

        <button
          id="admin_profile_subtab_socials"
          onClick={() => setActiveSubTab('socials')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'socials'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
              : 'bg-[#18181B] text-[#8E8E93] hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>B. Social Links ({profileConfig.socialLinks?.length || 0})</span>
        </button>

        <button
          id="admin_profile_subtab_appinfo"
          onClick={() => setActiveSubTab('appinfo_faqs')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'appinfo_faqs'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
              : 'bg-[#18181B] text-[#8E8E93] hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>C. App Info & FAQs</span>
        </button>

        <button
          id="admin_profile_subtab_legal"
          onClick={() => setActiveSubTab('legal')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'legal'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
              : 'bg-[#18181B] text-[#8E8E93] hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>D. Terms & Privacy</span>
        </button>

        <button
          id="admin_profile_subtab_layout"
          onClick={() => setActiveSubTab('layout')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'layout'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-black'
              : 'bg-[#18181B] text-[#8E8E93] hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>E. Section Visibility & Order</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SUB-TAB A: CONTACT SUPPORT */}
      {/* ======================================================== */}
      {activeSubTab === 'support' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Telegram Support Card */}
            <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Telegram Support</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTelegramActive(!telegramActive)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    telegramActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {telegramActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Display Title</label>
                  <input
                    type="text"
                    value={telegramTitle}
                    onChange={(e) => setTelegramTitle(e.target.value)}
                    placeholder="Telegram Support Channel"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Username / Handle</label>
                  <input
                    type="text"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    placeholder="@QuickEarnSupport"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Target URL / Deep Link</label>
                  <input
                    type="text"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="https://t.me/QuickEarnSupport"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Support Card */}
            <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">WhatsApp Helpline</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsappActive(!whatsappActive)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    whatsappActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {whatsappActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Display Title</label>
                  <input
                    type="text"
                    value={whatsappTitle}
                    onChange={(e) => setWhatsappTitle(e.target.value)}
                    placeholder="24/7 Helpline Bot"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Number / Identifier</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Target URL / Bot Link</label>
                  <input
                    type="text"
                    value={whatsappLink}
                    onChange={(e) => setWhatsappLink(e.target.value)}
                    placeholder="https://t.me/QuickEarnAdminBot"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Email Support</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailActive(!emailActive)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    emailActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {emailActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Display Title</label>
                  <input
                    type="text"
                    value={emailTitle}
                    onChange={(e) => setEmailTitle(e.target.value)}
                    placeholder="Official Support Desk"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="support@quickearn.app"
                    className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                  />
                </div>
                <div className="pt-2 text-[10px] text-[#8E8E93]">
                  Users clicking email will launch their default mail client directly.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              id="admin_save_support_btn"
              onClick={handleSaveSupport}
              disabled={isSavingSupport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black hover:bg-purple-500 disabled:opacity-50 transition-all shadow-md shadow-purple-600/20"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSupport ? 'Saving Support...' : 'Save Support Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SUB-TAB B: SOCIAL LINKS */}
      {/* ======================================================== */}
      {activeSubTab === 'socials' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-[#141416] p-3 rounded-2xl border border-[#232326]">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white">
                Manage Profile Social Media & Communities ({profileConfig.socialLinks?.length || 0})
              </h4>
            </div>
            <button
              id="admin_add_social_link_btn"
              onClick={() =>
                setEditingSocial({
                  isNew: true,
                  data: {
                    titleEn: '',
                    titleBn: '',
                    platform: 'Telegram',
                    url: 'https://',
                    icon: 'Send',
                    badgeEn: 'Official',
                    badgeBn: 'অফিসিয়াল',
                    isActive: true,
                  },
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Social Link</span>
            </button>
          </div>

          <div className="space-y-2">
            {(profileConfig.socialLinks || []).map((social, idx) => (
              <div
                key={social.id}
                className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] hover:border-[#2E2E32] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{social.titleEn}</h4>
                      <span className="text-xs text-[#8E8E93]">({social.titleBn})</span>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-[#232326] text-purple-400 border border-[#2E2E32]">
                        {social.platform}
                      </span>
                      {social.badgeEn && (
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {social.badgeEn}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] mt-1 font-mono break-all">
                      <ExternalLink className="w-3 h-3 text-[#8E8E93] shrink-0" />
                      <span>{social.url}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleMoveSocial(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveSocial(idx, 'down')}
                    disabled={idx === (profileConfig.socialLinks || []).length - 1}
                    title="Move Down"
                    className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => adminToggleSocialLinkStatus(social.id, !social.isActive)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                      social.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    }`}
                  >
                    {social.isActive ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() =>
                      setEditingSocial({
                        isNew: false,
                        data: { ...social },
                      })
                    }
                    className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                  </button>

                  <button
                    onClick={() => adminDeleteSocialLink(social.id)}
                    className="p-1.5 rounded-lg bg-[#1F1F22] hover:bg-rose-500/20 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SUB-TAB C: APP INFO & FAQS */}
      {/* ======================================================== */}
      {activeSubTab === 'appinfo_faqs' && (
        <div className="space-y-5">
          {/* App Info Card */}
          <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>Application Metadata & Version Slogan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">App Display Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Quick Earn"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Version String</label>
                <input
                  type="text"
                  value={appVersion}
                  onChange={(e) => setAppVersion(e.target.value)}
                  placeholder="v3.4.0-Production"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Slogan (English)</label>
                <input
                  type="text"
                  value={sloganEn}
                  onChange={(e) => setSloganEn(e.target.value)}
                  placeholder="Trusted Micro Earning Platform in Bangladesh"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Slogan (Bengali)</label>
                <input
                  type="text"
                  value={sloganBn}
                  onChange={(e) => setSloganBn(e.target.value)}
                  placeholder="বাংলাদেশের বিশ্বস্ত মাইক্রো আর্নিং ও রিওয়ার্ড প্ল্যাটফর্ম"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAppInfo}
                disabled={isSavingAppInfo}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingAppInfo ? 'Saving...' : 'Save App Info'}</span>
              </button>
            </div>
          </div>

          {/* FAQs Manager */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#141416] p-3 rounded-2xl border border-[#232326]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white">
                  Help Center FAQ Items ({profileConfig.faqs?.length || 0})
                </h4>
              </div>
              <button
                id="admin_add_faq_btn"
                onClick={() =>
                  setEditingFaq({
                    isNew: true,
                    data: {
                      qEn: '',
                      qBn: '',
                      aEn: '',
                      aBn: '',
                      isActive: true,
                    },
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-black hover:bg-amber-400"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add FAQ Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {(profileConfig.faqs || []).map((faq, idx) => (
                <div
                  key={faq.id}
                  className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-white">{faq.qEn}</h5>
                      <p className="text-[11px] text-[#8E8E93]">{faq.qBn}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          adminUpdateProfileFaq(faq.id, { isActive: !faq.isActive })
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          faq.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {faq.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() =>
                          setEditingFaq({
                            isNew: false,
                            data: { ...faq },
                          })
                        }
                        className="p-1 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                      <button
                        onClick={() => adminDeleteProfileFaq(faq.id)}
                        className="p-1 rounded-lg bg-[#1F1F22] hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#111113] border border-[#232326] text-[11px] text-[#A1A1AA] leading-relaxed">
                    <p className="font-medium">{faq.aEn}</p>
                    <p className="text-[#71717A] mt-1">{faq.aBn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SUB-TAB D: TERMS & PRIVACY */}
      {/* ======================================================== */}
      {activeSubTab === 'legal' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Terms of Service, Privacy Policy & Security Rules</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Title (English)</label>
                <input
                  type="text"
                  value={legalTitleEn}
                  onChange={(e) => setLegalTitleEn(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">Title (Bengali)</label>
                <input
                  type="text"
                  value={legalTitleBn}
                  onChange={(e) => setLegalTitleBn(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">
                  Rules & Terms (English — 1 rule per line)
                </label>
                <textarea
                  rows={4}
                  value={legalRulesEnText}
                  onChange={(e) => setLegalRulesEnText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-[#8E8E93] font-bold mb-1">
                  Rules & Terms (Bengali — 1 rule per line)
                </label>
                <textarea
                  rows={4}
                  value={legalRulesBnText}
                  onChange={(e) => setLegalRulesBnText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white text-xs font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                id="admin_save_legal_btn"
                onClick={handleSaveLegal}
                disabled={isSavingLegal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingLegal ? 'Saving...' : 'Save Legal Rules'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SUB-TAB E: SECTION VISIBILITY & ORDER */}
      {/* ======================================================== */}
      {activeSubTab === 'layout' && (
        <div className="space-y-3">
          <div className="p-3 bg-[#141416] rounded-2xl border border-[#232326] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white">Profile Menu Sections & Order</h4>
              <p className="text-[11px] text-[#8E8E93]">
                Enable, disable, or reorder any section on the User Profile page
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {(profileConfig.sections || []).map((sec, idx) => (
              <div
                key={sec.key}
                className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{sec.titleEn}</h5>
                    <p className="text-[10px] text-[#8E8E93]">{sec.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveSection(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveSection(idx, 'down')}
                    disabled={idx === (profileConfig.sections || []).length - 1}
                    title="Move Down"
                    className="w-7 h-7 rounded-lg bg-[#1F1F22] hover:bg-[#2A2A2E] disabled:opacity-30 text-[#8E8E93] hover:text-white flex items-center justify-center text-xs"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      adminToggleProfileSectionVisibility(sec.key, !sec.isVisible)
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                      sec.isVisible
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {sec.isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{sec.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SOCIAL LINK EDIT / CREATE MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingSocial && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#161618] border border-[#2E2E32] rounded-3xl p-5 shadow-2xl space-y-4 text-[#EDEDED]"
            >
              <div className="flex items-center justify-between border-b border-[#232326] pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span>{editingSocial.isNew ? 'Add Social Link' : 'Edit Social Link'}</span>
                </h3>
                <button
                  onClick={() => setEditingSocial(null)}
                  className="w-7 h-7 rounded-lg bg-[#1F1F22] text-[#8E8E93] hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSocialForm} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">
                    Platform / Network
                  </label>
                  <select
                    value={editingSocial.data.platform || 'Telegram'}
                    onChange={(e) =>
                      setEditingSocial({
                        ...editingSocial,
                        data: { ...editingSocial.data, platform: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  >
                    <option value="Telegram">Telegram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Discord">Discord</option>
                    <option value="Website">Official Website</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={editingSocial.data.titleEn || ''}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
                          data: { ...editingSocial.data, titleEn: e.target.value },
                        })
                      }
                      placeholder="Telegram Channel"
                      className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">Title (BN)</label>
                    <input
                      type="text"
                      value={editingSocial.data.titleBn || ''}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
                          data: { ...editingSocial.data, titleBn: e.target.value },
                        })
                      }
                      placeholder="টেলিগ্রাম চ্যানেল"
                      className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">Target URL</label>
                  <input
                    type="url"
                    required
                    value={editingSocial.data.url || ''}
                    onChange={(e) =>
                      setEditingSocial({
                        ...editingSocial,
                        data: { ...editingSocial.data, url: e.target.value },
                      })
                    }
                    placeholder="https://t.me/QuickEarnSupport"
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">Badge (EN)</label>
                    <input
                      type="text"
                      value={editingSocial.data.badgeEn || ''}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
                          data: { ...editingSocial.data, badgeEn: e.target.value },
                        })
                      }
                      placeholder="Official"
                      className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">Badge (BN)</label>
                    <input
                      type="text"
                      value={editingSocial.data.badgeBn || ''}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
                          data: { ...editingSocial.data, badgeBn: e.target.value },
                        })
                      }
                      placeholder="অফিসিয়াল"
                      className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-[11px] text-[#8E8E93] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingSocial.data.isActive ?? true}
                      onChange={(e) =>
                        setEditingSocial({
                          ...editingSocial,
                          data: { ...editingSocial.data, isActive: e.target.checked },
                        })
                      }
                      className="rounded"
                    />
                    <span>Active & Visible in Profile</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500"
                  >
                    Save Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* FAQ EDIT / CREATE MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {editingFaq && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#161618] border border-[#2E2E32] rounded-3xl p-5 shadow-2xl space-y-4 text-[#EDEDED]"
            >
              <div className="flex items-center justify-between border-b border-[#232326] pb-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{editingFaq.isNew ? 'Add Help FAQ' : 'Edit Help FAQ'}</span>
                </h3>
                <button
                  onClick={() => setEditingFaq(null)}
                  className="w-7 h-7 rounded-lg bg-[#1F1F22] text-[#8E8E93] hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveFaqForm} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">
                    Question (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFaq.data.qEn || ''}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        data: { ...editingFaq.data, qEn: e.target.value },
                      })
                    }
                    placeholder="How to withdraw earnings?"
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">
                    Question (Bengali)
                  </label>
                  <input
                    type="text"
                    value={editingFaq.data.qBn || ''}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        data: { ...editingFaq.data, qBn: e.target.value },
                      })
                    }
                    placeholder="কীভাবে টাকা উত্তোলন করব?"
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">
                    Answer (English)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingFaq.data.aEn || ''}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        data: { ...editingFaq.data, aEn: e.target.value },
                      })
                    }
                    placeholder="Detailed explanation in English..."
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] mb-1">
                    Answer (Bengali)
                  </label>
                  <textarea
                    rows={3}
                    value={editingFaq.data.aBn || ''}
                    onChange={(e) =>
                      setEditingFaq({
                        ...editingFaq,
                        data: { ...editingFaq.data, aBn: e.target.value },
                      })
                    }
                    placeholder="বাংলায় বিস্তারিত উত্তর..."
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-[11px] text-[#8E8E93] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingFaq.data.isActive ?? true}
                      onChange={(e) =>
                        setEditingFaq({
                          ...editingFaq,
                          data: { ...editingFaq.data, isActive: e.target.checked },
                        })
                      }
                      className="rounded"
                    />
                    <span>Active & Published</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
                  >
                    Save FAQ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
