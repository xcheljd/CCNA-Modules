import React, { useState, useEffect, useCallback } from 'react';
import PerformanceTracker from '../utils/performanceTracker';
import ProgressLineChart from './charts/ProgressLineChart';
import ActivityHeatmap from './charts/ActivityHeatmap';
import VelocityBarChart from './charts/VelocityBarChart';
import ConfidenceDistribution from './charts/ConfidenceDistribution';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function PerformanceCharts({ modules }) {
  const [timeRange, setTimeRange] = useState(7);
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
        <ToggleGroup
          type="single"
          value={String(timeRange)}
          onValueChange={value => {
            if (value) handleTimeRangeChange(Number(value));
          }}
          className="bg-muted p-1 rounded-lg"
        >
          <ToggleGroupItem value="7" size="sm">
            7 Days
          </ToggleGroupItem>
          <ToggleGroupItem value="30" size="sm">
            30 Days
          </ToggleGroupItem>
          <ToggleGroupItem value="90" size="sm">
            3 Months
          </ToggleGroupItem>
        </ToggleGroup>

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
