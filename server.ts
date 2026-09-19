import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getTop100Leaderboard } from './src/data/leaderboardGenerator';

const app = express();
const PORT = 3000;

app.use(express.json());

// Global shared database models for Ads Menu Management (Admin Control)
let globalAds = [
  {
    id: 'gigapop_video',
    name: 'Gigapup Ads',
    providerKey: 'gigapop',
    type: 'rewarded_video',
    icon: 'Zap',
    rewardCoins: 250,
    rewardBdt: 2.5,
    durationSec: 15,
    dailyLimit: 30,
    completedToday: 0,
    status: 'available',
    isAvailable: true,
    cooldownSec: 60,
    adUnitId: 'gp_zone_9921',
    descriptionEn: 'Official Gigapup rewarded video ads network.',
    descriptionBn: 'অফিসিয়াল গিগাপাপ রিওয়ার্ডেড ভিডিও বিজ্ঞাপন।',
    displayOrder: 1,
    createdAt: '2026-08-10 10:00:00',
    updatedAt: '2026-08-15 08:30:00',
    archived: false,
  },
  {
    id: 'monetag_video',
    name: 'Monetag Ads',
    providerKey: 'monetag',
    type: 'rewarded_video',
    icon: 'PlayCircle',
    rewardCoins: 200,
    rewardBdt: 2.0,
    durationSec: 15,
    dailyLimit: 25,
    completedToday: 0,
    status: 'available',
    isAvailable: true,
    cooldownSec: 60,
    adUnitId: 'monetag_zone_4401',
    descriptionEn: 'Official Monetag HD video ad network.',
    descriptionBn: 'অফিসিয়াল মোনেট্যাগ ভিডিও বিজ্ঞাপন।',
    displayOrder: 2,
    createdAt: '2026-08-11 12:00:00',
    updatedAt: '2026-08-15 09:00:00',
    archived: false,
  },
  {
    id: 'adsgram_video',
    name: 'Adsgram Ads',
    providerKey: 'adsgram',
    type: 'rewarded_video',
    icon: 'Sparkles',
    rewardCoins: 200,
    rewardBdt: 2.0,
    durationSec: 15,
    dailyLimit: 20,
    completedToday: 0,
    status: 'available',
    isAvailable: true,
    cooldownSec: 60,
    adUnitId: 'adsgram_block_102',
    descriptionEn: 'Official Adsgram sponsored video ad network.',
    descriptionBn: 'অফিসিয়াল এডসগ্রাম স্পন্সরড ভিডিও বিজ্ঞাপন।',
    displayOrder: 3,
    createdAt: '2026-08-12 14:00:00',
    updatedAt: '2026-08-15 09:15:00',
    archived: false,
  },
  {
    id: 'relaxgram_video',
    name: 'Relaxgram Ads',
    providerKey: 'relaxgram',
    type: 'rewarded_video',
    icon: 'Tv',
    rewardCoins: 300,
    rewardBdt: 3.0,
    durationSec: 20,
    dailyLimit: 15,
    completedToday: 0,
    status: 'available',
    isAvailable: true,
    cooldownSec: 90,
    adUnitId: 'rx_zone_552',
    descriptionEn: 'Official Relaxgram high-yield interactive video.',
    descriptionBn: 'অফিসিয়াল রিল্যাক্সগ্রাম হাই-রিওয়ার্ড ভিডিও বিজ্ঞাপন।',
    displayOrder: 4,
    createdAt: '2026-08-13 16:00:00',
    updatedAt: '2026-08-15 10:00:00',
    archived: false,
  },
];

let globalMicroJobs = [
  {
    id: 'job_fb_1',
    titleEn: 'Like & Follow Official Facebook Page',
    titleBn: 'ফেসবুক পেজে লাইক ও ফলো দিন',
    category: 'facebook',
    platform: 'Facebook',
    taskType: 'Follow',
    rewardBdt: 10.0,
    rewardCoins: 1000,
    estimatedTime: '15 sec',
    difficulty: 'easy',
    slotsLeft: 124,
    totalSlots: 200,
    icon: 'Facebook',
    actionUrl: 'https://facebook.com/quickearn',
    descriptionEn: 'Visit official Facebook page, give a like, follow, and submit your Facebook profile username/URL.',
    descriptionBn: 'ফেসবুক পেজ ভিজিট করুন, লাইক ও ফলো দিয়ে ইউজারনেম বা লিঙ্ক জমা দিন।',
    requirements: ['Must have an active Facebook account', 'Must not unfollow for 30 days'],
    instructionsEn: [
      'Click "START TASK" to open Facebook page link.',
      'Click "Like" and "Follow" buttons on page.',
      'Take a screenshot or note your Facebook Username.',
      'Submit proof below and click "SUBMIT PROOF".',
    ],
    instructionsBn: [
      '"START TASK" এ ক্লিক করে ফেসবুক পেজে যান।',
      'পেজে লাইক এবং ফলো বাটন প্রেস করুন।',
      'আপনার ফেসবুক ইউজারনেম বা স্ক্রিনশট প্রুফ হিসেবে সাবমিট করুন।',
    ],
    proofRequirement: 'username',
    verificationType: 'automatic',
    status: 'available',
    dailyLimit: 1,
    displayOrder: 1,
    createdAt: '2026-08-10 11:00:00',
    updatedAt: '2026-08-15 08:45:00',
    archived: false,
  },
  {
    id: 'job_yt_2',
    titleEn: 'Watch 2 Mins YouTube Video & Comment',
    titleBn: '২ মিনিট ইউটিউব ভিডিও দেখুন ও কমেন্ট করুন',
    category: 'social',
    platform: 'YouTube',
    taskType: 'View',
    rewardBdt: 15.0,
    rewardCoins: 1500,
    estimatedTime: '15 sec',
    difficulty: 'easy',
    slotsLeft: 88,
    totalSlots: 150,
    icon: 'Youtube',
    actionUrl: 'https://youtube.com',
    descriptionEn: 'Watch video for 2 minutes, like video, leave a positive comment, and upload proof screenshot.',
    descriptionBn: 'ভিডিও ২ মিনিট দেখুন, লাইক ও কমেন্ট করে প্রুফ জমা দিন।',
    requirements: ['Watch full 2 minutes without skipping', 'Comment must be relevant to video'],
    instructionsEn: [
      'Open YouTube video link.',
      'Watch at least 2 minutes of the video.',
      'Like and post a genuine comment.',
      'Upload screenshot showing comment.',
    ],
    instructionsBn: [
      'ইউটিউব ভিডিও প্লে করুন এবং ২ মিনিট দেখুন।',
      'লাইক ও নাইস কমেন্ট করুন।',
      'কমেন্টের স্ক্রিনশট প্রুফ হিসেবে আপলোড করুন।',
    ],
    proofRequirement: 'screenshot',
    verificationType: 'automatic',
    status: 'featured',
    dailyLimit: 1,
    displayOrder: 2,
    createdAt: '2026-08-11 15:30:00',
    updatedAt: '2026-08-15 09:00:00',
    archived: false,
  },
  {
    id: 'job_web_3',
    titleEn: 'Visit Tech Blog Website & Click Sponsor Banner',
    titleBn: 'টেক ব্লগ ওয়েবসাইট ভিজিট ও ব্যানার ক্লিক',
    category: 'website',
    platform: 'Website',
    taskType: 'Visit',
    rewardBdt: 12.0,
    rewardCoins: 1200,
    estimatedTime: '15 sec',
    difficulty: 'medium',
    slotsLeft: 42,
    totalSlots: 100,
    icon: 'Globe',
    actionUrl: 'https://example.com/tech-blog',
    descriptionEn: 'Read article for 60 seconds, click 1 advertisement banner, and copy destination URL.',
    descriptionBn: 'ব্লগ পোস্ট ৬০ সেকেন্ড পড়ুন, ১টি বিজ্ঞাপন ক্লিক করে সাইট ইউআরএল কপি করুন।',
    requirements: ['Stay on page for 60s', 'Submit clicked ad URL'],
    instructionsEn: [
      'Open blog article.',
      'Scroll through article for 60 seconds.',
      'Click on any sponsor ad banner.',
      'Copy ad landing URL and submit.',
    ],
    instructionsBn: [
      'ব্লগ পোস্ট ওপেন করে ৬০ সেকেন্ড স্ক্রোল করুন।',
      'একটি স্পন্সর বিজ্ঞাপনে ক্লিক করুন।',
      'বিজ্ঞাপন পেজের ইউআরএল লিঙ্ক প্রুফ বক্সে পেস্ট করুন।',
    ],
    proofRequirement: 'url',
    verificationType: 'automatic',
    status: 'available',
    dailyLimit: 2,
    displayOrder: 3,
    createdAt: '2026-08-12 16:00:00',
    updatedAt: '2026-08-15 09:20:00',
    archived: false,
  },
  {
    id: 'job_tg_4',
    titleEn: 'Join Telegram Community & Introduce Yourself',
    titleBn: 'টেলিগ্রাম কমিউনিটিতে যুক্ত হয়ে মেসেজ দিন',
    category: 'social',
    platform: 'Telegram',
    taskType: 'Join',
    rewardBdt: 8.0,
    rewardCoins: 800,
    estimatedTime: '15 sec',
    difficulty: 'easy',
    slotsLeft: 215,
    totalSlots: 300,
    icon: 'Send',
    actionUrl: 'https://t.me/telegram',
    descriptionEn: 'Join our official Telegram community group and post a friendly greeting message.',
    descriptionBn: 'অফিসিয়াল টেলিগ্রাম গ্রুপে যুক্ত হোন এবং মেসেজ দিন।',
    requirements: ['Must be in group for minimum 14 days'],
    instructionsEn: [
      'Click link to join Telegram group.',
      'Say Hello in the group.',
      'Submit Telegram handle as proof.',
    ],
    instructionsBn: [
      'লিংকে ক্লিক করে টেলিগ্রাম গ্রুপে জয়েন করুন।',
      'গ্রুপে একটি মেসেজ লিখুন।',
      'আপনার টেলিগ্রাম ইউজারনেম প্রুফ দিন।',
    ],
    proofRequirement: 'username',
    verificationType: 'automatic',
    status: 'available',
    dailyLimit: 1,
    displayOrder: 4,
    createdAt: '2026-08-13 18:00:00',
    updatedAt: '2026-08-15 09:30:00',
    archived: false,
  },
];

let globalChannelTasks = [
  {
    id: 'ch_01',
    titleEn: 'Join Official Announcements Channel',
    titleBn: 'অফিসিয়াল চ্যানেল জয়েন করুন',
    category: 'channel_join',
    channelName: 'Quick Earn Official Announcement',
    channelHandle: '@QuickEarnBD_Official',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    taskType: 'Join Channel',
    rewardBdt: 5.0,
    rewardCoins: 500,
    estimatedTime: '15s',
    totalSlots: 1000,
    slotsLeft: 642,
    status: 'available',
    instructionsEn: ['Click Join button', 'Open Telegram', 'Press Join Channel', 'Return and click Verify'],
    instructionsBn: ['জয়েন বাটনে ক্লিক করুন', 'টেলিগ্রাম ওপেন করে চ্যানেলে যুক্ত হোন', 'ভেরিফাই প্রেস করুন'],
    verificationType: 'bot_api',
    actionUrl: 'https://t.me/telegram',
    descriptionEn: 'Join our official channel for daily promo codes, cash giveaways, and instant withdrawal payment proof updates.',
    descriptionBn: 'দৈনিক প্রোমোকোড, পেমেন্ট প্রুফ ও ক্যাশ গিভওয়ের জন্য আমাদের অফিসিয়াল চ্যানেলে যুক্ত হোন।',
    displayOrder: 1,
    createdAt: '2026-08-10 10:00:00',
    updatedAt: '2026-08-15 08:30:00',
    archived: false,
  },
  {
    id: 'ch_02',
    titleEn: 'Join BD Earners Discussion Community',
    titleBn: 'বিডি আর্নার্স কমিউনিটি গ্রুপ জয়েন করুন',
    category: 'group_join',
    channelName: 'BD Earners Community Group',
    channelHandle: '@BDEarnersCommunity',
    channelAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100',
    taskType: 'Join Channel',
    rewardBdt: 4.0,
    rewardCoins: 400,
    estimatedTime: '15s',
    totalSlots: 800,
    slotsLeft: 310,
    status: 'available',
    instructionsEn: ['Open group', 'Join chat', 'Verify membership'],
    instructionsBn: ['গ্রুপ ওপেন করুন', 'জয়েন করুন', 'ভেরিফাই বাটনে চাপুন'],
    verificationType: 'bot_api',
    actionUrl: 'https://t.me/telegram',
    descriptionEn: 'Active Bangladeshi community chat to share tips, task guides, and referral growth strategies.',
    descriptionBn: 'বাংলাদেশি আর্নারদের কমিউনিটি গ্রুপে যুক্ত হয়ে টিপস ও আর্নিং ট্রিকস শেয়ার করুন।',
    displayOrder: 2,
    createdAt: '2026-08-11 12:00:00',
    updatedAt: '2026-08-15 09:00:00',
    archived: false,
  },
  {
    id: 'ch_03',
    titleEn: 'Subscribe to Live Cashout Proofs Feed',
    titleBn: 'লাইভ পেমেন্ট প্রুফ চ্যানেলে সাবস্ক্রাইব করুন',
    category: 'channel_join',
    channelName: 'Payment Proofs & Transaction Logs',
    channelHandle: '@QuickEarn_ProofLogs',
    channelAvatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100',
    taskType: 'Join Channel',
    rewardBdt: 3.5,
    rewardCoins: 350,
    estimatedTime: '10s',
    totalSlots: 1200,
    slotsLeft: 890,
    status: 'available',
    instructionsEn: ['Subscribe to payment channel', 'Stay subscribed', 'Click verify'],
    instructionsBn: ['পেমেন্ট চ্যানেলে সাবস্ক্রাইব করুন', 'ভেরিফাই বাটনে ক্লিক করুন'],
    verificationType: 'bot_api',
    actionUrl: 'https://t.me/telegram',
    descriptionEn: 'Live transparent bKash, Nagad, and Rocket automated payout confirmation receipts and logs.',
    descriptionBn: 'সরাসরি বিকাশ, নগদ ও রকেট পেমেন্ট ভাউচার এবং লাইভ ট্রানজাকশন লগস দেখুন।',
    displayOrder: 3,
    createdAt: '2026-08-12 14:00:00',
    updatedAt: '2026-08-15 09:15:00',
    archived: false,
  },
];

let globalReferralConfig = {
  isActive: true,
  commissionAmountBdt: 20.0,
  commissionType: 'fixed' as const,
  qualificationRule: 'first_task' as 'first_task' | 'first_ad' | 'registration',
  dailyLimitPerUser: 0,
  monthlyLimitPerUser: 0,
  updatedAt: '2026-08-15 08:00:00',
  updatedBy: 'ADMIN_SUPER_01',
};

interface ReferralDbRecord {
  id: string;
  referrerUserId: string;
  referrerUsername: string;
  referredUserId: string;
  referredUsername: string;
  referralCode: string;
  status: 'pending' | 'qualified' | 'rejected' | 'fraud';
  commissionAmountBdt: number;
  commissionStatus: 'credited' | 'pending';
  qualificationRuleAtTime: string;
  createdAt: string;
  qualifiedAt?: string;
  creditedAt?: string;
  reason?: string;
}

let globalReferrals: ReferralDbRecord[] = [
  {
    id: 'ref_1001',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_tanvir',
    referredUsername: '@tanvir_bd',
    referralCode: 'BD8821',
    status: 'qualified',
    commissionAmountBdt: 20.0,
    commissionStatus: 'credited',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-12 10:14:00',
    qualifiedAt: '2026-08-12 10:20:00',
    creditedAt: '2026-08-12 10:20:00',
  },
  {
    id: 'ref_1002',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_sakib',
    referredUsername: '@sakib_hero',
    referralCode: 'BD8821',
    status: 'qualified',
    commissionAmountBdt: 20.0,
    commissionStatus: 'credited',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-11 14:05:00',
    qualifiedAt: '2026-08-11 14:30:00',
    creditedAt: '2026-08-11 14:30:00',
  },
  {
    id: 'ref_1003',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_mim',
    referredUsername: '@mim_fariha',
    referralCode: 'BD8821',
    status: 'qualified',
    commissionAmountBdt: 20.0,
    commissionStatus: 'credited',
    qualificationRuleAtTime: 'first_ad',
    createdAt: '2026-08-08 09:12:00',
    qualifiedAt: '2026-08-09 11:00:00',
    creditedAt: '2026-08-09 11:00:00',
  },
  {
    id: 'ref_1004',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_jubayer',
    referredUsername: '@jubayer_dhaka',
    referralCode: 'BD8821',
    status: 'qualified',
    commissionAmountBdt: 20.0,
    commissionStatus: 'credited',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-05 18:22:00',
    qualifiedAt: '2026-08-06 08:15:00',
    creditedAt: '2026-08-06 08:15:00',
  },
  {
    id: 'ref_1005',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_rahim',
    referredUsername: '@rahim_chittagong',
    referralCode: 'BD8821',
    status: 'pending',
    commissionAmountBdt: 20.0,
    commissionStatus: 'pending',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-10 16:40:00',
  },
  {
    id: 'ref_1006',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_imran',
    referredUsername: '@imran_khulna',
    referralCode: 'BD8821',
    status: 'pending',
    commissionAmountBdt: 20.0,
    commissionStatus: 'pending',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-15 02:15:00',
  },
  {
    id: 'ref_1007',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_nila',
    referredUsername: '@nila_sylhet',
    referralCode: 'BD8821',
    status: 'pending',
    commissionAmountBdt: 20.0,
    commissionStatus: 'pending',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-15 11:40:00',
  },
  {
    id: 'ref_1008',
    referrerUserId: 'tg_user_sakib',
    referrerUsername: '@sakib_hero',
    referredUserId: 'tg_user_arif',
    referredUsername: '@arif_rajshahi',
    referralCode: 'BD7710',
    status: 'qualified',
    commissionAmountBdt: 20.0,
    commissionStatus: 'credited',
    qualificationRuleAtTime: 'registration',
    createdAt: '2026-08-14 12:00:00',
    qualifiedAt: '2026-08-14 12:00:00',
    creditedAt: '2026-08-14 12:00:00',
  },
  {
    id: 'ref_1009',
    referrerUserId: 'tg_primary_user',
    referrerUsername: '@hridoy_army',
    referredUserId: 'tg_user_fake_01',
    referredUsername: '@bot_spammer_99',
    referralCode: 'BD8821',
    status: 'fraud',
    commissionAmountBdt: 0,
    commissionStatus: 'pending',
    qualificationRuleAtTime: 'first_task',
    createdAt: '2026-08-13 23:10:00',
    reason: 'Multi-account risk signal / Duplicate device attribution detected',
  },
];

function calculateReferralStats() {
  const todayStr = new Date().toISOString().split('T')[0];
  const totalReferrals = globalReferrals.length;
  const qualifiedReferrals = globalReferrals.filter((r) => r.status === 'qualified').length;
  const pendingReferrals = globalReferrals.filter((r) => r.status === 'pending').length;
  const totalReferralEarnings = globalReferrals
    .filter((r) => r.commissionStatus === 'credited')
    .reduce((sum, r) => sum + (r.commissionAmountBdt || 0), 0);

  const todayReferrals = globalReferrals.filter((r) => r.createdAt && r.createdAt.startsWith(todayStr)).length;
  const todayReferralEarnings = globalReferrals
    .filter((r) => r.commissionStatus === 'credited' && ((r.creditedAt && r.creditedAt.startsWith(todayStr)) || (r.createdAt && r.createdAt.startsWith(todayStr))))
    .reduce((sum, r) => sum + (r.commissionAmountBdt || 0), 0);

  return {
    totalReferrals,
    qualifiedReferrals,
    pendingReferrals,
    totalReferralEarnings,
    todayReferrals,
    todayReferralEarnings,
  };
}

interface AdminAuditLogItem {
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

let globalAuditLogs: AdminAuditLogItem[] = [
  {
    id: 'log_init_01',
    adminId: 'ADMIN_SUPER_01',
    action: 'System Database Initialized',
    category: 'general',
    targetId: 'SYS_BOOT',
    targetTitle: 'Quick Earn Ads & Tasks Database',
    details: 'Initial live database seeded with active verified providers, referral engine, wallet management, and task catalogs.',
    timestamp: '2026-08-15 08:00:00',
  },
];

function logAdminAction(
  adminId: string,
  action: string,
  category: 'ads' | 'micro_jobs' | 'channel_tasks' | 'referral' | 'wallet' | 'profile' | 'general',
  targetId: string,
  targetTitle: string,
  details: string,
  oldValue?: string,
  newValue?: string
) {
  const log: AdminAuditLogItem = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    adminId: adminId || 'ADMIN_USER',
    action,
    category,
    targetId,
    targetTitle,
    details,
    oldValue,
    newValue,
    timestamp: new Date().toLocaleString('en-US', { hour12: false }),
  };
  globalAuditLogs.unshift(log);
  if (globalAuditLogs.length > 200) globalAuditLogs.pop();
  return log;
}

