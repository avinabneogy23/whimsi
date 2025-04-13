import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useUser } from "@/contexts/user-context";
import { MoodDot } from "@/components/ui/mood-dot";

// Mapping for mood colors and icons
const moodOptions = {
  joyful: { icon: "emotion-laugh-line", color: "text-secondary-dark", backgroundColor: "bg-secondary-light" },
  calm: { icon: "emotion-normal-line", color: "text-primary-dark", backgroundColor: "bg-primary-light" },
  neutral: { icon: "emotion-normal-line", color: "text-gray-500", backgroundColor: "bg-gray-200" },
  tired: { icon: "emotion-unhappy-line", color: "text-accent-dark", backgroundColor: "bg-accent-light" },
  stressed: { icon: "emotion-sad-line", color: "text-red-400", backgroundColor: "bg-red-100" },
};

// Function to get emoji based on mood
function getMoodEmoji(mood: string): string {
  switch (mood) {
    case "joyful": return "😄";
    case "calm": return "😌";
    case "neutral": return "😐";
    case "tired": return "😴";
    case "stressed": return "😩";
    default: return "❓";
  }
}

export default function Mood() {
  const { isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState("calendar"); // calendar or stats

  // Get all moods
  const { data: moods, isLoading: moodsLoading } = useQuery({
    queryKey: ['/api/moods'],
    enabled: isLoggedIn
  });

  // Group moods by month for the calendar view
  const groupedMoods = moods?.reduce((acc: Record<string, any[]>, mood: any) => {
    const monthYear = format(parseISO(mood.date), "MMMM yyyy");
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(mood);
    return acc;
  }, {});

  // Count moods for stats view
  const moodCounts = moods?.reduce((acc: Record<string, number>, mood: any) => {
    if (!acc[mood.mood]) {
      acc[mood.mood] = 0;
    }
    acc[mood.mood]++;
    return acc;
  }, {});

  const totalMoods = moods?.length || 0;

  if (!isLoggedIn) {
    return (
      <div className="app-container max-w-md mx-auto min-h-screen flex flex-col bg-white bg-opacity-85 backdrop-blur-md">
        <header className="pt-10 px-6">
          <h1 className="font-heading text-2xl font-bold mb-2">Mood Journal</h1>
          <p className="text-gray-500">Track how you feel each day</p>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 shadow-medium text-center">
            <i className="ri-emotion-line text-5xl text-gray-300 mb-4"></i>
            <h2 className="font-heading text-xl font-bold mb-2">Sign in to track your mood</h2>
            <p className="text-gray-500 mb-4">Create an account to start tracking your daily moods and see patterns over time.</p>
            <button className="bg-primary text-white px-6 py-3 rounded-full font-medium">Sign In</button>
          </div>
        </main>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="app-container max-w-md mx-auto min-h-screen flex flex-col bg-white bg-opacity-85 backdrop-blur-md">
      <header className="pt-10 px-6">
        <h1 className="font-heading text-2xl font-bold mb-2">Mood Journal</h1>
        <p className="text-gray-500">Track how you feel each day</p>
      </header>

      {/* Tab navigation */}
      <div className="px-6 mt-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === "calendar" ? "bg-white shadow-sm" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("calendar")}
          >
            Calendar
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              activeTab === "stats" ? "bg-white shadow-sm" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Stats
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pt-4 pb-20 px-6">
        {moodsLoading ? (
          <div className="h-64 bg-gray-100 rounded-3xl animate-pulse"></div>
        ) : moods?.length > 0 ? (
          activeTab === "calendar" ? (
            // Calendar view
            <div>
              {Object.entries(groupedMoods || {}).map(([monthYear, monthMoods]) => (
                <div key={monthYear} className="mb-8">
                  <h2 className="font-heading text-lg font-bold mb-3">{monthYear}</h2>
                  <div className="bg-white rounded-3xl p-4 shadow-medium">
                    <div className="grid grid-cols-7 gap-2">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
                      ))}
                      
                      {/* Calendar days - this is simplified, actual implementation would calculate proper days */}
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i + 1;
                        const mood = monthMoods.find((m: any) => parseInt(format(parseISO(m.date), "d")) === day);
                        
                        return (
                          <div key={i} className="text-center py-1">
                            {day <= 28 && (
                              <div className="relative">
                                <div className="text-xs">{day}</div>
                                {mood && (
                                  <div 
                                    className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                      (moodOptions as any)[mood.mood]?.backgroundColor || 'bg-gray-200'
                                    }`}
                                  >
                                    {getMoodEmoji(mood.mood)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Stats view
            <div>
              <div className="bg-white rounded-3xl p-6 shadow-medium mb-6">
                <h2 className="font-heading text-lg font-bold mb-4">Your Mood Distribution</h2>
                
                {Object.entries(moodCounts || {}).map(([mood, count]) => {
                  const percentage = Math.round((count as number / totalMoods) * 100);
                  
                  return (
                    <div key={mood} className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className="mr-2">{getMoodEmoji(mood)}</span>
                          <span className="font-medium capitalize">{mood}</span>
                        </div>
                        <span className="text-sm text-gray-500">{percentage}%</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${(moodOptions as any)[mood]?.backgroundColor || 'bg-gray-300'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-white rounded-3xl p-6 shadow-medium">
                <h2 className="font-heading text-lg font-bold mb-4">Your Mood Journey</h2>
                <div className="flex flex-wrap gap-1">
                  {moods.map((mood: any, index: number) => (
                    <div 
                      key={index}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        (moodOptions as any)[mood.mood]?.backgroundColor || 'bg-gray-200'
                      }`}
                      title={`${format(parseISO(mood.date), "PPP")}: ${mood.mood}`}
                    >
                      {getMoodEmoji(mood.mood)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-medium text-center">
            <i className="ri-emotion-line text-5xl text-gray-300 mb-4"></i>
            <h2 className="font-heading text-xl font-bold mb-2">No mood data yet</h2>
            <p className="text-gray-500 mb-4">Start tracking your mood each day to see your patterns over time.</p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
