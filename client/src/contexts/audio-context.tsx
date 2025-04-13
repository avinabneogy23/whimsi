import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Howl } from "howler";
import { getAudioUrl, getRandomBackgroundMusic } from "@/lib/data";
import { useUser } from "@/contexts/user-context";

type AudioContextType = {
  isPlaying: boolean;
  currentAudio: string | null;
  progress: number;
  togglePlay: (audioPath: string) => void;
  toggleBackgroundMusic: () => void;
  isBackgroundMusicPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

type AudioProviderProps = {
  children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [sound, setSound] = useState<Howl | null>(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [bgMusic, setBgMusic] = useState<Howl | null>(null);
  const { user } = useUser();

  // Initialize background music with a random Ghibli-inspired track
  useEffect(() => {
    try {
      const randomMusic = getRandomBackgroundMusic();
      const bgMusicInstance = new Howl({
        src: [randomMusic],
        loop: true,
        volume: 0.3,
        html5: true,
        onloaderror: () => {
          console.error("Error loading background music");
        }
      });
      
      setBgMusic(bgMusicInstance);
      
      return () => {
        bgMusicInstance.unload();
      };
    } catch (error) {
      console.error("Failed to initialize background music:", error);
    }
  }, []);

  // Sync background music setting with user preferences
  useEffect(() => {
    if (user?.preferences?.backgroundMusicEnabled && bgMusic) {
      bgMusic.play();
      setIsBackgroundMusicPlaying(true);
    } else if (bgMusic) {
      bgMusic.pause();
      setIsBackgroundMusicPlaying(false);
    }
  }, [user?.preferences?.backgroundMusicEnabled, bgMusic]);

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
      if (bgMusic) {
        bgMusic.unload();
      }
    };
  }, [sound, bgMusic]);

  // Update progress bar
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;

    if (isPlaying && sound) {
      progressInterval = setInterval(() => {
        const seek = sound.seek() || 0;
        const duration = sound.duration() || 1;
        const percentage = (seek / duration) * 100;
        setProgress(percentage);

        if (percentage >= 99.5) {
          clearInterval(progressInterval!);
          setProgress(0);
          setIsPlaying(false);
        }
      }, 100);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, sound]);

  const togglePlay = (audioPath: string) => {
    // If the same audio is already playing, pause it
    if (currentAudio === audioPath && isPlaying && sound) {
      sound.pause();
      setIsPlaying(false);
      return;
    }

    // If we're switching to a different audio or starting new
    if (sound) {
      sound.stop();
    }

    // Create new sound instance
    const audioUrl = getAudioUrl(audioPath);
    if (!audioUrl) return;

    const newSound = new Howl({
      src: [audioUrl],
      html5: true,
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
      },
      onloaderror: () => {
        console.error("Error loading audio");
        setIsPlaying(false);
      },
      onplayerror: () => {
        console.error("Error playing audio");
        setIsPlaying(false);
      }
    });

    setSound(newSound);
    newSound.play();
    setIsPlaying(true);
    setCurrentAudio(audioPath);
    setProgress(0);
  };

  const toggleBackgroundMusic = () => {
    if (!bgMusic) return;

    if (isBackgroundMusicPlaying) {
      bgMusic.pause();
      setIsBackgroundMusicPlaying(false);
    } else {
      bgMusic.play();
      setIsBackgroundMusicPlaying(true);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentAudio,
        progress,
        togglePlay,
        toggleBackgroundMusic,
        isBackgroundMusicPlaying
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
