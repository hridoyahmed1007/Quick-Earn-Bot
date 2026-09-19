export type MainRoute = 'home' | 'ads' | 'referral' | 'wallet' | 'profile';

export type SubRoute =
  | 'withdraw'
  | 'tasks'
  | 'bonus'
  | 'transactions'
  | 'my-referrals'
  | 'achievements'
  | 'notifications'
  | 'settings'
  | 'help'
  | 'terms'
  | 'privacy'
  | 'security'
  | 'leaderboard'
  | 'admin';

export type AppRoute = MainRoute | SubRoute;

export type LanguageMode = 'mixed' | 'en' | 'bn';

export type ThemePreset = 'emerald' | 'telegram' | 'luxury' | 'light';

export type ProfileTier = 'Default' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface UserProfile {
  telegramId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  vipTier: ProfileTier;
  coins: number;
  bdtBalance: number;
  todayEarnedBdt: number;
  totalCashoutBdt: number;
  referralCode: string;
  referredBy?: string;
  totalReferrals: number;
  activeReferrals: number;
  referralEarningsBdt: number;
  streakDays: number;
  lastCheckinDate: string | null;
  joinedDate: string;
  isVerified: boolean;
  unreadNotificationsCount: number;
  completedAds?: number;
  completedMicroJobs?: number;
  completedChannelTasks?: number;
}

export type ProviderStatus = 'available' | 'unavailable' | 'maintenance' | 'checking';

