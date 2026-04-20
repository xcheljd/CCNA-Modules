import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import ProgressTracker from '../utils/progressTracker';
import StreakTracker from '../utils/streakTracker';
import GoalTracker from '../utils/goalTracker';

function buildRecommendations(modules) {
  const recommendations = [];
  const progressById = new Map(modules.map(m => [m.id, ProgressTracker.getModuleProgress(m)]));
  const progressOf = m => progressById.get(m.id) ?? 0;

  // 1. Continue where you left off
  const lastWatchedData = ProgressTracker.getLastWatchedModule(modules);
  if (lastWatchedData) {
    const { module } = lastWatchedData;
    if (module && progressOf(module) < 100) {
      recommendations.push({
        type: 'continue',
        icon: '▶️',
        title: 'Continue Where You Left Off',
        description: `Resume Day ${module.day}: ${module.title}`,
        module,
        priority: 10,
      });
    }
  }

  // 2. Modules needing review (low confidence)
  const needingReview = ProgressTracker.getModulesNeedingReview(modules);
  if (needingReview.length > 0) {
    const module = needingReview[0];
    const confidence = ProgressTracker.getModuleConfidence(module.id);
    recommendations.push({
      type: 'review',
      icon: '🔄',
      title: 'Review Low Confidence Module',
      description: `Day ${module.day}: ${module.title} (${confidence}/5 confidence)`,
      module,
      priority: 9,
    });
  }

  // 3. Next sequential module
  const nextIncomplete = modules.find(m => progressOf(m) < 100);
  if (nextIncomplete && !recommendations.find(r => r.module?.id === nextIncomplete.id)) {
    recommendations.push({
      type: 'next',
      icon: '🎯',
      title: 'Continue Your Learning Path',
      description: `Start Day ${nextIncomplete.day}: ${nextIncomplete.title}`,
      module: nextIncomplete,
      priority: 8,
    });
  }

  // 4. Quick wins - modules that are >50% complete
  const partiallyComplete = modules
    .filter(m => {
      const progress = progressOf(m);
      return progress > 50 && progress < 100;
    })
    .sort((a, b) => progressOf(b) - progressOf(a));

  if (
    partiallyComplete.length > 0 &&
    !recommendations.find(r => r.module?.id === partiallyComplete[0].id)
  ) {
    const module = partiallyComplete[0];
    const progress = Math.round(progressOf(module));
    recommendations.push({
      type: 'quick-win',
      icon: '⚡',
      title: 'Quick Win Opportunity',
      description: `Complete Day ${module.day}: ${module.title} (${progress}% done)`,
      module,
      priority: 7,
    });
  }

  // Study streak motivation
  const streakInfo = StreakTracker.getStreakInfo();
  const currentStreak = streakInfo.currentStreak || 0;
  if (currentStreak > 0 && nextIncomplete) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const lastStudyDate = streakInfo.lastStudyDate;
    const isToday = lastStudyDate === today;

    if (!isToday && !recommendations.find(r => r.type === 'streak')) {
      recommendations.push({
        type: 'streak',
        icon: '🔥',
        title: 'Maintain Your Streak',
        description: `You're on a ${currentStreak}-day streak! Study today to keep it going.`,
        module: nextIncomplete,
        priority: 9,
      });
    }
  }

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

function buildInsights(modules) {
  const insights = [];

  const completedModules = modules.filter(m => ProgressTracker.getModuleProgress(m) === 100);
  const totalModules = modules.length;
  const completionRate = (completedModules.length / totalModules) * 100;

  if (completionRate > 75) {
    insights.push({
      icon: '🌟',
      text: "You're almost there! Just a few more modules to complete the course.",
    });
  } else if (completionRate > 50) {
    insights.push({
      icon: '💪',
      text: "Great progress! You've completed over half the course.",
    });
  } else if (completionRate > 25) {
    insights.push({
      icon: '📚',
      text: "You're building momentum! Keep up the steady progress.",
    });
  } else if (completionRate > 0) {
    insights.push({
      icon: '🚀',
      text: 'Good start! Consistency is key to success.',
    });
  }

  const modulesNeedingReview = ProgressTracker.getModulesNeedingReview(modules);
  if (modulesNeedingReview.length > 5) {
    insights.push({
      icon: '⚠️',
      text: `${modulesNeedingReview.length} modules marked for review. Consider revisiting them.`,
    });
  }

  const goal = GoalTracker.getActiveGoal();
  if (goal) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const daysRemaining = Math.ceil(
      (new Date(goal.endDate) - new Date(today)) / (1000 * 60 * 60 * 24)
    );

    if (daysRemaining <= 3 && daysRemaining > 0) {
      insights.push({
        icon: '⏰',
        text: `Your goal ends in ${daysRemaining} days. Time to push for the finish!`,
      });
    }
  }

  return insights;
}

function SmartRecommendations({ modules, onModuleSelect }) {
  const recommendations = useMemo(() => buildRecommendations(modules), [modules]);
  const insights = useMemo(() => buildInsights(modules), [modules]);

  if (recommendations.length === 0 && insights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Insights */}
      {insights.length > 0 && (
        <div className="pb-1">
          <h3 className="mb-2">Insights</h3>
          <div className="flex flex-col gap-1.5">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 text-[13px]">
                <span className="text-base">{insight.icon}</span>
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
          <Separator className="mt-4" />
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 className="mb-2">Recommended For You</h3>
        <div className="flex flex-col gap-2.5">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`py-3.5 px-[18px] rounded-[14px] border bg-card flex items-center gap-4 transition-all duration-150 ease-[ease] ${rec.type === 'continue' ? 'border-[hsl(var(--primary-foreground)/0.9)] shadow-[0_0_0_1px_hsl(var(--primary-foreground)/0.6),0_18px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_0_1px_hsl(var(--primary-foreground)/0.9),0_22px_40px_rgba(0,0,0,0.8)]' : 'border-border hover:bg-muted'}`}
              onClick={() => rec.module && onModuleSelect(rec.module)}
              style={{ cursor: rec.module ? 'pointer' : 'default' }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${rec.type === 'continue' ? 'bg-[hsl(var(--primary-foreground)/0.16)]' : 'bg-[hsl(var(--primary)/0.15)]'}`}
              >
                {rec.icon}
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <h4 className="m-0 text-[15px] font-semibold">{rec.title}</h4>
                <p className="m-0 text-[13px] text-muted-foreground">{rec.description}</p>
              </div>
              {rec.module && <div className="text-lg opacity-80">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartRecommendations;
