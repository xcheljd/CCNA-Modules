import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import SettingsManager from '../../utils/settingsManager';
import { DASHBOARD_SECTIONS, getDefaultDashboardConfig } from '../../utils/dashboardConfig';

function DashboardTab() {
  const { success } = useToast();
  const [sections, setSections] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    loadDashboardConfig();
  }, []);

  const loadDashboardConfig = () => {
    let config = SettingsManager.getDashboardConfig();

    if (!config) {
      config = getDefaultDashboardConfig();
      SettingsManager.saveDashboardConfig(config);
    }

    // Clean up stale sections - only keep sections that exist in DASHBOARD_SECTIONS
    const validSectionIds = new Set(DASHBOARD_SECTIONS.map(s => s.id));
    const cleanedSections = config.sections.filter(section => validSectionIds.has(section.id));

    // If sections were removed, save the cleaned config
    if (cleanedSections.length !== config.sections.length) {
      config.sections = cleanedSections;
      SettingsManager.saveDashboardConfig(config);
    }

    // Merge with metadata
    const sectionsWithMeta = config.sections
      .map(configSection => {
        const meta = DASHBOARD_SECTIONS.find(s => s.id === configSection.id);
        return { ...meta, ...configSection };
      })
      .filter(section => section.title !== undefined) // Safety filter: only keep valid sections
      .sort((a, b) => a.order - b.order);

    setSections(sectionsWithMeta);
  };

  const saveDashboardConfig = () => {
    const config = {
      sections: sections.map((s, idx) => ({
        id: s.id,
        enabled: s.enabled,
        order: idx,
      })),
    };

    const result = SettingsManager.saveDashboardConfig(config);
    if (result.success) {
      success('Dashboard configuration saved! Refresh to see changes');
      loadDashboardConfig();
    }
  };

  const handleToggle = id => {
    setSections(prev =>
      prev.map(section => (section.id === id ? { ...section, enabled: !section.enabled } : section))
    );
  };

  const handleMoveUp = index => {
    if (index === 0) return;

    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];

    // Update order numbers
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setSections(newSections);
  };

  const handleMoveDown = index => {
    if (index === sections.length - 1) return;

    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];

    // Update order numbers
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setSections(newSections);
  };

  const handleReset = () => {
    if (!window.confirm('Reset dashboard to default configuration?')) return;

    const defaultConfig = getDefaultDashboardConfig();
    SettingsManager.saveDashboardConfig(defaultConfig);
    loadDashboardConfig();
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);

    // Update order numbers
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setSections(newSections);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div>
      <h3 className="mt-0 mb-2 text-foreground">Dashboard Customization</h3>
      <p className="text-muted-foreground mb-4">
        Customize which sections appear on your dashboard and in what order.
      </p>

      <div className="flex flex-col gap-2 mb-4 max-h-[400px] overflow-y-auto p-2 border border-border rounded-xl bg-muted/20">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`section-item flex justify-between items-center py-2 px-3 pl-10 bg-card border border-border rounded-xl transition-all duration-200 relative overflow-visible min-h-[50px] ${
              !section.enabled ? 'opacity-50' : ''
            } ${draggedIndex === index ? 'dragging' : ''} ${
              dragOverIndex === index ? 'drag-over' : ''
            }`}
            style={
              {
                // Left accent bar on hover (using CSS-in-JS for the ::before pseudo-element effect)
              }
            }
            draggable={true}
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors duration-300" />

            <div className="flex-1 flex flex-col gap-0 justify-center">
              <div className="flex items-center gap-3">
                <div
                  className={`section-checkbox ${section.enabled ? 'checked' : ''} ${!section.removable ? 'disabled' : ''}`}
                  onClick={() => section.removable && handleToggle(section.id)}
                  role="checkbox"
                  aria-checked={section.enabled}
                  aria-disabled={!section.removable}
                  tabIndex={section.removable ? 0 : -1}
                >
                  {section.enabled && <span className="checkmark">✓</span>}
                </div>
                <h4 className="m-0 text-base text-foreground leading-normal">{section.title}</h4>
                {!section.removable && (
                  <span className="text-xs px-2.5 py-1 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm">
                    Required
                  </span>
                )}
                {section.conditional && (
                  <span className="text-xs px-2.5 py-1 bg-accent text-white rounded-xl font-semibold shadow-sm">
                    Conditional
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-[0.8125rem] m-0 leading-snug">
                {section.description}
              </p>
            </div>

            <div className="flex flex-row gap-2 self-center pt-1">
              <button
                className="move-btn w-8 h-8 flex items-center justify-center bg-muted border-[1.5px] border-border rounded-md cursor-pointer transition-all text-foreground"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp size={18} />
              </button>
              <button
                className="move-btn w-8 h-8 flex items-center justify-center bg-muted border-[1.5px] border-border rounded-md cursor-pointer transition-all text-foreground"
                onClick={() => handleMoveDown(index)}
                disabled={index === sections.length - 1}
                aria-label="Move down"
              >
                <ChevronDown size={18} />
              </button>
              <button
                className="drag-handle !w-4 !min-w-4 !max-w-4 h-8 flex items-center justify-center bg-muted border-[1.5px] border-border rounded-md cursor-grab transition-all text-muted-foreground p-0 shrink-0"
                aria-label="Drag to reorder"
              >
                <div className="grid grid-cols-2 grid-rows-3 gap-[3px] w-auto h-auto">
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                  <div className="w-[3px] h-[3px] bg-muted-foreground rounded-full" />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <Button onClick={saveDashboardConfig}>Save Configuration</Button>
        <Button onClick={handleReset} variant="outline">
          Reset to Defaults
        </Button>
      </div>

      <div className="py-4 px-5 bg-[rgba(33,150,243,0.08)] border-l-4 border-primary rounded-xl text-sm text-foreground shadow-sm leading-relaxed">
        <strong>Note:</strong> Conditional sections only appear when relevant (for example, some
        sections only show once you have enough progress data).
      </div>
    </div>
  );
}

export default DashboardTab;
