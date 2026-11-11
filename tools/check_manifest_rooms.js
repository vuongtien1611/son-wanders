const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('giao-dien/website_download/images/base44/manifest.json', 'utf8'));

for (let url in manifest) {
  const item = manifest[url];
  const local = item.localPath || item;
  if (/8099d7d28|7f7b7d76e|85e7f93c0|edf841af7|08867f386|7266e0bc1|0cff00e0d|699adaa7a|d46ca89f2/.test(local)) {
    console.log(local, '->', url);
  }
}

