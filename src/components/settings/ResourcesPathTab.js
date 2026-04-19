import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FolderSearch, RotateCcw, CheckCircle2, XCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const { electronAPI } = window;

function ResourcesPathTab() {
  const { error, info } = useToast();
  const [resourcesInfo, setResourcesInfo] = useState({
    currentPath: '',
    customPath: null,
    exists: false,
    isCustom: false,
  });
  const [loading, setLoading] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    loadResourcesInfo();
  }, []);

  const loadResourcesInfo = async () => {
    if (!electronAPI) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const info = await electronAPI.getResourcesInfo();
      setResourcesInfo(info);
    } catch (err) {
      console.error('Failed to load resources info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFolder = async () => {
    if (!electronAPI) {
      info('Folder selection is only available in the desktop app');
      return;
    }

    const result = await electronAPI.selectResourcesFolder();
    if (result.success) {
      await loadResourcesInfo();
    } else if (result.error) {
      error(`Error: ${result.error}`);
    }
  };

  const handleReset = async () => {
    if (!electronAPI) {
      info('Reset is only available in the desktop app');
      setShowResetConfirm(false);
      return;
    }

    const result = await electronAPI.resetResourcesPath();
    if (result.success) {
      await loadResourcesInfo();
    } else {
      error(`Error: ${result.error}`);
    }
    setShowResetConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3 className="mt-0 mb-2 text-foreground">Resources Folder Path</h3>
      <p className="text-muted-foreground mb-4">
        Select the folder containing your CCNA lab files (.pkt) and flashcard decks (.apkg).
      </p>

      <div className="mb-4 bg-card border border-border rounded-xl p-4 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <label className="block font-semibold mb-2 text-foreground text-sm">Current Path:</label>
        <Input
          value={resourcesInfo.currentPath}
          readOnly
          className="mb-2 !h-12 !flex !items-center !px-4 !py-3 !text-[0.9375rem] !leading-normal !text-left !font-[Segoe_UI,system-ui,-apple-system,sans-serif] !bg-background !border-[1.5px] !border-border !rounded-lg !transition-all !text-foreground hover:!border-primary hover:!shadow-[0_0_0_3px_rgba(33,150,243,0.1)] focus:!border-primary focus:!shadow-[0_0_0_3px_rgba(33,150,243,0.15)] focus:!outline-none"
        />
        <div className="flex gap-3 text-sm flex-wrap">
          {resourcesInfo.exists ? (
            <span className="flex items-center gap-1 text-[var(--color-progress-complete)] font-medium">
              <CheckCircle2 size={16} />
              Folder exists
            </span>
          ) : (
            <span className="flex items-center gap-1 text-destructive font-medium">
              <XCircle size={16} />
              Folder not found
            </span>
          )}
          {resourcesInfo.isCustom && (
            <span className="flex items-center gap-1 text-primary font-medium">
              <Info size={16} />
              Custom path
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-4 mb-2 flex-wrap">
          <Button onClick={handleSelectFolder}>
            <FolderSearch size={16} />
            Browse for Folder
          </Button>
          {resourcesInfo.isCustom && (
            <Button onClick={() => setShowResetConfirm(true)} variant="outline">
              <RotateCcw size={16} />
              Reset to Default
            </Button>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm mb-2 text-foreground font-semibold">Expected folder structure:</h4>
        <pre className="bg-muted/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-foreground border border-border leading-relaxed">
          {`resources/
  ├── Day 1 - Network Devices - Lab.pkt
  ├── Day 1 - Network Devices - Flashcards.apkg
  ├── Day 2 - Interfaces and Cables - Lab.pkt
  └── ...`}
        </pre>
      </div>

      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Resources Path</AlertDialogTitle>
            <AlertDialogDescription>
              Reset to default resources folder? This will clear your custom path setting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ResourcesPathTab;
