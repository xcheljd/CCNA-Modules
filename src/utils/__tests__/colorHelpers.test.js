import { ColorHelpers } from '../colorHelpers';

describe('ColorHelpers', () => {
  describe('getProgressColor', () => {
    it('returns muted color for zero progress', () => {
      expect(ColorHelpers.getProgressColor(0)).toBe('hsl(var(--muted))');
    });

    it('returns complete color for 100% progress', () => {
      expect(ColorHelpers.getProgressColor(100)).toBe('var(--color-progress-complete)');
    });

    it('returns ring color for partial progress (50)', () => {
      expect(ColorHelpers.getProgressColor(50)).toBe('hsl(var(--ring))');
    });

    it('returns ring color for lower boundary (1)', () => {
      expect(ColorHelpers.getProgressColor(1)).toBe('hsl(var(--ring))');
    });

    it('returns ring color for upper boundary (99)', () => {
      expect(ColorHelpers.getProgressColor(99)).toBe('hsl(var(--ring))');
    });

    it('returns ring color for 25% progress', () => {
      expect(ColorHelpers.getProgressColor(25)).toBe('hsl(var(--ring))');
    });

    it('does not throw for undefined input', () => {
      expect(() => ColorHelpers.getProgressColor(undefined)).not.toThrow();
    });

    it('does not throw for null input', () => {
      expect(() => ColorHelpers.getProgressColor(null)).not.toThrow();
    });

    it('does not throw for NaN input', () => {
      expect(() => ColorHelpers.getProgressColor(NaN)).not.toThrow();
    });
  });

  describe('getConfidenceColor', () => {
    it('returns none color for zero confidence', () => {
      expect(ColorHelpers.getConfidenceColor(0)).toBe('var(--color-confidence-none, #e0e0e0)');
    });

    it('returns low color for confidence 1', () => {
      expect(ColorHelpers.getConfidenceColor(1)).toBe('var(--color-confidence-low, #f44336)');
    });

    it('returns low color for confidence 2', () => {
      expect(ColorHelpers.getConfidenceColor(2)).toBe('var(--color-confidence-low, #f44336)');
    });

    it('returns medium color for confidence 3', () => {
      expect(ColorHelpers.getConfidenceColor(3)).toBe('var(--color-confidence-medium, #ff9800)');
    });

    it('returns high color for confidence 4', () => {
      expect(ColorHelpers.getConfidenceColor(4)).toBe('var(--color-confidence-high, #4caf50)');
    });

    it('returns high color for confidence 5', () => {
      expect(ColorHelpers.getConfidenceColor(5)).toBe('var(--color-confidence-high, #4caf50)');
    });

    it('does not throw for undefined input', () => {
      expect(() => ColorHelpers.getConfidenceColor(undefined)).not.toThrow();
    });

    it('does not throw for null input', () => {
      expect(() => ColorHelpers.getConfidenceColor(null)).not.toThrow();
    });

    it('does not throw for NaN input', () => {
      expect(() => ColorHelpers.getConfidenceColor(NaN)).not.toThrow();
    });
  });
});
