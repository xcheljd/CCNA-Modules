import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import '../styles/ModuleList.css';

function ModuleList({ modules, onModuleSelect }) {
  const [moduleProgress, setModuleProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');

  useEffect(() => {
    // Calculate progress for all modules
    const progress = {};
    modules.forEach(module => {
      progress[module.id] = ProgressTracker.getModuleProgress(module);
    });
    setModuleProgress(progress);
  }, [modules]);

  const getModuleStatus = (progress) => {
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
      const matchesVideo = module.videos.some(video =>
        video.title.toLowerCase().includes(query)
      );

      // If module doesn't match any criteria, filter it out
      if (!matchesTitle && !matchesDay && !matchesVideo) {
        return false;
      }
    }

    return true;
  });

  const getProgressColor = progress => {
    if (progress === 0) return '#e0e0e0';
    if (progress < 50) return '#ff9800';
    if (progress < 100) return '#2196f3';
    return '#4caf50';
  };

  return (
    <div className="module-list">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        filterConfidence={filterConfidence}
        onConfidenceFilterChange={setFilterConfidence}
      />

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

      <div className="modules-grid">
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
                <ConfidenceRating
                  moduleId={module.id}
                  confidence={confidence}
                  compact={true}
                />
              </div>

              <div className="module-info">
                <span>
                  {module.videos.length} video{module.videos.length > 1 ? 's' : ''}
                </span>
                {module.resources.lab && <span>• Lab</span>}
                {module.resources.flashcards && <span>• Flashcards</span>}
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
