// Dashboard section components - extracted from giant switch statement
import React from 'react';
import StudyStreak from '../StudyStreak';
import GoalCard from '../GoalCard';
import PerformanceCharts from '../PerformanceCharts';
import UpcomingMilestones from '../UpcomingMilestones';
import SmartRecommendations from '../SmartRecommendations';
import ProgressTracker from '../../utils/progressTracker';
import ColorHelpers from '../../utils/colorHelpers';

// Overall Progress Section
export const OverallProgressSection = ({ overallProgress, stats, onAction }) => (
  <div className="dashboard-section">
    <h2>Overall Progress</h2>
    <div className="progress-overview progress-overview-sidebyside">
      <div className="circular-progress circular-progress-hero">
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            stroke={ColorHelpers.getProgressColor(overallProgress)}
            strokeDasharray={`${overallProgress}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="18" className="percentage">
            {Math.round(overallProgress)}%
          </text>
        </svg>
      </div>
      <div className="progress-stats-container">
        <div className="progress-stats progress-stats-grid">
          <div className="stat-card">
            <svg
              className="stat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedModules}/{stats.totalModules}
              </span>
              <span className="stat-label">Modules</span>
            </div>
          </div>
          <div className="stat-card">
            <svg
              className="stat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
              <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
            </svg>
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedVideos}/{stats.totalVideos}
              </span>
              <span className="stat-label">Videos</span>
            </div>
          </div>
          <div className="stat-card">
            <svg
              className="stat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
            </svg>
            <div className="stat-content">
              <span className="stat-value">
                {stats.completedLabs}/{stats.totalLabs}
              </span>
              <span className="stat-label">Labs</span>
            </div>
          </div>
          <div className="stat-card">
            <svg
              className="stat-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="2"
                y="4"
                width="12"
                height="16"
                rx="2"
                transform="rotate(-15 8 12)"
                fill="none"
              />
              <rect x="6" y="3" width="12" height="16" rx="2" fill="hsl(var(--card))" />
              <rect
                x="10"
                y="4"
                width="12"
                height="16"
                rx="2"
                transform="rotate(15 16 12)"
                fill="hsl(var(--card))"
              />
            </svg>
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
export const StudyStreakSection = () => (
  <div className="dashboard-section">
    <h2>Study Streak</h2>
    <StudyStreak />
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
