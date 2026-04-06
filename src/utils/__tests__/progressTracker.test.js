import ProgressTracker from '../progressTracker';

describe('ProgressTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('video completion', () => {
    it('should save video progress timestamp', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';
      const timestamp = 123.45;

      ProgressTracker.saveVideoProgress(moduleId, videoId, timestamp);

      expect(localStorage.getItem(`video_${moduleId}_${videoId}`)).toBe('123.45');
    });

    it('should get video progress', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';
      localStorage.setItem(`video_${moduleId}_${videoId}`, '100.5');

      const progress = ProgressTracker.getVideoProgress(moduleId, videoId);

      expect(progress).toBe(100.5);
    });

    it('should return 0 for missing video progress', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';

      const progress = ProgressTracker.getVideoProgress(moduleId, videoId);

      expect(progress).toBe(0);
    });

    it('should mark video as complete', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';

      ProgressTracker.markVideoComplete(moduleId, videoId);

      expect(localStorage.getItem(`video_${moduleId}_${videoId}_completed`)).toBe('true');
    });

    it('should check if video is complete', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';
      localStorage.setItem(`video_${moduleId}_${videoId}_completed`, 'true');

      const result = ProgressTracker.isVideoComplete(moduleId, videoId);

      expect(result).toBe(true);
    });

    it('should unmark video as complete', () => {
      const moduleId = 1;
      const videoId = 'test-video-id';
      localStorage.setItem(`video_${moduleId}_${videoId}_completed`, 'true');

      ProgressTracker.unmarkVideoComplete(moduleId, videoId);

      expect(localStorage.getItem(`video_${moduleId}_${videoId}_completed`)).toBeNull();
    });
  });

  describe('lab completion', () => {
    it('should mark lab as completed', () => {
      const moduleId = 1;

      ProgressTracker.markLabComplete(moduleId);

      expect(localStorage.getItem(`lab_${moduleId}_completed`)).toBe('true');
    });

    it('should check if lab is completed', () => {
      const moduleId = 1;
      localStorage.setItem(`lab_${moduleId}_completed`, 'true');

      const result = ProgressTracker.isLabComplete(moduleId);

      expect(result).toBe(true);
    });

    it('should unmark lab as completed', () => {
      const moduleId = 1;
      localStorage.setItem(`lab_${moduleId}_completed`, 'true');

      ProgressTracker.unmarkLabComplete(moduleId);

      expect(localStorage.getItem(`lab_${moduleId}_completed`)).toBeNull();
    });
  });

  describe('flashcard status', () => {
    it('should mark flashcards as added', () => {
      const moduleId = 1;

      ProgressTracker.markFlashcardsAdded(moduleId);

      expect(localStorage.getItem(`flashcards_${moduleId}_added`)).toBe('true');
    });

    it('should check if flashcards are added', () => {
      const moduleId = 1;
      localStorage.setItem(`flashcards_${moduleId}_added`, 'true');

      const result = ProgressTracker.areFlashcardsAdded(moduleId);

      expect(result).toBe(true);
    });

    it('should unmark flashcards as added', () => {
      const moduleId = 1;
      localStorage.setItem(`flashcards_${moduleId}_added`, 'true');

      ProgressTracker.unmarkFlashcardsAdded(moduleId);

      expect(localStorage.getItem(`flashcards_${moduleId}_added`)).toBeNull();
    });
  });

  describe('module progress calculation', () => {
    it('should calculate progress for module with all items completed', () => {
      const module = {
        id: 1,
        videos: [{ id: 'video1' }, { id: 'video2' }],
        resources: { lab: 'test.pkt', flashcards: 'test.apkg' },
      };

      ProgressTracker.markVideoComplete(1, 'video1');
      ProgressTracker.markVideoComplete(1, 'video2');
      ProgressTracker.markLabComplete(1);
      ProgressTracker.markFlashcardsAdded(1);

      const progress = ProgressTracker.getModuleProgress(module);

      expect(progress).toBe(100);
    });

    it('should calculate progress for module with partial completion', () => {
      const module = {
        id: 1,
        videos: [{ id: 'video1' }, { id: 'video2' }, { id: 'video3' }],
        resources: { lab: 'test.pkt', flashcards: 'test.apkg' },
      };

      ProgressTracker.markVideoComplete(1, 'video1');
      ProgressTracker.markVideoComplete(1, 'video2');

      const progress = ProgressTracker.getModuleProgress(module);

      expect(progress).toBe(40);
    });

    it('should return 0 progress for empty module', () => {
      const module = {
        id: 1,
        videos: [],
        resources: {},
      };

      const progress = ProgressTracker.getModuleProgress(module);

      expect(progress).toBe(0);
    });
  });

  describe('overall progress', () => {
    it('should calculate overall progress across multiple modules', () => {
      const modules = [
        { id: 1, videos: [{ id: 'v1' }], resources: { lab: 'l1', flashcards: 'f1' } },
        { id: 2, videos: [{ id: 'v2' }], resources: { lab: 'l2', flashcards: 'f2' } },
      ];

      ProgressTracker.markVideoComplete(1, 'v1');
      ProgressTracker.markLabComplete(1);
      ProgressTracker.markFlashcardsAdded(1);

      const progress = ProgressTracker.getOverallProgress(modules);

      expect(progress).toBe(50);
    });

    it('should return 0 for empty modules list', () => {
      const progress = ProgressTracker.getOverallProgress([]);

      expect(progress).toBe(0);
    });
  });

  describe('video watch percentage', () => {
    it('should calculate watch percentage', () => {
      const moduleId = 1;
      const videoId = 'test-video';
      const duration = 600;
      const timestamp = 300;

      ProgressTracker.saveVideoProgress(moduleId, videoId, timestamp);

      const percentage = ProgressTracker.getVideoWatchPercentage(moduleId, videoId, duration);

      expect(percentage).toBe(50);
    });

    it('should cap percentage at 100', () => {
      const moduleId = 1;
      const videoId = 'test-video';
      const duration = 600;
      const timestamp = 900;

      ProgressTracker.saveVideoProgress(moduleId, videoId, timestamp);

      const percentage = ProgressTracker.getVideoWatchPercentage(moduleId, videoId, duration);

      expect(percentage).toBe(100);
    });

    it('should return 0 for zero duration', () => {
      const moduleId = 1;
      const videoId = 'test-video';

      const percentage = ProgressTracker.getVideoWatchPercentage(moduleId, videoId, 0);

      expect(percentage).toBe(0);
    });
  });

  describe('last watched video', () => {
    it('should set and get last watched video', () => {
      const moduleId = 1;
      const videoId = 'test-video';

      ProgressTracker.setLastWatchedVideo(moduleId, videoId);
      const lastWatched = ProgressTracker.getLastWatchedVideo();

      expect(lastWatched).toBeDefined();
      expect(lastWatched.moduleId).toBe(moduleId);
      expect(lastWatched.videoId).toBe(videoId);
      expect(lastWatched).toHaveProperty('timestamp');
    });

    it('should get last watched module details', () => {
      const modules = [
        { id: 1, videos: [{ id: 'v1' }] },
        { id: 2, videos: [{ id: 'v2' }] },
      ];

      ProgressTracker.setLastWatchedVideo(1, 'v1');
      const lastWatched = ProgressTracker.getLastWatchedModule(modules);

      expect(lastWatched).toBeDefined();
      expect(lastWatched.module.id).toBe(1);
      expect(lastWatched.video.id).toBe('v1');
    });
  });

  describe('module confidence', () => {
    it('should set and get module confidence', () => {
      const moduleId = 1;
      const confidence = 4;

      ProgressTracker.setModuleConfidence(moduleId, confidence);

      expect(ProgressTracker.getModuleConfidence(moduleId)).toBe(confidence);
    });

    it('should return 0 for unset confidence', () => {
      const moduleId = 999;

      const confidence = ProgressTracker.getModuleConfidence(moduleId);

      expect(confidence).toBe(0);
    });

    it('should clear module confidence', () => {
      const moduleId = 1;
      ProgressTracker.setModuleConfidence(moduleId, 4);

      ProgressTracker.clearModuleConfidence(moduleId);

      expect(ProgressTracker.getModuleConfidence(moduleId)).toBe(0);
    });
  });

  describe('modules needing review', () => {
    it('should identify modules needing review', () => {
      const modules = [
        { id: 1, videos: [{ id: 'v1' }] },
        { id: 2, videos: [{ id: 'v2' }] },
        { id: 3, videos: [{ id: 'v3' }] },
      ];

      ProgressTracker.markVideoComplete(1, 'v1');
      ProgressTracker.setModuleConfidence(1, 2);
      ProgressTracker.markVideoComplete(3, 'v3');
      ProgressTracker.setModuleConfidence(3, 4);

      const needingReview = ProgressTracker.getModulesNeedingReview(modules);

      expect(needingReview.length).toBe(1);
      expect(needingReview[0].id).toBe(1);
    });
  });

  describe('module statistics', () => {
    it('should calculate statistics across all modules', () => {
      const modules = [
        { id: 1, videos: [{ id: 'v1' }], resources: { lab: 'l1', flashcards: 'f1' } },
        { id: 2, videos: [{ id: 'v2' }], resources: { lab: 'l2', flashcards: 'f2' } },
        { id: 3, videos: [{ id: 'v3' }], resources: { lab: 'l3', flashcards: 'f3' } },
      ];

      ProgressTracker.markVideoComplete(1, 'v1');
      ProgressTracker.markVideoComplete(2, 'v2');
      ProgressTracker.markLabComplete(1);
      ProgressTracker.markFlashcardsAdded(1);
      ProgressTracker.setModuleConfidence(1, 4);
      ProgressTracker.setModuleConfidence(2, 3);

      const stats = ProgressTracker.getModuleStatistics(modules);

      expect(stats.totalModules).toBe(3);
      expect(stats.completedModules).toBe(1);
      expect(stats.totalVideos).toBe(3);
      expect(stats.completedVideos).toBe(2);
      expect(stats.addedFlashcards).toBe(1);
      expect(stats.avgConfidence).toBeCloseTo(3.5, 1);
    });
  });

  describe('data import/export', () => {
    it('should export all progress data', () => {
      ProgressTracker.markVideoComplete(1, 'v1');
      ProgressTracker.markLabComplete(1);
      ProgressTracker.setModuleConfidence(1, 4);

      const exported = ProgressTracker.exportProgress();

      expect(Object.keys(exported).length).toBeGreaterThanOrEqual(3);
      expect(exported['video_1_v1_completed']).toBe('true');
      expect(exported['lab_1_completed']).toBe('true');
      expect(exported['confidence_1']).toBe('4');
    });

    it('should import progress data', () => {
      const data = {
        video_1_v1_completed: 'true',
        lab_1_completed: 'true',
        confidence_1: '4',
      };

      ProgressTracker.importProgress(data);

      expect(localStorage.getItem('video_1_v1_completed')).toBe('true');
      expect(localStorage.getItem('lab_1_completed')).toBe('true');
      expect(localStorage.getItem('confidence_1')).toBe('4');
    });
  });

  describe('clear all progress', () => {
    it('should clear all progress data', () => {
      const modules = [
        { id: 1, videos: [{ id: 'v1' }], resources: { lab: 'l1', flashcards: 'f1' } },
      ];

      ProgressTracker.markVideoComplete(1, 'v1');
      ProgressTracker.markLabComplete(1);
      ProgressTracker.markFlashcardsAdded(1);
      ProgressTracker.setModuleConfidence(1, 4);

      ProgressTracker.clearAllProgress();

      expect(localStorage.getItem('video_1_v1_completed')).toBeNull();
      expect(localStorage.getItem('lab_1_completed')).toBeNull();
      expect(localStorage.getItem('flashcards_1_added')).toBeNull();
      expect(localStorage.getItem('confidence_1')).toBeNull();
    });
  });
});
