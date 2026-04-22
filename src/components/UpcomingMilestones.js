import React from 'react';
import ProgressTracker from '../utils/progressTracker';
import { ColorHelpers } from '@/utils/colorHelpers';

function UpcomingMilestones({ modules }) {
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
    return modules.filter(module => ProgressTracker.getModuleProgress(module) < 100).slice(0, 5);
  };

  const milestones = getMilestones();
  const nextMilestone = milestones.find(m => m.isNext);
  const upcomingModules = getUpcomingModules();

  return (
    <div className="flex flex-col gap-4">
      {/* Milestone Progress */}
      <div>
        <h3 className="m-0 mb-3 text-base font-semibold">Course Milestones</h3>
        <div className="flex flex-wrap gap-3">
          {milestones.map(milestone => (
            <div
              key={milestone.percent}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-[10px] border text-center ${milestone.isCompleted ? 'border-border bg-[hsl(var(--primary)/0.1)]' : milestone.isNext ? 'border-primary bg-card' : 'border-border bg-card'}`}
            >
              <div className="text-xl mb-1">{milestone.icon}</div>
              <div className="text-[13px] font-medium">{milestone.label}</div>
              <div className="text-xs text-muted-foreground">{milestone.percent}%</div>
              {milestone.isNext && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {milestone.modulesRemaining} modules to go
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone Card */}
      {nextMilestone && (
        <div className="py-3.5 px-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2.5">
            <span className="text-[22px]">{nextMilestone.icon}</span>
            <div>
              <h4 className="m-0">Next Milestone</h4>
              <p className="m-0">{nextMilestone.label}</p>
            </div>
          </div>
          <div className="flex gap-4 max-[900px]:flex-col">
            <div>
              <span className="text-base font-semibold">{nextMilestone.modulesRemaining}</span>
              <span className="text-xs text-muted-foreground ml-1">modules remaining</span>
            </div>
            <div>
              <span className="text-base font-semibold">{nextMilestone.modulesNeeded}</span>
              <span className="text-xs text-muted-foreground ml-1">total needed</span>
            </div>
          </div>
          <div className="mt-2.5 w-full h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-[inherit]"
              style={{
                width: `${((nextMilestone.modulesNeeded - nextMilestone.modulesRemaining) / nextMilestone.modulesNeeded) * 100}%`,
                background: ColorHelpers.getProgressColor(
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
        <div className="flex flex-col gap-2.5">
          <h4 className="m-0">Up Next</h4>
          {upcomingModules.map((module, index) => {
            const progress = ProgressTracker.getModuleProgress(module);
            return (
              <div key={module.id} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm">
                    Day {module.day}: {module.title}
                  </div>
                  {progress > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full"
                          style={{
                            width: `${progress}%`,
                            background: ColorHelpers.getProgressColor(progress),
                          }}
                        />
                      </div>
                      <span className="text-xs">{Math.round(progress)}%</span>
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
        <div className="mt-2 py-3 px-3.5 rounded-xl border border-primary bg-[hsl(var(--primary)/0.1)] text-center">
          <div className="text-2xl">🎉</div>
          <h3 className="m-0">Congratulations!</h3>
          <p className="m-0">You've completed the entire CCNA course!</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingMilestones;
