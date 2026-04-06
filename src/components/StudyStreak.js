import React, { useState, useEffect } from 'react';
import StreakTracker from '../utils/streakTracker';
import '../styles/dashboard.css';

function StudyStreak() {
  const [streakInfo, setStreakInfo] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [atRisk, setAtRisk] = useState(false);

  useEffect(() => {
    // Load streak data
    const info = StreakTracker.getStreakInfo();
    setStreakInfo(info);

    // Get last 7 days of activity
    const activity = StreakTracker.getRecentActivity(7);
    setRecentActivity(activity);

    // Get milestone progress
    const milestoneData = StreakTracker.getStreakMilestones();
    setMilestones(milestoneData);

    // Check if streak is at risk
    const risk = StreakTracker.isStreakAtRisk();
    setAtRisk(risk);
  }, []);

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
    if (count === 0) return 'empty';
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

  return (
    <div className="study-streak">
      {/* Current Streak Display */}
      <div className="streak-header">
        <div className="streak-main">
          <div className="streak-icon">{getStreakEmoji(streakInfo.currentStreak)}</div>
          <div className="streak-info">
            <div className="streak-number">
              {streakInfo.currentStreak}
              <span className="streak-label">day streak</span>
            </div>
            <div className={`streak-message ${atRisk ? 'at-risk' : ''}`}>{getStreakMessage()}</div>
          </div>
        </div>

        {streakInfo.longestStreak > 0 && (
          <div className="longest-streak">
            <div className="longest-streak-label">Longest Streak</div>
            <div className="longest-streak-number">🏆 {streakInfo.longestStreak} days</div>
          </div>
        )}
      </div>

      {/* 7-Day Activity Calendar */}
      <div className="activity-calendar">
        <div className="calendar-label">Last 7 Days</div>
        <div className="calendar-grid">
          {recentActivity.map(day => (
            <div key={day.date} className="calendar-day">
              <div className="day-label">{getDayLabel(day.date)}</div>
              <div
                className={`activity-cell ${getActivityIntensity(day.activitiesCompleted)}`}
                title={`${day.date}: ${day.activitiesCompleted} activities`}
              >
                {day.activitiesCompleted > 0 && (
                  <span className="activity-count">{day.activitiesCompleted}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && !nextMilestone.achieved && (
        <div className="milestone-progress">
          <div className="milestone-header">
            <span className="milestone-name">Next: {nextMilestone.name}</span>
            <span className="milestone-target">
              {streakInfo.currentStreak}/{nextMilestone.days} days
            </span>
          </div>
          <div className="milestone-bar">
            <div
              className="milestone-fill"
              style={{ width: `${Math.min(nextMilestone.progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Achieved Milestones */}
      {milestones.some(m => m.achieved) && (
        <div className="achieved-milestones">
          <div className="milestones-label">Achievements</div>
          <div className="milestones-badges">
            {milestones
              .filter(m => m.achieved)
              .map(milestone => (
                <div key={milestone.days} className="milestone-badge" title={milestone.name}>
                  <span className="badge-icon">🏆</span>
                  <span className="badge-days">{milestone.days}d</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyStreak;
