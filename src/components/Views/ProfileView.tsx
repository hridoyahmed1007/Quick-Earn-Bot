import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Shield,
  Smartphone,
  Globe,
  Palette,
  Award,
  Headphones,
  FileText,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Monitor,
  Send,
  Plus,
  Sparkles,
  ExternalLink,
  Flame,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageMode, ThemePreset } from '../../types';
import { ProfileHeroCard } from '../Profile/ProfileHeroCard';
import { ProfileLevelProgressCard } from '../Profile/ProfileLevelProgressCard';
import { AchievementDetailModal } from '../Profile/AchievementDetailModal';
import { LevelUpCelebrationModal } from '../Profile/LevelUpCelebrationModal';

export const ProfileView: React.FC = () => {
  const {
    user,
    language,
    setLanguage,
    theme,
    setTheme,
    activeSessions,
    securityAlerts,
    supportTickets,
    createSupportTicket,
    showToast,
    profileConfig,
  } = useApp();

  const isBn = language === 'bn' || language === 'mixed';

  // Section visibility helper from dynamic config
  const isSectionVisible = (key: string) => {
    if (!profileConfig?.sections) return true;
    const found = profileConfig.sections.find((s) => s.key === key);
    return found ? found.isVisible : true;
  };

  const support = profileConfig?.support;
  const legal = profileConfig?.legal;

  // Modal states
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [supportCategory, setSupportCategory] = useState<string>('Withdrawal Issue');
  const [supportSubject, setSupportSubject] = useState<string>('');
  const [supportMsg, setSupportMsg] = useState<string>('');
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showSessionsModal, setShowSessionsModal] = useState<boolean>(false);

  // Submit support ticket
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMsg.trim()) {
      showToast('Error', 'Please fill subject and message.', 'warning');
      return;
    }
    createSupportTicket(supportCategory, supportSubject, supportMsg);
    setSupportSubject('');
    setSupportMsg('');
    setShowSupportModal(false);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Premium Profile Hero with Dynamic Level Crown / Ring */}
      {isSectionVisible('hero_card') && <ProfileHeroCard />}

      {/* Profile Level Progression Card */}
      {isSectionVisible('level_progress') && <ProfileLevelProgressCard />}

      {/* Language Settings */}
      {isSectionVisible('language_settings') && (
        <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] shadow-md space-y-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00E5FF]" />
            <span>{isBn ? 'ভাষা নির্বাচন (Language Settings)' : 'Language Settings'}</span>
          </h3>

          {/* Language Selection */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'mixed', label: 'বাংলা + English' },
              { id: 'bn', label: 'বাংলা' },
              { id: 'en', label: 'English' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setLanguage(m.id as LanguageMode)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  language === m.id
                    ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-md font-black'
                    : 'bg-[#111113] text-[#8E8E93] hover:text-white border border-[#232326]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support System (Telegram, Facebook, WhatsApp) */}
      {isSectionVisible('contact_support') && (
        <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#00E5FF]" />
              <span>{isBn ? (support?.titleBn || 'যোগাযোগ ও সাপোর্ট (Contact Support)') : (support?.titleEn || 'Contact Support System')}</span>
            </h3>
            {support?.is24x7Active !== false && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                24/7 Active
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#8E8E93]">
            {isBn
              ? (support?.descBn || 'যেকোনো সমস্যা বা উইথড্র সহায়তার জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন:')
              : (support?.descEn || 'For instant assistance, cashout help, or queries, connect directly with our support team:')}
          </p>

          <div className="space-y-2">
            {/* Telegram Support Channel */}
            {support?.telegram?.enabled !== false && (
              <a
                href={support?.telegram?.link || 'https://t.me/QuickEarnSupportBot'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#111113] hover:bg-[#18191E] border border-[#232326] hover:border-[#0088cc]/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0088cc]/15 border border-[#0088cc]/30 flex items-center justify-center text-[#0088cc] group-hover:scale-105 transition-transform">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{support?.telegram?.title || 'Telegram Support'}</span>
                      {support?.telegram?.badge && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-[#0088cc]/20 text-[#0088cc]">{support.telegram.badge}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8E8E93]">
                      {isBn ? (support?.telegram?.subtitleBn || '@QuickEarnSupportBot • ২৪/৭ ইনস্ট্যান্ট রেসপন্স') : (support?.telegram?.subtitleEn || '@QuickEarnSupportBot • 24/7 Instant Response')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8E8E93] group-hover:text-[#0088cc] transition-colors" />
              </a>
            )}

            {/* WhatsApp Support */}
            {support?.whatsapp?.enabled !== false && (
              <a
                href={support?.whatsapp?.link || 'https://wa.me/8801800000000?text=Hello%20QuickEarn%20Support,%20I%20need%20assistance'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#111113] hover:bg-[#18191E] border border-[#232326] hover:border-[#25D366]/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{support?.whatsapp?.title || 'WhatsApp Helpline'}</span>
                    <span className="text-[10px] text-[#8E8E93] block">
                      {isBn ? (support?.whatsapp?.subtitleBn || '+880 1800-QUICK • সরাসরি চ্যাট করুন') : (support?.whatsapp?.subtitleEn || '+880 1800-QUICK • Direct Chat with Support')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8E8E93] group-hover:text-[#25D366] transition-colors" />
              </a>
            )}

            {/* Facebook Official Page */}
            {support?.facebook?.enabled !== false && (
              <a
                href={support?.facebook?.link || 'https://facebook.com/quickearnbd'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#111113] hover:bg-[#18191E] border border-[#232326] hover:border-[#1877F2]/50 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{support?.facebook?.title || 'Facebook Community'}</span>
                    <span className="text-[10px] text-[#8E8E93] block">
                      {isBn ? (support?.facebook?.subtitleBn || 'fb.com/quickearnbd • অফিশিয়াল পেজ ও আপডেট') : (support?.facebook?.subtitleEn || 'fb.com/quickearnbd • Official Page & Updates')}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8E8E93] group-hover:text-[#1877F2] transition-colors" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Support Center & Help Desk */}
      {isSectionVisible('support_center') && (
        <div className="p-4 rounded-2xl bg-[#161618] border border-[#232326] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#00E5FF]" />
              <span>{isBn ? 'সাপোর্ট ও হেল্প সেন্টার (Support Center)' : 'Support & Help Desk'}</span>
            </h3>
            <button
              onClick={() => setShowSupportModal(true)}
              className="px-3 py-1 rounded-xl bg-[#00E5FF] text-[#0A0A0B] font-extrabold text-[10px] hover:bg-[#70F3FF]"
            >
              + {isBn ? 'নতুন টিকেট' : 'New Ticket'}
            </button>
          </div>

          {supportTickets.length === 0 ? (
            <p className="text-xs text-[#8E8E93] text-center py-2">
              {isBn ? 'কোনো সাপোর্ট টিকেট তৈরি করা নেই।' : 'No active support tickets.'}
            </p>
          ) : (
            <div className="space-y-2">
              {supportTickets.map((tkt) => (
                <div key={tkt.id} className="p-2.5 rounded-xl bg-[#111113] border border-[#232326] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">#{tkt.id} - {tkt.subject}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        tkt.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#8E8E93]">{tkt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Terms & Conditions Button */}
      {isSectionVisible('terms_privacy') && (
        <button
          onClick={() => setShowTermsModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#161618] border border-[#232326] hover:border-[#2A2A2E] text-xs font-bold text-[#8E8E93] hover:text-white flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00E5FF]" />
            <span>{isBn ? (legal?.titleBn || 'টার্মস ও প্রাইভেসী পলিসি (Terms & Policies)') : (legal?.titleEn || 'Terms of Service & Privacy Policy')}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
        </button>
      )}

      {/* ACHIEVEMENT DETAIL MODAL */}
      <AchievementDetailModal />

      {/* LEVEL UP CELEBRATION MODAL */}
      <LevelUpCelebrationModal />

      {/* SUPPORT TICKET MODAL */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#161618] border border-[#232326] rounded-[24px] p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{isBn ? 'সাপোর্ট টিকেট জমা দিন' : 'Create Support Ticket'}</h3>
                <button onClick={() => setShowSupportModal(false)} className="p-1 text-[#8E8E93]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-1">Category</label>
                  <select
                    value={supportCategory}
                    onChange={(e) => setSupportCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-xs text-white"
                  >
                    <option value="Withdrawal Issue">Withdrawal Issue</option>
                    <option value="Task Proof Issue">Task Proof Issue</option>
                    <option value="Referral Commission">Referral Commission</option>
                    <option value="Account Security">Account Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="Short description of issue"
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8E8E93] uppercase mb-1">Message Detail</label>
                  <textarea
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                    rows={3}
                    placeholder="Explain your issue in detail..."
                    className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-[#232326] text-xs text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#0A0A0B] font-bold text-xs"
                >
                  SUBMIT TICKET
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TERMS MODAL */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#161618] border border-[#232326] rounded-[24px] p-5 space-y-3 shadow-2xl text-xs text-[#8E8E93]"
            >
              <div className="flex items-center justify-between text-white border-b border-[#232326] pb-2">
                <h3 className="font-bold">{isBn ? (legal?.titleBn || 'শর্তাবলী ও নীতি') : (legal?.titleEn || 'Terms & Security Rules')}</h3>
                <button onClick={() => setShowTermsModal(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(isBn ? (legal?.rulesBn || legal?.rulesEn || []) : (legal?.rulesEn || [])).map((rule, idx) => (
                  <p key={idx}>{rule}</p>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


