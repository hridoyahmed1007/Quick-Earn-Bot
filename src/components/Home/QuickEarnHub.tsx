import React from 'react';
import { motion } from 'motion/react';
import { Tv, CheckSquare, Send, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EarningTabType } from '../../types';

export const QuickEarnHub: React.FC = () => {
  const { openEarningTab } = useApp();

  const cards: {
    id: EarningTabType;
    badge: string;
    title: string;
    subtitle: string;
    reward: string;
    color: string;
    icon: typeof Tv;
  }[] = [
    {
      id: 'ads',
      badge: '🎬 ADS',
      title: 'Watch & Earn',
      subtitle: 'Watch video ads for instant BDT rewards',
      reward: '৳2.50 / Ad',
      color: 'text-[#00E5FF] bg-[#00E5FF10] border-[#00E5FF20]',
      icon: Tv,
    },
    {
      id: 'micro_jobs',
      badge: '💼 MICRO JOBS',
      title: 'Complete Tasks',
      subtitle: 'Complete simple online micro tasks',
      reward: '৳5 - ৳25 / Job',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: CheckSquare,
    },
    {
      id: 'channel_tasks',
      badge: '📢 CHANNEL TASKS',
      title: 'Complete & Earn',
      subtitle: 'Join Telegram channels & earn points',
      reward: '৳3.00 / Channel',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Send,
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
          Earn More
        </h2>
        <span className="text-[10px] text-[#636366]">Select to start</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEarningTab(card.id)}
              className="p-3 rounded-[18px] bg-[#161618] border border-[#232326] hover:border-[#00E5FF40] cursor-pointer transition-all flex flex-col justify-between group shadow-sm text-center"
            >
              <div>
                <div className="w-9 h-9 mx-auto rounded-xl border flex items-center justify-center mb-2 group-hover:scale-105 transition-transform ${card.color}">
                  <Icon className="w-4 h-4 text-[#00E5FF]" />
                </div>

                <span className="text-[9px] font-extrabold text-[#00E5FF] bg-[#00E5FF10] px-1.5 py-0.5 rounded border border-[#00E5FF20] block truncate mb-1">
                  {card.badge}
                </span>

                <h3 className="text-[11px] font-bold text-white group-hover:text-[#00E5FF] transition-colors leading-tight">
                  "{card.title}"
                </h3>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#232326] flex items-center justify-center gap-1 text-[10px] font-bold text-[#00E5FF]">
                <span>Start</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
