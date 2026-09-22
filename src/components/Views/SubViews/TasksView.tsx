import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { EarningTabType } from '../../../types';
import { MicroJobsSection } from '../../EarningHub/MicroJobsSection';
import { ChannelTasksSection } from '../../EarningHub/ChannelTasksSection';
import { EarningSegmentedNav } from '../../EarningHub/EarningSegmentedNav';

export const TasksView: React.FC = () => {
  const { goBack, language, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<EarningTabType>('micro_jobs');

  return (
    <div className="space-y-4 pb-28">
      {/* Back Navigation Bar */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base font-black text-white">
            {language === 'bn' ? 'মাইক্রো জব ও চ্যানেল টাস্ক' : 'Micro Jobs & Channel Tasks'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'bn' ? 'সোশ্যাল টাস্ক পূরণ করে বাড়তি টাকা ইনকাম করুন' : 'Complete simple tasks & earn extra rewards'}
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <EarningSegmentedNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'ads') {
            navigateTo('ads');
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Active Tab View */}
      {activeTab === 'micro_jobs' ? <MicroJobsSection /> : <ChannelTasksSection />}
    </div>
  );
};
