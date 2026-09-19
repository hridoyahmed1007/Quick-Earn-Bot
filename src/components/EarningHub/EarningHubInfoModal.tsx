import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, Lock, AlertTriangle, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EarningHubInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarningHubInfoModal: React.FC<EarningHubInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useApp();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#161618] border border-[#232326] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#232326]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'আর্নিং নিয়ম ও ভেরিফিকেশন' : 'Earning Rules & Policy'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#1F1F22] text-[#8E8E93] hover:text-white hover:bg-[#2A2A2E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3 text-xs text-[#8E8E93] leading-relaxed">
            <div className="bg-[#111113] border border-[#232326] rounded-2xl p-3.5 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>1. Server-Side Reward Verification</span>
              </div>
              <p>
                All rewards are calculated and validated by our secure backend service. Client-side tampering or invalid session requests are blocked automatically.
              </p>
            </div>

            <div className="bg-[#111113] border border-[#232326] rounded-2xl p-3.5 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>2. Channel Task Subscriptions</span>
              </div>
              <p>
                You must remain subscribed to Telegram channels/groups for at least 7 days after claiming a reward. Unsubscribing prematurely may result in commission reversal.
              </p>
            </div>

            <div className="bg-[#111113] border border-[#232326] rounded-2xl p-3.5 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>3. Proof Review & Approval</span>
              </div>
              <p>
                Micro Jobs requiring manual proof (screenshots/links) are usually reviewed within 1 to 12 hours by platform moderators before crediting your wallet.
              </p>
            </div>

            <div className="bg-[#111113] border border-[#232326] rounded-2xl p-3.5 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>4. Anti-Fraud & VPN Restrictions</span>
              </div>
              <p>
                Using multiple fake accounts, auto-clickers, or malicious proxies is strictly prohibited and will lead to account suspension.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0B] font-black rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/20"
          >
            {language === 'bn' ? 'বুঝেছি (I Understand)' : 'I Understand'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
