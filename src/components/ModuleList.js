import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import SearchBar from './SearchBar';
import ConfidenceRating from './ConfidenceRating';
import ProgressTracker from '../utils/progressTracker';
import { asArray } from '@/utils/helpers';
import { ColorHelpers } from '@/utils/colorHelpers';
import { GridIcon, VideoIcon, LabIcon, FlashcardsIcon } from './ui/Icons';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import '../styles/modules.css';

function ModuleList({ modules, onModuleSelect }) {
  const [moduleProgress, setModuleProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('module-view-mode') || 'grid';
  }); // 'grid', 'list', or 'table'
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
      localStorage.setItem('module-view-mode', newMode);
      setTimeout(() => {
        setIsSwitchingView(false);
      }, 20);
    }, 200);
  };

  return (
    <div className="px-5 pt-3 pb-5">
      <div className="sticky top-[68px] z-40 bg-background flex justify-between items-start mb-3 gap-5 -mx-5 px-5 py-2">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          filterConfidence={filterConfidence}
          onConfidenceFilterChange={setFilterConfidence}
        />
        <div className="relative flex items-center bg-card rounded-lg border border-border p-[3px] h-10">
          <div
            className="absolute top-[3px] left-[3px] h-[calc(100%-6px)] rounded-md bg-primary shadow-[0_1px_3px_hsl(var(--primary)/0.3)] transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{
              width: 'calc((100% - 6px) / 3)',
              transform: `translateX(calc(${({ grid: 0, list: 1, table: 2 })[viewMode]} * 100%))`,
            }}
          />
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={value => {
              if (value) handleViewModeChange(value);
            }}
            className="gap-0"
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="relative z-[1] h-9 w-9 p-2 rounded-md border-0 bg-transparent text-muted-foreground hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:shadow-none data-[state=on]:hover:bg-transparent"
            >
              <GridIcon />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="relative z-[1] h-9 w-9 p-2 rounded-md border-0 bg-transparent text-muted-foreground hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:shadow-none data-[state=on]:hover:bg-transparent"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              aria-label="Table view"
              className="relative z-[1] h-9 w-9 p-2 rounded-md border-0 bg-transparent text-muted-foreground hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:shadow-none data-[state=on]:hover:bg-transparent"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
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

      {viewMode === 'table' ? (
        <div className={`transition-opacity duration-150 ease ${isSwitchingView ? 'opacity-0' : ''}`}>
          <Table className="bg-card border border-border rounded-xl overflow-hidden">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] text-center h-9 px-3">Day</TableHead>
                <TableHead className="h-9 px-3">Title</TableHead>
                <TableHead className="w-[60px] text-center h-9 px-3">
                  <VideoIcon className="w-4 h-4 mx-auto text-primary [stroke-width:2]" />
                </TableHead>
                <TableHead className="w-[60px] text-center h-9 px-3">
                  <LabIcon className="w-4 h-4 mx-auto text-primary [stroke-width:2]" />
                </TableHead>
                <TableHead className="w-[60px] text-center h-9 px-3">
                  <FlashcardsIcon className="w-4 h-4 mx-auto text-primary [stroke-width:2]" />
                </TableHead>
                <TableHead className="w-[120px] text-center h-9 px-3">Confidence</TableHead>
                <TableHead className="w-[100px] text-right h-9 px-3">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map(module => {
                const progress = moduleProgress[module.id] || 0;
                const progressColor = ColorHelpers.getProgressColor(progress);
                const confidence = ProgressTracker.getModuleConfidence(module.id);
                const labs = asArray(module.resources.lab);
                const fcs = asArray(module.resources.flashcards);

                return (
                  <TableRow
                    key={module.id}
                    className="cursor-pointer animate-[fadeInUp_0.4s_ease-out_backwards] [&>td]:py-2 [&>td]:px-3"
                    onClick={() => onModuleSelect(module)}
                  >
                    <TableCell className="text-center font-medium whitespace-nowrap">
                      <Badge className="whitespace-nowrap">Day {module.day}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {module.title}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {module.videos.length}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {labs.length > 0 ? labs.length : '-'}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {fcs.length > 0 ? fcs.length : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <ConfidenceRating moduleId={module.id} confidence={confidence} compact={true} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[13px] font-semibold text-muted-foreground w-8 text-right">
                          {Math.round(progress)}%
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
                          <div
                            className="h-full rounded transition-[width] duration-350 ease"
                            style={{ width: `${progress}%`, backgroundColor: progressColor }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
      <div
        className={`modules-container grid transition-opacity duration-150 ease ${
          viewMode === 'grid'
            ? 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3'
            : 'grid-cols-1 list-view'
        } ${isSwitchingView ? 'opacity-0' : ''}`}
      >
        {filteredModules.map(module => {
          const progress = moduleProgress[module.id] || 0;
          const progressColor = ColorHelpers.getProgressColor(progress);
          const confidence = ProgressTracker.getModuleConfidence(module.id);

          return (
            <div
              key={module.id}
              className={`module-card bg-card border border-border rounded-xl cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] animate-[fadeInUp_0.4s_ease-out_backwards] ${
                viewMode === 'grid'
                  ? 'p-5 min-h-[220px] flex flex-col hover:shadow-[0_4px_12px_hsl(var(--primary-foreground)/0.12)] hover:border-primary'
                  : 'px-3 py-2.5 flex items-center gap-3 hover:shadow-[0_1px_6px_hsl(var(--primary-foreground)/0.08)] hover:border-primary'
              }`}
              onClick={() => onModuleSelect(module)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="flex justify-between items-center mb-2.5">
                    <Badge>Day {module.day}</Badge>
                    <span className="font-semibold text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-2.5">
                    <h3 className="m-0 flex-1 text-lg text-foreground my-2.5">
                      {module.title}
                    </h3>
                    <ConfidenceRating moduleId={module.id} confidence={confidence} compact={true} />
                  </div>

                  <div className="flex gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center justify-center gap-1.5 px-2.5 py-2 bg-muted/50 rounded-lg">
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

                  <div className="bg-muted rounded overflow-hidden w-full h-2 mt-auto">
                    <div
                      className="h-full rounded transition-[width] duration-350 ease"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressColor,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Badge className="shrink-0">Day {module.day}</Badge>
                  <h3 className="m-0 text-[15px] font-semibold text-foreground leading-snug truncate flex-1 min-w-0">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 bg-muted/50 rounded">
                      <VideoIcon className="w-3.5 h-3.5 text-primary shrink-0 [stroke-width:2]" />
                      <span className="text-[10px] font-semibold text-foreground">{module.videos.length}</span>
                    </div>
                    {(() => {
                      const labs = asArray(module.resources.lab);
                      return labs.length > 0 ? (
                        <div className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 bg-muted/50 rounded">
                          <LabIcon className="w-3.5 h-3.5 text-primary shrink-0 [stroke-width:2]" />
                          <span className="text-[10px] font-semibold text-foreground">{labs.length}</span>
                        </div>
                      ) : null;
                    })()}
                    {(() => {
                      const fcs = asArray(module.resources.flashcards);
                      return fcs.length > 0 ? (
                        <div className="flex items-center justify-center gap-0.5 px-1.5 py-0.5 bg-muted/50 rounded">
                          <FlashcardsIcon className="w-3.5 h-3.5 text-primary shrink-0 [stroke-width:2]" />
                          <span className="text-[10px] font-semibold text-foreground">{fcs.length}</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  <ConfidenceRating moduleId={module.id} confidence={confidence} compact={true} />
                  <span className="text-[13px] font-semibold text-muted-foreground w-8 text-right shrink-0">
                    {Math.round(progress)}%
                  </span>
                  <div className="w-20 h-1.5 bg-muted rounded overflow-hidden shrink-0">
                    <div
                      className="h-full rounded transition-[width] duration-350 ease"
                      style={{ width: `${progress}%`, backgroundColor: progressColor }}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

export default memo(ModuleList);
