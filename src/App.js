import React, { useState, useEffect, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import WelcomeDialog from './components/WelcomeDialog';
import YoutubeSigninDialog from './components/YoutubeSigninDialog';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { LayoutDashboard, List } from 'lucide-react';
import modules from './data/modules';
import ProgressTracker from './utils/progressTracker';
import ActivityTracker from './utils/activityTracker';
import themes from './utils/themes';
import { RESOURCE_DOWNLOAD_URL } from '@/utils/constants';
import { GridIcon } from '@/components/ui/Icons';
import { Migrations } from './utils/migrations';

// Lazy load heavy components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const ModuleList = lazy(() => import('./components/ModuleList'));
const ModuleDetail = lazy(() => import('./components/ModuleDetail'));
const Settings = lazy(() => import('./components/Settings'));

// Loading fallback component
const LazyLoadingFallback = () => (
  <div className="p-5 text-center">
    <div className="w-10 h-10 border-[3px] border-black/10 border-t-[3px] border-t-primary rounded-full animate-[spin_1s_linear_infinite] mx-auto my-5"></div>
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
  const [showYoutubePrompt, setShowYoutubePrompt] = useState(() => {
    return !localStorage.getItem('hasSeenYoutubePrompt');
  });
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let finishTimer;

    const initializeApp = async () => {
      const startTime = Date.now();

      // Run pending data migrations before anything else
      try {
        Migrations.runMigrations();
      } catch (migrationError) {
        console.error('Migration system error:', migrationError);
      }

      const phases = [
        {
          name: 'Checking course resources...',
          action: async () => {
            setLoadingStatus('Checking course resources...');
            try {
              await checkResources();
            } catch (error) {
              console.error('Phase 1 error:', error);
            }
          },
        },
        {
          name: 'Calculating your progress...',
          action: async () => {
            setLoadingStatus('Calculating your progress...');
            try {
              calculateOverallProgress();
            } catch (error) {
              console.error('Phase 2 error:', error);
            }
          },
        },
        {
          name: 'Setting up activity tracking...',
          action: async () => {
            setLoadingStatus('Setting up activity tracking...');
            try {
              ActivityTracker.initializeTracking(modules);
            } catch (error) {
              console.error('Phase 3 error:', error);
            }
          },
        },
      ];

      for (let i = 0; i < phases.length; i++) {
        setLoadingProgress(((i + 1) / phases.length) * 100);
        try {
          await phases[i].action();
        } catch (error) {
          console.error(`Phase ${i + 1} failed:`, error);
        }
      }

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 800 - elapsed);

      setLoadingStatus('Almost ready...');

      finishTimer = setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    initializeApp();

    return () => {
      if (finishTimer) clearTimeout(finishTimer);
    };
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

        const themeClass = `theme-${currentTheme.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}`;
        for (const cls of [...document.body.classList]) {
          if (cls.startsWith('theme-') && cls !== themeClass) {
            document.body.classList.remove(cls);
          }
        }
        document.body.classList.add(themeClass);

        document.documentElement.style.width = '100%';
        document.body.style.width = '100%';
        const appEl = document.querySelector('.app');
        if (appEl) {
          appEl.style.width = '100%';
        }

        localStorage.setItem('app-theme', currentTheme);
      } catch (err) {
        console.error('Error applying theme:', err);
        for (const cls of [...document.body.classList]) {
          if (cls.startsWith('theme-')) document.body.classList.remove(cls);
        }
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
        setResourcesAvailable(result.exists);
      } catch (error) {
        console.error('Resources check failed:', error);
        setResourcesAvailable(true);
      }
    } else {
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

    try {
      const result = await electronAPI.openResource(filename);

      if (!result.success) {
        error(
          `Failed to open ${type}: ${result.error}. Make sure the file exists in the /resources folder and you have the appropriate application installed (Packet Tracer for .pkt files, Anki for .apkg files).`
        );
      }
    } catch (err) {
      error(`Failed to open ${type}: ${err.message || 'Unknown error'}`);
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
    <div
      className={`min-h-screen w-full bg-background text-foreground transition-[background,color,margin-left] duration-250 ease-[ease] ${menuOpen ? 'ml-[280px]' : ''}`}
    >
      <header className="bg-header text-header-foreground p-5 shadow-[0_1px_4px_hsl(var(--header-foreground)/0.1)] sticky top-0 z-[100]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-8">
          <button
            className="bg-transparent border-none cursor-pointer p-2 flex flex-col gap-1 z-[1]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-[3px] bg-header-foreground rounded-sm transition-all duration-250 ease-[ease]"></span>
            <span className="block w-6 h-[3px] bg-header-foreground rounded-sm transition-all duration-250 ease-[ease]"></span>
            <span className="block w-6 h-[3px] bg-header-foreground rounded-sm transition-all duration-250 ease-[ease]"></span>
          </button>

          <div className="flex items-center gap-4 flex-1 justify-center">
            <h1 className="m-0 text-[28px] text-header-foreground">CCNA 200-301 Course</h1>
            <div className="flex gap-1 bg-[hsl(var(--header-foreground)/0.1)] rounded-md p-1">
              <button
                className={`flex items-center justify-center p-2 cursor-pointer rounded border transition-all duration-200 ${currentView === 'dashboard' ? 'bg-header-foreground text-header border-header-foreground opacity-100 shadow-[0_2px_6px_hsl(var(--header-foreground)/0.3),inset_0_1px_0_hsl(var(--header)/0.1)]' : 'bg-transparent border-transparent text-header-foreground opacity-70 hover:opacity-100 hover:bg-[hsl(var(--header-foreground)/0.15)] hover:border-[hsl(var(--header-foreground)/0.3)] hover:scale-105'}`}
                onClick={() => setCurrentView('dashboard')}
                aria-label="Dashboard view"
              >
                <LayoutDashboard size={20} />
              </button>
              <button
                className={`flex items-center justify-center p-2 cursor-pointer rounded border transition-all duration-200 ${currentView === 'list' ? 'bg-header-foreground text-header border-header-foreground opacity-100 shadow-[0_2px_6px_hsl(var(--header-foreground)/0.3),inset_0_1px_0_hsl(var(--header)/0.1)]' : 'bg-transparent border-transparent text-header-foreground opacity-70 hover:opacity-100 hover:bg-[hsl(var(--header-foreground)/0.15)] hover:border-[hsl(var(--header-foreground)/0.3)] hover:scale-105'}`}
                onClick={() => setCurrentView('list')}
                aria-label="Modules view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 z-[1]">
            <div className="flex items-center gap-[15px] text-header-foreground">
              <span>Overall Progress: {Math.round(overallProgress)}%</span>
              <div className="w-[200px] h-2.5 bg-[hsl(var(--primary-foreground)/0.3)] rounded overflow-hidden">
                <div
                  className="h-full rounded transition-[width] duration-250 ease-[ease]"
                  style={{
                    width: `${overallProgress}%`,
                    background:
                      overallProgress === 100
                        ? 'var(--color-progress-complete)'
                        : 'var(--color-progress-medium)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-[hsl(var(--primary-foreground)/0.1)] z-[999] animate-[fadeIn_0.3s_ease]"
              onClick={toggleMenu}
            ></div>
            <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-sidebar text-sidebar-foreground shadow-[2px_0_8px_hsl(var(--primary-foreground)/0.15)] pt-20 px-5 pb-5 z-[1000] flex flex-col gap-2 animate-[slideInFromLeft_0.4s_cubic-bezier(0.4,0,0.2,1)]">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none rounded-xl cursor-pointer text-base text-sidebar-foreground text-left transition-all duration-250 ease-[ease] font-medium hover:bg-muted hover:translate-x-1"
              >
                <GridIcon className="w-[22px] h-[22px] shrink-0" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentView('list');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none rounded-xl cursor-pointer text-base text-sidebar-foreground text-left transition-all duration-250 ease-[ease] font-medium hover:bg-muted hover:translate-x-1"
              >
                <svg
                  className="w-[22px] h-[22px] shrink-0"
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
                className="w-full flex items-center gap-3 px-5 py-4 bg-transparent border-none rounded-xl cursor-pointer text-base text-sidebar-foreground text-left transition-all duration-250 ease-[ease] font-medium hover:bg-muted hover:translate-x-1"
                aria-label="Settings"
              >
                <svg
                  className="w-[22px] h-[22px] shrink-0"
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
        <div className="bg-[hsl(var(--destructive)/0.1)] text-destructive p-4 text-center border-b border-[hsl(var(--destructive)/0.2)]">
          ⚠️ Resources folder not found. Some features may not work.
          <a
            href={RESOURCE_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary ml-2.5"
          >
            Download resources from Jeremy's IT Lab
          </a>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto p-5 overflow-x-hidden">
        <Suspense fallback={<LazyLoadingFallback />}>
          {currentView === 'dashboard' && (
            <Dashboard modules={modules} onModuleSelect={handleModuleSelect} />
          )}

          {currentView === 'list' && (
            <>
              {ProgressTracker.getLastWatchedVideo() && (
                <div className="mb-[30px] text-center">
                  <button
                    onClick={handleContinueWatching}
                    className="px-10 py-4 text-lg bg-primary text-primary-foreground border-none rounded-[30px] cursor-pointer shadow-[0_4px_12px_hsl(var(--primary)/0.3)] transition-all duration-250 ease-[ease] hover:translate-y-[-2px] hover:shadow-[0_6px_16px_hsl(var(--primary)/0.4)]"
                  >
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
              onProgressChange={calculateOverallProgress}
            />
          )}

          <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
        </Suspense>
      </main>

      <WelcomeDialog open={showWelcome && !isLoading} onOpenChange={setShowWelcome} />
      <YoutubeSigninDialog
        open={!showWelcome && showYoutubePrompt && !isLoading}
        onOpenChange={setShowYoutubePrompt}
      />
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
