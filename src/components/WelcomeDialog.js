import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import CourseCreditContent from './CourseCreditContent';
import '../styles/Settings.css';

function WelcomeDialog({ open, onOpenChange }) {
  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="welcome-dialog">
        <DialogHeader>
          <DialogTitle>Welcome to CCNA 200-301 Course</DialogTitle>
        </DialogHeader>

        <div className="welcome-content flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
          <CourseCreditContent />
        </div>

        <div className="flex justify-center mt-6 pt-6 border-t border-border">
          <Button
            size="lg"
            className="gap-2 py-3.5 px-10 text-base font-semibold"
            onClick={handleGetStarted}
          >
            <Play size={16} className="shrink-0" />
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeDialog;
