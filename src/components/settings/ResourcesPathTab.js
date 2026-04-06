import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderSearch, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react';

const { electronAPI } = window;

function ResourcesPathTab() {
  const [resourcesInfo, setResourcesInfo] = useState({
    currentPath: '',
    customPath: null,
    exists: false,
    isCustom: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResourcesInfo();
  }, []);

  const loadResourcesInfo = async () => {
    if (!electronAPI) return;

    setLoading(true);
    const info = await electronAPI.getResourcesInfo();
    setResourcesInfo(info);
    setLoading(false);
  };

  const handleSelectFolder = async () => {
    if (!electronAPI) {
      alert('Folder selection is only available in the desktop app');
      return;
    }

    const result = await electronAPI.selectResourcesFolder();
    if (result.success) {
      await loadResourcesInfo();
    } else if (result.error) {
      alert(`Error: ${result.error}`);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset to default resources folder?')) return;

    if (!electronAPI) {
      alert('Reset is only available in the desktop app');
      return;
    }

    const result = await electronAPI.resetResourcesPath();
    if (result.success) {
      await loadResourcesInfo();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="tab-loading">Loading...</div>;
  }

  return (
    <div className="settings-tab-content">
      <h3>Resources Folder Path</h3>
      <p className="tab-description">
        Select the folder containing your CCNA lab files (.pkt) and flashcard decks (.apkg).
      </p>

      <div className="path-display">
        <label>Current Path:</label>
        <Input value={resourcesInfo.currentPath} readOnly className="path-input" />
        <div className="path-status">
          {resourcesInfo.exists ? (
            <span className="status-success">
              <CheckCircle2 size={16} />
              Folder exists
            </span>
          ) : (
            <span className="status-error">
              <XCircle size={16} />
              Folder not found
            </span>
          )}
          {resourcesInfo.isCustom && (
            <span className="status-info">
              <Info size={16} />
              Custom path
            </span>
          )}
        </div>

        <div className="path-actions">
          <Button onClick={handleSelectFolder}>
            <FolderSearch size={16} />
            Browse for Folder
          </Button>
          {resourcesInfo.isCustom && (
            <Button onClick={handleReset} variant="outline">
              <RotateCcw size={16} />
              Reset to Default
            </Button>
          )}
        </div>
      </div>

      <div className="path-help">
        <h4>Expected folder structure:</h4>
        <pre className="folder-structure">
          {`resources/
  ├── Day 1 - Network Devices - Lab.pkt
  ├── Day 1 - Network Devices - Flashcards.apkg
  ├── Day 2 - Interfaces and Cables - Lab.pkt
  └── ...`}
        </pre>
      </div>
    </div>
  );
}

export default ResourcesPathTab;