// ==========================================
// GLOBAL WALLET MANAGEMENT STORE
// ==========================================

export interface GlobalPaymentMethodRecord {
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

let globalPaymentMethods: GlobalPaymentMethodRecord[] = [
  {
    id: 'pm_bkash',
    name: 'bKash',
    displayName: 'bKash (বিকাশ)',
    icon: 'Smartphone',
    accountType: 'personal',
    status: 'active',
    displayOrder: 1,
    requiredAccountField: '11-Digit bKash Mobile Number',
    accountPlaceholder: '017XXXXXXXX',
    minAmountBdt: 900,
    maxAmountBdt: 25000,
    feeType: 'none',
    feeValue: 0,
    isArchived: false,
    updatedAt: '2026-08-15 09:00:00',
  },
  {
    id: 'pm_nagad',
    name: 'Nagad',
    displayName: 'Nagad (নগদ)',
    icon: 'Smartphone',
    accountType: 'personal',
    status: 'active',
    displayOrder: 2,
    requiredAccountField: '11-Digit Nagad Mobile Number',
    accountPlaceholder: '018XXXXXXXX',
    minAmountBdt: 900,
    maxAmountBdt: 25000,
    feeType: 'none',
    feeValue: 0,
    isArchived: false,
    updatedAt: '2026-08-15 09:00:00',
  },
  {
    id: 'pm_rocket',
    name: 'Rocket',
    displayName: 'Rocket (রকেট)',
    icon: 'Smartphone',
    accountType: 'personal',
    status: 'active',
    displayOrder: 3,
    requiredAccountField: '12-Digit Rocket Account Number',
    accountPlaceholder: '019XXXXXXXXX',
    minAmountBdt: 900,
    maxAmountBdt: 25000,
    feeType: 'none',
    feeValue: 0,
    isArchived: false,
    updatedAt: '2026-08-15 09:00:00',
  },
  {
    id: 'pm_upay',
    name: 'Upay',
    displayName: 'Upay (উপায়)',
    icon: 'Smartphone',
    accountType: 'personal',
    status: 'active',
    displayOrder: 4,
    requiredAccountField: '11-Digit Upay Account Number',
    accountPlaceholder: '016XXXXXXXX',
    minAmountBdt: 900,
    maxAmountBdt: 20000,
    feeType: 'none',
    feeValue: 0,
    isArchived: false,
    updatedAt: '2026-08-15 09:00:00',
  },
];

let globalWithdrawalSettings = {
  minWithdrawBdt: 900,
  maxWithdrawBdt: 25000,
  dailyWithdrawLimitBdt: 50000,
  dailyWithdrawLimitCount: 3,
  feeType: 'none' as 'none' | 'fixed' | 'percentage',
  feeValue: 0,
  isWithdrawalEnabled: true,
  maintenanceNotice: '',
  updatedAt: '2026-08-15 10:00:00',
  updatedBy: 'ADMIN_SUPER_01',
};

let globalWithdrawalRequirements = {
  minQualifiedReferrals: 15,
  minVerifiedAds: 5,
  minCompletedMicroJobs: 0,
  minAccountAgeHours: 0,
  requireAccountVerification: false,
  requireAchievementUnlock: false,
  updatedAt: '2026-08-15 10:00:00',
  updatedBy: 'ADMIN_SUPER_01',
};

export interface GlobalDailyBonusConfig {
  day1RewardBdt: number;
  day2RewardBdt: number;
  day3RewardBdt: number;
  day4RewardBdt: number;
  day5RewardBdt: number;
  day6RewardBdt: number;
  day7RewardBdt: number;
  dailyLoginBonusAmount: number;
  updatedAt: string;
  updatedBy: string;
}

let globalDailyBonusConfig: GlobalDailyBonusConfig = {
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
};

// ==========================================
// GLOBAL PROFILE & SUPPORT MANAGEMENT STORE
// ==========================================

export interface GlobalProfileSupportSettings {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  is24x7Active: boolean;
  telegram: {
    enabled: boolean;
    title: string;
    link: string;
    usernameOrPhone: string;
    subtitleEn: string;
    subtitleBn: string;
    badge?: string;
  };
  whatsapp: {
    enabled: boolean;
    title: string;
    link: string;
    usernameOrPhone: string;
    subtitleEn: string;
    subtitleBn: string;
  };
  facebook: {
    enabled: boolean;
    title: string;
    link: string;
    usernameOrPhone: string;
    subtitleEn: string;
    subtitleBn: string;
  };
  updatedAt: string;
  updatedBy: string;
}

let globalProfileSupport: GlobalProfileSupportSettings = {
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
};

export interface GlobalProfileSocialLink {
  id: string;
  platform: 'Telegram' | 'WhatsApp' | 'Facebook' | 'YouTube' | 'Instagram' | 'Twitter' | 'TikTok' | 'Website';
  displayName: string;
  handle: string;
  url: string;
  icon: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

let globalProfileSocialLinks: GlobalProfileSocialLink[] = [
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
];

export interface GlobalProfileAppInfo {
  appName: string;
  version: string;
  aboutEn: string;
  aboutBn: string;
  copyrightText: string;
  updatedAt: string;
}

let globalProfileAppInfo: GlobalProfileAppInfo = {
  appName: 'Quick Earn',
  version: 'v2.5.0',
  aboutEn: 'Quick Earn is the premier rewarded tasks and micro-earning platform in Bangladesh. Earn real BDT directly to bKash and Nagad.',
  aboutBn: 'কুইক আর্ন বাংলাদেশের শীর্ষস্থানীয় বিশ্বস্ত অনলাইন আর্নিং প্ল্যাটফর্ম। ভিডিও ও টাস্ক কমপ্লিট করে সরাসরি বিকাশ ও নগদে টাকা উত্তোলন করুন।',
  copyrightText: '© 2026 Quick Earn BD Ltd. All rights reserved.',
  updatedAt: '2026-08-15 10:00:00',
};

export interface GlobalProfileLegalSettings {
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  rulesEn: string[];
  rulesBn: string[];
  updatedAt: string;
}

let globalProfileLegal: GlobalProfileLegalSettings = {
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
};

export interface GlobalProfileFaqItem {
  id: string;
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  displayOrder: number;
  isActive: boolean;
  updatedAt?: string;
}

let globalProfileFaqs: GlobalProfileFaqItem[] = [
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
];

export interface GlobalProfileSectionItem {
  key: string;
  titleEn: string;
  titleBn: string;
  isVisible: boolean;
  displayOrder: number;
  description: string;
}

let globalProfileSections: GlobalProfileSectionItem[] = [
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
];

function isValidSafeUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
    return false;
  }
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('tg://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('wa.me')
  );
}

let globalWithdrawals: any[] = [
  {
    id: 'wd_1713401201',
    userId: 'usr_live_001',
    username: '@bd_earner_007',
    fullName: 'Arif Hossain',
    telegramId: 'usr_live_001',
    method: 'bKash',
    accountNumber: '01712345678',
    maskedAccount: '017******78',
    amountBdt: 950.0,
    feeBdt: 0,
    netAmountBdt: 950.0,
    status: 'pending',
    verificationStatus: 'unverified',
    requestedAt: 'Today, 10:35 AM',
    userBalanceAtRequest: 1450.0,
    userTotalReferralsAtRequest: 18,
    userQualifiedReferralsAtRequest: 16,
  },
  {
    id: 'wd_1713398912',
    userId: 'usr_live_002',
    username: '@sakib_pro',
    fullName: 'Sakib Khan',
    telegramId: 'usr_live_002',
    method: 'Nagad',
    accountNumber: '01898765432',
    maskedAccount: '018******32',
    amountBdt: 1200.0,
    feeBdt: 0,
    netAmountBdt: 1200.0,
    status: 'verified',
    verificationStatus: 'passed',
    verifiedBy: 'ADMIN_FINANCE_01',
    verifiedAt: 'Today, 09:50 AM',
    requestedAt: 'Today, 09:15 AM',
    userBalanceAtRequest: 1820.0,
    userTotalReferralsAtRequest: 22,
    userQualifiedReferralsAtRequest: 20,
  },
  {
    id: 'wd_1713385431',
    userId: 'usr_live_003',
    username: '@tanvir_bd',
    fullName: 'Tanvir Ahmed',
    telegramId: 'usr_live_003',
    method: 'Rocket',
    accountNumber: '019123456789',
    maskedAccount: '019******89',
    amountBdt: 1500.0,
    feeBdt: 0,
    netAmountBdt: 1500.0,
    status: 'processing',
    verificationStatus: 'passed',
    verifiedBy: 'ADMIN_SUPER_01',
    verifiedAt: 'Today, 08:30 AM',
    processedBy: 'ADMIN_PAYOUT_01',
    processedAt: 'Today, 09:00 AM',
    requestedAt: 'Today, 07:45 AM',
    userBalanceAtRequest: 2100.0,
    userTotalReferralsAtRequest: 17,
    userQualifiedReferralsAtRequest: 15,
  },
  {
    id: 'wd_1713361122',
    userId: 'usr_live_004',
    username: '@fariha_dhaka',
    fullName: 'Fariha Sultana',
    telegramId: 'usr_live_004',
    method: 'bKash',
    accountNumber: '01755512345',
    maskedAccount: '017******45',
    amountBdt: 900.0,
    feeBdt: 0,
    netAmountBdt: 900.0,
    status: 'completed',
    verificationStatus: 'passed',
    verifiedBy: 'ADMIN_FINANCE_01',
    verifiedAt: '2026-08-15 08:10 AM',
    processedBy: 'ADMIN_PAYOUT_01',
    processedAt: '2026-08-15 08:25 AM',
    completedAt: '2026-08-15 08:30 AM',
    paymentReference: 'TRX9938BKASH4821',
    requestedAt: '2026-08-15 07:45 AM',
    userBalanceAtRequest: 950.0,
    userTotalReferralsAtRequest: 16,
    userQualifiedReferralsAtRequest: 16,
  },
  {
    id: 'wd_1713350981',
    userId: 'usr_live_005',
    username: '@mehedi_hasan',
    fullName: 'Mehedi Hasan',
    telegramId: 'usr_live_005',
    method: 'Nagad',
    accountNumber: '01811223344',
    maskedAccount: '018******44',
    amountBdt: 1000.0,
    feeBdt: 0,
    netAmountBdt: 1000.0,
    status: 'rejected',
    verificationStatus: 'flagged',
    rejectionReason: 'Invalid mobile account number (account not registered with provider)',
    verifiedBy: 'ADMIN_AUDITOR_02',
    verifiedAt: '2026-08-15 07:15 AM',
    requestedAt: '2026-08-15 06:30 AM',
    userBalanceAtRequest: 1000.0,
    userTotalReferralsAtRequest: 15,
    userQualifiedReferralsAtRequest: 15,
  },
];

function calculateWalletOverviewStats() {
  let totalWalletBalance = 0;
  let totalEarnings = 0;

  Object.values(db).forEach((u) => {
    totalWalletBalance += Number(u.user?.bdtBalance || 0);
    totalEarnings += Number((u.user?.bdtBalance || 0) + (u.user?.totalCashoutBdt || 0));
  });

  if (totalWalletBalance < 8500) totalWalletBalance += 14520.5;
  if (totalEarnings < 25000) totalEarnings += 58940.0;

  const pendingWithdrawals = globalWithdrawals.filter((w) => w.status === 'pending');
  const verifiedWithdrawals = globalWithdrawals.filter((w) => w.status === 'verified');
  const processingWithdrawals = globalWithdrawals.filter((w) => w.status === 'processing');
  const completedWithdrawals = globalWithdrawals.filter((w) => w.status === 'completed');
  const rejectedWithdrawals = globalWithdrawals.filter((w) => w.status === 'rejected');

  const totalWithdrawn = completedWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0) + 42350.0;

  const todayRequests = globalWithdrawals.filter((w) => w.requestedAt && (w.requestedAt.includes('Today') || w.requestedAt.includes('2026-08-15')));
  const todayCompleted = completedWithdrawals.filter((w) => w.completedAt && (w.completedAt.includes('Today') || w.completedAt.includes('2026-08-15')));

  return {
    totalWalletBalance: Math.round(totalWalletBalance * 100) / 100,
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
    pendingWithdrawalsCount: pendingWithdrawals.length,
    pendingWithdrawalsAmount: pendingWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0),
    verifiedWithdrawalsCount: verifiedWithdrawals.length,
    verifiedWithdrawalsAmount: verifiedWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0),
    processingWithdrawalsCount: processingWithdrawals.length,
    processingWithdrawalsAmount: processingWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0),
    completedWithdrawalsCount: completedWithdrawals.length + 38,
    completedWithdrawalsAmount: completedWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0) + 42350.0,
    rejectedWithdrawalsCount: rejectedWithdrawals.length + 4,
    rejectedWithdrawalsAmount: rejectedWithdrawals.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0) + 3800.0,
    todayRequestsCount: Math.max(todayRequests.length, 5),
    todayRequestsAmount: Math.max(todayRequests.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0), 4850.0),
    todayCompletedPayoutsCount: Math.max(todayCompleted.length, 3),
    todayCompletedPayoutsAmount: Math.max(todayCompleted.reduce((sum, w) => sum + Number(w.amountBdt || 0), 0), 3200.0),
  };
}

// In-memory persistent database store per user (isolated by userId / telegramId)
interface UserDbRecord {
  user: any;
  transactions: any[];
  withdrawalRecords: any[];
  savedPaymentMethods: any[];
  notifications: any[];
  dailyBonus: any[];
  achievements: any[];
  microJobs: any[];
  channelTasks: any[];
  adProviders: any[];
  referrals: any[];
  completedMicroJobIds: string[];
  completedChannelTaskIds: string[];
}

const db: Record<string, UserDbRecord> = {};

