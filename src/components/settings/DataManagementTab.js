/* global Blob, URL, FileReader */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Save, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import ProgressTracker, { isProgressKey } from '../../utils/progressTracker';
import SettingsManager from '../../utils/settingsManager';

function DataManagementTab() {
  const { success, error, info } = useToast();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);

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
          info('Export cancelled');
          return;
        }

        if (!result || !result.success) {
          throw new Error(result?.error || 'Failed to save backup file');
        }

        success('Progress exported successfully', { duration: 5000 });
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

        success('Progress exported successfully (browser download)');
      }
    } catch (err) {
      error(`Export failed: ${err.message}`);
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

          // Defer execution until the user confirms in the dialog
          setPendingImport(importData);
        } catch (err) {
          error(`Import failed: ${err.message}`);
        }
      };

      reader.onerror = () => {
        error('Failed to read the backup file. Please try again.');
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const applyImport = () => {
    if (!pendingImport) return;
    try {
      const importData = pendingImport;

      // Clear existing progress before importing backup so state matches the file
      ProgressTracker.clearAllProgress();

      // Import progress data (filtered through isProgressKey)
      if (importData.data.progress) {
        ProgressTracker.importProgress(importData.data.progress);
      }

      // Import settings
      if (importData.data.settings) {
        SettingsManager.saveSettings(importData.data.settings);
      }

      // Import preferences
      if (importData.data.preferences) {
        if (importData.data.preferences.darkMode !== undefined) {
          localStorage.setItem('darkMode', JSON.stringify(importData.data.preferences.darkMode));
        }
        if (importData.data.preferences.defaultView) {
          localStorage.setItem('defaultView', importData.data.preferences.defaultView);
        }
      }

      success('Import successful! Refresh to see changes', { duration: 5000 });
    } catch (err) {
      error(`Import failed: ${err.message}`);
    } finally {
      setPendingImport(null);
    }
  };

  const handleClear = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    // Clear all progress
    ProgressTracker.clearAllProgress();
    setShowClearConfirm(false);

    success('All progress data cleared. Refresh to see changes', { duration: 5000 });
  };

  const handleSave = () => {
    info('Progress is auto-saved. Use Export to create a backup file');
  };

  return (
    <div>
      <h3 className="mt-0 mb-2 text-foreground">Data Management</h3>
      <p className="text-muted-foreground mb-4">
        Manage your progress data, create backups, and import from previous sessions.
      </p>

      <div className="mb-5 p-4 bg-card border border-border rounded-xl transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
        <h4 className="mt-0 mb-3 text-foreground font-semibold text-base">Save &amp; Backup</h4>
        <div className="mb-4 last:mb-0">
          <Button onClick={handleSave} variant="outline">
            <Save size={16} />
            Save Progress
          </Button>
          <p className="text-sm text-muted-foreground mt-2 mb-0 leading-relaxed">
            Progress is automatically saved. This just confirms the current state.
          </p>
        </div>

        <div className="mb-4 last:mb-0">
          <Button onClick={handleExport}>
            <Download size={16} />
            Export Progress
          </Button>
          <p className="text-sm text-muted-foreground mt-2 mb-0 leading-relaxed">
            Download a backup file containing all your progress and settings.
          </p>
        </div>
      </div>

      <div className="mb-5 p-4 bg-card border border-border rounded-xl transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
        <h4 className="mt-0 mb-3 text-foreground font-semibold text-base">Restore</h4>
        <div className="mb-4 last:mb-0">
          <Button onClick={handleImport} variant="outline">
            <Upload size={16} />
            Import Progress
          </Button>
          <p className="text-sm text-muted-foreground mt-2 mb-0 leading-relaxed">
            Restore progress from a previously exported backup file.
          </p>
        </div>
      </div>

      <Alert
        variant="destructive"
        className="border-2 p-4 shadow-[0_2px_8px_hsl(var(--destructive)/0.15)] transition-all hover:shadow-[0_4px_12px_hsl(var(--destructive)/0.2)]"
      >
        <AlertTriangle size={20} className="shrink-0" />
        <AlertTitle className="text-destructive">Danger Zone</AlertTitle>
        <AlertDescription>
          <div className="mt-3">
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
            <p className="text-sm text-destructive font-semibold mt-2 mb-0 leading-relaxed">
              This will permanently delete all your progress, confidence ratings, and study history.
              This action cannot be undone!
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog
        open={pendingImport !== null}
        onOpenChange={open => {
          if (!open) setPendingImport(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Backup?</DialogTitle>
            {pendingImport && (
              <DialogDescription>
                Backup from {new Date(pendingImport.exportDate).toLocaleDateString()} will restore{' '}
                {pendingImport.metadata?.progressKeys ?? 0} progress items plus settings and
                preferences. Current data will be overwritten.
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingImport(null)}>
              Cancel
            </Button>
            <Button onClick={applyImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataManagementTab;
