const fs = require('fs');
const path = require('path');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles('giao-dien/website_download');

console.log('Total HTML files:', htmlFiles.length);

// Collect all script tags across all html files
const scriptTags = [];
const manifests = [];
const absoluteLinks = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Scripts
  const scripts = content.match(/<script[\s\S]*?<\/script>/gi) || [];
  for (const s of scripts) {
    const srcMatch = s.match(/src=["']([^"']+)["']/i);
    const typeMatch = s.match(/type=["']([^"']+)["']/i);
    const crossMatch = s.includes('crossorigin');
    if (srcMatch) {
      scriptTags.push({
        file,
        src: srcMatch[1],
        type: typeMatch ? typeMatch[1] : 'normal',
        crossorigin: crossMatch
      });
    }
  }

  // Manifest
  const manifestMatch = content.match(/<link[^>]*rel=["']manifest["'][^>]*>/i);
  if (manifestMatch) {
    manifests.push({
      file,
      tag: manifestMatch[0]
    });
  }

  // Check absolute paths starting with C: or /
  const cDriveMatch = content.match(/(?:href|src)=["'](?:[a-zA-Z]:[\\\/]|\/[a-zA-Z0-9])/gi);
  if (cDriveMatch) {
    absoluteLinks.push({
      file,
      matches: cDriveMatch.slice(0, 5)
    });
  }
}

console.log('\n--- Script tags summary ---');
const uniqueScriptSrcs = {};
scriptTags.forEach(st => {
  const key = `${st.src} (type=${st.type}, crossorigin=${st.crossorigin})`;
  uniqueScriptSrcs[key] = (uniqueScriptSrcs[key] || 0) + 1;
});
console.log(uniqueScriptSrcs);

console.log('\n--- Manifest tags summary ---');
console.log(`Found ${manifests.length} files with manifest tag:`);
const uniqueManifests = {};
manifests.forEach(m => {
  uniqueManifests[m.tag] = (uniqueManifests[m.tag] || 0) + 1;
});
console.log(uniqueManifests);

console.log('\n--- C: or root paths summary ---');
console.log(`Found ${absoluteLinks.length} files with C: or root paths:`);
if (absoluteLinks.length > 0) {
  console.log(absoluteLinks.slice(0, 5));
}

