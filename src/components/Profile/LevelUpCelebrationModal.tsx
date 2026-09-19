import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTierStyleConfig } from './tierStyles';

export const LevelUpCelebrationModal: React.FC = () => {
  const { levelUpCelebration, clearLevelUpCelebration, language } = useApp();
  const isBn = language === 'bn' || language === 'mixed';

  if (!levelUpCelebration) return null;

  const { toTier, config } = levelUpCelebration;
  const style = getTierStyleConfig(toTier);

  return (
    <AnimatePresence>
      <div
        id="level-up-celebration-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        onClick={clearLevelUpCelebration}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-[#161618] border rounded-[28px] p-6 text-center space-y-4 shadow-2xl relative overflow-hidden"
          style={{ borderColor: `${style.accentColor}60` }}
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ backgroundColor: style.glowColor }}
          />

          {/* Close button */}
          <button
            onClick={clearLevelUpCelebration}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#111113] text-[#8E8E93] hover:text-white border border-[#232326]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Big Crown / Tier Badge */}
          <div
            className={`relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br ${style.avatarGradientBg} border-2 flex items-center justify-center shadow-xl`}
            style={{ borderColor: style.accentColor }}
          >
            <span className="text-4xl filter drop-shadow-md select-none">
              {style.crownEmoji}
            </span>
          </div>

          <div className="space-y-1">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border inline-block"
              style={{
                backgroundColor: `${style.accentColor}15`,
                borderColor: `${style.accentColor}40`,
                color: style.accentColor,
              }}
            >
              LEVEL UPGRADED!
            </span>
            <h3 className="text-lg font-black text-white">
              {config.crownText}
            </h3>
            <p className="text-xs text-[#C7C7CC] pt-1">
              {isBn
                ? `অভিনন্দন! আপনার প্রোফাইল এখন ${config.labelBn} লেভেলে উন্নীত হয়েছে।`
                : `Congratulations! Your profile has reached ${config.labelEn} status.`}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#111113] border border-[#232326] text-xs text-[#8E8E93] space-y-1.5">
            <div className="flex items-center justify-between text-white font-bold">
              <span>{isBn ? 'নতুন ব্যাজ সুবিধা' : 'Tier Benefits'}</span>
              <span className="flex items-center gap-1 font-mono text-[11px]" style={{ color: style.accentColor }}>
                <Sparkles className="w-3.5 h-3.5" />
                +{(config as any).bonusPercent ?? 0}% Boost Active
              </span>
            </div>
            {((config as any).bonusPercent ?? 0) > 0 && (
              <div className="py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 font-bold text-[11px] flex items-center justify-between">
                <span>{isBn ? 'টাস্ক ও বিজ্ঞাপনে স্থায়ী বোনাস' : 'Permanent Task & Ads Bonus'}</span>
                <span className="font-mono text-xs text-amber-400">+{((config as any).bonusPercent ?? 0)}%</span>
              </div>
            )}
            <p className="text-[11px] text-[#A1A1AA] text-left">
              {isBn ? config.descriptionBn : config.descriptionEn}
            </p>
            {config.perkBn && (
              <p className="text-[11px] text-emerald-400 text-left font-medium pt-1 border-t border-[#232326]/60">
                ✨ {isBn ? config.perkBn : config.perkEn}
              </p>
            )}
          </div>

          <button
            onClick={clearLevelUpCelebration}
            className="w-full py-3 rounded-xl font-black text-xs transition-all text-[#0A0A0B] shadow-lg"
            style={{
              backgroundColor: style.accentColor,
            }}
          >
            {isBn ? 'ধন্যবাদ / চালু রাখুন' : 'CLAIM & CONTINUE'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
