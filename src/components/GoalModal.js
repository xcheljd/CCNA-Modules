import React, { useState } from 'react';
import GoalTracker from '../utils/goalTracker';

function GoalModal({ onClose, onCreate }) {
  const [selectedPreset, setSelectedPreset] = useState('moderate');
  const [type, setType] = useState('weekly');
  const presets = GoalTracker.getPresets();

  const handleCreate = () => {
    const preset = presets[selectedPreset];
    const targets = type === 'monthly' ? preset.monthly : preset.weekly;
    onCreate({
      type,
      targets,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl p-6 max-w-lg w-full mx-4 shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Create Learning Goal</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Duration</label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full p-2 bg-card border border-border rounded-md text-foreground"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {Object.entries(presets).map(([key, preset]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                selectedPreset === key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-ring'
              }`}
              onClick={() => setSelectedPreset(key)}
            >
              <h4 className="text-foreground font-semibold m-0 mb-1">{preset.name}</h4>
              <p className="text-sm text-muted-foreground m-0 mb-2">{preset.description}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">
                  {preset[type].modulesCompleted} modules
                </span>
                <span className="px-2 py-1 bg-muted rounded">
                  {preset[type].videosWatched} videos
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 bg-muted text-foreground border border-border rounded-lg cursor-pointer text-sm font-medium transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:bg-muted/80"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-lg cursor-pointer text-sm font-medium transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:opacity-90"
            onClick={handleCreate}
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalModal;
