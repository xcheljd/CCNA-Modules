import React, { useState, useEffect } from 'react';
import ModuleList from './components/ModuleList';
import ModuleDetail from './components/ModuleDetail';
import LoadingScreen from './components/LoadingScreen';
import modules from './data/modules';
import ProgressTracker from './utils/progressTracker';
import './styles/App.css';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedModule, setSelectedModule] = useState(null);
  const [resourcesAvailable, setResourcesAvailable] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time and initialize app
    const initializeApp = async () => {
      await checkResources();
      calculateOverallProgress();

      // Minimum loading time to show the screen
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Apply dark mode class to body and save preference
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const checkResources = async () => {
    if (ipcRenderer) {
      const result = await ipcRenderer.invoke('check-resources-folder');
      setResourcesAvailable(result.exists);
    }
  };

  const calculateOverallProgress = () => {
    const progress = ProgressTracker.getOverallProgress(modules);
    setOverallProgress(progress);
  };

  const handleModuleSelect = module => {
    setSelectedModule(module);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedModule(null);
    calculateOverallProgress(); // Recalculate after viewing a module
  };

  const handleOpenResource = async (type, filename) => {
    if (!ipcRenderer) {
      alert('File opening is only available in the desktop app');
      return;
    }

    const result = await ipcRenderer.invoke('open-resource', filename);

    if (!result.success) {
      alert(
        `Failed to open ${type}: ${result.error}\n\nMake sure the file exists in the /resources folder and you have the appropriate application installed (Packet Tracer for .pkt files, Anki for .apkg files).`
      );
    }
  };

  const handleContinueWatching = () => {
    const lastWatched = ProgressTracker.getLastWatchedVideo();
    if (lastWatched) {
      const module = modules.find(m => m.id === lastWatched.moduleId);
      if (module) {
        handleModuleSelect(module);
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleExportProgress = () => {
    const progressData = localStorage.getItem('ccna-progress');
    const darkModeData = localStorage.getItem('darkMode');
    const exportData = {
      progress: progressData ? JSON.parse(progressData) : {},
      darkMode: darkModeData ? JSON.parse(darkModeData) : false,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ccna-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const handleImportProgress = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importData = JSON.parse(event.target.result);
            if (importData.progress) {
              localStorage.setItem('ccna-progress', JSON.stringify(importData.progress));
            }
            if (importData.darkMode !== undefined) {
              localStorage.setItem('darkMode', JSON.stringify(importData.darkMode));
              setDarkMode(importData.darkMode);
            }
            calculateOverallProgress();
            alert('Progress imported successfully!');
            setMenuOpen(false);
          } catch (error) {
            alert('Error importing progress: Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveProgress = () => {
    // Progress is automatically saved to localStorage, just show confirmation
    alert('Progress is automatically saved! Use Export to create a backup file.');
    setMenuOpen(false);
  };

  // Show loading screen while app initializes
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      <header className="app-header">
        <div className="header-content">
          <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>CCNA 200-301 Course</h1>
          <div className="header-right">
            <div className="header-stats">
              <span>Overall Progress: {Math.round(overallProgress)}%</span>
              <div className="progress-bar-small">
                <div className="progress-fill-small" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
            <label className="dark-mode-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={toggleMenu}></div>
            <div className="dropdown-menu">
              <button onClick={handleSaveProgress} className="menu-item">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Progress
              </button>
              <button onClick={handleExportProgress} className="menu-item">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Progress
              </button>
              <button onClick={handleImportProgress} className="menu-item">
                <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import Progress
              </button>
            </div>
          </>
        )}
      </header>

      {!resourcesAvailable && (
        <div className="warning-banner">
          ⚠️ Resources folder not found. Some features may not work.
          <a
            href="https://drive.google.com/drive/folders/1g8r_jP9xTLvxVpbhh4mTQCH4DFg6DDHA"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download resources from Jeremy's IT Lab
          </a>
        </div>
      )}

      <main className="app-content">
        {currentView === 'list' && (
          <>
            {ProgressTracker.getLastWatchedVideo() && (
              <div className="continue-watching">
                <button onClick={handleContinueWatching} className="continue-button">
                  ▶ Continue Watching
                </button>
              </div>
            )}
            <ModuleList modules={modules} onModuleSelect={handleModuleSelect} />
          </>
        )}

        {currentView === 'detail' && selectedModule && (
          <ModuleDetail
            module={selectedModule}
            modules={modules}
            onBack={handleBackToList}
            onOpenResource={handleOpenResource}
            onModuleSelect={handleModuleSelect}
          />
        )}
      </main>
    </div>
  );
}

export default App;
