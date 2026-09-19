import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  AppRoute,
  MainRoute,
  SubRoute,
  LanguageMode,
  ThemePreset,
  UserProfile,
  ProfileTier,
  ProfileLevelThreshold,
  AdProvider,
  MicroJob,
  ChannelTask,
  EarningTransaction,
  EarningTabType,
  ReferralUser,
  TransactionItem,
  NotificationItem,
  AchievementItem,
  DailyBonusDay,
  SavedPaymentMethod,
  WithdrawalRecord,
  ActiveSession,
  SecurityAlert,
  SupportTicket,
  AdminAuditLog,
  ReferralConfig,
  ReferralStats,
  ReferralRecord,
  ProfileConfig,
  ProfileSupportSettings,
  ProfileSocialLink,
  ProfileAppInfo,
  ProfileLegalSettings,
  ProfileFaqItem,
  ProfileSectionItem,
  DailyBonusConfig,
  WithdrawalSettingsConfig,
  WithdrawalRequirementsConfig,
} from '../types';
import {
  PROFILE_LEVEL_THRESHOLDS,
  MOCK_AD_PROVIDERS,
  MOCK_MICRO_JOBS,
  MOCK_CHANNEL_TASKS,
  MOCK_EARNING_TRANSACTIONS,
  MOCK_REFERRALS,
  MOCK_TRANSACTIONS,
  MOCK_NOTIFICATIONS,
  MOCK_ACHIEVEMENTS,
  MOCK_DAILY_BONUS,
  MOCK_SAVED_PAYMENT_METHODS,
  MOCK_WITHDRAWAL_RECORDS,
  MOCK_ACTIVE_SESSIONS,
  MOCK_SECURITY_ALERTS,
  MOCK_SUPPORT_TICKETS,
} from '../data/mockData';
import { triggerHaptic } from '../utils/haptics';
import {
  TierBonusInfo,
  CalculatedTierReward,
  getTierBonusInfo,
  calculateTierReward,
} from '../utils/tierBonus';

interface AppContextType {
  currentRoute: AppRoute;
  mainRoute: MainRoute;
  subRoute: SubRoute | null;
  language: LanguageMode;
  theme: ThemePreset;
  user: UserProfile;
  adProviders: AdProvider[];
  microJobs: MicroJob[];
  channelTasks: ChannelTask[];
  earningTransactions: EarningTransaction[];
  referrals: ReferralUser[];
  transactions: TransactionItem[];
  notifications: NotificationItem[];
  achievements: AchievementItem[];
  profileLevel: ProfileLevelThreshold;
  nextProfileLevel: ProfileLevelThreshold | null;
  levelProgressPercent: number;
  profileExp: number;
  remainingExpForNext: number;
  totalTasksCompleted: number;
  totalAdsWatched: number;
  totalReferrals: number;
  remainingAchievementsForNext: number;
  completedAchievementsCount: number;
  profileLevelThresholds: ProfileLevelThreshold[];
  tierBonusInfo: TierBonusInfo;
  getTierAdjustedReward: (baseBdt: number, baseCoins?: number) => CalculatedTierReward;
  activeAchievementDetail: AchievementItem | null;
  setActiveAchievementDetail: (ach: AchievementItem | null) => void;
  levelUpCelebration: { fromTier: ProfileTier; toTier: ProfileTier; config: ProfileLevelThreshold } | null;
  clearLevelUpCelebration: () => void;
  dailyBonus: DailyBonusDay[];
  savedPaymentMethods: SavedPaymentMethod[];
  withdrawalRecords: WithdrawalRecord[];
  activeSessions: ActiveSession[];
  securityAlerts: SecurityAlert[];
  supportTickets: SupportTicket[];
  activeEarningTab: EarningTabType;
  setActiveEarningTab: (tab: EarningTabType) => void;
  openEarningTab: (tab: EarningTabType) => void;
  isNavVisible: boolean;
  activeAdModal: AdProvider | null;
  toast: { title: string; body: string; type?: 'success' | 'info' | 'warning' } | null;

  // Legacy compatibility
  tasks: any[];
  activeTaskProofModal: any;
  openTaskModal: (task: any) => void;
  closeTaskModal: () => void;
  submitTaskProof: (taskId: string, proofTextOrUrl: string) => void;

