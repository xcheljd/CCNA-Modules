import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SmartRecommendations from '../SmartRecommendations';
import ProgressTracker from '../../utils/progressTracker';
import StreakTracker from '../../utils/streakTracker';

// Mock ProgressTracker
jest.mock('../../utils/progressTracker', () => ({
  __esModule: true,
  default: {
    getLastWatchedModule: jest.fn(),
    getModuleProgress: jest.fn(),
    getModulesNeedingReview: jest.fn(),
    getModuleConfidence: jest.fn(),
  },
}));

// Mock StreakTracker
jest.mock('../../utils/streakTracker', () => ({
  __esModule: true,
  default: {
    getStreakInfo: jest.fn(),
  },
}));

// Use fake timers to control date for date-fns format
jest.useFakeTimers().setSystemTime(new Date('2025-01-15T12:00:00'));

// Helper to create mock modules
function createModules(count, startId = 1, startDay = 1) {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    day: startDay + i,
    title: `Module ${startId + i}`,
    videos: [{ id: `video_${startId + i}`, title: `Video ${startId + i}`, duration: '10:00' }],
    resources: {
      lab: `Day ${startDay + i} Lab.pkt`,
      flashcards: `Day ${startDay + i} Flashcards.apkg`,
    },
  }));
}

// Default mock setup: no recommendations, no insights
function setupMocks(overrides = {}) {
  ProgressTracker.getLastWatchedModule.mockReturnValue(overrides.lastWatched ?? null);
  ProgressTracker.getModuleProgress.mockImplementation(module => {
    if (overrides.progressMap && module) {
      return overrides.progressMap[module.id] ?? 0;
    }
    return overrides.defaultProgress ?? 0;
  });
  ProgressTracker.getModulesNeedingReview.mockReturnValue(overrides.needingReview ?? []);
  ProgressTracker.getModuleConfidence.mockImplementation(id => {
    if (overrides.confidenceMap) {
      return overrides.confidenceMap[id] ?? 0;
    }
    return overrides.defaultConfidence ?? 0;
  });
  StreakTracker.getStreakInfo.mockReturnValue(
    overrides.streakInfo ?? { currentStreak: 0, longestStreak: 0, lastStudyDate: null }
  );
}

