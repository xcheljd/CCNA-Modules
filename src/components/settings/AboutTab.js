import React from 'react';
import { Heart, ExternalLink, Coffee, Lightbulb } from 'lucide-react';
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

function AboutTab() {
  return (
    <div className="p-2">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-border">
        <Heart className="text-primary shrink-0" size={32} />
        <h3 className="m-0 text-2xl font-semibold text-foreground">Course Credit</h3>
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-base leading-relaxed text-foreground m-0">
          This application is built around the excellent{' '}
          <strong className="text-primary font-semibold">CCNA 200-301 Complete Course</strong>{' '}
          created by <strong className="text-primary font-semibold">Jeremy McDowell</strong> of
          Jeremy&apos;s IT Lab.
        </p>

        <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
            About the Instructor
          </h4>
          <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
            Jeremy McDowell provides comprehensive, high-quality networking education through his
            YouTube channel and various platforms. His CCNA course is widely recognized as one of
            the best free resources available for CCNA certification preparation.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-[var(--color-confidence-okay,#ffc107)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb size={18} />
            Why This Tool Exists
          </h4>
          <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
            I created this tool out of pure frustration with YouTube learning experience. Trying to
            study CCNA meant opening my browser, navigating through playlists, and inevitably
            getting distracted by YouTube&apos;s engagement machine. One moment I&apos;m learning
            OSPF, next I&apos;m watching &apos;Top 10 Anime Fights&apos; or &apos;How to Be 10x More
            Productive.&apos;
          </p>
          <p className="m-0 leading-relaxed text-muted-foreground">
            This app provides a distraction-free environment focused solely on Jeremy&apos;s amazing
            CCNA course. It removes the friction of finding your place and eliminates algorithmic
            temptations, while ensuring Jeremy still gets the support he deserves for creating such
            high-quality educational content.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
            Support Jeremy&apos;s Work
          </h4>
          <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
            Jeremy provides excellent free networking education. Consider supporting his work
            through his platforms:
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => openExternal(YOUTUBE_CHANNEL_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              YouTube Channel
            </button>
            <button
              onClick={() => openExternal(JEREMYS_IT_LAB_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              Website
            </button>
            <button
              onClick={() => openExternal(COURSES_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              Premium Courses
            </button>
            <button
              onClick={() => openExternal(DISCORD_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              Discord Community
            </button>
            <button
              onClick={() => openExternal(TWITTER_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              Twitter
            </button>
            <button
              onClick={() => openExternal(LINKEDIN_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              <ExternalLink size={16} className="shrink-0" />
              LinkedIn
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 border-l-4 border-l-accent transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <h4 className="m-0 mb-3 text-lg font-semibold text-foreground flex items-center gap-2">
            <Coffee size={18} />
            Support This App
          </h4>
          <p className="m-0 mb-3 leading-relaxed text-muted-foreground">
            This application is provided free of charge and is not affiliated with Jeremy&apos;s IT
            Lab. If you find this tool helpful, consider supporting my development work:
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => openExternal(PAYPAL_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              PayPal
            </button>
            <button
              onClick={() => openExternal(VENMO_URL)}
              className="flex items-center gap-2 px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground text-sm font-medium transition-all cursor-pointer font-[inherit] text-left hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)] active:translate-y-0 active:shadow-[0_2px_4px_hsl(var(--primary)/0.2)]"
            >
              Venmo
            </button>
          </div>
          <p className="!mt-3 text-sm text-accent font-medium italic m-0">
            All support is greatly appreciated but completely optional!
          </p>
        </div>

        <div className="bg-primary/8 border-l-4 border-primary rounded-xl p-5 mt-2">
          <p className="m-0 text-base text-foreground font-medium text-center">
            Thank you, Jeremy, for making quality networking education accessible to everyone!
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutTab;
