import React from 'react';
import '../styles/ConfidenceRating.css';

function ConfidenceRating({ moduleId, confidence, onRate, compact = false }) {
  const ratings = [
    { value: 1, label: 'Need Review', emoji: '😰', color: '#f44336' },
    { value: 2, label: 'Unsure', emoji: '😕', color: '#ff9800' },
    { value: 3, label: 'Okay', emoji: '😐', color: '#ffc107' },
    { value: 4, label: 'Confident', emoji: '😊', color: '#4caf50' },
    { value: 5, label: 'Mastered', emoji: '🎯', color: '#2196f3' },
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
          <button
            className="clear-confidence"
            onClick={() => onRate(0)}
            title="Clear rating"
          >
            Clear
          </button>
        )}
      </div>

      <div className="confidence-options">
        {ratings.map((rating) => (
          <button
            key={rating.value}
            className={`confidence-option ${confidence === rating.value ? 'selected' : ''}`}
            onClick={() => onRate(rating.value)}
            style={{
              borderColor: confidence === rating.value ? rating.color : '#e0e0e0',
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
