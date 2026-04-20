import React, { useState, useEffect, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import WelcomeDialog from './components/WelcomeDialog';
import YoutubeSigninDialog from './components/YoutubeSigninDialog';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutDashboard, List, Settings as SettingsIcon } from 'lucide-react';
import modules from './data/modules';
import ProgressTracker from './utils/progressTracker';
import ActivityTracker from './utils/activityTracker';
import themes from './utils/themes';
import { RESOURCE_DOWNLOAD_URL } from '@/utils/constants';
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

  if (isLoading) {
    return <LoadingScreen status={loadingStatus} progress={loadingProgress} />;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-[background,color] duration-250 ease-[ease]">
      <header className="bg-header text-header-foreground p-5 shadow-[0_1px_4px_hsl(var(--header-foreground)/0.1)] sticky top-0 z-[45]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <h1 className="m-0 text-[28px] text-header-foreground">CCNA 200-301 Course</h1>
            <ToggleGroup
              type="single"
              value={currentView}
              onValueChange={value => {
                if (value) setCurrentView(value);
              }}
              className="bg-[hsl(var(--header-foreground)/0.1)] rounded-md p-1"
            >
              <ToggleGroupItem
                value="dashboard"
                aria-label="Dashboard view"
                className="p-2 text-header-foreground opacity-70 data-[state=on]:bg-header-foreground data-[state=on]:text-header data-[state=on]:border-header-foreground data-[state=on]:opacity-100 data-[state=on]:shadow-[0_2px_6px_hsl(var(--header-foreground)/0.3),inset_0_1px_0_hsl(var(--header)/0.1)] hover:opacity-100 hover:bg-[hsl(var(--header-foreground)/0.15)]"
              >
                <LayoutDashboard size={20} />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="list"
                aria-label="Modules view"
                className="p-2 text-header-foreground opacity-70 data-[state=on]:bg-header-foreground data-[state=on]:text-header data-[state=on]:border-header-foreground data-[state=on]:opacity-100 data-[state=on]:shadow-[0_2px_6px_hsl(var(--header-foreground)/0.3),inset_0_1px_0_hsl(var(--header)/0.1)] hover:opacity-100 hover:bg-[hsl(var(--header-foreground)/0.15)]"
              >
                <List size={20} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-5 z-[1]">
            <div className="flex items-center gap-[15px] text-header-foreground">
              <span>Overall Progress: {Math.round(overallProgress)}%</span>
              <Progress value={overallProgress} className="w-[200px] h-2.5" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-header-foreground opacity-80 hover:opacity-100 hover:bg-[hsl(var(--header-foreground)/0.15)]"
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
            >
              <SettingsIcon size={22} />
            </Button>
          </div>
        </div>
      </header>

      {!resourcesAvailable && (
        <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
          <AlertDescription className="text-center">
            ⚠️ Resources folder not found. Some features may not work.
            <a
              href={RESOURCE_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary ml-2.5"
            >
              Download resources from Jeremy's IT Lab
            </a>
          </AlertDescription>
        </Alert>
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
                  <Button
                    size="lg"
                    className="rounded-[30px] px-10 py-4 text-lg shadow-[0_4px_12px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_16px_hsl(var(--primary)/0.4)]"
                    onClick={handleContinueWatching}
                  >
                    ▶ Continue Watching
                  </Button>
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
