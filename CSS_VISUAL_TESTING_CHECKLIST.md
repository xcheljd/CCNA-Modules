# CSS Consolidation - Visual Testing Checklist

**Created:** 2025-11-16
**Purpose:** Document all views/components requiring visual verification after CSS consolidation
**Related:** TASK_6_CSS_CONSOLIDATION_PLAN.md

---

## Testing Instructions

After CSS consolidation, verify each section below in:
- Light mode AND Dark mode
- Desktop view (1920x1080 or similar)
- Check all interactive states (hover, active, disabled)

---

## 1. App Shell & Global Elements

**File:** App.css (407 lines)

- [ ] App header with navigation
- [ ] View toggle buttons (Dashboard/Module List)
- [ ] Settings button
- [ ] Dark mode toggle
- [ ] Hamburger menu (if applicable)
- [ ] Overall app layout and spacing
- [ ] Loading screen animation

---

## 2. Dashboard View

**File:** Dashboard.css (452 lines)

### Overall Layout
- [ ] Dashboard grid layout
- [ ] Section spacing and alignment
- [ ] Section headers

### Test Mode Banner
- [ ] Test mode toggle button
- [ ] Test mode info message
- [ ] Warning banner styling

### Overall Progress Section
- [ ] Circular progress chart
- [ ] Progress percentage display
- [ ] Stats grid (Modules, Videos, Labs, Flashcards)
- [ ] "Continue Learning" / "Start Learning" button

### Continue Watching Card
- [ ] Card layout and hover effect
- [ ] Video title and module info
- [ ] Play button styling

### Modules Needing Review
- [ ] Review module cards
- [ ] Confidence indicator colors (red/orange/green)
- [ ] Progress indicator
- [ ] Card hover effects

### Recently Completed
- [ ] Completed module cards
- [ ] Completion badge
- [ ] Card hover effects

### Dashboard Sections Grid Pairs
- [ ] Study Streak + Learning Goals pair
- [ ] Upcoming Milestones + Smart Recommendations pair
- [ ] Continue Watching + Recently Completed pair

---

## 3. Study Streak Section

**File:** StudyStreak.css (318 lines)

- [ ] Streak header with icon
- [ ] Current streak number and label
- [ ] Longest streak display
- [ ] Streak message text
- [ ] "At risk" warning message (if applicable)
- [ ] Calendar grid layout
- [ ] Calendar day cells (empty, low, medium, high activity)
- [ ] Calendar day labels
- [ ] Activity legend

---

## 4. Learning Goals Section

**File:** Goals.css (306 lines)

### Goal Card
- [ ] Goal card layout
- [ ] Goal header with period
- [ ] Circular progress ring
- [ ] Goal stats display
- [ ] Goal action buttons

### Goal Modal
- [ ] Modal overlay
- [ ] Modal content container
- [ ] Preset selection cards
- [ ] Preset card selected state
- [ ] Preset targets display
- [ ] Form groups
- [ ] Target date input
- [ ] Modal action buttons

### No Goal State
- [ ] No goal icon
- [ ] No goal content message
- [ ] Create goal button

### Goal Metrics
- [ ] Milestone badges
- [ ] Milestone progress bars
- [ ] Milestone markers (completed, next)
- [ ] Completion prediction

---

## 5. Smart Recommendations Section

**File:** SmartRecommendations.css (193 lines)

- [ ] Recommendations list layout
- [ ] Recommendation cards (6 types: continue, next, review, quick-win, streak, related)
- [ ] Recommendation icons
- [ ] Recommendation content text
- [ ] Recommendation action buttons
- [ ] Card hover effects
- [ ] Different card types have distinct styling

---

## 6. Upcoming Milestones Section

**File:** UpcomingMilestones.css (308 lines)

- [ ] Next milestone card
- [ ] Next milestone header
- [ ] Next milestone icon
- [ ] Next milestone stats
- [ ] Milestone progress bar
- [ ] Milestone fill animation
- [ ] Upcoming modules list
- [ ] Upcoming module items
- [ ] Module number badges
- [ ] Module progress bars
- [ ] Module progress text

---

## 7. Performance Charts Section

**File:** PerformanceCharts.css (152 lines)

- [ ] Charts grid layout
- [ ] Chart cards
- [ ] Chart controls (time range buttons)
- [ ] Range button active state
- [ ] Chart descriptions
- [ ] Metric displays with progress bars
- [ ] Insights section
- [ ] Insight items with icons

---

## 8. Activity Heatmap

**File:** ActivityHeatmap.css (108 lines)

- [ ] Heatmap container layout
- [ ] Week columns
- [ ] Day cells with intensity colors (0-4)
- [ ] Cell hover effects
- [ ] Heatmap legend
- [ ] Legend cells
- [ ] Legend labels
- [ ] Activity count display

---

## 9. Module List View

**File:** ModuleList.css (712 lines)

### List Header
- [ ] Search bar with input
- [ ] Search icon
- [ ] Clear search button
- [ ] Filter controls
- [ ] Filter selects
- [ ] Clear filters button

### View Toggles
- [ ] Grid/List view toggle buttons
- [ ] Active button state

### Grid View
- [ ] Module cards in grid
- [ ] Card hover effects
- [ ] Module title
- [ ] Progress bar
- [ ] Progress text
- [ ] Module day badge

