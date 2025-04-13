import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAudio } from "@/contexts/audio-context";
import { AudioPlayer } from "@/components/ui/audio-player";
import { useUser } from "@/contexts/user-context";

type AffirmationCardProps = {
  id: number;
  text: string;
  category: string;
  audioPath?: string;
  isFavorite?: boolean;
};

export function AffirmationCard({ id, text, category, audioPath, isFavorite: initialIsFavorite = false }: AffirmationCardProps) {
  const { toast } = useToast();
  const { togglePlay } = useAudio();
  const { isLoggedIn } = useUser();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/favorites", { affirmationId: id });
      return res.json();
    },
    onSuccess: () => {
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: "This affirmation has been added to your favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add to favorites: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", `/api/favorites/${id}`);
      return res.json();
    },
    onSuccess: () => {
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: "This affirmation has been removed from your favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlayAudio = () => {
    if (audioPath) {
      togglePlay(audioPath);
    }
  };

  const handleShareAffirmation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Affirmation",
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        toast({
          title: "Couldn't share",
          description: "The sharing operation was cancelled or failed",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: "Affirmation has been copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Couldn't copy",
          description: "Failed to copy the affirmation to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  return (
    <>
      <div className="affirmation-card bg-white rounded-3xl p-6 shadow-medium overflow-hidden relative animate-float">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-light opacity-10"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary-light opacity-10"></div>
        
        <div className="relative">
          <p className="font-accent text-2xl text-gray-700 leading-relaxed mb-4">
            {text}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
              {category}
            </span>
            <div className="flex space-x-2">
              <button 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-primary-light transition"
                onClick={handlePlayAudio}
                disabled={!audioPath}
              >
                <i className="ri-volume-up-line"></i>
              </button>
              <button 
                className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-secondary-light transition"
                onClick={handleShareAffirmation}
              >
                <i className="ri-share-line"></i>
              </button>
              <button 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isFavorite ? 'bg-red-50 text-error hover:bg-red-100' : 'bg-gray-100 hover:bg-accent-light'}`}
                onClick={handleToggleFavorite}
              >
                <i className={`ri-heart-${isFavorite ? 'fill' : 'line'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {audioPath && <AudioPlayer text={text} audioPath={audioPath} />}
    </>
  );
}
