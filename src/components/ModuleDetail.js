import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import '../styles/ModuleDetail.css';

function ModuleDetail({ module, modules, onBack, onOpenResource, onModuleSelect }) {
  const [labCompleted, setLabCompleted] = useState(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState(false);
  const [videoCompletions, setVideoCompletions] = useState({});
  const [confidence, setConfidence] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  // Find the next and previous modules in the sequence
  const nextModule = modules.find(m => m.id === module.id + 1);
  const prevModule = modules.find(m => m.id === module.id - 1);

  const handleNextModule = () => {
    if (nextModule) {
      setAnimationClass('slide-right');
      setTimeout(() => {
        onModuleSelect(nextModule);
      }, 50);
    }
  };

  const handlePrevModule = () => {
    if (prevModule) {
      setAnimationClass('slide-left');
      setTimeout(() => {
        onModuleSelect(prevModule);
      }, 50);
    }
  };

  useEffect(() => {
    // Reset animation class
    setAnimationClass('');

    // Load completion status
    setLabCompleted(ProgressTracker.isLabComplete(module.id));
    setFlashcardsAdded(ProgressTracker.areFlashcardsAdded(module.id));
    setConfidence(ProgressTracker.getModuleConfidence(module.id));

    // Load video completion status
    const completions = {};
    module.videos.forEach(video => {
      completions[video.id] = ProgressTracker.isVideoComplete(module.id, video.id);
    });
    setVideoCompletions(completions);
  }, [module]);

  const handleVideoComplete = (moduleId, videoId, isComplete) => {
    if (isComplete) {
      ProgressTracker.markVideoComplete(moduleId, videoId);
    }
    setVideoCompletions(prev => ({ ...prev, [videoId]: isComplete }));
  };

  const handleLabToggle = () => {
    if (!labCompleted) {
      ProgressTracker.markLabComplete(module.id);
      setLabCompleted(true);
    }
  };

  const handleFlashcardsToggle = () => {
    if (!flashcardsAdded) {
      ProgressTracker.markFlashcardsAdded(module.id);
      setFlashcardsAdded(true);
    }
  };

  const handleOpenLab = () => {
    if (module.resources && module.resources.lab) {
      onOpenResource('lab', module.resources.lab);
    }
  };

  const handleOpenFlashcards = () => {
    if (module.resources && module.resources.flashcards) {
      onOpenResource('flashcards', module.resources.flashcards);
    }
  };

  const handleConfidenceChange = (newConfidence) => {
    if (newConfidence === 0) {
      ProgressTracker.clearModuleConfidence(module.id);
    } else {
      ProgressTracker.setModuleConfidence(module.id, newConfidence);
    }
    setConfidence(newConfidence);
  };

  return (
    <div className={`module-detail ${animationClass}`}>
      <div className="detail-header">
        <div className="header-navigation">
          <button onClick={onBack} className="back-button">
            ← Back to Modules
          </button>
          <div className="module-navigation">
            {prevModule && (
              <button onClick={handlePrevModule} className="prev-button">
                ← Previous
              </button>
            )}
            {nextModule && (
              <button onClick={handleNextModule} className="next-button">
                Next →
              </button>
            )}
          </div>
        </div>
        <h2>
          Day {module.day}: {module.title}
        </h2>
      </div>

      <div className="detail-content">
        <div className="video-section">
          <h3>Videos</h3>
          <p className="video-note">
            Videos will open in a distraction-free window. Check them off as you watch!
          </p>
          {module.videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              moduleId={module.id}
              isCompleted={videoCompletions[video.id] || false}
              onMarkComplete={handleVideoComplete}
            />
          ))}
        </div>

        <div className="resources-section">
          <h3>Resources</h3>

          {module.resources.lab && (
            <div className="resource-item">
              <div className="resource-info">
                <h4>Packet Tracer Lab</h4>
                <p>{module.resources.lab}</p>
              </div>
              <button onClick={handleOpenLab} className="open-button">
                Open Lab
              </button>
              <label className="checkbox-label">
                <input type="checkbox" checked={labCompleted} onChange={handleLabToggle} />
                <span>Mark as completed</span>
              </label>
            </div>
          )}

          {module.resources.flashcards && (
            <div className="resource-item">
              <div className="resource-info">
                <h4>Anki Flashcards</h4>
                <p>{module.resources.flashcards}</p>
              </div>
              <button onClick={handleOpenFlashcards} className="open-button">
                Open Flashcards
              </button>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={flashcardsAdded}
                  onChange={handleFlashcardsToggle}
                />
                <span>Mark as added to Anki</span>
              </label>
            </div>
          )}

          {!module.resources.lab && !module.resources.flashcards && (
            <p className="no-resources">No resources available for this module.</p>
          )}

          <ConfidenceRating
            moduleId={module.id}
            confidence={confidence}
            onRate={handleConfidenceChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ModuleDetail;
