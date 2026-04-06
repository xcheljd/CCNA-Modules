// Dashboard section configuration and defaults

export const DASHBOARD_SECTIONS = [
  {
    id: 'study-streak',
    title: 'Study Streak',
    description: 'Daily study streak and activity calendar',
    component: 'StudyStreak',
    defaultEnabled: true,
    defaultOrder: 1,
    removable: true,
  },
  {
    id: 'learning-goals',
    title: 'Learning Goals',
    description: 'Set and track your study goals',
    component: 'GoalCard',
    defaultEnabled: true,
    defaultOrder: 2,
    removable: true,
  },
  {
    id: 'overall-progress',
    title: 'Overall Progress',
    description: 'Course completion overview with statistics',
    component: 'ProgressOverview',
    defaultEnabled: true,
    defaultOrder: 3,
    removable: false,
  },
  {
    id: 'modules-needing-review',
    title: 'Modules Needing Review',
    description: 'Modules with low confidence ratings',
    component: 'ReviewModules',
    defaultEnabled: true,
    defaultOrder: 5,
    removable: true,
    conditional: true, // Only shows when there are modules needing review
  },
  {
    id: 'smart-recommendations',
    title: 'Smart Recommendations',
    description: 'AI-powered study suggestions',
    component: 'SmartRecommendations',
    defaultEnabled: true,
    defaultOrder: 6,
    removable: true,
  },
  {
    id: 'upcoming-milestones',
    title: 'Upcoming Milestones',
    description: 'Track your upcoming achievements',
    component: 'UpcomingMilestones',
    defaultEnabled: true,
    defaultOrder: 9,
    removable: true,
  },
  {
    id: 'performance-charts',
    title: 'Performance Analytics',
    description: 'Detailed performance charts and graphs',
    component: 'PerformanceCharts',
    defaultEnabled: true,
    defaultOrder: 10,
    removable: true,
  },
];

// Get default dashboard configuration
export function getDefaultDashboardConfig() {
  return {
    sections: DASHBOARD_SECTIONS.map(section => ({
      id: section.id,
      enabled: section.defaultEnabled,
      order: section.defaultOrder,
    })),
  };
}

export default {
  DASHBOARD_SECTIONS,
  getDefaultDashboardConfig,
};
