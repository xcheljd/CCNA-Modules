import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, CheckCircle2, Circle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

function YoutubeTab() {
  const { error, success } = useToast();
  const [signedIn, setSignedIn] = useState(null);

  useEffect(() => {
    window.electronAPI.getYoutubeSigninStatus().then(result => {
      setSignedIn(!!result.signedIn);
    });
    const unsubscribe = window.electronAPI.onYoutubeSigninChanged(payload => {
      setSignedIn(!!payload.signedIn);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    const result = await window.electronAPI.openYoutubeSignin();
    if (!result?.success && result?.error) {
      error(`Could not open sign-in window: ${result.error}`);
    }
  };

  const handleSignOut = async () => {
    if (
      !window.confirm(
        'Sign out of YouTube? Any open video windows will close and you will lose ad-free playback + resume state until you sign in again.'
      )
    ) {
      return;
    }
    const result = await window.electronAPI.signOutYoutube();
    if (result?.success) {
      success('Signed out of YouTube');
    } else if (result?.error) {
      error(`Sign-out failed: ${result.error}`);
    }
  };

  if (signedIn === null) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <h3 className="mt-0 mb-2 text-foreground">YouTube Account</h3>
      <p className="text-muted-foreground mb-4">
        Sign in with your Google account for a better viewing experience. Entirely optional — the
        app works fully without it.
      </p>
      <ul className="text-muted-foreground m-0 mb-4 pl-5 flex flex-col gap-1.5 list-disc">
        <li>
          <strong>Ad-free playback</strong> if your Google account has YouTube Premium.
        </li>
        <li>
          <strong>Resume where you left off</strong> on each video across sessions.
        </li>
        <li>
          <strong>Watch history and subscription signals</strong> (likes, recommendations) work
          normally.
        </li>
      </ul>
      <p className="text-muted-foreground mb-4">
        CCNA-Modules <strong>never sees</strong> your email, password, or any Google account data —
        sign-in happens directly with Google in a separate window. No OAuth tokens or credentials
        are stored by the app; session cookies are handled by Chromium in your local user-data
        folder and can be wiped anytime with <strong>Sign out</strong>.
      </p>

      <div className="mb-4 bg-card border border-border rounded-xl p-4 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <label className="block font-semibold mb-2 text-foreground text-sm">Status:</label>
        <div className="flex gap-3 text-sm flex-wrap">
          {signedIn ? (
            <span className="flex items-center gap-1 text-[var(--color-progress-complete)] font-medium">
              <CheckCircle2 size={16} />
              Signed in
            </span>
          ) : (
            <span className="flex items-center gap-1 text-primary font-medium">
              <Circle size={16} />
              Not signed in
            </span>
          )}
        </div>

        <div className="flex gap-3 mt-4 mb-2 flex-wrap">
          {signedIn ? (
            <Button onClick={handleSignOut} variant="outline">
              <LogOut size={16} />
              Sign out
            </Button>
          ) : (
            <Button onClick={handleSignIn}>
              <LogIn size={16} />
              Sign in to YouTube
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default YoutubeTab;
