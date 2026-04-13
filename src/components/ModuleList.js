import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import SearchBar from './SearchBar';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon } from './ui/Icons';
import '../styles/modules.css';

function ModuleList({ modules, onModuleSelect }) {
  const [moduleProgress, setModuleProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshProgress = useCallback(() => {
    const progress = {};
    modules.forEach(module => {
      progress[module.id] = ProgressTracker.getModuleProgress(module);
    });
    setModuleProgress(progress);
  }, [modules]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress, refreshKey]);

  // Re-read progress when the component gains visibility (user navigates back)
  useEffect(() => {
    const onFocus = () => setRefreshKey(k => k + 1);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const getModuleStatus = progress => {
    if (progress === 0) return 'not-started';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const progress = moduleProgress[module.id] || 0;
      const confidence = ProgressTracker.getModuleConfidence(module.id);

      if (filterStatus !== 'all') {
        const status = getModuleStatus(progress);
        if (status !== filterStatus) return false;
      }

      if (filterConfidence !== 'all') {
        if (filterConfidence === 'not-rated' && confidence !== 0) return false;
        if (filterConfidence === 'needs-review' && (confidence === 0 || confidence > 2))
          return false;
        if (filterConfidence === 'okay' && confidence !== 3) return false;
        if (filterConfidence === 'confident' && (confidence < 4 || confidence === 0)) return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = module.title.toLowerCase().includes(query);
        const matchesDay = module.day.toString().includes(query);
        const matchesVideo = module.videos.some(video => video.title.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDay && !matchesVideo) {
          return false;
        }
      }

      return true;
    });
  }, [modules, moduleProgress, filterStatus, filterConfidence, searchQuery]);

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
            <GridIcon />
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
                  <VideoIcon className="info-icon" />
                  <span>{module.videos.length}</span>
                </div>
                {(() => {
                  const labs = Array.isArray(module.resources.lab)
                    ? module.resources.lab
                    : module.resources.lab
                      ? [module.resources.lab]
                      : [];
                  return labs.length > 0 ? (
                    <div className="info-item">
                      <LabIcon className="info-icon" />
                      <span>
                        {labs.length} Lab{labs.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const fcs = Array.isArray(module.resources.flashcards)
                    ? module.resources.flashcards
                    : module.resources.flashcards
                      ? [module.resources.flashcards]
                      : [];
                  return fcs.length > 0 ? (
                    <div className="info-item">
                      <FlashcardsIcon className="info-icon" />
                      <span>
                        {fcs.length} Card{fcs.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : null;
                })()}
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

export default memo(ModuleList);
