import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, ChevronDown, CheckCircle2, AlertCircle, HelpCircle, Users, Coins, Zap, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReferralRulesAndFaq: React.FC = () => {
  const { language } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rules = [
    {
      id: 1,
      title: 'উইথড্র করতে সর্বনিম্ন ১৫টি রেফার বাধ্যতামূলক',
      desc: 'বিকাশ, নগদ বা রকেটে টাকা তোলার জন্য আপনার একাউন্টে সর্বনিম্ন ১৫ জন সফল রেফারেল থাকতে হবে।',
      badge: '15 Referrals Must',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Users,
    },
    {
      id: 2,
      title: '১০% লাইফটাইম প্যাসিভ কমিশন',
      desc: 'আপনার রেফারেলরা যতবার কাজ করবে বা বিজ্ঞাপন দেখবে, তাদের প্রতি আয়ের ১০% সাথে সাথে আপনার ওয়ালেটে জমা হবে।',
      badge: '10% Lifetime',
      badgeColor: 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20',
      icon: Coins,
    },
    {
      id: 3,
      title: 'অ্যাক্টিভ রেফারেল নীতিমালা',
      desc: 'রেফার করা বন্ধুকে অন্তত ১টি মাইক্রো টাস্ক বা অ্যাড দেখে একাউন্ট সক্রিয় (Qualified) করতে হবে।',
      badge: 'Active Verification',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: CheckCircle2,
    },
    {
      id: 4,
      title: 'ফেক রেফার ও ক্লোন অ্যাপ সম্পূর্ণ নিষিদ্ধ',
      desc: 'একই ফোনে একাধিক আইডি, ক্লোন অ্যাপ, ফেক টেলিগ্রাম অ্যাকাউন্ট বা VPN ব্যবহার করলে একাউন্ট আজীবনের জন্য ব্যান হবে।',
      badge: 'Strict Anti-Fraud',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: ShieldAlert,
    },
    {
      id: 5,
      title: 'স্বয়ংক্রিয় রিয়েল-টাইম ডাটা ট্র্যাকিং',
      desc: 'প্রতিটি রেফারের তথ্য টেলিগ্রাম অথেন্টিকেশনের মাধ্যমে এনক্রিপ্টেড ডাটাবেজে তাৎক্ষণিক রেকর্ড ও ভেরিফাই হয়।',
      badge: 'Real-Time Sync',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Zap,
    },
  ];

  const faqs = [
    {
      q: 'রেফার করার পর টাকা কখন জমা হয়?',
      a: 'বন্ধু আপনার রেফারেল লিংকে ক্লিক করে টেলিগ্রাম বটে জয়েন করে কাজ শুরু করলেই ইনস্ট্যান্ট রেফার বোনাস ও ১০% কমিশন আপনার ওয়ালেটে যুক্ত হবে।',
    },
    {
      q: '১৫ জন রেফারের আগে কি উইথড্র করা যাবে?',
      a: 'না। সিকিউরিটি ও প্ল্যাটফর্ম পলিসি অনুযায়ী উইথড্র অপশন সক্রিয় হতে অ্যাকাউন্টে সর্বনিম্ন ১৫ জন সফল রেফারেল এবং ৯০০ টাকা ব্যালেন্স থাকা আবশ্যক।',
    },
    {
      q: 'আমার রেফার করা বন্ধুরা কাজ না করলে কি কমিশন পাবো?',
      a: 'না। শুধুমাত্র নিষ্ক্রিয় বা ফেক একাউন্ট থেকে কমিশন পাওয়া যায় না। বন্ধুরা যখন সক্রিয়ভাবে অ্যাড ও মাইক্রো কাজ করবে, তখনই কমিশন পাওয়া যাবে।',
    },
    {
      q: 'মাইলস্টোন বোনাস কীভাবে ক্লেইম করবো?',
      a: 'আপনার রেফারেল ৫, ১০, ২৫, ৫০ বা ১০০ পূর্ণ হলে মাইলস্টোন কার্ডে সরাসরি "CLAIM" বাটন চলে আসবে। ক্লিক করার সাথে সাথে ক্যাশ টাকা মেইন ব্যালেন্সে যোগ হবে।',
    },
  ];

  return (
    <div 
      id="referral-rules-card"
      className="p-4 rounded-[22px] bg-[#141416] border border-[#232328] shadow-xl space-y-3.5 relative overflow-hidden"
    >
      {/* Rules Header */}
      <div className="flex items-center justify-between border-b border-[#1F1F24] pb-2.5 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black text-white uppercase tracking-wider truncate">
              রেফারেলের নিয়ম ও শর্তাবলী (REFERRAL RULES)
            </h3>
            <p className="text-[10px] text-[#8E8E93] truncate">
              সঠিকভাবে রেফার করে আজীবন আয় নিশ্চিত করুন
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 whitespace-nowrap shrink-0">
          Official Terms
        </span>
      </div>

      {/* 5 Essential Rules List */}
      <div className="space-y-2 text-[11px]">
        {rules.map((r) => {
          const Icon = r.icon;
          return (
            <div 
              key={r.id}
              className="p-2.5 rounded-xl bg-[#0E0E10] border border-[#1F1F24] flex items-start gap-2.5"
            >
              <div className="w-6 h-6 rounded-lg bg-[#18181C] text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-[#232328]">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-white text-xs leading-snug">{r.title}</span>
                  <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border whitespace-nowrap shrink-0 ${r.badgeColor}`}>
                    {r.badge}
                  </span>
                </div>
                <p className="text-[10.5px] text-[#8E8E93] leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accordion FAQ in Bengali */}
      <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span>সাধারণ জিজ্ঞাসাসমূহ (FAQ)</span>
        </div>

        <div className="space-y-1.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0E0E10] border border-[#1F1F24] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-2.5 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-[#141418] transition-colors"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#8E8E93] transition-transform ${
                      isOpen ? 'rotate-180 text-[#00E5FF]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-2.5 text-[10.5px] text-[#8E8E93] border-t border-[#1F1F24] pt-2 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