export interface AdProvider {
  id: string;
  name: string;
  providerKey: 'gigapop' | 'monetag' | 'adsgram' | 'relaxgram' | 'unity' | 'adsterra' | 'telegram' | string;
  type: 'rewarded_video' | 'sponsor_ad' | 'click_banner' | 'interstitial';
  icon: string;
  rewardCoins: number;
  rewardBdt: number;
  durationSec: number;
  dailyLimit: number;
  completedToday: number;
  status: ProviderStatus;
  isAvailable: boolean;
  cooldownSec: number;
  lastWatchedTimestamp?: number | null;
  descriptionEn: string;
  descriptionBn: string;
  adUnitId?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export type AdWatchState =
  | 'idle'
  | 'checking_eligibility'
  | 'preparing'
  | 'loading'
  | 'ready'
  | 'watching'
  | 'verifying'
  | 'rewarding'
  | 'completed'
  | 'pending'
  | 'failed';

export interface AdSession {
  sessionId: string;
  userId: string;
  providerId: string;
  providerName: string;
  rewardBdt: number;
  rewardCoins: number;
  startedAt: number;
  status: AdWatchState;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  txnCode?: string;
}

export type EarningTabType = 'ads' | 'micro_jobs' | 'channel_tasks';

export type JobCategory = 'all' | 'facebook' | 'social' | 'website' | 'digital' | 'other';
export type JobDifficulty = 'easy' | 'medium' | 'advanced';
export type JobTimeEstimate = 'quick' | 'medium' | 'long';
export type JobStatusFilter = 'all' | 'available' | 'new' | 'featured' | 'pending' | 'completed';

export interface MicroJob {
  id: string;
  titleEn: string;
  titleBn: string;
  category: JobCategory;
  platform: string;
  taskType?: string;
  rewardBdt: number;
  rewardCoins: number;
  estimatedTime: string;
  difficulty: JobDifficulty;
  slotsLeft: number;
  totalSlots: number;
  icon: string;
  actionUrl: string;
  descriptionEn: string;
  descriptionBn: string;
  requirements: string[];
  instructionsEn: string[];
  instructionsBn: string[];
  proofRequirement: 'screenshot' | 'url' | 'username' | 'text' | 'confirmation';
  verificationType: 'automatic' | 'manual';
  status: 'available' | 'new' | 'featured' | 'pending' | 'approved' | 'rejected' | 'completed';
  submittedProof?: string;
  submittedAt?: string;
  reversalReason?: string;
  dailyLimit?: number;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export type ChannelTaskCategory = 'all' | 'channel_join' | 'group_join' | 'content_view' | 'reaction' | 'follow';
export type ChannelTaskStatus = 'available' | 'almost_full' | 'full' | 'expired' | 'paused' | 'completed' | 'pending';

export interface ChannelTask {
  id: string;
  titleEn: string;
  titleBn: string;
  category: ChannelTaskCategory;
  channelName: string;
  channelHandle: string;
  channelAvatar?: string;
  taskType?: string;
  rewardBdt: number;
  rewardCoins?: number;
  estimatedTime: string;
  slotsLeft: number;
  totalSlots: number;
  status: ChannelTaskStatus;
  descriptionEn?: string;
  descriptionBn?: string;
  instructionsEn: string[];
  instructionsBn: string[];
  verificationType: 'bot_api' | 'automatic' | 'manual';
  actionUrl: string;
  joinedAt?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export interface EarningTransaction {
  id: string;
  sourceType: 'ads' | 'micro_jobs' | 'channel_tasks';
  title: string;
  providerOrCategory: string;
  amountBdt: number;
  coins?: number;
  status: 'completed' | 'pending' | 'failed' | 'rejected';
  timestamp: string;
  txnCode: string;
}

export type ReferralQualificationTrigger = 'first_task' | 'first_ad' | 'registration';

export interface ReferralConfig {
  isActive: boolean;
  commissionAmountBdt: number;
  commissionType: 'fixed';
  qualificationRule: ReferralQualificationTrigger;
  dailyLimitPerUser: number;
  monthlyLimitPerUser: number;
  updatedAt: string;
  updatedBy: string;
}

export type ReferralStatus = 'pending' | 'qualified' | 'rejected' | 'fraud';

export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  referrerUsername: string;
  referredUserId: string;
  referredUsername: string;
  referralCode: string;
  status: ReferralStatus;
  commissionAmountBdt: number;
  commissionStatus: 'credited' | 'pending';
  qualificationRuleAtTime: string;
  createdAt: string;
  qualifiedAt?: string;
  creditedAt?: string;
  reason?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  qualifiedReferrals: number;
  pendingReferrals: number;
  totalReferralEarnings: number;
  todayReferrals: number;
  todayReferralEarnings: number;
}

export type ReferralLifecycleStatus = 'invited' | 'joined' | 'activated' | 'qualified';

export interface ReferralUser {
  id: string;
  username: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  lifecycleStatus: ReferralLifecycleStatus;
  commissionEarnedBdt: number;
  level: 1 | 2 | 3;
  qualifiedAt?: string;
  avatar?: string;
}

export interface ReferralMilestone {
  id: string;
  level: number;
  threshold: number;
  rewardBdt: number;
  status: 'locked' | 'in_progress' | 'unlocked' | 'claimed';
  titleEn: string;
  titleBn: string;
}

export interface ReferralBadge {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  unlocked: boolean;
  threshold: number;
  unlockedAt?: string;
}

export interface ReferralFunnelData {
  invited: number;
  joined: number;
  activated: number;
  qualified: number;
}

export interface ReferralCampaign {
  id: string;
  titleEn: string;
  titleBn: string;
  bonusPercent: number;
  bonusBdt: number;
  endsAt: string;
  isActive: boolean;
}

export type CommissionLedgerStatus = 'approved' | 'pending' | 'reversed';

export interface CommissionRecord {
  id: string;
  txnCode: string;
  referralUsername: string;
  type: string;
  amountBdt: number;
  status: CommissionLedgerStatus;
  timestamp: string;
  reversalReason?: string;
}

export interface ReferralActivityItem {
  id: string;
  username: string;
  type: 'joined' | 'activated' | 'commission_approved' | 'milestone_unlocked';
  amountBdt?: number;
  timestamp: string;
}

export type LeaderboardCategory = 'earnings' | 'referral' | 'ads' | 'jobs' | 'channels';

export type LeaderboardPeriod = 'today' | 'weekly' | 'monthly' | 'allTime';

export interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendChange?: number;
  displayName?: string;
  username: string;
  isAnonymous?: boolean;
  avatar: string;
  amountBdt: number;
  referralCount?: number;
  adsWatched?: number;
  jobsCompleted?: number;
  channelsJoined?: number;
  badge?: string;
  isCurrentUser?: boolean;
  earnedToday?: number;
  country?: string;
}

export interface HistoricalWinner {
  id: string;
  periodTitleEn: string;
  periodTitleBn: string;
  dateRange: string;
  firstPlace: { username: string; avatar: string; score: string; reward: string };
  secondPlace: { username: string; avatar: string; score: string; reward: string };
  thirdPlace: { username: string; avatar: string; score: string; reward: string };
}

export interface LeaderboardRewardRule {
  rankRange: string;
  rewardBdt: number;
  titleEn: string;
  titleBn: string;
}

export interface TransactionItem {
  id: string;
  type: 'ad' | 'task' | 'referral' | 'bonus' | 'withdraw' | 'convert';
  title: string;
  amountBdt: number;
  coins?: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Recharge' | 'USDT';
  accountNumber?: string;
  timestamp: string;
  txnCode?: string;
  providerKey?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'reward' | 'system' | 'cashout' | 'referral';
}

export type AchievementCategory = 'referral' | 'earnings' | 'ads' | 'withdrawal';

export interface AchievementItem {
  id: string;
  category: AchievementCategory;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  requirementEn: string;
  requirementBn: string;
  unit: string;
  icon: string;
  rewardBdt: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  claimed: boolean;
  unlockedAt?: string;
}

export interface ProfileLevelThreshold {
  tier: ProfileTier;
  labelEn: string;
  labelBn: string;
  minPoints: number;
  minAchievements?: number;
  badge: string;
  accentColor: string;
  ringClass: string;
  crownText: string;
  descriptionEn: string;
  descriptionBn: string;
  bonusPercent: number;
  perkEn?: string;
  perkBn?: string;
}

export interface DailyBonusDay {
  dayNumber: number;
  rewardCoins: number;
  rewardBdt: number;
  isClaimed: boolean;
  isCurrentDay: boolean;
  isSpecial: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket';
  accountNumber: string;
  maskedAccount: string;
  isDefault: boolean;
}

export type WithdrawalStatus = 'pending' | 'verified' | 'processing' | 'completed' | 'failed' | 'rejected' | 'cancelled';

export interface WithdrawalRecord {
  id: string;
  userId: string;
  method: string;
  accountNumber: string;
  maskedAccount: string;
  amountBdt: number;
  feeBdt: number;
  netAmountBdt: number;
  status: WithdrawalStatus;
  requestedAt: string;
  verificationStatus?: 'unverified' | 'passed' | 'flagged';
  verifiedBy?: string;
  verifiedAt?: string;
  processedBy?: string;
  processedAt?: string;
  completedAt?: string;
  paymentReference?: string;
  failureReason?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  accountType: 'personal' | 'agent' | 'merchant';
  status: 'active' | 'inactive';
  displayOrder: number;
  requiredAccountField: string;
  accountPlaceholder?: string;
  minAmountBdt: number;
  maxAmountBdt: number;
  feeType: 'none' | 'fixed' | 'percentage';
  feeValue: number;
  isArchived?: boolean;
  updatedAt?: string;
}

export interface WithdrawalSettings {
  minWithdrawBdt: number;
  maxWithdrawBdt: number;
  dailyWithdrawLimitBdt: number;
  dailyWithdrawLimitCount: number;
  feeType: 'none' | 'fixed' | 'percentage';
  feeValue: number;
  isWithdrawalEnabled: boolean;
  maintenanceNotice?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface WithdrawalRequirementsConfig {
  minQualifiedReferrals: number;
  minVerifiedAds: number;
  minCompletedMicroJobs: number;
  minAccountAgeHours: number;
  requireAccountVerification: boolean;
  requireAchievementUnlock: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface WalletOverviewStats {
  totalWalletBalance: number;
  totalEarnings: number;
  totalWithdrawn: number;
  pendingWithdrawalsCount: number;
  pendingWithdrawalsAmount: number;
  verifiedWithdrawalsCount: number;
  verifiedWithdrawalsAmount: number;
  processingWithdrawalsCount: number;
  processingWithdrawalsAmount: number;
  completedWithdrawalsCount: number;
  completedWithdrawalsAmount: number;
  rejectedWithdrawalsCount: number;
  rejectedWithdrawalsAmount: number;
  todayRequestsCount: number;
  todayRequestsAmount: number;
  todayCompletedPayoutsCount: number;
  todayCompletedPayoutsAmount: number;
}

export interface AdminWithdrawalDetailItem extends WithdrawalRecord {
  username: string;
  fullName: string;
  telegramId: string;
  avatarUrl?: string;
  userAvailableBalance: number;
  userTotalEarnings: number;
  userTotalReferrals: number;
  userQualifiedReferrals: number;
  userCompletedAds: number;
  userCompletedJobs: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  attachmentName?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  lastActive: string;
  location: string;
  isCurrent: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'alert';
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  category: 'ads' | 'micro_jobs' | 'channel_tasks' | 'referral' | 'wallet' | 'profile' | 'general';
  targetId: string;
  targetTitle: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

// Profile Menu Management Interfaces
export interface ProfileSupportChannel {
  enabled: boolean;
  title: string;
  link: string;
  usernameOrPhone: string;
  subtitleEn: string;
  subtitleBn: string;
  badge?: string;
}

export interface ProfileSupportSettings {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  is24x7Active: boolean;
  telegram: ProfileSupportChannel;
  whatsapp: ProfileSupportChannel;
  facebook: ProfileSupportChannel;
  updatedAt: string;
  updatedBy: string;
}

export type ProfileSocialPlatform = 'Telegram' | 'WhatsApp' | 'Facebook' | 'YouTube' | 'Instagram' | 'Twitter' | 'TikTok' | 'Website';

export interface ProfileSocialLink {
  id: string;
  platform: ProfileSocialPlatform;
  displayName: string;
  handle: string;
  url: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileAppInfo {
  appName: string;
  version: string;
  aboutEn: string;
  aboutBn: string;
  copyrightText: string;
  updatedAt: string;
}

export interface ProfileLegalSettings {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  rulesEn: string[];
  rulesBn: string[];
  updatedAt: string;
}

export interface ProfileFaqItem {
  id: string;
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

export type ProfileSectionKey =
  | 'hero_card'
  | 'level_progress'
  | 'achievements'
  | 'language_settings'
  | 'contact_support'
  | 'social_links'
  | 'support_center'
  | 'terms_privacy';

export interface ProfileSectionItem {
  key: ProfileSectionKey;
  titleEn: string;
  titleBn: string;
  isVisible: boolean;
  displayOrder: number;
  description: string;
}

export interface DailyBonusConfig {
  day1RewardBdt: number;
  day2RewardBdt: number;
  day3RewardBdt: number;
  day4RewardBdt: number;
  day5RewardBdt: number;
  day6RewardBdt: number;
  day7RewardBdt: number;
  dailyLoginBonusAmount: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface WithdrawalSettingsConfig {
  minWithdrawBdt: number;
  maxWithdrawBdt: number;
  dailyWithdrawLimitBdt: number;
  dailyWithdrawLimitCount: number;
  feeType: 'none' | 'fixed' | 'percentage';
  feeValue: number;
  isWithdrawalEnabled: boolean;
  maintenanceNotice: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ProfileConfig {
  support: ProfileSupportSettings;
  socialLinks: ProfileSocialLink[];
  appInfo: ProfileAppInfo;
  legal: ProfileLegalSettings;
  faqs: ProfileFaqItem[];
  sections: ProfileSectionItem[];
}

