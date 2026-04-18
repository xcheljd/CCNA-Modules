import React from 'react';

function ConfidenceRating({ confidence, onRate, compact = false }) {
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
      <div className="inline-flex items-center ml-2" title={`Confidence: ${rating.label}`}>
        <span className="text-xl leading-none" style={{ color: rating.color }}>
          {rating.emoji}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-5">
      <div className="flex justify-between items-center mb-4">
        <h4 className="m-0 text-sm text-foreground font-semibold">
          How confident are you with this module?
        </h4>
        {confidence > 0 && (
          <button
            className="bg-transparent border-none text-muted-foreground text-sm cursor-pointer px-2 py-1 rounded transition-all duration-150 ease hover:bg-muted hover:text-foreground"
            onClick={() => onRate(0)}
            title="Clear rating"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 my-3 max-md:flex-col">
        {ratings.map(rating => (
          <button
            key={rating.value}
            className={`confidence-option flex-1 flex flex-col items-center gap-1.5 px-2 py-3 bg-card border-2 rounded-[10px] cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] min-w-[60px] hover:-translate-y-1 hover:shadow-[0_2px_8px_hsl(var(--primary-foreground)/0.15)] max-md:flex-row max-md:min-w-0 max-md:py-2.5 max-md:px-3 max-md:justify-start ${
              confidence === rating.value
                ? 'selected -translate-y-1 shadow-[0_3px_10px_hsl(var(--primary-foreground)/0.2)]'
                : 'border-border'
            }`}
            onClick={() => onRate(rating.value)}
            style={{
              borderColor: confidence === rating.value ? rating.color : undefined,
              backgroundColor: confidence === rating.value ? `${rating.color}15` : 'transparent',
            }}
          >
            <span
              className="text-2xl leading-none max-md:text-[22px]"
              style={{ color: rating.color }}
            >
              {rating.emoji}
            </span>
            <span className="text-[11px] font-semibold text-foreground text-center max-md:text-left">
              {rating.label}
            </span>
          </button>
        ))}
      </div>

      {confidence > 0 && (
        <p className="m-0 text-xs text-muted-foreground p-2.5 bg-muted rounded-md border-l-3 border-l-primary">
          {confidence <= 2 && '💡 This module is marked for review'}
          {confidence === 3 && '👍 Keep practicing to improve your confidence'}
          {confidence >= 4 && '🌟 Great job! You have strong confidence in this module'}
        </p>
      )}
    </div>
  );
}

export default ConfidenceRating;
