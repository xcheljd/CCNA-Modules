import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import '../styles/Settings.css';

function YoutubeSigninDialog({ open, onOpenChange }) {
  const { error } = useToast();

  const markSeen = () => {
    localStorage.setItem('hasSeenYoutubePrompt', 'true');
    onOpenChange(false);
  };

  const handleSignIn = async () => {
    markSeen();
    const result = await window.electronAPI.openYoutubeSignin();
    if (!result?.success && result?.error) {
      error(`Could not open sign-in window: ${result.error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => markSeen()}>
      <DialogContent className="welcome-dialog">
        <DialogHeader>
          <DialogTitle>Sign in to YouTube (optional)</DialogTitle>
        </DialogHeader>

        <div className="welcome-content flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
          <p className="text-base leading-relaxed text-foreground m-0">
            If you have a Google account, you can optionally sign in to YouTube for a better viewing
            experience. This is entirely optional — the app works fully without it.
          </p>

          <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles size={18} />
              What you get
            </h4>
            <ul className="m-0 pl-5">
              <li>
                <strong>Ad-free playback</strong> — if your Google account has YouTube Premium,
                videos play without ads.
              </li>
              <li>
                <strong>Resume where you left off</strong> — YouTube remembers your position in each
                video across sessions.
              </li>
              <li>
                <strong>Watch history &amp; subscription signals</strong> — likes, watch history,
                and subscriptions work normally.
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck size={18} />
              Your privacy
            </h4>
            <ul className="m-0 pl-5">
              <li>
                CCNA-Modules <strong>never sees</strong> your email, password, or any Google account
                data. Sign-in happens directly with Google in a separate window.
              </li>
              <li>
                No OAuth tokens, API keys, or credentials are stored by the app. Session cookies are
                handled by Chromium in your local user-data folder.
              </li>
              <li>
                You can sign out anytime from <strong>Settings → YouTube</strong>, which clears the
                session entirely.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-6 pt-6 border-t border-border gap-3 flex-wrap">
          <Button variant="outline" onClick={markSeen}>
            Maybe later
          </Button>
          <Button onClick={handleSignIn}>
            <LogIn size={16} />
            Sign in to YouTube
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default YoutubeSigninDialog;
