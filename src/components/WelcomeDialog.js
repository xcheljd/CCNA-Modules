import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, ExternalLink, Coffee, Lightbulb, Play } from 'lucide-react';

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

        <div className="welcome-content">
          <p className="about-intro">
            This application is built around the excellent{' '}
            <strong>CCNA 200-301 Complete Course</strong> created by{' '}
            <strong>Jeremy McDowell</strong> of Jeremy's IT Lab.
          </p>

          <div className="instructor-info">
            <h4>About the Instructor</h4>
            <p>
              Jeremy McDowell provides comprehensive, high-quality networking education through his
              YouTube channel and various platforms. His CCNA course is widely recognized as one of
              the best free resources available for CCNA certification preparation.
            </p>
          </div>

          <div className="motivation-section">
            <h4>
              <Lightbulb size={18} />
              Why This Tool Exists
            </h4>
            <p>
              I created this tool out of pure frustration with YouTube learning experience. Trying
              to study CCNA meant opening my browser, navigating through playlists, and inevitably
              getting distracted by YouTube's engagement machine. One moment I'm learning OSPF, next
              I'm watching 'Top 10 Anime Fights' or 'How to Be 10x More Productive.'
            </p>
            <p>
              This app provides a distraction-free environment focused solely on Jeremy's amazing
              CCNA course. It removes the friction of finding your place and eliminates algorithmic
              temptations, while ensuring Jeremy still gets the support he deserves for creating
              such high-quality educational content.
            </p>
          </div>

          <div className="instructor-info">
            <h4>Support Jeremy's Work</h4>
            <p>
              Jeremy provides excellent free networking education. Consider supporting his work
              through his platforms:
            </p>
            <div className="support-links">
              <button
                onClick={() =>
                  window.electronAPI.openExternalUrl('https://www.youtube.com/c/JeremysITLab')
                }
                className="support-link"
              >
                <ExternalLink size={16} />
                YouTube Channel
              </button>
              <button
                onClick={() => window.electronAPI.openExternalUrl('https://www.jeremysitlab.com')}
                className="support-link"
              >
                <ExternalLink size={16} />
                Website
              </button>
              <button
                onClick={() =>
                  window.electronAPI.openExternalUrl('https://courses.jeremysitlab.com')
                }
                className="support-link"
              >
                <ExternalLink size={16} />
                Premium Courses
              </button>
              <button
                onClick={() =>
                  window.electronAPI.openExternalUrl('https://www.jeremysitlab.com/discord')
                }
                className="support-link"
              >
                <ExternalLink size={16} />
                Discord Community
              </button>
              <button
                onClick={() =>
                  window.electronAPI.openExternalUrl('https://twitter.com/jeremysitlab')
                }
                className="support-link"
              >
                <ExternalLink size={16} />
                Twitter
              </button>
              <button
                onClick={() =>
                  window.electronAPI.openExternalUrl(
                    'https://www.linkedin.com/company/jeremysitlab'
                  )
                }
                className="support-link"
              >
                <ExternalLink size={16} />
                LinkedIn
              </button>
            </div>
          </div>

          <div className="developer-support">
            <h4>
              <Coffee size={18} />
              Support This App
            </h4>
            <p>
              This application is provided free of charge and is not affiliated with Jeremy's IT
              Lab. If you find this tool helpful, consider supporting my development work:
            </p>
            <div className="donation-links">
              <button
                onClick={() => window.electronAPI.openExternalUrl('https://www.paypal.me/xchel')}
                className="donation-link"
              >
                PayPal
              </button>
              <button
                onClick={() => window.electronAPI.openExternalUrl('https://venmo.com/xcheljd')}
                className="donation-link"
              >
                Venmo
              </button>
            </div>
            <p className="donation-note">
              All support is greatly appreciated but completely optional!
            </p>
          </div>
        </div>

        <div className="welcome-actions">
          <button onClick={handleGetStarted} className="get-started-btn">
            <Play size={16} />
            Get Started
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeDialog;
