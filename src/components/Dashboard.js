import React, { useState, useEffect } from 'react';
import ProgressTracker from '../utils/progressTracker';
import ActivityTracker from '../utils/activityTracker';
import SettingsManager from '../utils/settingsManager';
import { getDefaultDashboardConfig } from '../utils/dashboardConfig';
import {
  OverallProgressSection,
  ModulesNeedingReviewSection,
  StudyStreakSection,
  LearningGoalsSection,
  SmartRecommendationsSection,
  UpcomingMilestonesSection,
  PerformanceChartsSection,
} from './dashboard/DashboardSections';
import '../styles/dashboard.css';

function Dashboard({ modules, onModuleSelect }) {
  const [overallProgress, setOverallProgress] = useState(0);
  const [lastWatched, setLastWatched] = useState(null);
  const [modulesNeedingReview, setModulesNeedingReview] = useState([]);
  const [stats, setStats] = useState({
    totalModules: 0,
    completedModules: 0,
    totalVideos: 0,
    completedVideos: 0,
    totalLabs: 0,
    completedLabs: 0,
    totalFlashcards: 0,
    addedFlashcards: 0,
  });
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data whenever Dashboard mounts
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Load dashboard configuration
    let config = SettingsManager.getDashboardConfig();
    if (!config) {
      config = getDefaultDashboardConfig();
      SettingsManager.saveDashboardConfig(config);
    }
    setDashboardConfig(config);

    if (!modules || modules.length === 0) return;

    // Ensure tracking is initialized and up to date
    ActivityTracker.initializeTracking(modules);

    // Calculate overall progress
    const progress = ProgressTracker.getOverallProgress(modules);
    setOverallProgress(progress);

    // Get last watched video using helper
    const lastWatchedData = ProgressTracker.getLastWatchedModule(modules);
    if (lastWatchedData) {
      setLastWatched(lastWatchedData);
    }

    // Get modules needing review
    const needingReview = ProgressTracker.getModulesNeedingReview(modules);
    setModulesNeedingReview(needingReview.slice(0, 5)); // Limit to 5

    // Calculate statistics using consolidated utility
    const stats = ProgressTracker.getModuleStatistics(modules);
    setStats(stats);
  }, [modules, refreshKey]);

  const getSectionsToRender = () => {
    if (!dashboardConfig) return [];

    return dashboardConfig.sections
      .filter(section => section.enabled)
      .sort((a, b) => a.order - b.order);
  };

  const handleStartOrContinueLearning = () => {
    if (lastWatched) {
      onModuleSelect(lastWatched.module);
    } else {
      const firstIncompleteModule = modules.find(
        module => ProgressTracker.getModuleProgress(module) < 100
      );
      if (firstIncompleteModule) {
        onModuleSelect(firstIncompleteModule);
      } else if (modules[0]) {
        onModuleSelect(modules[0]);
      }
    }
  };

  // Section renderer using component map
  const sectionComponents = {
    'study-streak': () => <StudyStreakSection key="study-streak" />,
    'learning-goals': () => <LearningGoalsSection key="learning-goals" modules={modules} />,
    'overall-progress': () => (
      <OverallProgressSection
        key="overall-progress"
        overallProgress={overallProgress}
        stats={stats}
        onAction={handleStartOrContinueLearning}
      />
    ),
    'modules-needing-review': () => (
      <ModulesNeedingReviewSection
        key="modules-needing-review"
        modules={modulesNeedingReview}
        onModuleSelect={onModuleSelect}
      />
    ),
    'smart-recommendations': () => (
      <SmartRecommendationsSection
        key="smart-recommendations"
        modules={modules}
        onModuleSelect={onModuleSelect}
      />
    ),
    'upcoming-milestones': () => (
      <UpcomingMilestonesSection key="upcoming-milestones" modules={modules} />
    ),
    'performance-charts': () => (
      <PerformanceChartsSection key="performance-charts" modules={modules} />
    ),
  };

  const sectionsToRender = getSectionsToRender();

  // Section pairs for grid layout
  const sectionPairs = [
    ['study-streak', 'learning-goals'],
    ['upcoming-milestones', 'smart-recommendations'],
  ];

  const isPaired = (id1, id2) => {
    return sectionPairs.some(
      ([first, second]) => (id1 === first && id2 === second) || (id1 === second && id2 === first)
    );
  };

  const rendered = new Set();

  return (
    <div className="dashboard">
      {sectionsToRender.map((section, idx) => {
        if (rendered.has(section.id)) return null;

        const nextSection = sectionsToRender[idx + 1];
        if (nextSection && isPaired(section.id, nextSection.id)) {
          rendered.add(section.id);
          rendered.add(nextSection.id);
          return (
            <div key={`${section.id}-${nextSection.id}`} className="dashboard-grid-pair">
              {sectionComponents[section.id]?.()}
              {sectionComponents[nextSection.id]?.()}
            </div>
          );
        }

        rendered.add(section.id);
        return sectionComponents[section.id]?.();
      })}
    </div>
  );
}

export default Dashboard;
