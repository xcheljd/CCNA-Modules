import React, { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { YOUTUBE_THUMBNAIL_BASE } from '@/utils/constants';

function VideoCard({ video, moduleId, isCompleted, onMarkComplete }) {
  const { error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const openVideoWindow = async () => {
    if (!window.electronAPI?.openVideoWindow) {
      error('Video player requires the desktop app');
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      // preload.js bridges positional args (videoId, moduleId) to IPC object { videoId, moduleId }
      const result = await window.electronAPI.openVideoWindow(video.id, moduleId);
      if (!result.success) {
        setHasError(true);
        error(result.error || 'Failed to open video. Please check your internet connection.');
      }
    } catch {
      setHasError(true);
      error('Unable to open video. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`video-card bg-card rounded-xl overflow-hidden border border-border transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] mb-3 flex flex-row h-[140px] max-md:flex-col max-md:h-auto hover:shadow-[0_2px_6px_hsl(var(--primary-foreground)/0.1)] hover:-translate-y-0.5 ${
        hasError ? 'video-error' : ''
      }`}
    >
      <div
        className={`video-thumbnail-container relative cursor-pointer overflow-hidden bg-background w-[240px] h-full shrink-0 max-md:w-full ${
          isLoading ? 'loading' : ''
        }`}
        onClick={openVideoWindow}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openVideoWindow();
          }
        }}
        aria-label={`Play video: ${video.title}`}
      >
        <img
          src={`${YOUTUBE_THUMBNAIL_BASE}/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover object-center block transition-opacity ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-primary-foreground/30 transition-colors ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:bg-primary-foreground/50">
          <div className="play-button w-[50px] h-[50px] bg-primary/95 rounded-full flex items-center justify-center text-xl text-primary-foreground transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] pl-1 max-md:w-[60px] max-md:h-[60px] max-md:text-2xl">
            ▶
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-primary-foreground/80 text-primary px-1.5 py-0.5 rounded text-[11px] font-semibold max-md:bottom-2 max-md:right-2 max-md:text-xs max-md:px-[7px] py-[3px]">
            {video.duration}
          </span>
        )}
        {isLoading && (
          <div className="video-loading-overlay absolute inset-0 flex items-center justify-center bg-background/80 text-primary-foreground text-lg">
            Loading...
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-evenly flex-1 items-center">
        <h4 className="m-0 text-base text-foreground leading-[1.3]">{video.title}</h4>
        <button
          onClick={openVideoWindow}
          className="watch-button w-auto max-w-[145px] px-5 py-2.5 pl-4 bg-[#ff0000] text-white border-2 border-transparent rounded-md text-sm font-bold cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] m-0 whitespace-nowrap inline-flex items-center gap-2 max-md:text-[15px] max-md:p-3 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Opening...' : 'Watch Video'}
        </button>

        <label className="completion-checkbox flex items-center gap-2 cursor-pointer text-[13px] text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={e => onMarkComplete(moduleId, video.id, e.target.checked)}
          />
          <span className="flex-1">Mark as watched</span>
        </label>
      </div>
    </div>
  );
}

export default VideoCard;
