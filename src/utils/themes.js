import themeColors from './theme-colors.json';

// Metadata (name, icon, description) for each theme. Color values live in
// theme-colors.json so they can be reused by both the renderer bundle and
// the loading-screen script injected via webpack's HtmlWebpackPlugin.
const themeMeta = {
  ayuLight: {
    name: 'Ayu Light',
    icon: '☀️',
    description: 'Clean, bright theme with warm accent colors from Ayu',
  },
  ayuDark: {
    name: 'Ayu Mirage',
    icon: '🌙',
    description: 'Dark theme with vibrant syntax colors inspired by twilight',
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    description: 'Cool blue tones for a professional feel',
  },
  neon: {
    name: 'Neon',
    icon: '⚡',
    description: 'Synthwave cyberpunk theme with vivid neon colors',
  },
  nord: {
    name: 'Nord',
    icon: '❄️',
    description: 'Arctic, north-bluish color palette inspired by the Aurora Borealis',
  },
  rosePine: {
    name: 'Rose Pine',
    icon: '🌹',
    description: 'Soho vibes with a soft, comfy palette for the classy minimalist',
  },
  mocha: {
    name: 'Catppuccin Mocha',
    icon: '😺',
    description: 'Soothing pastel theme with rich, warm colors perfect for night owls',
  },
  gruvboxDark: {
    name: 'Gruvbox Dark',
    icon: '🟤',
    description: 'Retro groove color scheme with warm, earthy tones',
  },
  gruvboxLight: {
    name: 'Gruvbox Light',
    icon: '🌾',
    description: 'Warm, retro light theme with earthy colors for daytime coding',
  },
  spacegray: {
    name: 'Spacegray',
    icon: '🌌',
    description: 'Hyperminimal dark theme with Base16 Ocean colors',
  },
  spacegrayLight: {
    name: 'Spacegray Light',
    icon: '🌥️',
    description: 'Minimal light theme with inverted Ocean colors',
  },
  spacegrayOceanic: {
    name: 'Spacegray Oceanic',
    icon: '🌊',
    description: 'Deep oceanic dark theme with cool blue-green tones',
  },
  dark: {
    name: 'Dark',
    icon: '🌙',
    description: 'Easy on the eyes dark theme for comfortable studying',
  },
  light: {
    name: 'Light',
    icon: '☀️',
    description: 'Clean, modern light theme with excellent readability',
  },
};

export const themes = {};
for (const [key, colors] of Object.entries(themeColors)) {
  themes[key] = {
    ...themeMeta[key],
    colors,
  };
}

export default themes;