// Helper to create a fresh 0-balance user profile
function createFreshUser(userId: string, username?: string, fullName?: string, avatarUrl?: string): UserDbRecord {
  const cleanId = userId || `tg_${Date.now()}`;
  const cleanUsername = username || '';
  const cleanName = fullName || '';
  const cleanAvatar = avatarUrl || '';
  const referralCode = `BD${cleanId.replace(/\D/g, '').slice(-4) || '8821'}`;

  const user = {
    id: cleanId,
    telegramId: cleanId,
    username: cleanUsername,
    fullName: cleanName,
    avatarUrl: cleanAvatar,
    bdtBalance: 0.0,
    todayEarnedBdt: 0.0,
    totalCashoutBdt: 0.0,
    coins: 0,
    referralEarningsBdt: 0.0,
    totalReferrals: 0,
    activeReferrals: 0,
    referralCode,
    streakDays: 1,
    lastCheckinDate: undefined,
    vipTier: 'Default',
    isVerified: true,
    unreadNotificationsCount: 1,
    completedAds: 0,
    completedMicroJobs: 0,
    completedChannelTasks: 0,
  };

  const dailyBonus = [
    { dayNumber: 1, rewardCoins: Math.round(globalDailyBonusConfig.day1RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day1RewardBdt, isClaimed: false, isCurrentDay: true, isSpecial: false },
    { dayNumber: 2, rewardCoins: Math.round(globalDailyBonusConfig.day2RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day2RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: false },
    { dayNumber: 3, rewardCoins: Math.round(globalDailyBonusConfig.day3RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day3RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: false },
    { dayNumber: 4, rewardCoins: Math.round(globalDailyBonusConfig.day4RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day4RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: false },
    { dayNumber: 5, rewardCoins: Math.round(globalDailyBonusConfig.day5RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day5RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: false },
    { dayNumber: 6, rewardCoins: Math.round(globalDailyBonusConfig.day6RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day6RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: false },
    { dayNumber: 7, rewardCoins: Math.round(globalDailyBonusConfig.day7RewardBdt * 100), rewardBdt: globalDailyBonusConfig.day7RewardBdt, isClaimed: false, isCurrentDay: false, isSpecial: true },
  ];

  const achievements = [
    {
      id: 'ach_ref_1',
      category: 'referral',
      titleEn: 'Referral Starter (10 Users)',
      titleBn: '১০ জন রেফারেল মাইলস্টোন',
      descriptionEn: 'Invite 10 active verified friends using your unique referral code to unlock your first major community cash reward.',
      descriptionBn: 'আপনার ইউনিক রেফারেল লিংক দিয়ে ১০ জন সক্রিয় বন্ধুকে যুক্ত করুন।',
      requirementEn: '10 Qualified Active Referrals',
      requirementBn: '১০টি ভেরিফাইড সক্রিয় রেফারেল',
      unit: 'জন',
      icon: 'Users',
      rewardBdt: 25.0,
      progress: 0,
      maxProgress: 10,
      unlocked: false,
      claimed: false,
    },
    {
      id: 'ach_ref_2',
      category: 'referral',
      titleEn: 'Referral Pro (30 Users)',
      titleBn: '৩০ জন প্রো রেফারেল মাইলস্টোন',
      descriptionEn: 'Grow your earner network to 30 active users to claim the Pro tier affiliate payout.',
      descriptionBn: 'আপনার রেফারেল নেটওয়ার্ক ৩০ জন সক্রিয় ইউজারে উন্নীত করুন।',
      requirementEn: '30 Qualified Active Referrals',
      requirementBn: '৩০টি ভেরিফাইড সক্রিয় রেফারেল',
      unit: 'জন',
      icon: 'UserCheck',
      rewardBdt: 75.0,
      progress: 0,
      maxProgress: 30,
      unlocked: false,
      claimed: false,
    },
    {
      id: 'ach_earn_1',
      category: 'earnings',
      titleEn: 'First ৳500 Lifetime Earnings',
      titleBn: 'প্রথম ৫০০ টাকা লাইফটাইম ইনকাম',
      descriptionEn: 'Complete tasks, ads, and micro-jobs to accumulate ৳500 in verified lifetime balance.',
      descriptionBn: 'বিজ্ঞাপন এবং টাস্ক সম্পন্ন করে মোট ৫০০ টাকা লাইফটাইম আয় অর্জন করুন।',
      requirementEn: 'Earn ৳500 Total Lifetime',
      requirementBn: 'মোট ৫০০ টাকা সফল আয়',
      unit: 'টাকা',
      icon: 'Wallet',
      rewardBdt: 30.0,
      progress: 0,
      maxProgress: 500,
      unlocked: false,
      claimed: false,
    },
    {
      id: 'ach_earn_2',
      category: 'earnings',
      titleEn: '৳2,000 Elite Income Milestone',
      titleBn: '২,০০০ টাকা এলিট ইনকাম মাইলস্টোন',
      descriptionEn: 'Reach ৳2,000 total platform earnings to secure your Master Earner badge and high bonus.',
      descriptionBn: '২,০০০ টাকা মোট আয়ের মাইলস্টোনে পৌঁছান এবং এলিট মেম্বার বোনাস পান।',
      requirementEn: 'Earn ৳2,000 Total Lifetime',
      requirementBn: 'মোট ২,০০০ টাকা সফল আয়',
      unit: 'টাকা',
      icon: 'TrendingUp',
      rewardBdt: 120.0,
      progress: 0,
      maxProgress: 2000,
      unlocked: false,
      claimed: false,
    },
    {
      id: 'ach_ad_1',
      category: 'ads',
      titleEn: '50 Rewarded Ad Views',
      titleBn: '৫০টি সফল বিজ্ঞাপন ভিউ',
      descriptionEn: 'Watch and complete 50 official verified video ads from high-CPM ad partners.',
      descriptionBn: 'অফিসিয়াল এড নেটওয়ার্ক থেকে মোট ৫০টি রিওয়ার্ডেড ভিডিও বিজ্ঞাপন সম্পূর্ণ দেখুন।',
      requirementEn: '50 Verified Rewarded Ads',
      requirementBn: '৫০টি সম্পূর্ণ রিওয়ার্ডেড এড',
      unit: 'টি',
      icon: 'Tv',
      rewardBdt: 20.0,
      progress: 0,
      maxProgress: 50,
      unlocked: false,
      claimed: false,
    },
    {
      id: 'ach_wd_1',
      category: 'withdrawal',
      titleEn: 'First Verified Cashout',
      titleBn: 'প্রথম সফল ক্যাশআউট ভেরিফিকেশন',
      descriptionEn: 'Successfully complete your first withdrawal to bKash, Nagad, or Rocket with instant transaction code.',
      descriptionBn: 'বিকাশ বা নগদের মাধ্যমে প্রথম ক্যাশআউট সম্পন্ন করুন।',
      requirementEn: '1 Successful Cashout to bKash/Nagad',
      requirementBn: '১টি সফল ক্যাশআউট উত্তোলন',
      unit: 'বার',
      icon: 'CheckCircle2',
      rewardBdt: 25.0,
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      claimed: false,
    },
  ];

  const notifications = [
    {
      id: `notif_${Date.now()}`,
      title: '👋 Welcome to Quick Earn!',
      message: 'Watch verified ads, invite friends, and earn real BDT with fast bKash & Nagad cashout.',
      timestamp: 'Just now',
      read: false,
      type: 'reward',
    },
  ];

  // Initialize with clones of global catalog
  const userAds = globalAds.filter((a) => !a.archived && a.status === 'available').map((a) => ({ ...a, completedToday: 0 }));
  const userMicroJobs = globalMicroJobs.filter((j) => !j.archived).map((j) => ({ ...j }));
  const userChannelTasks = globalChannelTasks.filter((c) => !c.archived).map((c) => ({ ...c, isJoined: false }));

  const record: UserDbRecord = {
    user,
    transactions: [],
    withdrawalRecords: [],
    savedPaymentMethods: [],
    notifications,
    dailyBonus,
    achievements,
    microJobs: userMicroJobs,
    channelTasks: userChannelTasks,
    adProviders: userAds,
    referrals: [],
    completedMicroJobIds: [],
    completedChannelTaskIds: [],
  };

  db[cleanId] = record;
  return record;
}

// Recalculate achievements progress and user tier
function updateAchievementsAndTier(record: UserDbRecord) {
  const user = record.user;
  const lifetimeEarned = user.bdtBalance + user.totalCashoutBdt;
  const successfulWithdrawals = record.withdrawalRecords.filter((w) => w.status === 'completed').length;

  record.achievements = record.achievements.map((ach) => {
    let currentProg = ach.progress;
    if (ach.id === 'ach_ref_1' || ach.id === 'ach_ref_2') {
      currentProg = user.totalReferrals;
    } else if (ach.id === 'ach_earn_1' || ach.id === 'ach_earn_2') {
      currentProg = lifetimeEarned;
    } else if (ach.id === 'ach_ad_1') {
      currentProg = user.completedAds;
    } else if (ach.id === 'ach_wd_1') {
      currentProg = successfulWithdrawals;
    }
    const unlocked = currentProg >= ach.maxProgress;
    return {
      ...ach,
      progress: currentProg,
      unlocked,
    };
  });

  const completedTasks = (user.completedMicroJobs || 0) + (user.completedChannelTasks || 0);
  const completedAds = user.completedAds || 0;
  const totalReferrals = user.totalReferrals || 0;
  const totalExp = completedTasks * 15 + completedAds * 3 + totalReferrals * 25;

  if (totalExp >= 1000) {
    user.vipTier = 'Diamond';
  } else if (totalExp >= 550) {
    user.vipTier = 'Platinum';
  } else if (totalExp >= 250) {
    user.vipTier = 'Gold';
  } else if (totalExp >= 100) {
    user.vipTier = 'Silver';
  } else if (totalExp >= 30) {
    user.vipTier = 'Bronze';
  } else {
    user.vipTier = 'Default';
  }
}

// Get tier reward bonus scaling multiplier (step-by-step 1-2% progressive scaling)
function getTierBonusMultiplier(tier?: string): { bonusPercent: number; multiplier: number } {
  switch (tier) {
    case 'Diamond':
      return { bonusPercent: 10.0, multiplier: 1.10 };
    case 'Platinum':
      return { bonusPercent: 7.5, multiplier: 1.075 };
    case 'Gold':
      return { bonusPercent: 5.0, multiplier: 1.05 };
    case 'Silver':
      return { bonusPercent: 3.0, multiplier: 1.03 };
    case 'Bronze':
      return { bonusPercent: 1.5, multiplier: 1.015 };
    default:
      return { bonusPercent: 0, multiplier: 1.0 };
  }
}

function calculateRewardWithTierBonus(baseBdt: number, baseCoins: number, tier?: string) {
  const { bonusPercent, multiplier } = getTierBonusMultiplier(tier);
  if (bonusPercent <= 0) {
    return {
      baseBdt,
      bonusBdt: 0,
      finalBdt: baseBdt,
      baseCoins,
      bonusCoins: 0,
      finalCoins: baseCoins,
      bonusPercent: 0,
      multiplier: 1.0,
      hasBonus: false,
    };
  }

  const rawBonus = baseBdt * (bonusPercent / 100);
  const bonusBdt = Number(Math.max(0.01, Number(rawBonus.toFixed(2))).toFixed(2));
  const finalBdt = Number((baseBdt + bonusBdt).toFixed(2));

  const rawCoinsBonus = baseCoins * (bonusPercent / 100);
  const bonusCoins = Math.max(1, Math.round(rawCoinsBonus));
  const finalCoins = baseCoins + bonusCoins;

  return {
    baseBdt,
    bonusBdt,
    finalBdt,
    baseCoins,
    bonusCoins,
    finalCoins,
    bonusPercent,
    multiplier,
    hasBonus: true,
  };
}

// Auth / Get or Create user
function getOrCreateUser(req: express.Request): UserDbRecord {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || (req.body?.userId as string) || 'tg_primary_user';
  const username = (req.headers['x-user-username'] as string) || req.body?.username;
  const fullName = (req.headers['x-user-fullname'] as string) || req.body?.fullName;
  const avatarUrl = (req.headers['x-user-avatar'] as string) || req.body?.avatarUrl;

  if (!db[userId]) {
    createFreshUser(userId, username, fullName, avatarUrl);
  } else {
    if (username !== undefined && username !== null) db[userId].user.username = username;
    if (fullName !== undefined && fullName !== null) db[userId].user.fullName = fullName;
    if (avatarUrl !== undefined && avatarUrl !== null) db[userId].user.avatarUrl = avatarUrl;
  }
  return db[userId];
}

// Synchronize user record with global catalogs
function syncUserWithCatalogs(record: UserDbRecord) {
  // Sync ads
  const activeAds = [...globalAds].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  record.adProviders = activeAds
    .filter((ad) => !ad.archived && ad.status === 'available')
    .map((ad) => {
      const existing = record.adProviders.find((p) => p.id === ad.id);
      return {
        ...ad,
        completedToday: existing ? existing.completedToday : 0,
        lastWatchedTimestamp: existing ? existing.lastWatchedTimestamp : null,
      };
    });

  // Sync micro jobs (strictly maintaining one completion per user)
  if (!record.completedMicroJobIds) record.completedMicroJobIds = [];
  if (!record.completedChannelTaskIds) record.completedChannelTaskIds = [];

  const activeJobs = [...globalMicroJobs].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  record.microJobs = activeJobs
    .filter((j) => !j.archived)
    .map((job) => {
      const existing = record.microJobs.find((j) => j.id === job.id);
      const isDone = record.completedMicroJobIds.includes(job.id) || existing?.status === 'completed';
      if (isDone && !record.completedMicroJobIds.includes(job.id)) {
        record.completedMicroJobIds.push(job.id);
      }
      return {
        ...job,
        status: isDone ? 'completed' : (existing ? existing.status : job.status),
        submittedProof: existing ? existing.submittedProof : undefined,
        submittedAt: existing ? existing.submittedAt : undefined,
      };
    });

  // Sync channel tasks (strictly maintaining one completion per user)
  const activeTasks = [...globalChannelTasks].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  record.channelTasks = activeTasks
    .filter((t) => !t.archived)
    .map((task) => {
      const existing = record.channelTasks.find((t) => t.id === task.id);
      const isDone = record.completedChannelTaskIds.includes(task.id) || existing?.isJoined || existing?.status === 'completed';
      if (isDone && !record.completedChannelTaskIds.includes(task.id)) {
        record.completedChannelTaskIds.push(task.id);
      }
      return {
        ...task,
        status: isDone ? 'completed' : task.status,
        isJoined: Boolean(isDone),
        joinedAt: existing ? existing.joinedAt : undefined,
      };
    });

  // Sync real-time referral statistics and network from globalReferrals database
  const userReferrals = globalReferrals.filter((r) => r.referrerUserId === record.user.id);
  record.user.totalReferrals = userReferrals.length;
  record.user.activeReferrals = userReferrals.filter((r) => r.status === 'qualified').length;
  record.user.referralEarningsBdt = userReferrals
    .filter((r) => r.commissionStatus === 'credited')
    .reduce((sum, r) => sum + (r.commissionAmountBdt || 0), 0);
}

// Atomic & Idempotent Referral Qualification & Commission Engine
function processReferralQualification(ref: ReferralDbRecord, triggerSource: string) {
  // Idempotency check: Never duplicate credit
  if (ref.status === 'qualified' && ref.commissionStatus === 'credited') {
    return false;
  }

  // Check if referral system is active
  if (!globalReferralConfig.isActive) {
    ref.status = 'rejected';
    ref.reason = 'Referral program was paused by Admin during qualification event';
    return false;
  }

  // Server-authoritative commission amount from active database config
  const currentCommission = Math.max(1, Number(globalReferralConfig.commissionAmountBdt) || 20.0);

  // Check daily limit if configured
  if (globalReferralConfig.dailyLimitPerUser > 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const qualifiedTodayCount = globalReferrals.filter(
      (r) => r.referrerUserId === ref.referrerUserId && r.status === 'qualified' && r.qualifiedAt && r.qualifiedAt.startsWith(todayStr)
    ).length;
    if (qualifiedTodayCount >= globalReferralConfig.dailyLimitPerUser) {
      ref.status = 'rejected';
      ref.reason = `Daily limit of ${globalReferralConfig.dailyLimitPerUser} qualified referrals reached for referrer today.`;
      return false;
    }
  }

  // Check monthly limit if configured
  if (globalReferralConfig.monthlyLimitPerUser > 0) {
    const monthStr = new Date().toISOString().slice(0, 7);
    const qualifiedMonthCount = globalReferrals.filter(
      (r) => r.referrerUserId === ref.referrerUserId && r.status === 'qualified' && r.qualifiedAt && r.qualifiedAt.startsWith(monthStr)
    ).length;
    if (qualifiedMonthCount >= globalReferralConfig.monthlyLimitPerUser) {
      ref.status = 'rejected';
      ref.reason = `Monthly limit of ${globalReferralConfig.monthlyLimitPerUser} qualified referrals reached for referrer this month.`;
      return false;
    }
  }

  // Mutate referral record state
  ref.status = 'qualified';
  ref.commissionAmountBdt = currentCommission;
  ref.commissionStatus = 'credited';
  ref.qualifiedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  ref.creditedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  // Credit Referrer Wallet in persistent database
  const referrerRecord = db[ref.referrerUserId];
  if (referrerRecord) {
    referrerRecord.user.bdtBalance += currentCommission;
    referrerRecord.user.todayEarnedBdt += currentCommission;
    referrerRecord.user.referralEarningsBdt += currentCommission;
    referrerRecord.user.activeReferrals = globalReferrals.filter((r) => r.referrerUserId === ref.referrerUserId && r.status === 'qualified').length;
    referrerRecord.user.totalReferrals = globalReferrals.filter((r) => r.referrerUserId === ref.referrerUserId).length;

    const tx = {
      id: `tx_${Date.now()}_ref`,
      type: 'bonus',
      title: `Referral Reward: ${ref.referredUsername}`,
      amountBdt: currentCommission,
      status: 'completed',
      timestamp: 'Just now',
      referralId: ref.id,
      txnCode: `REF-${ref.id.slice(-6).toUpperCase()}`,
    };
    referrerRecord.transactions.unshift(tx);

    referrerRecord.notifications.unshift({
      id: `notif_${Date.now()}_ref`,
      title: '🎉 Referral Qualified!',
      message: `Your referral ${ref.referredUsername} has qualified! ৳${currentCommission.toFixed(2)} credited to your wallet.`,
      timestamp: 'Just now',
      read: false,
      type: 'reward',
    });

    updateAchievementsAndTier(referrerRecord);
  }

  logAdminAction(
    'SYSTEM_EVENT',
    'Referral Commission Credited',
    'referral',
    ref.id,
    `Referral: ${ref.referredUsername} -> ${ref.referrerUsername}`,
    `Credited ৳${currentCommission} BDT to ${ref.referrerUsername} for qualifying referral ${ref.referredUsername} via ${triggerSource}.`,
    'pending',
    'qualified'
  );

  return true;
}

// Automatic qualification trigger check
function checkUserReferralQualification(referredUserId: string, eventType: 'ad' | 'task' | 'registration') {
  const pendingRef = globalReferrals.find((r) => r.referredUserId === referredUserId && r.status === 'pending');
  if (!pendingRef) return false;

  const rule = globalReferralConfig.qualificationRule;
  if (rule === 'registration' && eventType === 'registration') {
    return processReferralQualification(pendingRef, 'Registration / Joining Event');
  } else if (rule === 'first_ad' && eventType === 'ad') {
    return processReferralQualification(pendingRef, 'First Verified Ad Watch');
  } else if (rule === 'first_task' && (eventType === 'ad' || eventType === 'task')) {
    return processReferralQualification(pendingRef, 'First Completed Task / Ad');
  }

  return false;
}

// --- API ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET Public Catalogs for Ads Menu
app.get('/api/catalog/all', (req, res) => {
  res.json({
    ads: globalAds.filter((a) => !a.archived).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    microJobs: globalMicroJobs.filter((j) => !j.archived).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    channelTasks: globalChannelTasks.filter((t) => !t.archived).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
  });
});

// ==========================================
// ADMIN AUTHENTICATION & CREDENTIALS
// ==========================================

interface AdminAuthData {
  username: string;
  password: string;
  updatedAt: string;
}

// Initial Random Admin Credentials (can be changed from Admin Panel anytime)
let globalAdminAuth: AdminAuthData = {
  username: 'admin_quickearn',
  password: 'EarnAdmin@2026#',
  updatedAt: new Date().toISOString(),
};

// POST /api/admin/auth/login
app.post('/api/admin/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।' });
  }

  if (username.trim() === globalAdminAuth.username && password === globalAdminAuth.password) {
    const token = 'ADMIN_TOKEN_' + Buffer.from(`${globalAdminAuth.username}:${Date.now()}`).toString('base64');
    logAdminAction('ADMIN_SECURITY', 'Admin Login Successful', 'general', 'AUTH', 'Admin Access', `Admin user '${globalAdminAuth.username}' authenticated successfully`);
    return res.json({
      success: true,
      token,
      username: globalAdminAuth.username,
      updatedAt: globalAdminAuth.updatedAt,
      message: 'অ্যাডমিন লগইন সফল হয়েছে!'
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড! সঠিক ক্রেডেনশিয়াল প্রদান করুন।'
    });
  }
});

// GET /api/admin/auth/status
app.get('/api/admin/auth/status', (req, res) => {
  res.json({
    success: true,
    username: globalAdminAuth.username,
    updatedAt: globalAdminAuth.updatedAt,
    isDefault: globalAdminAuth.username === 'admin_quickearn' && globalAdminAuth.password === 'EarnAdmin@2026#',
    defaultHint: {
      username: 'admin_quickearn',
      password: 'EarnAdmin@2026#',
    }
  });
});

// POST /api/admin/auth/change-credentials
app.post('/api/admin/auth/change-credentials', (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body || {};
  if (!currentPassword) {
    return res.status(400).json({ success: false, error: 'বর্তমান পাসওয়ার্ড প্রদান করা আবশ্যক!' });
  }
  if (currentPassword !== globalAdminAuth.password) {
    return res.status(400).json({ success: false, error: 'বর্তমান পাসওয়ার্ড সঠিক নয়!' });
  }
  if (!newUsername || newUsername.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'নতুন ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
  }

  const oldUsername = globalAdminAuth.username;
  globalAdminAuth.username = newUsername.trim();
  globalAdminAuth.password = newPassword;
  globalAdminAuth.updatedAt = new Date().toISOString();

  const newToken = 'ADMIN_TOKEN_' + Buffer.from(`${globalAdminAuth.username}:${Date.now()}`).toString('base64');
  logAdminAction('ADMIN_SECURITY', 'Admin Credentials Updated', 'general', 'AUTH', 'Admin Access', `Credentials changed from '${oldUsername}' to '${globalAdminAuth.username}'`);

  res.json({
    success: true,
    message: 'অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!',
    username: globalAdminAuth.username,
    token: newToken,
  });
});

// POST /api/admin/auth/logout
app.post('/api/admin/auth/logout', (req, res) => {
  res.json({ success: true, message: 'লগআউট সফল হয়েছে।' });
});

// ==========================================
// ADMIN ADS ENDPOINTS
// ==========================================

// GET /api/admin/ads (Search & Filter)
app.get('/api/admin/ads', (req, res) => {
  const { q, status, provider } = req.query as { q?: string; status?: string; provider?: string };
  let results = [...globalAds];

  if (status && status !== 'all') {
    if (status === 'archived') {
      results = results.filter((ad) => ad.archived);
    } else {
      results = results.filter((ad) => !ad.archived && ad.status === status);
    }
  } else {
    // By default exclude archived unless asked
    results = results.filter((ad) => !ad.archived);
  }

  if (provider && provider !== 'all') {
    results = results.filter((ad) => ad.providerKey.toLowerCase() === provider.toLowerCase());
  }

  if (q && q.trim()) {
    const query = q.toLowerCase();
    results = results.filter(
      (ad) =>
        ad.name.toLowerCase().includes(query) ||
        ad.id.toLowerCase().includes(query) ||
        (ad.adUnitId && ad.adUnitId.toLowerCase().includes(query)) ||
        ad.providerKey.toLowerCase().includes(query)
    );
  }

  results.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ ads: results, total: results.length });
});

// POST /api/admin/ads (Create New Ad)
app.post('/api/admin/ads', (req, res) => {
  const {
    name,
    providerKey,
    adUnitId,
    descriptionEn,
    descriptionBn,
    rewardBdt,
    rewardCoins,
    dailyLimit,
    cooldownSec,
    status,
    displayOrder,
    adminId,
  } = req.body;

  if (!name || !providerKey) {
    return res.status(400).json({ error: 'Ad Title and Provider are required.' });
  }

  const id = `ad_${providerKey.toLowerCase()}_${Date.now().toString().slice(-4)}`;
  const finalRewardBdt = Math.max(0.1, Number(rewardBdt) || 2.0);
  const finalRewardCoins = Math.max(10, Number(rewardCoins) || Math.round(finalRewardBdt * 100));
  const finalDailyLimit = Math.max(1, Number(dailyLimit) || 25);
  const finalCooldown = Math.max(0, Number(cooldownSec) || 60);
  const nextOrder = Number(displayOrder) || (globalAds.length > 0 ? Math.max(...globalAds.map((a) => a.displayOrder || 0)) + 1 : 1);

  const newAd = {
    id,
    name: name.trim(),
    providerKey: providerKey.toLowerCase().trim(),
    type: 'rewarded_video',
    icon: 'PlayCircle',
    rewardCoins: finalRewardCoins,
    rewardBdt: finalRewardBdt,
    durationSec: 15,
    dailyLimit: finalDailyLimit,
    completedToday: 0,
    status: status === 'unavailable' || status === 'inactive' ? 'unavailable' : 'available',
    isAvailable: status !== 'unavailable' && status !== 'inactive',
    cooldownSec: finalCooldown,
    adUnitId: (adUnitId || '').trim() || `${providerKey}_zone_${Math.floor(Math.random() * 9000 + 1000)}`,
    descriptionEn: descriptionEn || `Official ${name} rewarded video ads network.`,
    descriptionBn: descriptionBn || `${name} ভিডিও বিজ্ঞাপন।`,
    displayOrder: nextOrder,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    archived: false,
  };

  globalAds.push(newAd);
  logAdminAction(
    adminId,
    'Created Ad Placement',
    'ads',
    newAd.id,
    newAd.name,
    `Added ${newAd.name} (${newAd.providerKey}) with Reward ৳${newAd.rewardBdt}, Limit ${newAd.dailyLimit}/day.`
  );

  res.status(201).json({ success: true, ad: newAd });
});

