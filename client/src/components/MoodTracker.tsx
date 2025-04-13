import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { moods, getMoodByValue } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Mood } from "@shared/schema";

// Import icons
import { Smile, Heart, Cloud, Leaf, Flame, PlusCircle } from "lucide-react";

interface MoodTrackerProps {
  userId: number;
}

export function MoodTracker({ userId }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todaysMood, isLoading } = useQuery<Mood>({
    queryKey: [`/api/users/${userId}/moods/today`],
    refetchOnWindowFocus: false,
  });

  const recordMoodMutation = useMutation({
    mutationFn: async (mood: string) => {
      return apiRequest('POST', `/api/users/${userId}/moods`, { mood });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/moods/today`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/moods`] });
      
      toast({
        title: "Mood Recorded",
        description: "Your mood has been saved for today!",
      });
      
      // Update user streak after recording mood
      apiRequest('POST', `/api/users/${userId}/streak`, {});
    }
  });

  const handleMoodSelect = (mood: string) => {
    if (!todaysMood) {
      setSelectedMood(mood);
    }
  };

  const handleRecordMood = () => {
    if (selectedMood) {
      recordMoodMutation.mutate(selectedMood);
    } else {
      toast({
        title: "Please Select a Mood",
        description: "Select how you're feeling today before recording.",
        variant: "destructive",
      });
    }
  };

  const getIconByName = (name: string) => {
    switch (name) {
      case 'smile': return <Smile className="text-xl" />;
      case 'heart': return <Heart className="text-xl" />;
      case 'cloud': return <Cloud className="text-xl" />;
      case 'seedling': return <Leaf className="text-xl" />;
      case 'fire': return <Flame className="text-xl" />;
      default: return <Smile className="text-xl" />;
    }
  };

  const getColorClass = (colorName: string, isBackground = true) => {
    const colors: Record<string, string> = {
      primary: isBackground ? "bg-primary bg-opacity-20" : "text-primary",
      sunset: isBackground ? "bg-[#E8A4C4] bg-opacity-20" : "text-[#E8A4C4]",
      secondary: isBackground ? "bg-secondary bg-opacity-20" : "text-secondary",
      leaf: isBackground ? "bg-[#A0C8B3] bg-opacity-20" : "text-[#A0C8B3]",
      accent: isBackground ? "bg-accent bg-opacity-20" : "text-accent"
    };
    
    return colors[colorName] || (isBackground ? "bg-primary bg-opacity-20" : "text-primary");
  };

  const getHoverClass = (colorName: string) => {
    const colors: Record<string, string> = {
      primary: "hover:bg-primary/10",
      sunset: "hover:bg-[#E8A4C4]/10",
      secondary: "hover:bg-secondary/10",
      leaf: "hover:bg-[#A0C8B3]/10",
      accent: "hover:bg-accent/10"
    };
    
    return colors[colorName] || "hover:bg-primary/10";
  };

  const getSelectedClass = (colorName: string) => {
    const colors: Record<string, string> = {
      primary: "bg-primary/10",
      sunset: "bg-[#E8A4C4]/10",
      secondary: "bg-secondary/10",
      leaf: "bg-[#A0C8B3]/10",
      accent: "bg-accent/10"
    };
    
    return colors[colorName] || "bg-primary/10";
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="font-nunito font-semibold text-lg mb-4">How are you feeling today?</h3>
        <div className="bg-white rounded-3xl p-6 shadow-soft animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </section>
    );
  }

  // If mood is already recorded today
  if (todaysMood) {
    const mood = getMoodByValue(todaysMood.mood);
    
    return (
      <section className="mb-8">
        <h3 className="font-nunito font-semibold text-lg mb-4">Today's Mood</h3>
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-20 h-20 rounded-full ${getColorClass(mood?.color || 'primary')} flex items-center justify-center`}>
              {getIconByName(mood?.icon || 'smile')}
            </div>
          </div>
          <p className="text-center font-medium text-lg">
            You're feeling <span className={getColorClass(mood?.color || 'primary', false)}>{mood?.label || 'Happy'}</span> today
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">Come back tomorrow to record a new mood</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="font-nunito font-semibold text-lg mb-4">How are you feeling today?</h3>
      
      <div className="bg-white rounded-3xl p-6 shadow-soft">
        <div className="grid grid-cols-5 gap-4 max-w-sm mx-auto">
          {moods.map((mood) => (
            <button 
              key={mood.value}
              className={`mood-btn flex flex-col items-center py-3 rounded-xl ${getHoverClass(mood.color)} transition-colors wave-button ${selectedMood === mood.value ? getSelectedClass(mood.color) : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={recordMoodMutation.isPending}
            >
              <div className={`w-12 h-12 rounded-full ${getColorClass(mood.color)} flex items-center justify-center mb-2`}>
                {getIconByName(mood.icon)}
              </div>
              <span className="text-xs text-gray-700">{mood.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            className="px-5 py-2 bg-primary text-white rounded-full font-medium text-sm shadow-soft hover:shadow-glow transition-shadow wave-button"
            onClick={handleRecordMood}
            disabled={recordMoodMutation.isPending}
          >
            {recordMoodMutation.isPending ? "Recording..." : "Record Mood"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default MoodTracker;
