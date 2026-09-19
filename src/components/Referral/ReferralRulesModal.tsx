import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Layers, Percent } from 'lucide-react';

interface ReferralRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralRulesModal: React.FC<ReferralRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-lg bg-[#161618] border border-[#232326] rounded-[28px] p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#232326] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Referral Terms & Commission Rules</h3>
                <p className="text-[11px] text-[#8E8E93]">Official Referral Program Guidelines</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Section 1: Tier Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[#111113] border border-[#1C1C1F] space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              <span>Multi-Level Commission Structure</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded-xl bg-[#18181A] flex justify-between">
                <span className="text-white font-bold">Level 1 (Direct Referrals)</span>
                <span className="font-mono font-bold text-emerald-400">10% Commission</span>
              </div>
              <div className="p-2 rounded-xl bg-[#18181A] flex justify-between">
                <span className="text-[#A0A0A5]">Level 2 (Friends of Friends)</span>
                <span className="font-mono font-bold text-[#00E5FF]">3% Commission</span>
              </div>
              <div className="p-2 rounded-xl bg-[#18181A] flex justify-between">
                <span className="text-[#A0A0A5]">Level 3 (Extended Network)</span>
                <span className="font-mono font-bold text-amber-400">1% Commission</span>
              </div>
            </div>
          </div>

          {/* Body Section 2: Important Qualification Rules */}
          <div className="p-3.5 rounded-2xl bg-[#111113] border border-[#1C1C1F] space-y-2 text-xs text-[#A0A0A5]">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>Qualification & Payout Conditions</span>
            </h4>

            <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
              <li>
                <strong className="text-white">Active Requirement:</strong> A referral qualifies once they complete their first task or watch an eligible ad.
              </li>
              <li>
                <strong className="text-white">No Guaranteed Income Claim:</strong> Commissions are generated strictly from verified partner ad activity ("Eligible referral activity অনুযায়ী commission earn করুন").
              </li>
              <li>
                <strong className="text-white">Real-time Crediting:</strong> Approved commission is immediately added to your main BDT ledger.
              </li>
            </ul>
          </div>

          {/* Body Section 3: Anti-Fraud Rules */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2 text-xs">
            <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Anti-Fraud & Security System</span>
            </h4>

            <p className="text-[11px] text-rose-200/80 leading-relaxed">
              Self-referrals, clone apps, or emulator setups are automatically detected. Ineligible accounts are flagged and commission records are subject to reversal.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#00E5FF] text-slate-950 font-black text-xs shadow-md"
          >
            I UNDERSTAND & AGREE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
