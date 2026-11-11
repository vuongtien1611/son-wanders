const fs = require('fs');
const path = require('path');

async function main() {
  const baseUrl = 'https://my-hour-home.base44.app';
  console.log('Fetching homepage...');
  const htmlRes = await fetch(baseUrl);
  const html = await htmlRes.text();
  
  console.log('HTML length:', html.length);
  
  // Extract scripts and links
  const scriptSrcs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
  const linkHrefs = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
  
  console.log('Script sources:', scriptSrcs);
  console.log('Link hrefs:', linkHrefs);
  
  // Find JS bundle
  const jsFiles = scriptSrcs.filter(s => s.endsWith('.js') || s.includes('.js?'));
  for (const js of jsFiles) {
    const fullJsUrl = js.startsWith('http') ? js : new URL(js, baseUrl).href;
    console.log('Fetching JS:', fullJsUrl);
    try {
      const res = await fetch(fullJsUrl);
      const code = await res.text();
      console.log(`Downloaded ${js}: ${code.length} bytes`);
      
      // Look for chunks or assets
      const assetMatches = [...code.matchAll(/["'](\/assets\/[^"']+)["']/g)].map(m => m[1]);
      console.log('Asset matches in JS:', [...new Set(assetMatches)]);
      
      // Look for route paths (React Router or similar)
      const routePaths = [...code.matchAll(/path\s*:\s*["']([^"']+)["']/g)].map(m => m[1]);
      console.log('Route paths (path: "..."):', [...new Set(routePaths)]);
      
      // Look for routes in base44 app (e.g. pages, navigation)
      const pageMatches = [...code.matchAll(/["']\/([a-zA-Z0-9_\-\/]+)["']/g)].map(m => m[1]);
      const potentialPages = [...new Set(pageMatches)].filter(p => !p.startsWith('assets') && !p.startsWith('api') && !p.includes('.'));
      console.log('Potential page slugs:', potentialPages.slice(0, 30));
    } catch (e) {
      console.error('Error fetching JS:', e);
    }
  }
}

main().catch(console.error);
