const fs = require('fs');

const targets = [
  'giao-dien/website_download/bang-mau.html',
  'giao-dien/website_download/bang-mau/index.html',
  'giao-dien/website_download/cam-hung-mau-sac.html',
  'giao-dien/website_download/cam-hung-mau-sac/index.html'
];

targets.forEach(t => {
  let html = fs.readFileSync(t, 'utf8');
  // Find the old script block that has 'aside p.text-[15px]' or 'const paletteData = ['
  const oldScriptStart = html.indexOf('<script>\n    document.addEventListener(\'DOMContentLoaded\', () => {\n      const paletteData = [');
  if (oldScriptStart !== -1) {
    const oldScriptEnd = html.indexOf('</script>', oldScriptStart) + 9;
    html = html.substring(0, oldScriptStart) + html.substring(oldScriptEnd);
    fs.writeFileSync(t, html, 'utf8');
    console.log('Removed obsolete script from:', t);
  } else {
    // try looser match
    const altStart = html.indexOf('const previewBox = document.querySelector');
    if (altStart !== -1) {
      const scriptOpen = html.lastIndexOf('<script', altStart);
      const scriptClose = html.indexOf('</script>', altStart) + 9;
      html = html.substring(0, scriptOpen) + html.substring(scriptClose);
      fs.writeFileSync(t, html, 'utf8');
      console.log('Removed obsolete script (loose match) from:', t);
    }
  }
});

