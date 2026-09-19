import React from 'react';
import { motion } from 'motion/react';
import { X, History, Trophy, Calendar, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_HISTORICAL_WINNERS } from '../../data/mockData';

interface LeaderboardArchiveModalProps {
  onClose: () => void;
}

export const LeaderboardArchiveModal: React.FC<LeaderboardArchiveModalProps> = ({ onClose }) => {
  const { language } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#121214] border border-[#232326] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-[#232326] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'bn' ? 'লিডারবোর্ড আর্কাইভ ও বিজয়ী তালিকা' : 'Leaderboard Winners Archive'}
              </h3>
              <p className="text-[10px] text-[#8E8E93]">
                {language === 'bn' ? 'পূর্ববর্তী সপ্তাহের বিজয়ী ও চ্যাম্পিয়নদের তালিকা' : 'Past competition champions & prize winners'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1C1C1F] text-[#8E8E93] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_HISTORICAL_WINNERS.map((archive) => (
            <div key={archive.id} className="p-4 rounded-2xl bg-[#18181B] border border-[#232326] space-y-3">
              <div className="flex items-center justify-between border-b border-[#232326] pb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    {language === 'bn' ? archive.periodTitleBn : archive.periodTitleEn}
                  </span>
                </div>
                <span className="text-[10px] text-[#8E8E93] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {archive.dateRange}
                </span>
              </div>

              {/* Podium Breakdown inside Archive */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* 2nd Place */}
                <div className="p-2.5 rounded-xl bg-[#131315] border border-[#232326] space-y-1">
                  <span className="text-[10px] font-bold text-[#8E8E93]">🥈 2nd Place</span>
                  <p className="font-bold text-white truncate">{archive.secondPlace.username}</p>
                  <p className="text-[11px] font-bold text-[#00E5FF]">{archive.secondPlace.score}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold block">
                    {archive.secondPlace.reward}
                  </span>
                </div>

                {/* 1st Place */}
                <div className="p-2.5 rounded-xl bg-[#00E5FF10] border border-[#00E5FF30] space-y-1">
                  <span className="text-[10px] font-bold text-[#00E5FF]">🥇 1st Place 👑</span>
                  <p className="font-bold text-white truncate">{archive.firstPlace.username}</p>
                  <p className="text-[11px] font-bold text-[#00E5FF]">{archive.firstPlace.score}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00E5FF] text-[#0A0A0B] font-bold block">
                    {archive.firstPlace.reward}
                  </span>
                </div>

                {/* 3rd Place */}
                <div className="p-2.5 rounded-xl bg-[#131315] border border-[#232326] space-y-1">
                  <span className="text-[10px] font-bold text-amber-500">🥉 3rd Place</span>
                  <p className="font-bold text-white truncate">{archive.thirdPlace.username}</p>
                  <p className="text-[11px] font-bold text-[#00E5FF]">{archive.thirdPlace.score}</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold block">
                    {archive.thirdPlace.reward}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-[#00E5FF] hover:bg-[#00B8D4] text-[#0A0A0B] font-bold text-xs shadow-lg transition-all"
        >
          {language === 'bn' ? 'আর্কাইভ বন্ধ করুন' : 'Close Archive'}
        </button>
      </motion.div>
    </div>
  );
};
