import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  AlertCircle,
  Lock,
  Gift,
  Sparkles,
  Users,
} from 'lucide-react';
import { ChannelTask } from '../../types';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';
import { TelegramOfficialLogo } from '../Common/TelegramOfficialLogo';

interface ChannelTaskDetailsModalProps {
  task: ChannelTask | null;
  onClose: () => void;
}

export const ChannelTaskDetailsModal: React.FC<ChannelTaskDetailsModalProps> = ({
  task,
  onClose,
}) => {
  const { language, verifyChannelTask, getTierAdjustedReward, profileLevel } = useApp();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  const isBn = language === 'bn' || language === 'mixed';

  // 15-Second Timer countdown hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasJoined && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasJoined, countdown]);

  // Reset local state when task changes
  useEffect(() => {
    setHasJoined(false);
    setCountdown(15);
    setIsVerifying(false);
  }, [task?.id]);

  if (!task) return null;

  const rewardCalc = getTierAdjustedReward(task.rewardBdt, task.rewardCoins);

  const isCompleted = task.status === 'completed' || task.isJoined;

  const handleOpenChannel = () => {
    triggerHaptic('medium');
    setHasJoined(true);
    setCountdown(15);
    if (task.actionUrl) {
      window.open(task.actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVerifyJoin = () => {
    if (countdown > 0 || isVerifying) return;
    triggerHaptic('success');
    setIsVerifying(true);
    setTimeout(() => {
      verifyChannelTask(task.id);
      setIsVerifying(false);
      onClose();
    }, 400);
  };

  const instructions = isBn ? task.instructionsBn : task.instructionsEn;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Popup Box */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-[420px] bg-[#141417] border border-[#24242B] rounded-2xl p-4 sm:p-5 shadow-2xl z-10 max-h-[88vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-xl bg-[#1C1C21] text-[#8E8E93] hover:text-white hover:bg-[#2A2A33] transition-colors z-20 border border-[#2A2A33]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ========================================================================= */}
          {/* 1. IF TASK IS ALREADY COMPLETED: MEDIUM SIZED POPUP                      */}
          {/* ========================================================================= */}
          {isCompleted ? (
            <div className="text-center py-2 space-y-4">
              {/* Success Badge Icon */}
              <div className="relative inline-flex items-center justify-center mt-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.3)]">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400 stroke-[2.5]" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-[#141417] rounded-full border border-emerald-500/40">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              </div>

              {/* Title & Info */}
              <div>
                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-black uppercase tracking-wider inline-block mb-2 font-mono">
                  ✓ Task Completed
                </span>
                <h3 className="text-lg font-black text-white">
                  {isBn ? 'টাস্ক সম্পন্ন হয়েছে!' : 'Task Completed!'}
                </h3>
                <p className="text-xs text-[#9E9EA7] mt-1.5 max-w-sm mx-auto leading-relaxed">
                  {isBn
                    ? 'আপনি এই টাস্কটি ইতিমধ্যে সফলভাবে সম্পন্ন করেছেন। এটি শুধুমাত্র একবারই করা যাবে। আরও ইনকাম করতে বাকি টাস্কগুলো সম্পন্ন করুন!'
                    : 'You have already completed this task. It can only be done once. Please complete other available tasks to earn more!'}
                </p>
              </div>

              {/* Reward & Channel Detail Summary Box */}
              <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-3.5 text-left space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#1C1C22]">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.channelAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150'}
                      alt={task.channelName}
                      className="w-9 h-9 rounded-xl object-cover border border-[#2B2B33]"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                        {task.channelName}
                      </h4>
                      <p className="text-[10px] text-blue-400 font-mono">
                        {task.channelHandle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[9px] text-[#71717A] block uppercase font-bold">
                      {isBn ? 'প্রাপ্ত রিওয়ার্ড' : 'Reward Received'}
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      +৳{task.rewardBdt.toFixed(2)} BDT
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isBn ? '১০০% বট ভেরিফাইড ও পেইড' : '100% Bot Verified & Paid'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#71717A]">
                    {task.joinedAt || 'Today'}
                  </span>
                </div>
              </div>

              {/* Explore Other Tasks Button */}
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-[#0A0A0B] font-black rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.25)] flex items-center justify-center gap-2"
              >
                <span>{isBn ? 'বাকি টাস্ক সম্পন্ন করুন' : 'Complete Other Tasks'}</span>
              </button>
            </div>
          ) : (
            /* ========================================================================= */
            /* 2. ACTIVE TASK VERIFICATION FLOW (PROCESSING -> 15S TIMER -> VERIFY NOW)  */
            /* ========================================================================= */
            <>
              {/* Header Channel Details */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#23232A] mb-3 pr-6">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(34,158,217,0.35)] border border-sky-400/30 flex items-center justify-center">
                    <TelegramOfficialLogo className="w-10 h-10" shape="squircle" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-black border flex items-center gap-1 ${
                        task.category === 'group_join'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {task.category === 'group_join'
                        ? isBn
                          ? '👥 গ্রুপ জয়েন'
                          : '👥 GROUP JOIN'
                        : isBn
                        ? '📢 চ্যানেল জয়েন'
                        : '📢 CHANNEL JOIN'}
                    </span>
                    <span className="text-[9px] font-semibold text-[#8E8E93] truncate">
                      {task.channelHandle}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight truncate">
                    {task.channelName}
                  </h3>
                  <p className="text-[10px] text-[#8E8E93] truncate">
                    {isBn ? task.titleBn : task.titleEn}
                  </p>
                </div>
              </div>

              {/* Reward Callout */}
              <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      {isBn ? 'টাস্ক পুরষ্কার' : 'Task Reward'}
                    </span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        +{rewardCalc.bonusPercent}% {profileLevel.tier} Boost
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-blue-400 font-mono flex items-baseline gap-1.5 mt-0.5">
                    <span>+৳{rewardCalc.finalBdt.toFixed(2)}</span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[10px] text-[#71717A] font-normal line-through">
                        ৳{task.rewardBdt.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#8E8E93]">
                  <div className="flex items-center justify-end gap-1 font-bold text-blue-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{task.estimatedTime || '15 sec'}</span>
                  </div>
                  <div className="text-[9.5px] text-blue-400/90 font-bold mt-0.5">
                    {isBn ? 'যাচাই সময় (Verify Time)' : 'Verify Time'}
                  </div>
                  <div className="text-[9px] text-[#8E8E93] mt-0.5 font-mono">
                    {task.slotsLeft} / {task.totalSlots} slots open
                  </div>
                </div>
              </div>

              {/* Custom Description / Information */}
              {(task.descriptionEn || task.descriptionBn) && (
                <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 mb-3 text-xs leading-relaxed text-[#A1A1AA]">
                  <p className="font-semibold text-white text-[11px] mb-1">
                    {isBn ? 'টাস্ক বিবরণ ও শর্ত:' : 'Task Details & Rules:'}
                  </p>
                  <p className="text-[11px]">
                    {isBn ? (task.descriptionBn || task.descriptionEn) : (task.descriptionEn || task.descriptionBn)}
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 mb-3 space-y-1.5 text-xs">
                <h4 className="font-bold text-white text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  {isBn ? 'কীভাবে সম্পন্ন করবেন:' : 'How to Complete:'}
                </h4>
                <ol className="space-y-1 text-[11px] text-[#8E8E93] list-decimal list-inside">
                  {instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Verification Warning Note */}
              <div className="flex items-center gap-1.5 p-2 bg-[#0E0E11] border border-[#23232A] rounded-lg text-[10px] text-[#8E8E93] mb-3">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {task.category === 'group_join'
                    ? isBn
                      ? 'গ্রুপে জয়েন করে ১৫ সেকেন্ড পর Verify Now বাটনে ক্লিক করে সাথে সাথে টাকা গ্রহণ করুন।'
                      : 'Join group, wait 15 seconds, then click Verify Now to get instant money in balance.'
                    : isBn
                    ? 'চ্যানেলে জয়েন করে ১৫ সেকেন্ড পর Verify Now বাটনে ক্লিক করে সাথে সাথে টাকা গ্রহণ করুন।'
                    : 'Join channel, wait 15 seconds, then click Verify Now to get instant money in balance.'}
                </span>
              </div>

              {/* Two-Step Action Buttons */}
              <div className="space-y-2.5">
                {/* ------------------------------------------------------------- */}
                {/* STEP 1: Join Channel/Group in Telegram / Processing Button    */}
                {/* ------------------------------------------------------------- */}
                <button
                  onClick={handleOpenChannel}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    hasJoined
                      ? 'bg-[#181A22] border border-blue-500/40 text-blue-400 shadow-blue-500/10'
                      : task.category === 'group_join'
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                  }`}
                >
                  {hasJoined ? (
                    <>
                      <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                      <span>
                        {task.category === 'group_join'
                          ? isBn
                            ? 'Processing... (গ্রুপ ওপেন করা হয়েছে)'
                            : 'Processing... (Group Opened)'
                          : isBn
                          ? 'Processing... (চ্যানেল ওপেন করা হয়েছে)'
                          : 'Processing... (Channel Opened)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>
                        {task.category === 'group_join'
                          ? isBn
                            ? '1. JOIN GROUP IN TELEGRAM'
                            : '1. JOIN GROUP IN TELEGRAM'
                          : isBn
                          ? '1. JOIN CHANNEL IN TELEGRAM'
                          : '1. JOIN CHANNEL IN TELEGRAM'}
                      </span>
                    </>
                  )}
                </button>

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: Verify Now (with 15-second live countdown timer)      */}
                {/* ------------------------------------------------------------- */}
                {!hasJoined ? (
                  /* Inactive / Waiting for Step 1 */
                  <button
                    disabled
                    className="w-full py-2.5 px-3 bg-[#18181C] border border-[#222228] text-[#636366] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {task.category === 'group_join'
                        ? isBn
                          ? 'Verify Now (১ম ধাপে গ্রুপে জয়েন করুন)'
                          : 'Verify Now (Join Group First)'
                        : isBn
                        ? 'Verify Now (১ম ধাপে চ্যানেলে জয়েন করুন)'
                        : 'Verify Now (Join Channel First)'}
                    </span>
                  </button>
                ) : countdown > 0 ? (
                  /* 15-Second Live Countdown State */
                  <div className="space-y-1.5">
                    <button
                      disabled
                      className="w-full py-2.5 px-3 bg-[#1C1A14] border border-amber-500/30 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-wait shadow-sm"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span className="font-mono">
                        {isBn
                          ? `অপেক্ষা করুন ${countdown}s`
                          : `Please wait ${countdown}s`}
                      </span>
                    </button>
                    {/* Micro Progress Line for 15s */}
                    <div className="w-full bg-[#0D0E11] h-1.5 rounded-full overflow-hidden border border-[#20232B]">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${((15 - countdown) / 15) * 100}%` }}
                        transition={{ duration: 0.9, ease: 'linear' }}
                        className="h-full bg-gradient-to-r from-amber-400 to-[#00E5FF] rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  /* Fully Ready: Active "Verify Now" Button with instant crediting */
                  <button
                    onClick={handleVerifyJoin}
                    disabled={isVerifying}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 active:scale-98 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all animate-pulse"
                  >
                    {isVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isBn ? 'টাস্ক সম্পন্ন হচ্ছে...' : 'Completing & Crediting...'}</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>
                          {isBn ? 'Verify Now (টাস্ক সম্পন্ন করুন)' : 'Verify Now'}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
