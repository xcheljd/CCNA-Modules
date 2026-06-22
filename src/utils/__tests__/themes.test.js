import themeColors from '../theme-colors.json';
import themes from '../themes';

// Guards against drift between the two sources of theme truth:
//   - theme-colors.json holds the color values (consumed by both the renderer
//     bundle and the loading-screen script via webpack's HtmlWebpackPlugin).
//   - themes.js holds the metadata (name, icon, description).
// If a theme key is added to one file but not the other, the ThemeTab and the
// loading screen will silently drop it. This test makes the mismatch fail CI.
describe('themes parity', () => {
  const colorKeys = Object.keys(themeColors).sort();
  const metaKeys = Object.keys(themes).sort();

  it('theme-colors.json and themes.js expose the same set of theme keys', () => {
    expect(colorKeys).toEqual(metaKeys);
  });

  it('exports exactly 14 themes (bump expected count if you add one)', () => {
    expect(colorKeys).toHaveLength(14);
  });

  it('every theme has a non-empty name, icon, and description', () => {
    for (const key of metaKeys) {
      const theme = themes[key];
      expect(typeof theme.name).toBe('string');
      expect(theme.name.length).toBeGreaterThan(0);
      expect(typeof theme.icon).toBe('string');
      expect(theme.icon.length).toBeGreaterThan(0);
      expect(typeof theme.description).toBe('string');
      expect(theme.description.length).toBeGreaterThan(0);
    }
  });

  it('every theme exposes a colors object that matches theme-colors.json', () => {
    for (const key of colorKeys) {
      expect(themes[key].colors).toEqual(themeColors[key]);
    }
  });
});
