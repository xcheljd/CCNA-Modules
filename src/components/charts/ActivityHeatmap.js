import React from 'react';
import StreakTracker from '../../utils/streakTracker';
import '../../styles/charts.css';

function ActivityHeatmap({ days = 30 }) {
  const recentActivity = StreakTracker.getRecentActivity(days);

  const getIntensityClass = count => {
    if (count === 0) return 'intensity-0';
    if (count <= 2) return 'intensity-1';
    if (count <= 5) return 'intensity-2';
    if (count <= 8) return 'intensity-3';
    return 'intensity-4';
  };

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group by weeks for better visualization
  const weeks = [];
  for (let i = 0; i < recentActivity.length; i += 7) {
    weeks.push(recentActivity.slice(i, i + 7));
  }

  return (
    <div className="chart-container">
      <div className="activity-heatmap">
        <div className="heatmap-container">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="heatmap-week">
              {week.map(day => (
                <div
                  key={day.date}
                  className={`heatmap-cell ${getIntensityClass(day.activitiesCompleted)}`}
                  title={`${formatDate(day.date)}: ${day.activitiesCompleted} activities`}
                >
                  <span className="cell-count">
                    {day.activitiesCompleted > 0 ? day.activitiesCompleted : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <div className="legend-cells">
            <div className="legend-cell intensity-0" />
            <div className="legend-cell intensity-1" />
            <div className="legend-cell intensity-2" />
            <div className="legend-cell intensity-3" />
            <div className="legend-cell intensity-4" />
          </div>
          <span className="legend-label">More</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
