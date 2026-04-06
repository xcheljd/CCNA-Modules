// Color helpers for progress and confidence visualization

export const ColorHelpers = {
  /**
   * Get color for progress percentage
   * @param {number} progress - Progress percentage (0-100)
   * @returns {string} CSS color value
   */
  getProgressColor(progress) {
    if (progress === 0) return 'hsl(var(--muted))';
    if (progress === 100) return 'var(--color-progress-complete)';
    return 'hsl(var(--ring))';
  },

  /**
   * Get color for confidence rating
   * @param {number} confidence - Confidence rating (0-5)
   * @returns {string} CSS color value
   */
  getConfidenceColor(confidence) {
    if (confidence === 0) return 'var(--color-confidence-none, #e0e0e0)';
    if (confidence <= 2) return 'var(--color-confidence-low, #f44336)';
    if (confidence === 3) return 'var(--color-confidence-medium, #ff9800)';
    return 'var(--color-confidence-high, #4caf50)';
  },
};

export default ColorHelpers;
