// Progress tracking utilities using localStorage
import { asArray } from './helpers';

export const PROGRESS_KEY_PREFIXES = [
  'video_',
  'lab_',
  'flashcards_',
  'confidence_',
  'last_watched',
  'study-streak',
  'learning-goals',
  'performance-data',
];

export function isProgressKey(key) {
  return PROGRESS_KEY_PREFIXES.some(prefix => key.startsWith(prefix));
}

export const ProgressTracker = {
  // Video progress
  saveVideoProgress(moduleId, videoId, timestamp) {
    localStorage.setItem(`video_${moduleId}_${videoId}`, timestamp.toString());
  },

  getVideoProgress(moduleId, videoId) {
    const progress = localStorage.getItem(`video_${moduleId}_${videoId}`);
    return progress ? parseFloat(progress) : 0;
  },

  markVideoComplete(moduleId, videoId) {
    localStorage.setItem(`video_${moduleId}_${videoId}_completed`, 'true');
  },

  unmarkVideoComplete(moduleId, videoId) {
    localStorage.removeItem(`video_${moduleId}_${videoId}_completed`);
  },

  isVideoComplete(moduleId, videoId) {
    return localStorage.getItem(`video_${moduleId}_${videoId}_completed`) === 'true';
  },

  getVideoWatchPercentage(moduleId, videoId, duration) {
    const timestamp = this.getVideoProgress(moduleId, videoId);
    if (duration === 0) return 0;
    return Math.min((timestamp / duration) * 100, 100);
  },

  // Lab progress
  markLabComplete(moduleId, labIndex) {
    localStorage.setItem(`lab_${moduleId}_${labIndex}_completed`, 'true');
  },

  unmarkLabComplete(moduleId, labIndex) {
    localStorage.removeItem(`lab_${moduleId}_${labIndex}_completed`);
  },

  isLabComplete(moduleId, labIndex) {
    return localStorage.getItem(`lab_${moduleId}_${labIndex}_completed`) === 'true';
  },

  // Check if all labs in a module are completed
  areAllLabsComplete(moduleId, labCount) {
    for (let i = 0; i < labCount; i++) {
      if (!this.isLabComplete(moduleId, i)) return false;
    }
    return labCount > 0;
  },

  // Get lab completion state map for a module
  // Note: legacy lab key migration (lab_X_completed -> lab_X_0_completed) is
  // handled once at startup by migrations.js, not here.
  getLabCompletions(moduleId, labCount) {
    const completions = {};
    for (let i = 0; i < labCount; i++) {
      completions[i] = this.isLabComplete(moduleId, i);
    }
    return completions;
  },

  // Flashcard progress
  markFlashcardsAdded(moduleId) {
    localStorage.setItem(`flashcards_${moduleId}_added`, 'true');
  },

  unmarkFlashcardsAdded(moduleId) {
    localStorage.removeItem(`flashcards_${moduleId}_added`);
  },

  areFlashcardsAdded(moduleId) {
    return localStorage.getItem(`flashcards_${moduleId}_added`) === 'true';
  },

  // Module overall progress
  getModuleProgress(module) {
    let totalItems = 0;
    let completedItems = 0;

    // Count videos
    if (module.videos && module.videos.length > 0) {
      totalItems += module.videos.length;
      module.videos.forEach(video => {
        if (this.isVideoComplete(module.id, video.id)) {
          completedItems += 1;
        }
      });
    }

    // Count labs (each lab file counts individually)
    const labFiles = asArray(module.resources?.lab);
    totalItems += labFiles.length;
    labFiles.forEach((_, index) => {
      if (this.isLabComplete(module.id, index)) {
        completedItems += 1;
      }
    });

    // Count flashcards
    if (module.resources && module.resources.flashcards) {
      totalItems += 1;
      if (this.areFlashcardsAdded(module.id)) {
        completedItems += 1;
      }
    }

    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  },

  // Overall course progress
  getOverallProgress(modules) {
    if (!modules || modules.length === 0) return 0;

    const totalProgress = modules.reduce((sum, module) => {
      return sum + this.getModuleProgress(module);
    }, 0);

    return totalProgress / modules.length;
  },

  // Get last watched video
  getLastWatchedVideo() {
    const lastWatched = localStorage.getItem('last_watched');
    if (!lastWatched) return null;
    try {
      return JSON.parse(lastWatched);
    } catch {
      console.error('Corrupted last_watched data, clearing');
      localStorage.removeItem('last_watched');
      return null;
    }
  },

  setLastWatchedVideo(moduleId, videoId) {
    localStorage.setItem(
      'last_watched',
      JSON.stringify({ moduleId, videoId, timestamp: Date.now() })
    );
  },

  // Export all progress-related data (without settings or UI-only keys)
  exportProgress() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isProgressKey(key)) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  },

  // Import progress data
  importProgress(data) {
    Object.keys(data).forEach(key => {
      if (isProgressKey(key)) {
        localStorage.setItem(key, data[key]);
      }
    });
  },

  // Clear all progress-related data while preserving app settings & theme
  clearAllProgress() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isProgressKey(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // Confidence rating (1-5 scale)
  setModuleConfidence(moduleId, confidence) {
    if (confidence < 1 || confidence > 5) {
      console.error('Confidence must be between 1 and 5');
      return;
    }
    localStorage.setItem(`confidence_${moduleId}`, confidence.toString());
  },

  getModuleConfidence(moduleId) {
    const confidence = localStorage.getItem(`confidence_${moduleId}`);
    return confidence ? parseInt(confidence, 10) : 0; // 0 means not rated
  },

  clearModuleConfidence(moduleId) {
    localStorage.removeItem(`confidence_${moduleId}`);
  },

  // Get modules that need review (low confidence or completed but low confidence)
  getModulesNeedingReview(modules) {
    return modules.filter(module => {
      const confidence = this.getModuleConfidence(module.id);
      const progress = this.getModuleProgress(module);
      // Need review if: completed but low confidence (1-2) or in progress with low confidence
      return progress > 0 && confidence > 0 && confidence <= 2;
    });
  },

  // Get module statistics - used by performance and goal trackers
  getModuleStatistics(modules) {
    let completedModules = 0;
    let completedVideos = 0;
    let completedLabs = 0;
    let addedFlashcards = 0;
    let totalConfidence = 0;
    let ratedModules = 0;
    let totalVideos = 0;
    let totalLabs = 0;
    let totalFlashcards = 0;

    modules.forEach(module => {
      // Count completed modules
      if (this.getModuleProgress(module) === 100) {
        completedModules++;
      }

      // Count completed videos and total videos
      if (module.videos) {
        totalVideos += module.videos.length;
        module.videos.forEach(video => {
          if (this.isVideoComplete(module.id, video.id)) {
            completedVideos++;
          }
        });
      }

      // Count completed labs and total labs (each lab file counts individually)
      const labFiles = asArray(module.resources?.lab);
      totalLabs += labFiles.length;
      labFiles.forEach((_, index) => {
        if (this.isLabComplete(module.id, index)) {
          completedLabs++;
        }
      });

      // Count added flashcards and total flashcards
      if (module.resources?.flashcards) {
        totalFlashcards++;
        if (this.areFlashcardsAdded(module.id)) {
          addedFlashcards++;
        }
      }

      // Calculate average confidence
      const confidence = this.getModuleConfidence(module.id);
      if (confidence > 0) {
        totalConfidence += confidence;
        ratedModules++;
      }
    });

    return {
      totalModules: modules.length,
      completedModules,
      totalVideos,
      completedVideos,
      totalLabs,
      completedLabs,
      totalFlashcards,
      addedFlashcards,
      avgConfidence: ratedModules > 0 ? totalConfidence / ratedModules : 0,
    };
  },

  // Get last watched module with its details
  getLastWatchedModule(modules) {
    const lastWatched = this.getLastWatchedVideo();
    if (!lastWatched) return null;

    const module = modules.find(m => m.id === lastWatched.moduleId);
    if (!module) return null;

    const video = module.videos?.find(v => v.id === lastWatched.videoId);

    return {
      module,
      video,
      timestamp: lastWatched.timestamp,
    };
  },
};

export default ProgressTracker;
