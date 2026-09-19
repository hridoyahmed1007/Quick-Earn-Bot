import { LeaderboardEntry, LeaderboardPeriod } from '../types';

export interface TelegramLeaderboardUser {
  rank: number;
  displayName: string;
  username: string;
  avatar: string;
  amountBdt: number;
  referralCount: number;
  adsWatched: number;
  trend: 'up' | 'down' | 'neutral';
  trendChange: number;
  isCurrentUser?: boolean;
  badge?: string;
}

// 100 Real-format Telegram verified profiles across Bangladesh
const REAL_BD_TELEGRAM_USERS: { displayName: string; username: string; avatar: string }[] = [
  { displayName: 'Md. Sohel Rana', username: 'sohel_rana_99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Sumon Hossain', username: 'sumon_barisal', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Nadiya Sultana', username: 'nadiya_sultana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Faisal Ahmed', username: 'faisal_sylhet', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Ashikur Rahman', username: 'ashik_khulna', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Tanvir Hasan', username: 'tanvir_ctg', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Mim Fariha', username: 'mim_fariha', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Kamrul Islam', username: 'kamrul_rajshahi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Farhan Kabir', username: 'farhan_cumilla', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Mithu Mia', username: 'mithu_mensingh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Shakil Khan', username: 'shakil_rangpur', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Saiful Islam', username: 'saiful_bogra', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { displayName: 'Rohim Uddin', username: 'rohim_tangail', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Tania Akter', username: 'tania_dhaka', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Ariful Haque', username: 'ariful_pabna', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Hasan Mahmud', username: 'hasan_gazipur', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Moniruzzaman', username: 'monir_narayanganj', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Sakib Al Hasan', username: 'sakib_comilla', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Sabbir Hossain', username: 'sabbir_kushtia', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Rakibul Islam', username: 'rakib_feni', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Nahid Parvez', username: 'nahid_noakhali', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Anika Tabassum', username: 'anika_coxsbazar', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Mehedi Hasan', username: 'mehedi_jessore', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Shuvo Roy', username: 'shuvo_dinajpur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Shirin Jahan', username: 'shirin_khulna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Babu Mia', username: 'babu_savar', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  // #27 will be replaced with Current User
  { displayName: 'Shahadat Rasel', username: 'rasel_rangpur', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Tamim Iqbal', username: 'tamim_sylhet', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Moly Begum', username: 'moly_ctg', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Imran Hossain', username: 'imran_bhola', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Nazmul Shanto', username: 'shanto_barisal', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Laboni Khatun', username: 'laboni_dhaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Rifat Bin Razzak', username: 'rifat_rajshahi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Polash Chandra', username: 'polash_pabna', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Suraiya Yasmin', username: 'suraiya_khulna', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Alok Kumar', username: 'alok_mymensingh', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Rubel Mia', username: 'rubel_bogra', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Shahin Alam', username: 'shahin_gazipur', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Sohan Sheikh', username: 'sohan_jessore', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Rachel Roy', username: 'rachel_sylhet', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Liton Das', username: 'liton_rangpur', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { displayName: 'Samiul Islam', username: 'samiul_feni', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Tarikul Islam', username: 'tarik_comilla', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Tushar Imran', username: 'tushar_tangail', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Sumi Akter', username: 'sumi_dhaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Parvez Mosharraf', username: 'parvez_kushtia', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Monica Barua', username: 'monica_ctg', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Shipon Ahmed', username: 'shipon_noakhali', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Shakila Banu', username: 'shakila_barisal', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Hasibul Hasan', username: 'hasib_rajshahi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Jabed Chowdhury', username: 'jabed_sylhet', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Shagor Mia', username: 'shagor_narayanganj', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Maruf Billah', username: 'maruf_gazipur', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Keya Chowdhury', username: 'keya_bogra', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Jahid Hasan', username: 'jahid_dinajpur', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Khaled Mahmud', username: 'khaled_cumilla', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Fahmida Jahan', username: 'fahmida_dhaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Bappy Dey', username: 'bappy_jessore', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { displayName: 'Pavel Sikder', username: 'pavel_tangail', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Niloy Ghosh', username: 'niloy_khulna', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Saad Abdullah', username: 'saad_rangpur', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Rumi Akter', username: 'rumi_pabna', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Samir Kanti', username: 'samir_feni', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Rifat Ara', username: 'rifa_chittagong', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Siam Ahmed', username: 'siam_comilla', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Tanju Begum', username: 'tanju_mensingh', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Robin Mia', username: 'robin_bhola', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Sohanur Rahman', username: 'sohanur_barisal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Mou Debnath', username: 'mou_dhaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Joydeb Roy', username: 'joy_rajshahi', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Mithila Sen', username: 'mithila_sylhet', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Tamanna Tasnim', username: 'tamanna_khulna', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Sujan Mahmud', username: 'sujan_bogra', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Tasnim Ferdous', username: 'tasnim_gazipur', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Mamunur Rashid', username: 'mamun_dinajpur', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Alamin Gazi', username: 'alamin_narayanganj', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { displayName: 'Suborno Das', username: 'suborno_cumilla', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Bristi Rani', username: 'bristi_jessore', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Rezaul Karim', username: 'reza_tangail', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Asif Zaman', username: 'asif_rangpur', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Nadim Ahmed', username: 'nadim_pabna', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Sabbir Hossain', username: 'sabbir_feni', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Faria Noor', username: 'faria_coxsbazar', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Arman Habib', username: 'arman_ctg', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  { displayName: 'Nayem Hossain', username: 'nayem_noakhali', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
  { displayName: 'Sohag Mia', username: 'sohag_barisal', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120' },
  { displayName: 'Meghla Akter', username: 'megh_dhaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Jamil Hossain', username: 'jamil_rajshahi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120' },
  { displayName: 'Sadia Sultana', username: 'sadia_sylhet', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
  { displayName: 'Emon Mahmud', username: 'emon_khulna', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120' },
  { displayName: 'Bijoy Sarkar', username: 'bijoy_bogra', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120' },
  { displayName: 'Munna Chowdhury', username: 'munna_gazipur', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  { displayName: 'Siddikur Rahman', username: 'siddik_dinajpur', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
  { displayName: 'Salma Begum', username: 'salma_narayanganj', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120' },
  { displayName: 'Shakib Khan', username: 'shakib_cumilla', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120' },
  { displayName: 'Lopa Rahman', username: 'lopa_jessore', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120' },
  { displayName: 'Mustafizur Rahman', username: 'mustafiz_satkhira', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' },
  { displayName: 'Rubina Yasmin', username: 'rubina_dhaka', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
  { displayName: 'Tariq Anam', username: 'tariq_natore', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120' },
  { displayName: 'Nusrat Jahan', username: 'nusrat_mymensingh', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
];

/**
 * Returns exact Top 100 Leaderboard dataset for any period (Daily, Weekly, Monthly, All Time).
 * Features randomized, high-volume ads and referrals with dynamically calculated income:
 * e.g., All Time Top 1: 1570 ads, 379 referrals, with income accurately computed
 * with realistic "kom-beshi" distribution across all 100 ranks.
 */
export function getTop100Leaderboard(
  period: LeaderboardPeriod,
  currentUser: {
    username: string;
    fullName: string;
    avatarUrl: string;
    bdtBalance?: number;
    totalReferrals?: number;
    totalAdsWatched?: number;
  }
): LeaderboardEntry[] {
  // Period-specific configurations
  let topTargetAds = 1570;
  let topTargetRefs = 379;
  let minAds = 220;
  let minRefs = 32;
  let adUnitPrice = 2.0;
  let refUnitPrice = 25.0;
  let baseTaskBonus = 1800;

  if (period === 'monthly') {
    topTargetAds = 980;
    topTargetRefs = 215;
    minAds = 135;
    minRefs = 18;
    adUnitPrice = 2.0;
    refUnitPrice = 25.0;
    baseTaskBonus = 950;
  } else if (period === 'weekly') {
    topTargetAds = 410;
    topTargetRefs = 88;
    minAds = 48;
    minRefs = 7;
    adUnitPrice = 2.0;
    refUnitPrice = 25.0;
    baseTaskBonus = 380;
  } else if (period === 'today') {
    topTargetAds = 118;
    topTargetRefs = 26;
    minAds = 12;
    minRefs = 2;
    adUnitPrice = 2.0;
    refUnitPrice = 25.0;
    baseTaskBonus = 85;
  }

  // Deterministic pseudo-random helper for consistent yet realistically varied "kom-beshi" values
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999 + (period.length * 17)) * 10000;
    return x - Math.floor(x);
  };

  interface RawCandidate {
    displayName: string;
    username: string;
    avatar: string;
    adsWatched: number;
    referralCount: number;
    amountBdt: number;
    trend: 'up' | 'down' | 'neutral';
    trendChange: number;
    isCurrentUser?: boolean;
    candidateIndex: number;
  }

  // Calculate Top 1 benchmark income
  const top1TierBoost = 1.10; // Diamond tier +10%
  const topCalculatedBdt = Number(
    (((topTargetAds * adUnitPrice) + (topTargetRefs * refUnitPrice) + baseTaskBonus) * top1TierBoost).toFixed(2)
  );

  const rawCandidates: RawCandidate[] = [];

  // Generate 100 profiles with realistic varied "kom-beshi" distribution
  for (let i = 0; i < 100; i++) {
    const isCurrentUserSlot = i === 26; // 0-indexed #26 is Rank 27
    const profile = REAL_BD_TELEGRAM_USERS[i % REAL_BD_TELEGRAM_USERS.length];

    if (isCurrentUserSlot) {
      // Current user slot
      let userAds = topTargetAds;
      let userRefs = topTargetRefs;

      if (period === 'allTime') {
        userAds = Math.max(currentUser.totalAdsWatched || 0, 680);
        userRefs = Math.max(currentUser.totalReferrals || 0, 125);
      } else if (period === 'monthly') {
        userAds = Math.max(currentUser.totalAdsWatched || 0, 390);
        userRefs = Math.max(currentUser.totalReferrals || 0, 68);
      } else if (period === 'weekly') {
        userAds = Math.max(currentUser.totalAdsWatched || 0, 160);
        userRefs = Math.max(currentUser.totalReferrals || 0, 29);
      } else {
        userAds = Math.max(currentUser.totalAdsWatched || 0, 38);
        userRefs = Math.max(currentUser.totalReferrals || 0, 8);
      }

      // Dynamic calculation for current user
      const userTaskEarnings = (baseTaskBonus * 0.35);
      const userTierBoost = 1.05;
      const userCalculatedBdt = Number(
        (((userAds * adUnitPrice) + (userRefs * refUnitPrice) + userTaskEarnings) * userTierBoost).toFixed(2)
      );

      rawCandidates.push({
        displayName: currentUser.fullName || 'You',
        username: currentUser.username || 'bd_earner_007',
        avatar: currentUser.avatarUrl,
        adsWatched: userAds,
        referralCount: userRefs,
        amountBdt: userCalculatedBdt,
        trend: 'up',
        trendChange: 3,
        isCurrentUser: true,
        candidateIndex: i,
      });
      continue;
    }

    if (i === 0) {
      // Top 1 Candidate: Exactly matched to user's specified benchmark
      // (top 1: 1570 ads, 379 refer for allTime)
      const topAds = topTargetAds;
      const topRefs = topTargetRefs;
      const topTaskBonus = baseTaskBonus;
      const topTierBoost = 1.10; // Diamond tier +10%

      const topCalculatedBdt = Number(
        (((topAds * adUnitPrice) + (topRefs * refUnitPrice) + topTaskBonus) * topTierBoost).toFixed(2)
      );

      rawCandidates.push({
        displayName: profile.displayName,
        username: profile.username,
        avatar: profile.avatar,
        adsWatched: topAds,
        referralCount: topRefs,
        amountBdt: topCalculatedBdt,
        trend: 'up',
        trendChange: 0,
        candidateIndex: i,
      });
      continue;
    }

    // Progression curve from rank 2 down to minimum rank 100
    const progress = (i - 1) / 98; // 0 for i=1 to 1 for i=99
    // Rank 2 starts at ~93% of top so Top 1 is undisputed champion
    const curve = 0.93 * Math.pow(1 - progress, 1.35);

    // Add realistic randomized "kom-beshi" fluctuations
    const r1 = seededRandom(i * 13 + 1); // for ads variance
    const r2 = seededRandom(i * 29 + 7); // for referrals variance
    const r3 = seededRandom(i * 47 + 19); // for tasks & bonus variance

    // Fluctuation ranges between -12% and +12%
    const adsJitter = 1 + ((r1 - 0.5) * 0.24);
    const refJitter = 1 + ((r2 - 0.5) * 0.26);

    const baseAds = Math.round(minAds + (topTargetAds - minAds) * curve);
    const baseRefs = Math.round(minRefs + (topTargetRefs - minRefs) * curve);

    // Ensure candidate ads and referrals do not exceed Top 1's benchmark
    const candidateAds = Math.min(topTargetAds - 15, Math.max(minAds, Math.round(baseAds * adsJitter)));
    const candidateRefs = Math.min(topTargetRefs - 8, Math.max(minRefs, Math.round(baseRefs * refJitter)));

    // Calculate income dynamically from this candidate's specific ads and referrals
    const candidateTasks = Math.max(2, Math.round((baseTaskBonus * curve) * (0.8 + r3 * 0.4)));
    const tierMultiplier = progress < 0.08 ? 1.08 : progress < 0.25 ? 1.06 : progress < 0.5 ? 1.04 : progress < 0.75 ? 1.02 : 1.0;

    let calculatedTaka = Number(
      (((candidateAds * adUnitPrice) + (candidateRefs * refUnitPrice) + candidateTasks) * tierMultiplier).toFixed(2)
    );

    // Ensure Rank 2+ is strictly below Top 1's income
    if (calculatedTaka >= topCalculatedBdt) {
      calculatedTaka = Number((topCalculatedBdt - 150 - (i * 25)).toFixed(2));
    }

    const trendTypes: ('up' | 'down' | 'neutral')[] = ['up', 'neutral', 'down', 'up', 'down'];
    const trend = trendTypes[i % trendTypes.length];
    const trendChange = trend === 'neutral' ? 0 : (i % 4) + 1;

    rawCandidates.push({
      displayName: profile.displayName,
      username: profile.username,
      avatar: profile.avatar,
      adsWatched: candidateAds,
      referralCount: candidateRefs,
      amountBdt: calculatedTaka,
      trend,
      trendChange,
      candidateIndex: i,
    });
  }

  // Ensure Top 1 is strictly highest, then sort remaining by amountBdt descending
  const top1Item = rawCandidates.find((c) => c.candidateIndex === 0) || rawCandidates[0];
  const otherItems = rawCandidates.filter((c) => c.candidateIndex !== 0);

  otherItems.sort((a, b) => b.amountBdt - a.amountBdt);

  const sortedCandidates = [top1Item, ...otherItems];

  // Map to final LeaderboardEntry with precise ranks and badges
  const finalTop100: LeaderboardEntry[] = sortedCandidates.slice(0, 100).map((c, idx) => {
    const rank = idx + 1;
    let badge: string | undefined = undefined;

    if (rank === 1) badge = '🥇 #1 Champion';
    else if (rank === 2) badge = '🥈 #2 Runner Up';
    else if (rank === 3) badge = '🥉 #3 Bronze';
    else if (rank <= 10) badge = '🔥 Top 10';
    else if (c.isCurrentUser) badge = '✨ YOU';

    return {
      rank,
      previousRank: c.trend === 'up' ? rank + c.trendChange : c.trend === 'down' ? Math.max(1, rank - c.trendChange) : rank,
      trend: c.trend,
      trendChange: c.trendChange,
      displayName: c.displayName,
      username: c.username,
      avatar: c.avatar,
      amountBdt: c.amountBdt,
      referralCount: c.referralCount,
      adsWatched: c.adsWatched,
      badge,
      country: 'BD',
      isCurrentUser: !!c.isCurrentUser,
    };
  });

  return finalTop100;
}
