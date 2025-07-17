import { useState, useRef, useEffect } from "react";

export type SoundType = "ocean" | "rain" | "birds" | "library" | "white-noise";

const soundUrls: Record<SoundType, string> = {
  ocean: "https://www.soundjay.com/misc/sounds/ocean-waves.mp3",
  rain: "https://www.soundjay.com/misc/sounds/rain.mp3",
  birds: "https://www.soundjay.com/misc/sounds/birds.mp3",
  library: "https://www.soundjay.com/misc/sounds/library.mp3",
  "white-noise": "https://www.soundjay.com/misc/sounds/white-noise.mp3",
};

export const useAmbientSounds = () => {
  const [currentSound, setCurrentSound] = useState<SoundType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (sound: SoundType) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Create Web Audio API context for better control
    const audio = new Audio();
    audio.src = soundUrls[sound];
    audio.loop = true;
    audio.volume = volume;
    
    audioRef.current = audio;
    setCurrentSound(sound);
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Error playing sound:", error);
        // Fallback to a simple beep or silence
        setIsPlaying(false);
      });
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentSound(null);
    setIsPlaying(false);
  };

  const toggleSound = (sound: SoundType) => {
    if (currentSound === sound && isPlaying) {
      stopSound();
    } else {
      playSound(sound);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    currentSound,
    isPlaying,
    volume,
    playSound,
    stopSound,
    toggleSound,
    setVolume,
  };
};
