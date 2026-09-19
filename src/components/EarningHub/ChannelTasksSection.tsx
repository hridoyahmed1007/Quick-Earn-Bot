import React, { useState, useMemo } from 'react';
import { Radio, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { ChannelTask, ChannelTaskCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { ChannelTaskCard } from './ChannelTaskCard';
import { ChannelTaskDetailsModal } from './ChannelTaskDetailsModal';
import { ChannelTaskRulesAndNotice } from './ChannelTaskRulesAndNotice';

export const ChannelTasksSection: React.FC = () => {
  const { channelTasks, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ChannelTaskCategory>('all');
  const [selectedTaskModal, setSelectedTaskModal] = useState<ChannelTask | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const categories: { id: ChannelTaskCategory; labelEn: string; labelBn: string }[] = [
    { id: 'all', labelEn: 'All Channel Tasks', labelBn: 'সব চ্যানেল টাস্ক' },
    { id: 'channel_join', labelEn: 'Channel Join', labelBn: 'চ্যানেল জয়েন' },
    { id: 'group_join', labelEn: 'Group Join', labelBn: 'গ্রুপ জয়েন' },
    { id: 'reaction', labelEn: 'Post Reaction', labelBn: 'পোস্ট রিয়েকশন' },
    { id: 'follow', labelEn: 'Follow/Subscribe', labelBn: 'ফলো' },
  ];

  const filteredTasks = useMemo(() => {
    return channelTasks.filter((task) => {
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [channelTasks, selectedCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-3.5">
      {/* Sub Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-400" />
            {language === 'bn' ? '📢 টেলিগ্রাম চ্যানেল অ্যান্ড গ্রুপ টাস্ক' : '📢 Channel & Community Tasks'}
          </h2>
          <p className="text-[11px] text-[#8E8E93]">
            {language === 'bn'
              ? 'টেলিগ্রাম চ্যানেলে জয়েন করে ইন্সট্যান্ট বট ভেরিফাইড পুরষ্কার বুঝে নিন'
              : 'Join Telegram channels/groups for instant automated rewards'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className={`p-2 bg-[#161618] hover:bg-[#1F1F22] text-[#8E8E93] hover:text-white rounded-xl border border-[#232326] transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Refresh Channel Tasks"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#161618] text-[#8E8E93] border border-[#232326] hover:text-white hover:bg-[#1F1F22]'
              }`}
            >
              {language === 'bn' ? cat.labelBn : cat.labelEn}
            </button>
          );
        })}
      </div>

      {/* List Grid */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <ChannelTaskCard
              key={task.id}
              task={task}
              onSelectTask={(t) => setSelectedTaskModal(t)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#161618] border border-[#232326] rounded-2xl p-8 text-center space-y-3">
          <Send className="w-10 h-10 text-blue-500/40 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'bn' ? 'কোনো টাস্ক উপলব্ধ নেই' : 'No Channel Tasks Available'}
            </h4>
            <p className="text-xs text-[#8E8E93] max-w-xs mx-auto mt-1">
              {language === 'bn'
                ? 'নতুন চ্যানেলের কাজ শীঘ্রই যোগ করা হবে।'
                : 'All channel tasks in this category are completed or full.'}
            </p>
          </div>
        </div>
      )}

      {/* Channel Task Rules & Notice */}
      <ChannelTaskRulesAndNotice />

      {/* Task Details Modal */}
      <ChannelTaskDetailsModal
        task={selectedTaskModal}
        onClose={() => setSelectedTaskModal(null)}
      />
    </div>
  );
};
