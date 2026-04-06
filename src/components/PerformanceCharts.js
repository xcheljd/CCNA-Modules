import React, { useState, useEffect } from 'react';
import PerformanceTracker from '../utils/performanceTracker';
import ProgressLineChart from './charts/ProgressLineChart';
import ActivityHeatmap from './charts/ActivityHeatmap';
import VelocityBarChart from './charts/VelocityBarChart';
import ConfidenceDistribution from './charts/ConfidenceDistribution';
import '../styles/charts.css';

function PerformanceCharts({ modules }) {
  const [timeRange, setTimeRange] = useState(30); // Default 30 days
  const [progressData, setProgressData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const [confidenceData, setConfidenceData] = useState({
    needsReview: 0,
    moderate: 0,
    confident: 0,
    notRated: 0,
  });
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (!modules || modules.length === 0) return;

    try {
      // Load data based on time range
      // Note: Snapshots are now handled by ActivityTracker on user actions
      loadChartData();
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  }, [modules, timeRange]);

  const loadChartData = () => {
    // Get progress over time data
    const progressHistory = PerformanceTracker.getRecentPerformance(timeRange);
    setProgressData(progressHistory);

    // Get velocity data
    const velocity = PerformanceTracker.getWeeklyVelocity(8);
    setVelocityData(velocity);

    // Get confidence distribution
    const confidence = PerformanceTracker.getConfidenceDistribution(modules);
    setConfidenceData(confidence);

    // Get completion prediction
    const pred = PerformanceTracker.predictCompletionDate(modules, modules.length);
    setPrediction(pred);
  };

  const handleTimeRangeChange = range => {
    setTimeRange(range);
  };

  return (
    <div className="performance-charts">
      {/* Time Range Selector */}
      <div className="chart-controls">
        <div className="time-range-buttons">
          <button
            className={`range-btn ${timeRange === 7 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(7)}
          >
            7 Days
          </button>
          <button
            className={`range-btn ${timeRange === 30 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(30)}
          >
            30 Days
          </button>
          <button
            className={`range-btn ${timeRange === 90 ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange(90)}
          >
            3 Months
          </button>
        </div>

        {prediction && prediction !== 'Completed' && prediction !== 'Unknown' && (
          <div className="completion-prediction">
            <span className="prediction-label">Estimated Completion:</span>
            <span className="prediction-date">{prediction}</span>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Progress Over Time */}
        <div className="chart-card">
          <h3>Progress Over Time</h3>
          <p className="chart-description">Your overall course completion percentage</p>
          <ProgressLineChart data={progressData} />
        </div>

        {/* Activity Heatmap */}
        <div className="chart-card">
          <h3>Activity Calendar</h3>
          <p className="chart-description">Daily study activity heatmap</p>
          <ActivityHeatmap days={timeRange} />
        </div>

        {/* Weekly Velocity */}
        <div className="chart-card">
          <h3>Weekly Completion Rate</h3>
          <p className="chart-description">Modules completed per week</p>
          <VelocityBarChart data={velocityData} />
        </div>

        {/* Confidence Distribution */}
        <div className="chart-card">
          <h3>Confidence Levels</h3>
          <p className="chart-description">How confident you feel about each module</p>
          <ConfidenceDistribution distribution={confidenceData} />
        </div>
      </div>
    </div>
  );
}

export default PerformanceCharts;
