import React from 'react';
import ProgressTracker from '../utils/progressTracker';
import '../styles/dashboard.css';

function UpcomingMilestones({ modules }) {
  const getProgressColor = progress => {
    if (progress === 0) return 'hsl(var(--muted))';
    if (progress === 100) return 'var(--color-progress-complete)';
    return 'hsl(var(--ring))';
  };

  const getMilestones = () => {
    const totalModules = modules.length;
    const completedModules = modules.filter(
      module => ProgressTracker.getModuleProgress(module) === 100
    ).length;
    const overallProgress = (completedModules / totalModules) * 100;

    const milestoneTargets = [
      { percent: 25, label: 'Quarter Complete', icon: '🎯' },
      { percent: 50, label: 'Halfway There', icon: '🔥' },
      { percent: 75, label: 'Three Quarters', icon: '💪' },
      { percent: 100, label: 'Full Completion', icon: '🏆' },
    ];

    return milestoneTargets.map(target => {
      const modulesNeeded = Math.ceil((target.percent / 100) * totalModules);
      const modulesRemaining = modulesNeeded - completedModules;
      const isCompleted = overallProgress >= target.percent;
      const isNext = !isCompleted && overallProgress < target.percent;

      return {
        ...target,
        modulesNeeded,
        modulesRemaining: Math.max(0, modulesRemaining),
        isCompleted,
        isNext,
      };
    });
  };

  const getUpcomingModules = () => {
    // Get next 5 incomplete modules
    return modules.filter(module => ProgressTracker.getModuleProgress(module) < 100).slice(0, 5);
  };

  const milestones = getMilestones();
  const nextMilestone = milestones.find(m => m.isNext);
  const upcomingModules = getUpcomingModules();

  return (
    <div className="upcoming-milestones">
      {/* Milestone Progress */}
      <div className="milestone-progress">
        <h3>Course Milestones</h3>
        <div className="milestone-track">
          {milestones.map(milestone => (
            <div
              key={milestone.percent}
              className={`milestone-marker ${milestone.isCompleted ? 'completed' : ''} ${milestone.isNext ? 'next' : ''}`}
            >
              <div className="milestone-icon">{milestone.icon}</div>
              <div className="milestone-label">{milestone.label}</div>
              <div className="milestone-percent">{milestone.percent}%</div>
              {milestone.isNext && (
                <div className="milestone-remaining">
                  {milestone.modulesRemaining} modules to go
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone Card */}
      {nextMilestone && (
        <div className="next-milestone-card">
          <div className="next-milestone-header">
            <span className="next-milestone-icon">{nextMilestone.icon}</span>
            <div>
              <h4>Next Milestone</h4>
              <p>{nextMilestone.label}</p>
            </div>
          </div>
          <div className="next-milestone-stats">
            <div className="stat">
              <span className="stat-value">{nextMilestone.modulesRemaining}</span>
              <span className="stat-label">modules remaining</span>
            </div>
            <div className="stat">
              <span className="stat-value">{nextMilestone.modulesNeeded}</span>
              <span className="stat-label">total needed</span>
            </div>
          </div>
          <div className="milestone-progress-bar">
            <div
              className="milestone-progress-fill"
              style={{
                width: `${((nextMilestone.modulesNeeded - nextMilestone.modulesRemaining) / nextMilestone.modulesNeeded) * 100}%`,
                background: getProgressColor(
                  ((nextMilestone.modulesNeeded - nextMilestone.modulesRemaining) /
                    nextMilestone.modulesNeeded) *
                    100
                ),
              }}
            />
          </div>
        </div>
      )}

      {/* Upcoming Modules */}
      {upcomingModules.length > 0 && (
        <div className="upcoming-modules-list">
          <h4>Up Next</h4>
          {upcomingModules.map((module, index) => {
            const progress = ProgressTracker.getModuleProgress(module);
            return (
              <div key={module.id} className="upcoming-module-item">
                <div className="upcoming-module-number">{index + 1}</div>
                <div className="upcoming-module-info">
                  <div className="upcoming-module-title">
                    Day {module.day}: {module.title}
                  </div>
                  {progress > 0 && (
                    <div className="upcoming-module-progress">
                      <div className="upcoming-progress-bar">
                        <div
                          className="upcoming-progress-fill"
                          style={{ width: `${progress}%`, background: getProgressColor(progress) }}
                        />
                      </div>
                      <span className="upcoming-progress-text">{Math.round(progress)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completion Achievement */}
      {milestones[3].isCompleted && (
        <div className="completion-achievement">
          <div className="achievement-icon">🎉</div>
          <h3>Congratulations!</h3>
          <p>You've completed the entire CCNA course!</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingMilestones;
