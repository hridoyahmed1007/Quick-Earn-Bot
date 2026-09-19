import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { AppStartupScreen } from './components/AppStartupScreen';
import { TopHeader } from './components/Navigation/TopHeader';
import { BottomNav } from './components/Navigation/BottomNav';
import { PageTransition } from './components/Navigation/PageTransition';
import { NotificationToast } from './components/Modals/NotificationToast';
import { AdPlayerModal } from './components/Modals/AdPlayerModal';
import { TaskProofModal } from './components/Modals/TaskProofModal';
import { WelcomeModal } from './components/Modals/WelcomeModal';

// Views
import { HomeView } from './components/Views/HomeView';
import { AdsView } from './components/Views/AdsView';
import { ReferralView } from './components/Views/ReferralView';
import { ProfileView } from './components/Views/ProfileView';
import { LeaderboardView } from './components/Views/LeaderboardView';
import { AdminPageView } from './components/Views/AdminPageView';

// SubViews
import { WithdrawView } from './components/Views/SubViews/WithdrawView';
import { WalletView } from './components/Views/SubViews/WalletView';
import { TasksView } from './components/Views/SubViews/TasksView';
import { DailyBonusView } from './components/Views/SubViews/DailyBonusView';
import { TransactionsView } from './components/Views/SubViews/TransactionsView';
import { MyReferralsView } from './components/Views/SubViews/MyReferralsView';
import { AchievementsView } from './components/Views/SubViews/AchievementsView';
import { NotificationsView } from './components/Views/SubViews/NotificationsView';
import { SettingsView } from './components/Views/SubViews/SettingsView';
import { HelpView } from './components/Views/SubViews/HelpView';
import { TermsPrivacyView } from './components/Views/SubViews/TermsPrivacyView';

const MainAppContent: React.FC = () => {
  const { currentRoute, theme } = useApp();
  const [isAppStarting, setIsAppStarting] = useState<boolean>(true);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);
  const isLight = theme === 'light';

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('theme-light');
    }
  }, [isLight]);

  return (
    <>
      <AnimatePresence>
        {isAppStarting && (
          <AppStartupScreen onComplete={() => setIsAppStarting(false)} />
        )}
      </AnimatePresence>

      {!isAppStarting && (
        <>
          {/* Standalone Full-Page Admin Control (/admin) */}
          {currentRoute === 'admin' ? (
            <>
              <AdminPageView />
              <NotificationToast />
            </>
          ) : currentRoute === 'leaderboard' ? (
            <div className={`min-h-screen ${isLight ? 'bg-[#F4F6F9] text-[#0F172A]' : 'bg-[#0A0A0B] text-[#EDEDED]'} flex flex-col font-sans selection:bg-[#00E5FF] selection:text-[#0A0A0B]`}>
              <main className="flex-1 w-full max-w-lg mx-auto">
                <PageTransition routeKey="leaderboard">
                  <LeaderboardView />
                </PageTransition>
              </main>
              <AdPlayerModal />
              <TaskProofModal />
              <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
              <NotificationToast />
            </div>
          ) : (
            <div className={`min-h-screen ${isLight ? 'bg-[#F4F6F9] text-[#0F172A]' : 'bg-[#0A0A0B] text-[#EDEDED]'} flex flex-col font-sans selection:bg-[#00E5FF] selection:text-[#0A0A0B]`}>
              {/* Top App Header */}
              <TopHeader />

              {/* Dynamic View Body Container */}
              <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-3">
                <PageTransition routeKey={currentRoute}>
                  {(() => {
                    switch (currentRoute) {
                      case 'home':
                        return <HomeView />;
                      case 'ads':
                        return <AdsView />;
                      case 'referral':
                        return <ReferralView />;
                      case 'wallet':
                      case 'withdraw':
                        return <WalletView />;
                      case 'profile':
                        return <ProfileView />;
                      case 'tasks':
                        return <TasksView />;
                      case 'bonus':
                        return <DailyBonusView />;
                      case 'transactions':
                        return <TransactionsView />;
                      case 'my-referrals':
                        return <MyReferralsView />;
                      case 'achievements':
                        return <AchievementsView />;
                      case 'notifications':
                        return <NotificationsView />;
                      case 'settings':
                        return <SettingsView />;
                      case 'help':
                        return <HelpView />;
                      case 'terms':
                      case 'privacy':
                        return <TermsPrivacyView />;
                      case 'leaderboard':
                        return <LeaderboardView />;
                      default:
                        return <HomeView />;
                    }
                  })()}
                </PageTransition>
              </main>

              {/* Floating Bottom Bar Navigation */}
              <BottomNav />

              {/* Overlays & Modals */}
              <AdPlayerModal />
              <TaskProofModal />
              <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
              <NotificationToast />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
