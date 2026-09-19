import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Upload,
  Link2,
  User,
  FileText,
  Sparkles,
  Lock,
  Zap,
} from 'lucide-react';
import { MicroJob } from '../../types';
import { useApp } from '../../context/AppContext';
import { triggerHaptic } from '../../utils/haptics';

interface MicroJobDetailsModalProps {
  job: MicroJob | null;
  onClose: () => void;
}

export const MicroJobDetailsModal: React.FC<MicroJobDetailsModalProps> = ({ job, onClose }) => {
  const { language, submitMicroJobProof, earningTransactions, getTierAdjustedReward, profileLevel } = useApp();
  const [proofInput, setProofInput] = useState<string>('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasOpenedLink, setHasOpenedLink] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  const isBn = language === 'bn' || language === 'mixed';

  // 15-Second Countdown timer hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasOpenedLink && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasOpenedLink, countdown]);

  // Reset local state when job changes
  useEffect(() => {
    setHasOpenedLink(false);
    setCountdown(15);
    setIsSubmitting(false);
    setProofInput('');
    setFilePreview(null);
  }, [job?.id]);

  if (!job) return null;

  const rewardCalc = getTierAdjustedReward(job.rewardBdt, job.rewardCoins);

  const isCompleted =
    job.status === 'completed' ||
    job.status === 'approved' ||
    job.status === 'pending' ||
    (earningTransactions &&
      earningTransactions.some(
        (tx) => tx.title === job.titleEn || tx.title === job.titleBn || (tx as any).jobId === job.id
      ));

  const handleStartTask = () => {
    triggerHaptic('medium');
    setHasOpenedLink(true);
    setCountdown(15);
    if (job.actionUrl) {
      window.open(job.actionUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilePreview(URL.createObjectURL(file));
      setProofInput(file.name);
    }
  };

  const handleSubmitProof = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (countdown > 0 || isSubmitting) return;

    triggerHaptic('success');
    setIsSubmitting(true);
    const finalProof = proofInput.trim() || 'Auto verified proof submission';
    setTimeout(() => {
      submitMicroJobProof(job.id, finalProof);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const instructions = isBn ? job.instructionsBn : job.instructionsEn;

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

        {/* Modal Popup Container */}
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
          {/* 1. IF JOB IS ALREADY COMPLETED: MEDIUM SIZED POPUP                        */}
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

              {/* Reward & Platform Detail Summary Box */}
              <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-3.5 text-left space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#1C1C22]">
                  <div className="min-w-0 pr-2">
                    <span className="px-2 py-0.5 bg-[#1C1C21] text-[#9A9AA0] border border-[#2B2B33] rounded text-[9.5px] font-bold uppercase mb-1 inline-block">
                      {job.platform}
                    </span>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                      {isBn ? job.titleBn : job.titleEn}
                    </h4>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-[9px] text-[#71717A] block uppercase font-bold">
                      {isBn ? 'প্রাপ্ত রিওয়ার্ড' : 'Reward Received'}
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      +৳{job.rewardBdt.toFixed(2)} BDT
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8E8E93]">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isBn ? '১০০% ভেরিফাইড ও পেইড' : '100% Verified & Paid'}</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#71717A]">
                    {job.submittedAt || 'Today'}
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
              {/* Header */}
              <div className="flex items-start justify-between pb-2.5 border-b border-[#23232A] mb-3 pr-6">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.5 bg-[#1F1F24] text-white border border-[#2A2A33] rounded text-[9px] font-bold">
                      {job.platform}
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold">
                      Instant Auto-Verify
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {isBn ? job.titleBn : job.titleEn}
                  </h3>
                </div>
              </div>

              {/* Reward Callout Box */}
              <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                      {isBn ? 'টাস্ক পুরষ্কার' : 'Job Reward'}
                    </span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        +{rewardCalc.bonusPercent}% {profileLevel.tier} Boost
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono flex items-baseline gap-1.5 mt-0.5">
                    <span>+৳{rewardCalc.finalBdt.toFixed(2)}</span>
                    {rewardCalc.hasBonus && (
                      <span className="text-[10px] text-[#71717A] font-normal line-through">
                        ৳{job.rewardBdt.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#8E8E93]">
                  <div className="flex items-center justify-end gap-1 font-bold text-emerald-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{job.estimatedTime || '15 sec'}</span>
                  </div>
                  <div className="text-[9.5px] text-emerald-400/90 font-bold mt-0.5">
                    {isBn ? 'যাচাই সময় (Verify Time)' : 'Verify Time'}
                  </div>
                  <div className="text-[9px] text-[#8E8E93] mt-0.5 font-mono">
                    {job.slotsLeft} / {job.totalSlots} slots open
                  </div>
                </div>
              </div>

              {/* Requirements & Instructions */}
              <div className="space-y-2 mb-3 text-xs">
                {/* Instructions */}
                <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5">
                  <h4 className="font-bold text-white text-[11px] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {isBn ? 'ধাপসমূহ:' : 'Step-by-Step Instructions:'}
                  </h4>
                  <ol className="space-y-1 text-[11px] text-[#8E8E93] list-decimal list-inside">
                    {instructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Verification type note */}
                <div className="flex items-center gap-1.5 p-2 bg-[#0E0E11] border border-[#23232A] rounded-lg text-[10px] text-[#8E8E93]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {isBn
                      ? 'টাস্ক লিংক ওপেন করে ১৫ সেকেন্ড পর Verify Now বাটনে ক্লিক করে সাথে সাথে টাকা গ্রহণ করুন।'
                      : 'Open task link, wait 15 seconds, then click Verify Now to get instant money in balance.'}
                  </span>
                </div>
              </div>

              {/* Action 1: Open Task Link */}
              <div className="space-y-2.5">
                <button
                  onClick={handleStartTask}
                  className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    hasOpenedLink
                      ? 'bg-[#181A22] border border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0B] shadow-emerald-500/25'
                  }`}
                >
                  {hasOpenedLink ? (
                    <>
                      <div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      <span>
                        {isBn ? 'Processing... (লিংক ওপেন করা হয়েছে)' : 'Processing... (Link Opened)'}
                      </span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>
                        {isBn ? '1. OPEN TASK LINK NOW' : '1. OPEN TASK LINK NOW'}
                      </span>
                    </>
                  )}
                </button>

                {/* Proof Inputs (Username / Profile link / Screenshot) */}
                {job.proofRequirement === 'screenshot' ? (
                  <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 space-y-1.5">
                    <label className="block text-[10px] font-semibold text-[#8E8E93]">
                      Upload Screenshot (Optional / অপশনাল):
                    </label>
                    <div className="border border-dashed border-[#282833] hover:border-emerald-500/50 rounded-lg p-2 text-center cursor-pointer relative bg-[#141417] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {filePreview ? (
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="truncate text-white text-[11px]">{proofInput}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-[#8E8E93] text-[11px]">
                          <Upload className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Click to upload screenshot</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : job.proofRequirement === 'url' ? (
                  <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 space-y-1">
                    <label className="block text-[10px] font-semibold text-[#8E8E93]">
                      Target / Profile Link (Optional / অপশনাল):
                    </label>
                    <div className="relative">
                      <Link2 className="w-3.5 h-3.5 text-[#8E8E93] absolute left-2.5 top-2" />
                      <input
                        type="text"
                        placeholder="https://example.com/profile-or-link"
                        value={proofInput}
                        onChange={(e) => setProofInput(e.target.value)}
                        className="w-full bg-[#141417] border border-[#282833] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-[#636366] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0E0E11] border border-[#23232A] rounded-xl p-2.5 space-y-1">
                    <label className="block text-[10px] font-semibold text-[#8E8E93]">
                      Your Username / Profile Handle (Optional / অপশনাল):
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#8E8E93] absolute left-2.5 top-2" />
                      <input
                        type="text"
                        placeholder="@your_username"
                        value={proofInput}
                        onChange={(e) => setProofInput(e.target.value)}
                        className="w-full bg-[#141417] border border-[#282833] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-[#636366] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: Verify Now (with 15-second live countdown timer)      */}
                {/* ------------------------------------------------------------- */}
                {!hasOpenedLink ? (
                  /* Inactive / Waiting for Step 1 */
                  <button
                    disabled
                    className="w-full py-2.5 px-3 bg-[#18181C] border border-[#222228] text-[#636366] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isBn ? 'Verify Now (১ম ধাপে লিঙ্ক ওপেন করুন)' : 'Verify Now (Open Link First)'}
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
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  /* Fully Ready: Active "Verify Now" Button with instant crediting */
                  <button
                    onClick={() => handleSubmitProof()}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 active:scale-98 text-[#0A0A0B] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all animate-pulse"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-[#0A0A0B]/30 border-t-[#0A0A0B] rounded-full animate-spin" />
                        <span>{isBn ? 'টাস্ক সম্পন্ন হচ্ছে...' : 'Completing & Crediting...'}</span>
                      </div>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-[#0A0A0B] fill-[#0A0A0B]" />
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
