import React, { useState } from 'react';
import { ReferralHeroCard } from '../Referral/ReferralHeroCard';
import { ReferralLinkCard } from '../Referral/ReferralLinkCard';
import { ReferralStepByStep } from '../Referral/ReferralStepByStep';
import { ReferralRulesAndFaq } from '../Referral/ReferralRulesAndFaq';
import { ReferralHistoryTabs } from '../Referral/ReferralHistoryTabs';
import { ReferralShareSheet } from '../Referral/ReferralShareSheet';

export const ReferralView: React.FC = () => {
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  return (
    <div className="space-y-4 pb-28 max-w-lg mx-auto select-none">
      {/* 1. Super Premium Referral Hero & Earnings Card */}
      <ReferralHeroCard />

      {/* 2. Referral Link & Sharing Console */}
      <ReferralLinkCard onOpenShareSheet={() => setIsShareSheetOpen(true)} />

      {/* 3. Step by Step Referral Guide in Bengali */}
      <ReferralStepByStep />

      {/* 4. Bengali Rules, Anti-Fraud Terms & FAQ */}
      <ReferralRulesAndFaq />

      {/* 5. Referral Members & Commission History Tabs */}
      <ReferralHistoryTabs />

      {/* Bottom Share Sheet */}
      <ReferralShareSheet
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
      />
    </div>
  );
};
