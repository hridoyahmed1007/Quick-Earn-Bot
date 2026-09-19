import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Briefcase } from 'lucide-react';
import { MicroJob, JobCategory, JobDifficulty } from '../../types';
import { useApp } from '../../context/AppContext';
import { MicroJobCard } from './MicroJobCard';
import { MicroJobDetailsModal } from './MicroJobDetailsModal';
import { MicroJobRulesAndNotice } from './MicroJobRulesAndNotice';

export const MicroJobsSection: React.FC = () => {
  const { microJobs, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobModal, setSelectedJobModal] = useState<MicroJob | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Category filter tabs
  const categories: { id: JobCategory; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Jobs', labelBn: 'সব কাজ' },
    { id: 'facebook', labelEn: 'Facebook', labelBn: 'ফেসবুক' },
    { id: 'social', labelEn: 'Social Media', labelBn: 'সোশ্যাল' },
    { id: 'website', labelEn: 'Website Visit', labelBn: 'ওয়েবসাইট' },
    { id: 'digital', labelEn: 'App Download', labelBn: 'অ্যাপস' },
    { id: 'other', labelEn: 'Surveys & Other', labelBn: 'অন্যান্য' },
  ];

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return microJobs.filter((job) => {
      // Category check
      if (selectedCategory !== 'all' && job.category !== selectedCategory) {
        return false;
      }
      // Difficulty check
      if (selectedDifficulty !== 'all' && job.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatches =
          job.titleEn.toLowerCase().includes(q) || job.titleBn.toLowerCase().includes(q);
        const platformMatches = job.platform.toLowerCase().includes(q);
        return titleMatches || platformMatches;
      }
      return true;
    });
  }, [microJobs, selectedCategory, selectedDifficulty, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-3.5">
      {/* Section Sub-Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            {language === 'bn' ? '💼 মাইক্রো জবস হাব' : '💼 Micro Jobs Engine'}
          </h2>
          <p className="text-[11px] text-[#8E8E93]">
            {language === 'bn'
              ? 'ডিজিটাল কাজ সম্পন্ন করে নিশ্চিত আর্নিং রিসিভ করুন'
              : 'Complete micro digital tasks to earn verified rewards'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className={`p-2 bg-[#161618] hover:bg-[#1F1F22] text-[#8E8E93] hover:text-white rounded-xl border border-[#232326] transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Refresh Opportunities"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={language === 'bn' ? 'সার্চ করুন কাজ বা প্ল্যাটফর্ম...' : 'Search jobs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161618] border border-[#232326] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#636366] focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Difficulty Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#161618] border border-[#232326] text-[#8E8E93] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-6"
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="advanced">Advanced</option>
          </select>
          <Filter className="w-3 h-3 text-[#8E8E93] absolute right-2 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isCatActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
                isCatActive
                  ? 'bg-emerald-500 text-[#0A0A0B] shadow-md shadow-emerald-500/20'
                  : 'bg-[#161618] text-[#8E8E93] border border-[#232326] hover:text-white hover:bg-[#1F1F22]'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredJobs.map((job) => (
            <MicroJobCard
              key={job.id}
              job={job}
              onSelectJob={(j) => setSelectedJobModal(j)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#161618] border border-[#232326] rounded-2xl p-8 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-emerald-500/40 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'কোনো কাজ পাওয়া যায়নি' : 'No Micro Jobs Found'}
            </h4>
            <p className="text-xs text-[#8E8E93] max-w-xs mx-auto mt-1">
              {language === 'bn'
                ? 'ফিল্টার পরিবর্তন করুন অথবা একটু পর আবার চেক করুন।'
                : 'Try clearing your search query or selecting a different category.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Micro Job Rules & Notice */}
      <MicroJobRulesAndNotice />

      {/* Job Details Modal */}
      <MicroJobDetailsModal
        job={selectedJobModal}
        onClose={() => setSelectedJobModal(null)}
      />
    </div>
  );
};
