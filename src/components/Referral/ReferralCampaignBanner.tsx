import React from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_REFERRAL_CAMPAIGN } from '../../data/mockData';

interface ReferralCampaignBannerProps {
  onOpenShareSheet: () => void;
}

export const ReferralCampaignBanner: React.FC<ReferralCampaignBannerProps> = ({ onOpenShareSheet }) => {
  const campaign = MOCK_REFERRAL_CAMPAIGN;

  if (!campaign || !campaign.isActive) return null;

  return (
    <div className="p-3.5 rounded-[20px] bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-rose-500/15 border border-amber-500/30 shadow-lg relative overflow-hidden flex items-center justify-between gap-3">
      {/* Background Subtle Flame Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
          <Flame className="w-5 h-5 fill-amber-400" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
              🔥 Referral Boost Active
            </h3>
            <span className="px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
              Limited Event
            </span>
          </div>

          <p className="text-[10px] text-[#EDEDED] mt-0.5 leading-snug">
            Earn extra 10% commission + ৳100 milestone bonus!
          </p>

          <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono mt-1">
            <Clock className="w-3 h-3" />
            <span>Ends in {campaign.endsAt}</span>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={onOpenShareSheet}
        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md transition-all"
      >
        <span>INVITE NOW</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
};
