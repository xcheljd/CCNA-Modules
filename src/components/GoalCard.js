import React, { useState, useEffect, useCallback } from 'react';
import GoalTracker from '../utils/goalTracker';
import GoalModal from './GoalModal';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon, CircularProgress } from './ui/Icons';
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
      } else {
        setCompletion(0);
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
    GoalTracker.createGoal(goalData.type, goalData.targets, modules);
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
        <CircularProgress
          percentage={completion}
          strokeColor={completion === 100 ? 'var(--color-progress-complete)' : 'hsl(var(--ring))'}
        />
      </div>

      <div className="goal-metrics goal-metrics-grid">
        {goal.target.modulesCompleted > 0 && (
          <div className="goal-metric-card">
            <GridIcon className="goal-metric-icon" />
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
            <VideoIcon className="goal-metric-icon" />
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
            <LabIcon className="goal-metric-icon" />
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
            <FlashcardsIcon className="goal-metric-icon" />
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
