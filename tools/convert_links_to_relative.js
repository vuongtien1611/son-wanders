const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', 'website_download');
const routesFile = path.join(__dirname, 'routes.json');
let allRoutes = [];
if (fs.existsSync(routesFile)) {
  allRoutes = JSON.parse(fs.readFileSync(routesFile, 'utf8'));
} else {
  allRoutes = ['/', '/gioi-thieu', '/san-pham', '/du-an', '/cam-hung-mau-sac', '/tin-tuc', '/nha-phan-phoi', '/dang-ky-dai-ly', '/lien-he'];
}

function getRelativePrefix(filePath) {
  const rel = path.relative(ROOT_DIR, path.dirname(filePath));
  if (!rel || rel === '.') return './';
  const depth = rel.split(path.sep).length;
  return '../'.repeat(depth);
}

function fixLinksInFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const prefix = getRelativePrefix(filePath);

  // Regex to match href="/..."
  // But avoid href="//" (protocol-relative URLs)
  html = html.replace(/href="\/([^"#\s]*)(#[^"\s]*)?"/g, (match, urlPath, hash) => {
    // If it's manifest.json or favicon or assets
    if (urlPath === 'manifest.json' || urlPath.startsWith('assets/') || urlPath.startsWith('static/') || urlPath.startsWith('images/')) {
      return `href="${prefix}${urlPath}${hash || ''}"`;
    }
    
    // For route URLs:
    // urlPath can be:
    // "" (root '/')
    // "gioi-thieu"
    // "san-pham/son-noi-that"
    // "tin-tuc/gia-son-nha"
    // etc.
    let target = '';
    if (!urlPath || urlPath === '/') {
      target = `${prefix}index.html`;
    } else {
      const clean = urlPath.replace(/\/$/, '');
      target = `${prefix}${clean}/index.html`;
    }

    return `href="${target}${hash || ''}"`;
  });

  // Also fix any remaining src="/..." for images or static assets
  html = html.replace(/src="\/([^"\s]+)"/g, (match, srcPath) => {
    return `src="${prefix}${srcPath}"`;
  });

  // Inject a small robust offline click handler in case any dynamic element tries to navigate to an absolute path
  const offlineNavScript = `
  <script>
  // Robust offline file:/// navigation fix
  (function() {
    if (window.location.protocol !== 'file:') return;
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      if (href.startsWith('http://') || href.startsWith('https://')) return;
      
      // If href is absolute like /gioi-thieu, prevent error and navigate locally
      if (href.startsWith('/')) {
        e.preventDefault();
        var clean = href.replace(/^\\/+/, '').replace(/\\/+$/, '');
        var target = clean ? clean + '/index.html' : 'index.html';
        
        // Find path to website_download
        var loc = window.location.pathname;
        var marker = '/website_download/';
        var idx = loc.indexOf(marker);
        if (idx !== -1) {
          var base = loc.substring(0, idx + marker.length);
          window.location.href = 'file://' + base + target;
        } else {
          window.location.href = target;
        }
      }
    }, true);
  })();
  </script>
`;

  if (!html.includes('Robust offline file:/// navigation fix')) {
    html = html.replace('</head>', `${offlineNavScript}\n</head>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

function walkDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== 'images' && item !== 'assets' && item !== 'static') {
        walkDir(fullPath);
      }
    } else if (item.endsWith('.html')) {
      fixLinksInFile(fullPath);
    }
  }
}

walkDir(ROOT_DIR);
console.log('All links in all HTML files have been converted to relative paths!');
