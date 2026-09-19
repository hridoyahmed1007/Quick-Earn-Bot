import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, ChevronRight, ChevronLeft, BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Announcement {
  id: string;
  badge: string;
  title: string;
  content: string;
  date: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    badge: 'NEW PROVIDER',
    title: 'Monetag Ad Network Added! 🚀',
    content: 'Watch Monetag video ads to earn 20% more BDT today. High availability & instant rewards!',
    date: 'Today',
  },
  {
    id: 'a2',
    badge: 'CASHOUT UPDATE',
    title: 'Minimum Withdrawal Lowered to ৳200! 💳',
    content: 'You can now request cashouts via bKash, Nagad & Rocket starting at only ৳200 BDT.',
    date: 'Yesterday',
  },
  {
    id: 'a3',
    badge: 'NEW TASKS',
    title: 'Telegram Channel Tasks Active 📢',
    content: 'Join verified partner channels and receive instant BDT credits upon verification.',
    date: '2 days ago',
  },
];

export const AnnouncementAndRecent: React.FC = () => {
  const { showToast } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (isDismissed) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="p-3.5 rounded-[20px] bg-[#161618] border border-[#232326] shadow-md relative space-y-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20]">
            <Megaphone className="w-4 h-4" />
          </span>
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
            📢 ANNOUNCEMENTS
          </h2>
          <span className="px-1.5 py-0.5 rounded bg-[#00E5FF15] text-[#00E5FF] text-[9px] font-extrabold border border-[#00E5FF20]">
            {current.badge}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? ANNOUNCEMENTS.length - 1 : prev - 1))}
            className="p-1 rounded-lg text-[#8E8E93] hover:text-white hover:bg-[#1F1F22]"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-[#8E8E93] font-mono">
            {currentIndex + 1}/{ANNOUNCEMENTS.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
            className="p-1 rounded-lg text-[#8E8E93] hover:text-white hover:bg-[#1F1F22]"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-[#8E8E93] hover:text-rose-400 hover:bg-[#1F1F22] ml-1"
            title="Dismiss"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Slider */}
      <div className="p-2.5 rounded-xl bg-[#111113] border border-[#1C1C1F] min-h-[58px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <p className="text-[11px] font-bold text-white mb-0.5">
              {current.title}
            </p>
            <p className="text-[10px] text-[#8E8E93] leading-relaxed">
              {current.content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
