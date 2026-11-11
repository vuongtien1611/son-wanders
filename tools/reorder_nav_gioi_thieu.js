const fs = require('fs');
const path = require('path');

const ROOT = 'giao-dien/website_download';

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

function reorderAnchorsInBlock(blockHtml) {
  const linkRegex = /<a\b[^>]*>[\s\S]*?<\/a>/g;
  const matches = [];
  let m;
  while ((m = linkRegex.exec(blockHtml)) !== null) {
    matches.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  if (matches.length < 2) return { changed: false, html: blockHtml };

  const spIdx = matches.findIndex(x => /san-pham/i.test(x.text) && /Sản phẩm/i.test(x.text));
  const gtIdx = matches.findIndex(x => /gioi-thieu/i.test(x.text) && /Giới thiệu/i.test(x.text));

  if (spIdx === -1 || gtIdx === -1 || gtIdx < spIdx) {
    return { changed: false, html: blockHtml };
  }

  // Reorder the array of anchor tags: move gtIdx before spIdx, keeping separator slots in place
  const texts = matches.map(x => x.text);
  const gtText = texts.splice(gtIdx, 1)[0];
  texts.splice(spIdx, 0, gtText);

  let out = '';
  let cursor = 0;
  for (let i = 0; i < matches.length; i++) {
    out += blockHtml.slice(cursor, matches[i].start) + texts[i];
    cursor = matches[i].end;
  }
  out += blockHtml.slice(cursor);
  return { changed: true, html: out };
}

function reorderListItemsInFooter(blockHtml) {
  const liRegex = /<li\b[^>]*>[\s\S]*?<\/li>/g;
  const matches = [];
  let m;
  while ((m = liRegex.exec(blockHtml)) !== null) {
    matches.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  if (matches.length < 2) return { changed: false, html: blockHtml };

  const spIdx = matches.findIndex(x => /san-pham/i.test(x.text) && /Sản phẩm/i.test(x.text));
  const gtIdx = matches.findIndex(x => /gioi-thieu/i.test(x.text) && /Giới thiệu/i.test(x.text));

  if (spIdx === -1 || gtIdx === -1 || gtIdx < spIdx) {
    return { changed: false, html: blockHtml };
  }

  const texts = matches.map(x => x.text);
  const gtText = texts.splice(gtIdx, 1)[0];
  texts.splice(spIdx, 0, gtText);

  let out = '';
  let cursor = 0;
  for (let i = 0; i < matches.length; i++) {
    out += blockHtml.slice(cursor, matches[i].start) + texts[i];
    cursor = matches[i].end;
  }
  out += blockHtml.slice(cursor);
  return { changed: true, html: out };
}

const files = walk(ROOT);
let updatedCount = 0;

for (const file of files) {
  const orig = fs.readFileSync(file, 'utf8');
  let next = orig;
  let fileChanged = false;

  // 1. Reorder inside all <nav ...>...</nav>
  next = next.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/g, (navBlock) => {
    const res = reorderAnchorsInBlock(navBlock);
    if (res.changed) fileChanged = true;
    return res.html;
  });

  // 2. Reorder inside footer Menu <ul>...</ul>
  next = next.replace(/<ul\b[^>]*>[\s\S]*?<\/ul>/g, (ulBlock) => {
    const res = reorderListItemsInFooter(ulBlock);
    if (res.changed) fileChanged = true;
    return res.html;
  });

  if (fileChanged && next !== orig) {
    fs.writeFileSync(file, next, 'utf8');
    updatedCount++;
    console.log('Updated:', file);
  }
}

console.log(`Total files scanned: ${files.length}, updated: ${updatedCount}`);

