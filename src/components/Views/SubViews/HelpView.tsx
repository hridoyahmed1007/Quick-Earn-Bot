import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const HelpView: React.FC = () => {
  const { goBack, language, profileConfig } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isBn = language === 'bn' || language === 'mixed';
  const support = profileConfig?.support;

  const faqs = (profileConfig?.faqs && profileConfig.faqs.length > 0)
    ? profileConfig.faqs.filter((f) => f.isActive !== false)
    : [
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
          aEn: 'Usually cashout payments are sent automatically within 5 minutes to 1 hour after verification.',
          aBn: 'সাধারণত ৫ মিনিট থেকে ১ ঘণ্টার মধ্যে টাকা একাউন্টে চলে আসে।',
          displayOrder: 3,
          isActive: true,
          updatedAt: '2026-08-15 10:00:00',
        },
      ];

  return (
    <div className="space-y-4 pb-28">
      {/* Back Navigation Bar */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-white">
            {isBn ? 'সাহায্য ও সাপোর্ট সেন্টার' : 'Help & Support Center'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {isBn ? 'টেলিগ্রাম কমিউনিটি ও সাপোর্ট টিমের সাথে যোগ দিন' : 'Telegram support community & FAQ'}
          </p>
        </div>
      </div>

      {/* Official Telegram Support Links */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={support?.telegram?.link || 'https://t.me/QuickEarnSupport'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/30 text-center flex flex-col items-center gap-1.5 shadow-md hover:border-cyan-400 transition-all"
        >
          <Send className="w-6 h-6 text-cyan-400" />
          <span className="text-xs font-bold text-white">{support?.telegram?.title || 'Telegram Channel'}</span>
          <span className="text-[10px] text-slate-400">Official Notice Board</span>
        </a>

        <a
          href={support?.whatsapp?.link || 'https://t.me/QuickEarnAdminBot'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/30 text-center flex flex-col items-center gap-1.5 shadow-md hover:border-emerald-400 transition-all"
        >
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          <span className="text-xs font-bold text-white">{support?.whatsapp?.title || '24/7 Helpline Bot'}</span>
          <span className="text-[10px] text-slate-400">Live Support Chat</span>
        </a>
      </div>

      {/* FAQ Accordion */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'সাধারণ জিজ্ঞাসাবলী (FAQ)' : 'Frequently Asked Questions'}</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.id || idx} className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-white hover:text-emerald-300 transition-colors"
                >
                  <span>{isBn ? faq.qBn : faq.qEn}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-1 text-xs text-slate-400 border-t border-slate-900 leading-relaxed">
                    {isBn ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
