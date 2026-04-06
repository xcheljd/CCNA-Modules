/* eslint-env browser */
/* global CustomEvent */

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import themes from '../../utils/themes';

function ThemeTab() {
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('app-theme') || 'light');

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
    <div className="settings-tab-content">
      <h3>Theme</h3>
      <p className="tab-description">
        Choose a color theme that suits your preference and study environment.
      </p>

      <div className="theme-grid">
        {Object.entries(themes).map(([themeId, theme]) => (
          <div
            key={themeId}
            className={`theme-card ${currentTheme === themeId ? 'active' : ''}`}
            onClick={() => handleThemeChange(themeId)}
          >
            <div className="theme-preview">
              <div className="theme-colors">
                <div
                  className="color-swatch primary"
                  style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                />
                <div
                  className="color-swatch secondary"
                  style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                />
                <div
                  className="color-swatch accent"
                  style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                />
              </div>
              <div className="theme-icon">{theme.icon}</div>
            </div>

            <div className="theme-info">
              <h4>{theme.name}</h4>
              <p>{theme.description}</p>
            </div>

            {currentTheme === themeId && (
              <div className="theme-selected">
                <Check size={16} />
                <span>Active</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="theme-note">
        <p>
          <strong>Note:</strong> Theme changes are applied immediately and saved automatically. You
          can switch themes anytime to find what works best for your study sessions.
        </p>
      </div>
    </div>
  );
}

export default ThemeTab;
