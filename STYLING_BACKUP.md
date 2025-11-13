# CCNA Modules Styling Backup & Rollback Guide

**Created**: November 13, 2025
**Purpose**: Complete reference for pre-shadcn/ui styling system
**Backup Location**: `src/styles.backup/` directory + `backup/pre-shadcn-ui` git branch

---

## Table of Contents
1. [Current Styling Architecture](#current-styling-architecture)
2. [CSS Files Documentation](#css-files-documentation)
3. [Color Scheme & Design Tokens](#color-scheme--design-tokens)
4. [Dark Mode Implementation](#dark-mode-implementation)
5. [Component Styling Details](#component-styling-details)
6. [Rollback Instructions](#rollback-instructions)

---

## Current Styling Architecture

### Approach
- **CSS Modules**: Each component has its own `.css` file
- **Import Method**: CSS files imported directly in component files
- **Global Styles**: `global.css` defines base styles
- **Dark Mode**: Class-based (`.dark-mode`) with CSS overrides

### File Structure
```
src/
├── styles/
│   ├── global.css              # Base styles, resets, fonts
│   ├── App.css                 # App container, header, menu
│   ├── LoadingScreen.css       # Loading animation
│   ├── ModuleList.css          # Module grid, cards, search
│   ├── ModuleDetail.css        # Module detail view, layout
│   ├── VideoCard.css           # Video cards, checkboxes
│   ├── SearchBar.css           # Search input
│   └── ConfidenceRating.css    # Confidence buttons, ratings
└── components/
    ├── App.js
    ├── LoadingScreen.js
    ├── ModuleList.js
    ├── ModuleDetail.js
    ├── VideoCard.js
    ├── SearchBar.js
    └── ConfidenceRating.js
```

---

## CSS Files Documentation

### 1. global.css
**Purpose**: Base styles, resets, typography

**Key Features**:
- Box-sizing reset
- Font family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system fonts
- Base body styles
- Smooth scrolling

**Notable Styles**:
```css
* { box-sizing: border-box; }
body { margin: 0; font-family: -apple-system, ...;  }
```

### 2. App.css
**Purpose**: Main application container, header, navigation menu

**Key Components**:
- `.app` - Main application wrapper
- `.app-header` - Sticky header with gradient background
- `.hamburger-menu` - Three-line menu icon
- `.dropdown-menu` - Slide-in left sidebar menu
- `.menu-overlay` - Dark overlay when menu open
- `.dark-mode-switch` - Toggle switch for theme

**Color Scheme**:
- Header gradient: `linear-gradient(135deg, #1976d2 0%, #2196f3 100%)`
- Background light: `#f5f5f5`
- Background dark: `#1a1a1a`

**Animations**:
- `fadeIn` for menu overlay
- `slideInFromLeft` for drawer menu
- Smooth 1s transitions for dark mode toggle

### 3. LoadingScreen.css
**Purpose**: Loading spinner animation

**Features**:
- Centered loading container
- Rotating spinner animation
- Blue color (#2196f3)

### 4. ModuleList.css
**Purpose**: Module grid layout, module cards, search bar

**Key Components**:
- `.modules-grid` - CSS Grid (auto-fill, minmax(280px, 1fr))
- `.module-card` - Individual module cards
- `.search-bar` - Search input styling
- Staggered `fadeInUp` animation for cards

**Grid Layout**:
```css
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

**Animation Delays**:
- Card 1: 0.05s
- Card 2: 0.1s
- Card 3: 0.15s
- Card 4: 0.2s
- Card 5: 0.25s
- Card 6: 0.3s
- Card 7+: 0.35s

### 5. ModuleDetail.css
**Purpose**: Module detail view with videos and resources

**Layout**:
```css
.detail-content {
  display: grid;
  grid-template-columns: 3fr 1fr;  /* Videos wider, resources narrower */
  gap: 30px;
}
```

**Animations**:
- `fadeIn` - General page transition
- `slideFromRight` - Next module navigation
- `slideFromLeft` - Previous module navigation

**Key Features**:
- Sticky navigation buttons
- Custom checkbox styling
- Resource cards with open buttons

### 6. VideoCard.css
**Purpose**: Individual video card styling

**Features**:
- Card layout with thumbnail placeholder
- Watch button
- Custom checkbox for completion
- Hover effects

### 7. SearchBar.css
**Purpose**: Search input field

**Features**:
- Simple input styling
- Focus states
- Border radius: 8px

### 8. ConfidenceRating.css
**Purpose**: Confidence rating buttons and display

**Current Implementation** (as of latest update):
- 5 button layout (horizontal flex)
- Compact sizing: 24px emojis, 11px labels
- Buttons: 12px/8px padding, 60px min-width
- Colored borders when selected
- Hint text below buttons

**Ratings**:
1. Need Review - 😰 - #f44336 (red)
2. Unsure - 😕 - #ff9800 (orange)
3. Okay - 😐 - #ffc107 (yellow)
4. Confident - 😊 - #4caf50 (green)
5. Mastered - 🎯 - #2196f3 (blue)

---

## Color Scheme & Design Tokens

### Primary Colors
```css
/* Blue (Primary) */
--primary-blue: #2196f3;
--primary-blue-dark: #1976d2;

/* Green (Success) */
--success-green: #4caf50;
--success-green-dark: #45a049;

/* Red (Error/Warning) */
--error-red: #f44336;

/* Orange (Caution) */
--warning-orange: #ff9800;

/* Yellow (Neutral) */
--warning-yellow: #ffc107;
```

### Neutral Colors
```css
/* Light Mode */
--bg-light: #f5f5f5;
--card-bg-light: #ffffff;
--text-light: #333;
--text-secondary-light: #666;
--border-light: #e0e0e0;

/* Dark Mode */
--bg-dark: #1a1a1a;
--card-bg-dark: #2a2a2a;
--text-dark: #e0e0e0;
--text-secondary-dark: #aaa;
--border-dark: #444;
```

### Spacing Scale
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 20px;
--spacing-xl: 30px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 30px;
```

### Typography
```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Font Sizes */
--text-xs: 11px;
--text-sm: 12px;
--text-base: 14px;
--text-md: 16px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 28px;
```

---

## Dark Mode Implementation

### Activation
Dark mode is toggled via a class `.dark-mode` added to the root element or body.

### Implementation Pattern
Each component CSS file contains:
```css
/* Light mode styles (default) */
.component { ... }

/* Dark mode overrides */
.dark-mode .component { ... }
```

### Toggle Switch (App.css:48-114)
- Custom toggle switch component
- Smooth 1s cubic-bezier transitions
- Visual feedback on hover
- Persists to localStorage (handled in App.js)

### Dark Mode Color Mappings

| Element | Light | Dark |
|---------|-------|------|
| Background | #f5f5f5 | #1a1a1a |
| Card background | #ffffff | #2a2a2a |
| Text | #333 | #e0e0e0 |
| Secondary text | #666 | #aaa |
| Borders | #e0e0e0 | #444 |
| Primary blue | #2196f3 | #64b5f6 (lighter) |

---

## Component Styling Details

### ModuleCard
- **Size**: min-width 280px, auto-fill grid
- **Padding**: 20px
- **Border**: 1px solid #e0e0e0
- **Border radius**: 12px
- **Hover**: translateY(-2px), box-shadow
- **Animation**: fadeInUp with staggered delays

### VideoCard
- **Layout**: Flex row
- **Padding**: 15px
- **Border radius**: 8px
- **Checkbox**: Custom styled, 18px × 18px
- **Hover**: Background color change

### ConfidenceRating Buttons
- **Layout**: Flex row, 5 buttons
- **Gap**: 8px between buttons
- **Padding**: 12px / 8px (vertical / horizontal)
- **Min-width**: 60px
- **Emoji size**: 24px
- **Label size**: 11px
- **Border**: 2px solid
- **Border radius**: 10px
- **Hover**: translateY(-4px), box-shadow

### Search Bar
- **Width**: 100%
- **Padding**: 12px
- **Font size**: 16px
- **Border**: 2px solid #e0e0e0
- **Border radius**: 8px
- **Focus**: Border color #2196f3

---

## Rollback Instructions

### Quick Rollback (Git)

**Option 1: Restore from backup branch**
```bash
# Switch to backup branch
git checkout backup/pre-shadcn-ui

# Create new working branch from backup
git checkout -b restore-original-styling

# Merge into main if desired
git checkout main
git merge restore-original-styling
```

**Option 2: Cherry-pick specific files**
```bash
# Restore specific file from backup
git checkout backup/pre-shadcn-ui -- src/styles/App.css

# Restore entire styles directory
git checkout backup/pre-shadcn-ui -- src/styles/
```

### Manual Rollback (File System)

**Step 1: Restore CSS files**
```bash
# Copy backed up styles back to active directory
cp -r src/styles.backup/* src/styles/
```

**Step 2: Remove shadcn/ui components**
```bash
# Remove shadcn/ui components directory
rm -rf src/components/ui/
```

**Step 3: Restore package.json**
```bash
# Check out original package.json (before Tailwind installation)
git checkout backup/pre-shadcn-ui -- package.json

# Reinstall dependencies
npm install
```

**Step 4: Restore Webpack configuration**
```bash
# Restore original webpack.config.js
git checkout backup/pre-shadcn-ui -- webpack.config.js
```

**Step 5: Remove Tailwind files**
```bash
# Remove Tailwind configuration
rm tailwind.config.js
rm postcss.config.js

# Remove jsconfig.json if added for shadcn/ui
rm jsconfig.json
```

**Step 6: Restore component imports**
```bash
# Restore original App.js and other components
git checkout backup/pre-shadcn-ui -- src/components/
```

**Step 7: Rebuild**
```bash
npm run build
npm start
```

### Partial Rollback (Keep some shadcn/ui components)

If you want to keep some shadcn/ui components but revert others:

1. **Identify components to keep** (e.g., keep Button, revert Card)
2. **Restore original component file**:
   ```bash
   git checkout backup/pre-shadcn-ui -- src/components/ModuleCard.js
   git checkout backup/pre-shadcn-ui -- src/styles/ModuleList.css
   ```
3. **Remove import of shadcn/ui component**:
   ```javascript
   // Remove: import { Card } from "@/components/ui/card"
   // Keep original implementation
   ```
4. **Rebuild and test**

### Verification Checklist

After rollback, verify:
- [ ] App builds without errors
- [ ] All modules display correctly
- [ ] Search functionality works
- [ ] Video cards display and checkboxes work
- [ ] Confidence rating works
- [ ] Dark mode toggle works
- [ ] Navigation (Next/Previous) works
- [ ] Resources open correctly
- [ ] Progress tracking persists
- [ ] Animations play smoothly

---

## Dependencies to Remove (if full rollback)

If doing a complete rollback, uninstall these packages:

```bash
npm uninstall tailwindcss postcss autoprefixer
npm uninstall @radix-ui/react-slot
npm uninstall class-variance-authority clsx tailwind-merge
npm uninstall lucide-react
npm uninstall @radix-ui/react-dialog
npm uninstall @radix-ui/react-select
# ... any other shadcn/ui dependencies added
```

---

## Notes

- **Backup branch**: `backup/pre-shadcn-ui` is immutable - do not commit to it
- **Backup directory**: `src/styles.backup/` contains exact copies of all CSS files
- **Component structure**: Original components use className with CSS modules
- **No TypeScript**: Project uses JavaScript with JSX
- **Webpack**: Uses css-loader and style-loader for CSS processing
- **Electron**: App runs in Electron with webpack bundling

---

## Support

If you encounter issues during rollback:
1. Check git log for the exact commit before shadcn/ui integration
2. Use `git diff backup/pre-shadcn-ui` to see all changes
3. Refer to this document for original styling patterns
4. Test incrementally after each restoration step

---

**Document Version**: 1.0
**Last Updated**: November 13, 2025