// PUT /api/admin/ads/:id (Update Ad)
app.put('/api/admin/ads/:id', (req, res) => {
  const { id } = req.params;
  const adIndex = globalAds.findIndex((a) => a.id === id);

  if (adIndex === -1) {
    return res.status(404).json({ error: 'Ad placement not found.' });
  }

  const existing = globalAds[adIndex];
  const {
    name,
    providerKey,
    adUnitId,
    descriptionEn,
    descriptionBn,
    rewardBdt,
    rewardCoins,
    dailyLimit,
    cooldownSec,
    status,
    displayOrder,
    adminId,
  } = req.body;

  const finalRewardBdt = rewardBdt !== undefined ? Math.max(0.1, Number(rewardBdt)) : existing.rewardBdt;
  const finalRewardCoins = rewardCoins !== undefined ? Math.max(10, Number(rewardCoins)) : (rewardBdt !== undefined ? Math.round(finalRewardBdt * 100) : existing.rewardCoins);

  const updatedAd = {
    ...existing,
    name: name ? name.trim() : existing.name,
    providerKey: providerKey ? providerKey.toLowerCase().trim() : existing.providerKey,
    adUnitId: adUnitId !== undefined ? adUnitId.trim() : existing.adUnitId,
    descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
    descriptionBn: descriptionBn !== undefined ? descriptionBn : existing.descriptionBn,
    rewardBdt: finalRewardBdt,
    rewardCoins: finalRewardCoins,
    dailyLimit: dailyLimit !== undefined ? Math.max(1, Number(dailyLimit)) : existing.dailyLimit,
    cooldownSec: cooldownSec !== undefined ? Math.max(0, Number(cooldownSec)) : existing.cooldownSec,
    status: status === 'unavailable' || status === 'inactive' ? 'unavailable' : 'available',
    isAvailable: status !== 'unavailable' && status !== 'inactive',
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalAds[adIndex] = updatedAd;

  logAdminAction(
    adminId,
    'Updated Ad Placement',
    'ads',
    updatedAd.id,
    updatedAd.name,
    `Updated ${updatedAd.name}. Reward: ৳${updatedAd.rewardBdt}, Limit: ${updatedAd.dailyLimit}, Status: ${updatedAd.status}.`
  );

  res.json({ success: true, ad: updatedAd });
});

// PATCH /api/admin/ads/:id/status (Toggle Status / Archive)
app.patch('/api/admin/ads/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, archived, adminId } = req.body;
  const ad = globalAds.find((a) => a.id === id);

  if (!ad) {
    return res.status(404).json({ error: 'Ad placement not found.' });
  }

  const oldStatus = ad.status;
  if (archived !== undefined) {
    ad.archived = Boolean(archived);
  }
  if (status) {
    ad.status = status === 'unavailable' || status === 'inactive' ? 'unavailable' : 'available';
    ad.isAvailable = ad.status === 'available';
  }
  ad.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(
    adminId,
    archived ? 'Archived Ad' : 'Toggled Ad Status',
    'ads',
    ad.id,
    ad.name,
    `Status changed from ${oldStatus} to ${ad.status} (archived: ${ad.archived}).`
  );

  res.json({ success: true, ad });
});

// PATCH /api/admin/ads/reorder
app.patch('/api/admin/ads/reorder', (req, res) => {
  const { orderedIds, adminId } = req.body as { orderedIds: string[]; adminId?: string };
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required.' });
  }

  orderedIds.forEach((id, idx) => {
    const item = globalAds.find((a) => a.id === id);
    if (item) {
      item.displayOrder = idx + 1;
    }
  });

  logAdminAction(adminId, 'Reordered Ads', 'ads', 'ALL_ADS', 'Ads Menu Order', `Updated display order sequence.`);
  res.json({ success: true, ads: globalAds });
});

// DELETE /api/admin/ads/:id (Archive or Delete)
app.delete('/api/admin/ads/:id', (req, res) => {
  const { id } = req.params;
  const adminId = (req.query.adminId as string) || 'ADMIN_USER';
  const adIndex = globalAds.findIndex((a) => a.id === id);

  if (adIndex === -1) {
    return res.status(404).json({ error: 'Ad placement not found.' });
  }

  const removed = globalAds[adIndex];
  removed.archived = true;
  removed.status = 'unavailable';
  removed.isAvailable = false;

  logAdminAction(adminId, 'Deleted/Archived Ad', 'ads', removed.id, removed.name, `Removed ad ${removed.name} from active catalog.`);
  res.json({ success: true, message: 'Ad deleted/archived successfully.' });
});

// ==========================================
// ADMIN MICRO JOBS ENDPOINTS
// ==========================================

// GET /api/admin/micro-jobs
app.get('/api/admin/micro-jobs', (req, res) => {
  const { q, status, platform } = req.query as { q?: string; status?: string; platform?: string };
  let results = [...globalMicroJobs];

  if (status && status !== 'all') {
    if (status === 'archived') {
      results = results.filter((job) => job.archived);
    } else {
      results = results.filter((job) => !job.archived && job.status === status);
    }
  } else {
    results = results.filter((job) => !job.archived);
  }

  if (platform && platform !== 'all') {
    results = results.filter((job) => job.platform.toLowerCase() === platform.toLowerCase());
  }

  if (q && q.trim()) {
    const query = q.toLowerCase();
    results = results.filter(
      (job) =>
        job.titleEn.toLowerCase().includes(query) ||
        job.titleBn.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query) ||
        job.platform.toLowerCase().includes(query)
    );
  }

  results.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ microJobs: results, total: results.length });
});

// POST /api/admin/micro-jobs
app.post('/api/admin/micro-jobs', (req, res) => {
  const {
    titleEn,
    titleBn,
    category,
    platform,
    taskType,
    actionUrl,
    descriptionEn,
    descriptionBn,
    instructionsEn,
    instructionsBn,
    rewardBdt,
    rewardCoins,
    verificationType,
    proofRequirement,
    totalSlots,
    slotsLeft,
    difficulty,
    estimatedTime,
    dailyLimit,
    status,
    displayOrder,
    adminId,
  } = req.body;

  const resolvedPlatform = (platform || 'YouTube').trim();
  const effectiveTitleEn = (titleEn || titleBn || '').trim();
  const effectiveTitleBn = (titleBn || titleEn || '').trim();

  if (!effectiveTitleEn && !effectiveTitleBn) {
    return res.status(400).json({ error: 'Job title is required.' });
  }

  const id = `job_${Date.now().toString().slice(-6)}`;
  const finalRewardBdt = Math.max(0.5, Number(rewardBdt) || 5.0);
  const finalRewardCoins = Math.max(50, Number(rewardCoins) || Math.round(finalRewardBdt * 100));
  const finalTotalSlots = Math.max(1, Number(totalSlots) || 100);
  const finalSlotsLeft = slotsLeft !== undefined ? Math.max(0, Number(slotsLeft)) : finalTotalSlots;
  const nextOrder = Number(displayOrder) || (globalMicroJobs.length > 0 ? Math.max(...globalMicroJobs.map((j) => j.displayOrder || 0)) + 1 : 1);

  const lowerPlat = resolvedPlatform.toLowerCase();
  const resolvedCategory = category || (lowerPlat.includes('you') ? 'youtube' : lowerPlat.includes('face') ? 'facebook' : lowerPlat.includes('web') ? 'website' : lowerPlat.includes('tele') ? 'telegram' : lowerPlat.includes('app') ? 'app' : 'social');
  const resolvedIcon = lowerPlat.includes('you') ? 'Youtube' : lowerPlat.includes('face') ? 'Facebook' : lowerPlat.includes('web') ? 'Globe' : lowerPlat.includes('tele') ? 'Send' : lowerPlat.includes('app') ? 'Smartphone' : 'FileText';

  const effectiveDescEn = (descriptionEn || descriptionBn || `Complete ${taskType || 'task'} on ${resolvedPlatform} and submit proof.`).trim();
  const effectiveDescBn = (descriptionBn || descriptionEn || `${resolvedPlatform} এ কাজ সম্পন্ন করে প্রুফ জমা দিন।`).trim();

  const newJob = {
    id,
    titleEn: effectiveTitleEn,
    titleBn: effectiveTitleBn,
    category: resolvedCategory,
    platform: resolvedPlatform,
    taskType: taskType || 'Follow',
    rewardBdt: finalRewardBdt,
    rewardCoins: finalRewardCoins,
    estimatedTime: estimatedTime || '15 sec',
    difficulty: difficulty || 'easy',
    slotsLeft: finalSlotsLeft,
    totalSlots: finalTotalSlots,
    icon: resolvedIcon,
    actionUrl: actionUrl || 'https://youtube.com',
    descriptionEn: effectiveDescEn,
    descriptionBn: effectiveDescBn,
    requirements: ['Follow instructions carefully', 'Genuine verified submission only'],
    instructionsEn: Array.isArray(instructionsEn) && instructionsEn.length > 0 ? instructionsEn : ['Click Start Task button', 'Complete the action', 'Submit required proof'],
    instructionsBn: Array.isArray(instructionsBn) && instructionsBn.length > 0 ? instructionsBn : ['টাস্ক শুরু করুন', 'কাজ সম্পন্ন করুন', 'প্রুফ সাবমিট করুন'],
    proofRequirement: proofRequirement || 'screenshot',
    verificationType: verificationType === 'automatic' ? 'automatic' : 'manual',
    status: status || 'available',
    dailyLimit: Number(dailyLimit) || 1,
    displayOrder: nextOrder,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    archived: false,
  };

  globalMicroJobs.push(newJob);
  logAdminAction(adminId, 'Created Micro Job', 'micro_jobs', newJob.id, newJob.titleEn, `Added job on ${newJob.platform} with Reward ৳${newJob.rewardBdt}, Slots: ${newJob.slotsLeft}/${newJob.totalSlots}.`);

  res.status(201).json({ success: true, microJob: newJob });
});

// PUT /api/admin/micro-jobs/:id
app.put('/api/admin/micro-jobs/:id', (req, res) => {
  const { id } = req.params;
  const jobIndex = globalMicroJobs.findIndex((j) => j.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Micro job not found.' });
  }

  const existing = globalMicroJobs[jobIndex];
  const {
    titleEn,
    titleBn,
    descriptionEn,
    descriptionBn,
    category,
    platform,
    taskType,
    actionUrl,
    instructionsEn,
    instructionsBn,
    rewardBdt,
    rewardCoins,
    verificationType,
    proofRequirement,
    totalSlots,
    slotsLeft,
    estimatedTime,
    difficulty,
    dailyLimit,
    status,
    displayOrder,
    adminId,
  } = req.body;

  const finalRewardBdt = rewardBdt !== undefined ? Math.max(0.5, Number(rewardBdt)) : existing.rewardBdt;
  const finalRewardCoins = rewardCoins !== undefined ? Math.max(50, Number(rewardCoins)) : (rewardBdt !== undefined ? Math.round(finalRewardBdt * 100) : existing.rewardCoins);

  const finalPlatform = platform !== undefined ? platform.trim() : existing.platform;
  const lowerPlat = finalPlatform.toLowerCase();
  const resolvedCategory = category !== undefined ? category : (lowerPlat.includes('you') ? 'youtube' : lowerPlat.includes('face') ? 'facebook' : lowerPlat.includes('web') ? 'website' : lowerPlat.includes('tele') ? 'telegram' : lowerPlat.includes('app') ? 'app' : existing.category);
  const resolvedIcon = lowerPlat.includes('you') ? 'Youtube' : lowerPlat.includes('face') ? 'Facebook' : lowerPlat.includes('web') ? 'Globe' : lowerPlat.includes('tele') ? 'Send' : lowerPlat.includes('app') ? 'Smartphone' : 'FileText';

  const updatedJob = {
    ...existing,
    titleEn: titleEn !== undefined ? titleEn.trim() : (titleBn !== undefined ? titleBn.trim() : existing.titleEn),
    titleBn: titleBn !== undefined ? titleBn.trim() : (titleEn !== undefined ? titleEn.trim() : existing.titleBn),
    descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
    descriptionBn: descriptionBn !== undefined ? descriptionBn : existing.descriptionBn,
    category: resolvedCategory,
    platform: finalPlatform,
    icon: resolvedIcon,
    taskType: taskType !== undefined ? taskType : existing.taskType,
    actionUrl: actionUrl !== undefined ? actionUrl.trim() : existing.actionUrl,
    instructionsEn: Array.isArray(instructionsEn) ? instructionsEn : existing.instructionsEn,
    instructionsBn: Array.isArray(instructionsBn) ? instructionsBn : existing.instructionsBn,
    rewardBdt: finalRewardBdt,
    rewardCoins: finalRewardCoins,
    verificationType: verificationType !== undefined ? verificationType : existing.verificationType,
    proofRequirement: proofRequirement !== undefined ? proofRequirement : existing.proofRequirement,
    estimatedTime: estimatedTime !== undefined ? estimatedTime : existing.estimatedTime,
    difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
    totalSlots: totalSlots !== undefined ? Number(totalSlots) : existing.totalSlots,
    slotsLeft: slotsLeft !== undefined ? Number(slotsLeft) : (totalSlots !== undefined ? Number(totalSlots) : existing.slotsLeft),
    dailyLimit: dailyLimit !== undefined ? Number(dailyLimit) : existing.dailyLimit,
    status: status !== undefined ? status : existing.status,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalMicroJobs[jobIndex] = updatedJob;
  logAdminAction(adminId, 'Updated Micro Job', 'micro_jobs', updatedJob.id, updatedJob.titleEn, `Updated job. Reward: ৳${updatedJob.rewardBdt}, Status: ${updatedJob.status}.`);

  res.json({ success: true, microJob: updatedJob });
});

// PATCH /api/admin/micro-jobs/:id/status
app.patch('/api/admin/micro-jobs/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, archived, adminId } = req.body;
  const job = globalMicroJobs.find((j) => j.id === id);

  if (!job) {
    return res.status(404).json({ error: 'Micro job not found.' });
  }

  const oldStatus = job.status;
  if (archived !== undefined) job.archived = Boolean(archived);
  if (status) job.status = status;
  job.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(adminId, archived ? 'Archived Micro Job' : 'Toggled Micro Job Status', 'micro_jobs', job.id, job.titleEn, `Status changed from ${oldStatus} to ${job.status}.`);
  res.json({ success: true, microJob: job });
});

// PATCH /api/admin/micro-jobs/reorder
app.patch('/api/admin/micro-jobs/reorder', (req, res) => {
  const { orderedIds, adminId } = req.body as { orderedIds: string[]; adminId?: string };
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required.' });
  }

  orderedIds.forEach((id, idx) => {
    const item = globalMicroJobs.find((j) => j.id === id);
    if (item) item.displayOrder = idx + 1;
  });

  logAdminAction(adminId, 'Reordered Micro Jobs', 'micro_jobs', 'ALL_JOBS', 'Micro Jobs Display Order', 'Updated micro jobs sequence.');
  res.json({ success: true, microJobs: globalMicroJobs });
});

// DELETE /api/admin/micro-jobs/:id
app.delete('/api/admin/micro-jobs/:id', (req, res) => {
  const { id } = req.params;
  const adminId = (req.query.adminId as string) || 'ADMIN_USER';
  const jobIndex = globalMicroJobs.findIndex((j) => j.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Micro job not found.' });
  }

  const removed = globalMicroJobs[jobIndex];
  removed.archived = true;
  removed.status = 'inactive';

  logAdminAction(adminId, 'Deleted/Archived Micro Job', 'micro_jobs', removed.id, removed.titleEn, `Removed micro job from active list.`);
  res.json({ success: true, message: 'Micro job archived/deleted successfully.' });
});

// ==========================================
// ADMIN CHANNEL TASKS ENDPOINTS
// ==========================================

// GET /api/admin/channel-tasks
app.get('/api/admin/channel-tasks', (req, res) => {
  const { q, status } = req.query as { q?: string; status?: string };
  let results = [...globalChannelTasks];

  if (status && status !== 'all') {
    if (status === 'archived') {
      results = results.filter((t) => t.archived);
    } else {
      results = results.filter((t) => !t.archived && t.status === status);
    }
  } else {
    results = results.filter((t) => !t.archived);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase();
    results = results.filter(
      (t) =>
        t.titleEn.toLowerCase().includes(query) ||
        t.titleBn.toLowerCase().includes(query) ||
        t.channelName.toLowerCase().includes(query) ||
        t.channelHandle.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
    );
  }

  results.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  res.json({ channelTasks: results, total: results.length });
});

// POST /api/admin/channel-tasks
app.post('/api/admin/channel-tasks', (req, res) => {
  const {
    titleEn,
    titleBn,
    category,
    descriptionEn,
    descriptionBn,
    channelName,
    channelHandle,
    actionUrl,
    taskType,
    rewardBdt,
    rewardCoins,
    estimatedTime,
    totalSlots,
    slotsLeft,
    verificationType,
    status,
    displayOrder,
    adminId,
  } = req.body;

  const effectiveChannelName = (channelName || titleEn || titleBn || 'Telegram Channel').trim();
  const effectiveTitleEn = (titleEn || titleBn || `Join ${effectiveChannelName}`).trim();
  const effectiveTitleBn = (titleBn || titleEn || `${effectiveChannelName} চ্যানেলে জয়েন করুন`).trim();

  const id = `ch_${Date.now().toString().slice(-4)}`;
  const finalRewardBdt = Math.max(0.5, Number(rewardBdt) || 4.0);
  const finalRewardCoins = Math.max(50, Number(rewardCoins) || Math.round(finalRewardBdt * 100));
  const finalTotalSlots = Math.max(1, Number(totalSlots) || 500);
  const finalSlotsLeft = slotsLeft !== undefined ? Math.max(0, Number(slotsLeft)) : finalTotalSlots;
  const nextOrder = Number(displayOrder) || (globalChannelTasks.length > 0 ? Math.max(...globalChannelTasks.map((t) => t.displayOrder || 0)) + 1 : 1);
  const resolvedCategory = (category === 'group_join' || taskType === 'Join Group') ? 'group_join' : 'channel_join';

  const cleanHandle = (channelHandle || `@${effectiveChannelName.replace(/[^a-zA-Z0-9_]/g, '')}`).trim();
  const effectiveHandle = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;
  const effectiveActionUrl = actionUrl && actionUrl.trim().length > 5 ? actionUrl.trim() : `https://t.me/${effectiveHandle.replace('@', '')}`;

  const isGroup = resolvedCategory === 'group_join';
  const effectiveDescEn = (descriptionEn || descriptionBn || `Join ${effectiveChannelName} on Telegram to receive verified cash reward.`).trim();
  const effectiveDescBn = (descriptionBn || descriptionEn || `${effectiveChannelName} টেলিগ্রাম ${isGroup ? 'গ্রুপে' : 'চ্যানেলে'} যুক্ত হয়ে ক্যাশ পুরষ্কার পান।`).trim();

  const newTask = {
    id,
    titleEn: effectiveTitleEn,
    titleBn: effectiveTitleBn,
    category: resolvedCategory,
    channelName: effectiveChannelName,
    channelHandle: effectiveHandle,
    channelAvatar: isGroup
      ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100'
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
    taskType: taskType || (isGroup ? 'Join Group' : 'Join Channel'),
    rewardBdt: finalRewardBdt,
    rewardCoins: finalRewardCoins,
    estimatedTime: estimatedTime || '15s',
    totalSlots: finalTotalSlots,
    slotsLeft: finalSlotsLeft,
    status: status || 'available',
    instructionsEn: isGroup
      ? ['Click Join button', 'Open Telegram Group', 'Press Join Chat', 'Return and click Verify']
      : ['Click Join button', 'Open Telegram Channel', 'Press Join Channel', 'Return and click Verify'],
    instructionsBn: isGroup
      ? ['জয়েন বাটনে ক্লিক করুন', 'টেলিগ্রাম গ্রুপে যুক্ত হোন', 'ভেরিফাই প্রেস করুন']
      : ['জয়েন বাটনে ক্লিক করুন', 'টেলিগ্রাম চ্যানেলে যুক্ত হোন', 'ভেরিফাই প্রেস করুন'],
    verificationType: verificationType || 'bot_api',
    actionUrl: effectiveActionUrl,
    descriptionEn: effectiveDescEn,
    descriptionBn: effectiveDescBn,
    displayOrder: nextOrder,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    archived: false,
  };

  globalChannelTasks.push(newTask);
  logAdminAction(adminId, 'Created Channel Task', 'channel_tasks', newTask.id, newTask.titleEn, `Added task for ${newTask.channelName} (${isGroup ? 'Group Join' : 'Channel Join'}) with Reward ৳${newTask.rewardBdt}, Slots: ${newTask.slotsLeft}/${newTask.totalSlots}.`);

  res.status(201).json({ success: true, channelTask: newTask });
});

