import GoalTracker from '../goalTracker';

describe('GoalTracker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('goal creation', () => {
    it('should create a weekly goal', () => {
      const targets = {
        modulesCompleted: 5,
        videosWatched: 20,
        labsCompleted: 3,
        flashcardsAdded: 5,
      };

      const goal = GoalTracker.createGoal('weekly', targets);

      expect(goal.type).toBe('weekly');
      expect(goal.target).toEqual(targets);
      expect(goal.status).toBe('active');
      expect(goal.progress.modulesCompleted).toBe(0);
      expect(goal).toHaveProperty('startDate');
      expect(goal).toHaveProperty('endDate');
    });

    it('should create a monthly goal', () => {
      const targets = {
        modulesCompleted: 15,
        videosWatched: 50,
        labsCompleted: 10,
        flashcardsAdded: 15,
      };

      const goal = GoalTracker.createGoal('monthly', targets);

      expect(goal.type).toBe('monthly');
      expect(goal.target).toEqual(targets);
    });

    it('should create a new goal', () => {
      const targets = { modulesCompleted: 5 };
      const firstGoal = GoalTracker.createGoal('weekly', targets);

      expect(firstGoal).toBeDefined();
      expect(firstGoal.type).toBe('weekly');
    });
  });

  describe('goal retrieval', () => {
    it('should return active goal', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);

      const activeGoal = GoalTracker.getActiveGoal();

      expect(activeGoal).toBeDefined();
      expect(activeGoal.type).toBe('weekly');
    });

    it('should return null when no active goal', () => {
      const activeGoal = GoalTracker.getActiveGoal();

      expect(activeGoal).toBeNull();
    });
  });

  describe('goal progress update', () => {
    it('should update goal progress with module data', () => {
      const targets = { modulesCompleted: 10, videosWatched: 20 };
      GoalTracker.createGoal('weekly', targets);

      const updatedGoal = GoalTracker.updateGoalProgress([{ id: 1 }, { id: 2 }]);

      expect(updatedGoal).toBeDefined();
      expect(updatedGoal.progress).toBeDefined();
    });

    it('should return null for expired goal', () => {
      const targets = { modulesCompleted: 5 };
      const goal = GoalTracker.createGoal('weekly', targets);

      const goalData = GoalTracker.getGoalsData();
      goalData.current.endDate = '2020-01-01';
      GoalTracker.saveGoalsData(goalData);

      const updated = GoalTracker.updateGoalProgress([]);

      expect(updated).toBeNull();
    });
  });

  describe('goal completion calculation', () => {
    it('should calculate completion percentage', () => {
      const goal = {
        target: {
          modulesCompleted: 10,
          videosWatched: 20,
          labsCompleted: 5,
        },
        progress: {
          modulesCompleted: 5,
          videosWatched: 10,
          labsCompleted: 2.5,
        },
      };

      const completion = GoalTracker.getGoalCompletion(goal);

      expect(completion).toBe(50);
    });

    it('should return 0 for incomplete goal data', () => {
      const completion = GoalTracker.getGoalCompletion(null);

      expect(completion).toBe(0);
    });

    it('should cap completion at 100%', () => {
      const goal = {
        target: { modulesCompleted: 10 },
        progress: { modulesCompleted: 15 },
      };

      const completion = GoalTracker.getGoalCompletion(goal);

      expect(completion).toBe(100);
    });
  });

  describe('goal completion', () => {
    it('should complete goal and add to history', () => {
      const targets = { modulesCompleted: 5 };
      const goal = GoalTracker.createGoal('weekly', targets);

      GoalTracker.completeCurrentGoal();

      const activeGoal = GoalTracker.getActiveGoal();
      const history = GoalTracker.getGoalHistory(20);

      expect(activeGoal).toBeNull();
      expect(history.length).toBe(1);
      expect(history[0].id).toBe(goal.id);
    });

    it('should update streak on achieved goal', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);

      const goal = GoalTracker.getActiveGoal();
      const data = GoalTracker.getGoalsData();
      data.current.progress.modulesCompleted = 5;
      GoalTracker.saveGoalsData(data);

      GoalTracker.completeCurrentGoal();

      const data2 = GoalTracker.getGoalsData();

      expect(data2.streakGoals).toBe(1);
    });

    it('should reset streak on missed goal', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);

      GoalTracker.completeCurrentGoal();

      const data = GoalTracker.getGoalsData();

      expect(data.streakGoals).toBe(0);
    });
  });

  describe('goal history', () => {
    it('should return goal history', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);
      GoalTracker.completeCurrentGoal();

      const history = GoalTracker.getGoalHistory(20);

      expect(history.length).toBe(1);
      expect(history[0]).toHaveProperty('id');
      expect(history[0]).toHaveProperty('type');
      expect(history[0]).toHaveProperty('achieved');
    });

    it('should return specified history limit', () => {
      const targets = { modulesCompleted: 5 };

      for (let i = 0; i < 25; i++) {
        GoalTracker.createGoal('weekly', targets);
        GoalTracker.completeCurrentGoal();
      }

      const history = GoalTracker.getGoalHistory(20);

      expect(history.length).toBe(20);
    });

    it('should throw error when called without limit', () => {
      expect(() => {
        GoalTracker.getGoalHistory();
      }).toThrow('requires a limit parameter');
    });
  });

  describe('success rate', () => {
    it('should calculate success rate', () => {
      const targets = { modulesCompleted: 5 };

      for (let i = 0; i < 4; i++) {
        GoalTracker.createGoal('weekly', targets);
        if (i < 3) {
          const goal = GoalTracker.getActiveGoal();
          const data = GoalTracker.getGoalsData();
          data.current.progress.modulesCompleted = 5;
          GoalTracker.saveGoalsData(data);
        }
        GoalTracker.completeCurrentGoal();
      }

      const successRate = GoalTracker.getSuccessRate();

      expect(successRate).toBe(75);
    });

    it('should return 0 for empty history', () => {
      const successRate = GoalTracker.getSuccessRate();

      expect(successRate).toBe(0);
    });
  });

  describe('goal deletion', () => {
    it('should delete current goal', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);

      GoalTracker.deleteCurrentGoal();

      const activeGoal = GoalTracker.getActiveGoal();

      expect(activeGoal).toBeNull();
    });
  });

  describe('goal presets', () => {
    it('should provide beginner preset', () => {
      const presets = GoalTracker.getPresets();
      const beginner = presets.beginner;

      expect(beginner.name).toBe('Beginner');
      expect(beginner.description).toBe('Light study load - perfect for busy schedules');
      expect(beginner.weekly.modulesCompleted).toBe(2);
    });

    it('should provide moderate preset', () => {
      const presets = GoalTracker.getPresets();
      const moderate = presets.moderate;

      expect(moderate.name).toBe('Moderate');
      expect(moderate.weekly.modulesCompleted).toBe(4);
    });

    it('should provide intense preset', () => {
      const presets = GoalTracker.getPresets();
      const intense = presets.intense;

      expect(intense.name).toBe('Intense');
      expect(intense.weekly.modulesCompleted).toBe(7);
    });
  });

  describe('reset functionality', () => {
    it('should reset all goals data', () => {
      const targets = { modulesCompleted: 5 };
      GoalTracker.createGoal('weekly', targets);
      GoalTracker.completeCurrentGoal();

      GoalTracker.resetGoalsData();

      const activeGoal = GoalTracker.getActiveGoal();
      const history = GoalTracker.getGoalHistory(20);
      const data = GoalTracker.getGoalsData();

      expect(activeGoal).toBeNull();
      expect(history.length).toBe(0);
      expect(data.streakGoals).toBe(0);
    });
  });
});
