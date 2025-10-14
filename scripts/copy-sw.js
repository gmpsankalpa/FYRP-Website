const fs = require('fs');
const path = require('path');

// Copy service worker to build directory
const src = path.join(__dirname, '../src/service-worker.js');
const dest = path.join(__dirname, '../build/service-worker.js');

try {
  fs.copyFileSync(src, dest);
  console.log('✅ Service Worker copied to build directory');
} catch (error) {
  console.error('❌ Error copying Service Worker:', error);
  process.exit(1);
}
