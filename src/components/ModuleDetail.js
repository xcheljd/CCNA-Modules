import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className={`module-detail p-5 ${animationClass}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2.5 gap-2.5">
          <button
            onClick={onBack}
            className="bg-transparent border border-border/50 text-accent text-sm font-semibold cursor-pointer px-4 py-2.5 rounded-lg transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] inline-flex items-center gap-2 relative hover:bg-[hsl(var(--accent)/0.1)] hover:border-[hsl(var(--accent)/0.6)] hover:text-accent hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.2),0_2px_8px_hsl(var(--accent)/0.15)] hover:translate-x-[-2px] active:scale-[0.97] active:bg-[hsl(var(--accent)/0.15)] active:shadow-[inset_0_1px_3px_hsl(var(--accent)/0.2)]"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            Back to Modules
          </button>
          <div className="flex gap-2.5 items-center">
            {prevModule && (
              <button
                onClick={handlePrevModule}
                className="bg-transparent border border-border/50 text-accent text-sm font-semibold cursor-pointer px-4 py-2.5 rounded-lg transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] inline-flex items-center gap-2 relative hover:bg-[hsl(var(--accent)/0.1)] hover:border-[hsl(var(--accent)/0.6)] hover:text-accent hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.2),0_2px_8px_hsl(var(--accent)/0.15)] hover:translate-x-[-2px] active:scale-[0.97] active:bg-[hsl(var(--accent)/0.15)] active:shadow-[inset_0_1px_3px_hsl(var(--accent)/0.2)]"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
                Previous
              </button>
            )}
            {nextModule && (
              <button
                onClick={handleNextModule}
                className="bg-transparent border border-border/50 text-accent text-sm font-semibold cursor-pointer px-4 py-2.5 rounded-lg transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] inline-flex items-center gap-2 relative hover:bg-[hsl(var(--accent)/0.1)] hover:border-[hsl(var(--accent)/0.6)] hover:text-accent hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.2),0_2px_8px_hsl(var(--accent)/0.15)] hover:translate-x-[2px] active:scale-[0.97] active:bg-[hsl(var(--accent)/0.15)] active:shadow-[inset_0_1px_3px_hsl(var(--accent)/0.2)]"
              >
                Next
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
        <h2 className="text-[28px] font-semibold mt-4 mb-0 tracking-wide text-foreground">
          Day {module.day}: {module.title}
        </h2>
      </div>

      <div className="grid grid-cols-[3fr_1fr] gap-8 max-md:grid-cols-1">
        <div>
          <h3 className="mb-2.5 text-foreground">Videos</h3>
          <Alert className="mb-5">
            <AlertDescription>
              Videos will open in a distraction-free window. Check them off as you watch!
            </AlertDescription>
          </Alert>
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

        <div>
          <h3 className="mb-5 text-foreground">Resources</h3>

          {labs.map((labFile, index) => (
            <div className="bg-card border border-border rounded-xl p-5 mb-4" key={`lab-${index}`}>
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">
                  Packet Tracer Lab{labs.length > 1 ? ` ${index + 1}` : ''}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">{labFile}</p>
              </div>
              <div className="flex justify-center mt-2 mb-2.5">
                <button
                  onClick={() => handleOpenLab(labFile)}
                  className="w-[140px] px-4 py-2 bg-primary text-primary-foreground border border-primary-foreground/30 rounded-md cursor-pointer text-[13px] font-semibold mt-2 mb-2.5 whitespace-nowrap transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-primary-foreground hover:-translate-y-px hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.2)]"
                >
                  Open Lab
                </button>
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
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">Anki Flashcards</h4>
                {flashcards.map((fc, index) => (
                  <p key={`fc-label-${index}`} className="text-sm text-muted-foreground mb-4">
                    {fc}
                  </p>
                ))}
              </div>
              <div className="flex gap-2.5 mt-2 mb-2.5 justify-center flex-wrap">
                <button
                  onClick={handleOpenAnki}
                  className="w-[140px] px-4 py-2 bg-primary text-primary-foreground border border-primary-foreground/30 rounded-md cursor-pointer text-[13px] font-semibold whitespace-nowrap transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-primary-foreground hover:-translate-y-px hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.2)]"
                >
                  Open Anki
                </button>
                {flashcards.map((fc, index) => (
                  <button
                    key={`fc-btn-${index}`}
                    onClick={() => handleOpenFlashcards(fc)}
                    className={`px-4 py-2 bg-primary text-primary-foreground border border-primary-foreground/30 rounded-md cursor-pointer text-[13px] font-semibold whitespace-nowrap transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-primary-foreground hover:-translate-y-px hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.2)] ${
                      flashcardsAdded ? 'text-green-400' : ''
                    }`}
                  >
                    {flashcardsAdded
                      ? '✓ Added to Deck'
                      : `Add${flashcards.length > 1 ? ` ${index + 1}` : ''}`}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={flashcardsAdded} onCheckedChange={handleFlashcardsToggle} />
                <span>Mark as added to Anki</span>
              </label>
            </div>
          )}

          {module.resources?.spreadsheet && (
            <div className="bg-card border border-border rounded-xl p-5 mb-4">
              <div className="mb-1">
                <h4 className="mb-1 text-foreground">Excel Spreadsheet</h4>
                <p className="text-sm text-muted-foreground mb-4">{module.resources.spreadsheet}</p>
              </div>
              <div className="flex justify-center mt-2 mb-2.5">
                <button
                  onClick={handleOpenSpreadsheet}
                  className="w-[140px] px-4 py-2 bg-primary text-primary-foreground border border-primary-foreground/30 rounded-md cursor-pointer text-[13px] font-semibold whitespace-nowrap transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-primary-foreground hover:-translate-y-px hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.2)]"
                >
                  Open Spreadsheet
                </button>
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
