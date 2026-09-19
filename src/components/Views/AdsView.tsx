import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EarningTabType, AdProvider } from '../../types';
import { EarningSegmentedNav } from '../EarningHub/EarningSegmentedNav';
import { EarningSummaryCard } from '../EarningHub/EarningSummaryCard';
import { SmartRecommendations } from '../EarningHub/SmartRecommendations';
import { MicroJobsSection } from '../EarningHub/MicroJobsSection';
import { ChannelTasksSection } from '../EarningHub/ChannelTasksSection';
import { EarningHubInfoModal } from '../EarningHub/EarningHubInfoModal';
import { AdSessionModal } from '../EarningHub/AdSessionModal';

// Existing Ads Components
import { AdProvidersGrid } from '../Ads/AdProvidersGrid';
import { AdStatisticsCard } from '../Ads/AdStatisticsCard';
import { AdRulesAndNotice } from '../Ads/AdRulesAndNotice';

export const AdsView: React.FC = () => {
  const { activeEarningTab, setActiveEarningTab, setIsAdminModalOpen, language } = useApp();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [activeAdSession, setActiveAdSession] = useState<AdProvider | null>(null);

  return (
    <div className="space-y-3.5 pb-28">
      {/* Admin Quick Control Banner */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#141416] border border-[#232326] shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-white block">
              {language === 'bn' ? 'অ্যাডমিন কন্ট্রোল প্যানেল' : 'Admin Control Panel'}
            </span>
            <span className="text-[9px] text-[#8E8E93] block">
              {language === 'bn' ? 'বিজ্ঞাপন, জবস ও চ্যানেল টাস্ক ম্যানেজ করুন' : 'Manage Ads, Micro Jobs & Channels'}
            </span>
          </div>
        </div>
        <button
          id="open_admin_ads_panel_btn"
          onClick={() => setIsAdminModalOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-black transition-all"
        >
          <Sliders className="w-3 h-3" />
          <span>{language === 'bn' ? 'ম্যানেজ করুন' : 'Manage Ads'}</span>
        </button>
      </div>

      {/* 1. Total Earning Summary Card (Ultra Premium) */}
      <EarningSummaryCard />

      {/* 2. Three-Section Segmented Navigation */}
      <EarningSegmentedNav
        activeTab={activeEarningTab}
        onSelectTab={(tab) => setActiveEarningTab(tab)}
      />

      {/* 3. Smart Recommendation Banner */}
      <SmartRecommendations onSelectTab={(tab) => setActiveEarningTab(tab)} />

      {/* 4. Active Earning Section Content with Smooth Slide/Fade Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEarningTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeEarningTab === 'ads' && (
            <div className="space-y-4">
              {/* Available Ad Providers Grid */}
              <AdProvidersGrid />

              {/* Ad Statistics */}
              <AdStatisticsCard />

              {/* Ad Rules & Notice */}
              <AdRulesAndNotice />
            </div>
          )}

          {activeEarningTab === 'micro_jobs' && <MicroJobsSection />}

          {activeEarningTab === 'channel_tasks' && <ChannelTasksSection />}
        </motion.div>
      </AnimatePresence>

      {/* Info & Policy Modal */}
      <EarningHubInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* Ad Watch Session Modal */}
      <AdSessionModal
        provider={activeAdSession}
        onClose={() => setActiveAdSession(null)}
      />
    </div>
  );
};
