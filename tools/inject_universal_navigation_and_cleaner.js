const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Admin/Documents/sơn myhouse/giao-dien/website_download';

const universalScript = `
<script id="offline-nav-and-cleaner">
(function() {
  // 1. Remove Base44 badge continuously
  function removeB44() {
    var b = document.getElementById('base44-edit-badge');
    if (b) b.remove();
    var tags = document.querySelectorAll('a, button, div, span');
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (t.textContent && t.textContent.trim().indexOf('Edit with Base 44') !== -1) {
        var host = t.closest('#base44-edit-badge') || t.closest('.fixed') || t;
        host.remove();
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeB44);
  } else {
    removeB44();
  }
  setInterval(removeB44, 300);

  // 2. Offline file:/// safe navigation
  if (window.location.protocol !== 'file:') return;

  function resolveLocalUrl(href) {
    if (!href) return null;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return null;
    if (href.startsWith('http://') || href.startsWith('https://')) return null;

    var curPath = window.location.pathname.replace(/\\\\/g, '/');
    var isSub = /\\/(gioi-thieu|san-pham|du-an|cam-hung-mau-sac|tin-tuc|lien-he|dang-ky-dai-ly|nha-phan-phoi)\\//i.test(curPath);
    var p = isSub ? '../' : './';

    var clean = href.split('?')[0].split('#')[0];
    if (clean.startsWith('/')) clean = clean.substring(1);
    clean = clean.replace(/\\/+$/, '');

    if (clean === '' || clean === 'index.html') return p + 'index.html';
    if (clean === 'gioi-thieu') return p + 'gioi-thieu/index.html';
    if (clean === 'cam-hung-mau-sac') return p + 'cam-hung-mau-sac.html';
    if (clean === 'du-an') return p + 'du-an/index.html';
    if (clean === 'tin-tuc') return p + 'tin-tuc/index.html';
    if (clean === 'lien-he') return p + 'lien-he/index.html';
    if (clean === 'dang-ky-dai-ly') return p + 'dang-ky-dai-ly.html';
    if (clean === 'nha-phan-phoi') return p + 'nha-phan-phoi.html';
    if (clean === 'san-pham') return p + 'san-pham/index.html';

    if (clean.startsWith('san-pham/')) {
      var sub = clean.substring('san-pham/'.length);
      return p + 'san-pham/' + sub + '/index.html';
    }
    if (clean.startsWith('tin-tuc/')) {
      var sub = clean.substring('tin-tuc/'.length);
      return p + 'tin-tuc/' + sub + '/index.html';
    }
    return null;
  }

  window.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var raw = a.getAttribute('href');
    var target = resolveLocalUrl(raw);
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.href = target;
    }
  }, true);

  var origPush = history.pushState;
  history.pushState = function(state, unused, url) {
    if (url && typeof url === 'string') {
      var target = resolveLocalUrl(url);
      if (target) {
        window.location.href = target;
        return;
      }
    }
    return origPush.apply(this, arguments);
  };
})();
</script>
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove any old offline-nav-and-cleaner or previous Script 4
  content = content.replace(/<script id="offline-nav-and-cleaner">[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<script>\s*\/\/ Robust offline file:\/\/\/ navigation fix[\s\S]*?<\/script>/gi, '');

  // Add universalScript right before </head>
  if (content.includes('</head>')) {
    content = content.replace('</head>', universalScript + '\n</head>');
  } else {
    content = universalScript + '\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (item.endsWith('.html')) {
      processFile(full);
      console.log('Processed:', path.relative(rootDir, full));
    }
  }
}

walk(rootDir);
console.log('All HTML files updated with universal navigation & cleaner!');

