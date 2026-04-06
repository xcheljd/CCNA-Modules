/* eslint-env browser */
/* global CustomEvent */

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import themes from '../../utils/themes';

function ThemeTab() {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('app-theme') || 'spacegrayLight'
  );

  // Define the desired theme order
  const themeOrder = [
    'spacegrayLight',
    'spacegray',
    'spacegrayOceanic',
    'gruvboxLight',
    'gruvboxDark',
    'light',
    'dark',
    'nord',
    'rosePine',
    'mocha',
    'dracula',
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
    <div className="settings-tab-content">
      <h3>Theme</h3>
      <p className="tab-description">
        Choose a color theme that suits your preference and study environment.
      </p>

      <div className="theme-list">
        {orderedThemes.map(theme => (
          <div
            key={theme.id}
            className={`theme-list-item ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(theme.id)}
          >
            <div className="theme-content">
              <div className="theme-name-section">
                <span className="theme-name">{theme.name}</span>
              </div>

              <div className="theme-preview-compact">
                <span className="theme-icon">{theme.icon}</span>
                <div className="color-swatches-compact">
                  <div
                    className="color-swatch-compact"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <div
                    className="color-swatch-compact"
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                  />
                  <div
                    className="color-swatch-compact"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                  />
                </div>

                {currentTheme === theme.id && (
                  <div className="theme-active-indicator">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </div>

            <div className="theme-description">{theme.description}</div>
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
