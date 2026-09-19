import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Zap, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdRulesModal: React.FC<AdRulesModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-[24px] bg-[#161618] border border-[#232326] shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#232326] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#00E5FF15] text-[#00E5FF] border border-[#00E5FF20]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Ad Earning Rules & Guidelines</h3>
                <p className="text-[10px] text-[#8E8E93]">Fair Play & System Protection Policies</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#1F1F22] text-[#8E8E93] hover:text-white border border-[#2A2A2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body content */}
          <div className="space-y-3 text-xs text-[#EDEDED]">
            <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
              <h4 className="font-bold text-[#00E5FF] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                1. Rewarded Ad Watching
              </h4>
              <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                Watch full duration (e.g. 15s) of the video advertisement without closing or minimizing the app. Closing early voids reward verification.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
              <h4 className="font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                2. Server-Side Session Verification
              </h4>
              <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                Every ad watch creates a unique cryptographically signed session ticket. Rewards are credited directly by the server after provider signal confirmation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#111113] border border-[#1C1C1F] space-y-1.5">
              <h4 className="font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                3. Cooldown & Daily Limits
              </h4>
              <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                Ad networks enforce short cooldown periods (10-30 seconds) between video requests to ensure high quality ads and prevent bot traffic.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
              <h4 className="font-bold text-rose-400 flex items-center gap-1">
                🚫 Zero Tolerance Anti-Fraud
              </h4>
              <p className="text-[11px] text-[#8E8E93] leading-relaxed">
                Automated scripts, multiple account usage from single IP/device, or VPN manipulation will result in immediate reward forfeiture and permanent account freeze.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#70F3FF] text-[#0A0A0B] text-xs font-bold transition-all shadow-md glow-cyan"
          >
            I UNDERSTAND & AGREE
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
