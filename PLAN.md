### Final Full Plan: Portable CCNA Module Desktop App

#### Overview

A self-contained, portable Electron-based desktop app for Jeremy's IT Lab CCNA 200-301 course. Runs entirely on-device with no external hosting. Connects to YouTube for video embeds; detects local /resources/ folder for labs/flashcards. Tracks progress offline. Device-independent via cross-platform executables.

#### Tech Stack

- **Framework**: Electron (desktop wrapper; React frontend, Node.js backend bundled).
- **Frontend**: React.js (videos, progress, resources); YouTube Player API for embeds/controls.
- **Backend**: Node.js/Express (local API for progress/resources); local storage (JSON/NeDB).
- **Packaging**: Electron Builder for portable executables (Windows/Mac/Linux); /resources/ folder external.
- **Video Handling**: Direct YouTube embeds (internet required for videos).
- **Other**: No hosting; progress/data in local files.

#### Key Features

- **Video Modules**: YouTube embeds grouped by day (~63 days, some with 2-4 videos). Save watch progress (timestamp) locally for resume.
- **Progress Tracking**: Per-video (watch %), per-module (videos + resources %), overall %. Honor-system for labs (mark complete) and flashcards (added/used in Anki); stored locally.
- **Resources**: Detect /resources/ folder; open .pkt in Packet Tracer, .apkg in Anki. If missing, guide user to download from Jeremy's Drive.
- **User Dashboard**: Module list with progress bars, thumbnails; "Continue Watching"; search/filter.
- **Portability**: Single executable; runs from USB; no installation; offline for progress/resources.

#### Architecture & Data Flow

- **Bundling**: Electron packages app; /resources/ external.
- **User Flow**: Launch app → Check /resources/ → If missing: Show download instructions → User sets up → Relaunch → Select module → Watch YouTube videos (resume) → Open resources in external apps → Confirm usage → Update local progress.
- **Data Handling**: Progress in local JSON; resources via file paths.
- **Offline Aspects**: Progress/resources work offline; videos need internet.

#### Development Phases

1. **Setup**: Electron + React project; implement /resources/ detection.
2. **Core Features**: YouTube embedding with progress saving; resource opening.
3. **UI/UX**: Module views, dashboards, confirmations.
4. **Integration**: Test with Packet Tracer/Anki; handle missing resources.
5. **Packaging**: Build/portable executables; cross-platform testing.

#### Challenges & Mitigations

- **Connectivity**: Handle no internet (offline message for videos).
- **Resource Setup**: Clear instructions; assume correct downloads.
- **Portability**: Ensure executable runs on target OS; manage paths.
- **Updates**: Manual app/resource updates.
- **Legal**: Comply with YouTube terms; credit Jeremy's IT Lab.
- **Performance**: Optimize embeds; local storage for progress.

#### Next Steps

- **Prototype**: Electron setup; test YouTube API and file detection.
- **Data Prep**: Video-resource mappings; validate /resources/ structure.
- **Implementation**: Begin coding once plan mode ends.
