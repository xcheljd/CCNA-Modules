import React from 'react';

export function GridIcon({ className = '', size }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...(size ? { width: size, height: size } : {})}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

export function VideoIcon({ className = '', size }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...(size ? { width: size, height: size } : {})}
    >
      <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
      <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LabIcon({ className = '', size }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...(size ? { width: size, height: size } : {})}
    >
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
    </svg>
  );
}

export function FlashcardsIcon({ className = '', size }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      {...(size ? { width: size, height: size } : {})}
    >
      <rect x="2" y="4" width="12" height="16" rx="2" transform="rotate(-15 8 12)" fill="none" />
      <rect x="6" y="3" width="12" height="16" rx="2" fill="hsl(var(--card))" />
      <rect
        x="10"
        y="4"
        width="12"
        height="16"
        rx="2"
        transform="rotate(15 16 12)"
        fill="hsl(var(--card))"
      />
    </svg>
  );
}

export function CircularProgress({ percentage, strokeColor, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" className={`circular-chart ${className}`.trim()}>
      <path
        className="circle-bg"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="circle"
        stroke={strokeColor}
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="18" className="percentage">
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}
