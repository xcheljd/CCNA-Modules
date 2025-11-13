// Progress tracking utilities using localStorage

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

  isVideoComplete(moduleId, videoId) {
    return localStorage.getItem(`video_${moduleId}_${videoId}_completed`) === 'true';
  },

  getVideoWatchPercentage(moduleId, videoId, duration) {
    const timestamp = this.getVideoProgress(moduleId, videoId);
    if (duration === 0) return 0;
    return Math.min((timestamp / duration) * 100, 100);
  },

  // Lab progress
  markLabComplete(moduleId) {
    localStorage.setItem(`lab_${moduleId}_completed`, 'true');
  },

  isLabComplete(moduleId) {
    return localStorage.getItem(`lab_${moduleId}_completed`) === 'true';
  },

  // Flashcard progress
  markFlashcardsAdded(moduleId) {
    localStorage.setItem(`flashcards_${moduleId}_added`, 'true');
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

    // Count lab
    if (module.resources && module.resources.lab) {
      totalItems += 1;
      if (this.isLabComplete(module.id)) {
        completedItems += 1;
      }
    }

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
    return lastWatched ? JSON.parse(lastWatched) : null;
  },

  setLastWatchedVideo(moduleId, videoId) {
    localStorage.setItem(
      'last_watched',
      JSON.stringify({ moduleId, videoId, timestamp: Date.now() })
    );
  },

  // Export all progress data
  exportProgress() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  },

  // Import progress data
  importProgress(data) {
    Object.keys(data).forEach(key => {
      localStorage.setItem(key, data[key]);
    });
  },

  // Clear all progress
  clearAllProgress() {
    localStorage.clear();
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
      return (progress > 0 && confidence > 0 && confidence <= 2);
    });
  },
};

export default ProgressTracker;
