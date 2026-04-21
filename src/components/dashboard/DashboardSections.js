// Dashboard section components - extracted from giant switch statement
import React from 'react';
import StudyStreak from '../StudyStreak';
import GoalCard from '../GoalCard';
import PerformanceCharts from '../PerformanceCharts';
import UpcomingMilestones from '../UpcomingMilestones';
import SmartRecommendations from '../SmartRecommendations';
import ProgressTracker from '../../utils/progressTracker';
import ColorHelpers from '../../utils/colorHelpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon, CircularProgress } from '../ui/Icons';

const sectionClass =
  'bg-card rounded-2xl p-3 border border-border shadow-[0_4px_12px_hsl(var(--primary-foreground)/0.1)] animate-[fadeInSubtle_0.4s_ease-out_backwards]';

// Overall Progress Section
export const OverallProgressSection = ({ overallProgress, stats, onAction }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Overall Progress
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex flex-wrap items-start gap-4 max-[600px]:flex-col max-[600px]:items-center">
        <div className="w-[180px] h-[180px] shrink-0">
          <CircularProgress
            percentage={overallProgress}
            strokeColor={ColorHelpers.getProgressColor(overallProgress)}
          />
        </div>
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all duration-150 ease-[ease] hover:border-ring hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.08)]">
              <GridIcon className="w-6 h-6 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-lg font-semibold text-foreground">
                  {stats.completedModules}/{stats.totalModules}
                </span>
                <span className="text-xs text-muted-foreground">Modules</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all duration-150 ease-[ease] hover:border-ring hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.08)]">
              <VideoIcon className="w-6 h-6 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-lg font-semibold text-foreground">
                  {stats.completedVideos}/{stats.totalVideos}
                </span>
                <span className="text-xs text-muted-foreground">Videos</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all duration-150 ease-[ease] hover:border-ring hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.08)]">
              <LabIcon className="w-6 h-6 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-lg font-semibold text-foreground">
                  {stats.completedLabs}/{stats.totalLabs}
                </span>
                <span className="text-xs text-muted-foreground">Labs</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all duration-150 ease-[ease] hover:border-ring hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.08)]">
              <FlashcardsIcon className="w-6 h-6 shrink-0 text-primary" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-lg font-semibold text-foreground">
                  {stats.addedFlashcards}/{stats.totalFlashcards}
                </span>
                <span className="text-xs text-muted-foreground">Flashcards</span>
              </div>
            </div>
          </div>
          <Button className="w-full rounded-full gap-1.5 font-medium" onClick={onAction}>
            {overallProgress > 0 ? '▶️ Continue Learning' : '📚 Start Learning'}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Modules Needing Review Section
export const ModulesNeedingReviewSection = ({ modules, onModuleSelect }) => {
  if (modules.length === 0) return null;

  return (
    <Card className={sectionClass}>
      <CardHeader className="p-0 mb-3">
        <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
          Modules Needing Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-2.5">
          {modules.map(module => {
            const progress = ProgressTracker.getModuleProgress(module);
            const confidence = ProgressTracker.getModuleConfidence(module.id);

            return (
              <div
                key={module.id}
                className="p-3 px-3.5 rounded-[10px] border border-border bg-card cursor-pointer transition-all duration-150 ease-[ease] hover:bg-muted hover:shadow-[0_1px_4px_hsl(var(--primary-foreground)/0.08)]"
                onClick={() => onModuleSelect(module)}
              >
                <h4 className="m-0 mb-1 text-sm">
                  Day {module.day}: {module.title}
                </h4>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span
                    className="font-medium"
                    style={{ color: ColorHelpers.getConfidenceColor(confidence) }}
                  >
                    Confidence: {confidence > 0 ? `${confidence}/5` : 'Not rated'}
                  </span>
                  <span className="text-muted-foreground">Progress: {Math.round(progress)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Wrapper components for existing components
export const StudyStreakSection = ({ refreshKey }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Study Streak
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <StudyStreak refreshKey={refreshKey} />
    </CardContent>
  </Card>
);

export const LearningGoalsSection = ({ modules }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Your Learning Goals
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <GoalCard modules={modules} />
    </CardContent>
  </Card>
);

export const SmartRecommendationsSection = ({ modules, onModuleSelect }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Smart Recommendations
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <SmartRecommendations modules={modules} onModuleSelect={onModuleSelect} />
    </CardContent>
  </Card>
);

export const UpcomingMilestonesSection = ({ modules }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Upcoming Milestones
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <UpcomingMilestones modules={modules} />
    </CardContent>
  </Card>
);

export const PerformanceChartsSection = ({ modules }) => (
  <Card className={sectionClass}>
    <CardHeader className="p-0 mb-3">
      <CardTitle className="text-[22px] font-semibold tracking-[0.02em] m-0">
        Performance Analytics
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <PerformanceCharts modules={modules} />
    </CardContent>
  </Card>
);
