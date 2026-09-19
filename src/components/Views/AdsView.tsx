import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  const { activeEarningTab, setActiveEarningTab } = useApp();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [activeAdSession, setActiveAdSession] = useState<AdProvider | null>(null);

  return (
    <div className="space-y-3.5 pb-28">
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
