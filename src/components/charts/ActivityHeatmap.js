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
    <div className="my-2 mx-0">
      <div className="p-4">
        <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map(day => (
                <div
                  key={day.date}
                  className={`heatmap-cell w-7 h-7 rounded flex items-center justify-center cursor-pointer transition-all duration-200 border border-transparent hover:border-primary hover:z-10 max-[768px]:w-6 max-[768px]:h-6 ${getIntensityClass(day.activitiesCompleted)}`}
                  title={`${formatDate(day.date)}: ${day.activitiesCompleted} activities`}
                >
                  <span className="cell-count text-[13px] font-black text-foreground relative z-10 max-[768px]:text-[9px]">
                    {day.activitiesCompleted > 0 ? day.activitiesCompleted : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-[11px] text-muted-foreground">Less</span>
          <div className="flex gap-[3px]">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className={`legend-cell w-4 h-4 rounded-[3px] intensity-${i}`} />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
