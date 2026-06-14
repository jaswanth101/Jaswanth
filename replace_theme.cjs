const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css') || file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(targetDir);
files.push(path.join(__dirname, 'index.html'));

let changedFiles = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/#d4f534/gi, '#FFEA00');
  content = content.replace(/#8fb814/gi, '#CCAC00');
  content = content.replace(/212,\s*245,\s*52/g, '255, 234, 0');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
    changedFiles++;
  }
}
console.log('Total files updated:', changedFiles);
