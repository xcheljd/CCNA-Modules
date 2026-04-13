/**
 * Shared utility functions.
 */

/**
 * Normalize a value to an array.
 * - If already an array, return as-is.
 * - If truthy (non-null/undefined), wrap in a single-element array.
 * - If nullish, return an empty array.
 */
export const asArray = val => (Array.isArray(val) ? val : val ? [val] : []);
