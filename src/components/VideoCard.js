import React, { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import '../styles/modules.css';

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
    <div className={`video-card ${hasError ? 'video-error' : ''}`}>
      <div
        className={`video-thumbnail-container ${isLoading ? 'loading' : ''}`}
        onClick={openVideoWindow}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && openVideoWindow()}
        aria-label={`Play video: ${video.title}`}
      >
        <img
          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="video-thumbnail"
          loading="lazy"
        />
        <div className="play-overlay">
          <div className="play-button">▶</div>
        </div>
        {video.duration && <span className="video-duration">{video.duration}</span>}
        {isLoading && <div className="video-loading-overlay">Loading...</div>}
      </div>

      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>
        <button onClick={openVideoWindow} className="watch-button" disabled={isLoading}>
          {isLoading ? 'Opening...' : 'Watch Video'}
        </button>

        <label className="completion-checkbox">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={e => onMarkComplete(moduleId, video.id, e.target.checked)}
          />
          <span>Mark as watched</span>
        </label>
      </div>
    </div>
  );
}

export default VideoCard;