  // Actions
  navigateTo: (route: AppRoute) => void;
  goBack: () => void;
  setLanguage: (lang: LanguageMode) => void;
  setTheme: (theme: ThemePreset) => void;
  openAdPlayer: (provider: AdProvider) => void;
  closeAdPlayer: () => void;
  completeAdReward: (providerId: string) => void;
  submitMicroJobProof: (jobId: string, proofTextOrUrl: string) => void;
  verifyChannelTask: (taskId: string) => void;
  claimDailyBonus: (dayNum: number) => void;
  requestWithdrawal: (method: string, accountNum: string, amountBdt: number) => { success: boolean; message: string };
  claimAchievement: (achievementId: string) => void;
  markNotificationsRead: () => void;
  copyReferralLink: () => void;
  savePaymentMethod: (method: 'bKash' | 'Nagad' | 'Rocket', accountNumber: string) => void;
  deletePaymentMethod: (id: string) => void;
  createSupportTicket: (category: string, subject: string, message: string, attachmentName?: string) => void;
  cancelWithdrawal: (id: string) => void;
  adminAdjustUserBalance: (amountBdt: number, reason: string) => void;
  adminProcessWithdrawal: (id: string, status: 'completed' | 'rejected', refOrReason?: string) => void;
  showToast: (title: string, body: string, type?: 'success' | 'info' | 'warning') => void;
  triggerHaptic: (style?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error') => void;

  // Admin Ads & Task Management
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  activeAdminTab: 'ads' | 'micro_jobs' | 'channel_tasks' | 'daily_bonus' | 'referral' | 'wallet' | 'profile' | 'audit_logs';
  setActiveAdminTab: (tab: 'ads' | 'micro_jobs' | 'channel_tasks' | 'daily_bonus' | 'referral' | 'wallet' | 'profile' | 'audit_logs') => void;
  auditLogs: AdminAuditLog[];
  fetchAuditLogs: () => Promise<void>;
  refreshCatalog: () => Promise<void>;
  adminAddAd: (ad: Partial<AdProvider>) => Promise<boolean>;
  adminUpdateAd: (id: string, ad: Partial<AdProvider>) => Promise<boolean>;
  adminToggleAdStatus: (id: string, status?: string, archived?: boolean) => Promise<boolean>;
  adminDeleteAd: (id: string) => Promise<boolean>;
  adminReorderAds: (orderedIds: string[]) => Promise<boolean>;
  adminAddMicroJob: (job: Partial<MicroJob>) => Promise<boolean>;
  adminUpdateMicroJob: (id: string, job: Partial<MicroJob>) => Promise<boolean>;
  adminToggleMicroJobStatus: (id: string, status?: string, archived?: boolean) => Promise<boolean>;
  adminDeleteMicroJob: (id: string) => Promise<boolean>;
  adminReorderMicroJobs: (orderedIds: string[]) => Promise<boolean>;
  adminAddChannelTask: (task: Partial<ChannelTask>) => Promise<boolean>;
  adminUpdateChannelTask: (id: string, task: Partial<ChannelTask>) => Promise<boolean>;
  adminToggleChannelTaskStatus: (id: string, status?: string, archived?: boolean) => Promise<boolean>;
  adminDeleteChannelTask: (id: string) => Promise<boolean>;
  adminReorderChannelTasks: (orderedIds: string[]) => Promise<boolean>;

  // Daily Bonus Admin & Global Config
  dailyBonusConfig: DailyBonusConfig;
  fetchDailyBonusConfig: () => Promise<void>;
  adminUpdateDailyBonusConfig: (config: Partial<DailyBonusConfig>) => Promise<boolean>;

  // Wallet & Withdrawal Admin & Global Config
  withdrawalSettings: WithdrawalSettingsConfig;
  withdrawalRequirements: WithdrawalRequirementsConfig;
  fetchWalletConfig: () => Promise<void>;
  adminUpdateWithdrawalSettings: (settings: Partial<WithdrawalSettingsConfig>) => Promise<boolean>;
  adminUpdateWithdrawalRequirements: (reqs: Partial<WithdrawalRequirementsConfig>) => Promise<boolean>;

  // Referral Management Admin
  referralConfig: ReferralConfig;
  referralStats: ReferralStats;
  adminReferralsList: ReferralRecord[];
  fetchReferralData: () => Promise<void>;
  adminUpdateReferralConfig: (config: Partial<ReferralConfig>) => Promise<boolean>;
  adminUpdateReferralStatus: (referralId: string, status: 'qualified' | 'rejected' | 'fraud', reason?: string) => Promise<boolean>;

  // Profile Menu Management Admin
  profileConfig: ProfileConfig;
  fetchProfileConfig: () => Promise<void>;
  adminUpdateProfileSupport: (support: Partial<ProfileSupportSettings>) => Promise<boolean>;
  adminAddSocialLink: (link: Partial<ProfileSocialLink>) => Promise<boolean>;
  adminUpdateSocialLink: (id: string, link: Partial<ProfileSocialLink>) => Promise<boolean>;
  adminToggleSocialLink: (id: string) => Promise<boolean>;
  adminDeleteSocialLink: (id: string) => Promise<boolean>;
  adminReorderSocialLinks: (orderedIds: string[]) => Promise<boolean>;
  adminUpdateProfileLegal: (legalData: any) => Promise<boolean>;
  adminSaveProfileFaq: (faq: Partial<ProfileFaqItem>) => Promise<boolean>;
  adminDeleteProfileFaq: (id: string) => Promise<boolean>;
  adminUpdateProfileSections: (sections: ProfileSectionItem[]) => Promise<boolean>;
  adminResetProfileDefaults: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to extract Telegram WebApp user or default session
const getTelegramUser = () => {
  if (typeof window !== 'undefined') {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
      } catch (e) {
        // ignore
      }
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        return {
          userId: String(tgUser.id),
          username: tgUser.username || `tg_${tgUser.id}`,
          fullName: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') || 'Telegram Earner',
          avatarUrl: tgUser.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
        };
      }
    }
  }
  return {
    userId: 'usr_live_001',
    username: 'bd_earner_007',
    fullName: 'Arif Hossain',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authInfo = useMemo(() => getTelegramUser(), []);
  const storageKey = `quickearn_prod_data_${authInfo.userId}`;

  // Initial State Loader from LocalStorage or Defaults
  const getInitialBundle = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const initialBundle = getInitialBundle();

  // Helper to check if URL points to /admin
  const checkIsAdminPath = (): boolean => {
    if (typeof window === 'undefined') return false;
    const pathname = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    return (
      pathname === '/admin' ||
      pathname.endsWith('/admin') ||
      pathname.startsWith('/admin/') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      search.includes('admin=true') ||
      search.includes('admin=1')
    );
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (checkIsAdminPath()) {
      return 'admin';
    }
    return 'home';
  });
  const [language, setLanguageState] = useState<LanguageMode>('mixed');
  const [theme, setThemeState] = useState<ThemePreset>('emerald');

  const [user, setUser] = useState<UserProfile>(
    initialBundle?.user || {
      telegramId: authInfo.userId,
      username: authInfo.username,
      fullName: authInfo.fullName,
      avatarUrl: authInfo.avatarUrl,
      vipTier: 'Gold',
      coins: 4850,
      bdtBalance: 125.5,
      todayEarnedBdt: 28.0,
      totalCashoutBdt: 450.0,
      referralCode: `BD${authInfo.userId.replace(/\D/g, '').slice(-4) || '9876'}`,
      totalReferrals: 18,
      activeReferrals: 14,
      referralEarningsBdt: 185.0,
      streakDays: 5,
      lastCheckinDate: null,
      joinedDate: '12 Jan 2026',
      isVerified: true,
      unreadNotificationsCount: 2,
      completedAds: 68,
      completedMicroJobs: 12,
      completedChannelTasks: 6,
    }
  );

  const [adProviders, setAdProviders] = useState<AdProvider[]>(initialBundle?.adProviders || MOCK_AD_PROVIDERS);
  const [microJobs, setMicroJobs] = useState<MicroJob[]>(initialBundle?.microJobs || MOCK_MICRO_JOBS);
  const [channelTasks, setChannelTasks] = useState<ChannelTask[]>(initialBundle?.channelTasks || MOCK_CHANNEL_TASKS);
  const [earningTransactions, setEarningTransactions] = useState<EarningTransaction[]>(
    initialBundle?.earningTransactions || MOCK_EARNING_TRANSACTIONS
  );
  const [referrals] = useState<ReferralUser[]>(initialBundle?.referrals || MOCK_REFERRALS);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialBundle?.transactions || MOCK_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialBundle?.notifications || MOCK_NOTIFICATIONS);
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialBundle?.achievements || MOCK_ACHIEVEMENTS);
  const [dailyBonus, setDailyBonus] = useState<DailyBonusDay[]>(initialBundle?.dailyBonus || MOCK_DAILY_BONUS);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>(
    initialBundle?.savedPaymentMethods || MOCK_SAVED_PAYMENT_METHODS
  );
  const [withdrawalRecords, setWithdrawalRecords] = useState<WithdrawalRecord[]>(
    initialBundle?.withdrawalRecords || MOCK_WITHDRAWAL_RECORDS
  );
  const [activeSessions] = useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);
  const [securityAlerts] = useState<SecurityAlert[]>(MOCK_SECURITY_ALERTS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(
    initialBundle?.supportTickets || MOCK_SUPPORT_TICKETS
  );

  const [activeEarningTab, setActiveEarningTab] = useState<EarningTabType>('ads');
  const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
  const [activeAdModal, setActiveAdModal] = useState<AdProvider | null>(null);
  const [toast, setToast] = useState<{ title: string; body: string; type?: 'success' | 'info' | 'warning' } | null>(null);
  const [activeAchievementDetail, setActiveAchievementDetail] = useState<AchievementItem | null>(null);
  const [levelUpCelebration, setLevelUpCelebration] = useState<{
    fromTier: ProfileTier;
    toTier: ProfileTier;
    config: ProfileLevelThreshold;
  } | null>(null);

  // Admin Management State
  const [isAdminModalOpen, setIsAdminModalOpenState] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'ads' | 'micro_jobs' | 'channel_tasks' | 'daily_bonus' | 'referral' | 'wallet' | 'profile' | 'audit_logs'>('ads');
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Daily Bonus Global Config State
  const [dailyBonusConfig, setDailyBonusConfig] = useState<DailyBonusConfig>({
    day1RewardBdt: 2.0,
    day2RewardBdt: 4.0,
    day3RewardBdt: 6.0,
    day4RewardBdt: 8.0,
    day5RewardBdt: 10.0,
    day6RewardBdt: 15.0,
    day7RewardBdt: 25.0,
    dailyLoginBonusAmount: 2.0,
    updatedAt: '2026-08-15 10:00:00',
    updatedBy: 'ADMIN_SUPER_01',
  });

  // Wallet & Withdrawal Global Settings State
  const [withdrawalSettings, setWithdrawalSettings] = useState<WithdrawalSettingsConfig>({
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

  const [withdrawalRequirements, setWithdrawalRequirements] = useState<WithdrawalRequirementsConfig>({
    minQualifiedReferrals: 15,
    minVerifiedAds: 5,
    minCompletedMicroJobs: 0,
    minAccountAgeHours: 0,
    requireAccountVerification: false,
    requireAchievementUnlock: false,
    updatedAt: '2026-08-15 10:00:00',
    updatedBy: 'ADMIN_SUPER_01',
  });

  // Admin Referral State
  const [referralConfig, setReferralConfig] = useState<ReferralConfig>({
    isActive: true,
    commissionAmountBdt: 20.0,
    commissionType: 'fixed',
    qualificationRule: 'first_task',
    dailyLimitPerUser: 0,
    monthlyLimitPerUser: 0,
    updatedAt: '2026-08-15 08:00:00',
    updatedBy: 'ADMIN_SUPER_01',
  });

  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalReferrals: 9,
    qualifiedReferrals: 5,
    pendingReferrals: 3,
    totalReferralEarnings: 100.0,
    todayReferrals: 2,
    todayReferralEarnings: 40.0,
  });

  const [adminReferralsList, setAdminReferralsList] = useState<ReferralRecord[]>([]);

  // Admin Profile Menu State
  const [profileConfig, setProfileConfig] = useState<ProfileConfig>({
    support: {
      titleEn: 'Contact Support System',
      titleBn: 'যোগাযোগ ও সাপোর্ট (Contact Support)',
      descEn: 'For instant assistance, cashout help, or queries, connect directly with our support team:',
      descBn: 'যেকোনো সমস্যা বা উইথড্র সহায়তার জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন:',
      is24x7Active: true,
      telegram: {
        enabled: true,
        title: 'Telegram Support',
        link: 'https://t.me/QuickEarnSupportBot',
        usernameOrPhone: '@QuickEarnSupportBot',
        subtitleEn: '@QuickEarnSupportBot • 24/7 Instant Response',
        subtitleBn: '@QuickEarnSupportBot • ২৪/৭ ইনস্ট্যান্ট রেসপন্স',
        badge: 'FASTEST',
      },
      whatsapp: {
        enabled: true,
        title: 'WhatsApp Helpline',
        link: 'https://wa.me/8801800000000?text=Hello%20QuickEarn%20Support,%20I%20need%20assistance',
        usernameOrPhone: '+880 1800-QUICK',
        subtitleEn: '+880 1800-QUICK • Direct Chat with Support',
        subtitleBn: '+880 1800-QUICK • সরাসরি চ্যাট করুন',
      },
      facebook: {
        enabled: true,
        title: 'Facebook Community',
        link: 'https://facebook.com/quickearnbd',
        usernameOrPhone: 'fb.com/quickearnbd',
        subtitleEn: 'fb.com/quickearnbd • Official Page & Updates',
        subtitleBn: 'fb.com/quickearnbd • অফিশিয়াল পেজ ও আপডেট',
      },
      updatedAt: '2026-08-15 10:00:00',
      updatedBy: 'SYSTEM',
    },
    socialLinks: [
      {
        id: 'soc_tg_1',
        platform: 'Telegram',
        displayName: 'Official Telegram Channel',
        handle: '@QuickEarnSupport',
        url: 'https://t.me/QuickEarnSupport',
        icon: 'Send',
        isActive: true,
        displayOrder: 1,
        createdAt: '2026-08-10 10:00:00',
        updatedAt: '2026-08-15 10:00:00',
      },
      {
        id: 'soc_fb_2',
        platform: 'Facebook',
        displayName: 'Facebook Official Community',
        handle: 'fb.com/quickearnbd',
        url: 'https://facebook.com/quickearnbd',
        icon: 'Facebook',
        isActive: true,
        displayOrder: 2,
        createdAt: '2026-08-10 10:00:00',
        updatedAt: '2026-08-15 10:00:00',
      },
      {
        id: 'soc_yt_3',
        platform: 'YouTube',
        displayName: 'Official YouTube Channel',
        handle: '@QuickEarnTutorials',
        url: 'https://youtube.com',
        icon: 'YouTube',
        isActive: true,
        displayOrder: 3,
        createdAt: '2026-08-10 10:00:00',
        updatedAt: '2026-08-15 10:00:00',
      },
    ],
    appInfo: {
      appName: 'Quick Earn',
      version: 'v2.5.0',
      aboutEn: 'Quick Earn is the premier rewarded tasks and micro-earning platform in Bangladesh. Earn real BDT directly to bKash and Nagad.',
      aboutBn: 'কুইক আর্ন বাংলাদেশের শীর্ষস্থানীয় বিশ্বস্ত অনলাইন আর্নিং প্ল্যাটফর্ম। ভিডিও ও টাস্ক কমপ্লিট করে সরাসরি বিকাশ ও নগদে টাকা উত্তোলন করুন।',
      copyrightText: '© 2026 Quick Earn BD Ltd. All rights reserved.',
      updatedAt: '2026-08-15 10:00:00',
    },
    legal: {
      titleEn: 'Terms of Service & Privacy Policy',
      titleBn: 'ব্যবহারের শর্তাবলী ও গোপনীয়তা',
      subtitleEn: 'Official legal policy & platform terms',
      subtitleBn: 'অফিসিয়াল নীতি ও প্ল্যাটফর্ম নির্দেশিকা',
      rulesEn: [
        '1. Fair Earning Policy: Multiple automated bots, VPNs, or fake scripts are strictly prohibited. Any violation will result in permanent account ban.',
        '2. Payment Guarantee: Valid cashout requests to bKash and Nagad are processed securely within the official SLA window (1 to 24 hours).',
        '3. Data Security: User Telegram IDs and wallet numbers are encrypted and never shared with third parties.',
        '4. False Proofs: False proofs or cheating on micro jobs will trigger anti-fraud locks and balance deductions.',
      ],
      rulesBn: [
        '১. সঠিক নীতি: প্রতি ব্যবহারকারীর জন্য মাত্র ১টি অ্যাকাউন্ট অনুমোদিত। একাধিক ভুয়া অ্যাকাউন্ট খুললে তাৎক্ষণিক ব্যান করা হবে।',
        '২. পেমেন্ট গ্যারান্টি: ক্যাশআউট রিকোয়েস্ট ১ থেকে ২৪ ঘণ্টার মধ্যে যাচাইপূর্বক বিকাশ, নগদ বা রকেটে পরিশোধ করা হয়।',
        '৩. ডেটা নিরাপত্তা: ব্যবহারকারীর টেলিগ্রাম আইডি এবং মোবাইল নম্বর এনক্রিপ্টেড এবং সম্পূর্ণ সুরক্ষিত থাকে।',
        '৪. ভুয়া প্রুফ নিষেধ: ভুয়া টাস্ক প্রুফ বা অসদুপায় অবলম্বন করলে অ্যান্টি-ফ্রড লক সক্রিয় হবে।',
      ],
      updatedAt: '2026-08-15 10:00:00',
    },
    faqs: [
      {
        id: 'faq_1',
        qEn: 'How to watch ads and earn money?',
        qBn: 'বিজ্ঞাপন দেখে কীভাবে টাকা আয় করব?',
        aEn: 'Go to the Ads tab, tap on any available provider card (e.g. Monetag or Unity), watch the 15-second sponsored ad, and click Collect Reward. Money will be added instantly to your balance.',
        aBn: 'বিজ্ঞাপন (Ads) ট্যাবে যান, যেকোনো প্রোভাইডার অপশনে ক্লিক করে ১৫ সেকেন্ডের ভিডিও দেখুন এবং পয়েন্ট ও টাকা বুঝে নিন।',
        displayOrder: 1,
        isActive: true,
        updatedAt: '2026-08-15 10:00:00',
      },
      {
        id: 'faq_2',
        qEn: 'What is the minimum cashout limit?',
        qBn: 'সর্বনিম্ন কত টাকা উত্তোলন করা যায়?',
        aEn: 'Minimum withdrawal limit is ৳50.00 BDT for bKash, Nagad, Rocket, Upay, or Mobile Recharge.',
        aBn: 'সর্বনিম্ন ৳৫০.০০ টাকা হলে বিকাশ, নগদ, রকেট, উপায় বা রিচার্জ নেওয়া সম্ভব।',
        displayOrder: 2,
        isActive: true,
        updatedAt: '2026-08-15 10:00:00',
      },
      {
        id: 'faq_3',
        qEn: 'How long does bKash/Nagad cashout take?',
        qBn: 'ক্যাশআউট রিকোয়েস্ট কতক্ষণে প্রসেস হয়?',
        aEn: 'Usually cashout payments are sent automatically within 5 minutes to 1 hour after administrative verification.',
        aBn: 'সাধারণত ৫ মিনিট থেকে ১ ঘণ্টার মধ্যে টাকা একাউন্টে চলে আসে।',
        displayOrder: 3,
        isActive: true,
        updatedAt: '2026-08-15 10:00:00',
      },
    ],
    sections: [
      {
        key: 'hero_card',
        titleEn: 'Profile Header & Stats',
        titleBn: 'প্রোফাইল হেডার ও স্ট্যাটাস',
        isVisible: true,
        displayOrder: 1,
        description: 'Avatar, Tier Crown, Total Earned, Cashout, Streak & Referrals',
      },
      {
        key: 'level_progress',
        titleEn: 'Profile Level & Tier Ring',
        titleBn: 'লেভেল প্রগ্রেস ও টায়ার রিং',
        isVisible: true,
        displayOrder: 2,
        description: 'Bronze/Silver/Gold/Platinum/Diamond progress gauge',
      },
      {
        key: 'achievements',
        titleEn: 'Verified Achievements',
        titleBn: 'মাইলস্টোন ও অ্যাচিভমেন্ট',
        isVisible: true,
        displayOrder: 3,
        description: 'Interactive Milestone claiming cards',
      },
      {
        key: 'language_settings',
        titleEn: 'Language Switcher',
        titleBn: 'ভাষা নির্বাচন',
        isVisible: true,
        displayOrder: 4,
        description: 'Bangla, English, Mixed language switcher',
      },
      {
        key: 'contact_support',
        titleEn: 'Contact Support & Channels',
        titleBn: 'যোগাযোগ ও সাপোর্ট',
        isVisible: true,
        displayOrder: 5,
        description: 'Telegram Bot, WhatsApp Helpline & Facebook Community',
      },
      {
        key: 'support_center',
        titleEn: 'Support Tickets & Help Desk',
        titleBn: 'সাপোর্ট টিকেট ডেস্ক',
        isVisible: true,
        displayOrder: 6,
        description: 'Open Support Tickets & status tracker',
      },
      {
        key: 'terms_privacy',
        titleEn: 'Terms & Policies Link',
        titleBn: 'টার্মস ও প্রাইভেসী পলিসি',
        isVisible: true,
        displayOrder: 7,
        description: 'Terms of Service, Rules & Privacy modal',
      },
    ],
  });

  const prevTierRef = useRef<ProfileTier>(user.vipTier);

  // Sync to local storage for instant durability
  useEffect(() => {
    try {
      const bundle = {
        user,
        adProviders,
        microJobs,
        channelTasks,
        earningTransactions,
        transactions,
        notifications,
        achievements,
        dailyBonus,
        savedPaymentMethods,
        withdrawalRecords,
        supportTickets,
      };
      localStorage.setItem(storageKey, JSON.stringify(bundle));
    } catch (e) {
      // storage quota or error
    }
  }, [
    user,
    adProviders,
    microJobs,
    channelTasks,
    earningTransactions,
    transactions,
    notifications,
    achievements,
    dailyBonus,
    savedPaymentMethods,
    withdrawalRecords,
    supportTickets,
    storageKey,
  ]);

  // Server sync on mount
  useEffect(() => {
    const fetchServerState = async () => {
      try {
        const res = await fetch('/api/user/me', {
          headers: {
            'x-user-id': authInfo.userId,
            'x-user-username': authInfo.username,
            'x-user-fullname': authInfo.fullName,
            'x-user-avatar': authInfo.avatarUrl,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser((prev) => ({ ...prev, ...data.user }));
            if (data.dailyBonus) setDailyBonus(data.dailyBonus);
            if (data.achievements) setAchievements(data.achievements);
            if (data.adProviders && data.adProviders.length > 0) setAdProviders(data.adProviders);
            if (data.microJobs && data.microJobs.length > 0) setMicroJobs(data.microJobs);
            if (data.channelTasks && data.channelTasks.length > 0) setChannelTasks(data.channelTasks);
            if (data.transactions && data.transactions.length > 0) setTransactions(data.transactions);
            if (data.withdrawalRecords && data.withdrawalRecords.length > 0) setWithdrawalRecords(data.withdrawalRecords);
          }
        }
        // Fetch profile dynamic config
        const profRes = await fetch('/api/profile-config');
        if (profRes.ok) {
          const profData = await profRes.json();
          if (profData.profileConfig) {
            setProfileConfig(profData.profileConfig);
          }
        }
        await fetchDailyBonusConfig();
        await fetchWalletConfig();
        await fetchReferralData();
      } catch (err) {
        // server endpoint available or offline fallback
      }
    };
    fetchServerState();
  }, [authInfo]);

  // Real dynamic calculation of completed activities: tasks, ads, and referrals
  const totalTasksCompleted = useMemo(() => {
    return (user.completedMicroJobs || 0) + (user.completedChannelTasks || 0);
  }, [user.completedMicroJobs, user.completedChannelTasks]);

  const totalAdsWatched = useMemo(() => {
    const fromProviders = adProviders.reduce((acc, p) => acc + (p.completedToday || 0), 0);
    return Math.max(user.completedAds || 0, fromProviders);
  }, [user.completedAds, adProviders]);

  const totalReferrals = useMemo(() => {
    return user.totalReferrals || 0;
  }, [user.totalReferrals]);

  // Activity EXP Points: 1 Task = 15 XP, 1 Ad = 3 XP, 1 Referral = 25 XP
  const profileExp = useMemo(() => {
    return (totalTasksCompleted * 15) + (totalAdsWatched * 3) + (totalReferrals * 25);
  }, [totalTasksCompleted, totalAdsWatched, totalReferrals]);

  // Determine current profile level from thresholds based on profileExp
  const profileLevel = useMemo(() => {
    let matched = PROFILE_LEVEL_THRESHOLDS[0];
    for (const t of PROFILE_LEVEL_THRESHOLDS) {
      if (profileExp >= t.minPoints) {
        matched = t;
      }
    }
    return matched;
  }, [profileExp]);

  // Determine next profile level
  const nextProfileLevel = useMemo(() => {
    const currentIndex = PROFILE_LEVEL_THRESHOLDS.findIndex((t) => t.tier === profileLevel.tier);
    if (currentIndex >= 0 && currentIndex < PROFILE_LEVEL_THRESHOLDS.length - 1) {
      return PROFILE_LEVEL_THRESHOLDS[currentIndex + 1];
    }
    return null;
  }, [profileLevel]);

  // Calculate progress percent towards next level
  const { levelProgressPercent, remainingExpForNext } = useMemo(() => {
    if (!nextProfileLevel) {
      return { levelProgressPercent: 100, remainingExpForNext: 0 };
    }
    const currentMin = profileLevel.minPoints;
    const nextMin = nextProfileLevel.minPoints;
    const span = Math.max(1, nextMin - currentMin);
    const currentProgressInTier = Math.max(0, profileExp - currentMin);
    const percent = Math.min(100, Math.round((currentProgressInTier / span) * 100));
    const remaining = Math.max(0, nextMin - profileExp);
    return { levelProgressPercent: percent, remainingExpForNext: remaining };
  }, [profileLevel, nextProfileLevel, profileExp]);

  const completedAchievementsCount = useMemo(() => {
    return achievements.filter((a) => a.unlocked || a.claimed).length;
  }, [achievements]);

  const remainingAchievementsForNext = remainingExpForNext;

  // Real tier bonus info and live reward calculator
  const tierBonusInfo = useMemo(() => {
    return getTierBonusInfo(profileLevel.tier);
  }, [profileLevel.tier]);

  const getTierAdjustedReward = (baseBdt: number, baseCoins: number = 0): CalculatedTierReward => {
    return calculateTierReward(baseBdt, baseCoins, profileLevel.tier);
  };

  // Sync user's vipTier with calculated profileLevel and trigger level-up celebration
  useEffect(() => {
    if (user.vipTier !== profileLevel.tier) {
      const oldTier = user.vipTier;
      setUser((prev) => ({ ...prev, vipTier: profileLevel.tier }));

      if (prevTierRef.current && prevTierRef.current !== profileLevel.tier) {
        setLevelUpCelebration({
          fromTier: oldTier,
          toTier: profileLevel.tier,
          config: profileLevel,
        });
        showToast(
          '👑 Profile Upgraded!',
          `Congratulations! You reached ${profileLevel.labelEn} (${profileLevel.crownText}).`,
          'success'
        );
      }
      prevTierRef.current = profileLevel.tier;
    }
  }, [profileLevel, user.vipTier]);

  // Auto-evaluate achievement progress and automatic unlocking from real verified stats
  useEffect(() => {
    const verifiedReferrals = user.totalReferrals;
    const verifiedEarnings = Number((user.bdtBalance + user.totalCashoutBdt).toFixed(2));
    const verifiedAds = (user.completedAds || 0) + adProviders.reduce((acc, p) => acc + p.completedToday, 0);
    const verifiedWithdrawals = withdrawalRecords.filter((w) => w.status === 'completed').length;

    let hasUpdates = false;
    let earnedBonusTotal = 0;
    const newlyUnlockedAchievements: AchievementItem[] = [];

    const updatedAchievements = achievements.map((ach) => {
      let currentVal = ach.progress;
      if (ach.category === 'referral') currentVal = verifiedReferrals;
      else if (ach.category === 'earnings') currentVal = verifiedEarnings;
      else if (ach.category === 'ads') currentVal = verifiedAds;
      else if (ach.category === 'withdrawal') currentVal = verifiedWithdrawals;

      const isCompleted = currentVal >= ach.maxProgress;

      if (isCompleted && !ach.unlocked && !ach.claimed) {
        hasUpdates = true;
        earnedBonusTotal += ach.rewardBdt;
        const unlockedAch: AchievementItem = {
          ...ach,
          progress: currentVal,
          unlocked: true,
          claimed: true,
          unlockedAt: 'Just now',
        };
        newlyUnlockedAchievements.push(unlockedAch);
        return unlockedAch;
      }

      if (ach.progress !== currentVal) {
        hasUpdates = true;
        return {
          ...ach,
          progress: currentVal,
          unlocked: isCompleted || ach.unlocked,
        };
      }

      return ach;
    });

    if (hasUpdates) {
      setAchievements(updatedAchievements);

      if (earnedBonusTotal > 0 && newlyUnlockedAchievements.length > 0) {
        setUser((prev) => ({
          ...prev,
          bdtBalance: Number((prev.bdtBalance + earnedBonusTotal).toFixed(2)),
        }));

        for (const unl of newlyUnlockedAchievements) {
          const newTx: TransactionItem = {
            id: `tx_ach_${unl.id}_${Date.now()}`,
            type: 'bonus',
            title: `Achievement Reward: ${unl.titleEn}`,
            amountBdt: unl.rewardBdt,
            status: 'completed',
            timestamp: 'Just now',
          };
          setTransactions((prev) => [newTx, ...prev]);

          const newNotif: NotificationItem = {
            id: `notif_ach_${unl.id}_${Date.now()}`,
            title: '🏆 Achievement Unlocked!',
            message: `"${unl.titleEn}" completed (${unl.requirementEn}). +৳${unl.rewardBdt.toFixed(2)} credited to balance!`,
            timestamp: 'Just now',
            read: false,
            type: 'reward',
          };
          setNotifications((prev) => [newNotif, ...prev]);

          showToast(
            '🏆 Achievement Unlocked!',
            `"${unl.titleEn}" (${unl.requirementEn}) completed! +৳${unl.rewardBdt.toFixed(2)} reward credited!`,
            'success'
          );
        }
      }
    }
  }, [user.totalReferrals, user.bdtBalance, user.totalCashoutBdt, user.completedAds, adProviders, withdrawalRecords, achievements]);

  const clearLevelUpCelebration = () => {
    setLevelUpCelebration(null);
  };

  const mainRoutes: MainRoute[] = ['home', 'ads', 'referral', 'wallet', 'profile'];
  const isMainRoute = mainRoutes.includes(currentRoute as MainRoute);
  const mainRoute: MainRoute = isMainRoute
    ? (currentRoute as MainRoute)
    : currentRoute === 'withdraw' || currentRoute === 'transactions'
    ? 'wallet'
    : currentRoute === 'ads' || currentRoute === 'tasks'
    ? 'ads'
    : currentRoute === 'referral' || currentRoute === 'my-referrals'
    ? 'referral'
    : currentRoute === 'home' || currentRoute === 'bonus'
    ? 'home'
    : 'profile';
  const subRoute: SubRoute | null = !isMainRoute ? (currentRoute as SubRoute) : null;

  // Listen for browser navigation (popstate, hashchange, or direct /admin URL)
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdmin = checkIsAdminPath();
      if (isAdmin) {
        setCurrentRoute('admin');
        setIsAdminModalOpenState(true);
      } else {
        if (currentRoute === 'admin') {
          setCurrentRoute('home');
        }
        setIsAdminModalOpenState(false);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Initial sync
    if (checkIsAdminPath()) {
      setCurrentRoute('admin');
      setIsAdminModalOpenState(true);
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Sync URL when admin modal opens or closes
  const setIsAdminModalOpen = (open: boolean) => {
    setIsAdminModalOpenState(open);
    if (typeof window !== 'undefined') {
      if (open) {
        setCurrentRoute('admin');
        if (!checkIsAdminPath()) {
          window.history.pushState(null, '', '/admin');
        }
      } else {
        if (currentRoute === 'admin') {
          setCurrentRoute('home');
        }
        if (checkIsAdminPath()) {
          window.history.replaceState(null, '', '/');
        }
      }
    }
  };

  // Sync theme to root class
  useEffect(() => {
    document.documentElement.classList.remove('theme-emerald', 'theme-telegram', 'theme-luxury', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Toast Auto Clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (title: string, body: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ title, body, type });
  };

  const navigateTo = (route: AppRoute) => {
    triggerHaptic('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);
  };

  const openEarningTab = (tab: EarningTabType) => {
    setActiveEarningTab(tab);
    navigateTo('ads');
  };

  const goBack = () => {
    triggerHaptic('light');
    if (subRoute) {
      setCurrentRoute('profile');
    } else {
      setCurrentRoute('home');
    }
  };

  const setLanguage = (lang: LanguageMode) => {
    triggerHaptic('medium');
    setLanguageState(lang);
    showToast(
      lang === 'bn' ? 'ভাষা পরিবর্তন হয়েছে' : lang === 'en' ? 'Language Updated' : 'Bilingual Mode Active',
      lang === 'bn' ? 'এখন বাংলা দেখাচ্ছে।' : lang === 'en' ? 'App switched to English.' : 'English + বাংলা চালু হয়েছে।'
    );
  };

  const setTheme = (newTheme: ThemePreset) => {
    triggerHaptic('medium');
    setThemeState(newTheme);
    showToast('Theme Changed', `Theme updated to ${newTheme.toUpperCase()}`);
  };

  const openAdPlayer = (provider: AdProvider) => {
    triggerHaptic('medium');
    setIsNavVisible(false);
    setActiveAdModal(provider);
  };

  const closeAdPlayer = () => {
    triggerHaptic('light');
    setActiveAdModal(null);
    setIsNavVisible(true);
  };

  const completeAdReward = (providerId: string) => {
    const provider = adProviders.find((p) => p.id === providerId);
    if (!provider) return;

    triggerHaptic('success');

    // Calculate real progressive tier bonus
    const rewardCalc = getTierAdjustedReward(provider.rewardBdt, provider.rewardCoins);

    // Update User Balance
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + rewardCalc.finalCoins,
      bdtBalance: Number((prev.bdtBalance + rewardCalc.finalBdt).toFixed(2)),
      todayEarnedBdt: Number((prev.todayEarnedBdt + rewardCalc.finalBdt).toFixed(2)),
      completedAds: (prev.completedAds || 0) + 1,
    }));

    // Update Provider completed count
    setAdProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, completedToday: p.completedToday + 1 } : p))
    );

    const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${profileLevel.tier} Boost)` : '';

    // Add transaction
    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: 'ad',
      title: `${provider.name} Reward${bonusTag}`,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add to earning transactions ledger
    const newEarnTx: EarningTransaction = {
      id: `earntxn_${Date.now()}`,
      sourceType: 'ads',
      title: `${provider.name} Watch${bonusTag}`,
      providerOrCategory: provider.name,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
      txnCode: `TXN-AD-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setEarningTransactions((prev) => [newEarnTx, ...prev]);

    // Background server call
    fetch('/api/ads/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ providerId }),
    }).catch(() => {});

    closeAdPlayer();
    const toastMsg = rewardCalc.hasBonus
      ? `+৳${rewardCalc.finalBdt.toFixed(2)} BDT (৳${provider.rewardBdt.toFixed(2)} + ${rewardCalc.bonusPercent}% ${profileLevel.tier} বোনাস) ব্যালেন্সে যুক্ত হয়েছে!`
      : `+৳${provider.rewardBdt.toFixed(2)} BDT added to balance!`;
    showToast('🎉 Reward Credited!', toastMsg);
  };

  const submitMicroJobProof = (jobId: string, proofTextOrUrl: string) => {
    const job = microJobs.find((j) => j.id === jobId);
    if (!job) return;

    if (job.status === 'completed') {
      showToast('টাস্ক সম্পন্ন হয়েছে', 'আপনি এই টাস্কটি ইতিমধ্যে সম্পন্ন করেছেন। এটি শুধুমাত্র একবারই করা যাবে।', 'info');
      return;
    }

    triggerHaptic('success');

    // Calculate real progressive tier bonus
    const rewardCalc = getTierAdjustedReward(job.rewardBdt, job.rewardCoins);

    setMicroJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: 'completed',
              submittedProof: proofTextOrUrl,
              submittedAt: 'Just now',
            }
          : j
      )
    );

    setUser((prev) => ({
      ...prev,
      coins: prev.coins + rewardCalc.finalCoins,
      bdtBalance: Number((prev.bdtBalance + rewardCalc.finalBdt).toFixed(2)),
      todayEarnedBdt: Number((prev.todayEarnedBdt + rewardCalc.finalBdt).toFixed(2)),
      completedMicroJobs: (prev.completedMicroJobs || 0) + 1,
    }));

    const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${profileLevel.tier} Boost)` : '';

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: 'task',
      title: `Job Completed: ${job.titleEn}${bonusTag}`,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newEarnTx: EarningTransaction = {
      id: `earntxn_${Date.now()}`,
      sourceType: 'micro_jobs',
      title: `${job.titleEn}${bonusTag}`,
      providerOrCategory: job.platform,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
      txnCode: `TXN-JOB-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setEarningTransactions((prev) => [newEarnTx, ...prev]);

    fetch('/api/micro-jobs/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ jobId, proofText: proofTextOrUrl }),
    }).catch(() => {});

    const toastMsg = rewardCalc.hasBonus
      ? `+৳${rewardCalc.finalBdt.toFixed(2)} BDT (৳${job.rewardBdt.toFixed(2)} + ${rewardCalc.bonusPercent}% ${profileLevel.tier} বোনাস) যোগ হয়েছে!`
      : `+৳${job.rewardBdt.toFixed(2)} BDT added to balance!`;
    showToast('🎉 Job Approved & Credited!', toastMsg);
  };

  const verifyChannelTask = (taskId: string) => {
    const task = channelTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.status === 'completed' || task.isJoined) {
      showToast('টাস্ক সম্পন্ন হয়েছে', 'আপনি ইতিমধ্যেই এই চ্যানেল টাস্কটি সম্পন্ন করেছেন। এটি শুধুমাত্র একবার করা যাবে।', 'info');
      return;
    }

    triggerHaptic('success');

    // Calculate real progressive tier bonus
    const rewardCalc = getTierAdjustedReward(task.rewardBdt, task.rewardCoins);

    setChannelTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed', joinedAt: 'Just now' } : t))
    );

    setUser((prev) => ({
      ...prev,
      coins: prev.coins + rewardCalc.finalCoins,
      bdtBalance: Number((prev.bdtBalance + rewardCalc.finalBdt).toFixed(2)),
      todayEarnedBdt: Number((prev.todayEarnedBdt + rewardCalc.finalBdt).toFixed(2)),
      completedChannelTasks: (prev.completedChannelTasks || 0) + 1,
    }));

    const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${profileLevel.tier} Boost)` : '';

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: 'task',
      title: `Channel Join: ${task.channelName}${bonusTag}`,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newEarnTx: EarningTransaction = {
      id: `earntxn_${Date.now()}`,
      sourceType: 'channel_tasks',
      title: `${task.titleEn}${bonusTag}`,
      providerOrCategory: task.channelHandle,
      amountBdt: rewardCalc.finalBdt,
      coins: rewardCalc.finalCoins,
      status: 'completed',
      timestamp: 'Just now',
      txnCode: `TXN-CHAN-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setEarningTransactions((prev) => [newEarnTx, ...prev]);

    fetch('/api/channel-tasks/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ taskId }),
    }).catch(() => {});

    const toastMsg = rewardCalc.hasBonus
      ? `+৳${rewardCalc.finalBdt.toFixed(2)} BDT (৳${task.rewardBdt.toFixed(2)} + ${rewardCalc.bonusPercent}% ${profileLevel.tier} বোনাস) ক্রেডিট হয়েছে!`
      : `+৳${task.rewardBdt.toFixed(2)} BDT credited!`;
    showToast('🎉 Channel Verified!', toastMsg);
  };

  const claimDailyBonus = (dayNum: number) => {
    const day = dailyBonus.find((d) => d.dayNumber === dayNum);
    if (!day || day.isClaimed) return;

    triggerHaptic('success');
    setDailyBonus((prev) =>
      prev.map((d) => (d.dayNumber === dayNum ? { ...d, isClaimed: true, isCurrentDay: false } : d))
    );

    setUser((prev) => ({
      ...prev,
      coins: prev.coins + day.rewardCoins,
      bdtBalance: Number((prev.bdtBalance + day.rewardBdt).toFixed(2)),
      todayEarnedBdt: Number((prev.todayEarnedBdt + day.rewardBdt).toFixed(2)),
      streakDays: prev.streakDays + 1,
      lastCheckinDate: new Date().toISOString().split('T')[0],
    }));

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: 'bonus',
      title: `Day ${dayNum} Streak Daily Bonus`,
      amountBdt: day.rewardBdt,
      coins: day.rewardCoins,
      status: 'completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    fetch('/api/bonus/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ dayNumber: dayNum }),
    }).catch(() => {});

    showToast('🎁 Bonus Claimed!', `+৳${day.rewardBdt.toFixed(2)} BDT received!`);
  };

  const requestWithdrawal = (method: string, accountNum: string, amountBdt: number) => {
    const minWithdraw = withdrawalSettings.minWithdrawBdt || 900;
    const minRefs = withdrawalRequirements.minQualifiedReferrals ?? 15;
    const maxWithdraw = withdrawalSettings.maxWithdrawBdt || 25000;

    if (!withdrawalSettings.isWithdrawalEnabled) {
      triggerHaptic('warning');
      return { success: false, message: withdrawalSettings.maintenanceNotice || 'উইথড্র সিস্টেম বর্তমানে সাময়িকভাবে বন্ধ রয়েছে।' };
    }

    if (amountBdt < minWithdraw) {
      triggerHaptic('warning');
      return { success: false, message: `সর্বনিম্ন উত্তোলন ৳${minWithdraw}.০০ টাকা (Minimum withdrawal ৳${minWithdraw}.00 BDT).` };
    }

    if (amountBdt > maxWithdraw) {
      triggerHaptic('warning');
      return { success: false, message: `সর্বোচ্চ উত্তোলন ৳${maxWithdraw}.০০ টাকা (Maximum withdrawal ৳${maxWithdraw}.00 BDT).` };
    }

    if (user.totalReferrals < minRefs) {
      triggerHaptic('warning');
      return {
        success: false,
        message: `উইথড্র করতে সর্বনিম্ন ${minRefs} জন রেফার অবশ্যই থাকতে হবে (Minimum ${minRefs} referrals required). Current: ${user.totalReferrals}/${minRefs}`,
      };
    }
    if (amountBdt > user.bdtBalance) {
      triggerHaptic('error');
      return { success: false, message: 'Insufficient balance available (পর্যাপ্ত ব্যালেন্স নেই)।' };
    }

    triggerHaptic('success');
    setUser((prev) => ({
      ...prev,
      bdtBalance: Number((prev.bdtBalance - amountBdt).toFixed(2)),
      totalCashoutBdt: Number((prev.totalCashoutBdt + amountBdt).toFixed(2)),
    }));

    let feeBdt = 0;
    if (withdrawalSettings.feeType === 'percentage') {
      feeBdt = Number(((amountBdt * withdrawalSettings.feeValue) / 100).toFixed(2));
    } else if (withdrawalSettings.feeType === 'fixed') {
      feeBdt = Number(withdrawalSettings.feeValue.toFixed(2));
    }
    const netAmountBdt = Math.max(0, Number((amountBdt - feeBdt).toFixed(2)));

    const masked = accountNum.length >= 11 ? `${accountNum.slice(0, 3)}******${accountNum.slice(-2)}` : accountNum;

    const newWd: WithdrawalRecord = {
      id: `wd_${Date.now()}`,
      userId: user.telegramId,
      method: method as any,
      accountNumber: accountNum,
      maskedAccount: masked,
      amountBdt: amountBdt,
      feeBdt: feeBdt,
      netAmountBdt: netAmountBdt,
      status: 'pending',
      requestedAt: 'Just now',
    };
    setWithdrawalRecords((prev) => [newWd, ...prev]);

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: 'withdraw',
      title: `${method} Cashout Request`,
      amountBdt: amountBdt,
      paymentMethod: method as any,
      accountNumber: accountNum,
      status: 'pending',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '💸 Cashout Request Submitted',
      message: `Your withdrawal of ৳${amountBdt.toFixed(2)} via ${method} (${masked}) is processing.`,
      timestamp: 'Just now',
      read: false,
      type: 'cashout',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setUser((prev) => ({ ...prev, unreadNotificationsCount: prev.unreadNotificationsCount + 1 }));

    fetch('/api/withdrawals/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ method, accountNumber: accountNum, amountBdt }),
    }).catch(() => {});

    showToast('✅ Cashout Requested', `৳${amountBdt.toFixed(2)} withdrawal sent via ${method}.`);
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  const savePaymentMethod = (method: 'bKash' | 'Nagad' | 'Rocket', accountNumber: string) => {
    triggerHaptic('success');
    const masked = accountNumber.length >= 11 ? `${accountNumber.slice(0, 3)}******${accountNumber.slice(-2)}` : accountNumber;
    const newPm: SavedPaymentMethod = {
      id: `pm_${Date.now()}`,
      method,
      accountNumber,
      maskedAccount: masked,
      isDefault: savedPaymentMethods.length === 0,
    };
    setSavedPaymentMethods((prev) => [newPm, ...prev]);

    fetch('/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ method, accountNumber, isDefault: newPm.isDefault }),
    }).catch(() => {});

    showToast('💳 Account Saved', `${method} account ${masked} saved successfully.`);
  };

  const deletePaymentMethod = (id: string) => {
    triggerHaptic('medium');
    setSavedPaymentMethods((prev) => prev.filter((p) => p.id !== id));

    fetch(`/api/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': authInfo.userId },
    }).catch(() => {});

    showToast('🗑 Account Removed', 'Payment account removed from wallet.');
  };

  const createSupportTicket = (category: string, subject: string, message: string, attachmentName?: string) => {
    triggerHaptic('success');
    const tkt: SupportTicket = {
      id: `tkt_${Date.now()}`,
      userId: user.telegramId,
      category,
      subject,
      message,
      status: 'open',
      createdAt: 'Just now',
      attachmentName,
    };
    setSupportTickets((prev) => [tkt, ...prev]);

    fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ category, subject, message, attachmentName }),
    }).catch(() => {});

    showToast('🎧 Ticket Submitted', `Ticket #${tkt.id} created. Support team will respond soon.`);
  };

  const cancelWithdrawal = (id: string) => {
    triggerHaptic('medium');
    const wd = withdrawalRecords.find((w) => w.id === id && w.status === 'pending');
    if (!wd) return;

    setWithdrawalRecords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'rejected', failureReason: 'Cancelled by user' } : w))
    );
    setUser((prev) => ({
      ...prev,
      bdtBalance: Number((prev.bdtBalance + wd.amountBdt).toFixed(2)),
      totalCashoutBdt: Number((prev.totalCashoutBdt - wd.amountBdt).toFixed(2)),
    }));

    fetch('/api/withdrawals/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ withdrawalId: id }),
    }).catch(() => {});

    showToast('🔄 Withdrawal Cancelled', `৳${wd.amountBdt.toFixed(2)} refunded to available balance.`);
  };

  const adminAdjustUserBalance = (amountBdt: number, reason: string) => {
    triggerHaptic('success');
    setUser((prev) => ({
      ...prev,
      bdtBalance: Number((prev.bdtBalance + amountBdt).toFixed(2)),
    }));
    const newTx: TransactionItem = {
      id: `tx_admin_${Date.now()}`,
      type: 'convert',
      title: `Admin Adjustment (${reason})`,
      amountBdt,
      status: 'completed',
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    fetch('/api/admin/adjust-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ amountBdt, reason }),
    }).catch(() => {});

    showToast('⚙️ Admin Balance Updated', `Balance adjusted by ৳${amountBdt.toFixed(2)} (${reason})`);
  };

  const adminProcessWithdrawal = (id: string, status: 'completed' | 'rejected', refOrReason?: string) => {
    triggerHaptic('success');
    setWithdrawalRecords((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return {
            ...w,
            status,
            processedAt: 'Just now',
            paymentReference: status === 'completed' ? refOrReason : undefined,
            failureReason: status === 'rejected' ? refOrReason : undefined,
          };
        }
        return w;
      })
    );
    if (status === 'rejected') {
      const wd = withdrawalRecords.find((w) => w.id === id);
      if (wd) {
        setUser((prev) => ({
          ...prev,
          bdtBalance: Number((prev.bdtBalance + wd.amountBdt).toFixed(2)),
          totalCashoutBdt: Number((prev.totalCashoutBdt - wd.amountBdt).toFixed(2)),
        }));
      }
    }

    fetch('/api/admin/process-withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ withdrawalId: id, status, paymentReference: refOrReason, adminNote: refOrReason }),
    }).catch(() => {});

    showToast(
      status === 'completed' ? '🟢 Withdrawal Approved' : '🔴 Withdrawal Rejected',
      `Withdrawal status set to ${status}.`
    );
  };

  const claimAchievement = (achievementId: string) => {
    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach || ach.claimed) return;

    triggerHaptic('success');
    setAchievements((prev) => prev.map((a) => (a.id === achievementId ? { ...a, claimed: true } : a)));

    setUser((prev) => ({
      ...prev,
      bdtBalance: Number((prev.bdtBalance + ach.rewardBdt).toFixed(2)),
    }));

    fetch('/api/achievements/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': authInfo.userId },
      body: JSON.stringify({ achievementId }),
    }).catch(() => {});

    showToast('🏆 Achievement Claimed!', `+৳${ach.rewardBdt.toFixed(2)} reward credited!`);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUser((prev) => ({ ...prev, unreadNotificationsCount: 0 }));
  };

  const copyReferralLink = () => {
    triggerHaptic('selection');
    const link = `https://t.me/QuickEarnBot?start=${user.referralCode}`;
    navigator.clipboard?.writeText(link);
    showToast('📋 Link Copied!', 'Referral link copied to clipboard. Share with friends!');
  };

  // --- ADMIN MANAGEMENT ACTIONS (LIVE DATABASE SYNC) ---

  const refreshCatalog = async () => {
    try {
      const res = await fetch('/api/user/me', {
        headers: { 'x-user-id': authInfo.userId },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.adProviders) setAdProviders(data.adProviders);
        if (data.microJobs) setMicroJobs(data.microJobs);
        if (data.channelTasks) setChannelTasks(data.channelTasks);
      }
    } catch (e) {
      console.error('Failed to refresh catalog:', e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.auditLogs) setAuditLogs(data.auditLogs);
      }
    } catch (e) {
      console.error('Failed to fetch audit logs:', e);
    }
  };

  // Admin Ads
  const adminAddAd = async (adData: Partial<AdProvider>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...adData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Ad Added', 'New ad placement created successfully in database.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to add ad.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error while adding ad.');
      return false;
    }
  };

  const adminUpdateAd = async (id: string, adData: Partial<AdProvider>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...adData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Ad Updated', 'Ad placement saved successfully.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update ad.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error while updating ad.');
      return false;
    }
  };

  const adminToggleAdStatus = async (id: string, status?: string, archived?: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/ads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, archived, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Status Updated', 'Ad status updated in database.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminDeleteAd = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/ads/${id}?adminId=${authInfo.userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('🗑️ Ad Removed', 'Ad placement archived/deleted.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminReorderAds = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/ads/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        showToast('↕️ Reordered', 'Ads sequence saved.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Admin Micro Jobs
  const adminAddMicroJob = async (jobData: Partial<MicroJob>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/micro-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Micro Job Created', 'New micro job created in live database.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to create micro job.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error.');
      return false;
    }
  };

  const adminUpdateMicroJob = async (id: string, jobData: Partial<MicroJob>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/micro-jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Micro Job Updated', 'Micro job saved.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update micro job.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error.');
      return false;
    }
  };

  const adminToggleMicroJobStatus = async (id: string, status?: string, archived?: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/micro-jobs/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, archived, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Status Updated', 'Micro job status updated.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminDeleteMicroJob = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/micro-jobs/${id}?adminId=${authInfo.userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('🗑️ Job Removed', 'Micro job archived.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminReorderMicroJobs = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/micro-jobs/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        showToast('↕️ Reordered', 'Micro jobs sequence saved.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Admin Channel Tasks
  const adminAddChannelTask = async (taskData: Partial<ChannelTask>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/channel-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Channel Task Created', 'New channel task saved.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to create channel task.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error.');
      return false;
    }
  };

  const adminUpdateChannelTask = async (id: string, taskData: Partial<ChannelTask>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/channel-tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Channel Task Updated', 'Channel task saved.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update channel task.');
      return false;
    } catch (e) {
      showToast('❌ Error', 'Network error.');
      return false;
    }
  };

  const adminToggleChannelTaskStatus = async (id: string, status?: string, archived?: boolean): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/channel-tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, archived, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('✅ Status Updated', 'Channel task status updated.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminDeleteChannelTask = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/channel-tasks/${id}?adminId=${authInfo.userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshCatalog();
        await fetchAuditLogs();
        showToast('🗑️ Task Removed', 'Channel task archived.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminReorderChannelTasks = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/channel-tasks/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await refreshCatalog();
        showToast('↕️ Reordered', 'Channel tasks sequence saved.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Daily Bonus Admin Methods
  const fetchDailyBonusConfig = async (): Promise<void> => {
    try {
      const res = await fetch('/api/daily-bonus/config');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setDailyBonusConfig(data.config);
          setDailyBonus((prev) =>
            prev.map((day) => {
              const key = `day${day.dayNumber}RewardBdt` as keyof DailyBonusConfig;
              if (typeof data.config[key] === 'number') {
                const bdt = data.config[key] as number;
                return { ...day, rewardBdt: bdt, rewardCoins: Math.round(bdt * 100) };
              }
              return day;
            })
          );
        }
      }
    } catch (e) {
      console.error('Failed to fetch daily bonus config', e);
    }
  };

  const adminUpdateDailyBonusConfig = async (config: Partial<DailyBonusConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setDailyBonusConfig(data.config);
          setDailyBonus((prev) =>
            prev.map((day) => {
              const key = `day${day.dayNumber}RewardBdt` as keyof DailyBonusConfig;
              if (typeof data.config[key] === 'number') {
                const bdt = data.config[key] as number;
                return { ...day, rewardBdt: bdt, rewardCoins: Math.round(bdt * 100) };
              }
              return day;
            })
          );
        }
        await fetchAuditLogs();
        showToast('🎁 Daily Bonus Saved', 'Daily login rewards and streak bonuses updated live.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update daily bonus.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  // Wallet Admin Methods
  const fetchWalletConfig = async (): Promise<void> => {
    try {
      const res = await fetch('/api/admin/wallet/overview');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setWithdrawalSettings(data.settings);
        if (data.requirements) setWithdrawalRequirements(data.requirements);
      }
    } catch (e) {
      console.error('Failed to fetch wallet config', e);
    }
  };

  const adminUpdateWithdrawalSettings = async (settings: Partial<WithdrawalSettingsConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/wallet/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setWithdrawalSettings(data.settings);
        await fetchAuditLogs();
        showToast('💳 Withdrawal Limits Saved', 'Minimum cashout and withdrawal settings updated live.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to save settings.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminUpdateWithdrawalRequirements = async (reqs: Partial<WithdrawalRequirementsConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/wallet/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reqs, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.requirements) setWithdrawalRequirements(data.requirements);
        await fetchAuditLogs();
        showToast('🛡️ Requirements Saved', 'Withdrawal eligibility and referral criteria updated live.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to save requirements.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  // Referral Management Admin Methods
  const fetchReferralData = async (): Promise<void> => {
    try {
      const res = await fetch('/api/admin/referral/data');
      if (res.ok) {
        const data = await res.json();
        if (data.config) setReferralConfig(data.config);
        if (data.stats) setReferralStats(data.stats);
        if (data.referrals) setAdminReferralsList(data.referrals);
      }
    } catch (e) {
      console.error('Failed to fetch referral admin data', e);
    }
  };

  const adminUpdateReferralConfig = async (config: Partial<ReferralConfig>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/referral/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.config) setReferralConfig(data.config);
        if (data.stats) setReferralStats(data.stats);
        await fetchAuditLogs();
        showToast('⚙️ Settings Saved', 'Referral configuration updated in live database.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update referral config.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminUpdateReferralStatus = async (
    referralId: string,
    status: 'qualified' | 'rejected' | 'fraud',
    reason?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/referral/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralId, status, reason, adminId: authInfo.userId }),
      });
      if (res.ok) {
        await fetchReferralData();
        await fetchAuditLogs();
        const userRes = await fetch('/api/user/me', {
          headers: {
            'x-user-id': authInfo.userId,
          },
        });
        if (userRes.ok) {
          const uData = await userRes.json();
          if (uData.user) setUser((prev) => ({ ...prev, ...uData.user }));
        }
        showToast('✅ Status Updated', `Referral status updated to ${status}.`);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Profile Management Admin Methods
  const fetchProfileConfig = async (): Promise<void> => {
    try {
      const res = await fetch('/api/admin/profile-config');
      if (res.ok) {
        const data = await res.json();
        if (data.profileConfig) {
          setProfileConfig(data.profileConfig);
        }
      }
    } catch (e) {
      console.error('Failed to fetch profile config', e);
    }
  };

  const adminUpdateProfileSupport = async (supportData: Partial<ProfileSupportSettings>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...supportData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.support) {
          setProfileConfig((prev) => ({ ...prev, support: data.support }));
        }
        await fetchAuditLogs();
        showToast('📞 Support Settings Saved', 'Contact and helpline channels updated live.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update support settings.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminAddSocialLink = async (linkData: Partial<ProfileSocialLink>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/social/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...linkData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setProfileConfig((prev) => ({ ...prev, socialLinks: data.socialLinks }));
        }
        await fetchAuditLogs();
        showToast('🔗 Social Link Added', 'New social community link active.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to add social link.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminUpdateSocialLink = async (id: string, linkData: Partial<ProfileSocialLink>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/social/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...linkData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setProfileConfig((prev) => ({ ...prev, socialLinks: data.socialLinks }));
        }
        await fetchAuditLogs();
        showToast('✅ Link Updated', 'Social community link updated.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update social link.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminToggleSocialLink = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/social/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setProfileConfig((prev) => ({ ...prev, socialLinks: data.socialLinks }));
        }
        await fetchAuditLogs();
        showToast('🔄 Status Updated', data.message || 'Status updated.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminDeleteSocialLink = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/social/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setProfileConfig((prev) => ({ ...prev, socialLinks: data.socialLinks }));
        }
        await fetchAuditLogs();
        showToast('🗑️ Link Removed', 'Social link removed.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminReorderSocialLinks = async (orderedIds: string[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/social/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.socialLinks) {
          setProfileConfig((prev) => ({ ...prev, socialLinks: data.socialLinks }));
        }
        await fetchAuditLogs();
        showToast('↕️ Reordered', 'Social links sequence saved.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminUpdateProfileLegal = async (legalData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...legalData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.appInfo && data.legal) {
          setProfileConfig((prev) => ({ ...prev, appInfo: data.appInfo, legal: data.legal }));
        }
        await fetchAuditLogs();
        showToast('📜 Legal Policy Saved', 'Terms, privacy, and app information updated.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to update legal policy.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminSaveProfileFaq = async (faqData: Partial<ProfileFaqItem>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/faq/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...faqData, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.faqs) {
          setProfileConfig((prev) => ({ ...prev, faqs: data.faqs }));
        }
        await fetchAuditLogs();
        showToast('💡 FAQ Saved', 'Help FAQ item updated live.');
        return true;
      }
      const err = await res.json();
      showToast('❌ Error', err.error || 'Failed to save FAQ.', 'warning');
      return false;
    } catch (e) {
      showToast('❌ Connection Error', 'Could not reach server.', 'warning');
      return false;
    }
  };

  const adminDeleteProfileFaq = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/faq/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.faqs) {
          setProfileConfig((prev) => ({ ...prev, faqs: data.faqs }));
        }
        await fetchAuditLogs();
        showToast('🗑️ FAQ Removed', 'Help FAQ item deleted.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminUpdateProfileSections = async (sections: ProfileSectionItem[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/sections/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections, adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sections) {
          setProfileConfig((prev) => ({ ...prev, sections: data.sections }));
        }
        await fetchAuditLogs();
        showToast('📑 Profile Layout Saved', 'Section visibility and order updated.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const adminResetProfileDefaults = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/profile/reset-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: authInfo.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profileConfig) {
          setProfileConfig(data.profileConfig);
        }
        await fetchAuditLogs();
        showToast('♻️ Defaults Restored', 'Profile settings restored to factory defaults.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        mainRoute,
        subRoute,
        language,
        theme,
        user,
        adProviders,
        microJobs,
        channelTasks,
        earningTransactions,
        referrals,
        transactions,
        notifications,
        achievements,
        profileLevel,
        nextProfileLevel,
        levelProgressPercent,
        profileExp,
        remainingExpForNext,
        totalTasksCompleted,
        totalAdsWatched,
        totalReferrals,
        remainingAchievementsForNext,
        completedAchievementsCount,
        profileLevelThresholds: PROFILE_LEVEL_THRESHOLDS,
        tierBonusInfo,
        getTierAdjustedReward,
        activeAchievementDetail,
        setActiveAchievementDetail,
        levelUpCelebration,
        clearLevelUpCelebration,
        dailyBonus,
        savedPaymentMethods,
        withdrawalRecords,
        activeSessions,
        securityAlerts,
        supportTickets,
        activeEarningTab,
        setActiveEarningTab,
        openEarningTab,
        isNavVisible,
        activeAdModal,
        toast,
        tasks: microJobs || [],
        activeTaskProofModal: null,
        openTaskModal: () => {},
        closeTaskModal: () => {},
        submitTaskProof: submitMicroJobProof,
        navigateTo,
        goBack,
        setLanguage,
        setTheme,
        openAdPlayer,
        closeAdPlayer,
        completeAdReward,
        submitMicroJobProof,
        verifyChannelTask,
        claimDailyBonus,
        requestWithdrawal,
        claimAchievement,
        markNotificationsRead,
        copyReferralLink,
        savePaymentMethod,
        deletePaymentMethod,
        createSupportTicket,
        cancelWithdrawal,
        adminAdjustUserBalance,
        adminProcessWithdrawal,
        showToast,
        triggerHaptic,

        // Admin
        isAdminModalOpen,
        setIsAdminModalOpen,
        activeAdminTab,
        setActiveAdminTab,
        auditLogs,
        fetchAuditLogs,
        refreshCatalog,
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

        // Daily Bonus Admin
        dailyBonusConfig,
        fetchDailyBonusConfig,
        adminUpdateDailyBonusConfig,

        // Wallet Admin
        withdrawalSettings,
        withdrawalRequirements,
        fetchWalletConfig,
        adminUpdateWithdrawalSettings,
        adminUpdateWithdrawalRequirements,

        // Referral Admin
        referralConfig,
        referralStats,
        adminReferralsList,
        fetchReferralData,
        adminUpdateReferralConfig,
        adminUpdateReferralStatus,

        // Profile Admin
        profileConfig,
        fetchProfileConfig,
        adminUpdateProfileSupport,
        adminAddSocialLink,
        adminUpdateSocialLink,
        adminToggleSocialLink,
        adminDeleteSocialLink,
        adminReorderSocialLinks,
        adminUpdateProfileLegal,
        adminSaveProfileFaq,
        adminDeleteProfileFaq,
        adminUpdateProfileSections,
        adminResetProfileDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
