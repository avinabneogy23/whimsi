import { useState, useEffect } from "react";
import { MoodDot } from "@/components/ui/mood-dot";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type MoodOption = {
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
};

const moodOptions: MoodOption[] = [
  { name: "joyful", icon: "emotion-laugh-line", color: "text-secondary-dark", backgroundColor: "bg-secondary-light" },
  { name: "calm", icon: "emotion-normal-line", color: "text-primary-dark", backgroundColor: "bg-primary-light" },
  { name: "neutral", icon: "emotion-normal-line", color: "text-gray-500", backgroundColor: "bg-gray-200" },
  { name: "tired", icon: "emotion-unhappy-line", color: "text-accent-dark", backgroundColor: "bg-accent-light" },
  { name: "stressed", icon: "emotion-sad-line", color: "text-red-400", backgroundColor: "bg-red-100" },
];

export function MoodTracker() {
  const { isLoggedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Get today's mood if user is logged in
  const { data: todaysMood, isLoading } = useQuery({
    queryKey: ['/api/moods/today'],
    enabled: isLoggedIn,
    retry: false
  });

  useEffect(() => {
    if (todaysMood) {
      setSelectedMood(todaysMood.mood);
    }
  }, [todaysMood]);

  // Mutation to record mood
  const moodMutation = useMutation({
    mutationFn: async (mood: string) => {
      const res = await apiRequest("POST", "/api/moods", { mood, date: new Date().toISOString() });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods/today'] });
      toast({
        title: "Mood recorded",
        description: `You're feeling ${data.mood} today!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record mood: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleMoodSelection = (mood: string) => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your mood",
        variant: "destructive",
      });
      return;
    }
    
    if (todaysMood) {
      toast({
        title: "Mood already recorded",
        description: "You've already recorded your mood for today",
      });
      return;
    }
    
    setSelectedMood(mood);
    moodMutation.mutate(mood);
  };

  return (
    <section className="px-6 mb-8">
      <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
        <i className="ri-emotion-line text-accent mr-2"></i>
        How are you feeling today?
      </h2>
      
      <div className="bg-white rounded-3xl p-5 shadow-medium">
        <div className="flex justify-between items-center">
          {moodOptions.map((mood) => (
            <MoodDot
              key={mood.name}
              mood={mood.name}
              icon={mood.icon}
              color={mood.color}
              backgroundColor={mood.backgroundColor}
              isSelected={selectedMood === mood.name}
              onClick={handleMoodSelection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