### List View
- [ ] Module cards in list
- [ ] Top row (title, day, completion checkbox)
- [ ] Bottom row (progress bar, stats)
- [ ] Checkbox styling
- [ ] Checkbox label

### Module Card States
- [ ] Default state
- [ ] Hover state
- [ ] Completed state (with badge)
- [ ] Conditional/Required badges

---

## 10. Module Detail View

**File:** ModuleDetail.css (360 lines)

### Header
- [ ] Back button
- [ ] Module title and day
- [ ] Module navigation (prev/next buttons)

### Video Section
- [ ] Video player container
- [ ] Video thumbnail
- [ ] Play overlay
- [ ] Video list
- [ ] Video items (default and active states)
- [ ] Video duration
- [ ] Completion checkboxes

### Resources Section
- [ ] Section header with checkbox
- [ ] Lab completion checkbox
- [ ] Flashcards completion checkbox
- [ ] Resource items
- [ ] Resource info text
- [ ] Open/Watch buttons
- [ ] Disabled states

### Confidence Rating
- [ ] Confidence header
- [ ] Confidence options (5 levels)
- [ ] Selected state styling
- [ ] Confidence emoji icons
- [ ] Confidence labels
- [ ] Confidence hint text
- [ ] Clear confidence button
- [ ] Compact view variant

---

## 11. Video Card Component

**File:** VideoCard.css (277 lines)

- [ ] Video card layout
- [ ] Video thumbnail container
- [ ] Play button overlay
- [ ] Video info section
- [ ] Video title
- [ ] Video duration
- [ ] Video note text
- [ ] Video loading state
- [ ] Completion badge/indicator

---

## 12. Search Bar Component

**File:** SearchBar.css (178 lines)

- [ ] Search bar container
- [ ] Search input wrapper
- [ ] Search icon
- [ ] Search input field
- [ ] Clear search button (X)
- [ ] Filter wrapper
- [ ] Filter label
- [ ] Filter select dropdown
- [ ] Input focus states
- [ ] Button hover states

---

## 13. Settings Panel

**File:** Settings.css (887 lines - largest file)

### Settings Dialog
- [ ] Settings dialog overlay
- [ ] Settings container
- [ ] Settings tabs
- [ ] Tab active state
- [ ] Tab icons
- [ ] Tab descriptions

### Tab Content Areas
- [ ] General tab
- [ ] Dashboard tab
- [ ] Data Management tab

### General Settings
- [ ] Dark mode switch
- [ ] Slider control
- [ ] Toggle states

### Dashboard Settings
- [ ] Dashboard sections list
- [ ] Section items
- [ ] Section checkboxes (default, checked, disabled states)
- [ ] Drag handle
- [ ] Drag handle dots
- [ ] Dragging state
- [ ] Drag over state
- [ ] Section info text
- [ ] Section controls

### Data Management
- [ ] Data section layout
- [ ] Path display
- [ ] Path input
- [ ] Path status indicators
- [ ] Path help text
- [ ] Data actions buttons
- [ ] Test mode toggle
- [ ] Danger zone styling
- [ ] Warning banners
- [ ] Action descriptions
- [ ] Primary/Secondary buttons

---

## 14. Confidence Rating Component

**File:** ConfidenceRating.css (169 lines)

- [ ] Confidence rating container
- [ ] Confidence header
- [ ] Confidence options grid (5 levels)
- [ ] Option selected state
- [ ] Confidence emoji icons
- [ ] Confidence labels
- [ ] Confidence hint text
- [ ] Clear confidence button
- [ ] Compact variant
- [ ] Confidence indicator

---

## 15. Global Styles

**File:** global.css (158 lines)

- [ ] CSS variables (light mode)
- [ ] CSS variables (dark mode - .dark-mode class)
- [ ] Typography (headings, body text)
- [ ] Button base styles
- [ ] Link styles
- [ ] Scrollbar styling
- [ ] Selection colors
- [ ] Focus outlines

---

## Known Duplicate Classes to Resolve

From audit on 2025-11-16:

1. **`.dark-mode`** - 14 files (MAJOR)
   - Need to ensure single definition in global.css

2. **`.milestone-progress`** - 2 files
   - Goals.css and UpcomingMilestones.css

3. **`.play-button`** - 2 files
   - Dashboard.css and VideoCard.css

4. **`.stat-label`** - 2 files
   - Dashboard.css and Goals.css

5. **`.stat-value`** - 2 files
   - Dashboard.css and Goals.css

---

## Testing Priority

**High Priority (Core Views):**
1. Dashboard view (most complex)
2. Module List (grid and list views)
3. Module Detail view
4. Dark mode toggle and all dark mode colors

**Medium Priority (Sub-components):**
5. Settings panel (largest file)
6. Study Streak
7. Learning Goals
8. Performance Charts

**Low Priority (Simple Components):**
9. Search Bar
10. Video Card
11. Confidence Rating
12. Activity Heatmap

---

## Success Criteria

After consolidation, ALL items above must:
- Render identically to pre-consolidation state
- Work in both light and dark mode
- Maintain all hover/active/disabled states
- Have no layout shifts or spacing changes
- Display all colors correctly
