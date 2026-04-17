import React, { useState, useEffect, useRef } from 'react';
import VideoCard from './VideoCard';
import ConfidenceRating from './ConfidenceRating';
import { useToast } from '@/components/ui/toast';
import ProgressTracker from '../utils/progressTracker';
import ActivityTracker from '../utils/activityTracker';
import { asArray } from '@/utils/helpers';
import '../styles/modules.css';

function ModuleDetail({
  module,
  modules,
  onBack,
  onOpenResource,
  onModuleSelect,
  onProgressChange,
}) {
  const { info } = useToast();
  const [labCompletions, setLabCompletions] = useState({});
  const [flashcardsAdded, setFlashcardsAdded] = useState(false);
  const [videoCompletions, setVideoCompletions] = useState({});
  const [confidence, setConfidence] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const navTimerRef = useRef(null);

  // Find the next and previous modules by array position
  const moduleIndex = modules.findIndex(m => m.id === module.id);
  const nextModule = moduleIndex >= 0 ? modules[moduleIndex + 1] : undefined;
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : undefined;

  const scheduleNavigation = (target, direction) => {
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
    }
    setAnimationClass(direction);
    navTimerRef.current = setTimeout(() => {
      navTimerRef.current = null;
      onModuleSelect(target);
    }, 300);
  };

  const handleNextModule = () => {
    if (nextModule) scheduleNavigation(nextModule, 'slide-right');
  };

  const handlePrevModule = () => {
    if (prevModule) scheduleNavigation(prevModule, 'slide-left');
  };

  useEffect(() => {
    return () => {
      if (navTimerRef.current) {
        clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Reset animation class
    setAnimationClass('');

    // Load completion status
    const moduleLabs = asArray(module.resources?.lab);
    setLabCompletions(ProgressTracker.getLabCompletions(module.id, moduleLabs.length));
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
    onProgressChange?.();
  };

  const handleLabToggle = labIndex => {
    const newState = !labCompletions[labIndex];
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordLabCompletion(module.id, labIndex, newState, modules);
    setLabCompletions(prev => ({ ...prev, [labIndex]: newState }));
    onProgressChange?.();
  };

  const handleFlashcardsToggle = () => {
    const newState = !flashcardsAdded;
    // Use ActivityTracker to coordinate all tracking systems
    ActivityTracker.recordFlashcardsAdded(module.id, newState, modules);
    setFlashcardsAdded(newState);
    onProgressChange?.();
  };

  const labs = asArray(module.resources?.lab);
  const flashcards = asArray(module.resources?.flashcards);
  const hasResources = labs.length > 0 || flashcards.length > 0 || module.resources?.spreadsheet;

  const handleOpenLab = labFile => {
    onOpenResource('lab', labFile);
  };

  const handleOpenAnki = () => {
    if (window.electronAPI && window.electronAPI.openAnki) {
      window.electronAPI.openAnki();
    } else {
      info('Opening Anki requires the desktop app. Please install Anki separately.');
    }
  };

  const handleOpenFlashcards = flashcardFile => {
    onOpenResource('flashcards', flashcardFile);
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
    onProgressChange?.();
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

          {labs.map((labFile, index) => (
            <div className="resource-item" key={`lab-${index}`}>
              <div className="resource-info">
                <h4>Packet Tracer Lab{labs.length > 1 ? ` ${index + 1}` : ''}</h4>
                <p>{labFile}</p>
              </div>
              <div className="resource-button-single">
                <button onClick={() => handleOpenLab(labFile)} className="open-button">
                  Open Lab
                </button>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={labCompletions[index] || false}
                  onChange={() => handleLabToggle(index)}
                />
                <span>
                  {labs.length > 1 ? `Mark lab ${index + 1} as completed` : 'Mark lab as completed'}
                </span>
              </label>
            </div>
          ))}

          {flashcards.length > 0 && (
            <div className="resource-item">
              <div className="resource-info">
                <h4>Anki Flashcards</h4>
                {flashcards.map((fc, index) => (
                  <p key={`fc-label-${index}`}>{fc}</p>
                ))}
              </div>
              <div className="resource-buttons">
                <button onClick={handleOpenAnki} className="open-button">
                  Open Anki
                </button>
                {flashcards.map((fc, index) => (
                  <button
                    key={`fc-btn-${index}`}
                    onClick={() => handleOpenFlashcards(fc)}
                    className={`open-button add-flashcards-btn ${flashcardsAdded ? 'added' : ''}`}
                  >
                    {flashcardsAdded
                      ? '✓ Added to Deck'
                      : `Add${flashcards.length > 1 ? ` ${index + 1}` : ''}`}
                  </button>
                ))}
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

          {module.resources?.spreadsheet && (
            <div className="resource-item">
              <div className="resource-info">
                <h4>Excel Spreadsheet</h4>
                <p>{module.resources.spreadsheet}</p>
              </div>
              <div className="resource-button-single">
                <button onClick={handleOpenSpreadsheet} className="open-button spreadsheet-button">
                  Open Spreadsheet
                </button>
              </div>
            </div>
          )}

          {!hasResources && <p className="no-resources">No resources available for this module.</p>}

          <ConfidenceRating confidence={confidence} onRate={handleConfidenceChange} />
        </div>
      </div>
    </div>
  );
}

export default ModuleDetail;
