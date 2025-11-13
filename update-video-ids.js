// Script to update video IDs in modules.js from ccna_videos.md
const fs = require('fs');
const path = require('path');

// Read ccna_videos.md and parse video IDs
const videosMd = fs.readFileSync(path.join(__dirname, 'ccna_videos.md'), 'utf8');
const lines = videosMd.split('\n');

// Map day -> array of video IDs
const videoMap = {};

lines.forEach(line => {
  const match = line.match(
    /\|\s+\*\*(\d+)\*\*\s+\|.*\|\s+<https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)>/
  );
  if (match) {
    const day = parseInt(match[1]);
    const videoId = match[2];

    if (!videoMap[day]) {
      videoMap[day] = [];
    }
    videoMap[day].push(videoId);
  }
});

console.log('Parsed video IDs for', Object.keys(videoMap).length, 'days');

// Read modules.js
let modulesJs = fs.readFileSync(path.join(__dirname, 'src/data/modules.js'), 'utf8');

// Replace PLACEHOLDER with actual IDs
let replacements = 0;
Object.keys(videoMap).forEach(day => {
  const dayNum = parseInt(day);
  const videoIds = videoMap[day];

  videoIds.forEach((id, index) => {
    // Find and replace PLACEHOLDER in sequence for each day
    const placeholderRegex = new RegExp(`(day: ${dayNum}[\\s\\S]*?)id: 'PLACEHOLDER'`, 'g');
    const match = modulesJs.match(placeholderRegex);
    if (match && match.length > index) {
      modulesJs = modulesJs
        .replace(`(day: ${dayNum}`, `(day: ${dayNum}`)
        .replace(/id: 'PLACEHOLDER'/, `id: '${id}'`);
      replacements++;
    }
  });
});

console.log(`Made ${replacements} replacements`);
console.log('Writing updated modules.js...');

// Write back
fs.writeFileSync(path.join(__dirname, 'src/data/modules.js'), modulesJs, 'utf8');
console.log('Done!');
