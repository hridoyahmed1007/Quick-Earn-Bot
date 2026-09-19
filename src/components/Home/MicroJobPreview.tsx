import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Clock, ArrowRight, ThumbsUp, Youtube, Smartphone, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MicroJob } from '../../types';
import { MicroJobDetailsModal } from '../EarningHub/MicroJobDetailsModal';

export const MicroJobPreview: React.FC = () => {
  const { microJobs, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<MicroJob | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'website', label: 'Website' },
    { id: 'digital', label: 'Apps' },
  ];

  const filteredJobs = (microJobs || []).filter((j) => {
    if (selectedCategory === 'all') return true;
    return j.category === selectedCategory;
  });

  const getJobIcon = (category: string) => {
    switch (category) {
      case 'facebook':
        return <ThumbsUp className="w-4 h-4 text-blue-400" />;
      case 'youtube':
      case 'social':
        return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'website':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'digital':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      default:
        return <CheckSquare className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            Micro Jobs 💼
          </h3>
          <p className="text-[10px] text-[#8E8E93]">
            Complete simple tasks & earn cash rewards
          </p>
        </div>

        <button
          onClick={() => navigateTo('ads')}
          className="text-[10px] font-bold text-[#00E5FF] hover:underline flex items-center gap-0.5"
        >
          <span>View Hub ({(microJobs || []).length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full font-bold text-[11px] whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#00E5FF] text-[#0A0A0B] shadow-sm'
                : 'bg-[#161618] text-[#8E8E93] border border-[#232326] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="space-y-2">
        {filteredJobs.slice(0, 3).map((job) => {
          const isSubmitted = job.status === 'pending' || job.status === 'completed';

          return (
            <div
              key={job.id}
              className="p-3.5 rounded-2xl bg-[#161618] border border-[#232326] flex items-center justify-between gap-3 hover:border-[#2A2A2E] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#222224] flex items-center justify-center shrink-0 border border-[#2A2A2E]">
                  {getJobIcon(job.category)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {job.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#8E8E93]">
                    <span className="font-bold text-[#00E5FF]">+৳{job.rewardBdt.toFixed(2)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {job.estimatedTime}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{job.status}</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedJob(job)}
                disabled={isSubmitted}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSubmitted
                    ? 'bg-[#222224] text-[#8E8E93] border border-[#2A2A2E]'
                    : 'bg-[#1F1F22] hover:bg-[#00E5FF] hover:text-[#0A0A0B] text-[#00E5FF] border border-[#2A2A2E] shadow-sm'
                }`}
              >
                {isSubmitted ? job.status.toUpperCase() : 'START'}
              </motion.button>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <MicroJobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
