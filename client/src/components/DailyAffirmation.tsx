import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Affirmation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { getRandomBackground } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { playAudio, speakAffirmation } from "@/lib/audio";
import { apiRequest } from "@/lib/queryClient";

// Icons
import { RefreshCw, Volume2, Pause, Share2, Bookmark } from "lucide-react";

interface DailyAffirmationProps {
  userId: number;
  category?: string;
}

export function DailyAffirmation({ userId, category }: DailyAffirmationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<{ stop: () => void } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey = category 
    ? [`/api/affirmations/random?category=${category}`]
    : [`/api/affirmations/random`];

  const { data: affirmation, isLoading, refetch } = useQuery<Affirmation>({
    queryKey,
    refetchOnWindowFocus: false,
  });

  const { data: isSaved, refetch: refetchSaved } = useQuery<{ isSaved: boolean }>({
    queryKey: [`/api/users/${userId}/saved-affirmations/${affirmation?.id}`],
    enabled: !!affirmation,
  });

  const saveAffirmationMutation = useMutation({
    mutationFn: async () => {
      if (!affirmation) return;
      return apiRequest('POST', `/api/users/${userId}/saved-affirmations`, {
        affirmationId: affirmation.id
      });
    },
    onSuccess: () => {
      toast({
        title: "Saved",
        description: "Affirmation added to favorites!",
      });
      refetchSaved();
    }
  });

  const unsaveAffirmationMutation = useMutation({
    mutationFn: async () => {
      if (!affirmation) return;
      return apiRequest('DELETE', `/api/users/${userId}/saved-affirmations/${affirmation.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Removed",
        description: "Affirmation removed from favorites",
      });
      refetchSaved();
    }
  });

  const handleRefresh = () => {
    refetch();
    // Stop any playing audio when refreshing
    if (currentSpeech) {
      currentSpeech.stop();
      setCurrentSpeech(null);
      setIsPlaying(false);
    }
  };

  const handlePlayAudio = () => {
    if (!affirmation) return;
    
    if (isPlaying && currentSpeech) {
      currentSpeech.stop();
      setCurrentSpeech(null);
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    // Play a gentle sound before speaking the affirmation
    playAudio("https://cdn.freesound.org/previews/414/414045_5121236-lq.mp3", {
      volume: 0.3,
      onend: () => {
        const speech = speakAffirmation(affirmation.text);
        setCurrentSpeech(speech);
      }
    });
    
    toast({
      title: "Playing",
      description: "Playing affirmation audio...",
    });
  };

  const handleSaveAffirmation = () => {
    if (!affirmation) return;
    
    if (isSaved?.isSaved) {
      unsaveAffirmationMutation.mutate();
    } else {
      saveAffirmationMutation.mutate();
    }
  };

  const handleShareAffirmation = () => {
    if (!affirmation) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Daily Affirmation',
        text: affirmation.text,
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Shared",
          description: "Affirmation shared successfully!",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Error sharing affirmation",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(affirmation.text)
        .then(() => {
          toast({
            title: "Copied",
            description: "Affirmation copied to clipboard!",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to copy affirmation",
            variant: "destructive",
          });
        });
    }
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-nunito font-semibold text-lg">Today's Affirmation</h3>
          <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-soft h-64 animate-pulse bg-gray-200"></div>
      </section>
    );
  }

  if (!affirmation) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-nunito font-semibold text-lg">Today's Affirmation</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="p-2 text-primary rounded-full wave-button"
          onClick={handleRefresh}
          disabled={saveAffirmationMutation.isPending || unsaveAffirmationMutation.isPending}
        >
          <RefreshCw size={18} />
        </Button>
      </div>
      
      <div className="relative animate-pulse-slow">
        <div className="relative rounded-3xl overflow-hidden shadow-soft animate-float" style={{ animationDelay: "1s" }}>
          <img 
            src={getRandomBackground()}
            alt="Magical landscape" 
            className="w-full h-64 object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div className="glass-effect rounded-xl p-4 w-full">
              <p className="font-caveat text-2xl text-white mb-2 leading-snug">
                "{affirmation.text}"
              </p>
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">{affirmation.category.charAt(0).toUpperCase() + affirmation.category.slice(1).replace(/-/g, ' ')}</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-colors wave-button"
                    onClick={handlePlayAudio}
                    disabled={saveAffirmationMutation.isPending || unsaveAffirmationMutation.isPending}
                  >
                    {isPlaying ? <Pause size={18} /> : <Volume2 size={18} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-colors wave-button"
                    onClick={handleShareAffirmation}
                    disabled={saveAffirmationMutation.isPending || unsaveAffirmationMutation.isPending}
                  >
                    <Share2 size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-colors wave-button"
                    onClick={handleSaveAffirmation}
                    disabled={saveAffirmationMutation.isPending || unsaveAffirmationMutation.isPending}
                  >
                    <Bookmark size={18} className={isSaved?.isSaved ? "fill-white" : ""} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DailyAffirmation;
