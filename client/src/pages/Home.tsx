import React, { useEffect } from "react";
import UserGreeting from "@/components/UserGreeting";
import StreakCard from "@/components/StreakCard";
import DailyAffirmation from "@/components/DailyAffirmation";
import MoodTracker from "@/components/MoodTracker";
import ExploreCategories from "@/components/ExploreCategories";
import SavedAffirmations from "@/components/SavedAffirmations";
import { CloudDecorations } from "@/components/ui/cloud-decoration";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Icons
import { Feather, Bell, Settings } from "lucide-react";

export default function Home() {
  // Using demo user with id 1 for now
  const userId = 1;

  // Ensure we have initial user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Background decorations */}
      <CloudDecorations />
      
      {/* App Header */}
      <header className="relative px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 bg-primary rounded-full flex items-center justify-center shadow-soft">
            <Feather className="text-white" size={18} />
          </div>
          <h1 className="font-caveat text-3xl font-bold text-foreground">Whimsi</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-soft wave-button">
            <Bell className="text-primary" size={18} />
          </button>
          <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-soft wave-button">
            <Settings className="text-primary" size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-20">
        {/* User greeting */}
        <UserGreeting userId={userId} />
        
        {/* Current streak card */}
        <StreakCard userId={userId} />
        
        {/* Today's Affirmation */}
        <DailyAffirmation userId={userId} />
        
        {/* Mood Tracker */}
        <MoodTracker userId={userId} />
        
        {/* Explore Categories */}
        <ExploreCategories />
        
        {/* Saved Affirmations */}
        <SavedAffirmations userId={userId} />
      </main>
    </div>
  );
}
