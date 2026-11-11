const fs = require('fs');

const routes = fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/routes/web.php', 'utf8');
const lines = routes.split('\n');
console.log('Total lines in web.php:', lines.length);

// Print lines matching Route::
lines.forEach((l, i) => {
  if (l.includes('Route::') || l.includes('prefix') || l.includes('group')) {
    console.log(`${i + 1}: ${l.trim()}`);
  }
});

