import React from 'react';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const TermsPrivacyView: React.FC = () => {
  const { goBack, language, profileConfig } = useApp();
  const isBn = language === 'bn' || language === 'mixed';
  const legal = profileConfig?.legal;

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
            {isBn ? (legal?.titleBn || 'ব্যবহারের শর্তাবলী ও গোপনীয়তা') : (legal?.titleEn || 'Terms of Service & Privacy Policy')}
          </h2>
          <p className="text-[10px] text-slate-400">
            {isBn ? (legal?.subtitleBn || 'অফিসিয়াল নীতি ও প্ল্যাটফর্ম নির্দেশিকা') : (legal?.subtitleEn || 'Official legal policy & platform terms')}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Quick Earn Platform Standards</span>
        </div>

        {(isBn ? (legal?.rulesBn || legal?.rulesEn || []) : (legal?.rulesEn || [])).map((rule, idx) => (
          <p key={idx}>{rule}</p>
        ))}
      </div>
    </div>
  );
};

