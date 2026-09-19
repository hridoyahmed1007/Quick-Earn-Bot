import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturedOpportunity: React.FC = () => {
  const { channelTasks, microJobs, openEarningTab } = useApp();

  // Find a high paying featured opportunity
  const featuredTask = channelTasks.find((t) => !t.isJoined) || microJobs.find((j) => !j.isSubmitted);

  if (!featuredTask) return null;

  const isChannel = 'channelName' in featuredTask;
  const title = isChannel ? `Join Telegram Channel: ${(featuredTask as any).title}` : (featuredTask as any).title;
  const rewardBdt = (featuredTask as any).rewardBdt || 10.0;

  return (
    <div className="p-4 rounded-[22px] bg-gradient-to-r from-[#161618] via-[#1A1A1E] to-[#161618] border border-[#00E5FF30] shadow-lg relative overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF10] rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase tracking-wider">
                🔥 SPECIAL OFFER
              </span>
            </div>

            <p className="text-xs font-bold text-white mt-1 leading-snug line-clamp-1">
              "{title}"
            </p>

            <span className="text-xs font-black text-[#00E5FF] block mt-0.5">
              +৳{rewardBdt.toFixed(2)} Instant Credit
            </span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => openEarningTab(isChannel ? 'channel_tasks' : 'micro_jobs')}
          className="px-3.5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] font-black text-xs shadow-md glow-cyan transition-all flex items-center gap-1 shrink-0"
        >
          <span>CLAIM NOW</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
};
