import React from 'react';
import { HelpCircle, AlertCircle, ShieldCheck, Radio, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChannelTaskRulesAndNotice: React.FC = () => {
  const { language } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  const rules = isBn
    ? [
        'Available Telegram channel বা গ্রুপ সিলেক্ট করুন।',
        '"Join Channel in Telegram" বাটনে ক্লিক করে টেলিগ্রাম অ্যাপে জয়েন করুন।',
        'জয়েন করার পর ১০ সেকেন্ড অপেক্ষা করে Verify Now বাটনে চাপুন।',
        'বট স্বয়ংক্রিয়ভাবে সদস্যপদ ভেরিফাই করে ইনস্ট্যান্ট রিওয়ার্ড ওয়ালেটে যোগ করবে।',
        'চ্যানেল থেকে আনসাবস্ক্রাইব করবেন না, এতে অর্জিত রিওয়ার্ড বাতিল হতে পারে।',
      ]
    : [
        'Select an available Telegram channel or community group.',
        'Click "Join Channel in Telegram" and join in Telegram app.',
        'Wait 10 seconds and click the "Verify Now" button.',
        'Automated bot verifies membership and credits your wallet instantly.',
        'Do not leave or unsubscribe from channels to keep your reward valid.',
      ];

  return (
    <div className="space-y-3 pt-1">
      {/* Rules Card */}
      <div className="p-4 rounded-[22px] bg-[#161618] border border-[#232326] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {isBn ? 'How Telegram Channel Earning Works 💡' : 'How Telegram Channel Earning Works 💡'}
            </h3>
            <p className="text-[10px] text-[#8E8E93]">
              {isBn ? 'টেলিগ্রাম চ্যানেল টাস্কের সহজ নিয়মাবলী' : 'Simple rules to earn from Telegram channel tasks'}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#EDEDED]">
              <span className="w-5 h-5 rounded-full bg-[#1F1F22] border border-[#2A2A2E] text-blue-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                {idx + 1}
              </span>
              <p className="text-[11px] leading-snug">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Card */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            {isBn ? 'Important Notice • গুরুত্বপূর্ণ তথ্য' : 'Important Notice'}
          </h4>
        </div>
        <p className="text-[11px] text-[#8E8E93] leading-relaxed pl-1">
          {isBn
            ? '«Note: সব চ্যানেল ও গ্রুপ প্রতিবার available নাও থাকতে পারে। স্পনসর স্লট, রিজিয়ন এলিজিবিলিটি এবং টেলিগ্রাম বট নিয়মের ভিত্তিতে নতুন টাস্ক যোগ হয়।»'
            : '«Note: Channels availability depends on sponsor slots, region eligibility, and Telegram Bot verification guidelines.»'}
        </p>
      </div>

      {/* Anti-Abuse System Badge */}
      <div className="p-3 rounded-2xl bg-[#111113] border border-[#1C1C1F] flex items-center justify-between text-xs text-[#8E8E93]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-semibold">
            Anti-Fraud & Telegram Bot API Protected
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          PROTECTED
        </span>
      </div>
    </div>
  );
};
