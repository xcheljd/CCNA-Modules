import React, { useState, useEffect, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import WelcomeDialog from './components/WelcomeDialog';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { LayoutDashboard, List } from 'lucide-react';
import modules from './data/modules';
import ProgressTracker from './utils/progressTracker';
import ActivityTracker from './utils/activityTracker';
import themes from './utils/themes';

// Lazy load heavy components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const ModuleList = lazy(() => import('./components/ModuleList'));
const ModuleDetail = lazy(() => import('./components/ModuleDetail'));
const Settings = lazy(() => import('./components/Settings'));

// Loading fallback component
const LazyLoadingFallback = () => (
  <div className="lazy-loading" style={{ padding: '20px', textAlign: 'center' }}>
    <div
      className="spinner"
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0,0,0,0.1)',
        borderTop: '3px solid var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '20px auto',
      }}
    ></div>
    <p>Loading...</p>
  </div>
);

const { electronAPI } = window;

function AppContent() {
  const { error, info } = useToast();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState(null);
  const [resourcesAvailable, setResourcesAvailable] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved || 'light';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    console.log('🎬 App component mounting...');

    const initializeApp = async () => {
      console.log('🚀 App initialization starting...');
      const startTime = Date.now();

      const phases = [
        {
          name: 'Checking course resources...',
          action: async () => {
            console.log('Phase 1: Checking course resources...');
            setLoadingStatus('Checking course resources...');
            try {
              await checkResources();
              console.log('Phase 1 complete');
            } catch (error) {
              console.error('Phase 1 error:', error);
            }
          },
        },
        {
          name: 'Calculating your progress...',
          action: async () => {
            console.log('Phase 2: Calculating progress...');
            setLoadingStatus('Calculating your progress...');
            try {
              calculateOverallProgress();
              console.log('Phase 2 complete');
            } catch (error) {
              console.error('Phase 2 error:', error);
            }
          },
        },
        {
          name: 'Setting up activity tracking...',
          action: async () => {
            console.log('Phase 3: Setting up activity tracking...');
            setLoadingStatus('Setting up activity tracking...');
            try {
              ActivityTracker.initializeTracking(modules);
              console.log('Phase 3 complete');
            } catch (error) {
              console.error('Phase 3 error:', error);
            }
          },
        },
      ];

      for (let i = 0; i < phases.length; i++) {
        setLoadingProgress(((i + 1) / phases.length) * 100);
        console.log(`Starting phase ${i + 1}/${phases.length}: ${phases[i].name}`);
        try {
          await phases[i].action();
        } catch (error) {
          console.error(`Phase ${i + 1} failed:`, error);
        }
      }

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsed);

      setLoadingStatus('Almost ready...');
      console.log('All phases complete in', elapsed, 'ms');
      console.log('Setting loading to false in', remainingTime, 'ms');

      setTimeout(() => {
        console.log('🔔 Calling setIsLoading(false)');
        setIsLoading(false);
        console.log('✅ Main content should now be visible');
      }, remainingTime);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    let theme = themes[currentTheme];

    if (!theme) {
      const fallbackTheme = 'light';
      theme = themes[fallbackTheme];
      localStorage.setItem('app-theme', fallbackTheme);
      setCurrentTheme(fallbackTheme);
    }

    if (theme) {
      try {
        Object.entries(theme.colors).forEach(([property, value]) => {
          if (value && typeof value === 'string') {
            const cssVarName = property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            document.documentElement.style.setProperty(`--${cssVarName}`, value);
          }
        });

        document.body.classList.remove(
          'theme-light',
          'theme-dark',
          'theme-ayu-light',
          'theme-ayu-dark',
          'theme-ocean',
          'theme-neon',
          'theme-nord',
          'theme-rose-pine',
          'theme-mocha',
          'theme-gruvbox-dark',
          'theme-gruvbox-light',
          'theme-spacegray',
          'theme-spacegray-light',
          'theme-spacegray-oceanic'
        );
        const themeClass = `theme-${currentTheme.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;
        document.body.classList.add(themeClass);

        document.documentElement.style.width = '100%';
        document.body.style.width = '100%';
        const appEl = document.querySelector('.app');
        if (appEl) {
          appEl.style.width = '100%';
        }

        localStorage.setItem('app-theme', currentTheme);
      } catch {
        document.body.classList.remove(
          'theme-light',
          'theme-dark',
          'theme-ayu-light',
          'theme-ayu-dark',
          'theme-ocean',
          'theme-neon',
          'theme-nord',
          'theme-rose-pine',
          'theme-mocha',
          'theme-gruvbox-dark',
          'theme-gruvbox-light',
          'theme-spacegray',
          'theme-spacegray-light',
          'theme-spacegray-oceanic'
        );
        document.body.classList.add('theme-light');
      }
    }
  }, [currentTheme]);

  useEffect(() => {
    const handleThemeChange = event => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const checkResources = async () => {
    if (electronAPI) {
      try {
        const result = await electronAPI.checkResourcesFolder();
        console.log('Resources check result:', result);
        setResourcesAvailable(result.exists);
      } catch (error) {
        console.error('Resources check failed:', error);
        setResourcesAvailable(true);
      }
    } else {
      console.log('electronAPI not available, defaulting resources to available');
      setResourcesAvailable(true);
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
    calculateOverallProgress();
  };

  const handleOpenResource = async (type, filename) => {
    if (!electronAPI) {
      info('File opening is only available in the desktop app');
      return;
    }

    const result = await electronAPI.openResource(filename);

    if (!result.success) {
      error(
        `Failed to open ${type}: ${result.error}. Make sure the file exists in the /resources folder and you have the appropriate application installed (Packet Tracer for .pkt files, Anki for .apkg files).`
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
                aria-label="Settings"
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
        <Suspense fallback={<LazyLoadingFallback />}>
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
        </Suspense>
      </main>

      <WelcomeDialog open={showWelcome && !isLoading} onOpenChange={setShowWelcome} />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
