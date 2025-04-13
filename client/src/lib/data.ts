// Sample audio URLs for development purposes
export const audioFiles = {
  "affirmation1.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation2.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation3.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation4.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation5.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation6.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation7.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation8.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation9.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
  "affirmation10.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-camera-shutter-click-1133.mp3",
};

// Studio Ghibli inspired background music URLs
export const ghibliBackgroundMusic = [
  "https://cdn.pixabay.com/audio/2022/08/31/audio_d8a0f06063.mp3", // Dreamlike piano music
  "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", // Japanese inspired
  "https://cdn.pixabay.com/audio/2022/03/15/audio_80d3ec368d.mp3", // Whimsical music box melody
  "https://cdn.pixabay.com/audio/2022/01/18/audio_d0be8e71ac.mp3", // Peaceful piano
  "https://cdn.pixabay.com/audio/2022/02/07/audio_b0a3c68f13.mp3"  // Fantasy music
];

// Default background music URL (first track from the collection)
export const backgroundMusic = ghibliBackgroundMusic[0];

// Helper to get the audio URL for a given path
export function getAudioUrl(path: string): string {
  return audioFiles[path as keyof typeof audioFiles] || "";
}

// Helper to get a random background music track from the collection
export function getRandomBackgroundMusic(): string {
  const randomIndex = Math.floor(Math.random() * ghibliBackgroundMusic.length);
  return ghibliBackgroundMusic[randomIndex];
}