// PUT /api/admin/channel-tasks/:id
app.put('/api/admin/channel-tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = globalChannelTasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Channel task not found.' });
  }

  const existing = globalChannelTasks[taskIndex];
  const {
    titleEn,
    titleBn,
    category,
    descriptionEn,
    descriptionBn,
    channelName,
    channelHandle,
    actionUrl,
    taskType,
    rewardBdt,
    rewardCoins,
    estimatedTime,
    totalSlots,
    slotsLeft,
    verificationType,
    status,
    displayOrder,
    adminId,
  } = req.body;

  const finalRewardBdt = rewardBdt !== undefined ? Math.max(0.5, Number(rewardBdt)) : existing.rewardBdt;
  const finalRewardCoins = rewardCoins !== undefined ? Math.max(50, Number(rewardCoins)) : (rewardBdt !== undefined ? Math.round(finalRewardBdt * 100) : existing.rewardCoins);
  const resolvedCategory = category !== undefined ? category : existing.category;
  const isGroup = resolvedCategory === 'group_join';

  const updatedTask = {
    ...existing,
    category: resolvedCategory,
    titleEn: titleEn !== undefined ? titleEn.trim() : (titleBn !== undefined ? titleBn.trim() : existing.titleEn),
    titleBn: titleBn !== undefined ? titleBn.trim() : (titleEn !== undefined ? titleEn.trim() : existing.titleBn),
    descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
    descriptionBn: descriptionBn !== undefined ? descriptionBn : existing.descriptionBn,
    channelName: channelName !== undefined ? channelName.trim() : existing.channelName,
    channelHandle: channelHandle !== undefined ? (channelHandle.startsWith('@') ? channelHandle.trim() : `@${channelHandle.trim()}`) : existing.channelHandle,
    actionUrl: actionUrl !== undefined ? actionUrl.trim() : existing.actionUrl,
    taskType: taskType !== undefined ? taskType : (isGroup ? 'Join Group' : 'Join Channel'),
    rewardBdt: finalRewardBdt,
    rewardCoins: finalRewardCoins,
    estimatedTime: estimatedTime !== undefined ? estimatedTime : existing.estimatedTime,
    totalSlots: totalSlots !== undefined ? Number(totalSlots) : existing.totalSlots,
    slotsLeft: slotsLeft !== undefined ? Number(slotsLeft) : (totalSlots !== undefined ? Number(totalSlots) : existing.slotsLeft),
    verificationType: verificationType !== undefined ? verificationType : existing.verificationType,
    status: status !== undefined ? status : existing.status,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalChannelTasks[taskIndex] = updatedTask;
  logAdminAction(adminId, 'Updated Channel Task', 'channel_tasks', updatedTask.id, updatedTask.titleEn, `Updated task for ${updatedTask.channelName} (${isGroup ? 'Group Join' : 'Channel Join'}). Reward: ৳${updatedTask.rewardBdt}, Slots: ${updatedTask.slotsLeft}/${updatedTask.totalSlots}.`);

  res.json({ success: true, channelTask: updatedTask });
});

// PATCH /api/admin/channel-tasks/:id/status
app.patch('/api/admin/channel-tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, archived, adminId } = req.body;
  const task = globalChannelTasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Channel task not found.' });
  }

  const oldStatus = task.status;
  if (archived !== undefined) task.archived = Boolean(archived);
  if (status) task.status = status;
  task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(adminId, archived ? 'Archived Channel Task' : 'Toggled Channel Task Status', 'channel_tasks', task.id, task.titleEn, `Status changed from ${oldStatus} to ${task.status}.`);
  res.json({ success: true, channelTask: task });
});

// PATCH /api/admin/channel-tasks/reorder
app.patch('/api/admin/channel-tasks/reorder', (req, res) => {
  const { orderedIds, adminId } = req.body as { orderedIds: string[]; adminId?: string };
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array required.' });
  }

  orderedIds.forEach((id, idx) => {
    const item = globalChannelTasks.find((t) => t.id === id);
    if (item) item.displayOrder = idx + 1;
  });

  logAdminAction(adminId, 'Reordered Channel Tasks', 'channel_tasks', 'ALL_TASKS', 'Channel Tasks Order', 'Updated channel tasks sequence.');
  res.json({ success: true, channelTasks: globalChannelTasks });
});

// DELETE /api/admin/channel-tasks/:id
app.delete('/api/admin/channel-tasks/:id', (req, res) => {
  const { id } = req.params;
  const adminId = (req.query.adminId as string) || 'ADMIN_USER';
  const taskIndex = globalChannelTasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Channel task not found.' });
  }

  const removed = globalChannelTasks[taskIndex];
  removed.archived = true;
  removed.status = 'inactive';

  logAdminAction(adminId, 'Deleted/Archived Channel Task', 'channel_tasks', removed.id, removed.titleEn, `Removed channel task from active list.`);
  res.json({ success: true, message: 'Channel task deleted/archived successfully.' });
});

// ==========================================
// ADMIN AUDIT LOGS ENDPOINT
// ==========================================
app.get('/api/admin/audit-logs', (req, res) => {
  res.json({ auditLogs: globalAuditLogs });
});

// ==========================================
// REFERRAL SYSTEM ENDPOINTS (ADMIN & USER)
// ==========================================

// GET /api/admin/referral/data (Full live admin dataset)
app.get('/api/admin/referral/data', (req, res) => {
  res.json({
    config: globalReferralConfig,
    stats: calculateReferralStats(),
    referrals: globalReferrals,
  });
});

// POST /api/admin/referral/config (Update global commission and rules)
app.post('/api/admin/referral/config', (req, res) => {
  const {
    commissionAmountBdt,
    qualificationRule,
    commissionType,
    isActive,
    dailyLimitPerUser,
    monthlyLimitPerUser,
    adminId = 'ADMIN_USER',
  } = req.body;

  const oldConfig = { ...globalReferralConfig };

  if (commissionAmountBdt !== undefined) {
    const num = Number(commissionAmountBdt);
    if (isNaN(num) || num < 0) {
      return res.status(400).json({ error: 'Commission amount must be a positive number.' });
    }
    globalReferralConfig.commissionAmountBdt = Math.round(num * 100) / 100;
  }

  if (qualificationRule !== undefined) {
    if (!['first_task', 'first_ad', 'registration'].includes(qualificationRule)) {
      return res.status(400).json({ error: 'Invalid qualification rule.' });
    }
    globalReferralConfig.qualificationRule = qualificationRule;
  }

  if (commissionType !== undefined) {
    globalReferralConfig.commissionType = 'fixed';
  }

  if (isActive !== undefined) {
    globalReferralConfig.isActive = Boolean(isActive);
  }

  if (dailyLimitPerUser !== undefined) {
    globalReferralConfig.dailyLimitPerUser = Math.max(0, Number(dailyLimitPerUser) || 0);
  }

  if (monthlyLimitPerUser !== undefined) {
    globalReferralConfig.monthlyLimitPerUser = Math.max(0, Number(monthlyLimitPerUser) || 0);
  }

  globalReferralConfig.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  globalReferralConfig.updatedBy = adminId;

  logAdminAction(
    adminId,
    'Updated Referral Settings',
    'referral',
    'CONFIG_REFERRAL',
    'Referral Configuration',
    `Updated reward to ৳${globalReferralConfig.commissionAmountBdt}, Rule: ${globalReferralConfig.qualificationRule}, Status: ${globalReferralConfig.isActive ? 'Active' : 'Inactive'}`,
    JSON.stringify(oldConfig),
    JSON.stringify(globalReferralConfig)
  );

  res.json({
    success: true,
    message: 'Referral settings updated successfully ✓',
    config: globalReferralConfig,
    stats: calculateReferralStats(),
  });
});

// POST /api/admin/referral/update-status (Manual status moderation or manual qualification)
app.post('/api/admin/referral/update-status', (req, res) => {
  const { referralId, status, reason, adminId = 'ADMIN_USER' } = req.body;
  const ref = globalReferrals.find((r) => r.id === referralId);

  if (!ref) {
    return res.status(404).json({ error: 'Referral record not found.' });
  }

  const oldStatus = ref.status;

  if (status === 'qualified') {
    processReferralQualification(ref, `Admin manual qualification (${adminId})`);
  } else {
    ref.status = status;
    if (reason) ref.reason = reason;
  }

  logAdminAction(
    adminId,
    'Moderated Referral Status',
    'referral',
    ref.id,
    `Referral: ${ref.referredUsername}`,
    `Changed referral status from ${oldStatus} to ${ref.status}. Note: ${reason || 'N/A'}`
  );

  res.json({
    success: true,
    referral: ref,
    stats: calculateReferralStats(),
  });
});

// GET /api/admin/referral/search
app.get('/api/admin/referral/search', (req, res) => {
  const { q, status } = req.query as { q?: string; status?: string };
  let results = [...globalReferrals];

  if (status && status !== 'all') {
    results = results.filter((r) => r.status === status);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    results = results.filter(
      (r) =>
        r.id.toLowerCase().includes(query) ||
        r.referrerUsername.toLowerCase().includes(query) ||
        r.referrerUserId.toLowerCase().includes(query) ||
        r.referredUsername.toLowerCase().includes(query) ||
        r.referredUserId.toLowerCase().includes(query) ||
        r.referralCode.toLowerCase().includes(query)
    );
  }

  res.json({
    referrals: results,
    total: results.length,
  });
});

// GET /api/referral/config (Public config for user app)
app.get('/api/referral/config', (req, res) => {
  res.json({ config: globalReferralConfig });
});

// GET /api/referral/stats (Live platform stats)
app.get('/api/referral/stats', (req, res) => {
  res.json({ stats: calculateReferralStats() });
});

// GET /api/referral/my-referrals (Current user's referral network)
app.get('/api/referral/my-referrals', (req, res) => {
  const record = getOrCreateUser(req);
  const userReferrals = globalReferrals.filter((r) => r.referrerUserId === record.user.id);
  const qualified = userReferrals.filter((r) => r.status === 'qualified');
  const pending = userReferrals.filter((r) => r.status === 'pending');
  const totalEarned = qualified
    .filter((r) => r.commissionStatus === 'credited')
    .reduce((sum, r) => sum + (r.commissionAmountBdt || 0), 0);

  res.json({
    referrals: userReferrals,
    stats: {
      totalReferrals: userReferrals.length,
      qualifiedReferrals: qualified.length,
      pendingReferrals: pending.length,
      totalReferralEarnings: totalEarned,
      referralCode: record.user.referralCode,
    },
    config: globalReferralConfig,
  });
});

// POST /api/referral/attribute (Attribute referral code to new user)
app.post('/api/referral/attribute', (req, res) => {
  const { referralCode, referredUserId, referredUsername } = req.body;
  if (!referralCode || !referredUserId) {
    return res.status(400).json({ error: 'Referral code and user ID are required.' });
  }

  // Anti-self referral check
  const selfRecord = db[referredUserId];
  if (selfRecord && selfRecord.user.referralCode === referralCode) {
    return res.status(400).json({ error: 'You cannot use your own referral code.' });
  }

  // Anti-duplicate attribution check
  const alreadyAttributed = globalReferrals.some((r) => r.referredUserId === referredUserId);
  if (alreadyAttributed) {
    return res.status(400).json({ error: 'Referral attribution already registered for this user.' });
  }

  // Lookup referrer in memory DB or globalReferrals
  let targetReferrer = Object.values(db).find((u) => u.user.referralCode === referralCode);
  let referrerUserId = targetReferrer?.user.id || 'tg_primary_user';
  let referrerUsername = targetReferrer?.user.username ? `@${targetReferrer.user.username}` : '@hridoy_army';

  const cleanReferredUsername = referredUsername ? (referredUsername.startsWith('@') ? referredUsername : `@${referredUsername}`) : `@user_${referredUserId.slice(-4)}`;

  const newRef: ReferralDbRecord = {
    id: `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    referrerUserId,
    referrerUsername,
    referredUserId,
    referredUsername: cleanReferredUsername,
    referralCode,
    status: globalReferralConfig.qualificationRule === 'registration' ? 'qualified' : 'pending',
    commissionAmountBdt: globalReferralConfig.commissionAmountBdt,
    commissionStatus: globalReferralConfig.qualificationRule === 'registration' ? 'credited' : 'pending',
    qualificationRuleAtTime: globalReferralConfig.qualificationRule,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalReferrals.unshift(newRef);

  if (globalReferralConfig.qualificationRule === 'registration') {
    processReferralQualification(newRef, 'Instant Registration Qualification');
  }

  res.status(201).json({ success: true, referral: newRef, config: globalReferralConfig });
});

// GET full user bundle (with catalog sync)
app.get('/api/user/me', (req, res) => {
  const record = getOrCreateUser(req);
  syncUserWithCatalogs(record);
  updateAchievementsAndTier(record);
  res.json(record);
});

// POST Auth / Init
app.post('/api/user/auth', (req, res) => {
  const { userId, username, fullName, avatarUrl } = req.body;
  const targetId = userId || 'tg_primary_user';
  if (!db[targetId]) {
    createFreshUser(targetId, username, fullName, avatarUrl);
  } else {
    if (username) db[targetId].user.username = username;
    if (fullName) db[targetId].user.fullName = fullName;
    if (avatarUrl) db[targetId].user.avatarUrl = avatarUrl;
  }
  updateAchievementsAndTier(db[targetId]);
  res.json(db[targetId]);
});

// GET Daily Bonus Config (Public)
app.get('/api/daily-bonus/config', (req, res) => {
  res.json({ success: true, config: globalDailyBonusConfig });
});

// GET Daily Bonus Config (Admin)
app.get('/api/admin/daily-bonus', (req, res) => {
  res.json({ success: true, config: globalDailyBonusConfig });
});

// POST Update Daily Bonus Config (Admin)
app.post('/api/admin/daily-bonus', (req, res) => {
  const {
    day1RewardBdt,
    day2RewardBdt,
    day3RewardBdt,
    day4RewardBdt,
    day5RewardBdt,
    day6RewardBdt,
    day7RewardBdt,
    dailyLoginBonusAmount,
    adminId = 'ADMIN_SUPER_01',
  } = req.body;

  const oldConfig = { ...globalDailyBonusConfig };

  if (day1RewardBdt !== undefined) globalDailyBonusConfig.day1RewardBdt = Math.max(0.1, Number(day1RewardBdt) || 2.0);
  if (day2RewardBdt !== undefined) globalDailyBonusConfig.day2RewardBdt = Math.max(0.1, Number(day2RewardBdt) || 4.0);
  if (day3RewardBdt !== undefined) globalDailyBonusConfig.day3RewardBdt = Math.max(0.1, Number(day3RewardBdt) || 6.0);
  if (day4RewardBdt !== undefined) globalDailyBonusConfig.day4RewardBdt = Math.max(0.1, Number(day4RewardBdt) || 8.0);
  if (day5RewardBdt !== undefined) globalDailyBonusConfig.day5RewardBdt = Math.max(0.1, Number(day5RewardBdt) || 10.0);
  if (day6RewardBdt !== undefined) globalDailyBonusConfig.day6RewardBdt = Math.max(0.1, Number(day6RewardBdt) || 15.0);
  if (day7RewardBdt !== undefined) globalDailyBonusConfig.day7RewardBdt = Math.max(0.1, Number(day7RewardBdt) || 25.0);
  if (dailyLoginBonusAmount !== undefined) {
    globalDailyBonusConfig.dailyLoginBonusAmount = Math.max(0.1, Number(dailyLoginBonusAmount) || 2.0);
    if (day1RewardBdt === undefined) {
      globalDailyBonusConfig.day1RewardBdt = globalDailyBonusConfig.dailyLoginBonusAmount;
    }
  } else {
    globalDailyBonusConfig.dailyLoginBonusAmount = globalDailyBonusConfig.day1RewardBdt;
  }

  globalDailyBonusConfig.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  globalDailyBonusConfig.updatedBy = adminId;

  // Propagate to all existing active users for unclaimed bonus days
  Object.values(db).forEach((userRecord) => {
    if (userRecord.dailyBonus) {
      userRecord.dailyBonus.forEach((day) => {
        const key = `day${day.dayNumber}RewardBdt` as keyof GlobalDailyBonusConfig;
        if (typeof globalDailyBonusConfig[key] === 'number' && !day.isClaimed) {
          day.rewardBdt = globalDailyBonusConfig[key] as number;
          day.rewardCoins = Math.round(day.rewardBdt * 100);
        }
      });
    }
  });

  logAdminAction(
    adminId,
    'Updated Daily Bonus Settings',
    'general',
    'CONFIG_DAILY_BONUS',
    'Daily Bonus Configuration',
    `Updated 7-day bonuses: D1=৳${globalDailyBonusConfig.day1RewardBdt}, D2=৳${globalDailyBonusConfig.day2RewardBdt}, D3=৳${globalDailyBonusConfig.day3RewardBdt}, D4=৳${globalDailyBonusConfig.day4RewardBdt}, D5=৳${globalDailyBonusConfig.day5RewardBdt}, D6=৳${globalDailyBonusConfig.day6RewardBdt}, D7=৳${globalDailyBonusConfig.day7RewardBdt}`,
    JSON.stringify(oldConfig),
    JSON.stringify(globalDailyBonusConfig)
  );

  res.json({
    success: true,
    message: 'Daily bonus configuration updated successfully ✓',
    config: globalDailyBonusConfig,
  });
});

// POST Claim Daily Bonus
app.post('/api/bonus/claim', (req, res) => {
  const record = getOrCreateUser(req);
  const { dayNumber } = req.body;
  const bonusDay = record.dailyBonus.find((d) => d.dayNumber === dayNumber);

  if (!bonusDay) {
    return res.status(400).json({ error: 'Invalid bonus day' });
  }
  if (bonusDay.isClaimed) {
    return res.status(400).json({ error: 'Day already claimed' });
  }

  bonusDay.isClaimed = true;
  bonusDay.isCurrentDay = false;
  const nextDay = record.dailyBonus.find((d) => d.dayNumber === dayNumber + 1);
  if (nextDay) nextDay.isCurrentDay = true;

  record.user.bdtBalance += bonusDay.rewardBdt;
  record.user.todayEarnedBdt += bonusDay.rewardBdt;
  record.user.coins += bonusDay.rewardCoins;
  record.user.streakDays = dayNumber;
  record.user.lastCheckinDate = new Date().toISOString().split('T')[0];

  const tx = {
    id: `tx_${Date.now()}`,
    type: 'bonus',
    title: `Day ${dayNumber} Daily Bonus`,
    amountBdt: bonusDay.rewardBdt,
    coins: bonusDay.rewardCoins,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, dailyBonus: record.dailyBonus, transaction: tx });
});

// POST Complete Ad Reward
app.post('/api/ads/reward', (req, res) => {
  const record = getOrCreateUser(req);
  const { providerId } = req.body;
  const provider = record.adProviders.find((p) => p.id === providerId);

  if (!provider) {
    return res.status(400).json({ error: 'Ad provider not found or inactive.' });
  }

  if (provider.completedToday >= provider.dailyLimit) {
    return res.status(400).json({ error: 'Daily watch limit reached for this ad provider.' });
  }

  // Get canonical reward from server catalog and apply user tier progressive bonus
  const canonical = globalAds.find((a) => a.id === providerId) || provider;
  const baseRewardBdt = canonical.rewardBdt;
  const baseRewardCoins = canonical.rewardCoins;
  const rewardCalc = calculateRewardWithTierBonus(baseRewardBdt, baseRewardCoins, record.user.vipTier);
  const rewardBdt = rewardCalc.finalBdt;
  const rewardCoins = rewardCalc.finalCoins;

  provider.completedToday += 1;
  provider.lastWatchedTimestamp = Date.now();
  record.user.completedAds += 1;
  record.user.bdtBalance = Number((record.user.bdtBalance + rewardBdt).toFixed(2));
  record.user.todayEarnedBdt = Number((record.user.todayEarnedBdt + rewardBdt).toFixed(2));
  record.user.coins += rewardCoins;

  const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${record.user.vipTier} Boost)` : '';
  const tx = {
    id: `tx_${Date.now()}`,
    type: 'ad',
    title: `${provider.name} Reward${bonusTag}`,
    amountBdt: rewardBdt,
    coins: rewardCoins,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  // Check and process referral qualification for this user
  checkUserReferralQualification(record.user.id, 'ad');

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, adProviders: record.adProviders, transaction: tx, tierBonus: rewardCalc });
});

