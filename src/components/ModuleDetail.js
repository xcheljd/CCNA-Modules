import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import ActivityTracker from '../utils/activityTracker';
import '../styles/modules.css';

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
      }, 300);
    }
  };

  const handlePrevModule = () => {
    if (prevModule) {
      setAnimationClass('slide-left');
      setTimeout(() => {
        onModuleSelect(prevModule);
      }, 300);
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
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordVideoCompletion(moduleId, videoId, isComplete, modules);
    setVideoCompletions(prev => ({ ...prev, [videoId]: isComplete }));
  };

  const handleLabToggle = () => {
    const newState = !labCompleted;
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordLabCompletion(module.id, newState, modules);
    setLabCompleted(newState);
  };

  const handleFlashcardsToggle = () => {
    const newState = !flashcardsAdded;
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordFlashcardsAdded(module.id, newState, modules);
    setFlashcardsAdded(newState);
  };

  const handleOpenLab = () => {
    if (module.resources && module.resources.lab) {
      onOpenResource('lab', module.resources.lab);
    }
  };

  const handleOpenAnki = () => {
    // Just open Anki application without a specific file
    if (window.electronAPI && window.electronAPI.openAnki) {
      window.electronAPI.openAnki();
    } else {
      alert('Opening Anki requires the desktop app. Please install Anki separately.');
    }
  };

  const handleOpenFlashcards = () => {
    if (module.resources && module.resources.flashcards) {
      onOpenResource('flashcards', module.resources.flashcards);
    }
  };

  const handleOpenSpreadsheet = () => {
    if (module.resources && module.resources.spreadsheet) {
      onOpenResource('spreadsheet', module.resources.spreadsheet);
    }
  };

  const handleConfidenceChange = newConfidence => {
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordConfidenceRating(module.id, newConfidence, modules);
    setConfidence(newConfidence);
  };

  return (
    <div className={`module-detail ${animationClass}`}>
      <div className="detail-header">
        <div className="header-navigation">
          <button onClick={onBack} className="back-button">
            Back to Modules
          </button>
          <div className="module-navigation">
            {prevModule && (
              <button onClick={handlePrevModule} className="prev-button">
                Previous
              </button>
            )}
            {nextModule && (
              <button onClick={handleNextModule} className="next-button">
                Next
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
              <div className="resource-buttons">
                <button onClick={handleOpenAnki} className="open-button">
                  Open Anki
                </button>
                <button
                  onClick={handleOpenFlashcards}
                  className={`open-button add-flashcards-btn ${flashcardsAdded ? 'added' : ''}`}
                >
                  {flashcardsAdded ? '✓ Added to Deck' : 'Add Flashcards'}
                </button>
              </div>
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

          {module.resources.spreadsheet && (
            <div className="resource-item">
              <div className="resource-info">
                <h4>Excel Spreadsheet</h4>
                <p>{module.resources.spreadsheet}</p>
              </div>
              <button onClick={handleOpenSpreadsheet} className="open-button spreadsheet-button">
                Open Spreadsheet
              </button>
            </div>
          )}

          {!module.resources.lab &&
            !module.resources.flashcards &&
            !module.resources.spreadsheet && (
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
