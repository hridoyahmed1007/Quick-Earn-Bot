import React from 'react';
import { ArrowLeft, Gift, Flame, CheckCircle2, Sparkles, Coins } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const DailyBonusView: React.FC = () => {
  const { dailyBonus, claimDailyBonus, user, goBack, language } = useApp();

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
            {language === 'bn' ? 'দৈনিক স্ট্রিক চেক-ইন' : 'Daily Check-in Streak'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'bn' ? 'প্রতিদিন অ্যাপে ঢুকে ফ্রী ক্যাশ বোনাস ও স্ট্রিক বাড়ান' : 'Log in every day to unlock progressive BDT cash bonuses'}
          </p>
        </div>
      </div>

      {/* Streak Info Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 border border-amber-500/30 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            {language === 'bn' ? 'বর্তমান স্ট্রিক স্কোর' : 'Current Active Streak'}
          </span>
          <span className="text-2xl font-black text-white">{user.streakDays} Days 🔥</span>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* 7 Day Calendar Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {dailyBonus.map((day) => {
          const isClaimable = day.isCurrentDay && !day.isClaimed;

          return (
            <div
              key={day.dayNumber}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 transition-all ${
                day.isClaimed
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-400'
                  : isClaimable
                  ? 'border-amber-500/50 bg-slate-900 glow-gold'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">
                  Day {day.dayNumber} {day.isSpecial && '👑'}
                </span>
                {day.isClaimed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div>
                <span className="text-sm font-black text-amber-400 block">+৳{day.rewardBdt.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500">{language === 'bn' ? 'দৈনিক বোনাস' : 'Daily Cash'}</span>
              </div>

              {isClaimable ? (
                <button
                  onClick={() => claimDailyBonus(day.dayNumber)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md glow-gold active:scale-95 transition-all"
                >
                  {language === 'bn' ? 'বোনাস নিন' : 'Claim Reward'}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-center py-1 rounded-lg bg-slate-800/80 text-slate-500">
                  {day.isClaimed ? 'Claimed' : 'Locked'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
