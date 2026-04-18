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
    return <div className="tab-loading">Loading...</div>;
  }

  return (
    <div className="settings-tab-content">
      <h3>YouTube Account</h3>
      <p className="tab-description">
        Sign in with your Google account for a better viewing experience. Entirely optional — the
        app works fully without it.
      </p>
      <ul className="tab-description-list">
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
      <p className="tab-description">
        CCNA-Modules <strong>never sees</strong> your email, password, or any Google account data —
        sign-in happens directly with Google in a separate window. No OAuth tokens or credentials
        are stored by the app; session cookies are handled by Chromium in your local user-data
        folder and can be wiped anytime with <strong>Sign out</strong>.
      </p>

      <div className="path-display">
        <label>Status:</label>
        <div className="path-status">
          {signedIn ? (
            <span className="status-success">
              <CheckCircle2 size={16} />
              Signed in
            </span>
          ) : (
            <span className="status-info">
              <Circle size={16} />
              Not signed in
            </span>
          )}
        </div>

        <div className="path-actions">
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
