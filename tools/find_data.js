const fs = require('fs');
const code = fs.readFileSync('index-BG3fZPr5.js', 'utf8');

// Check for slug mentions or mock data
const slugs = [...code.matchAll(/slug\s*:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Slugs found with slug: "..." :', [...new Set(slugs)]);

// Check for product or project items
// Look for strings like "san-pham/" or "du-an/" or "tin-tuc/"
const linkMatches = [...code.matchAll(/["'](\/(?:san-pham|du-an|tin-tuc)\/[^"']+)["']/g)].map(m => m[1]);
console.log('Explicit route links:', [...new Set(linkMatches)]);

// Check if base44 entities or APIs are queried
const entities = [...code.matchAll(/base44\.entities\.([a-zA-Z0-9_]+)/g)].map(m => m[1]);
console.log('Base44 entities:', [...new Set(entities)]);

const apiCalls = [...code.matchAll(/["'](\/api\/[^"']+)["']/g)].map(m => m[1]);
console.log('API calls:', [...new Set(apiCalls)]);
