import React from 'react';
import { motion } from 'motion/react';
import { Bell, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeHeader: React.FC = () => {
  const { user, navigateTo } = useApp();

  // Dynamic greeting based on current time
  const hour = new Date().getHours();
  let timeGreeting = 'Good Day';
  if (hour < 12) timeGreeting = 'Good Morning';
  else if (hour < 18) timeGreeting = 'Good Afternoon';
  else timeGreeting = 'Good Evening';

  const [imgErr, setImgErr] = React.useState(false);
  const cleanFullName = (user.fullName || '').trim();
  const cleanUsername = (user.username || '').replace(/^@/, '').trim();
  const firstName = cleanFullName
    ? cleanFullName.split(' ')[0]
    : (cleanUsername ? `@${cleanUsername}` : 'Earner');
  const avatarLetter = (cleanFullName || cleanUsername || 'E').replace(/^@/, '').charAt(0).toUpperCase();

  return (
    <div className="space-y-2">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        {/* Left Side: Avatar + Greeting */}
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => navigateTo('profile')}>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00E5FF] via-teal-500 to-cyan-300 p-[2px] shadow-md shadow-[#00E5FF15]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#161618] flex items-center justify-center">
                {user.avatarUrl && !imgErr ? (
                  <img
                    src={user.avatarUrl}
                    alt={cleanFullName || cleanUsername}
                    onError={() => setImgErr(true)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#2AABEE] to-[#00E5FF] flex items-center justify-center text-white font-extrabold text-sm select-none">
                    {avatarLetter}
                  </div>
                )}
              </div>
            </div>
            {user.isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0A0A0B] text-[#00E5FF] flex items-center justify-center border border-[#1A1A1C]">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white leading-tight">
                Welcome back, {firstName} 👋
              </h1>
            </div>
            <p className="text-[11px] text-[#8E8E93] font-medium mt-0.5">
              Ready to earn today? • আজকে Earn করার জন্য রেডি?
            </p>
          </div>
        </div>

        {/* Right Side: Notification Icon with Unread Badge */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateTo('notifications')}
          className="relative p-2.5 rounded-2xl bg-[#161618] border border-[#232326] text-[#EDEDED] hover:text-[#00E5FF] transition-colors shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#8E8E93]" />
          {user.unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#FF3B30] text-white text-[9px] font-black border-2 border-[#0A0A0B] min-w-[18px] text-center shadow">
              {user.unreadNotificationsCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Profile Mini Status */}
      <div className="flex items-center gap-2 pl-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF10] border border-[#00E5FF20] text-[10px] font-semibold text-[#00E5FF]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          Active Earner
        </span>

        <span className="text-[11px] text-[#636366]">|</span>

        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#8E8E93]">
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          Level 08 • Verified VIP
        </span>
      </div>
    </div>
  );
};
