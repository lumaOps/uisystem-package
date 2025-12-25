'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg p-3 border border-border shadow-sm">
      <audio ref={audioRef} src={src} />

      {/* Progress Bar Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="relative">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${(currentTime / (duration || 1)) * 100}%, hsl(var(--muted)) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipTime(-10)}
            className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border hover:bg-accent transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border hover:bg-accent transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-foreground" />
            ) : (
              <Play className="w-4 h-4 text-foreground ml-0.5" />
            )}
          </button>

          <button
            onClick={() => skipTime(10)}
            className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border border-border hover:bg-accent transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1.5 border border-border">
          <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-muted rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%)`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: hsl(var(--primary));
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
