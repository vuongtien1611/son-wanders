const fs = require('fs');

function explore(dir, depth = 0) {
  if (depth > 3) return;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    console.log(' '.repeat(depth * 2) + (item.isDirectory() ? '[DIR] ' : '') + item.name);
    if (item.isDirectory()) {
      explore(dir + '/' + item.name, depth + 1);
    }
  }
}

explore('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/resources');

