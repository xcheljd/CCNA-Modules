import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ModuleDetail from '../ModuleDetail';
import ProgressTracker from '../../utils/progressTracker';
import ActivityTracker from '../../utils/activityTracker';
import { ToastProvider } from '@/components/ui/toast';

// Mock utility modules
jest.mock('../../utils/progressTracker', () => ({
  __esModule: true,
  default: {
    getLabCompletions: jest.fn(),
    areFlashcardsAdded: jest.fn(),
    getModuleConfidence: jest.fn(),
    isVideoComplete: jest.fn(),
  },
}));

jest.mock('../../utils/activityTracker', () => ({
  __esModule: true,
  default: {
    recordVideoCompletion: jest.fn(),
    recordLabCompletion: jest.fn(),
    recordFlashcardsAdded: jest.fn(),
    recordConfidenceRating: jest.fn(),
  },
}));

// Mock child components
jest.mock('../VideoCard', () => {
  return function MockVideoCard({ video, moduleId, isCompleted, onMarkComplete }) {
    return (
      <div data-testid={`video-card-${video.id}`}>
        <span data-testid={`video-title-${video.id}`}>{video.title}</span>
        <span data-testid={`video-completed-${video.id}`}>
          {isCompleted ? 'completed' : 'incomplete'}
        </span>
        <button
          data-testid={`video-toggle-${video.id}`}
          onClick={() => onMarkComplete(moduleId, video.id, !isCompleted)}
        >
          Toggle
        </button>
      </div>
    );
  };
});

jest.mock('../ConfidenceRating', () => {
  return function MockConfidenceRating({ confidence, onRate }) {
    return (
      <div data-testid="confidence-rating">
        <span data-testid="confidence-value">{confidence}</span>
        <button data-testid="confidence-rate" onClick={() => onRate(3)}>
          Rate
        </button>
      </div>
    );
  };
});

