// Dashboard section components - extracted from giant switch statement
import React from 'react';
import StudyStreak from '../StudyStreak';
import GoalCard from '../GoalCard';
import PerformanceCharts from '../PerformanceCharts';
import UpcomingMilestones from '../UpcomingMilestones';
import SmartRecommendations from '../SmartRecommendations';
import ProgressTracker from '../../utils/progressTracker';
import ColorHelpers from '../../utils/colorHelpers';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon, CircularProgress } from '../ui/Icons';

// Overall Progress Section
export const OverallProgressSection = ({ overallProgress, stats, onAction }) => (
  <div className="dashboard-section">
    <h2>Overall Progress</h2>
    <div className="progress-overview progress-overview-sidebyside">
      <div className="circular-progress circular-progress-hero">
        <CircularProgress
          percentage={overallProgress}
          strokeColor={ColorHelpers.getProgressColor(overallProgress)}
        />
      </div>
      <div className="progress-stats-container">
        <div className="progress-stats progress-stats-grid">
          <div className="stat-card">
            <GridIcon className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedModules}/{stats.totalModules}
              </span>
              <span className="stat-label">Modules</span>
            </div>
          </div>
          <div className="stat-card">
            <VideoIcon className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedVideos}/{stats.totalVideos}
              </span>
              <span className="stat-label">Videos</span>
            </div>
          </div>
          <div className="stat-card">
            <LabIcon className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedLabs}/{stats.totalLabs}
              </span>
              <span className="stat-label">Labs</span>
            </div>
          </div>
          <div className="stat-card">
            <FlashcardsIcon className="stat-icon" />
            <div className="stat-content">
              <span className="stat-value">
                {stats.addedFlashcards}/{stats.totalFlashcards}
              </span>
              <span className="stat-label">Flashcards</span>
            </div>
          </div>
        </div>
        <button className="progress-action-btn" onClick={onAction}>
          {overallProgress > 0 ? '▶️ Continue Learning' : '📚 Start Learning'}
        </button>
      </div>
    </div>
  </div>
);

// Modules Needing Review Section
export const ModulesNeedingReviewSection = ({ modules, onModuleSelect }) => {
  if (modules.length === 0) return null;

  return (
    <div className="dashboard-section">
      <h2>Modules Needing Review</h2>
      <div className="review-modules">
        {modules.map(module => {
          const progress = ProgressTracker.getModuleProgress(module);
          const confidence = ProgressTracker.getModuleConfidence(module.id);

          return (
            <div
              key={module.id}
              className="review-module-card"
              onClick={() => onModuleSelect(module)}
            >
              <div className="review-module-info">
                <h4>
                  Day {module.day}: {module.title}
                </h4>
                <div className="review-module-stats">
                  <span
                    className="confidence-indicator"
                    style={{ color: ColorHelpers.getConfidenceColor(confidence) }}
                  >
                    Confidence: {confidence > 0 ? `${confidence}/5` : 'Not rated'}
                  </span>
                  <span className="progress-indicator">Progress: {Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Wrapper components for existing components
export const StudyStreakSection = ({ refreshKey }) => (
  <div className="dashboard-section">
    <h2>Study Streak</h2>
    <StudyStreak refreshKey={refreshKey} />
  </div>
);

export const LearningGoalsSection = ({ modules }) => (
  <div className="dashboard-section">
    <h2>Your Learning Goals</h2>
    <GoalCard modules={modules} />
  </div>
);

export const SmartRecommendationsSection = ({ modules, onModuleSelect }) => (
  <div className="dashboard-section">
    <h2>Smart Recommendations</h2>
    <SmartRecommendations modules={modules} onModuleSelect={onModuleSelect} />
  </div>
);

export const UpcomingMilestonesSection = ({ modules }) => (
  <div className="dashboard-section">
    <h2>Upcoming Milestones</h2>
    <UpcomingMilestones modules={modules} />
  </div>
);

export const PerformanceChartsSection = ({ modules }) => (
  <div className="dashboard-section">
    <h2>Performance Analytics</h2>
    <PerformanceCharts modules={modules} />
  </div>
);