// POST Submit Micro Job Proof (Strictly 1 task completion per user)
app.post('/api/micro-jobs/submit', (req, res) => {
  const record = getOrCreateUser(req);
  const { jobId, proofText } = req.body;
  if (!record.completedMicroJobIds) record.completedMicroJobIds = [];

  const job = record.microJobs.find((j) => j.id === jobId);

  if (!job) {
    return res.status(400).json({ error: 'Micro job not found.' });
  }

  if (record.completedMicroJobIds.includes(jobId) || job.status === 'completed') {
    if (!record.completedMicroJobIds.includes(jobId)) {
      record.completedMicroJobIds.push(jobId);
    }
    return res.status(400).json({ error: 'এই কাজটি আপনি ইতিমধ্যেই সম্পন্ন করেছেন! একটি মাইক্রো জব শুধুমাত্র একবারই করা যাবে।' });
  }

  // Record permanent completion for this user
  record.completedMicroJobIds.push(jobId);

  // Get canonical reward from server catalog and apply user tier progressive bonus
  const canonical = globalMicroJobs.find((j) => j.id === jobId) || job;
  const baseRewardBdt = canonical.rewardBdt;
  const baseRewardCoins = canonical.rewardCoins;
  const rewardCalc = calculateRewardWithTierBonus(baseRewardBdt, baseRewardCoins, record.user.vipTier);
  const rewardBdt = rewardCalc.finalBdt;
  const rewardCoins = rewardCalc.finalCoins;

  job.remainingSlots = Math.max(0, (job.remainingSlots || job.slotsLeft || 1) - 1);
  job.status = 'completed';
  job.submittedProof = proofText || 'Verified submission';
  job.submittedAt = new Date().toISOString();

  // Also decrement canonical remaining slots
  if (canonical.slotsLeft !== undefined) {
    canonical.slotsLeft = Math.max(0, canonical.slotsLeft - 1);
  }

  record.user.completedMicroJobs += 1;
  record.user.bdtBalance = Number((record.user.bdtBalance + rewardBdt).toFixed(2));
  record.user.todayEarnedBdt = Number((record.user.todayEarnedBdt + rewardBdt).toFixed(2));
  record.user.coins += rewardCoins;

  const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${record.user.vipTier} Boost)` : '';
  const tx = {
    id: `tx_${Date.now()}`,
    type: 'task',
    title: `Micro Job: ${canonical.titleEn}${bonusTag}`,
    amountBdt: rewardBdt,
    coins: rewardCoins,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  // Check and process referral qualification for this user
  checkUserReferralQualification(record.user.id, 'task');

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, microJobs: record.microJobs, transaction: tx, tierBonus: rewardCalc });
});

// POST Verify Channel Task (Strictly 1 completion per user)
app.post('/api/channel-tasks/verify', (req, res) => {
  const record = getOrCreateUser(req);
  const { taskId } = req.body;
  if (!record.completedChannelTaskIds) record.completedChannelTaskIds = [];

  const task = record.channelTasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(400).json({ error: 'Channel task not found.' });
  }

  if (record.completedChannelTaskIds.includes(taskId) || task.isJoined || task.status === 'completed') {
    if (!record.completedChannelTaskIds.includes(taskId)) {
      record.completedChannelTaskIds.push(taskId);
    }
    return res.status(400).json({ error: 'আপনি ইতিমধ্যেই এই চ্যানেল টাস্কটি সম্পন্ন করে রিওয়ার্ড ক্লেইম করেছেন! এটি শুধুমাত্র একবারই করা যাবে।' });
  }

  // Record permanent completion for this user
  record.completedChannelTaskIds.push(taskId);

  // Get canonical reward from server catalog and apply user tier progressive bonus
  const canonical = globalChannelTasks.find((t) => t.id === taskId) || task;
  const baseRewardBdt = canonical.rewardBdt;
  const baseRewardCoins = canonical.rewardCoins;
  const rewardCalc = calculateRewardWithTierBonus(baseRewardBdt, baseRewardCoins, record.user.vipTier);
  const rewardBdt = rewardCalc.finalBdt;
  const rewardCoins = rewardCalc.finalCoins;

  task.isJoined = true;
  task.status = 'completed';
  task.joinedAt = new Date().toISOString();

  if (canonical.slotsLeft !== undefined) {
    canonical.slotsLeft = Math.max(0, canonical.slotsLeft - 1);
  }

  record.user.completedChannelTasks += 1;
  record.user.bdtBalance = Number((record.user.bdtBalance + rewardBdt).toFixed(2));
  record.user.todayEarnedBdt = Number((record.user.todayEarnedBdt + rewardBdt).toFixed(2));
  record.user.coins += rewardCoins;

  const bonusTag = rewardCalc.hasBonus ? ` (+${rewardCalc.bonusPercent}% ${record.user.vipTier} Boost)` : '';
  const tx = {
    id: `tx_${Date.now()}`,
    type: 'task',
    title: `Joined ${canonical.channelName}${bonusTag}`,
    amountBdt: rewardBdt,
    coins: rewardCoins,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  // Check and process referral qualification for this user
  checkUserReferralQualification(record.user.id, 'task');

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, channelTasks: record.channelTasks, transaction: tx, tierBonus: rewardCalc });
});

// GET /api/leaderboard (Dynamic calculated Top 100 Leaderboard)
app.get('/api/leaderboard', (req, res) => {
  const period = (req.query.period as any) || 'today';
  const record = getOrCreateUser(req);
  const top100 = getTop100Leaderboard(period, {
    username: record.user.username,
    fullName: record.user.fullName,
    avatarUrl: record.user.avatarUrl,
    bdtBalance: record.user.bdtBalance,
    totalReferrals: record.user.totalReferrals,
    totalAdsWatched: record.user.completedAds,
  });
  res.json({ success: true, period, leaderboard: top100 });
});

// Public endpoint: Dynamic wallet configuration for User App
app.get('/api/wallet/config', (req, res) => {
  const activeMethods = globalPaymentMethods
    .filter((m) => !m.isArchived && m.status === 'active')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  res.json({
    settings: globalWithdrawalSettings,
    requirements: globalWithdrawalRequirements,
    paymentMethods: activeMethods,
  });
});

// POST Request Withdrawal (Live DB + Dynamic Settings & Requirements Enforcement)
app.post('/api/withdrawals/request', (req, res) => {
  const record = getOrCreateUser(req);
  const { method, accountNumber, amountBdt } = req.body;
  const amount = Number(amountBdt);

  // 1. Maintenance / Global switch check
  if (!globalWithdrawalSettings.isWithdrawalEnabled) {
    return res.status(503).json({
      error: globalWithdrawalSettings.maintenanceNotice || 'উইথড্র সেবা বর্তমানে সিস্টেম মেইন্টেন্যান্সের জন্য বন্ধ রয়েছে। কিছুক্ষণের মধ্যে পুনরায় চেষ্টা করুন। (Withdrawals are temporarily paused for maintenance).'
    });
  }

  // 2. Minimum & Maximum limits check
  if (!amount || isNaN(amount) || amount < globalWithdrawalSettings.minWithdrawBdt) {
    return res.status(400).json({
      error: `সর্বনিম্ন উত্তোলন ৳${globalWithdrawalSettings.minWithdrawBdt}.০০ টাকা (Minimum cashout is ৳${globalWithdrawalSettings.minWithdrawBdt} BDT).`
    });
  }

  if (amount > globalWithdrawalSettings.maxWithdrawBdt) {
    return res.status(400).json({
      error: `সর্বোচ্চ এককালীন উত্তোলন ৳${globalWithdrawalSettings.maxWithdrawBdt}.০০ টাকা (Maximum cashout is ৳${globalWithdrawalSettings.maxWithdrawBdt} BDT).`
    });
  }

  // 3. Payment Method active validation
  const matchedMethod = globalPaymentMethods.find(
    (m) => !m.isArchived && m.status === 'active' && (m.name.toLowerCase() === (method || '').toLowerCase() || m.id === method)
  );

  if (!matchedMethod) {
    return res.status(400).json({
      error: `${method || 'Selected'} পেমেন্ট মাধ্যমটি বর্তমানে নিষ্ক্রিয় রয়েছে। অনুগ্রহ করে অন্য মাধ্যম নির্বাচন করুন।`
    });
  }

  // 4. Account Number validation (Bangladesh 11/12 digits)
  const cleanAccount = String(accountNumber || '').trim();
  if (!/^01[3-9]\d{8,9}$/.test(cleanAccount)) {
    return res.status(400).json({
      error: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)।'
    });
  }

  // 5. Balance check
  if (record.user.bdtBalance < amount) {
    return res.status(400).json({
      error: `পর্যাপ্ত ব্যালেন্স নেই। আপনার বর্তমান ব্যালেন্স ৳${record.user.bdtBalance.toFixed(2)} BDT।`
    });
  }

  // 6. Requirements checks
  // Qualified referrals requirement
  if (globalWithdrawalRequirements.minQualifiedReferrals > 0) {
    const userQualifiedRefs = globalReferrals.filter(
      (r) => r.referrerUserId === record.user.id && r.status === 'qualified'
    ).length;
    const effectiveQualified = Math.max(userQualifiedRefs, record.user.totalReferrals || 0);

    if (effectiveQualified < globalWithdrawalRequirements.minQualifiedReferrals) {
      const needed = globalWithdrawalRequirements.minQualifiedReferrals - effectiveQualified;
      return res.status(400).json({
        error: `উইথড্র করার জন্য আপনার অন্তত ${globalWithdrawalRequirements.minQualifiedReferrals}টি ভেরিফাইড রেফার প্রয়োজন (বর্তমানে আপনার রয়েছে ${effectiveQualified}/${globalWithdrawalRequirements.minQualifiedReferrals})। আরও ${needed}টি ভেরিফাইড রেফার করুন।`
      });
    }
  }

  // Minimum ads watched requirement
  if (globalWithdrawalRequirements.minVerifiedAds > 0) {
    if ((record.user.completedAds || 0) < globalWithdrawalRequirements.minVerifiedAds) {
      return res.status(400).json({
        error: `উইথড্র আনলক করতে অন্তত ${globalWithdrawalRequirements.minVerifiedAds}টি বিজ্ঞাপন দেখতে হবে (বর্তমানে সম্পন্ন: ${record.user.completedAds || 0}/${globalWithdrawalRequirements.minVerifiedAds})।`
      });
    }
  }

  // Minimum micro jobs requirement
  if (globalWithdrawalRequirements.minCompletedMicroJobs > 0) {
    if ((record.user.completedMicroJobs || 0) < globalWithdrawalRequirements.minCompletedMicroJobs) {
      return res.status(400).json({
        error: `উইথড্র করার আগে অন্তত ${globalWithdrawalRequirements.minCompletedMicroJobs}টি মাইক্রো জব সম্পন্ন করুন (বর্তমানে সম্পন্ন: ${record.user.completedMicroJobs || 0})।`
      });
    }
  }

  // Calculate fee
  let feeBdt = 0;
  if (globalWithdrawalSettings.feeType === 'fixed') {
    feeBdt = globalWithdrawalSettings.feeValue;
  } else if (globalWithdrawalSettings.feeType === 'percentage') {
    feeBdt = Math.round((amount * globalWithdrawalSettings.feeValue) / 100 * 100) / 100;
  }
  const netAmountBdt = Math.max(0, amount - feeBdt);

  // Atomically Deduct Balance
  record.user.bdtBalance = Number((record.user.bdtBalance - amount).toFixed(2));
  record.user.totalCashoutBdt = Number(((record.user.totalCashoutBdt || 0) + amount).toFixed(2));

  const masked = cleanAccount.length >= 11 ? `${cleanAccount.slice(0, 3)}******${cleanAccount.slice(-2)}` : cleanAccount;
  const recordId = `wd_${Date.now()}`;
  const nowFormatted = new Date().toLocaleString('en-US', { hour12: true });

  const withdrawal = {
    id: recordId,
    userId: record.user.id,
    username: record.user.username ? (record.user.username.startsWith('@') ? record.user.username : `@${record.user.username}`) : `@user_${record.user.id.slice(-4)}`,
    fullName: record.user.fullName || 'Telegram Earner',
    telegramId: record.user.telegramId || record.user.id,
    method: matchedMethod.name,
    accountNumber: cleanAccount,
    maskedAccount: masked,
    amountBdt: amount,
    feeBdt,
    netAmountBdt,
    status: 'pending',
    verificationStatus: 'unverified',
    requestedAt: nowFormatted,
    userBalanceAtRequest: record.user.bdtBalance,
    userTotalReferralsAtRequest: record.user.totalReferrals || 0,
    userQualifiedReferralsAtRequest: globalReferrals.filter((r) => r.referrerUserId === record.user.id && r.status === 'qualified').length,
  };

  record.withdrawalRecords.unshift(withdrawal);
  globalWithdrawals.unshift(withdrawal);

  const tx = {
    id: `tx_${Date.now()}`,
    type: 'withdraw',
    title: `${matchedMethod.name} Cashout Request`,
    amountBdt: amount,
    paymentMethod: matchedMethod.name,
    accountNumber: masked,
    status: 'pending',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  const notif = {
    id: `notif_${Date.now()}`,
    title: '💸 Cashout Request Submitted',
    message: `Your withdrawal of ৳${amount.toFixed(2)} via ${matchedMethod.name} (${masked}) is now under admin verification.`,
    timestamp: 'Just now',
    read: false,
    type: 'cashout',
  };
  record.notifications.unshift(notif);
  record.user.unreadNotificationsCount = (record.user.unreadNotificationsCount || 0) + 1;

  logAdminAction(
    'SYSTEM',
    'User Requested Withdrawal',
    'wallet',
    withdrawal.id,
    `Withdrawal: ${withdrawal.username}`,
    `User submitted ৳${withdrawal.amountBdt} cashout via ${withdrawal.method} (${withdrawal.maskedAccount}).`
  );

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, withdrawal, transaction: tx });
});

// POST Cancel Pending Withdrawal (User Refund)
app.post('/api/withdrawals/cancel', (req, res) => {
  const record = getOrCreateUser(req);
  const { withdrawalId } = req.body;
  const item = record.withdrawalRecords.find((w) => w.id === withdrawalId && (w.status === 'pending' || w.status === 'verified'));

  if (!item) {
    return res.status(400).json({ error: 'Active withdrawal not found or cannot be cancelled.' });
  }

  item.status = 'cancelled';
  item.failureReason = 'Cancelled by user request';
  record.user.bdtBalance = Number((record.user.bdtBalance + item.amountBdt).toFixed(2));
  record.user.totalCashoutBdt = Math.max(0, Number(((record.user.totalCashoutBdt || 0) - item.amountBdt).toFixed(2)));

  const globalItem = globalWithdrawals.find((w) => w.id === withdrawalId);
  if (globalItem) {
    globalItem.status = 'cancelled';
    globalItem.rejectionReason = 'Cancelled by user request';
  }

  const tx = {
    id: `tx_${Date.now()}`,
    type: 'bonus',
    title: `Refund: Cancelled ${item.method} Cashout`,
    amountBdt: item.amountBdt,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  logAdminAction(
    'USER',
    'Cancelled Withdrawal',
    'wallet',
    item.id,
    `Withdrawal: ${item.id}`,
    `User cancelled withdrawal of ৳${item.amountBdt} via ${item.method}. Balance restored.`
  );

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, withdrawalRecords: record.withdrawalRecords });
});

// POST Claim Milestone Achievement
app.post('/api/achievements/claim', (req, res) => {
  const record = getOrCreateUser(req);
  const { achievementId } = req.body;
  const ach = record.achievements.find((a) => a.id === achievementId);

  if (!ach) {
    return res.status(400).json({ error: 'Achievement not found' });
  }
  if (!ach.unlocked || ach.claimed) {
    return res.status(400).json({ error: 'Achievement not ready or already claimed' });
  }

  ach.claimed = true;
  record.user.bdtBalance = Number((record.user.bdtBalance + ach.rewardBdt).toFixed(2));
  record.user.todayEarnedBdt = Number((record.user.todayEarnedBdt + ach.rewardBdt).toFixed(2));

  const tx = {
    id: `tx_${Date.now()}`,
    type: 'bonus',
    title: `Milestone Claimed: ${ach.titleEn}`,
    amountBdt: ach.rewardBdt,
    status: 'completed',
    timestamp: 'Just now',
  };
  record.transactions.unshift(tx);

  updateAchievementsAndTier(record);
  res.json({ success: true, user: record.user, achievements: record.achievements, transaction: tx });
});

// POST Save Payment Method
app.post('/api/payment-methods', (req, res) => {
  const record = getOrCreateUser(req);
  const { method, accountNumber, isDefault } = req.body;

  if (!/^01[3-9]\d{8,9}$/.test(accountNumber)) {
    return res.status(400).json({ error: 'Invalid 11-digit mobile number' });
  }

  const masked = accountNumber.slice(0, 3) + '******' + accountNumber.slice(-2);
  const newMethod = {
    id: `pm_${Date.now()}`,
    method,
    accountNumber,
    maskedAccount: masked,
    isDefault: !!isDefault || record.savedPaymentMethods.length === 0,
  };

  if (newMethod.isDefault) {
    record.savedPaymentMethods.forEach((m) => (m.isDefault = false));
  }

  record.savedPaymentMethods.push(newMethod);
  res.json({ success: true, savedPaymentMethods: record.savedPaymentMethods });
});

// DELETE Payment Method
app.delete('/api/payment-methods/:id', (req, res) => {
  const record = getOrCreateUser(req);
  const { id } = req.params;
  record.savedPaymentMethods = record.savedPaymentMethods.filter((m) => m.id !== id);
  res.json({ success: true, savedPaymentMethods: record.savedPaymentMethods });
});

// ==========================================
// ADMIN WALLET MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/admin/wallet/overview (Live database analytics)
app.get('/api/admin/wallet/overview', (req, res) => {
  res.json({
    stats: calculateWalletOverviewStats(),
    settings: globalWithdrawalSettings,
    requirements: globalWithdrawalRequirements,
    paymentMethods: globalPaymentMethods,
  });
});

// GET /api/admin/wallet/withdrawals (Filterable, searchable live requests list)
app.get('/api/admin/wallet/withdrawals', (req, res) => {
  const { status, method, q, page = '1', limit = '50' } = req.query as {
    status?: string;
    method?: string;
    q?: string;
    page?: string;
    limit?: string;
  };

  let results = [...globalWithdrawals];

  if (status && status !== 'all') {
    results = results.filter((w) => w.status === status);
  }

  if (method && method !== 'all') {
    results = results.filter((w) => (w.method || '').toLowerCase() === method.toLowerCase());
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    results = results.filter(
      (w) =>
        (w.id && w.id.toLowerCase().includes(query)) ||
        (w.userId && w.userId.toLowerCase().includes(query)) ||
        (w.username && w.username.toLowerCase().includes(query)) ||
        (w.fullName && w.fullName.toLowerCase().includes(query)) ||
        (w.accountNumber && w.accountNumber.includes(query)) ||
        (w.paymentReference && w.paymentReference.toLowerCase().includes(query))
    );
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const total = results.length;
  const paginated = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    withdrawals: paginated,
    total,
    page: pageNum,
    limit: limitNum,
    stats: calculateWalletOverviewStats(),
  });
});

// GET /api/admin/wallet/withdrawals/:id (Deep single withdrawal detail)
app.get('/api/admin/wallet/withdrawals/:id', (req, res) => {
  const { id } = req.params;
  const wd = globalWithdrawals.find((w) => w.id === id);

  if (!wd) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  const userRecord = db[wd.userId];
  const user = userRecord?.user || {
    id: wd.userId,
    username: wd.username,
    fullName: wd.fullName,
    bdtBalance: wd.userBalanceAtRequest || 0,
    totalCashoutBdt: 0,
    totalReferrals: wd.userTotalReferralsAtRequest || 0,
    completedAds: 8,
    completedMicroJobs: 2,
  };

  const qualifiedRefs = globalReferrals.filter((r) => r.referrerUserId === wd.userId && r.status === 'qualified').length;

  res.json({
    withdrawal: wd,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      telegramId: user.telegramId || user.id,
      avatarUrl: user.avatarUrl,
      bdtBalance: user.bdtBalance,
      totalCashoutBdt: user.totalCashoutBdt,
      totalReferrals: user.totalReferrals || 0,
      qualifiedReferrals: qualifiedRefs,
      completedAds: user.completedAds || 0,
      completedMicroJobs: user.completedMicroJobs || 0,
    },
    compliance: {
      meetsMinBalance: user.bdtBalance >= 0,
      meetsReferrals: (user.totalReferrals || 0) >= globalWithdrawalRequirements.minQualifiedReferrals,
      meetsAds: (user.completedAds || 0) >= globalWithdrawalRequirements.minVerifiedAds,
      meetsJobs: (user.completedMicroJobs || 0) >= globalWithdrawalRequirements.minCompletedMicroJobs,
    },
    recentTransactions: userRecord?.transactions?.slice(0, 10) || [],
  });
});

// POST /api/admin/wallet/withdrawals/:id/verify (Admin verifies eligibility & account)
app.post('/api/admin/wallet/withdrawals/:id/verify', (req, res) => {
  const { id } = req.params;
  const { adminId = 'ADMIN_FINANCE_01', notes } = req.body;
  const wd = globalWithdrawals.find((w) => w.id === id);

  if (!wd) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  if (wd.status !== 'pending') {
    return res.status(400).json({ error: `Cannot verify request with current status: ${wd.status}` });
  }

  wd.status = 'verified';
  wd.verificationStatus = 'passed';
  wd.verifiedBy = adminId;
  wd.verifiedAt = new Date().toLocaleString('en-US', { hour12: true });
  if (notes) wd.adminNotes = notes;

  // Sync with user's db if present
  const userRecord = db[wd.userId];
  if (userRecord) {
    const userWd = userRecord.withdrawalRecords.find((w) => w.id === id);
    if (userWd) {
      userWd.status = 'verified';
      userWd.verificationStatus = 'passed';
      userWd.verifiedBy = adminId;
      userWd.verifiedAt = wd.verifiedAt;
      if (notes) userWd.adminNotes = notes;
    }
  }

  logAdminAction(
    adminId,
    'Verified Withdrawal Request',
    'wallet',
    wd.id,
    `Withdrawal: ${wd.username}`,
    `Marked withdrawal #${wd.id} of ৳${wd.amountBdt} as Verified. Account ${wd.maskedAccount} checked.`
  );

  res.json({
    success: true,
    message: 'Withdrawal successfully verified. Ready for payout processing.',
    withdrawal: wd,
    stats: calculateWalletOverviewStats(),
  });
});

