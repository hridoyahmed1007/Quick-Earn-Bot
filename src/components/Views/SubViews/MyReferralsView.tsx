import React from 'react';
import { ArrowLeft, Users, UserCheck, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const MyReferralsView: React.FC = () => {
  const { referrals, goBack, language } = useApp();

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
            {language === 'bn' ? 'আমার রেফারেল সদস্যবৃন্দ' : 'My Referral Members'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'bn' ? 'আপনার লিঙ্কে যুক্ত টিম মেম্বারদের তালিকা' : 'Active team members linked to your referral ID'}
          </p>
        </div>
      </div>

      {/* Referral Members List */}
      <div className="space-y-2">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-white">{ref.username}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Lvl {ref.level}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Joined: {ref.joinedAt}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-black text-emerald-400 block">+৳{ref.commissionEarnedBdt.toFixed(2)}</span>
              <span className="text-[9px] text-slate-500 capitalize">{ref.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
