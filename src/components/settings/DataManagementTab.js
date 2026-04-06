/* eslint-env browser */
/* global Blob, URL, FileReader */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import ProgressTracker, { isProgressKey } from '../../utils/progressTracker';
import SettingsManager from '../../utils/settingsManager';

function DataManagementTab() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    try {
      // Gather all data
      const exportData = {
        exportVersion: '1.0',
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        data: {
          progress: {},
          settings: SettingsManager.getSettings(),
          preferences: {
            darkMode: JSON.parse(localStorage.getItem('darkMode') || 'false'),
            defaultView: localStorage.getItem('defaultView') || 'dashboard',
          },
        },
        metadata: {
          totalKeys: 0,
          progressKeys: 0,
        },
      };

      // Export all progress data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (isProgressKey(key)) {
          exportData.data.progress[key] = value;
          exportData.metadata.progressKeys++;
        }

        exportData.metadata.totalKeys++;
      }

      const hasElectronExport =
        typeof window !== 'undefined' &&
        window.electronAPI &&
        typeof window.electronAPI.exportProgressBackup === 'function';

      if (hasElectronExport) {
        const result = await window.electronAPI.exportProgressBackup(exportData);

        if (result && result.canceled) {
          alert('Export cancelled.');
          return;
        }

        if (!result || !result.success) {
          throw new Error(result?.error || 'Failed to save backup file');
        }

        alert(`Progress exported successfully!\n\nSaved to:\n${result.filePath}`);
      } else {
        // Fallback: browser-like download behavior
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ccna-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        alert('Progress exported successfully! (saved via browser download)');
      }
    } catch (error) {
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const importData = JSON.parse(event.target.result);

          // Validate import data
          if (!importData.exportVersion || !importData.data) {
            throw new Error('Invalid backup file format');
          }

          // Confirm import
          const confirmMsg =
            `Import backup from ${new Date(importData.exportDate).toLocaleDateString()}?\n\n` +
            `This will restore:\n` +
            `- ${importData.metadata.progressKeys} progress items\n` +
            `- Settings and preferences\n\n` +
            `Current data will be overwritten.`;

          if (!window.confirm(confirmMsg)) return;

          // Clear existing progress before importing backup so state matches the file
          ProgressTracker.clearAllProgress();

          // Import progress data
          if (importData.data.progress) {
            Object.keys(importData.data.progress).forEach(key => {
              localStorage.setItem(key, importData.data.progress[key]);
            });
          }

          // Import settings
          if (importData.data.settings) {
            SettingsManager.saveSettings(importData.data.settings);
          }

          // Import preferences
          if (importData.data.preferences) {
            if (importData.data.preferences.darkMode !== undefined) {
              localStorage.setItem(
                'darkMode',
                JSON.stringify(importData.data.preferences.darkMode)
              );
            }
            if (importData.data.preferences.defaultView) {
              localStorage.setItem('defaultView', importData.data.preferences.defaultView);
            }
          }

          alert('Import successful! Please refresh the page to see changes.');
        } catch (error) {
          alert(`Import failed: ${error.message}`);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleClear = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    // Clear all progress
    ProgressTracker.clearAllProgress();
    setShowClearConfirm(false);

    alert('All progress data has been cleared. Please refresh the page.');
  };

  const handleSave = () => {
    alert('Progress is automatically saved to localStorage. Use Export to create a backup file.');
  };

  return (
    <div className="settings-tab-content">
      <h3>Data Management</h3>
      <p className="tab-description">
        Manage your progress data, create backups, and import from previous sessions.
      </p>

      <div className="data-section">
        <h4>Save & Backup</h4>
        <div className="data-actions">
          <Button onClick={handleSave} variant="outline">
            <Save size={16} />
            Save Progress
          </Button>
          <p className="action-description">
            Progress is automatically saved. This just confirms the current state.
          </p>
        </div>

        <div className="data-actions">
          <Button onClick={handleExport}>
            <Download size={16} />
            Export Progress
          </Button>
          <p className="action-description">
            Download a backup file containing all your progress and settings.
          </p>
        </div>
      </div>

      <div className="data-section">
        <h4>Restore</h4>
        <div className="data-actions">
          <Button onClick={handleImport} variant="outline">
            <Upload size={16} />
            Import Progress
          </Button>
          <p className="action-description">
            Restore progress from a previously exported backup file.
          </p>
        </div>
      </div>

      <div className="data-section danger-zone">
        <h4>
          <AlertTriangle size={20} className="inline-block mr-2" />
          Danger Zone
        </h4>
        <div className="data-actions">
          <Button
            onClick={handleClear}
            variant="destructive"
            className={showClearConfirm ? 'confirm-active' : ''}
          >
            {showClearConfirm ? (
              <>
                <AlertTriangle size={16} />
                Click Again to Confirm
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Clear All Progress
              </>
            )}
          </Button>
          {showClearConfirm && (
            <Button onClick={() => setShowClearConfirm(false)} variant="outline">
              Cancel
            </Button>
          )}
          <p className="action-description warning">
            This will permanently delete all your progress, confidence ratings, and study history.
            This action cannot be undone!
          </p>
        </div>
      </div>
    </div>
  );
}

export default DataManagementTab;
