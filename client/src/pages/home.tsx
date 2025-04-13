import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { AffirmationCard } from "@/components/affirmation-card";
import { MoodTracker } from "@/components/mood-tracker";
import { CategoryExplorer } from "@/components/category-explorer";
import { StreakTracker } from "@/components/streak-tracker";
import { FavoriteAffirmations } from "@/components/favorite-affirmations";
import { BottomNavigation } from "@/components/bottom-navigation";
import { SettingsScreen } from "@/components/settings-screen";

export default function Home() {
  const { user, isLoggedIn } = useUser();
  const { toast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(format(new Date(), "MMMM d, yyyy"));
  }, []);

  // Get daily affirmation
  const { data: dailyAffirmation, isLoading } = useQuery({
    queryKey: ["/api/affirmations/daily"]
  });

  // Background style for the body - floating clouds and particles
  const mainStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1475070929565-c985b496cb9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
  };

  return (
    <div style={mainStyle} className="min-h-screen overflow-x-hidden">
      <div className="app-container max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl bg-white bg-opacity-85 backdrop-blur-md">
        {/* Sparkles and decorations */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden h-32 pointer-events-none">
          <div className="sparkle absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-80" style={{ animation: "sparkle 2s ease-in-out infinite", animationDelay: "0.5s" }}></div>
          <div className="sparkle absolute top-20 left-36 w-1.5 h-1.5 bg-white rounded-full opacity-70" style={{ animation: "sparkle 2s ease-in-out infinite", animationDelay: "1.2s" }}></div>
          <div className="sparkle absolute top-16 right-12 w-2 h-2 bg-white rounded-full opacity-80" style={{ animation: "sparkle 2s ease-in-out infinite", animationDelay: "0.8s" }}></div>
          <div className="sparkle absolute top-5 right-24 w-1 h-1 bg-white rounded-full opacity-60" style={{ animation: "sparkle 2s ease-in-out infinite", animationDelay: "1.5s" }}></div>
        </div>

        {/* App header with profile and settings */}
        <header className="pt-10 px-6 flex justify-between items-center z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-soft">
              <i className="ri-user-line text-white"></i>
            </div>
            <div className="ml-3">
              <h2 className="font-heading font-medium text-sm text-gray-600">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},</h2>
              <h1 className="font-heading font-bold text-lg">{isLoggedIn ? user?.firstName : "Friend"}</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white bg-opacity-70 shadow-soft transition hover:bg-primary hover:text-white">
              <i className="ri-notification-3-line"></i>
            </button>
            <button 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white bg-opacity-70 shadow-soft transition hover:bg-primary hover:text-white"
              onClick={() => setSettingsOpen(true)}
            >
              <i className="ri-settings-3-line"></i>
            </button>
          </div>
        </header>

        {/* Current streak and date display */}
        <div className="mt-4 px-6 flex justify-between items-center">
          {isLoggedIn && (
            <div className="bg-white bg-opacity-70 rounded-full px-4 py-1.5 flex items-center shadow-soft">
              <i className="ri-fire-fill text-secondary-dark mr-2"></i>
              <span className="text-sm font-medium">{user?.currentStreak || 0} day streak</span>
            </div>
          )}
          <div className={`text-right ${!isLoggedIn ? 'ml-auto' : ''}`}>
            <p className="text-sm text-gray-500 font-medium">{currentDate}</p>
          </div>
        </div>

        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-y-auto pt-6 pb-20">
          {/* Today's Affirmation section */}
          <section className="px-6 mb-8">
            <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
              <i className="ri-sun-line text-secondary mr-2"></i>
              Today's Affirmation
            </h2>
            
            {isLoading ? (
              <div className="affirmation-card bg-white rounded-3xl p-6 shadow-medium h-48 animate-pulse"></div>
            ) : dailyAffirmation ? (
              <AffirmationCard 
                id={dailyAffirmation.id}
                text={dailyAffirmation.text}
                category={dailyAffirmation.category}
                audioPath={dailyAffirmation.audioPath}
                isFavorite={dailyAffirmation.isFavorite}
              />
            ) : (
              <div className="affirmation-card bg-white rounded-3xl p-6 shadow-medium">
                <p className="text-gray-500">Failed to load today's affirmation. Please refresh the page.</p>
              </div>
            )}
          </section>

          {/* Mood Tracker */}
          <MoodTracker />

          {/* Category Explorer */}
          <CategoryExplorer />

          {/* Streak Tracker (only show if logged in) */}
          {isLoggedIn && <StreakTracker />}

          {/* Favorites */}
          <FavoriteAffirmations />
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Settings Screen */}
        <SettingsScreen isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}