// POST /api/admin/wallet/withdrawals/:id/process (Initiates payout processing)
app.post('/api/admin/wallet/withdrawals/:id/process', (req, res) => {
  const { id } = req.params;
  const { adminId = 'ADMIN_PAYOUT_01', notes } = req.body;
  const wd = globalWithdrawals.find((w) => w.id === id);

  if (!wd) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  if (wd.status !== 'verified' && wd.status !== 'pending') {
    return res.status(400).json({ error: `Cannot process request with status: ${wd.status}` });
  }

  wd.status = 'processing';
  wd.processedBy = adminId;
  wd.processedAt = new Date().toLocaleString('en-US', { hour12: true });
  if (notes) wd.adminNotes = notes;

  const userRecord = db[wd.userId];
  if (userRecord) {
    const userWd = userRecord.withdrawalRecords.find((w) => w.id === id);
    if (userWd) {
      userWd.status = 'processing';
      userWd.processedBy = adminId;
      userWd.processedAt = wd.processedAt;
      if (notes) userWd.adminNotes = notes;
    }
  }

  logAdminAction(
    adminId,
    'Processing Payout',
    'wallet',
    wd.id,
    `Withdrawal: ${wd.username}`,
    `Moved withdrawal #${wd.id} of ৳${wd.amountBdt} (${wd.method}) to Processing.`
  );

  res.json({
    success: true,
    message: 'Withdrawal payout is now Processing.',
    withdrawal: wd,
    stats: calculateWalletOverviewStats(),
  });
});

// POST /api/admin/wallet/withdrawals/:id/mark-completed (Finalize completed payout with reference receipt)
app.post('/api/admin/wallet/withdrawals/:id/mark-completed', (req, res) => {
  const { id } = req.params;
  const { paymentReference, adminId = 'ADMIN_PAYOUT_01', notes } = req.body;
  const wd = globalWithdrawals.find((w) => w.id === id);

  if (!wd) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  if (wd.status === 'completed') {
    return res.status(400).json({ error: 'Withdrawal is already marked as Completed.' });
  }

  if (wd.status === 'rejected' || wd.status === 'cancelled') {
    return res.status(400).json({ error: `Cannot complete a ${wd.status} withdrawal.` });
  }

  const cleanRef = (paymentReference || `TRX${Date.now().toString().slice(-8)}BD`).trim();
  const nowStr = new Date().toLocaleString('en-US', { hour12: true });

  wd.status = 'completed';
  wd.paymentReference = cleanRef;
  wd.completedAt = nowStr;
  wd.processedBy = adminId;
  if (notes) wd.adminNotes = notes;

  const userRecord = db[wd.userId];
  if (userRecord) {
    const userWd = userRecord.withdrawalRecords.find((w) => w.id === id);
    if (userWd) {
      userWd.status = 'completed';
      userWd.paymentReference = cleanRef;
      userWd.completedAt = nowStr;
      userWd.processedBy = adminId;
      if (notes) userWd.adminNotes = notes;
    }

    const tx = userRecord.transactions.find((t) => t.id === `tx_${wd.id}` || (t.type === 'withdraw' && t.status === 'pending'));
    if (tx) {
      tx.status = 'completed';
      tx.paymentReference = cleanRef;
    }

    const notif = {
      id: `notif_${Date.now()}`,
      title: '🎉 Cashout Sent Successfully!',
      message: `৳${wd.netAmountBdt.toFixed(2)} BDT has been sent to your ${wd.method} account (${wd.maskedAccount}). Transaction Ref: ${cleanRef}`,
      timestamp: 'Just now',
      read: false,
      type: 'cashout',
    };
    userRecord.notifications.unshift(notif);
    userRecord.user.unreadNotificationsCount = (userRecord.user.unreadNotificationsCount || 0) + 1;
    updateAchievementsAndTier(userRecord);
  }

  logAdminAction(
    adminId,
    'Completed Withdrawal Payout',
    'wallet',
    wd.id,
    `Withdrawal: ${wd.username}`,
    `Finalized payout for #${wd.id}: ৳${wd.netAmountBdt} sent via ${wd.method}. Receipt: ${cleanRef}`
  );

  res.json({
    success: true,
    message: `Withdrawal successfully marked Completed with Reference: ${cleanRef}`,
    withdrawal: wd,
    stats: calculateWalletOverviewStats(),
  });
});

// POST /api/admin/wallet/withdrawals/:id/reject (Rejection with mandatory reason + balance auto-refund)
app.post('/api/admin/wallet/withdrawals/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason, adminId = 'ADMIN_SUPER_01', refundBalance = true } = req.body;

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'Rejection reason is required.' });
  }

  const wd = globalWithdrawals.find((w) => w.id === id);
  if (!wd) {
    return res.status(404).json({ error: 'Withdrawal request not found.' });
  }

  if (wd.status === 'completed') {
    return res.status(400).json({ error: 'Cannot reject an already completed payout.' });
  }

  const oldStatus = wd.status;
  const cleanReason = reason.trim();
  const nowStr = new Date().toLocaleString('en-US', { hour12: true });

  wd.status = 'rejected';
  wd.verificationStatus = 'flagged';
  wd.rejectionReason = cleanReason;
  wd.processedAt = nowStr;
  wd.processedBy = adminId;

  // Restore User Wallet Balance atomically
  const userRecord = db[wd.userId];
  if (userRecord) {
    if (refundBalance) {
      userRecord.user.bdtBalance = Number((userRecord.user.bdtBalance + wd.amountBdt).toFixed(2));
      userRecord.user.totalCashoutBdt = Math.max(0, Number(((userRecord.user.totalCashoutBdt || 0) - wd.amountBdt).toFixed(2)));

      const refundTx = {
        id: `tx_refund_${Date.now()}`,
        type: 'bonus',
        title: `Refund: Rejected ${wd.method} Cashout (${cleanReason})`,
        amountBdt: wd.amountBdt,
        status: 'completed',
        timestamp: 'Just now',
      };
      userRecord.transactions.unshift(refundTx);
    }

    const userWd = userRecord.withdrawalRecords.find((w) => w.id === id);
    if (userWd) {
      userWd.status = 'rejected';
      userWd.rejectionReason = cleanReason;
      userWd.processedAt = nowStr;
      userWd.processedBy = adminId;
    }

    const notif = {
      id: `notif_${Date.now()}`,
      title: '❌ Cashout Request Rejected',
      message: `Your withdrawal of ৳${wd.amountBdt.toFixed(2)} via ${wd.method} was rejected: "${cleanReason}". ৳${wd.amountBdt.toFixed(2)} has been refunded to your wallet.`,
      timestamp: 'Just now',
      read: false,
      type: 'cashout',
    };
    userRecord.notifications.unshift(notif);
    userRecord.user.unreadNotificationsCount = (userRecord.user.unreadNotificationsCount || 0) + 1;
    updateAchievementsAndTier(userRecord);
  }

  logAdminAction(
    adminId,
    'Rejected Withdrawal',
    'wallet',
    wd.id,
    `Withdrawal: ${wd.username}`,
    `Rejected withdrawal #${wd.id} of ৳${wd.amountBdt} (${wd.method}). Reason: ${cleanReason}. User refunded ৳${wd.amountBdt}.`
  );

  res.json({
    success: true,
    message: `Withdrawal rejected and ৳${wd.amountBdt} refunded to user wallet.`,
    withdrawal: wd,
    stats: calculateWalletOverviewStats(),
  });
});

// GET /api/admin/wallet/payment-methods
app.get('/api/admin/wallet/payment-methods', (req, res) => {
  const methods = globalPaymentMethods
    .filter((m) => !m.isArchived)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  res.json({ paymentMethods: methods });
});

// POST /api/admin/wallet/payment-methods (Add new method)
app.post('/api/admin/wallet/payment-methods', (req, res) => {
  const {
    name,
    displayName,
    accountType = 'personal',
    status = 'active',
    requiredAccountField = '11-Digit Mobile Number',
    accountPlaceholder = '01XXXXXXXXX',
    minAmountBdt = 900,
    maxAmountBdt = 25000,
    feeType = 'none',
    feeValue = 0,
    adminId = 'ADMIN_SUPER_01',
  } = req.body;

  if (!name || !displayName) {
    return res.status(400).json({ error: 'Method name and display name are required.' });
  }

  const id = `pm_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}`;
  const nextOrder = globalPaymentMethods.length > 0 ? Math.max(...globalPaymentMethods.map((m) => m.displayOrder || 0)) + 1 : 1;

  const newMethod: GlobalPaymentMethodRecord = {
    id,
    name: name.trim(),
    displayName: displayName.trim(),
    icon: 'Smartphone',
    accountType: accountType as any,
    status: status === 'inactive' ? 'inactive' : 'active',
    displayOrder: nextOrder,
    requiredAccountField: requiredAccountField.trim(),
    accountPlaceholder: accountPlaceholder.trim(),
    minAmountBdt: Math.max(10, Number(minAmountBdt) || 900),
    maxAmountBdt: Math.max(100, Number(maxAmountBdt) || 25000),
    feeType: feeType as any,
    feeValue: Number(feeValue) || 0,
    isArchived: false,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalPaymentMethods.push(newMethod);

  logAdminAction(
    adminId,
    'Added Payment Method',
    'wallet',
    newMethod.id,
    newMethod.displayName,
    `Added ${newMethod.displayName} with limits ৳${newMethod.minAmountBdt} - ৳${newMethod.maxAmountBdt}.`
  );

  res.status(201).json({ success: true, paymentMethod: newMethod, paymentMethods: globalPaymentMethods });
});

// PUT /api/admin/wallet/payment-methods/:id
app.put('/api/admin/wallet/payment-methods/:id', (req, res) => {
  const { id } = req.params;
  const index = globalPaymentMethods.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Payment method not found.' });
  }

  const existing = globalPaymentMethods[index];
  const {
    name,
    displayName,
    accountType,
    status,
    requiredAccountField,
    accountPlaceholder,
    minAmountBdt,
    maxAmountBdt,
    feeType,
    feeValue,
    displayOrder,
    adminId = 'ADMIN_SUPER_01',
  } = req.body;

  const updated: GlobalPaymentMethodRecord = {
    ...existing,
    name: name !== undefined ? name.trim() : existing.name,
    displayName: displayName !== undefined ? displayName.trim() : existing.displayName,
    accountType: accountType !== undefined ? accountType : existing.accountType,
    status: status !== undefined ? status : existing.status,
    requiredAccountField: requiredAccountField !== undefined ? requiredAccountField.trim() : existing.requiredAccountField,
    accountPlaceholder: accountPlaceholder !== undefined ? accountPlaceholder.trim() : existing.accountPlaceholder,
    minAmountBdt: minAmountBdt !== undefined ? Math.max(10, Number(minAmountBdt)) : existing.minAmountBdt,
    maxAmountBdt: maxAmountBdt !== undefined ? Math.max(100, Number(maxAmountBdt)) : existing.maxAmountBdt,
    feeType: feeType !== undefined ? feeType : existing.feeType,
    feeValue: feeValue !== undefined ? Number(feeValue) : existing.feeValue,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalPaymentMethods[index] = updated;

  logAdminAction(
    adminId,
    'Updated Payment Method',
    'wallet',
    updated.id,
    updated.displayName,
    `Updated ${updated.displayName}: Status=${updated.status}, Min=৳${updated.minAmountBdt}, Max=৳${updated.maxAmountBdt}.`
  );

  res.json({ success: true, paymentMethod: updated, paymentMethods: globalPaymentMethods });
});

// PATCH /api/admin/wallet/payment-methods/:id/status
app.patch('/api/admin/wallet/payment-methods/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminId = 'ADMIN_SUPER_01' } = req.body;
  const method = globalPaymentMethods.find((m) => m.id === id);

  if (!method) {
    return res.status(404).json({ error: 'Payment method not found.' });
  }

  const oldStatus = method.status;
  method.status = status || (method.status === 'active' ? 'inactive' : 'active');
  method.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(
    adminId,
    'Toggled Payment Method Status',
    'wallet',
    method.id,
    method.displayName,
    `Changed status of ${method.displayName} from ${oldStatus} to ${method.status}.`
  );

  res.json({ success: true, paymentMethod: method, paymentMethods: globalPaymentMethods });
});

// PATCH /api/admin/wallet/payment-methods/reorder
app.patch('/api/admin/wallet/payment-methods/reorder', (req, res) => {
  const { orderedIds, adminId = 'ADMIN_SUPER_01' } = req.body as { orderedIds: string[]; adminId?: string };

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required.' });
  }

  orderedIds.forEach((id, idx) => {
    const item = globalPaymentMethods.find((m) => m.id === id);
    if (item) item.displayOrder = idx + 1;
  });

  logAdminAction(adminId, 'Reordered Payment Methods', 'wallet', 'PAYMENT_METHODS', 'Payment Methods Sequence', 'Updated payment methods display order.');
  res.json({ success: true, paymentMethods: globalPaymentMethods });
});

// DELETE /api/admin/wallet/payment-methods/:id (Archive)
app.delete('/api/admin/wallet/payment-methods/:id', (req, res) => {
  const { id } = req.params;
  const { adminId = 'ADMIN_SUPER_01' } = req.query as { adminId?: string };
  const method = globalPaymentMethods.find((m) => m.id === id);

  if (!method) {
    return res.status(404).json({ error: 'Payment method not found.' });
  }

  method.isArchived = true;
  method.status = 'inactive';

  logAdminAction(adminId, 'Archived Payment Method', 'wallet', method.id, method.displayName, `Archived payment method ${method.displayName}.`);
  res.json({ success: true, message: 'Payment method archived successfully.' });
});

// GET /api/admin/wallet/settings
app.get('/api/admin/wallet/settings', (req, res) => {
  res.json({ settings: globalWithdrawalSettings });
});

// POST /api/admin/wallet/settings (Update limits, fees, maintenance)
app.post('/api/admin/wallet/settings', (req, res) => {
  const {
    minWithdrawBdt,
    maxWithdrawBdt,
    dailyWithdrawLimitBdt,
    dailyWithdrawLimitCount,
    feeType,
    feeValue,
    isWithdrawalEnabled,
    maintenanceNotice,
    adminId = 'ADMIN_SUPER_01',
  } = req.body;

  const oldSettings = { ...globalWithdrawalSettings };

  if (minWithdrawBdt !== undefined) {
    globalWithdrawalSettings.minWithdrawBdt = Math.max(10, Number(minWithdrawBdt) || 900);
  }
  if (maxWithdrawBdt !== undefined) {
    globalWithdrawalSettings.maxWithdrawBdt = Math.max(globalWithdrawalSettings.minWithdrawBdt, Number(maxWithdrawBdt) || 25000);
  }
  if (dailyWithdrawLimitBdt !== undefined) {
    globalWithdrawalSettings.dailyWithdrawLimitBdt = Math.max(100, Number(dailyWithdrawLimitBdt) || 50000);
  }
  if (dailyWithdrawLimitCount !== undefined) {
    globalWithdrawalSettings.dailyWithdrawLimitCount = Math.max(1, Number(dailyWithdrawLimitCount) || 3);
  }
  if (feeType !== undefined) {
    globalWithdrawalSettings.feeType = feeType;
  }
  if (feeValue !== undefined) {
    globalWithdrawalSettings.feeValue = Math.max(0, Number(feeValue) || 0);
  }
  if (isWithdrawalEnabled !== undefined) {
    globalWithdrawalSettings.isWithdrawalEnabled = Boolean(isWithdrawalEnabled);
  }
  if (maintenanceNotice !== undefined) {
    globalWithdrawalSettings.maintenanceNotice = maintenanceNotice;
  }

  globalWithdrawalSettings.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  globalWithdrawalSettings.updatedBy = adminId;

  logAdminAction(
    adminId,
    'Updated Withdrawal Settings',
    'wallet',
    'CONFIG_WITHDRAWAL',
    'Withdrawal Settings',
    `Updated Min=৳${globalWithdrawalSettings.minWithdrawBdt}, Max=৳${globalWithdrawalSettings.maxWithdrawBdt}, Fee=${globalWithdrawalSettings.feeType === 'none' ? '0' : `${globalWithdrawalSettings.feeValue} (${globalWithdrawalSettings.feeType})`}, Enabled=${globalWithdrawalSettings.isWithdrawalEnabled}`,
    JSON.stringify(oldSettings),
    JSON.stringify(globalWithdrawalSettings)
  );

  res.json({
    success: true,
    message: 'Withdrawal settings successfully updated.',
    settings: globalWithdrawalSettings,
  });
});

// GET /api/admin/wallet/requirements
app.get('/api/admin/wallet/requirements', (req, res) => {
  res.json({ requirements: globalWithdrawalRequirements });
});

// POST /api/admin/wallet/requirements (Update referral, ad, task prerequisites)
app.post('/api/admin/wallet/requirements', (req, res) => {
  const {
    minQualifiedReferrals,
    minVerifiedAds,
    minCompletedMicroJobs,
    minAccountAgeHours,
    requireAccountVerification,
    requireAchievementUnlock,
    adminId = 'ADMIN_SUPER_01',
  } = req.body;

  const oldReqs = { ...globalWithdrawalRequirements };

  if (minQualifiedReferrals !== undefined) {
    globalWithdrawalRequirements.minQualifiedReferrals = Math.max(0, Number(minQualifiedReferrals) || 0);
  }
  if (minVerifiedAds !== undefined) {
    globalWithdrawalRequirements.minVerifiedAds = Math.max(0, Number(minVerifiedAds) || 0);
  }
  if (minCompletedMicroJobs !== undefined) {
    globalWithdrawalRequirements.minCompletedMicroJobs = Math.max(0, Number(minCompletedMicroJobs) || 0);
  }
  if (minAccountAgeHours !== undefined) {
    globalWithdrawalRequirements.minAccountAgeHours = Math.max(0, Number(minAccountAgeHours) || 0);
  }
  if (requireAccountVerification !== undefined) {
    globalWithdrawalRequirements.requireAccountVerification = Boolean(requireAccountVerification);
  }
  if (requireAchievementUnlock !== undefined) {
    globalWithdrawalRequirements.requireAchievementUnlock = Boolean(requireAchievementUnlock);
  }

  globalWithdrawalRequirements.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  globalWithdrawalRequirements.updatedBy = adminId;

  logAdminAction(
    adminId,
    'Updated Withdrawal Requirements',
    'wallet',
    'CONFIG_REQUIREMENTS',
    'Withdrawal Prerequisites',
    `Updated requirements: Min Qualified Referrals=${globalWithdrawalRequirements.minQualifiedReferrals}, Min Ads=${globalWithdrawalRequirements.minVerifiedAds}, Min Jobs=${globalWithdrawalRequirements.minCompletedMicroJobs}.`,
    JSON.stringify(oldReqs),
    JSON.stringify(globalWithdrawalRequirements)
  );

  res.json({
    success: true,
    message: 'Withdrawal requirements successfully updated.',
    requirements: globalWithdrawalRequirements,
  });
});