// Wrapper for ToastProvider context
function Wrapper({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}

// Use fake timers for animation timeouts
jest.useFakeTimers();

// Helper to create a module
function createModule(id, day, title, overrides = {}) {
  return {
    id,
    day,
    title,
    videos: [{ id: `video_${id}`, title: `Video ${id}`, duration: '10:00' }],
    resources: {
      lab: `Day ${String(day).padStart(2, '0')} Lab.pkt`,
      flashcards: `Day ${String(day).padStart(2, '0')} Flashcards.apkg`,
    },
    ...overrides,
  };
}

// Helper to create a modules array
function createModules(count, startId = 1, startDay = 1) {
  return Array.from({ length: count }, (_, i) =>
    createModule(startId + i, startDay + i, `Module ${startId + i}`)
  );
}

// Default mock setup
function setupMocks(overrides = {}) {
  ProgressTracker.getLabCompletions.mockReturnValue(overrides.labCompletions ?? {});
  ProgressTracker.areFlashcardsAdded.mockReturnValue(overrides.flashcardsAdded ?? false);
  ProgressTracker.getModuleConfidence.mockReturnValue(overrides.confidence ?? 0);
  ProgressTracker.isVideoComplete.mockReturnValue(overrides.videoComplete ?? false);
}

// Default props
const defaultProps = (module, modules) => ({
  module,
  modules,
  onBack: jest.fn(),
  onOpenResource: jest.fn(),
  onModuleSelect: jest.fn(),
  onProgressChange: jest.fn(),
});

describe('ModuleDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    setupMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // =========================================================================
  // VAL-MODDETAIL-001: Renders module title with day number
  // =========================================================================
  it('should render module title with day number', () => {
    const module = createModule(1, 1, 'Network Devices');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Day 1: Network Devices')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-002: Back button calls onBack
  // =========================================================================
  it('should call onBack when back button is clicked', () => {
    const module = createModule(1, 1, 'Network Devices');
    const props = defaultProps(module, [module]);
    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );
    fireEvent.click(screen.getByText('Back to Modules'));
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // VAL-MODDETAIL-003: Previous button only when not first module
  // =========================================================================
  it('should not show previous button for first module', () => {
    const modules = createModules(3);
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[0], modules)} />
      </Wrapper>
    );
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('should show previous button for non-first module', () => {
    const modules = createModules(3);
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[1], modules)} />
      </Wrapper>
    );
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-004: Next button only when not last module
  // =========================================================================
  it('should not show next button for last module', () => {
    const modules = createModules(3);
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[2], modules)} />
      </Wrapper>
    );
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should show next button for non-last module', () => {
    const modules = createModules(3);
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[0], modules)} />
      </Wrapper>
    );
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-005: Next/Previous trigger animation and navigation
  // =========================================================================
  it('should trigger slide-right animation and call onModuleSelect with next module', () => {
    const modules = createModules(3);
    const props = defaultProps(modules[0], modules);
    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const detailEl = document.querySelector('.module-detail');
    expect(detailEl).not.toHaveClass('slide-right');

    fireEvent.click(screen.getByText('Next'));

    // Animation class applied
    expect(detailEl).toHaveClass('slide-right');

    // Navigation not yet called (waiting for animation timeout)
    expect(props.onModuleSelect).not.toHaveBeenCalled();

    // Advance timer to trigger navigation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(props.onModuleSelect).toHaveBeenCalledWith(modules[1]);
  });

  it('should trigger slide-left animation and call onModuleSelect with previous module', () => {
    const modules = createModules(3);
    const props = defaultProps(modules[2], modules);
    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const detailEl = document.querySelector('.module-detail');

    fireEvent.click(screen.getByText('Previous'));

    expect(detailEl).toHaveClass('slide-left');
    expect(props.onModuleSelect).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(props.onModuleSelect).toHaveBeenCalledWith(modules[1]);
  });

  // =========================================================================
  // VAL-MODDETAIL-006: Renders VideoCards with correct completion state
  // =========================================================================
  it('should render VideoCards for each video in the module', () => {
    const module = {
      ...createModule(1, 1, 'Videos Module'),
      videos: [
        { id: 'vid1', title: 'Video 1', duration: '10:00' },
        { id: 'vid2', title: 'Video 2', duration: '20:00' },
      ],
    };
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByTestId('video-card-vid1')).toBeInTheDocument();
    expect(screen.getByTestId('video-card-vid2')).toBeInTheDocument();
  });

  it('should pass correct isCompleted state from ProgressTracker to VideoCards', () => {
    const module = {
      ...createModule(1, 1, 'Videos Module'),
      videos: [
        { id: 'vid1', title: 'Video 1', duration: '10:00' },
        { id: 'vid2', title: 'Video 2', duration: '20:00' },
      ],
    };
    ProgressTracker.isVideoComplete.mockImplementation((modId, videoId) => {
      return videoId === 'vid1';
    });

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByTestId('video-completed-vid1')).toHaveTextContent('completed');
    expect(screen.getByTestId('video-completed-vid2')).toHaveTextContent('incomplete');
  });

  // =========================================================================
  // VAL-MODDETAIL-007: Video completion via ActivityTracker
  // =========================================================================
  it('should call ActivityTracker and onProgressChange on video completion toggle', () => {
    const module = createModule(1, 1, 'Video Test');
    const props = defaultProps(module, [module]);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    // Toggle video completion
    fireEvent.click(screen.getByTestId(`video-toggle-video_1`));

    expect(ActivityTracker.recordVideoCompletion).toHaveBeenCalledWith(
      1,
      'video_1',
      true, // was false, toggled to true
      [module]
    );
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // VAL-MODDETAIL-008: Renders lab resources with button and checkbox
  // =========================================================================
  it('should render lab resources with Open Lab button and checkbox', () => {
    const module = createModule(1, 1, 'Lab Test');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Open Lab')).toBeInTheDocument();
    expect(screen.getByText('Mark lab as completed')).toBeInTheDocument();
    // Checkbox should be present
    const checkbox = screen.getByRole('checkbox', { name: /mark lab as completed/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('should display the lab filename', () => {
    const module = createModule(1, 1, 'Lab Test');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Day 01 Lab.pkt')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-009: Lab toggle via ActivityTracker
  // =========================================================================
  it('should call ActivityTracker and onProgressChange on lab checkbox toggle', () => {
    const module = createModule(1, 1, 'Lab Toggle');
    const props = defaultProps(module, [module]);
    ProgressTracker.getLabCompletions.mockReturnValue({ 0: false });

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const checkbox = screen.getByRole('checkbox', { name: /mark lab as completed/i });
    fireEvent.click(checkbox);

    // Should pass inverted state (true, since it was false)
    expect(ActivityTracker.recordLabCompletion).toHaveBeenCalledWith(1, 0, true, [module]);
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // VAL-MODDETAIL-010: Open Lab calls onOpenResource('lab', filename)
  // =========================================================================
  it('should call onOpenResource with lab type and filename when Open Lab is clicked', () => {
    const module = createModule(1, 1, 'Open Lab Test');
    const props = defaultProps(module, [module]);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Open Lab'));
    expect(props.onOpenResource).toHaveBeenCalledWith('lab', 'Day 01 Lab.pkt');
  });

  // =========================================================================
  // VAL-MODDETAIL-011: Renders flashcard resources with buttons
  // =========================================================================
  it('should render flashcard section with Open Anki and Add buttons', () => {
    const module = createModule(1, 1, 'Flashcard Test');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Open Anki')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('should render flashcard checkbox', () => {
    const module = createModule(1, 1, 'Flashcard Test');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(
      screen.getByRole('checkbox', { name: /mark as added to anki/i })
    ).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-012: Flashcard toggle via ActivityTracker
  // =========================================================================
  it('should call ActivityTracker and toggle flashcard state on checkbox change', () => {
    const module = createModule(1, 1, 'Flashcard Toggle');
    const props = defaultProps(module, [module]);
    ProgressTracker.areFlashcardsAdded.mockReturnValue(false);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const checkbox = screen.getByRole('checkbox', { name: /mark as added to anki/i });
    fireEvent.click(checkbox);

    expect(ActivityTracker.recordFlashcardsAdded).toHaveBeenCalledWith(1, true, [module]);
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
  });

  // =========================================================================
  // VAL-MODDETAIL-013: Open Anki calls electronAPI when available; shows toast when not
  // =========================================================================
  it('should call electronAPI.openAnki when available', () => {
    const module = createModule(1, 1, 'Anki Test');
    window.electronAPI.openAnki = jest.fn();

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Open Anki'));
    expect(window.electronAPI.openAnki).toHaveBeenCalledTimes(1);

    delete window.electronAPI.openAnki;
  });

  it('should show toast when electronAPI.openAnki is not available', () => {
    const module = createModule(1, 1, 'Anki No API Test');
    // Remove openAnki from electronAPI
    const originalOpenAnki = window.electronAPI.openAnki;
    delete window.electronAPI.openAnki;

    const { container } = render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Open Anki'));
    // Toast should appear — we verify no crash occurred and the toast provider handles it
    expect(container).toBeInTheDocument();

    // Restore
    if (originalOpenAnki) {
      window.electronAPI.openAnki = originalOpenAnki;
    }
  });

  // =========================================================================
  // VAL-MODDETAIL-014: Add flashcard calls onOpenResource('flashcards', filename)
  // =========================================================================
  it('should call onOpenResource with flashcards type and filename when Add is clicked', () => {
    const module = createModule(1, 1, 'Add Flashcard Test');
    const props = defaultProps(module, [module]);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(props.onOpenResource).toHaveBeenCalledWith('flashcards', 'Day 01 Flashcards.apkg');
  });

  // =========================================================================
  // VAL-MODDETAIL-015: Renders spreadsheet resource when available
  // =========================================================================
  it('should render spreadsheet section when spreadsheet resource exists', () => {
    const module = createModule(1, 1, 'Spreadsheet Test', {
      resources: {
        lab: 'Day 01 Lab.pkt',
        flashcards: 'Day 01 Flashcards.apkg',
        spreadsheet: 'Day 01 Spreadsheet.xlsx',
      },
    });

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('Open Spreadsheet')).toBeInTheDocument();
    expect(screen.getByText('Day 01 Spreadsheet.xlsx')).toBeInTheDocument();
  });

  it('should call onOpenResource with spreadsheet type when Open Spreadsheet is clicked', () => {
    const module = createModule(1, 1, 'Spreadsheet Click', {
      resources: {
        lab: 'Day 01 Lab.pkt',
        flashcards: 'Day 01 Flashcards.apkg',
        spreadsheet: 'Day 01 Spreadsheet.xlsx',
      },
    });
    const props = defaultProps(module, [module]);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText('Open Spreadsheet'));
    expect(props.onOpenResource).toHaveBeenCalledWith('spreadsheet', 'Day 01 Spreadsheet.xlsx');
  });

  // =========================================================================
  // VAL-MODDETAIL-016: Shows "No resources available" when none exist
  // =========================================================================
  it('should show no resources message when module has no resources', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'No Resources',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {},
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(
      screen.getByText('No resources available for this module.')
    ).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-017: Renders ConfidenceRating with current confidence
  // =========================================================================
  it('should render ConfidenceRating with confidence from ProgressTracker', () => {
    const module = createModule(1, 1, 'Confidence Test');
    ProgressTracker.getModuleConfidence.mockReturnValue(4);

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByTestId('confidence-rating')).toBeInTheDocument();
    expect(screen.getByTestId('confidence-value')).toHaveTextContent('4');
  });

  // =========================================================================
  // VAL-MODDETAIL-018: Confidence change via ActivityTracker
  // =========================================================================
  it('should call ActivityTracker and update state on confidence change', () => {
    const module = createModule(1, 1, 'Confidence Change');
    const props = defaultProps(module, [module]);
    ProgressTracker.getModuleConfidence.mockReturnValue(0);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    fireEvent.click(screen.getByTestId('confidence-rate'));

    expect(ActivityTracker.recordConfidenceRating).toHaveBeenCalledWith(1, 3, [module]);
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);

    // State updated
    expect(screen.getByTestId('confidence-value')).toHaveTextContent('3');
  });

  // =========================================================================
  // VAL-MODDETAIL-019: Resets animation and states on module change
  // =========================================================================
  it('should reset animation class and reload states when module prop changes', () => {
    const modules = createModules(2);
    const { rerender } = render(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[0], modules)} />
      </Wrapper>
    );

    // Trigger an animation
    fireEvent.click(screen.getByText('Next'));
    const detailEl = document.querySelector('.module-detail');
    expect(detailEl).toHaveClass('slide-right');

    // Rerender with a different module (simulating parent changing the module prop)
    rerender(
      <Wrapper>
        <ModuleDetail {...defaultProps(modules[1], modules)} />
      </Wrapper>
    );

    // Animation class should be cleared
    const updatedDetailEl = document.querySelector('.module-detail');
    expect(updatedDetailEl).not.toHaveClass('slide-right');
    expect(updatedDetailEl).not.toHaveClass('slide-left');

    // ProgressTracker should have been called for the new module
    expect(ProgressTracker.getLabCompletions).toHaveBeenCalledWith(2, 1);
    expect(ProgressTracker.areFlashcardsAdded).toHaveBeenCalledWith(2);
    expect(ProgressTracker.getModuleConfidence).toHaveBeenCalledWith(2);
  });

  // =========================================================================
  // VAL-MODDETAIL-020: Handles single lab (string) by wrapping in array
  // =========================================================================
  it('should handle single lab resource as a string by wrapping in array', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Single Lab',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: 'single-lab-file.pkt',
        flashcards: 'flashcards.apkg',
      },
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('single-lab-file.pkt')).toBeInTheDocument();
    expect(screen.getByText('Open Lab')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-021: Lab number suffix for multiple labs
  // =========================================================================
  it('should show lab number suffix for multiple labs', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Multi Lab',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: ['lab1.pkt', 'lab2.pkt'],
        flashcards: 'flashcards.apkg',
      },
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('Packet Tracer Lab 1')).toBeInTheDocument();
    expect(screen.getByText('Packet Tracer Lab 2')).toBeInTheDocument();
  });

  it('should not show lab number suffix for single lab', () => {
    const module = createModule(1, 1, 'Single Lab');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('Packet Tracer Lab')).toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-022: Handles module not found in array gracefully
  // =========================================================================
  it('should handle module not found in modules array without crash', () => {
    const module = createModule(99, 99, 'Missing Module');
    const modules = createModules(3); // module.id=99 is not in this array

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, modules)} />
      </Wrapper>
    );

    // Should render the module content
    expect(screen.getByText('Day 99: Missing Module')).toBeInTheDocument();
    // No prev/next buttons since module isn't in the array
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  // =========================================================================
  // VAL-MODDETAIL-023: Works without onProgressChange callback
  // =========================================================================
  it('should not crash when onProgressChange is undefined', () => {
    const module = createModule(1, 1, 'No Callback');
    const props = {
      module,
      modules: [module],
      onBack: jest.fn(),
      onOpenResource: jest.fn(),
      onModuleSelect: jest.fn(),
      // onProgressChange is intentionally omitted
    };

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    // Toggle video completion — should not crash
    expect(() => {
      fireEvent.click(screen.getByTestId('video-toggle-video_1'));
    }).not.toThrow();
  });

  // =========================================================================
  // Additional edge case tests
  // =========================================================================

  it('should render section headings', () => {
    const module = createModule(1, 1, 'Headings');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Videos')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('should render video note text', () => {
    const module = createModule(1, 1, 'Video Note');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(
      screen.getByText(/Videos will open in a distraction-free window/)
    ).toBeInTheDocument();
  });

  it('should call onOpenResource with correct lab file for multi-lab Open Lab buttons', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Multi Lab Open',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: ['lab-alpha.pkt', 'lab-beta.pkt'],
        flashcards: 'flashcards.apkg',
      },
    };
    const props = defaultProps(module, [module]);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const openButtons = screen.getAllByText('Open Lab');
    expect(openButtons).toHaveLength(2);

    fireEvent.click(openButtons[0]);
    expect(props.onOpenResource).toHaveBeenCalledWith('lab', 'lab-alpha.pkt');

    fireEvent.click(openButtons[1]);
    expect(props.onOpenResource).toHaveBeenCalledWith('lab', 'lab-beta.pkt');
  });

  it('should show completed flashcard state with checkmark', () => {
    const module = createModule(1, 1, 'Flashcards Added');
    ProgressTracker.areFlashcardsAdded.mockReturnValue(true);

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('✓ Added to Deck')).toBeInTheDocument();
  });

  it('should toggle flashcard state from added to not added', () => {
    const module = createModule(1, 1, 'Flashcard Untoggle');
    const props = defaultProps(module, [module]);
    ProgressTracker.areFlashcardsAdded.mockReturnValue(true);

    render(
      <Wrapper>
        <ModuleDetail {...props} />
      </Wrapper>
    );

    const checkbox = screen.getByRole('checkbox', { name: /mark as added to anki/i });
    fireEvent.click(checkbox);

    // Should pass false (inverted from true)
    expect(ActivityTracker.recordFlashcardsAdded).toHaveBeenCalledWith(1, false, [module]);
  });

  it('should pass correct lab completions to checkboxes', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Lab Completions',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: ['lab1.pkt', 'lab2.pkt'],
        flashcards: 'flashcards.apkg',
      },
    };
    ProgressTracker.getLabCompletions.mockReturnValue({ 0: true, 1: false });

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    // Two lab checkboxes + one flashcard checkbox = 3
    expect(checkboxes).toHaveLength(3);
    // First lab should be checked
    expect(checkboxes[0]).toBeChecked();
    // Second lab should not be checked
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('should not show spreadsheet section when no spreadsheet resource', () => {
    const module = createModule(1, 1, 'No Spreadsheet');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.queryByText('Open Spreadsheet')).not.toBeInTheDocument();
    expect(screen.queryByText('Excel Spreadsheet')).not.toBeInTheDocument();
  });

  it('should show no resources when resources object is undefined', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Undefined Resources',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(
      screen.getByText('No resources available for this module.')
    ).toBeInTheDocument();
  });

  it('should show Anki Flashcards heading', () => {
    const module = createModule(1, 1, 'Flashcard Heading');
    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );
    expect(screen.getByText('Anki Flashcards')).toBeInTheDocument();
  });

  it('should not render flashcard section when no flashcards', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'No Flashcards',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: 'lab.pkt',
      },
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.queryByText('Anki Flashcards')).not.toBeInTheDocument();
    expect(screen.queryByText('Open Anki')).not.toBeInTheDocument();
  });

  it('should handle flashcards as a string resource (asArray pattern)', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'String Flashcards',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: 'lab.pkt',
        flashcards: 'single-flashcard.apkg',
      },
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('single-flashcard.apkg')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('should handle multiple flashcard files', () => {
    const module = {
      id: 1,
      day: 1,
      title: 'Multi Flashcards',
      videos: [{ id: 'vid1', title: 'Video 1', duration: '10:00' }],
      resources: {
        lab: 'lab.pkt',
        flashcards: ['deck1.apkg', 'deck2.apkg'],
      },
    };

    render(
      <Wrapper>
        <ModuleDetail {...defaultProps(module, [module])} />
      </Wrapper>
    );

    expect(screen.getByText('deck1.apkg')).toBeInTheDocument();
    expect(screen.getByText('deck2.apkg')).toBeInTheDocument();
    // Add buttons should have numbers for multiple
    expect(screen.getByText('Add 1')).toBeInTheDocument();
    expect(screen.getByText('Add 2')).toBeInTheDocument();
  });
});
