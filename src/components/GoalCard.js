import React, { useState, useEffect, useCallback } from 'react';
import GoalTracker from '../utils/goalTracker';
import GoalModal from './GoalModal';
import '../styles/dashboard.css';

function GoalCard({ modules }) {
  const [goal, setGoal] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [successRate, setSuccessRate] = useState(0);

  const loadGoalData = useCallback(() => {
    const activeGoal = GoalTracker.getActiveGoal();
    if (activeGoal) {
      const updated = GoalTracker.updateGoalProgress(modules);
      setGoal(updated);
      if (updated) {
        const completionPercent = GoalTracker.getGoalCompletion(updated);
        setCompletion(completionPercent);
      }
    } else {
      setGoal(null);
      setCompletion(0);
    }

    const rate = GoalTracker.getSuccessRate();
    setSuccessRate(rate);
  }, [modules]);

  useEffect(() => {
    loadGoalData();
  }, [modules, loadGoalData]);

  const handleCreateGoal = goalData => {
    GoalTracker.createGoal(goalData.type, goalData.targets);
    setShowModal(false);
    loadGoalData();
  };

  const handleDeleteGoal = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      GoalTracker.deleteCurrentGoal();
      loadGoalData();
    }
  };

  const getProgressPercentage = (current, target) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current, target) => {
    const progress = getProgressPercentage(current, target);
    if (progress === 0) return 'hsl(var(--muted))';
    if (progress === 100) return 'var(--color-progress-complete)';
    return 'hsl(var(--ring))';
  };

  if (!goal) {
    return (
      <div className="goal-card no-goal">
        <div className="no-goal-content">
          <div className="no-goal-icon">🎯</div>
          <h3>No Active Goal</h3>
          <p>Set a learning goal to track your progress and stay motivated!</p>
          <button className="create-goal-btn" onClick={() => setShowModal(true)}>
            Create Your First Goal
          </button>
        </div>
        {showModal && <GoalModal onClose={() => setShowModal(false)} onCreate={handleCreateGoal} />}
      </div>
    );
  }

  const daysRemaining = Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="goal-card">
      <div className="goal-header">
        <div>
          <h3>{goal.type === 'weekly' ? 'Weekly' : 'Monthly'} Goal</h3>
          <p className="goal-period">
            {goal.startDate} to {goal.endDate} • {daysRemaining} days left
          </p>
        </div>
        <div className="goal-actions">
          <button className="goal-action-btn" onClick={handleDeleteGoal} title="Delete goal">
            🗑️
          </button>
        </div>
      </div>

      <div className="goal-progress-ring">
        <svg viewBox="0 0 36 36" className="circular-chart">
          <path
            className="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            stroke={completion === 100 ? 'var(--color-progress-complete)' : 'hsl(var(--ring))'}
            strokeDasharray={`${completion}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="18" className="percentage">
            {Math.round(completion)}%
          </text>
        </svg>
      </div>

      <div className="goal-metrics goal-metrics-grid">
        {goal.target.modulesCompleted > 0 && (
          <div className="goal-metric-card">
            <svg
              className="goal-metric-icon"
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
            <div className="goal-metric-content">
              <div className="goal-metric-header">
                <span className="goal-metric-label">Modules</span>
                <span className="goal-metric-value">
                  {goal.progress.modulesCompleted}/{goal.target.modulesCompleted}
                </span>
              </div>
              <div className="goal-metric-bar">
                <div
                  className="goal-metric-fill"
                  style={{
                    width: `${getProgressPercentage(goal.progress.modulesCompleted, goal.target.modulesCompleted)}%`,
                    background: getProgressColor(
                      goal.progress.modulesCompleted,
                      goal.target.modulesCompleted
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {goal.target.videosWatched > 0 && (
          <div className="goal-metric-card">
            <svg
              className="goal-metric-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
              <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
            </svg>
            <div className="goal-metric-content">
              <div className="goal-metric-header">
                <span className="goal-metric-label">Videos</span>
                <span className="goal-metric-value">
                  {goal.progress.videosWatched}/{goal.target.videosWatched}
                </span>
              </div>
              <div className="goal-metric-bar">
                <div
                  className="goal-metric-fill"
                  style={{
                    width: `${getProgressPercentage(goal.progress.videosWatched, goal.target.videosWatched)}%`,
                    background: getProgressColor(
                      goal.progress.videosWatched,
                      goal.target.videosWatched
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {goal.target.labsCompleted > 0 && (
          <div className="goal-metric-card">
            <svg
              className="goal-metric-icon"
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
            <div className="goal-metric-content">
              <div className="goal-metric-header">
                <span className="goal-metric-label">Labs</span>
                <span className="goal-metric-value">
                  {goal.progress.labsCompleted}/{goal.target.labsCompleted}
                </span>
              </div>
              <div className="goal-metric-bar">
                <div
                  className="goal-metric-fill"
                  style={{
                    width: `${getProgressPercentage(goal.progress.labsCompleted, goal.target.labsCompleted)}%`,
                    background: getProgressColor(
                      goal.progress.labsCompleted,
                      goal.target.labsCompleted
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {goal.target.flashcardsAdded > 0 && (
          <div className="goal-metric-card">
            <svg
              className="goal-metric-icon"
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
            <div className="goal-metric-content">
              <div className="goal-metric-header">
                <span className="goal-metric-label">Flashcards</span>
                <span className="goal-metric-value">
                  {goal.progress.flashcardsAdded}/{goal.target.flashcardsAdded}
                </span>
              </div>
              <div className="goal-metric-bar">
                <div
                  className="goal-metric-fill"
                  style={{
                    width: `${getProgressPercentage(goal.progress.flashcardsAdded, goal.target.flashcardsAdded)}%`,
                    background: getProgressColor(
                      goal.progress.flashcardsAdded,
                      goal.target.flashcardsAdded
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {successRate > 0 && (
        <div className="goal-stats">
          <span className="stat-label">Success Rate:</span>
          <span className="stat-value">{Math.round(successRate)}%</span>
        </div>
      )}

      {showModal && <GoalModal onClose={() => setShowModal(false)} onCreate={handleCreateGoal} />}
    </div>
  );
}

export default GoalCard;