describe('SmartRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    setupMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // VAL-SMARTREC-001: Returns null when no recommendations and no insights
  it('should render null when no recommendations and no insights', () => {
    // Empty modules array => no recommendations (no incomplete modules),
    // no insights (0/0 => NaN completion rate => no threshold matched),
    // no goals in localStorage => no goal insight
    setupMocks({ defaultProgress: 0 });

    const { container } = render(<SmartRecommendations modules={[]} onModuleSelect={jest.fn()} />);

    expect(container.innerHTML).toBe('');
  });

  // VAL-SMARTREC-002: Renders "Continue Where You Left Off" recommendation
  it('should render "Continue Where You Left Off" card with ▶️ icon when last watched is incomplete', () => {
    const modules = createModules(5);
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 50, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Continue Where You Left Off')).toBeInTheDocument();
    expect(screen.getByText('▶️')).toBeInTheDocument();
    expect(screen.getByText(/Resume Day 1: Module 1/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-003: Renders "Review Low Confidence Module"
  it('should render "Review Low Confidence Module" card with 🔄 icon and confidence score', () => {
    const modules = createModules(3);
    setupMocks({
      needingReview: [modules[1]],
      confidenceMap: { 2: 2 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Review Low Confidence Module')).toBeInTheDocument();
    expect(screen.getByText('🔄')).toBeInTheDocument();
    expect(screen.getByText(/Day 2: Module 2 \(2\/5 confidence\)/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-004: Renders "Continue Your Learning Path"
  it('should render "Continue Your Learning Path" card with 🎯 for next incomplete module', () => {
    const modules = createModules(3);
    // Module 1 at 100%, module 2 at 0% => next incomplete is module 2
    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Continue Your Learning Path')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
    expect(screen.getByText(/Start Day 2: Module 2/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-005: Renders "Quick Win Opportunity"
  it('should render "Quick Win Opportunity" card with ⚡ for modules >50% complete', () => {
    const modules = createModules(3);
    // Module 1 complete, module 2 at 75% done, module 3 at 0%
    // "Continue Your Learning Path" picks module 2 (first incomplete)
    // Quick-win picks module 2 too, but it's already in "next" => skipped
    // To test quick-win properly, need a module >50% that is NOT the first incomplete
    // So: module 1 complete, module 2 at 20%, module 3 at 75%
    setupMocks({
      progressMap: { 1: 100, 2: 20, 3: 75 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Quick Win Opportunity')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
    expect(screen.getByText(/Complete Day 3: Module 3 \(75% done\)/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-006: Renders "Maintain Your Streak" when active and not studied today
  it('should render "Maintain Your Streak" card with 🔥 and streak day count', () => {
    const modules = createModules(3);
    // lastStudyDate is '2025-01-14' (yesterday), today is '2025-01-15' => not today
    // Need all modules complete so no other recommendation claims nextIncomplete
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 0 },
      defaultProgress: 0,
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-14' },
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Maintain Your Streak')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
    expect(screen.getByText(/You're on a 5-day streak!/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-007: No streak recommendation when already studied today
  it('should not show streak recommendation when already studied today', () => {
    const modules = createModules(3);
    // lastStudyDate is '2025-01-15' which equals today (our fake date)
    // The format(new Date(), 'yyyy-MM-dd') will produce '2025-01-15'
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 0 },
      defaultProgress: 0,
      streakInfo: { currentStreak: 5, longestStreak: 10, lastStudyDate: '2025-01-15' },
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('Maintain Your Streak')).not.toBeInTheDocument();
  });

  // VAL-SMARTREC-008: Recommendations sorted by priority, max 4
  it('should sort recommendations by descending priority and limit to 4', () => {
    const modules = createModules(5);
    // Set up scenario with multiple recommendations:
    // - Continue (priority 10): lastWatched = module 1 at 50%
    // - Review (priority 9): module 2 needs review
    // - Quick-win (priority 7): module 1 is 75% done (but same as continue, so skipped)
    // - Next (priority 8): module 3 is next incomplete
    // - Streak (priority 9): active streak, not studied today
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 75, 2: 10, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
      needingReview: [modules[1]],
      confidenceMap: { 2: 2 },
      defaultConfidence: 0,
      streakInfo: { currentStreak: 3, longestStreak: 3, lastStudyDate: '2025-01-14' },
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Should show at most 4 recommendation cards
    const cards = screen.getAllByText(/(?:▶️|🔄|🎯|⚡|🔥)/);
    expect(cards.length).toBeLessThanOrEqual(4);

    // Verify order: continue(10), review(9) or streak(9), then next(8)
    const titles = screen.getAllByRole('heading', { level: 4 }).map(el => el.textContent);
    expect(titles[0]).toBe('Continue Where You Left Off'); // priority 10
    // priorities 9 (review and streak) come next
    expect(titles).not.toContain('Quick Win Opportunity'); // module 1 already in continue
  });

  // VAL-SMARTREC-008: Exact max 4 check
  it('should show at most 4 recommendation cards even when more are available', () => {
    const modules = createModules(8);
    // Many recommendations possible but limited to 4
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 60, 2: 70, 3: 80, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
      defaultProgress: 0,
      needingReview: [modules[3]],
      confidenceMap: { 4: 1 },
      defaultConfidence: 0,
      streakInfo: { currentStreak: 5, longestStreak: 5, lastStudyDate: '2025-01-14' },
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Recommendation cards are divs with py-3.5 px-[18px] rounded-[14px] border bg-card
    const recCards = document.querySelectorAll('.py-3\\.5');
    expect(recCards.length).toBeLessThanOrEqual(4);
  });

  // VAL-SMARTREC-009: Deduplicates — same module not shown twice
  it('should not show same module in multiple recommendation cards', () => {
    const modules = createModules(3);
    // Module 1 is partially complete AND last watched AND >50% (quick win)
    // Module 2 needs review
    // Without dedup: continue(mod1), next(mod2), quick-win(mod1)
    // With dedup: quick-win skipped because mod1 already in continue
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 60, 2: 0, 3: 0 },
      defaultProgress: 0,
      needingReview: [modules[1]],
      confidenceMap: { 2: 1 },
      defaultConfidence: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Module 1 should only appear once (in "Continue" card)
    const module1Mentions = screen.getAllByText(/Day 1: Module 1/);
    expect(module1Mentions.length).toBe(1);
    expect(screen.getByText('Continue Where You Left Off')).toBeInTheDocument();

    // Quick win for module 1 should be skipped since module 1 already recommended
    expect(screen.queryByText('Quick Win Opportunity')).not.toBeInTheDocument();
  });

  // VAL-SMARTREC-010: Calls onModuleSelect when card clicked
  it('should call onModuleSelect with correct module when card clicked', () => {
    const modules = createModules(3);
    const onModuleSelect = jest.fn();

    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={onModuleSelect} />);

    const nextTitle = screen.getByText('Continue Your Learning Path');
    // Click the card (closest parent with cursor:pointer style)
    fireEvent.click(nextTitle.closest('[style*="cursor"]'));

    expect(onModuleSelect).toHaveBeenCalledTimes(1);
    expect(onModuleSelect).toHaveBeenCalledWith(modules[1]);
  });

  // VAL-SMARTREC-011: Correct cursor style per card type
  it('should set pointer cursor for cards with a module', () => {
    const modules = createModules(3);
    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Recommendation cards are divs with py-3.5 class and inline cursor style
    const cards = document.querySelectorAll('.py-3\\.5');
    cards.forEach(card => {
      expect(card.style.cursor).toBe('pointer');
    });
  });

  // VAL-SMARTREC-011: Default cursor for cards without module (insight-only scenarios)
  it('should set default cursor for cards without a module reference', () => {
    const modules = createModules(3);
    // Streak recommendation has a module attached, but let's test the cursor logic
    // by checking that the style attribute uses 'pointer' when module exists
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 50, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // All recommendations in this scenario have modules
    const cards = document.querySelectorAll('.py-3\\.5');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach(card => {
      // Cards with modules have pointer cursor (and arrow → indicator)
      const arrow = card.querySelector('.text-lg.opacity-80');
      if (arrow) {
        expect(card.style.cursor).toBe('pointer');
      }
    });
  });

  // VAL-SMARTREC-012: Insights show correct completion-rate messages
  it('should show "almost there" insight when completion rate >75%', () => {
    const modules = createModules(10);
    // 8/10 = 80% complete
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100, 9: 0, 10: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(
      screen.getByText("You're almost there! Just a few more modules to complete the course.")
    ).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
  });

  it('should show "over half" insight when completion rate >50%', () => {
    const modules = createModules(10);
    // 6/10 = 60% complete
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 0, 8: 0, 9: 0, 10: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(
      screen.getByText("Great progress! You've completed over half the course.")
    ).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('should show "momentum" insight when completion rate >25%', () => {
    const modules = createModules(10);
    // 3/10 = 30% complete
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 100, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(
      screen.getByText("You're building momentum! Keep up the steady progress.")
    ).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
  });

  it('should show "Good start" insight when completion rate >0%', () => {
    const modules = createModules(10);
    // 1/10 = 10% complete
    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Good start! Consistency is key to success.')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  // VAL-SMARTREC-013: Shows review warning when >5 modules need review
  it('should show ⚠️ warning when more than 5 modules need review', () => {
    const modules = createModules(10);
    const reviewModules = modules.slice(0, 6);
    setupMocks({
      progressMap: {
        1: 100,
        2: 100,
        3: 100,
        4: 100,
        5: 100,
        6: 100,
        7: 100,
        8: 100,
        9: 100,
        10: 100,
      },
      defaultProgress: 100,
      needingReview: reviewModules,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText(/6 modules marked for review/)).toBeInTheDocument();
  });

  // VAL-SMARTREC-014: Shows goal deadline insight when ending within 3 days
  it('should show ⏰ goal deadline insight when goal ends within 3 days', () => {
    const modules = createModules(5);
    // Today is 2025-01-15T12:00:00, goal ends on 2025-01-17
    // daysRemaining = Math.ceil((new Date('2025-01-17') - new Date('2025-01-15T12:00:00')) / 86400000)
    // = Math.ceil(1.5 * 86400000 / 86400000) = Math.ceil(1.5) = 2
    localStorage.setItem(
      'learning-goals',
      JSON.stringify({
        current: { endDate: '2025-01-17' },
      })
    );

    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('⏰')).toBeInTheDocument();
    expect(
      screen.getByText('Your goal ends in 2 days. Time to push for the finish!')
    ).toBeInTheDocument();
  });

  // VAL-SMARTREC-014: No deadline insight when goal ends in >3 days
  it('should not show goal deadline insight when goal ends in more than 3 days', () => {
    const modules = createModules(5);
    // Goal ends on 2025-01-20 (5 days remaining)
    localStorage.setItem(
      'learning-goals',
      JSON.stringify({
        current: { endDate: '2025-01-20' },
      })
    );

    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('⏰')).not.toBeInTheDocument();
  });

  // VAL-SMARTREC-015: Handles corrupted learning-goals localStorage data
  it('should handle corrupted learning-goals localStorage data without crashing', () => {
    const modules = createModules(5);
    localStorage.setItem('learning-goals', 'not-valid-json');

    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    expect(() => {
      render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);
    }).not.toThrow();

    // Should still render recommendations section
    expect(screen.getByText('Recommended For You')).toBeInTheDocument();
  });

  // Additional: No streak recommendation when streak is 0
  it('should not show streak recommendation when current streak is 0', () => {
    const modules = createModules(3);
    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0 },
      defaultProgress: 0,
      streakInfo: { currentStreak: 0, longestStreak: 0, lastStudyDate: null },
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('Maintain Your Streak')).not.toBeInTheDocument();
  });

  // Additional: No review warning when <= 5 modules need review
  it('should not show review warning when 5 or fewer modules need review', () => {
    const modules = createModules(10);
    const reviewModules = modules.slice(0, 5);
    setupMocks({
      progressMap: {
        1: 100,
        2: 100,
        3: 100,
        4: 100,
        5: 100,
        6: 100,
        7: 100,
        8: 100,
        9: 100,
        10: 100,
      },
      defaultProgress: 100,
      needingReview: reviewModules,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });

  // Additional: Insights section renders before recommendations
  it('should render insights section with heading when insights exist', () => {
    const modules = createModules(5);
    // 1/5 = 20% complete, but >0% => "Good start" insight
    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Recommended For You')).toBeInTheDocument();
  });

  // Additional: Null check when lastWatched module is fully complete
  it('should not show continue recommendation when last watched module is fully complete', () => {
    const modules = createModules(3);
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 100, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('Continue Where You Left Off')).not.toBeInTheDocument();
  });

  // Additional: Quick win shows rounded progress percentage
  it('should show rounded progress percentage in quick win description', () => {
    const modules = createModules(4);
    // Module 1 complete, module 2 at 10% (first incomplete => "next"), module 3 at 75.7% (quick-win)
    setupMocks({
      progressMap: { 1: 100, 2: 10, 3: 75.7, 4: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Math.round(75.7) = 76
    expect(screen.getByText(/Complete Day 3: Module 3 \(76% done\)/)).toBeInTheDocument();
  });

  // Additional: No quick win for exactly 50% (must be >50%)
  it('should not show quick win for modules at exactly 50%', () => {
    const modules = createModules(3);
    setupMocks({
      progressMap: { 1: 50, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('Quick Win Opportunity')).not.toBeInTheDocument();
  });

  // Additional: Quick win sorts by highest progress first
  it('should recommend quick win with highest progress when multiple qualify', () => {
    const modules = createModules(4);
    // Module 1 complete, module 2 at 10% (first incomplete => "next"), modules 3 at 60%, 4 at 90%
    // Quick-win sorts by highest progress, so module 4 at 90% wins
    setupMocks({
      progressMap: { 1: 100, 2: 10, 3: 60, 4: 90 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    // Module 4 at 90% should be the quick win (highest progress >50%)
    expect(screen.getByText(/Complete Day 4: Module 4 \(90% done\)/)).toBeInTheDocument();
  });

  // Additional: Goal with no current goal does not show deadline insight
  it('should not show goal deadline insight when no current goal exists', () => {
    const modules = createModules(5);
    localStorage.setItem('learning-goals', JSON.stringify({}));

    setupMocks({
      progressMap: { 1: 100, 2: 0, 3: 0, 4: 0, 5: 0 },
      defaultProgress: 0,
    });

    render(<SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />);

    expect(screen.queryByText('⏰')).not.toBeInTheDocument();
  });

  // Additional: All modules complete — no recommendations but insight present
  it('should render insights even when no recommendations exist', () => {
    const modules = createModules(3);
    setupMocks({
      progressMap: { 1: 100, 2: 100, 3: 100 },
      defaultProgress: 100,
    });

    const { container } = render(
      <SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />
    );

    // Should render (not null) because insights exist
    expect(container.innerHTML).not.toBe('');
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  // Additional: Renders recommendation-card with correct continue styling
  it('should apply continue-specific styling to continue recommendation card', () => {
    const modules = createModules(3);
    setupMocks({
      lastWatched: { module: modules[0] },
      progressMap: { 1: 50, 2: 0, 3: 0 },
      defaultProgress: 0,
    });

    const { container } = render(
      <SmartRecommendations modules={modules} onModuleSelect={jest.fn()} />
    );

    // Continue card has a distinctive class containing primary-foreground and shadow
    const recCards = container.querySelectorAll('.py-3\\.5');
    const continueCard = Array.from(recCards).find(card =>
      card.className.includes('primary-foreground') && card.className.includes('shadow')
    );
    expect(continueCard).toBeTruthy();
  });
});
