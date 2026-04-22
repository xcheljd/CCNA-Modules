import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    <div className={`module-detail px-5 pt-5 pb-5 ${animationClass}`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2.5 gap-2.5">
          <Button variant="outline" className="gap-2" onClick={onBack}>
            <ChevronLeft size={18} strokeWidth={2.5} />
            Back to Modules
          </Button>
          <div className="flex gap-2.5 items-center">
            {prevModule && (
              <Button variant="outline" className="gap-2" onClick={handlePrevModule}>
                <ChevronLeft size={18} strokeWidth={2.5} />
                Previous
              </Button>
            )}
            {nextModule && (
              <Button variant="outline" className="gap-2" onClick={handleNextModule}>
                Next
                <ChevronRight size={18} strokeWidth={2.5} />
              </Button>
            )}
          </div>
        </div>
        <h2 className="text-[28px] font-semibold mt-4 mb-0 tracking-wide text-foreground">
          Day {module.day}: {module.title}
        </h2>
      </div>

      <div className="grid grid-cols-[3fr_1fr] gap-5 max-md:grid-cols-1">
        <div>
          <h3 className="mb-2.5 text-foreground">Videos</h3>
          {module.videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              moduleId={module.id}
              isCompleted={videoCompletions[video.id] || false}
              onMarkComplete={handleVideoComplete}
            />
          ))}
          <Alert className="mt-5">
            <AlertDescription>
              Videos will open in a distraction-free window. Check them off as you watch!
            </AlertDescription>
          </Alert>
        </div>

        <div>
          <h3 className="mb-2.5 text-foreground">Resources</h3>

          {labs.map((labFile, index) => (
            <div
              className="bg-card border border-border rounded-xl px-4 py-3 mb-3"
              key={`lab-${index}`}
            >
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">
                  Packet Tracer Lab{labs.length > 1 ? ` ${index + 1}` : ''}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{labFile}</p>
              </div>
              <div className="flex justify-center mt-2 mb-2.5">
                <Button
                  size="sm"
                  className="w-[140px] font-semibold"
                  onClick={() => handleOpenLab(labFile)}
                >
                  Open Lab
                </Button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox
                  checked={labCompletions[index] || false}
                  onCheckedChange={() => handleLabToggle(index)}
                />
                <span>
                  {labs.length > 1 ? `Mark lab ${index + 1} as completed` : 'Mark lab as completed'}
                </span>
              </label>
            </div>
          ))}

          {flashcards.length > 0 && (
            <div className="bg-card border border-border rounded-xl px-4 py-3 mb-3">
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">Anki Flashcards</h4>
                {flashcards.map((fc, index) => (
                  <p key={`fc-label-${index}`} className="text-sm text-muted-foreground mb-4">
                    {fc}
                  </p>
                ))}
              </div>
              <div className="flex gap-2.5 mt-2 mb-2.5 justify-center flex-wrap">
                <Button size="sm" className="w-[140px] font-semibold" onClick={handleOpenAnki}>
                  Open Anki
                </Button>
                {flashcards.map((fc, index) => (
                  <Button
                    key={`fc-btn-${index}`}
                    variant={flashcardsAdded ? 'secondary' : 'default'}
                    size="sm"
                    className="font-semibold"
                    onClick={() => handleOpenFlashcards(fc)}
                  >
                    {flashcardsAdded
                      ? '✓ Added to Deck'
                      : `Add${flashcards.length > 1 ? ` ${index + 1}` : ''}`}
                  </Button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={flashcardsAdded} onCheckedChange={handleFlashcardsToggle} />
                <span>Mark as added to Anki</span>
              </label>
            </div>
          )}

          {module.resources?.spreadsheet && (
            <div className="bg-card border border-border rounded-xl px-4 py-3 mb-3">
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">Excel Spreadsheet</h4>
                <p className="text-sm text-muted-foreground mb-4">{module.resources.spreadsheet}</p>
              </div>
              <div className="flex justify-center mt-2 mb-2.5">
                <Button
                  size="sm"
                  className="w-[140px] font-semibold"
                  onClick={handleOpenSpreadsheet}
                >
                  Open Spreadsheet
                </Button>
              </div>
            </div>
          )}

          {!hasResources && (
            <p className="text-muted-foreground italic">No resources available for this module.</p>
          )}

          <ConfidenceRating confidence={confidence} onRate={handleConfidenceChange} />
        </div>
      </div>
    </div>
  );
}

export default ModuleDetail;
