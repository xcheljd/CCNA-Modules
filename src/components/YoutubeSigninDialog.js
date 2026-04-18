import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

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

        <div className="welcome-content">
          <p className="about-intro">
            If you have a Google account, you can optionally sign in to YouTube for a better viewing
            experience. This is entirely optional — the app works fully without it.
          </p>

          <div className="instructor-info">
            <h4>
              <Sparkles size={18} />
              What you get
            </h4>
            <ul>
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

          <div className="instructor-info">
            <h4>
              <ShieldCheck size={18} />
              Your privacy
            </h4>
            <ul>
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

        <div className="welcome-actions welcome-actions-pair">
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
