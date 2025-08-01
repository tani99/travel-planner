const fs = require('fs');

const content = fs.readFileSync('App.js', 'utf8');
if (content.includes('Welcome')) {
  console.log('Test passed');
} else {
  console.error('App.js does not contain "Welcome"');
  process.exit(1);
}