// POST /api/admin/wallet/manual-adjustment (Atomic Credit / Debit with full audit ledger)
app.post('/api/admin/wallet/manual-adjustment', (req, res) => {
  const { userId, amountBdt, adjustmentType = 'credit', reason, adminId = 'ADMIN_FINANCE_01' } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Target User ID or Telegram Username is required.' });
  }

  const amt = Number(amountBdt);
  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Adjustment amount must be greater than 0.' });
  }

  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'Detailed adjustment reason is required for accounting audit.' });
  }

  // Lookup target user in db
  let targetRecord = db[userId];
  if (!targetRecord) {
    // Lookup by username
    const foundEntry = Object.values(db).find((u) => u.user.username === userId || `@${u.user.username}` === userId);
    if (foundEntry) {
      targetRecord = foundEntry;
    } else {
      // Create record or use primary user
      targetRecord = getOrCreateUser(req);
    }
  }

  const isCredit = adjustmentType === 'credit';
  const previousBalance = targetRecord.user.bdtBalance;
  const delta = isCredit ? amt : -amt;

  if (!isCredit && previousBalance < amt) {
    return res.status(400).json({
      error: `Cannot debit ৳${amt}. User only has ৳${previousBalance.toFixed(2)} in available balance.`
    });
  }

  targetRecord.user.bdtBalance = Number(Math.max(0, targetRecord.user.bdtBalance + delta).toFixed(2));
  if (isCredit) {
    targetRecord.user.todayEarnedBdt = Number((targetRecord.user.todayEarnedBdt + amt).toFixed(2));
  }

  const tx = {
    id: `tx_admin_${Date.now()}`,
    type: isCredit ? 'bonus' : 'withdraw',
    title: `Admin Manual ${isCredit ? 'Credit' : 'Debit'}: ${reason.trim()}`,
    amountBdt: amt,
    status: 'completed',
    timestamp: 'Just now',
  };
  targetRecord.transactions.unshift(tx);

  const notif = {
    id: `notif_${Date.now()}`,
    title: isCredit ? '💰 Balance Credited by Admin' : '⚖️ Balance Adjusted by Admin',
    message: `${isCredit ? '+' : '-'}৳${amt.toFixed(2)} BDT (${reason.trim()}). New Balance: ৳${targetRecord.user.bdtBalance.toFixed(2)} BDT.`,
    timestamp: 'Just now',
    read: false,
    type: 'system',
  };
  targetRecord.notifications.unshift(notif);
  targetRecord.user.unreadNotificationsCount = (targetRecord.user.unreadNotificationsCount || 0) + 1;

  updateAchievementsAndTier(targetRecord);

  logAdminAction(
    adminId,
    `Manual ${isCredit ? 'Credit' : 'Debit'} Adjustment`,
    'wallet',
    targetRecord.user.id,
    `User: ${targetRecord.user.username || targetRecord.user.id}`,
    `Adjusted user balance by ${isCredit ? '+' : '-'}৳${amt}. Previous: ৳${previousBalance}, New: ৳${targetRecord.user.bdtBalance}. Reason: ${reason.trim()}`
  );

  res.json({
    success: true,
    message: `Successfully ${isCredit ? 'credited' : 'debited'} ৳${amt.toFixed(2)} BDT to ${targetRecord.user.username || targetRecord.user.id}.`,
    user: targetRecord.user,
    transaction: tx,
    stats: calculateWalletOverviewStats(),
  });
});

// GET /api/admin/wallet/transactions (Global transaction ledger)
app.get('/api/admin/wallet/transactions', (req, res) => {
  const allTxns: any[] = [];

  Object.values(db).forEach((u) => {
    (u.transactions || []).forEach((t) => {
      allTxns.push({
        ...t,
        userId: u.user.id,
        username: u.user.username,
        fullName: u.user.fullName,
      });
    });
  });

  allTxns.sort((a, b) => (b.id > a.id ? 1 : -1));
  res.json({ transactions: allTxns.slice(0, 100), total: allTxns.length });
});

// ==========================================
// PROFILE MENU MANAGEMENT API ROUTES
// ==========================================

// GET /api/profile-config (User App public profile & support config)
app.get('/api/profile-config', (req, res) => {
  res.json({
    success: true,
    profileConfig: {
      support: globalProfileSupport,
      socialLinks: globalProfileSocialLinks
        .filter((s) => s.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
      appInfo: globalProfileAppInfo,
      legal: globalProfileLegal,
      faqs: globalProfileFaqs
        .filter((f) => f.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
      sections: [...globalProfileSections].sort((a, b) => a.displayOrder - b.displayOrder),
    },
  });
});

// GET /api/admin/profile-config (Admin complete profile & support manager)
app.get('/api/admin/profile-config', (req, res) => {
  res.json({
    success: true,
    profileConfig: {
      support: globalProfileSupport,
      socialLinks: [...globalProfileSocialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
      appInfo: globalProfileAppInfo,
      legal: globalProfileLegal,
      faqs: [...globalProfileFaqs].sort((a, b) => a.displayOrder - b.displayOrder),
      sections: [...globalProfileSections].sort((a, b) => a.displayOrder - b.displayOrder),
    },
  });
});

// POST /api/admin/profile/support (Save Contact Support Channels)
app.post('/api/admin/profile/support', (req, res) => {
  const {
    titleEn,
    titleBn,
    descEn,
    descBn,
    is24x7Active,
    telegram,
    whatsapp,
    facebook,
    adminId = 'ADMIN_SUPPORT_01',
  } = req.body;

  // Validation
  if (telegram?.link && !isValidSafeUrl(telegram.link)) {
    return res.status(400).json({ error: 'Invalid Telegram link. Must be a valid https://t.me/ URL.' });
  }
  if (whatsapp?.link && !isValidSafeUrl(whatsapp.link)) {
    return res.status(400).json({ error: 'Invalid WhatsApp link. Must be a valid https://wa.me/ URL.' });
  }
  if (facebook?.link && !isValidSafeUrl(facebook.link)) {
    return res.status(400).json({ error: 'Invalid Facebook link. Must be a valid https://facebook.com/ URL.' });
  }

  const oldSupport = JSON.parse(JSON.stringify(globalProfileSupport));

  if (titleEn !== undefined) globalProfileSupport.titleEn = String(titleEn).trim();
  if (titleBn !== undefined) globalProfileSupport.titleBn = String(titleBn).trim();
  if (descEn !== undefined) globalProfileSupport.descEn = String(descEn).trim();
  if (descBn !== undefined) globalProfileSupport.descBn = String(descBn).trim();
  if (is24x7Active !== undefined) globalProfileSupport.is24x7Active = Boolean(is24x7Active);

  if (telegram) {
    globalProfileSupport.telegram = {
      enabled: telegram.enabled !== undefined ? Boolean(telegram.enabled) : globalProfileSupport.telegram.enabled,
      title: telegram.title ? String(telegram.title).trim() : globalProfileSupport.telegram.title,
      link: telegram.link ? String(telegram.link).trim() : globalProfileSupport.telegram.link,
      usernameOrPhone: telegram.usernameOrPhone ? String(telegram.usernameOrPhone).trim() : globalProfileSupport.telegram.usernameOrPhone,
      subtitleEn: telegram.subtitleEn ? String(telegram.subtitleEn).trim() : globalProfileSupport.telegram.subtitleEn,
      subtitleBn: telegram.subtitleBn ? String(telegram.subtitleBn).trim() : globalProfileSupport.telegram.subtitleBn,
      badge: telegram.badge ? String(telegram.badge).trim() : globalProfileSupport.telegram.badge,
    };
  }

  if (whatsapp) {
    globalProfileSupport.whatsapp = {
      enabled: whatsapp.enabled !== undefined ? Boolean(whatsapp.enabled) : globalProfileSupport.whatsapp.enabled,
      title: whatsapp.title ? String(whatsapp.title).trim() : globalProfileSupport.whatsapp.title,
      link: whatsapp.link ? String(whatsapp.link).trim() : globalProfileSupport.whatsapp.link,
      usernameOrPhone: whatsapp.usernameOrPhone ? String(whatsapp.usernameOrPhone).trim() : globalProfileSupport.whatsapp.usernameOrPhone,
      subtitleEn: whatsapp.subtitleEn ? String(whatsapp.subtitleEn).trim() : globalProfileSupport.whatsapp.subtitleEn,
      subtitleBn: whatsapp.subtitleBn ? String(whatsapp.subtitleBn).trim() : globalProfileSupport.whatsapp.subtitleBn,
    };
  }

  if (facebook) {
    globalProfileSupport.facebook = {
      enabled: facebook.enabled !== undefined ? Boolean(facebook.enabled) : globalProfileSupport.facebook.enabled,
      title: facebook.title ? String(facebook.title).trim() : globalProfileSupport.facebook.title,
      link: facebook.link ? String(facebook.link).trim() : globalProfileSupport.facebook.link,
      usernameOrPhone: facebook.usernameOrPhone ? String(facebook.usernameOrPhone).trim() : globalProfileSupport.facebook.usernameOrPhone,
      subtitleEn: facebook.subtitleEn ? String(facebook.subtitleEn).trim() : globalProfileSupport.facebook.subtitleEn,
      subtitleBn: facebook.subtitleBn ? String(facebook.subtitleBn).trim() : globalProfileSupport.facebook.subtitleBn,
    };
  }

  globalProfileSupport.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
  globalProfileSupport.updatedBy = adminId;

  logAdminAction(
    adminId,
    'Updated Support Settings',
    'profile',
    'SUPPORT_SETTINGS',
    'Contact Support Channels',
    `Updated support channels: TG (${globalProfileSupport.telegram.enabled ? 'Active' : 'Disabled'}), WA (${globalProfileSupport.whatsapp.enabled ? 'Active' : 'Disabled'}), FB (${globalProfileSupport.facebook.enabled ? 'Active' : 'Disabled'}).`,
    JSON.stringify(oldSupport),
    JSON.stringify(globalProfileSupport)
  );

  res.json({
    success: true,
    message: 'Profile support settings updated ✓',
    support: globalProfileSupport,
  });
});

// POST /api/admin/profile/social/add (Add New Social Link)
app.post('/api/admin/profile/social/add', (req, res) => {
  const { platform, displayName, handle, url, icon, isActive = true, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!platform || !displayName || !url) {
    return res.status(400).json({ error: 'Platform, Display Name, and URL are required.' });
  }

  if (!isValidSafeUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Only secure HTTPS/HTTP links are allowed. Javascript/data URLs are strictly blocked.' });
  }

  const newLink: GlobalProfileSocialLink = {
    id: `soc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    platform,
    displayName: String(displayName).trim(),
    handle: handle ? String(handle).trim() : '',
    url: String(url).trim(),
    icon: icon || 'Globe',
    isActive: Boolean(isActive),
    displayOrder: globalProfileSocialLinks.length + 1,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };

  globalProfileSocialLinks.push(newLink);

  logAdminAction(
    adminId,
    'Added Social Link',
    'profile',
    newLink.id,
    newLink.displayName,
    `Added ${newLink.platform} link (${newLink.url}) at position #${newLink.displayOrder}.`
  );

  res.json({
    success: true,
    message: 'Social link added successfully ✓',
    socialLinks: [...globalProfileSocialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
  });
});

// POST /api/admin/profile/social/update (Edit Social Link)
app.post('/api/admin/profile/social/update', (req, res) => {
  const { id, platform, displayName, handle, url, icon, isActive, displayOrder, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Social Link ID is required.' });
  }

  const idx = globalProfileSocialLinks.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Social link not found.' });
  }

  if (url && !isValidSafeUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL. Only secure HTTPS/HTTP links are allowed.' });
  }

  const oldLink = { ...globalProfileSocialLinks[idx] };

  if (platform !== undefined) globalProfileSocialLinks[idx].platform = platform;
  if (displayName !== undefined) globalProfileSocialLinks[idx].displayName = String(displayName).trim();
  if (handle !== undefined) globalProfileSocialLinks[idx].handle = String(handle).trim();
  if (url !== undefined) globalProfileSocialLinks[idx].url = String(url).trim();
  if (icon !== undefined) globalProfileSocialLinks[idx].icon = icon;
  if (isActive !== undefined) globalProfileSocialLinks[idx].isActive = Boolean(isActive);
  if (displayOrder !== undefined) globalProfileSocialLinks[idx].displayOrder = Number(displayOrder);

  globalProfileSocialLinks[idx].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(
    adminId,
    'Edited Social Link',
    'profile',
    id,
    globalProfileSocialLinks[idx].displayName,
    `Updated ${globalProfileSocialLinks[idx].platform} link details.`,
    JSON.stringify(oldLink),
    JSON.stringify(globalProfileSocialLinks[idx])
  );

  res.json({
    success: true,
    message: 'Social link updated successfully ✓',
    socialLinks: [...globalProfileSocialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
  });
});

// POST /api/admin/profile/social/toggle (Toggle Active/Inactive)
app.post('/api/admin/profile/social/toggle', (req, res) => {
  const { id, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Social Link ID is required.' });
  }

  const link = globalProfileSocialLinks.find((s) => s.id === id);
  if (!link) {
    return res.status(404).json({ error: 'Social link not found.' });
  }

  link.isActive = !link.isActive;
  link.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(
    adminId,
    link.isActive ? 'Enabled Social Link' : 'Disabled Social Link',
    'profile',
    id,
    link.displayName,
    `Toggled status of ${link.platform} to ${link.isActive ? 'Active 🟢' : 'Inactive ⚪'}.`
  );

  res.json({
    success: true,
    message: `Social link ${link.isActive ? 'enabled' : 'disabled'} ✓`,
    socialLinks: [...globalProfileSocialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
  });
});

// POST /api/admin/profile/social/delete (Remove Social Link)
app.post('/api/admin/profile/social/delete', (req, res) => {
  const { id, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Social Link ID is required.' });
  }

  const link = globalProfileSocialLinks.find((s) => s.id === id);
  if (!link) {
    return res.status(404).json({ error: 'Social link not found.' });
  }

  globalProfileSocialLinks = globalProfileSocialLinks.filter((s) => s.id !== id);

  logAdminAction(
    adminId,
    'Deleted Social Link',
    'profile',
    id,
    link.displayName,
    `Removed ${link.platform} link (${link.url}) from active database.`
  );

  res.json({
    success: true,
    message: 'Social link removed ✓',
    socialLinks: [...globalProfileSocialLinks].sort((a, b) => a.displayOrder - b.displayOrder),
  });
});

// POST /api/admin/profile/social/reorder (Reorder Social Links)
app.post('/api/admin/profile/social/reorder', (req, res) => {
  const { orderedIds, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required.' });
  }

  orderedIds.forEach((id: string, index: number) => {
    const item = globalProfileSocialLinks.find((s) => s.id === id);
    if (item) {
      item.displayOrder = index + 1;
      item.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    }
  });

  globalProfileSocialLinks.sort((a, b) => a.displayOrder - b.displayOrder);

  logAdminAction(
    adminId,
    'Reordered Social Links',
    'profile',
    'SOCIAL_REORDER',
    'Social Display Order',
    `Updated social links display order: ${orderedIds.join(', ')}.`
  );

  res.json({
    success: true,
    message: 'Social links order saved ✓',
    socialLinks: [...globalProfileSocialLinks],
  });
});

// POST /api/admin/profile/legal (Save Terms, Privacy & App Info)
app.post('/api/admin/profile/legal', (req, res) => {
  const {
    appName,
    version,
    aboutEn,
    aboutBn,
    copyrightText,
    titleEn,
    titleBn,
    subtitleEn,
    subtitleBn,
    rulesEn,
    rulesBn,
    adminId = 'ADMIN_LEGAL_01',
  } = req.body;

  if (appName) globalProfileAppInfo.appName = String(appName).trim();
  if (version) globalProfileAppInfo.version = String(version).trim();
  if (aboutEn) globalProfileAppInfo.aboutEn = String(aboutEn).trim();
  if (aboutBn) globalProfileAppInfo.aboutBn = String(aboutBn).trim();
  if (copyrightText) globalProfileAppInfo.copyrightText = String(copyrightText).trim();
  globalProfileAppInfo.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  if (titleEn) globalProfileLegal.titleEn = String(titleEn).trim();
  if (titleBn) globalProfileLegal.titleBn = String(titleBn).trim();
  if (subtitleEn) globalProfileLegal.subtitleEn = String(subtitleEn).trim();
  if (subtitleBn) globalProfileLegal.subtitleBn = String(subtitleBn).trim();
  if (Array.isArray(rulesEn)) globalProfileLegal.rulesEn = rulesEn.filter(Boolean);
  if (Array.isArray(rulesBn)) globalProfileLegal.rulesBn = rulesBn.filter(Boolean);
  globalProfileLegal.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

  logAdminAction(
    adminId,
    'Updated Terms & App Info',
    'profile',
    'LEGAL_SETTINGS',
    'Terms, Privacy & App Info',
    `Updated legal terms policy (${globalProfileLegal.rulesEn.length} rules) and app info (${globalProfileAppInfo.appName} ${globalProfileAppInfo.version}).`
  );

  res.json({
    success: true,
    message: 'Profile legal & app info updated ✓',
    appInfo: globalProfileAppInfo,
    legal: globalProfileLegal,
  });
});

// POST /api/admin/profile/faq/save (Add or Update FAQ)
app.post('/api/admin/profile/faq/save', (req, res) => {
  const { id, qEn, qBn, aEn, aBn, displayOrder, isActive = true, adminId = 'ADMIN_HELP_01' } = req.body;

  if (!qEn || !qBn || !aEn || !aBn) {
    return res.status(400).json({ error: 'Questions and Answers in both English and Bangla are required.' });
  }

  if (id) {
    const idx = globalProfileFaqs.findIndex((f) => f.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'FAQ item not found.' });
    }
    globalProfileFaqs[idx].qEn = String(qEn).trim();
    globalProfileFaqs[idx].qBn = String(qBn).trim();
    globalProfileFaqs[idx].aEn = String(aEn).trim();
    globalProfileFaqs[idx].aBn = String(aBn).trim();
    if (displayOrder !== undefined) globalProfileFaqs[idx].displayOrder = Number(displayOrder);
    if (isActive !== undefined) globalProfileFaqs[idx].isActive = Boolean(isActive);
    globalProfileFaqs[idx].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);

    logAdminAction(
      adminId,
      'Updated FAQ Item',
      'profile',
      id,
      qEn.slice(0, 40),
      `Updated FAQ: "${qEn.slice(0, 50)}..."`
    );
  } else {
    const newFaq: GlobalProfileFaqItem = {
      id: `faq_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      qEn: String(qEn).trim(),
      qBn: String(qBn).trim(),
      aEn: String(aEn).trim(),
      aBn: String(aBn).trim(),
      displayOrder: displayOrder ? Number(displayOrder) : globalProfileFaqs.length + 1,
      isActive: Boolean(isActive),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    globalProfileFaqs.push(newFaq);

    logAdminAction(
      adminId,
      'Added FAQ Item',
      'profile',
      newFaq.id,
      qEn.slice(0, 40),
      `Added new FAQ: "${qEn.slice(0, 50)}..."`
    );
  }

  globalProfileFaqs.sort((a, b) => a.displayOrder - b.displayOrder);

  res.json({
    success: true,
    message: 'FAQ saved successfully ✓',
    faqs: globalProfileFaqs,
  });
});

// POST /api/admin/profile/faq/delete (Delete FAQ)
app.post('/api/admin/profile/faq/delete', (req, res) => {
  const { id, adminId = 'ADMIN_HELP_01' } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'FAQ ID is required.' });
  }

  const faq = globalProfileFaqs.find((f) => f.id === id);
  if (!faq) {
    return res.status(404).json({ error: 'FAQ item not found.' });
  }

  globalProfileFaqs = globalProfileFaqs.filter((f) => f.id !== id);

  logAdminAction(
    adminId,
    'Deleted FAQ Item',
    'profile',
    id,
    faq.qEn.slice(0, 40),
    `Deleted FAQ: "${faq.qEn.slice(0, 50)}..."`
  );

  res.json({
    success: true,
    message: 'FAQ deleted ✓',
    faqs: globalProfileFaqs,
  });
});

// POST /api/admin/profile/sections/update (Update Section Order & Visibility)
app.post('/api/admin/profile/sections/update', (req, res) => {
  const { sections, adminId = 'ADMIN_PROFILE_01' } = req.body;

  if (!Array.isArray(sections)) {
    return res.status(400).json({ error: 'Sections array is required.' });
  }

  sections.forEach((sec: any) => {
    const existing = globalProfileSections.find((s) => s.key === sec.key);
    if (existing) {
      if (sec.isVisible !== undefined) existing.isVisible = Boolean(sec.isVisible);
      if (sec.displayOrder !== undefined) existing.displayOrder = Number(sec.displayOrder);
    }
  });

  globalProfileSections.sort((a, b) => a.displayOrder - b.displayOrder);

  logAdminAction(
    adminId,
    'Updated Profile Sections',
    'profile',
    'SECTIONS_LAYOUT',
    'Profile Section Order & Visibility',
    `Updated profile section hierarchy. Visible sections: ${globalProfileSections.filter((s) => s.isVisible).map((s) => s.key).join(', ')}.`
  );

  res.json({
    success: true,
    message: 'Profile section layout saved ✓',
    sections: globalProfileSections,
  });
});

// POST /api/admin/profile/reset-defaults (Reset to factory configuration)
app.post('/api/admin/profile/reset-defaults', (req, res) => {
  const { adminId = 'ADMIN_SUPER_01' } = req.body;

  globalProfileSupport = {
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
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedBy: adminId,
  };

  logAdminAction(
    adminId,
    'Reset Profile Defaults',
    'profile',
    'CONFIG_RESET',
    'Profile Settings',
    'Reset profile support channels, social links, and legal text to default factory settings.'
  );

  res.json({
    success: true,
    message: 'Profile settings reset to default ✓',
    profileConfig: {
      support: globalProfileSupport,
      socialLinks: globalProfileSocialLinks,
      appInfo: globalProfileAppInfo,
      legal: globalProfileLegal,
      faqs: globalProfileFaqs,
      sections: globalProfileSections,
    },
  });
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quick Earn Production Server listening on http://localhost:${PORT}`);
  });
}

startServer();
