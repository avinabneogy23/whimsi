import { useUser } from "@/contexts/user-context";
import { format, startOfWeek, addDays } from "date-fns";

type DayCircleProps = {
  day: string;
  completed: boolean;
};

function DayCircle({ day, completed }: DayCircleProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="day-circle w-10 h-10 rounded-full flex items-center justify-center mb-1 bg-primary bg-opacity-20">
        {completed ? (
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <i className="ri-check-line text-white"></i>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500"></span>
          </div>
        )}
      </div>
      <span className="text-xs font-medium">{day}</span>
    </div>
  );
}

export function StreakTracker() {
  const { user } = useUser();
  const streak = user?.currentStreak || 0;

  // Generate week days starting from Sunday
  const startDate = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return format(date, "EEE"); // Returns short day name (Mon, Tue, etc.)
  });

  // For the demo, let's assume the streak days are continuous from the left
  const completedDays = streak > 7 ? 7 : streak;
  const streakProgress = (streak / 30) * 100;
  const streakProgressWidth = `${Math.min(streakProgress, 100)}%`;

  return (
    <section className="px-6 mb-8">
      <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
        <i className="ri-calendar-line text-secondary mr-2"></i>
        Your Streak
      </h2>
      
      <div className="bg-white rounded-3xl p-5 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-lg">{streak} Day Streak</h3>
          {streak > 0 && (
            <div className="px-3 py-1 bg-primary-light text-primary-dark rounded-full text-xs font-medium">
              +{streak > 2 ? 2 : streak} days
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          {weekDays.map((day, index) => (
            <DayCircle key={day} day={day} completed={index < completedDays} />
          ))}
        </div>
        
        <div className="mt-5 bg-gray-100 rounded-full overflow-hidden h-1.5">
          <div className="h-full bg-primary" style={{ width: streakProgressWidth }}></div>
        </div>
        
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>0 days</span>
          <span>Goal: 30 days</span>
        </div>
      </div>
    </section>
  );
}
