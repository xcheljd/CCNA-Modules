import React, { useState, useEffect } from 'react';
import StreakTracker from '../utils/streakTracker';

function StudyStreak({ refreshKey }) {
  const [streakInfo, setStreakInfo] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [atRisk, setAtRisk] = useState(false);

  useEffect(() => {
    const info = StreakTracker.getStreakInfo();
    setStreakInfo(info);

    const activity = StreakTracker.getRecentActivity(7);
    setRecentActivity(activity);

    const milestoneData = StreakTracker.getStreakMilestones();
    setMilestones(milestoneData);

    const risk = StreakTracker.isStreakAtRisk();
    setAtRisk(risk);
  }, [refreshKey]);

  const getStreakEmoji = streak => {
    if (streak === 0) return '📚';
    if (streak < 7) return '🔥';
    if (streak < 30) return '🔥🔥';
    return '🔥🔥🔥';
  };

  const getStreakMessage = () => {
    if (streakInfo.currentStreak === 0) {
      return 'Start your learning journey today!';
    }
    if (atRisk) {
      return "Don't break your streak! Study today!";
    }
    if (streakInfo.currentStreak === 1) {
      return 'Great start! Come back tomorrow!';
    }
    if (streakInfo.currentStreak < 7) {
      return `${7 - streakInfo.currentStreak} more days to earn your first badge!`;
    }
    return 'Amazing dedication! Keep it up!';
  };

  const getActivityIntensity = count => {
    if (count === 0) return '';
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  };

  const getDayLabel = dateStr => {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getNextMilestone = () => {
    return milestones.find(m => !m.achieved) || milestones[milestones.length - 1];
  };

  const nextMilestone = getNextMilestone();

  const cellColor = intensity => {
    if (!intensity) return 'bg-card';
    if (intensity === 'low') return 'bg-[hsl(var(--primary)/0.3)]';
    if (intensity === 'medium') return 'bg-[hsl(var(--primary)/0.5)]';
    return 'bg-primary';
  };

  const cellText = intensity => {
    if (intensity === 'high') return 'text-primary-foreground';
    return 'text-foreground';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Current Streak Display */}
      <div className="flex justify-between gap-4 items-center max-[900px]:flex-col max-[900px]:items-start">
        <div className="flex items-center gap-4">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-accent flex items-center justify-center text-2xl">
            {getStreakEmoji(streakInfo.currentStreak)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[32px] font-bold leading-none">
              {streakInfo.currentStreak}
              <span className="ml-1.5 text-sm font-medium text-muted-foreground">day streak</span>
            </div>
            <div
              className={`text-sm font-medium ${atRisk ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {getStreakMessage()}
            </div>
          </div>
        </div>

        {streakInfo.longestStreak > 0 && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Longest Streak</div>
            <div className="text-sm font-semibold">🏆 {streakInfo.longestStreak} days</div>
          </div>
        )}
      </div>

      {/* 7-Day Activity Calendar */}
      <div className="py-4 px-[18px] rounded-[14px] bg-muted">
        <div className="text-[15px] font-semibold text-muted-foreground mb-2.5">Last 7 Days</div>
        <div className="grid grid-cols-7 gap-1.5">
          {recentActivity.map(day => {
            const intensity = getActivityIntensity(day.activitiesCompleted);
            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5">
                <div className="text-[13px] font-medium text-muted-foreground">
                  {getDayLabel(day.date)}
                </div>
                <div
                  className={`w-[52px] h-[52px] rounded-xl ${cellColor(intensity)} flex items-center justify-center text-lg font-bold`}
                  title={`${day.date}: ${day.activitiesCompleted} activities`}
                >
                  {day.activitiesCompleted > 0 && (
                    <span className={cellText(intensity)}>{day.activitiesCompleted}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && !nextMilestone.achieved && (
        <div className="flex flex-col items-center gap-3 mt-1">
          <div className="flex justify-between items-center w-full gap-2">
            <span className="text-sm font-semibold text-foreground">
              Next: {nextMilestone.name}
            </span>
            <span className="text-[13px] font-medium text-muted-foreground">
              {streakInfo.currentStreak}/{nextMilestone.days} days
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(nextMilestone.progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Achieved Milestones */}
      {milestones.some(m => m.achieved) && (
        <div className="flex flex-col gap-2">
          <div className="text-[13px] text-muted-foreground">Achievements</div>
          <div className="flex flex-wrap gap-2">
            {milestones
              .filter(m => m.achieved)
              .map(milestone => (
                <div
                  key={milestone.days}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--primary)/0.1)] text-primary text-xs"
                  title={milestone.name}
                >
                  <span className="text-sm">🏆</span>
                  <span className="font-semibold">{milestone.days}d</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyStreak;
