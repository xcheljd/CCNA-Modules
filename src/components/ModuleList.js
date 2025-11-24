import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import '../styles/modules.css';

function ModuleList({ modules, onModuleSelect }) {
  const [moduleProgress, setModuleProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSwitchingView, setIsSwitchingView] = useState(false);

  useEffect(() => {
    // Calculate progress for all modules
    const progress = {};
    modules.forEach(module => {
      progress[module.id] = ProgressTracker.getModuleProgress(module);
    });
    setModuleProgress(progress);
  }, [modules]);

  const getModuleStatus = progress => {
    if (progress === 0) return 'not-started';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  const filteredModules = modules.filter(module => {
    const progress = moduleProgress[module.id] || 0;
    const confidence = ProgressTracker.getModuleConfidence(module.id);

    // Filter by completion status
    if (filterStatus !== 'all') {
      const status = getModuleStatus(progress);
      if (status !== filterStatus) return false;
    }

    // Filter by confidence rating
    if (filterConfidence !== 'all') {
      if (filterConfidence === 'not-rated' && confidence !== 0) return false;
      if (filterConfidence === 'needs-review' && (confidence === 0 || confidence > 2)) return false;
      if (filterConfidence === 'okay' && confidence !== 3) return false;
      if (filterConfidence === 'confident' && (confidence < 4 || confidence === 0)) return false;
    }

    // Filter by search query (searches title, description, and video names)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = module.title.toLowerCase().includes(query);
      const matchesDay = module.day.toString().includes(query);

      // Search through video titles
      const matchesVideo = module.videos.some(video => video.title.toLowerCase().includes(query));

      // If module doesn't match any criteria, filter it out
      if (!matchesTitle && !matchesDay && !matchesVideo) {
        return false;
      }
    }

    return true;
  });

  const getProgressColor = progress => {
    if (progress === 0) return 'hsl(var(--muted))';
    if (progress === 100) return 'var(--color-progress-complete)';
    return 'hsl(var(--ring))';
  };

  const handleViewModeChange = newMode => {
    if (newMode === viewMode) return;

    setIsSwitchingView(true);
    setTimeout(() => {
      setViewMode(newMode);
      setTimeout(() => {
        setIsSwitchingView(false);
      }, 20);
    }, 200);
  };

  return (
    <div className="module-list">
      <div className="module-list-header">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filterConfidence={filterConfidence}
          onConfidenceFilterChange={setFilterConfidence}
        />
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('grid')}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('list')}
            aria-label="List view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {filteredModules.length === 0 && (
        <div className="no-results">
          <p>No modules found matching your criteria.</p>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-filters-btn">
              Clear search
            </button>
          )}
          {filterStatus !== 'all' && (
            <button onClick={() => setFilterStatus('all')} className="clear-filters-btn">
              Clear status filter
            </button>
          )}
          {filterConfidence !== 'all' && (
            <button onClick={() => setFilterConfidence('all')} className="clear-filters-btn">
              Clear confidence filter
            </button>
          )}
        </div>
      )}

      <div className={`modules-container ${viewMode}-view ${isSwitchingView ? 'switching' : ''}`}>
        {filteredModules.map(module => {
          const progress = moduleProgress[module.id] || 0;
          const progressColor = getProgressColor(progress);
          const confidence = ProgressTracker.getModuleConfidence(module.id);

          return (
            <div key={module.id} className="module-card" onClick={() => onModuleSelect(module)}>
              <div className="module-header">
                <span className="module-day">Day {module.day}</span>
                <span className="module-progress">{Math.round(progress)}%</span>
              </div>

              <div className="module-title-row">
                <h3 className="module-title">{module.title}</h3>
                <ConfidenceRating moduleId={module.id} confidence={confidence} compact={true} />
              </div>

              <div className="module-info">
                <div className="info-item">
                  <svg
                    className="info-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="4" ry="4" />
                    <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
                  </svg>
                  <span>{module.videos.length}</span>
                </div>
                {module.resources.lab && (
                  <div className="info-item">
                    <svg
                      className="info-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-45 12 12)" />
                      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(45 12 12)" />
                      <ellipse cx="12" cy="12" rx="10" ry="4" />
                    </svg>
                    <span>Lab</span>
                  </div>
                )}
                {module.resources.flashcards && (
                  <div className="info-item">
                    <svg
                      className="info-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="12"
                        height="16"
                        rx="2"
                        transform="rotate(-15 8 12)"
                        fill="none"
                      />
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
                    <span>Cards</span>
                  </div>
                )}
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progressColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleList;
