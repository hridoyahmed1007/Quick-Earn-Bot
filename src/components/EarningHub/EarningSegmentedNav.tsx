import React from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Briefcase, Radio } from 'lucide-react';
import { EarningTabType } from '../../types';
import { useApp } from '../../context/AppContext';

interface EarningSegmentedNavProps {
  activeTab: EarningTabType;
  onSelectTab: (tab: EarningTabType) => void;
  adsCount?: number;
  jobsCount?: number;
  channelsCount?: number;
}

export const EarningSegmentedNav: React.FC<EarningSegmentedNavProps> = ({
  activeTab,
  onSelectTab,
  adsCount = 12,
  jobsCount = 5,
  channelsCount = 3,
}) => {
  const { language } = useApp();

  const tabs = [
    {
      id: 'ads' as EarningTabType,
      labelEn: 'Ads',
      labelBn: 'বিজ্ঞাপন',
      icon: PlayCircle,
      badge: adsCount,
      activeBgClass: 'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-[#0A0A0B] shadow-md shadow-[#00E5FF20]',
      activeTextColor: 'text-[#0A0A0B]',
      activeIconColor: 'text-[#0A0A0B]',
    },
    {
      id: 'micro_jobs' as EarningTabType,
      labelEn: 'Micro Jobs',
      labelBn: 'মাইক্রো জবস',
      icon: Briefcase,
      badge: jobsCount,
      activeBgClass: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
    {
      id: 'channel_tasks' as EarningTabType,
      labelEn: 'Channel Tasks',
      labelBn: 'চ্যানেল টাস্ক',
      icon: Radio,
      badge: channelsCount,
      activeBgClass: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20',
      activeTextColor: 'text-white',
      activeIconColor: 'text-white',
    },
  ];

  return (
    <div className="bg-[#161618] backdrop-blur-md p-1.5 rounded-2xl border border-[#232326] shadow-lg">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 outline-none select-none ${
                isActive
                  ? tab.activeTextColor
                  : 'text-[#8E8E93] hover:text-white hover:bg-[#1F1F22]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="earningTabHighlight"
                  className={`absolute inset-0 rounded-xl ${tab.activeBgClass}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10 flex items-center gap-1.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? tab.activeIconColor : 'text-[#8E8E93]'
                  }`}
                />
                <span className="truncate">
                  {language === 'bn' ? tab.labelBn : tab.labelEn}
                </span>
              </span>

              {tab.badge > 0 && (
                <span
                  className={`relative z-10 px-1.5 py-0.5 text-[10px] font-black rounded-full transition-colors ${
                    isActive
                      ? tab.id === 'ads'
                        ? 'bg-[#0A0A0B]/20 text-[#0A0A0B]'
                        : 'bg-white/20 text-white'
                      : 'bg-[#232326] text-[#8E8E93] border border-[#2A2A2E]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
