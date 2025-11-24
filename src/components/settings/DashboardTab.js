import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import SettingsManager from '../../utils/settingsManager';
import { DASHBOARD_SECTIONS, getDefaultDashboardConfig } from '../../utils/dashboardConfig';

function DashboardTab() {
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
      sections: sections.map(s => ({
        id: s.id,
        enabled: s.enabled,
        order: s.order,
      })),
    };

    const result = SettingsManager.saveDashboardConfig(config);
    if (result.success) {
      alert('Dashboard configuration saved! Refresh to see changes.');
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
    <div className="settings-tab-content">
      <h3>Dashboard Customization</h3>
      <p className="tab-description">
        Customize which sections appear on your dashboard and in what order.
      </p>

      <div className="dashboard-sections-list">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`section-item ${!section.enabled ? 'disabled' : ''} ${
              draggedIndex === index ? 'dragging' : ''
            } ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable={true}
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="section-info">
              <div className="section-header">
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
                <h4>{section.title}</h4>
                {!section.removable && <span className="required-badge">Required</span>}
                {section.conditional && <span className="conditional-badge">Conditional</span>}
              </div>
              <p className="section-description">{section.description}</p>
            </div>

            <div className="section-controls">
              <button
                className="move-btn"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp size={18} />
              </button>
              <button
                className="move-btn"
                onClick={() => handleMoveDown(index)}
                disabled={index === sections.length - 1}
                aria-label="Move down"
              >
                <ChevronDown size={18} />
              </button>
              <button className="drag-handle" aria-label="Drag to reorder">
                <div className="drag-handle-dots">
                  <div className="drag-handle-dot"></div>
                  <div className="drag-handle-dot"></div>
                  <div className="drag-handle-dot"></div>
                  <div className="drag-handle-dot"></div>
                  <div className="drag-handle-dot"></div>
                  <div className="drag-handle-dot"></div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <Button onClick={saveDashboardConfig}>Save Configuration</Button>
        <Button onClick={handleReset} variant="outline">
          Reset to Defaults
        </Button>
      </div>

      <div className="dashboard-note">
        <strong>Note:</strong> Conditional sections only appear when relevant (for example,
        some sections only show once you have enough progress data).
      </div>
    </div>
  );
}

export default DashboardTab;
