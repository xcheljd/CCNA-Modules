// Learning goals tracking utility using localStorage
import { format, addDays, addWeeks, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import ProgressTracker from './progressTracker';

export const GoalTracker = {
  // Get all goals data
  getGoalsData() {
    const data = localStorage.getItem('learning-goals');
    if (!data) {
      return {
        current: null,
        history: [],
        streakGoals: 0,
      };
    }
    return JSON.parse(data);
  },

  // Save goals data
  saveGoalsData(data) {
    localStorage.setItem('learning-goals', JSON.stringify(data));
  },

  // Create a new goal
  createGoal(type, targets) {
    const data = this.getGoalsData();

    // Complete current goal if exists
    if (data.current) {
      this.completeCurrentGoal();
    }

    const today = new Date();
    let endDate;

    if (type === 'weekly') {
      endDate = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }); // End of next Sunday
    } else if (type === 'monthly') {
      endDate = addMonths(today, 1);
    } else {
      // Custom duration
      endDate = addDays(today, targets.customDays || 7);
    }

    const newGoal = {
      id: `goal-${Date.now()}`,
      type,
      target: {
        modulesCompleted: targets.modulesCompleted || 0,
        videosWatched: targets.videosWatched || 0,
        labsCompleted: targets.labsCompleted || 0,
        flashcardsAdded: targets.flashcardsAdded || 0,
      },
      progress: {
        modulesCompleted: 0,
        videosWatched: 0,
        labsCompleted: 0,
        flashcardsAdded: 0,
      },
      startDate: format(today, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      status: 'active',
    };

    data.current = newGoal;
    this.saveGoalsData(data);
    return newGoal;
  },

  // Get active goal
  getActiveGoal() {
    const data = this.getGoalsData();
    return data.current;
  },

  // Update goal progress
  updateGoalProgress(modules) {
    const data = this.getGoalsData();
    if (!data.current) return null;

    const goal = data.current;
    const today = format(new Date(), 'yyyy-MM-dd');

    // Check if goal has expired
    if (today > goal.endDate) {
      this.completeCurrentGoal();
      return null;
    }

    // Calculate current progress using consolidated utility
    const stats = ProgressTracker.getModuleStatistics(modules);

    // Update progress
    goal.progress = {
      modulesCompleted: stats.completedModules,
      videosWatched: stats.completedVideos,
      labsCompleted: stats.completedLabs,
      flashcardsAdded: stats.addedFlashcards,
    };

    data.current = goal;
    this.saveGoalsData(data);
    return goal;
  },

  // Get goal completion percentage
  getGoalCompletion(goal) {
    if (!goal) return 0;

    const targets = [];
    const progresses = [];

    if (goal.target.modulesCompleted > 0) {
      targets.push(goal.target.modulesCompleted);
      progresses.push(goal.progress.modulesCompleted);
    }
    if (goal.target.videosWatched > 0) {
      targets.push(goal.target.videosWatched);
      progresses.push(goal.progress.videosWatched);
    }
    if (goal.target.labsCompleted > 0) {
      targets.push(goal.target.labsCompleted);
      progresses.push(goal.progress.labsCompleted);
    }
    if (goal.target.flashcardsAdded > 0) {
      targets.push(goal.target.flashcardsAdded);
      progresses.push(goal.progress.flashcardsAdded);
    }

    if (targets.length === 0) return 0;

    let totalPercentage = 0;
    for (let i = 0; i < targets.length; i++) {
      const percentage = Math.min((progresses[i] / targets[i]) * 100, 100);
      totalPercentage += percentage;
    }

    return totalPercentage / targets.length;
  },

  // Complete current goal
  completeCurrentGoal() {
    const data = this.getGoalsData();
    if (!data.current) return;

    const goal = data.current;
    const completion = this.getGoalCompletion(goal);
    const achieved = completion >= 100;

    // Add to history
    data.history.push({
      id: goal.id,
      type: goal.type,
      achieved,
      completionRate: Math.round(completion),
      endDate: goal.endDate,
      target: goal.target,
      progress: goal.progress,
    });

    // Update streak
    if (achieved) {
      data.streakGoals = (data.streakGoals || 0) + 1;
    } else {
      data.streakGoals = 0;
    }

    // Keep only last 20 goals in history
    if (data.history.length > 20) {
      data.history = data.history.slice(-20);
    }

    data.current = null;
    this.saveGoalsData(data);
  },

  // Get goal history
  getGoalHistory(limit = 10) {
    const data = this.getGoalsData();
    return data.history.slice(-limit).reverse();
  },

  // Get goal success rate
  getSuccessRate() {
    const data = this.getGoalsData();
    if (data.history.length === 0) return 0;

    const achieved = data.history.filter(g => g.achieved).length;
    return (achieved / data.history.length) * 100;
  },

  // Delete current goal
  deleteCurrentGoal() {
    const data = this.getGoalsData();
    data.current = null;
    this.saveGoalsData(data);
  },

  // Goal presets
  getPresets() {
    return {
      beginner: {
        name: 'Beginner',
        description: 'Light study load - perfect for busy schedules',
        weekly: {
          modulesCompleted: 2,
          videosWatched: 10,
          labsCompleted: 1,
          flashcardsAdded: 2,
        },
      },
      moderate: {
        name: 'Moderate',
        description: 'Balanced pace - steady progress',
        weekly: {
          modulesCompleted: 4,
          videosWatched: 20,
          labsCompleted: 3,
          flashcardsAdded: 4,
        },
      },
      intense: {
        name: 'Intense',
        description: 'Fast track - maximum dedication',
        weekly: {
          modulesCompleted: 7,
          videosWatched: 35,
          labsCompleted: 5,
          flashcardsAdded: 7,
        },
      },
    };
  },

  // Reset goals data
  resetGoalsData() {
    localStorage.removeItem('learning-goals');
  },
};

export default GoalTracker;
