import React, { useState } from 'react';
import GoalTracker from '../utils/goalTracker';

function GoalModal({ onClose, onCreate }) {
  const [selectedPreset, setSelectedPreset] = useState('moderate');
  const [type, setType] = useState('weekly');
  const presets = GoalTracker.getPresets();

  const handleCreate = () => {
    const preset = presets[selectedPreset];
    onCreate({
      type,
      targets: preset.weekly,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create Learning Goal</h2>

        <div className="form-group">
          <label>Duration</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="preset-selection">
          {Object.entries(presets).map(([key, preset]) => (
            <div
              key={key}
              className={`preset-card ${selectedPreset === key ? 'selected' : ''}`}
              onClick={() => setSelectedPreset(key)}
            >
              <h4>{preset.name}</h4>
              <p>{preset.description}</p>
              <div className="preset-targets">
                <span>{preset.weekly.modulesCompleted} modules</span>
                <span>{preset.weekly.videosWatched} videos</span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreate}>
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalModal;
