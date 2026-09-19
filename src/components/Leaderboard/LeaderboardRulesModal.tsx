import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Scale, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LeaderboardRulesModalProps {
  onClose: () => void;
}

export const LeaderboardRulesModal: React.FC<LeaderboardRulesModalProps> = ({ onClose }) => {
  const { language } = useApp();

  const rules = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
      titleEn: '1. Verified Activity Counts',
      titleBn: '১. শুধুমাত্র ভেরিফাইড অ্যাক্টিভিটি গণনা হবে',
      descEn: 'Only completed ads, approved micro jobs, verified channel tasks, and qualified referrals add to your score.',
      descBn: 'শুধুমাত্র সফলভাবে দেখা অ্যাড, অ্যাপ্রুভ হওয়া কাজ, চ্যানেল জয়েন ও কোয়ালিফাইড রেফারেল স্কোরে যুক্ত হবে।',
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
      titleEn: '2. Zero Tolerance for Fraud',
      titleBn: '২. প্রতারণা বা জালিয়াতি সম্পূর্ণ নিষিদ্ধ',
      descEn: 'Invalid activity, self-referrals, bot scripts, or fake proof submissions are automatically excluded and lead to leaderboard ban.',
      descBn: 'ভুয়া সাবমিশন, সেলফ-রেফারেল বা কোনো প্রকার অটোমেশন স্ক্রিপ্ট ব্যবহার করলে লিডারবোর্ড থেকে রিমুভ ও অ্যাকাউন্ট ব্যান হবে।',
    },
    {
      icon: <Scale className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
      titleEn: '3. Predefined Tie-Breaker Priority',
      titleBn: '৩. সমান পয়েন্টে টাই-ব্রেকার নিয়ম',
      descEn: 'If two members have equal scores, priority is given to: 1) Higher overall verified earnings 2) Earlier achievement time 3) Higher qualified activity.',
      descBn: 'দুইজনের পয়েন্ট সমান হলে অগ্রাধিকার: ১) বেশি মোট ভেরিফাইড আয় ২) আগের অর্জন সময় ৩) বেশি কোয়ালিফাইড টাস্ক সম্পন্ন।',
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />,
      titleEn: '4. Server-Side Calculations',
      titleBn: '৪. সম্পূর্ণ সার্ভার-সাইড ক্যাশ্ড র‍্যাংকিং Engine',
      descEn: 'Scores and ranks are calculated securely on backend engines without relying on client-side state manipulation.',
      descBn: 'র‍্যাংক ও স্কোর নিরাপদে ব্যাকএন্ড ইঞ্জিনের মাধ্যমে সার্ভার-সাইডে ক্যাশ করে ইনস্ট্যান্ট আপডেট দেওয়া হয়।',
    },
    {
      icon: <Award className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />,
      titleEn: '5. Reward Distribution Policy',
      titleBn: '৫. পুরস্কার বিতরণ নীতি',
      descEn: 'Daily rewards credit automatically at midnight UTC. Weekly and monthly rewards pass a 24-hour verification check before cashout distribution.',
      descBn: 'ডেইলি রিওয়ার্ড স্বয়ংক্রিয়ভাবে প্রদান হয়। উইকলি ও মান্থলি রিওয়ার্ড ২৪ ঘণ্টার অ্যান্টি-ফ্রড চেকের পর ব্যালেন্সে যুক্ত হয়।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#121214] border border-[#232326] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#232326] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF15] border border-[#00E5FF30] flex items-center justify-center text-[#00E5FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'লিডারবোর্ড নিয়মাবলী' : 'How Ranking Works'}
              </h3>
              <p className="text-[10px] text-[#8E8E93]">
                {language === 'bn' ? 'স্বচ্ছ ও ফেয়ার লিডারবোর্ড সিস্টেমের নিয়মসমূহ' : 'Transparent & fair competitive guidelines'}
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

        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#1A1A1E] border border-[#2A2A2E] flex items-start gap-3">
              {rule.icon}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">
                  {language === 'bn' ? rule.titleBn : rule.titleEn}
                </h4>
                <p className="text-[11px] text-[#A1A1A6] leading-relaxed">
                  {language === 'bn' ? rule.descBn : rule.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-[#00E5FF10] border border-[#00E5FF25] text-[11px] text-[#00E5FF] font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {language === 'bn'
              ? 'সকল লিডারবোর্ড পয়েন্ট ১০০% রিয়েল অ্যাক্টিভিটি থেকে ভেরিফাই করা।'
              : 'All leaderboard rankings are 100% server-verified with anti-fraud safeguards.'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0A0A0B] font-bold text-xs shadow-lg transition-all"
        >
          {language === 'bn' ? 'বুঝেছি (Got It)' : 'Understood & Continue'}
        </button>
      </motion.div>
    </div>
  );
};
