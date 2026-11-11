const fs = require('fs');

const envPath = 'C:/Users/Admin/Documents/sơn myhouse/vmaxcore/.env';
if (fs.existsSync(envPath)) {
  console.log('--- .env ---');
  console.log(fs.readFileSync(envPath, 'utf8'));
} else {
  console.log('.env does not exist, checking .env.example:');
  console.log(fs.readFileSync('C:/Users/Admin/Documents/sơn myhouse/vmaxcore/.env.example', 'utf8'));
}

