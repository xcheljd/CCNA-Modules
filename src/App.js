import React, { useState, useEffect } from 'react';
import ModuleList from './components/ModuleList';
import ModuleDetail from './components/ModuleDetail';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import LoadingScreen from './components/LoadingScreen';
import WelcomeDialog from './components/WelcomeDialog';
import { LayoutDashboard, List } from 'lucide-react';
import modules from './data/modules';
import ProgressTracker from './utils/progressTracker';
import ActivityTracker from './utils/activityTracker';
import themes from './utils/themes';

const { electronAPI } = window;

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState(null);
  const [resourcesAvailable, setResourcesAvailable] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Load theme preference from localStorage
    const saved = localStorage.getItem('app-theme');
    return saved || 'spacegrayLight';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if user has seen welcome
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome; // Show if flag doesn't exist
  });
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Force width on mount before anything else
    document.documentElement.style.width = '100%';
    document.body.style.width = '100%';

    // Smart loading with progress tracking
    const initializeApp = async () => {
      const startTime = Date.now();

      // Define loading phases
      const phases = [
        {
          name: 'Checking course resources...',
          action: async () => {
            setLoadingStatus('Checking course resources...');
            await checkResources();
          },
        },
        {
          name: 'Calculating your progress...',
          action: async () => {
            setLoadingStatus('Calculating your progress...');
            calculateOverallProgress();
          },
        },
        {
          name: 'Setting up activity tracking...',
          action: async () => {
            setLoadingStatus('Setting up activity tracking...');
            ActivityTracker.initializeTracking(modules);
          },
        },
      ];

      // Execute phases with progress updates
      for (let i = 0; i < phases.length; i++) {
        setLoadingProgress(((i + 1) / phases.length) * 100);
        await phases[i].action();
      }

      // Smart timing: minimum 800ms for professional feel, but no artificial delay
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsed);

      setLoadingStatus('Almost ready...');

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    // Apply theme colors and class
    const theme = themes[currentTheme];
    if (theme) {
      try {
        // Apply CSS custom properties; normalize camelCase keys to kebab-case CSS vars
        Object.entries(theme.colors).forEach(([property, value]) => {
          if (value && typeof value === 'string') {
            const cssVarName = property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            document.documentElement.style.setProperty(`--${cssVarName}`, value);
          }
        });

        // Apply theme class for additional styling (append, don't replace)
        document.body.classList.remove(
          'theme-light',
          'theme-dark',
          'theme-ocean',
          'theme-neon',
          'theme-dracula',
          'theme-nord',
          'theme-rose-pine',
          'theme-mocha',
          'theme-gruvbox-dark',
          'theme-gruvbox-light',
          'theme-spacegray',
          'theme-spacegray-light',
          'theme-spacegray-oceanic'
        );
        // Convert camelCase theme ID to kebab-case for CSS class
        const themeClass = `theme-${currentTheme.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;
        document.body.classList.add(themeClass);

        // Ensure html/body/app maintain width during theme switch
        document.documentElement.style.width = '100%';
        document.body.style.width = '100%';
        const appEl = document.querySelector('.app');
        if (appEl) {
          appEl.style.width = '100%';
        }

        // Save theme preference
        localStorage.setItem('app-theme', currentTheme);
      } catch (error) {
        console.error('Error applying theme:', error);
        // Fallback to light theme
        document.body.classList.remove('theme-dark', 'theme-ocean', 'theme-neon', 'theme-dracula');
        document.body.classList.add('theme-light');
      }
    } else {
      console.error('Theme not found:', currentTheme);
    }
  }, [currentTheme]);

  // Listen for theme changes from settings
  useEffect(() => {
    const handleThemeChange = event => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const checkResources = async () => {
    if (electronAPI) {
      const result = await electronAPI.checkResourcesFolder();
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
    if (!electronAPI) {
      alert('File opening is only available in the desktop app');
      return;
    }

    const result = await electronAPI.openResource(filename);

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

  // Show loading screen while app initializes
  if (isLoading) {
    return <LoadingScreen status={loadingStatus} progress={loadingProgress} />;
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

          <div className="header-title-group">
            <h1>CCNA 200-301 Course</h1>
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
                aria-label="Dashboard view"
              >
                <LayoutDashboard size={20} />
              </button>
              <button
                className={`view-toggle-btn ${currentView === 'list' ? 'active' : ''}`}
                onClick={() => setCurrentView('list')}
                aria-label="Modules view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="header-right">
            <div className="header-stats">
              <span>Overall Progress: {Math.round(overallProgress)}%</span>
              <div className="progress-bar-small">
                <div
                  className="progress-fill-small"
                  style={{
                    width: `${overallProgress}%`,
                    background:
                      overallProgress === 100 ? 'var(--color-progress-complete)' : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div className="menu-overlay" onClick={toggleMenu}></div>
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setMenuOpen(false);
                }}
                className="menu-item"
              >
                <svg
                  className="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentView('list');
                  setMenuOpen(false);
                }}
                className="menu-item"
              >
                <svg
                  className="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="4" />
                  <rect x="3" y="10" width="18" height="4" />
                  <rect x="3" y="17" width="18" height="4" />
                </svg>
                All Modules
              </button>
              <button
                onClick={() => {
                  setSettingsOpen(true);
                  setMenuOpen(false);
                }}
                className="menu-item"
              >
                <svg
                  className="menu-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings
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
        {currentView === 'dashboard' && (
          <Dashboard modules={modules} onModuleSelect={handleModuleSelect} />
        )}

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

        <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
      </main>

      {/* Welcome Dialog - appears on first load */}
      <WelcomeDialog open={showWelcome && !isLoading} onOpenChange={setShowWelcome} />
    </div>
  );
}

export default App;
