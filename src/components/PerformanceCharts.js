import React, { useState, useEffect, useCallback } from 'react';
import PerformanceTracker from '../utils/performanceTracker';
import ProgressLineChart from './charts/ProgressLineChart';
import ActivityHeatmap from './charts/ActivityHeatmap';
import VelocityBarChart from './charts/VelocityBarChart';
import ConfidenceDistribution from './charts/ConfidenceDistribution';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

function PerformanceCharts({ modules }) {
  const [timeRange, setTimeRange] = useState(30);
  const [progressData, setProgressData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const [confidenceData, setConfidenceData] = useState({
    needsReview: 0,
    moderate: 0,
    confident: 0,
    notRated: 0,
  });
  const [prediction, setPrediction] = useState(null);

  const loadChartData = useCallback(() => {
    const progressHistory = PerformanceTracker.getRecentPerformance(timeRange);
    setProgressData(progressHistory);

    const velocity = PerformanceTracker.getWeeklyVelocity(8);
    setVelocityData(velocity);

    const confidence = PerformanceTracker.getConfidenceDistribution(modules);
    setConfidenceData(confidence);

    const pred = PerformanceTracker.predictCompletionDate(modules, modules.length);
    setPrediction(pred);
  }, [timeRange, modules]);

  useEffect(() => {
    if (!modules || modules.length === 0) return;

    try {
      loadChartData();
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  }, [modules, loadChartData]);

  const handleTimeRangeChange = range => {
    setTimeRange(range);
  };

  return (
    <div className="mt-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          {[7, 30, 90].map(range => (
            <button
              key={range}
              className={`px-4 py-2 border rounded-md cursor-pointer text-sm font-medium transition-all duration-300 ${timeRange === range ? 'bg-primary text-primary-foreground border-primary shadow-[0_2px_6px_hsl(var(--primary)/0.3),inset_0_1px_0_hsl(var(--primary-foreground)/0.1)]' : 'border-transparent bg-transparent text-muted-foreground hover:bg-card hover:text-foreground hover:border-[hsl(var(--primary)/0.3)] hover:scale-105'}`}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range === 7 ? '7 Days' : range === 30 ? '30 Days' : '3 Months'}
            </button>
          ))}
        </div>

        {prediction && prediction !== 'Completed' && prediction !== 'Unknown' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg border border-border">
            <span className="text-[13px] text-foreground font-medium">Estimated Completion:</span>
            <span className="text-sm font-bold text-[var(--color-progress-complete)]">
              {prediction}
            </span>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(500px,1fr))] gap-6 max-[1200px]:grid-cols-1 max-[768px]:gap-4">
        <Card className="rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold m-0">Progress Over Time</CardTitle>
            <CardDescription className="text-[13px] m-0 mt-1">
              Your overall course completion percentage
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ProgressLineChart data={progressData} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold m-0">Activity Calendar</CardTitle>
            <CardDescription className="text-[13px] m-0 mt-1">
              Daily study activity heatmap
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityHeatmap days={timeRange} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold m-0">Weekly Completion Rate</CardTitle>
            <CardDescription className="text-[13px] m-0 mt-1">
              Modules completed per week
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <VelocityBarChart data={velocityData} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg font-semibold m-0">Confidence Levels</CardTitle>
            <CardDescription className="text-[13px] m-0 mt-1">
              How confident you feel about each module
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ConfidenceDistribution distribution={confidenceData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PerformanceCharts;
