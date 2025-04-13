import { Howl } from "howler";

// Cache of loaded audio instances
const audioCache: Record<string, Howl> = {};

// Default background sounds that can be played with affirmations
export const backgroundSounds = [
  { id: "forest", name: "Forest Ambience", url: "https://cdn.freesound.org/previews/573/573577_5674468-lq.mp3" },
  { id: "rain", name: "Gentle Rain", url: "https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3" },
  { id: "stream", name: "Flowing Stream", url: "https://cdn.freesound.org/previews/384/384685_7113590-lq.mp3" },
  { id: "birds", name: "Morning Birds", url: "https://cdn.freesound.org/previews/501/501999_7754962-lq.mp3" }
];

// Function to load and play an audio file
export function playAudio(url: string, options: { 
  loop?: boolean, 
  volume?: number,
  onend?: () => void,
  onfade?: () => void
} = {}): Howl {
  // Use cached audio if it exists
  if (audioCache[url]) {
    const audio = audioCache[url];
    
    if (options.volume !== undefined) {
      audio.volume(options.volume);
    }
    
    if (options.onend) {
      audio.on('end', options.onend);
    }
    
    if (options.onfade) {
      audio.on('fade', options.onfade);
    }
    
    if (!audio.playing()) {
      audio.play();
    }
    
    return audio;
  }
  
  // Create a new Howl instance
  const audio = new Howl({
    src: [url],
    html5: true, // Use HTML5 Audio to stream without full preload
    loop: options.loop || false,
    volume: options.volume || 0.5,
  });
  
  if (options.onend) {
    audio.on('end', options.onend);
  }
  
  if (options.onfade) {
    audio.on('fade', options.onfade);
  }
  
  // Cache the audio instance
  audioCache[url] = audio;
  audio.play();
  
  return audio;
}

// Function to stop audio playback
export function stopAudio(audio: Howl | string, fadeOutDuration: number = 0): void {
  const howl = typeof audio === 'string' ? audioCache[audio] : audio;
  
  if (!howl) return;
  
  if (fadeOutDuration > 0) {
    howl.fade(howl.volume(), 0, fadeOutDuration);
    setTimeout(() => {
      howl.stop();
    }, fadeOutDuration);
  } else {
    howl.stop();
  }
}

// Current active background sound
let activeBackgroundSound: Howl | null = null;

// Play a background sound and manage the active sound
export function playBackgroundSound(soundId: string) {
  if (activeBackgroundSound) {
    stopAudio(activeBackgroundSound, 1000);
  }
  
  const sound = backgroundSounds.find(s => s.id === soundId);
  if (!sound) return;
  
  activeBackgroundSound = playAudio(sound.url, {
    loop: true,
    volume: 0.3
  });
  
  return activeBackgroundSound;
}

// Stop the active background sound
export function stopBackgroundSound() {
  if (activeBackgroundSound) {
    stopAudio(activeBackgroundSound, 1000);
    activeBackgroundSound = null;
  }
}

// Text-to-speech for affirmations
export function speakAffirmation(text: string) {
  // Check if the browser supports speech synthesis
  if ('speechSynthesis' in window) {
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice and settings
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Get available voices and try to set a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    
    return {
      stop: () => {
        window.speechSynthesis.cancel();
      }
    };
  }
  
  return {
    stop: () => {} // No-op if speech synthesis is not available
  };
}
