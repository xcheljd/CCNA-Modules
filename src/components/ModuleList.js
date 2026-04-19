import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import SearchBar from './SearchBar';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import { asArray } from '@/utils/helpers';
import { ColorHelpers } from '@/utils/colorHelpers';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon } from './ui/Icons';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
    <div className="p-5">
      <div className="flex justify-between items-start mb-5 gap-5">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filterConfidence={filterConfidence}
          onConfidenceFilterChange={setFilterConfidence}
        />
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={value => {
            if (value) handleViewModeChange(value);
          }}
          className="bg-card rounded-lg p-1 border border-border"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <GridIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-15 px-5 text-muted-foreground">
          <p className="text-lg mb-5">No modules found matching your criteria.</p>
          {searchQuery && (
            <Button className="mx-2 text-[15px]" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          )}
          {filterStatus !== 'all' && (
            <Button className="mx-2 text-[15px]" onClick={() => setFilterStatus('all')}>
              Clear status filter
            </Button>
          )}
          {filterConfidence !== 'all' && (
            <Button className="mx-2 text-[15px]" onClick={() => setFilterConfidence('all')}>
              Clear confidence filter
            </Button>
          )}
        </div>
      )}

      <div
        className={`modules-container grid gap-5 transition-opacity duration-150 ease ${
          viewMode === 'grid'
            ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]'
            : 'grid-cols-1 gap-3'
        } ${isSwitchingView ? 'opacity-0' : ''}`}
      >
        {filteredModules.map(module => {
          const progress = moduleProgress[module.id] || 0;
          const progressColor = ColorHelpers.getProgressColor(progress);
          const confidence = ProgressTracker.getModuleConfidence(module.id);

          return (
            <div
              key={module.id}
              className={`module-card bg-card border border-border rounded-xl p-5 cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] animate-[fadeInUp_0.4s_ease-out_backwards] ${
                viewMode === 'grid'
                  ? 'min-h-[220px] flex flex-col hover:shadow-[0_4px_12px_hsl(var(--primary-foreground)/0.12)] hover:-translate-y-1 hover:border-primary'
                  : 'flex flex-col min-h-[120px] relative overflow-hidden mb-0 hover:translate-x-1 hover:shadow-[0_1px_6px_hsl(var(--primary-foreground)/0.08)]'
              }`}
              onClick={() => onModuleSelect(module)}
            >
              <div
                className={`module-header ${
                  viewMode === 'grid'
                    ? 'flex justify-between items-center mb-2.5'
                    : 'flex flex-col items-start gap-1.5 mb-0 min-w-[140px] shrink-0'
                }`}
              >
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-xl text-sm font-semibold">
                  Day {module.day}
                </span>
                <span
                  className={`font-semibold text-muted-foreground ${
                    viewMode === 'list' ? 'text-[15px] ml-auto' : ''
                  }`}
                >
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="flex items-center justify-between my-2.5">
                <h3
                  className={`m-0 flex-1 ${
                    viewMode === 'grid'
                      ? 'text-lg text-foreground my-2.5'
                      : 'text-[17px] font-semibold text-foreground leading-[1.3] line-clamp-2 overflow-hidden'
                  }`}
                >
                  {module.title}
                </h3>
                <ConfidenceRating moduleId={module.id} confidence={confidence} compact={true} />
              </div>

              <div
                className={`flex ${
                  viewMode === 'grid'
                    ? 'gap-2 text-sm text-muted-foreground mb-4'
                    : 'flex-row gap-3 text-[13px] text-muted-foreground mb-0 shrink-0 items-center'
                }`}
              >
                <div
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 bg-muted/50 rounded-lg ${
                    viewMode === 'list' ? '' : ''
                  }`}
                >
                  <VideoIcon className="w-[18px] h-[18px] text-primary shrink-0 [stroke-width:2]" />
                  <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                    {module.videos.length}
                  </span>
                </div>
                {(() => {
                  const labs = asArray(module.resources.lab);
                  return labs.length > 0 ? (
                    <div className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-muted/50 rounded-lg">
                      <LabIcon className="w-[18px] h-[18px] text-primary shrink-0 [stroke-width:2]" />
                      <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                        {labs.length} Lab{labs.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const fcs = asArray(module.resources.flashcards);
                  return fcs.length > 0 ? (
                    <div className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-muted/50 rounded-lg">
                      <FlashcardsIcon className="w-[18px] h-[18px] text-primary shrink-0 [stroke-width:2]" />
                      <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                        {fcs.length} Card{fcs.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div
                className={`bg-muted rounded overflow-hidden ${
                  viewMode === 'grid' ? 'w-full h-2 mt-auto' : 'shrink-0 w-[156px] h-2 ml-auto'
                }`}
              >
                <div
                  className="h-full rounded transition-[width] duration-350 ease"
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
