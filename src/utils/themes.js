// Theme definitions
export const themes = {
  ayuLight: {
    name: 'Ayu Light',
    icon: '☀️',
    description: 'Clean, bright theme with warm accent colors from Ayu',
    colors: {
      // Primary: Ayu accent (#FFAA33) - HSL: 37, 100%, 60%
      primary: '37 100% 60%',
      primaryForeground: '0 0% 98%',
      // Background: Ayu panel (#F3F4F5) - HSL: 210, 11%, 96% - softer on eyes
      background: '210 11% 96%',
      // Foreground: Ayu fg (#5C6166) - HSL: 210, 4%, 38%
      foreground: '210 4% 38%',
      // Card: Ayu panel bg (#F8F9FA) - HSL: 210, 17%, 98% - slightly lighter for contrast
      card: '210 17% 98%',
      cardForeground: '210 4% 38%',
      // Secondary: Ayu panel (#F3F4F5) - HSL: 210, 11%, 96%
      secondary: '210 11% 96%',
      secondaryForeground: '210 4% 38%',
      // Muted: slightly darker panel
      muted: '210 11% 96%',
      // Muted foreground: Ayu UI fg (#8A9199) - HSL: 210, 8%, 56%
      mutedForeground: '210 8% 56%',
      // Accent: Ayu keyword (#FA8D3E) - HSL: 23, 95%, 61%
      accent: '23 95% 61%',
      accentForeground: '0 0% 98%',
      // Destructive: Ayu error (#E65050) - HSL: 0, 73%, 61%
      destructive: '0 73% 61%',
      destructiveForeground: '0 0% 98%',
      // Border: light gray
      border: '210 11% 90%',
      input: '210 11% 90%',
      // Ring: Ayu accent
      ring: '37 100% 60%',
      radius: '0.5rem',
      // Surface area colors
      header: '210 17% 98%',
      headerForeground: '210 4% 38%',
      loading: '37 100% 60%',
      loadingForeground: '0 0% 98%',
      sidebar: '210 17% 98%',
      sidebarForeground: '210 4% 38%',
      // Progress colors using Ayu palette
      colorProgressEmpty: '#E5E7E9',
      colorProgressLow: '#FA8D3E', // keyword/operator
      colorProgressMedium: '#55B4D4', // tag
      colorProgressComplete: '#6CBF43', // vcs added
      // Confidence colors using Ayu palette
      colorConfidenceNone: '#E5E7E9',
      colorConfidenceLow: '#E65050', // error
      colorConfidenceMedium: '#F2AE49', // func
      colorConfidenceOkay: '#FFAA33', // accent
      colorConfidenceHigh: '#86B300', // string
      colorConfidenceMastered: '#399EE6', // entity
      colorChartBackground: '#F8F9FA',
      colorChartBorder: '#E5E7E9',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  ayuDark: {
    name: 'Ayu Mirage',
    icon: '🌙',
    description: 'Dark theme with vibrant syntax colors inspired by twilight',
    colors: {
      // Primary: Ayu accent (#FFCC66) - HSL: 40, 100%, 70%
      primary: '40 100% 70%',
      primaryForeground: '216 19% 16%', // bg
      // Background: Ayu bg (#242936) - HSL: 216, 19%, 16%
      background: '216 19% 16%',
      // Foreground: Ayu fg (#CCCAC2) - HSL: 40, 11%, 78%
      foreground: '40 11% 78%',
      // Card: Ayu panel bg (#1F2430) - HSL: 220, 19%, 14%
      card: '220 19% 14%',
      cardForeground: '40 11% 78%',
      // Secondary: Ayu line (#1A1F29) - HSL: 218, 20%, 12%
      secondary: '218 20% 12%',
      secondaryForeground: '40 11% 78%',
      // Muted: same as secondary
      muted: '218 20% 12%',
      // Muted foreground: Ayu UI fg (#707A8C) - HSL: 216, 11%, 49%
      mutedForeground: '216 11% 49%',
      // Accent: Ayu tag (#5CCFE6) - HSL: 191, 73%, 63%
      accent: '191 73% 63%',
      accentForeground: '216 19% 16%',
      // Destructive: Ayu error (#FF6666) - HSL: 0, 100%, 70%
      destructive: '0 100% 70%',
      destructiveForeground: '0 0% 98%',
      // Border: slightly lighter than bg
      border: '216 15% 26%',
      input: '218 20% 12%',
      // Ring: Ayu accent
      ring: '40 100% 70%',
      radius: '0.5rem',
      // Surface area colors
      header: '220 19% 14%',
      headerForeground: '40 11% 78%',
      loading: '40 100% 70%',
      loadingForeground: '216 19% 16%',
      sidebar: '220 19% 14%',
      sidebarForeground: '40 11% 78%',
      // Progress colors using Ayu Mirage palette
      colorProgressEmpty: '#2A303D',
      colorProgressLow: '#FFAD66', // keyword
      colorProgressMedium: '#5CCFE6', // tag
      colorProgressComplete: '#87D96C', // vcs added
      // Confidence colors using Ayu Mirage palette
      colorConfidenceNone: '#2A303D',
      colorConfidenceLow: '#FF6666', // error
      colorConfidenceMedium: '#FFD173', // func
      colorConfidenceOkay: '#FFCC66', // accent
      colorConfidenceHigh: '#D5FF80', // string
      colorConfidenceMastered: '#73D0FF', // entity
      colorChartBackground: '#1C212B',
      colorChartBorder: '#2A303D',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  ocean: {
    name: 'Ocean',
    icon: '🌊',
    description: 'Cool blue tones for a professional feel',
    colors: {
      primary: '200 100% 45%',
      primaryForeground: '0 0% 98%',
      background: '220 30% 8%',
      foreground: '0 0% 85%',
      card: '220 25% 12%',
      cardForeground: '0 0% 80%',
      secondary: '220 20% 18%',
      secondaryForeground: '0 0% 70%',
      muted: '220 15% 22%',
      mutedForeground: '0 0% 65%',
      accent: '195 80% 55%',
      accentForeground: '0 0% 100%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '220 15% 28%',
      input: '220 15% 20%',
      ring: '200 100% 45%',
      radius: '0.5rem',
      // Surface area colors
      header: '220 25% 12%',
      headerForeground: '0 0% 85%',
      loading: '200 100% 45%',
      loadingForeground: '0 0% 98%',
      sidebar: '220 25% 12%',
      sidebarForeground: '0 0% 80%',
      colorProgressEmpty: '#2a3d4a',
      colorProgressLow: '#ff8a65',
      colorProgressMedium: '#4fc3f7',
      colorProgressComplete: '#4db6ac',
      colorConfidenceNone: '#2a3d4a',
      colorConfidenceLow: '#ff7043',
      colorConfidenceMedium: '#ff8a65',
      colorConfidenceOkay: '#ffb74d',
      colorConfidenceHigh: '#4db6ac',
      colorConfidenceMastered: '#4fc3f7',
      colorChartBackground: '#0a1520',
      colorChartBorder: '#2a3d4a',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  neon: {
    name: 'Neon',
    icon: '⚡',
    description: 'Synthwave cyberpunk theme with vivid neon colors',
    colors: {
      primary: '189 87% 45%',
      primaryForeground: '0 0% 5%',
      background: '256 40% 6%',
      foreground: '189 70% 80%',
      card: '256 40% 4%',
      cardForeground: '189 60% 75%',
      secondary: '256 40% 8%',
      secondaryForeground: '189 70% 75%',
      muted: '256 40% 10%',
      mutedForeground: '189 40% 55%',
      accent: '189 87% 45%',
      accentForeground: '0 0% 5%',
      destructive: '16 98% 63%',
      destructiveForeground: '0 0% 100%',
      border: '189 70% 30%',
      input: '256 40% 10%',
      ring: '189 87% 48%',
      radius: '0.375rem',
      // Surface area colors (dark header with cyan text - eliminates CSS override)
      header: '256 40% 4%',
      headerForeground: '189 70% 80%',
      loading: '189 87% 45%',
      loadingForeground: '0 0% 5%',
      sidebar: '256 40% 4%',
      sidebarForeground: '189 60% 75%',
      colorProgressEmpty: '#0f0f1a',
      colorProgressLow: '#1ECDE6',
      colorProgressMedium: '#1ECDE6',
      colorProgressComplete: '#2DB83D',
      colorConfidenceNone: '#0f0f1a',
      colorConfidenceLow: '#FB7443',
      colorConfidenceMedium: '#861CFF',
      colorConfidenceOkay: '#221EB8',
      colorConfidenceHigh: '#1ECDE6',
      colorConfidenceMastered: '#2DB83D',
      colorChartBackground: '#0a0a15',
      colorChartBorder: '#189AB4',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  nord: {
    name: 'Nord',
    icon: '❄️',
    description: 'Arctic, north-bluish color palette inspired by the Aurora Borealis',
    colors: {
      // Primary: Nord10 (Frost) (#5E81AC) - HSL: 213, 32%, 52%
      primary: '213 32% 52%',
      // Primary text on primary background uses Snow Storm
      primaryForeground: '218 27% 94%', // nord6
      // Background: Nord0 (Polar Night) (#2E3440) - HSL: 220, 16%, 22%
      background: '220 16% 22%',
      // Foreground: Nord4 (Snow Storm) (#D8DEE9) - HSL: 219, 28%, 88%
      foreground: '219 28% 88%',
      // Card: Nord1 (Polar Night) (#3B4252) - HSL: 222, 16%, 28%
      card: '222 16% 28%',
      cardForeground: '219 28% 88%', // nord4
      // Secondary: Nord2 (Polar Night) (#434C5E) - HSL: 220, 17%, 32%
      secondary: '220 17% 32%',
      secondaryForeground: '219 28% 88%', // nord4
      // Muted: Nord3 (Polar Night) (#4C566A) - HSL: 220, 16%, 36%
      muted: '220 17% 32%', // nord2
      mutedForeground: '229 10% 55%', // Nord overlay 0 - FIXED: was too bright
      // Accent: Nord8 (Frost) (#88C0D0) - HSL: 193, 43%, 67%
      accent: '193 43% 67%',
      accentForeground: '220 16% 22%', // nord0
      // Destructive: Nord11 (Aurora - Red) (#BF616A) - HSL: 354, 42%, 56%
      destructive: '354 42% 56%',
      destructiveForeground: '218 27% 94%', // nord6
      // Border: Nord3 (Polar Night)
      border: '220 16% 36%',
      // Input: Nord2 (Polar Night)
      input: '220 17% 32%',
      // Ring: Nord9 (Frost) (#81A1C1) - HSL: 210, 34%, 63%
      ring: '210 34% 63%',
      radius: '0.5rem',
      // Surface area colors
      header: '222 16% 28%',
      headerForeground: '219 28% 88%',
      loading: '213 32% 52%',
      loadingForeground: '218 27% 94%',
      sidebar: '222 16% 28%',
      sidebarForeground: '219 28% 88%',
      // Progress colors using Nord Aurora palette
      colorProgressEmpty: '#4c566a', // nord3 - Polar Night
      colorProgressLow: '#ebcb8b', // nord13 - Aurora Yellow
      colorProgressMedium: '#88c0d0', // nord8 - Frost Cyan
      colorProgressComplete: '#a3be8c', // nord14 - Aurora Green
      // Confidence colors using Nord Aurora palette
      colorConfidenceNone: '#4c566a', // nord3 - Polar Night
      colorConfidenceLow: '#bf616a', // nord11 - Aurora Red
      colorConfidenceMedium: '#d08770', // nord12 - Aurora Orange
      colorConfidenceOkay: '#ebcb8b', // nord13 - Aurora Yellow
      colorConfidenceHigh: '#a3be8c', // nord14 - Aurora Green
      colorConfidenceMastered: '#8fbcbb', // nord7 - Frost Teal
      colorChartBackground: '#2E3440',
      colorChartBorder: '#4C566A',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  rosePine: {
    name: 'Rose Pine',
    icon: '🌹',
    description: 'Soho vibes with a soft, comfy palette for the classy minimalist',
    colors: {
      // Primary: Rose Dawn (#D7827E) - HSL: 4, 54%, 67%
      primary: '4 54% 67%',
      primaryForeground: '249 22% 12%', // base
      // Background: Base (#191724) - HSL: 249, 22%, 12%
      background: '249 22% 12%',
      // Foreground: Text (#E0DEF4) - HSL: 245, 50%, 91%
      foreground: '245 50% 91%',
      // Card: Surface (#1F1D2E) - HSL: 246, 24%, 15%
      card: '246 24% 15%',
      cardForeground: '245 50% 91%', // text
      // Secondary: Overlay (#26233A) - HSL: 248, 25%, 18%
      secondary: '248 25% 18%',
      secondaryForeground: '245 50% 91%', // text
      // Muted: Overlay
      muted: '248 25% 18%', // overlay
      mutedForeground: '257 9% 61%', // subtle (#908CAA)
      // Accent: Iris (#C4A7E7) - HSL: 267, 57%, 78%
      accent: '267 57% 78%',
      accentForeground: '249 22% 12%', // base
      // Destructive: Love (#EB6F92) - HSL: 343, 76%, 68%
      destructive: '343 76% 68%',
      destructiveForeground: '245 50% 91%', // text
      // Border: Highlight Med (#403D52) - HSL: 248, 15%, 28%
      border: '248 15% 28%',
      input: '248 25% 18%', // overlay
      // Ring: Iris (#C4A7E7) - HSL: 267, 57%, 78%
      ring: '267 57% 78%',
      radius: '0.5rem',
      // Surface area colors
      header: '246 24% 15%',
      headerForeground: '245 50% 91%',
      loading: '4 54% 67%',
      loadingForeground: '249 22% 12%',
      sidebar: '246 24% 15%',
      sidebarForeground: '245 50% 91%',
      // Progress colors using Rose Pine palette
      colorProgressEmpty: '#26233a', // overlay
      colorProgressLow: '#c4a7e7', // iris
      colorProgressMedium: '#286983', // pine (dawn variant)
      colorProgressComplete: '#31748f', // pine
      // Confidence colors using Rose Pine palette
      colorConfidenceNone: '#26233a', // overlay
      colorConfidenceLow: '#eb6f92', // love
      colorConfidenceMedium: '#f6c177', // gold
      colorConfidenceOkay: '#ebbcba', // rose
      colorConfidenceHigh: '#9ccfd8', // foam
      colorConfidenceMastered: '#c4a7e7', // iris
      colorChartBackground: '#1f1d2e',
      colorChartBorder: '#403d52',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#fff',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  mocha: {
    name: 'Catppuccin Mocha',
    icon: '😺',
    description: 'Soothing pastel theme with rich, warm colors perfect for night owls',
    colors: {
      // Primary: Mauve (#CBA6F7) - HSL: 267, 84%, 81%
      primary: '267 84% 81%',
      primaryForeground: '240 21% 15%', // base
      // Background: Base (#1E1E2E) - HSL: 240, 21%, 15%
      background: '240 21% 15%',
      // Foreground: Text (#CDD6F4) - HSL: 227, 68%, 88%
      foreground: '227 68% 88%',
      // Card: Surface 0 (#313244) - HSL: 237, 16%, 23%
      card: '237 16% 23%',
      cardForeground: '227 68% 88%',
      // Secondary: Surface 1 (#45475A) - HSL: 235, 12%, 32%
      secondary: '235 12% 32%',
      secondaryForeground: '227 68% 88%',
      // Muted: Surface 2 (#585B70) - HSL: 233, 12%, 39%
      muted: '233 12% 39%',
      // Muted foreground: Overlay 0 (#6C7086) - HSL: 229, 10%, 48%
      mutedForeground: '229 10% 48%',
      // Accent: Blue (#89B4FA) - HSL: 217, 92%, 76%
      accent: '217 92% 76%',
      accentForeground: '240 21% 15%',
      // Destructive: Red (#F38BA8) - HSL: 343, 81%, 75%
      destructive: '343 81% 75%',
      destructiveForeground: '227 68% 88%',
      // Border: Surface 2
      border: '233 12% 39%',
      input: '235 12% 32%',
      // Ring: Mauve
      ring: '267 84% 81%',
      radius: '0.5rem',
      // Surface area colors
      header: '237 16% 23%',
      headerForeground: '227 68% 88%',
      loading: '267 84% 81%',
      loadingForeground: '240 21% 15%',
      sidebar: '237 16% 23%',
      sidebarForeground: '227 68% 88%',
      // Progress colors using Catppuccin Mocha palette
      colorProgressEmpty: '#45475a', // surface1
      colorProgressLow: '#fab387', // peach
      colorProgressMedium: '#89b4fa', // blue
      colorProgressComplete: '#a6e3a1', // green
      // Confidence colors using Catppuccin Mocha palette
      colorConfidenceNone: '#45475a', // surface1
      colorConfidenceLow: '#f38ba8', // red
      colorConfidenceMedium: '#fab387', // peach
      colorConfidenceOkay: '#f9e2af', // yellow
      colorConfidenceHigh: '#a6e3a1', // green
      colorConfidenceMastered: '#89b4fa', // blue
      colorChartBackground: '#1e1e2e', // base
      colorChartBorder: '#313244', // surface0
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  gruvboxDark: {
    name: 'Gruvbox Dark',
    icon: '🟤',
    description: 'Retro groove color scheme with warm, earthy tones',
    colors: {
      // Primary: Bright Orange (#FE8019) - HSL: 25, 99%, 55%
      primary: '25 99% 55%',
      primaryForeground: '0 0% 98%',
      // Background: dark0 (#282828) - HSL: 0, 0%, 16%
      background: '0 0% 16%',
      // Foreground: light1 (#EBDBB2) - HSL: 39, 43%, 80%
      foreground: '39 43% 80%',
      // Card: dark1 (#3C3836) - HSL: 20, 4%, 22%
      card: '20 4% 22%',
      cardForeground: '39 43% 80%',
      // Secondary: dark2 (#504945) - HSL: 15, 6%, 29%
      secondary: '15 6% 29%',
      secondaryForeground: '39 43% 80%',
      // Muted: dark3 (#665C54) - HSL: 21, 9%, 37%
      muted: '21 9% 37%',
      // Muted foreground: light4 (#A89984) - HSL: 36, 15%, 59%
      mutedForeground: '36 15% 59%',
      // Accent: Bright Aqua (#8EC07C) - HSL: 104, 41%, 64%
      accent: '104 41% 64%',
      accentForeground: '0 0% 16%',
      // Destructive: Bright Red (#FB4934) - HSL: 4, 95%, 59%
      destructive: '4 95% 59%',
      destructiveForeground: '0 0% 98%',
      // Border: dark3
      border: '21 9% 37%',
      input: '15 6% 29%',
      // Ring: Bright Orange
      ring: '25 99% 55%',
      radius: '0.5rem',
      // Surface area colors
      header: '20 4% 22%',
      headerForeground: '39 43% 80%',
      loading: '25 99% 55%',
      loadingForeground: '0 0% 98%',
      sidebar: '20 4% 22%',
      sidebarForeground: '39 43% 80%',
      // Progress colors using Gruvbox palette
      colorProgressEmpty: '#504945', // dark2
      colorProgressLow: '#fabd2f', // bright_yellow
      colorProgressMedium: '#83a598', // bright_blue
      colorProgressComplete: '#b8bb26', // bright_green
      // Confidence colors using Gruvbox palette
      colorConfidenceNone: '#504945', // dark2
      colorConfidenceLow: '#fb4934', // bright_red
      colorConfidenceMedium: '#fe8019', // bright_orange
      colorConfidenceOkay: '#fabd2f', // bright_yellow
      colorConfidenceHigh: '#b8bb26', // bright_green
      colorConfidenceMastered: '#8ec07c', // bright_aqua
      colorChartBackground: '#282828', // dark0
      colorChartBorder: '#3c3836', // dark1
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  gruvboxLight: {
    name: 'Gruvbox Light',
    icon: '🌾',
    description: 'Warm, retro light theme with earthy colors for daytime coding',
    colors: {
      // Primary: Neutral Orange (#D65D0E) - HSL: 20, 93%, 44%
      primary: '20 93% 44%',
      primaryForeground: '0 0% 98%',
      // Background: light0 (#FBF1C7) - HSL: 48, 87%, 88%
      background: '48 87% 88%',
      // Foreground: dark1 (#3C3836) - HSL: 20, 4%, 22%
      foreground: '20 4% 22%',
      // Card: light0_hard (#F9F5D7) - HSL: 49, 56%, 91%
      card: '49 56% 91%',
      cardForeground: '20 4% 22%',
      // Secondary: light1 (#EBDBB2) - HSL: 39, 43%, 80%
      secondary: '39 43% 80%',
      secondaryForeground: '20 4% 22%',
      // Muted: light2 (#D5C4A1) - HSL: 40, 38%, 73%
      muted: '40 38% 73%',
      // Muted foreground: dark4 (#7C6F64) - HSL: 22, 11%, 44%
      mutedForeground: '22 11% 44%',
      // Accent: Neutral Aqua (#689D6A) - HSL: 125, 25%, 51%
      accent: '125 25% 51%',
      accentForeground: '0 0% 98%',
      // Destructive: Neutral Red (#CC241D) - HSL: 2, 75%, 46%
      destructive: '2 75% 46%',
      destructiveForeground: '0 0% 98%',
      // Border: light2
      border: '40 38% 73%',
      input: '39 43% 80%',
      // Ring: Neutral Orange
      ring: '20 93% 44%',
      radius: '0.5rem',
      // Surface area colors
      header: '49 56% 91%',
      headerForeground: '20 4% 22%',
      loading: '20 93% 44%',
      loadingForeground: '0 0% 98%',
      sidebar: '39 43% 80%',
      sidebarForeground: '20 4% 22%',
      // Progress colors using Gruvbox light palette
      colorProgressEmpty: '#D5C4A1', // light2
      colorProgressLow: '#d79921', // neutral_yellow
      colorProgressMedium: '#458588', // neutral_blue
      colorProgressComplete: '#98971a', // neutral_green
      // Confidence colors using Gruvbox light palette
      colorConfidenceNone: '#D5C4A1', // light2
      colorConfidenceLow: '#cc241d', // neutral_red
      colorConfidenceMedium: '#d65d0e', // neutral_orange
      colorConfidenceOkay: '#d79921', // neutral_yellow
      colorConfidenceHigh: '#98971a', // neutral_green
      colorConfidenceMastered: '#689d6a', // neutral_aqua
      colorChartBackground: '#F9F5D7', // light0_hard
      colorChartBorder: '#EBDBB2', // light1
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#fff',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#fff',
      colorConfidenceTextOnHigh: '#fff',
    },
  },
  spacegray: {
    name: 'Spacegray',
    icon: '🌌',
    description: 'Hyperminimal dark theme with Base16 Ocean colors',
    colors: {
      // Primary: Base0D Blue (#8FA1B3) - HSL: 206, 24%, 63%
      primary: '206 24% 63%',
      primaryForeground: '0 0% 98%',
      // Background: base00 (#2B303B) - HSL: 214, 14%, 20%
      background: '214 14% 20%',
      // Foreground: base05 (#C0C5CE) - HSL: 214, 16%, 78%
      foreground: '214 16% 78%',
      // Card: base01 (#343D46) - HSL: 209, 15%, 25%
      card: '209 15% 25%',
      cardForeground: '214 16% 78%',
      // Secondary: base02 (#4F5B66) - HSL: 207, 13%, 36%
      secondary: '207 13% 36%',
      secondaryForeground: '214 16% 78%',
      // Muted: base03 (#65737E) - HSL: 207, 11%, 45%
      muted: '207 11% 45%',
      // Muted foreground: base04 (#A7ADBA) - HSL: 214, 11%, 69%
      mutedForeground: '214 11% 69%',
      // Accent: Base0C Cyan (#96B5B4) - HSL: 178, 20%, 65%
      accent: '178 20% 65%',
      accentForeground: '214 14% 20%',
      // Destructive: Base08 Red (#BF616A) - HSL: 354, 42%, 56%
      destructive: '354 42% 56%',
      destructiveForeground: '0 0% 98%',
      // Border: base02
      border: '207 13% 36%',
      input: '207 13% 36%',
      // Ring: Base0D
      ring: '206 24% 63%',
      radius: '0.5rem',
      // Surface area colors
      header: '209 15% 25%',
      headerForeground: '214 16% 78%',
      loading: '206 24% 63%',
      loadingForeground: '0 0% 98%',
      sidebar: '209 15% 25%',
      sidebarForeground: '214 16% 78%',
      // Progress colors using Base16 Ocean
      colorProgressEmpty: '#4F5B66', // base02
      colorProgressLow: '#EBCB8B', // base0A yellow
      colorProgressMedium: '#8FA1B3', // base0D blue
      colorProgressComplete: '#A3BE8C', // base0B green
      // Confidence colors using Base16 Ocean
      colorConfidenceNone: '#4F5B66', // base02
      colorConfidenceLow: '#BF616A', // base08 red
      colorConfidenceMedium: '#D08770', // base09 orange
      colorConfidenceOkay: '#EBCB8B', // base0A yellow
      colorConfidenceHigh: '#A3BE8C', // base0B green
      colorConfidenceMastered: '#8FA1B3', // base0D blue
      colorChartBackground: '#2B303B', // base00
      colorChartBorder: '#343D46', // base01
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  spacegrayLight: {
    name: 'Spacegray Light',
    icon: '🌥️',
    description: 'Minimal light theme with inverted Ocean colors',
    colors: {
      // Primary: Base0D Blue (#8FA1B3) - HSL: 206, 24%, 63%
      primary: '206 24% 63%',
      primaryForeground: '0 0% 98%',
      // Background: base07 (#EFF1F5) - HSL: 218, 27%, 95%
      background: '218 27% 95%',
      // Foreground: base02 (#4F5B66) - HSL: 207, 13%, 36%
      foreground: '207 13% 36%',
      // Card: base06 (#DFE1E8) - HSL: 225, 18%, 90%
      card: '225 18% 90%',
      cardForeground: '207 13% 36%',
      // Secondary: base05 (#C0C5CE) - HSL: 214, 16%, 78%
      secondary: '214 16% 78%',
      secondaryForeground: '207 13% 36%',
      // Muted: base04 (#A7ADBA) - HSL: 214, 11%, 69%
      muted: '214 11% 69%',
      // Muted foreground: base03 (#65737E) - HSL: 207, 11%, 45%
      mutedForeground: '207 11% 45%',
      // Accent: Base0C Cyan (#96B5B4) - HSL: 178, 20%, 65%
      accent: '178 20% 65%',
      accentForeground: '0 0% 98%',
      // Destructive: Base08 Red (#BF616A) - HSL: 354, 42%, 56%
      destructive: '354 42% 56%',
      destructiveForeground: '0 0% 98%',
      // Border: base05
      border: '214 16% 78%',
      input: '214 16% 78%',
      // Ring: Base0D
      ring: '206 24% 63%',
      radius: '0.5rem',
      // Surface area colors
      header: '218 27% 95%',
      headerForeground: '207 13% 36%',
      loading: '206 24% 63%',
      loadingForeground: '0 0% 98%',
      sidebar: '225 18% 90%',
      sidebarForeground: '207 13% 36%',
      // Progress colors using Base16 Ocean
      colorProgressEmpty: '#C0C5CE', // base05
      colorProgressLow: '#D08770', // base09 orange
      colorProgressMedium: '#8FA1B3', // base0D blue
      colorProgressComplete: '#A3BE8C', // base0B green
      // Confidence colors using Base16 Ocean
      colorConfidenceNone: '#C0C5CE', // base05
      colorConfidenceLow: '#BF616A', // base08 red
      colorConfidenceMedium: '#D08770', // base09 orange
      colorConfidenceOkay: '#EBCB8B', // base0A yellow
      colorConfidenceHigh: '#A3BE8C', // base0B green
      colorConfidenceMastered: '#8FA1B3', // base0D blue
      colorChartBackground: '#EFF1F5', // base07
      colorChartBorder: '#DFE1E8', // base06
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },

  spacegrayOceanic: {
    name: 'Spacegray Oceanic',
    icon: '🌊',
    description: 'Deep oceanic dark theme with cool blue-green tones',
    colors: {
      // Primary: Base0D Blue (#6699CC) - HSL: 210, 50%, 60%
      primary: '210 50% 60%',
      primaryForeground: '0 0% 98%',
      // Background: base00 (#1B2B34) - HSL: 203, 30%, 15%
      background: '203 30% 15%',
      // Foreground: base05 (#C0C5CE) - HSL: 214, 16%, 78%
      foreground: '214 16% 78%',
      // Card: base01 (#343D46) - HSL: 209, 15%, 25%
      card: '209 15% 25%',
      cardForeground: '214 16% 78%',
      // Secondary: base02 (#4F5B66) - HSL: 207, 13%, 36%
      secondary: '207 13% 36%',
      secondaryForeground: '214 16% 78%',
      // Muted: base03 (#65737E) - HSL: 207, 11%, 45%
      muted: '207 11% 45%',
      // Muted foreground: base04 (#A7ADBA) - HSL: 214, 11%, 69%
      mutedForeground: '214 11% 69%',
      // Accent: Base0C Teal (#5FB3B3) - HSL: 180, 35%, 53%
      accent: '180 35% 53%',
      accentForeground: '0 0% 98%',
      // Destructive: Base08 Red (#EC5f67) - HSL: 356, 79%, 65%
      destructive: '356 79% 65%',
      destructiveForeground: '0 0% 98%',
      // Border: base02
      border: '207 13% 36%',
      input: '207 13% 36%',
      // Ring: Base0D
      ring: '210 50% 60%',
      radius: '0.5rem',
      // Surface area colors
      header: '209 15% 25%',
      headerForeground: '214 16% 78%',
      loading: '210 50% 60%',
      loadingForeground: '0 0% 98%',
      sidebar: '209 15% 25%',
      sidebarForeground: '214 16% 78%',
      // Progress colors using Base16 OceanicNext
      colorProgressEmpty: '#4F5B66', // base02
      colorProgressLow: '#FAC863', // base0A yellow
      colorProgressMedium: '#6699CC', // base0D blue
      colorProgressComplete: '#99C794', // base0B green
      // Confidence colors using Base16 OceanicNext
      colorConfidenceNone: '#4F5B66', // base02
      colorConfidenceLow: '#EC5f67', // base08 red
      colorConfidenceMedium: '#F99157', // base09 orange
      colorConfidenceOkay: '#FAC863', // base0A yellow
      colorConfidenceHigh: '#99C794', // base0B green
      colorConfidenceMastered: '#6699CC', // base0D blue
      colorChartBackground: '#1B2B34', // base00
      colorChartBorder: '#343D46', // base01
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  dark: {
    name: 'Dark',
    icon: '🌙',
    description: 'Easy on the eyes dark theme for comfortable studying',
    colors: {
      // Primary: GitHub blue (#58a6ff) - HSL: 212, 100%, 68%
      primary: '212 100% 68%',
      primaryForeground: '215 28% 7%',
      // Background: GitHub canvas default (#0d1117) - HSL: 215, 28%, 7%
      background: '215 28% 7%',
      // Foreground: GitHub fg default (#e6edf3) - HSL: 213, 31%, 91%
      foreground: '213 31% 91%',
      // Card: GitHub canvas overlay (#161b22) - HSL: 213, 17%, 12%
      card: '213 17% 12%',
      cardForeground: '213 31% 91%',
      // Secondary: GitHub gray-7 (#30363d) - HSL: 213, 12%, 21%
      secondary: '213 12% 21%',
      secondaryForeground: '213 31% 91%',
      // Muted: same as secondary
      muted: '213 12% 21%',
      // Muted foreground: GitHub gray-5 (#6e7681) - HSL: 213, 11%, 46%
      mutedForeground: '213 11% 46%',
      // Accent: GitHub accent emphasis (#2f81f7) - HSL: 217, 92%, 58%
      accent: '217 92% 58%',
      accentForeground: '0 0% 100%',
      // Destructive: GitHub danger (#f85149) - HSL: 2, 93%, 64%
      destructive: '2 93% 64%',
      destructiveForeground: '0 0% 100%',
      // Border: GitHub border default (#30363d)
      border: '213 12% 21%',
      input: '213 12% 21%',
      // Ring: GitHub blue
      ring: '212 100% 68%',
      radius: '0.5rem',
      // Surface area colors
      header: '213 17% 12%',
      headerForeground: '213 31% 91%',
      loading: '212 100% 68%',
      loadingForeground: '215 28% 7%',
      sidebar: '213 17% 12%',
      sidebarForeground: '213 31% 91%',
      // Progress colors using GitHub dark palette
      colorProgressEmpty: '#21262d',
      colorProgressLow: '#f0883e', // orange-4
      colorProgressMedium: '#58a6ff', // blue-4
      colorProgressComplete: '#3fb950', // green-4
      // Confidence colors using GitHub dark palette
      colorConfidenceNone: '#21262d',
      colorConfidenceLow: '#f85149', // red-5
      colorConfidenceMedium: '#f0883e', // orange-4
      colorConfidenceOkay: '#d29922', // yellow-4
      colorConfidenceHigh: '#56d364', // green-3
      colorConfidenceMastered: '#58a6ff', // blue-4
      colorChartBackground: '#161b22',
      colorChartBorder: '#30363d',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#000',
      colorProgressTextOnMedium: '#000',
      colorProgressTextOnComplete: '#000',
      colorConfidenceTextOnLow: '#000',
      colorConfidenceTextOnMedium: '#000',
      colorConfidenceTextOnHigh: '#000',
    },
  },
  light: {
    name: 'Light',
    icon: '☀️',
    description: 'Clean, modern light theme with excellent readability',
    colors: {
      // Primary: GitHub blue (#0969da) - HSL: 212, 93%, 45%
      primary: '212 93% 45%',
      primaryForeground: '0 0% 100%',
      // Background: GitHub canvas default (#ffffff) - HSL: 0, 0%, 100%
      background: '0 0% 100%',
      // Foreground: GitHub fg default (#24292f) - HSL: 210, 11%, 17%
      foreground: '210 11% 17%',
      // Card: GitHub canvas subtle (#f6f8fa) - HSL: 210, 22%, 97%
      card: '210 22% 97%',
      cardForeground: '210 11% 17%',
      // Secondary: GitHub gray-2 (#eaeef2) - HSL: 213, 23%, 94%
      secondary: '213 23% 94%',
      secondaryForeground: '210 11% 17%',
      // Muted: same as secondary
      muted: '213 23% 94%',
      // Muted foreground: GitHub gray-6 (#6e7781) - HSL: 213, 11%, 46%
      mutedForeground: '213 11% 46%',
      // Accent: GitHub blue (#0969da) - HSL: 212, 93%, 45%
      accent: '212 93% 45%',
      accentForeground: '0 0% 100%',
      // Destructive: GitHub danger (#cf222e) - HSL: 356, 72%, 47%
      destructive: '356 72% 47%',
      destructiveForeground: '0 0% 100%',
      // Border: GitHub border default (#d0d7de)
      border: '213 14% 86%',
      input: '213 14% 86%',
      // Ring: GitHub blue
      ring: '212 93% 45%',
      radius: '0.5rem',
      // Surface area colors
      header: '212 93% 45%',
      headerForeground: '0 0% 100%',
      loading: '212 93% 45%',
      loadingForeground: '0 0% 100%',
      sidebar: '210 22% 97%',
      sidebarForeground: '210 11% 17%',
      // Progress colors using GitHub light palette
      colorProgressEmpty: '#eaeef2',
      colorProgressLow: '#e16f24', // orange-5
      colorProgressMedium: '#0969da', // blue-6
      colorProgressComplete: '#1a7f37', // green-6
      // Confidence colors using GitHub light palette
      colorConfidenceNone: '#eaeef2',
      colorConfidenceLow: '#cf222e', // red-6
      colorConfidenceMedium: '#e16f24', // orange-5
      colorConfidenceOkay: '#9a6700', // yellow-6
      colorConfidenceHigh: '#1a7f37', // green-6
      colorConfidenceMastered: '#0969da', // blue-6
      colorChartBackground: '#f6f8fa',
      colorChartBorder: '#d0d7de',
      // Text colors for displaying on colored backgrounds
      colorProgressTextOnLow: '#fff',
      colorProgressTextOnMedium: '#fff',
      colorProgressTextOnComplete: '#fff',
      colorConfidenceTextOnLow: '#fff',
      colorConfidenceTextOnMedium: '#fff',
      colorConfidenceTextOnHigh: '#fff',
    },
  },
};

export default themes;
