import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import GoalTracker from '../utils/goalTracker';
import GoalModal from './GoalModal';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon, CircularProgress } from './ui/Icons';
import { ColorHelpers } from '@/utils/colorHelpers';

const GOAL_METRICS = [
  { icon: GridIcon, label: 'Modules', key: 'modulesCompleted' },
  { icon: VideoIcon, label: 'Videos', key: 'videosWatched' },
  { icon: LabIcon, label: 'Labs', key: 'labsCompleted' },
  { icon: FlashcardsIcon, label: 'Flashcards', key: 'flashcardsAdded' },
];

export function getProgressPercentage(current, target) {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
}

function GoalMetricCard({ icon: Icon, label, current, target }) {
  const pct = getProgressPercentage(current, target);
  return (
    <div className="flex items-start gap-2.5 p-3 bg-card border border-border rounded-lg transition-all duration-150 ease-[ease] hover:border-ring hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.08)]">
      <Icon className="w-6 h-6 shrink-0 text-primary mt-0.5" />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-[13px] font-semibold text-foreground">
            {current}/{target}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full transition-[width] duration-150 ease-[ease]"
            style={{
              width: `${pct}%`,
              background: ColorHelpers.getProgressColor(pct),
            }}
          />
        </div>
      </div>
    </div>
  );
}

function GoalCard({ modules }) {
  const [goal, setGoal] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successRate, setSuccessRate] = useState(0);

  const loadGoalData = useCallback(() => {
    const activeGoal = GoalTracker.getActiveGoal();
    if (activeGoal) {
      const updated = GoalTracker.updateGoalProgress(modules);
      setGoal(updated);
      if (updated) {
        const completionPercent = GoalTracker.getGoalCompletion(updated);
        setCompletion(completionPercent);
      } else {
        setCompletion(0);
      }
    } else {
      setGoal(null);
      setCompletion(0);
    }

    const rate = GoalTracker.getSuccessRate();
    setSuccessRate(rate);
  }, [modules]);

  useEffect(() => {
    loadGoalData();
  }, [modules, loadGoalData]);

  const handleCreateGoal = goalData => {
    GoalTracker.createGoal(goalData.type, goalData.targets, modules);
    setShowModal(false);
    loadGoalData();
  };

  const handleDeleteGoal = () => {
    GoalTracker.deleteCurrentGoal();
    loadGoalData();
    setShowDeleteConfirm(false);
  };

  if (!goal) {
    return (
      <div className="flex flex-col gap-4 items-center text-center">
        <div className="text-4xl mb-2">🎯</div>
        <h3 className="m-0">No Active Goal</h3>
        <p className="m-0">Set a learning goal to track your progress and stay motivated!</p>
        <Button className="mt-2 rounded-full" onClick={() => setShowModal(true)}>
          Create Your First Goal
        </Button>
        <GoalModal open={showModal} onOpenChange={setShowModal} onCreate={handleCreateGoal} />
      </div>
    );
  }

  const daysRemaining = Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h3 className="m-0">{goal.type === 'weekly' ? 'Weekly' : 'Monthly'} Goal</h3>
          <p className="text-[13px] text-muted-foreground m-0">
            {goal.startDate} to {goal.endDate} &bull; {daysRemaining} days left
          </p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="text-lg"
            onClick={() => setShowDeleteConfirm(true)}
            title="Delete goal"
          >
            🗑️
          </Button>
        </div>
      </div>

      <div className="w-[180px] mx-auto my-2 max-[600px]:w-[130px]">
        <CircularProgress
          percentage={completion}
          strokeColor={completion === 100 ? 'var(--color-progress-complete)' : 'hsl(var(--ring))'}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
        {GOAL_METRICS.filter(m => goal.target[m.key] > 0).map(m => (
          <GoalMetricCard
            key={m.key}
            icon={m.icon}
            label={m.label}
            current={goal.progress[m.key]}
            target={goal.target[m.key]}
          />
        ))}
      </div>

      {successRate > 0 && (
        <div className="mt-1 text-[13px]">
          <span className="text-muted-foreground">Success Rate:</span>{' '}
          <span className="font-semibold">{Math.round(successRate)}%</span>
        </div>
      )}

      <GoalModal open={showModal} onOpenChange={setShowModal} onCreate={handleCreateGoal} />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GoalCard;
