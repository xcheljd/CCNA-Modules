import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Coffee, Lightbulb, Play } from 'lucide-react';
import {
  YOUTUBE_CHANNEL_URL,
  JEREMYS_IT_LAB_URL,
  COURSES_URL,
  DISCORD_URL,
  TWITTER_URL,
  LINKEDIN_URL,
  PAYPAL_URL,
  VENMO_URL,
} from '@/utils/constants';
import { openExternal } from '@/utils/helpers';
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
          <p className="text-base leading-relaxed text-foreground m-0">
            This application is built around the excellent{' '}
            <strong className="text-primary font-semibold">CCNA 200-301 Complete Course</strong>{' '}
            created by <strong className="text-primary font-semibold">Jeremy McDowell</strong> of
            Jeremy&apos;s IT Lab.
          </p>

          <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground">About the Instructor</h4>
            <p className="m-0 leading-relaxed text-muted-foreground">
              Jeremy McDowell provides comprehensive, high-quality networking education through his
              YouTube channel and various platforms. His CCNA course is widely recognized as one of
              the best free resources available for CCNA certification preparation.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-[var(--color-confidence-okay,#ffc107)] transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
              <Lightbulb size={18} />
              Why This Tool Exists
            </h4>
            <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
              I created this tool out of pure frustration with YouTube learning experience. Trying
              to study CCNA meant opening my browser, navigating through playlists, and inevitably
              getting distracted by YouTube&apos;s engagement machine. One moment I&apos;m learning
              OSPF, next I&apos;m watching &apos;Top 10 Anime Fights&apos; or &apos;How to Be 10x
              More Productive.&apos;
            </p>
            <p className="m-0 leading-relaxed text-muted-foreground">
              This app provides a distraction-free environment focused solely on Jeremy&apos;s
              amazing CCNA course. It removes the friction of finding your place and eliminates
              algorithmic temptations, while ensuring Jeremy still gets the support he deserves for
              creating such high-quality educational content.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground">
              Support Jeremy&apos;s Work
            </h4>
            <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
              Jeremy provides excellent free networking education. Consider supporting his work
              through his platforms:
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(YOUTUBE_CHANNEL_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                YouTube Channel
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(JEREMYS_IT_LAB_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                Website
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(COURSES_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                Premium Courses
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(DISCORD_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                Discord Community
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(TWITTER_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(LINKEDIN_URL)}
              >
                <ExternalLink size={16} className="shrink-0" />
                LinkedIn
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-accent transition-all hover:shadow-[0_2px_8px_hsl(var(--foreground)/0.08)]">
            <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
              <Coffee size={18} />
              Support This App
            </h4>
            <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
              This application is provided free of charge and is not affiliated with Jeremy&apos;s
              IT Lab. If you find this tool helpful, consider supporting my development work:
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(PAYPAL_URL)}
              >
                PayPal
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2 px-4 py-3"
                onClick={() => openExternal(VENMO_URL)}
              >
                Venmo
              </Button>
            </div>
            <p className="!mt-3 text-sm text-accent font-medium italic m-0">
              All support is greatly appreciated but completely optional!
            </p>
          </div>
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
