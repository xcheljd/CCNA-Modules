const fs = require('fs');
const path = require('path');

const stylesDir = './src/styles';
const files = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'));

const classToFiles = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(stylesDir, file), 'utf8');
  const lines = content.split('\n');

  lines.forEach(line => {
    const match = line.match(/^\.([a-zA-Z0-9_-]+)/);
    if (match) {
      const className = match[0];
      if (!classToFiles[className]) {
        classToFiles[className] = [];
      }
      if (!classToFiles[className].includes(file)) {
        classToFiles[className].push(file);
      }
    }
  });
});

// Find duplicates
const duplicates = {};
Object.keys(classToFiles).forEach(className => {
  if (classToFiles[className].length > 1) {
    duplicates[className] = classToFiles[className];
  }
});

console.log('=== DUPLICATE CLASS DEFINITIONS ===\n');
console.log(`Total unique classes: ${Object.keys(classToFiles).length}`);
console.log(`Classes defined in multiple files: ${Object.keys(duplicates).length}\n`);

if (Object.keys(duplicates).length > 0) {
  console.log('CONFLICTS TO RESOLVE:\n');
  Object.keys(duplicates)
    .sort()
    .forEach(className => {
      console.log(`${className}:`);
      duplicates[className].forEach(file => console.log(`  - ${file}`));
      console.log('');
    });
} else {
  console.log('✅ No duplicate class definitions found!');
}
