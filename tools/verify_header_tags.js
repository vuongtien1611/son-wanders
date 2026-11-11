const fs = require('fs');

function checkHeaderTags(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const match = content.match(/<header[\s\S]*?<\/header>/);
  if (!match) return console.log(`${filename}: No header`);
  
  const headerHtml = match[0];
  const tags = headerHtml.match(/<\/?([a-zA-Z0-9]+)[^>]*>/g) || [];
  
  const stack = [];
  const voidTags = new Set(['img', 'br', 'hr', 'input', 'meta', 'link']);
  let error = false;

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
        console.log(`[${filename}] Extra closing tag: </${tagName}>`);
        error = true;
      } else {
        const top = stack.pop();
        if (top !== tagName) {
          console.log(`[${filename}] Mismatched closing tag: expected </${top}>, got </${tagName}>`);
          error = true;
        }
      }
    } else {
      stack.push(tagName);
    }
  }

  if (stack.length > 0) {
    console.log(`[${filename}] Unclosed tags: ${stack.join(', ')}`);
    error = true;
  }
  if (!error) {
    console.log(`[${filename}] Tags are balanced!`);
  }
}

checkHeaderTags('giao-dien/website_download/index.html');
checkHeaderTags('giao-dien/website_download/cam-hung-mau-sac.html');
checkHeaderTags('giao-dien/website_download/gioi-thieu/index.html');

