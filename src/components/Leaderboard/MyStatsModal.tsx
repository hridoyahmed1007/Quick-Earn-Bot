import React from 'react';
import { motion } from 'motion/react';
import { X, BarChart3, TrendingUp, Tv, Users, CheckSquare, Send, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MyStatsModalProps {
  onClose: () => void;
}

export const MyStatsModal: React.FC<MyStatsModalProps> = ({ onClose }) => {
  const { user, language, achievements } = useApp();

  const totalEarned = Number((user.bdtBalance + user.totalCashoutBdt).toFixed(2));
  const microJobsEarned = (user.completedMicroJobs || 0) * 5.0;
  const referralsEarned = user.referralEarningsBdt || 0;
  const adsEarned = (user.completedAds || 0) * 2.5;
  const channelsEarned = (user.completedChannelTasks || 0) * 4.0;
  const sumEarned = Math.max(1, microJobsEarned + referralsEarned + adsEarned + channelsEarned);

  const performanceBreakdown = [
    {
      label: language === 'bn' ? 'মাইক্রো জবস (Jobs)' : 'Micro Jobs',
      amountBdt: microJobsEarned,
      percent: Math.round((microJobsEarned / sumEarned) * 100),
      icon: <CheckSquare className="w-4 h-4 text-[#00E5FF]" />,
      color: 'bg-[#00E5FF]',
    },
    {
      label: language === 'bn' ? 'রেফারেল (Referrals)' : 'Referral Commission',
      amountBdt: referralsEarned,
      percent: Math.round((referralsEarned / sumEarned) * 100),
      icon: <Users className="w-4 h-4 text-purple-400" />,
      color: 'bg-purple-500',
    },
    {
      label: language === 'bn' ? 'ভিডিও এডস (Ads)' : 'Video Ads',
      amountBdt: adsEarned,
      percent: Math.round((adsEarned / sumEarned) * 100),
      icon: <Tv className="w-4 h-4 text-emerald-400" />,
      color: 'bg-emerald-500',
    },
    {
      label: language === 'bn' ? 'চ্যানেল টাস্ক (Channels)' : 'Channel Tasks',
      amountBdt: channelsEarned,
      percent: Math.round((channelsEarned / sumEarned) * 100),
      icon: <Send className="w-4 h-4 text-cyan-400" />,
      color: 'bg-cyan-500',
    },
  ];

  const rankHistory = [
    { period: language === 'bn' ? 'আজ (Today)' : 'Today', rank: '#27', change: '+4 positions', trend: 'up' },
    { period: language === 'bn' ? 'গতকাল (Yesterday)' : 'Yesterday', rank: '#31', change: '+14 positions', trend: 'up' },
    { period: language === 'bn' ? '৭ দিন আগে (7 Days Ago)' : '7 Days Ago', rank: '#45', change: '+17 positions', trend: 'up' },
    { period: language === 'bn' ? '৩০ দিন আগে (30 Days Ago)' : '30 Days Ago', rank: '#62', change: '+35 positions', trend: 'up' },
  ];

  const badges = achievements.map((a) => ({
    titleEn: a.titleEn,
    titleBn: a.titleBn,
    icon: a.category === 'referral' ? '👥' : a.category === 'ads' ? '🎬' : a.category === 'withdrawal' ? '💳' : '🏆',
    unlocked: a.unlocked || a.claimed,
    date: a.unlockedAt || 'In progress',
  }));

  const [imgErr, setImgErr] = React.useState(false);
  const cleanFullName = (user.fullName || '').trim();
  const cleanUsername = (user.username || '').replace(/^@/, '').trim();
  const displayName = cleanFullName || (cleanUsername ? `@${cleanUsername}` : 'You');
  const avatarLetter = displayName.replace(/^@/, '').charAt(0).toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#121214] border border-[#232326] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#232326] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden object-cover ring-2 ring-[#00E5FF] bg-[#161618] flex items-center justify-center shrink-0">
              {user.avatarUrl && !imgErr ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  onError={() => setImgErr(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#2AABEE] to-[#00E5FF] flex items-center justify-center text-white font-black text-sm select-none">
                  {avatarLetter}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{displayName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5FF15] text-[#00E5FF] font-extrabold border border-[#00E5FF20]">
                  #27 RANK
                </span>
              </h3>
              <p className="text-[10px] text-[#8E8E93]">
                {cleanUsername ? `@${cleanUsername} • ` : ''}{language === 'bn' ? 'ব্যক্তিগত পারফরম্যান্স ও পরিসংখ্যান' : 'Personal Performance Statistics'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1C1C1F] text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 4 Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E]">
            <p className="text-[10px] text-[#8E8E93]">{language === 'bn' ? 'মোট আর্নিং' : 'Total Earned'}</p>
            <p className="text-sm font-bold text-[#00E5FF] mt-0.5">৳{totalEarned.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E]">
            <p className="text-[10px] text-[#8E8E93]">{language === 'bn' ? 'রেফারেলস' : 'Referrals'}</p>
            <p className="text-sm font-bold text-purple-400 mt-0.5">{user.totalReferrals} Users</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E]">
            <p className="text-[10px] text-[#8E8E93]">{language === 'bn' ? 'ভিডিও এডস' : 'Ads Watched'}</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">{user.completedAds || 0} Ads</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E]">
            <p className="text-[10px] text-[#8E8E93]">{language === 'bn' ? 'টাস্ক সম্পন্ন' : 'Jobs Completed'}</p>
            <p className="text-sm font-bold text-amber-400 mt-0.5">{user.completedMicroJobs || 0} Jobs</p>
          </div>
        </div>

        {/* Earning Sources Breakdown */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-[#232326] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
              <span>{language === 'bn' ? 'আয়ের উৎস বিশ্লেষণ (Breakdown)' : 'Earning Sources Breakdown'}</span>
            </h4>
            <span className="text-[11px] font-bold text-[#00E5FF]">৳{totalEarned.toFixed(2)} Total</span>
          </div>

          <div className="space-y-2.5">
            {performanceBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className="text-[#8E8E93] font-bold">
                    ৳{item.amountBdt.toFixed(2)} ({item.percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#232326] overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rank History Timeline */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-[#232326] space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'র‍্যাংক প্রগ্রেস হিস্ট্রি' : 'Rank History Progression'}</span>
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {rankHistory.map((h, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#131315] border border-[#232326] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#8E8E93]">{h.period}</p>
                  <p className="text-xs font-bold text-white">{h.rank}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ↑ {h.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges Unlocked */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-[#232326] space-y-2.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{language === 'bn' ? 'অ্যাচিভমেন্ট ব্যাজসমূহ' : 'Achievement Badges'}</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map((b, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  b.unlocked
                    ? 'bg-[#1A1A1E] border-[#00E5FF30] text-white'
                    : 'bg-[#131315] border-[#232326] opacity-40 text-[#8E8E93]'
                }`}
              >
                <span className="text-base">{b.icon}</span>
                <div>
                  <p className="text-[11px] font-bold leading-tight">
                    {language === 'bn' ? b.titleBn : b.titleEn}
                  </p>
                  <p className="text-[9px] text-[#8E8E93]">
                    {b.unlocked ? b.date : language === 'bn' ? 'লকড' : 'Locked'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0A0A0B] font-bold text-xs shadow-lg transition-all"
        >
          {language === 'bn' ? 'বন্ধ করুন' : 'Close Statistics'}
        </button>
      </motion.div>
    </div>
  );
};
