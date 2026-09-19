import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, CheckCircle2, ShieldAlert, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TaskProofModal: React.FC = () => {
  const { activeTaskProofModal, closeTaskModal, submitTaskProof, language } = useApp();
  const [proofText, setProofText] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  if (!activeTaskProofModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofText.trim()) {
      setErrorText(language === 'bn' ? 'অনুগ্রহ করে প্রুফ বা আইডি জমা দিন' : 'Please enter proof or username');
      return;
    }
    submitTaskProof(activeTaskProofModal.id, proofText.trim());
    setProofText('');
    setErrorText('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Send className="w-4 h-4" />
              </span>
              {language === 'bn' ? 'টাস্ক সাবমিশন' : 'Submit Task Proof'}
            </h3>
            <button
              onClick={closeTaskModal}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Task Info */}
          <div className="py-4 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300">
              {language === 'bn' ? activeTaskProofModal.titleBn : activeTaskProofModal.titleEn}
            </h4>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-200">
                {language === 'bn' ? 'ধাপসমূহ:' : 'Instructions:'}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {language === 'bn' ? activeTaskProofModal.instructionsBn : activeTaskProofModal.instructionsEn}
              </p>
            </div>

            {/* Action Button */}
            <a
              href={activeTaskProofModal.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{language === 'bn' ? 'কাজ শুরু করুন (লিঙ্কে যান)' : 'Open Task Link'}</span>
            </a>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'bn' ? 'প্রুফ (টেলিগ্রাম ইউজারনেম / নম্বর / স্ক্রিনশট লিংক)' : 'Proof (Username / Phone / Screenshot Reference)'}
                </label>
                <input
                  type="text"
                  value={proofText}
                  onChange={(e) => {
                    setProofText(e.target.value);
                    setErrorText('');
                  }}
                  placeholder="@your_username or 017xxxxxxxx"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-slate-600"
                />
                {errorText && (
                  <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errorText}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-black text-amber-400">
                  Reward: +৳{activeTaskProofModal.rewardBdt.toFixed(2)}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg glow-emerald active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'bn' ? 'প্রুফ জমা দিন' : 'Submit Proof'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
