import React from 'react';
import '../styles/VideoCard.css';

function VideoCard({ video, moduleId, isCompleted, onMarkComplete }) {
  const openVideoWindow = async () => {
    try {
      const result = await window.electronAPI.openVideoWindow(video.id, moduleId);
      if (result.success) {
        console.log('Video window opened:', result.windowId);
      } else {
        console.error('Failed to open video window:', result.error);
      }
    } catch (error) {
      console.error('Error opening video window:', error);
    }
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail-container" onClick={openVideoWindow}>
        <img
          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="video-thumbnail"
        />
        <div className="play-overlay">
          <div className="play-button">▶</div>
        </div>
        {video.duration && <span className="video-duration">{video.duration}</span>}
      </div>

      <div className="video-info">
        <h4 className="video-title">{video.title}</h4>
        <button onClick={openVideoWindow} className="watch-button">
          Watch Video
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
