'use client';

import { useState } from 'react';
import Image from 'next/image';
import DynamicIconLucide from '@/components/dynamic-icon-lucide/DynamicIconLucide';
import { cn } from '@/utils/utils';
import { DEFAULT_IMAGE } from '@/constants/defaultImage';

interface YouTubeVideoDisplayProps {
  url: string;
  className?: string;
  thumbnailClassName?: string;
  playButtonClassName?: string;
  autoplay?: boolean;
  onPlay?: () => void;
  defaultImage?: string;
  // External playing state control (for carousel scenarios)
  isPlaying?: boolean;
  onPlayClick?: () => void;
}

export function YouTubeVideoDisplay({
  url,
  className,
  thumbnailClassName,
  playButtonClassName,
  autoplay = true,
  onPlay,
  defaultImage = `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE}${DEFAULT_IMAGE}`,
  isPlaying: externalIsPlaying,
  onPlayClick,
}: YouTubeVideoDisplayProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);

  // Use external playing state if provided, otherwise use internal state
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  const getYouTubeThumbnail = (videoUrl: string) => {
    const videoId = videoUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  const getYouTubeEmbedUrl = (videoUrl: string) => {
    const videoId = videoUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}${autoplay ? '?autoplay=1' : ''}`;
    }
    return null;
  };

  const handlePlayClick = () => {
    if (onPlayClick) {
      // Use external play handler if provided
      onPlayClick();
    } else {
      // Use internal state management
      setInternalIsPlaying(true);
    }
    onPlay?.();
  };

  if (!url || url.trim() === '') {
    return null;
  }

  const thumbnailUrl = getYouTubeThumbnail(url);
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!thumbnailUrl || !embedUrl) {
    return (
      <div className={cn('flex items-center justify-center bg-muted/20 rounded-lg', className)}>
        <p className="text-muted-foreground text-sm">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full group flex items-center justify-center', className)}>
      {isPlaying ? (
        // YouTube iframe when playing
        <div className="w-full h-full flex items-center justify-center bg-background rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full min-h-0"
            style={{ aspectRatio: '16/9' }}
          />
          {/* Optional pause overlay - uncomment if needed */}
          {/* <button
            onClick={handlePauseClick}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <DynamicIconLucide iconName="X" size={16} />
          </button> */}
        </div>
      ) : (
        <>
          {/* Video thumbnail */}
          <div
            className={cn(
              'relative w-full h-full flex items-center justify-center rounded-lg overflow-hidden',
              thumbnailClassName
            )}
          >
            <Image
              src={thumbnailUrl}
              alt="Video thumbnail"
              width={800}
              height={450}
              className="max-w-full max-h-full object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImage;
              }}
            />
          </div>
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center rounded-lg">
            <button
              className={cn(
                'w-16 h-16 bg-white/90 hover:bg-white transition-all duration-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110',
                playButtonClassName
              )}
              onClick={handlePlayClick}
              type="button"
            >
              <DynamicIconLucide iconName="Play" size={24} className="text-black ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
