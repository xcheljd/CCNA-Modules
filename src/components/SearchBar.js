import React from 'react';
import '../styles/modules.css';

function SearchBar({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  filterConfidence,
  onConfidenceFilterChange,
}) {
  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search modules, videos..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="filter-wrapper">
        <label htmlFor="status-filter" className="filter-label">
          Status:
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={filterStatus}
          onChange={e => onFilterChange(e.target.value)}
        >
          <option value="all">All Modules</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-wrapper">
        <label htmlFor="confidence-filter" className="filter-label">
          Confidence:
        </label>
        <select
          id="confidence-filter"
          className="filter-select"
          value={filterConfidence}
          onChange={e => onConfidenceFilterChange(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="not-rated">Not Rated</option>
          <option value="needs-review">Needs Review (1-2)</option>
          <option value="okay">Okay (3)</option>
          <option value="confident">Confident (4-5)</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
