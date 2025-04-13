import { useState, useEffect } from "react";
import { useAudio } from "@/contexts/audio-context";

type AudioPlayerProps = {
  text: string;
  audioPath?: string;
};

export function AudioPlayer({ text, audioPath }: AudioPlayerProps) {
  const { isPlaying, togglePlay, currentAudio, progress } = useAudio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the player when audio starts playing
    if (isPlaying && currentAudio === audioPath) {
      setIsVisible(true);
    } else if (!isPlaying && currentAudio === audioPath) {
      // Keep visible when paused
      setIsVisible(true);
    } else if (currentAudio !== audioPath) {
      // Hide when another audio is playing
      setIsVisible(false);
    }
  }, [isPlaying, currentAudio, audioPath]);

  if (!isVisible || !audioPath) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (isPlaying && currentAudio === audioPath) {
      togglePlay(audioPath);
    }
  };

  return (
    <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-6 z-30 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-medium p-4 flex items-center">
        <div className={`w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mr-4 ${isPlaying ? 'animate-pulse' : ''}`}>
          <i className="ri-volume-up-line text-accent-dark text-xl"></i>
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-medium text-sm">Now Playing</h4>
          <p className="text-xs text-gray-500 truncate">{text}</p>
          <div className="mt-1.5 bg-gray-200 rounded-full h-1 w-full">
            <div className="bg-accent h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button 
          className="ml-4 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-accent-light transition"
          onClick={() => togglePlay(audioPath)}
        >
          <i className={`ri-${isPlaying ? 'pause' : 'play'}-line`}></i>
        </button>
        <button 
          className="ml-2 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-error transition"
          onClick={handleClose}
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}
