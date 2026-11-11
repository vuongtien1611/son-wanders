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

function checkHeaderTags(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const match = content.match(/<header[\s\S]*?<\/header>/);
  if (!match) return { file: filename, valid: false, msg: 'No header' };
  
  const headerHtml = match[0];
  const tags = headerHtml.match(/<\/?([a-zA-Z0-9]+)[^>]*>/g) || [];
  
  const stack = [];
  const voidTags = new Set(['img', 'br', 'hr', 'input', 'meta', 'link']);
  let error = null;

  for (const tag of tags) {
    const isClosing = tag.startsWith('</');
    const tagNameMatch = tag.match(/<\/?([a-zA-Z0-9]+)/);
    if (!tagNameMatch) continue;
    const tagName = tagNameMatch[1].toLowerCase();
    
    if (voidTags.has(tagName) || tag.endsWith('/>')) {
      continue;
    }

    if (isClosing) {
      if (stack.length === 0) {
        error = `Extra closing tag: </${tagName}>`;
        break;
      } else {
        const top = stack.pop();
        if (top !== tagName) {
          error = `Mismatched closing tag: expected </${top}>, got </${tagName}>`;
          break;
        }
      }
    } else {
      stack.push(tagName);
    }
  }

  if (!error && stack.length > 0) {
    error = `Unclosed tags: ${stack.join(', ')}`;
  }

  return { file: filename, valid: !error, error };
}

const files = getAllHtmlFiles('giao-dien/website_download');
let allValid = true;
let errorCount = 0;

for (const file of files) {
  const result = checkHeaderTags(file);
  if (!result.valid) {
    console.error(`ERROR in ${file}: ${result.error}`);
    allValid = false;
    errorCount++;
  }
}

if (allValid) {
  console.log(`ALL ${files.length} HTML files have perfectly balanced, 100% valid <header> tags!`);
} else {
  console.log(`Found ${errorCount} files with errors.`);
}

