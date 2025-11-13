// Script to help generate modules.js from resources folder
// Run with: node generate-modules.js

const fs = require('fs');
const path = require('path');

const resourcesPath = path.join(__dirname, 'resources');
const files = fs.readdirSync(resourcesPath);

// Group files by day
const dayMap = {};

files.forEach(file => {
  const match = file.match(/^Day (\d+)/);
  if (match) {
    const day = parseInt(match[1]);
    if (!dayMap[day]) {
      dayMap[day] = { labs: [], flashcards: [] };
    }

    if (file.includes('.pkt')) {
      dayMap[day].labs.push(file);
    } else if (file.includes('.apkg')) {
      dayMap[day].flashcards.push(file);
    }
  }
});

// Generate module structure
const days = Object.keys(dayMap).sort((a, b) => a - b);

console.log('// Add these to modules.js:\n');

days.slice(10).forEach(day => {
  // Skip first 10 (already added)
  const dayNum = parseInt(day);
  const resources = dayMap[day];

  const module = {
    id: dayNum,
    day: dayNum,
    title: `Day ${dayNum}`, // TODO: Add proper title
    videos: [{ id: 'PLACEHOLDER', title: 'Video Title', duration: '00:00' }],
    resources: {
      lab: resources.labs[0] || null,
      flashcards: resources.flashcards[0] || null,
    },
  };

  console.log(`  {`);
  console.log(`    id: ${module.id},`);
  console.log(`    day: ${module.day},`);
  console.log(`    title: '${module.title}', // TODO: Add proper title`);
  console.log(`    videos: [{ id: 'PLACEHOLDER', title: 'TODO', duration: '00:00' }],`);
  console.log(`    resources: {`);
  console.log(`      lab: ${module.resources.lab ? `'${module.resources.lab}'` : 'null'},`);
  console.log(
    `      flashcards: ${module.resources.flashcards ? `'${module.resources.flashcards}'` : 'null'},`
  );
  console.log(`    },`);
  console.log(`  },`);
});

console.log('\nTotal days found:', days.length);
