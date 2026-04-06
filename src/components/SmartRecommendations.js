import React from 'react';
import { format } from 'date-fns';
import ProgressTracker from '../utils/progressTracker';
import '../styles/dashboard.css';

function SmartRecommendations({ modules, onModuleSelect }) {
  const getRecommendations = () => {
    const recommendations = [];

    // 1. Continue where you left off
    const lastWatchedData = ProgressTracker.getLastWatchedModule(modules);
    if (lastWatchedData) {
      const { module } = lastWatchedData;
      if (module && ProgressTracker.getModuleProgress(module) < 100) {
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
    const nextIncomplete = modules.find(m => ProgressTracker.getModuleProgress(m) < 100);
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
        const progress = ProgressTracker.getModuleProgress(m);
        return progress > 50 && progress < 100;
      })
      .sort((a, b) => {
        const progressA = ProgressTracker.getModuleProgress(a);
        const progressB = ProgressTracker.getModuleProgress(b);
        return progressB - progressA;
      });

    if (
      partiallyComplete.length > 0 &&
      !recommendations.find(r => r.module?.id === partiallyComplete[0].id)
    ) {
      const module = partiallyComplete[0];
      const progress = Math.round(ProgressTracker.getModuleProgress(module));
      recommendations.push({
        type: 'quick-win',
        icon: '⚡',
        title: 'Quick Win Opportunity',
        description: `Complete Day ${module.day}: ${module.title} (${progress}% done)`,
        module,
        priority: 7,
      });
    }

    // Note: Removed "related modules" recommendation due to overly simplistic
    // string matching logic. Would need proper topic tagging for accurate results.

    // 6. Study streak motivation
    const streakInfo = JSON.parse(localStorage.getItem('study-streak') || '{}');
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

    // Sort by priority and return top 3-4
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 4);
  };

  const getInsights = () => {
    const insights = [];

    // Study pattern insights
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

    // Confidence insights
    const modulesNeedingReview = ProgressTracker.getModulesNeedingReview(modules);
    if (modulesNeedingReview.length > 5) {
      insights.push({
        icon: '⚠️',
        text: `${modulesNeedingReview.length} modules marked for review. Consider revisiting them.`,
      });
    }

    // Goal insights
    const goalsData = JSON.parse(localStorage.getItem('learning-goals') || '{}');
    if (goalsData.current) {
      const goal = goalsData.current;
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
  };

  const recommendations = getRecommendations();
  const insights = getInsights();

  if (recommendations.length === 0 && insights.length === 0) {
    return null;
  }

  return (
    <div className="smart-recommendations">
      {/* Insights */}
      {insights.length > 0 && (
        <div className="insights-section">
          <h3>Insights</h3>
          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className="insight-item">
                <span className="insight-icon">{insight.icon}</span>
                <span className="insight-text">{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>Recommended For You</h3>
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`recommendation-card ${rec.type}`}
              onClick={() => rec.module && onModuleSelect(rec.module)}
              style={{ cursor: rec.module ? 'pointer' : 'default' }}
            >
              <div className="recommendation-icon">{rec.icon}</div>
              <div className="recommendation-content">
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
              </div>
              {rec.module && <div className="recommendation-action">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartRecommendations;
