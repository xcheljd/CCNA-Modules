/* global CustomEvent */

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import themes from '../../utils/themes';

function ThemeTab() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('app-theme') || 'light');

  // Define the desired theme order
  const themeOrder = [
    'light',
    'dark',
    'ayuLight',
    'ayuDark',
    'spacegrayLight',
    'spacegray',
    'spacegrayOceanic',
    'gruvboxLight',
    'gruvboxDark',
    'ocean',
    'neon',
    'nord',
    'rosePine',
    'mocha',
  ];

  // Filter and map themes according to the desired order
  const orderedThemes = themeOrder
    .filter(themeId => themes[themeId]) // Ensure theme exists
    .map(themeId => ({
      id: themeId,
      ...themes[themeId],
    }));

  // Listen for theme changes to update the display
  useEffect(() => {
    const handleThemeChange = event => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const handleThemeChange = themeId => {
    // Just dispatch event - let App.js handle the theme application
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeId }));
  };

  return (
    <div>
      <h3 className="mt-0 mb-2 text-foreground">Theme</h3>
      <p className="text-muted-foreground mb-4">
        Choose a color theme that suits your preference and study environment.
      </p>

      <div className="flex flex-col gap-3 mt-6">
        {orderedThemes.map(theme => {
          const isActive = currentTheme === theme.id;
          return (
            <div
              key={theme.id}
              className={`flex flex-col px-5 py-4 border rounded-lg bg-card cursor-pointer transition-all min-h-[80px] ${
                isActive
                  ? 'border-primary bg-primary/10 border-l-4'
                  : 'border-border hover:border-primary hover:bg-accent/5'
              }`}
              onClick={() => handleThemeChange(theme.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-semibold text-base text-foreground">{theme.name}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xl opacity-80">{theme.icon}</span>
                  <div className="flex gap-1">
                    <div
                      className="w-5 h-5 rounded border border-border"
                      style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                    />
                    <div
                      className="w-5 h-5 rounded border border-border"
                      style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                    />
                    <div
                      className="w-5 h-5 rounded border border-border"
                      style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                    />
                  </div>

                  {isActive && (
                    <Badge className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full p-0 border-0 text-xs">
                      <Check size={14} />
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-1 text-sm text-muted-foreground leading-snug">
                {theme.description}
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="mt-8" />
      <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
        <p className="m-0 text-muted-foreground text-sm leading-relaxed">
          <strong>Note:</strong> Theme changes are applied immediately and saved automatically. You
          can switch themes anytime to find what works best for your study sessions.
        </p>
      </div>
    </div>
  );
}

export default ThemeTab;
