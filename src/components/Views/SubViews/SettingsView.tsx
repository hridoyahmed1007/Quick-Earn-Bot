import React from 'react';
import { ArrowLeft, Globe, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { LanguageMode } from '../../../types';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, goBack } = useApp();

  const languages: { id: LanguageMode; title: string; subtitle: string }[] = [
    { id: 'mixed', title: 'English + বাংলা (Mixed)', subtitle: 'Primary Menu Labels in both English & Bangla' },
    { id: 'bn', title: 'বাংলা (Bengali)', subtitle: 'সম্পূর্ণ বাংলা ইন্টারফেস' },
    { id: 'en', title: 'English', subtitle: 'Full English interface' },
  ];

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
            {language === 'bn' ? 'ভাষা সেটিংস' : 'Language Settings'}
          </h2>
          <p className="text-[10px] text-slate-400">
            {language === 'bn' ? 'পছন্দের ভাষা নির্বাচন করুন' : 'Select your preferred language interface'}
          </p>
        </div>
      </div>

      {/* Language Preferences */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#00E5FF]" />
          <span>{language === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Select Preferred Language'}</span>
        </h3>

        <div className="space-y-2">
          {languages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                language === item.id
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-slate-400">{item.subtitle}</p>
              </div>
              {language === item.id && <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
