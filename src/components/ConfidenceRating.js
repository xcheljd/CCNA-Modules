import React from 'react';
import '../styles/modules.css';

function ConfidenceRating({ moduleId, confidence, onRate, compact = false }) {
  const ratings = [
    { value: 1, label: 'Need Review', emoji: '😰', color: 'var(--color-confidence-low)' },
    { value: 2, label: 'Unsure', emoji: '😕', color: 'var(--color-confidence-medium)' },
    { value: 3, label: 'Okay', emoji: '😐', color: 'var(--color-confidence-okay)' },
    { value: 4, label: 'Confident', emoji: '😊', color: 'var(--color-confidence-high)' },
    { value: 5, label: 'Mastered', emoji: '🎯', color: 'var(--color-confidence-mastered)' },
  ];

  if (compact) {
    // Compact view for module cards
    if (confidence === 0) return null;

    const rating = ratings.find(r => r.value === confidence);
    return (
      <div className="confidence-compact" title={`Confidence: ${rating.label}`}>
        <span className="confidence-emoji" style={{ color: rating.color }}>
          {rating.emoji}
        </span>
      </div>
    );
  }

  return (
    <div className="confidence-rating">
      <div className="confidence-header">
        <h4>How confident are you with this module?</h4>
        {confidence > 0 && (
          <button className="clear-confidence" onClick={() => onRate(0)} title="Clear rating">
            Clear
          </button>
        )}
      </div>

      <div className="confidence-options">
        {ratings.map(rating => (
          <button
            key={rating.value}
            className={`confidence-option ${confidence === rating.value ? 'selected' : ''}`}
            onClick={() => onRate(rating.value)}
            style={{
              borderColor: confidence === rating.value ? rating.color : 'hsl(var(--border))',
              backgroundColor: confidence === rating.value ? `${rating.color}15` : 'transparent',
            }}
          >
            <span className="confidence-emoji" style={{ color: rating.color }}>
              {rating.emoji}
            </span>
            <span className="confidence-label">{rating.label}</span>
          </button>
        ))}
      </div>

      {confidence > 0 && (
        <p className="confidence-hint">
          {confidence <= 2 && '💡 This module is marked for review'}
          {confidence === 3 && '👍 Keep practicing to improve your confidence'}
          {confidence >= 4 && '🌟 Great job! You have strong confidence in this module'}
        </p>
      )}
    </div>
  );
}

export default ConfidenceRating;
